class Usuario {
    constructor() {
        const data = localStorage.getItem('usuarioLogueado');
        if (!data) { window.location.href = 'login.html'; return; }
        this.info = JSON.parse(data);
        
        if (!this.info.numeroCuenta) this.info.numeroCuenta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        if (!this.info.interesCredito) this.info.interesCredito = 0.03;
    }

    guardar() {
        localStorage.setItem('usuarioLogueado', JSON.stringify(this.info));
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const index = clientes.findIndex(c => c.email === this.info.email);
        if (index !== -1) {
            clientes[index] = this.info;
            localStorage.setItem('clientes', JSON.stringify(clientes));
        }
    }

    registrarMovimiento(tipo, monto, metodo) {
        this.info.movimientos.push({
            tipo,
            monto,
            metodo: metodo || 'General',
            fecha: new Date().toLocaleDateString()
        });
        this.guardar();
    }
}

class Dashboard {
    constructor() {
        this.user = new Usuario();
        this.init();
    }

    init() {
        this.vincularEventos();
        this.actualizarInterfaz();
    }

    vincularEventos() {
        document.getElementById('btnProcesarConsignacion').onclick = () => {
            const monto = parseFloat(document.getElementById('montoConsignar').value);
            if (monto > 0) {
                this.user.info.productos.debito.saldo += monto;
                this.user.registrarMovimiento("Ingreso en cajero", monto, "Débito");
                this.cerrarModales();
                this.actualizarInterfaz();
            }
        };

        document.getElementById('btnProcesarTransferencia').onclick = () => {
            const ctaDestino = document.getElementById('cuentaDestino').value;
            const monto = parseFloat(document.getElementById('montoTransferir').value);
            this.procesarTransferencia(ctaDestino, monto);
        };

        document.getElementById('btnActualizarPerfil').onclick = () => {
            this.actualizarPerfil();
        };

        document.getElementById('btnProcesarCompra').onclick = () => this.compraCredito();
        document.getElementById('btnPagarDeuda').onclick = () => this.abonoCredito();
        document.getElementById('btnCancelarCredito').onclick = () => this.cancelarCredito();

        document.getElementById('btnPedirCredito').onclick = () => this.pedirCredito();
        document.getElementById('btnPedirCorriente').onclick = () => this.pedirCorriente();

        document.getElementById('btnGuardarInteres').onclick = () => {
            const intVal = parseFloat(document.getElementById('inputInteres').value);
            if (intVal >= 0) {
                this.user.info.interesCredito = intVal / 100;
                this.user.guardar();
                this.cerrarModales();
                alert(`Política actualizada al ${intVal}% mensual.`);
            }
        };

        document.getElementById('btnCerrarSesion').onclick = () => {
            localStorage.removeItem('usuarioLogueado');
            window.location.href = 'login.html';
        };
    }

    actualizarInterfaz() {
        const u = this.user.info;
        document.getElementById('txtNombreHeader').textContent = u.firstName;
        document.getElementById('txtMiCuenta').textContent = u.numeroCuenta;

        const saldoDebito = u.productos.debito.saldo || 0;
        const saldoCorriente = u.productos.corriente ? u.productos.corriente.saldo : 0;
        document.getElementById('txtSaldoTotal').textContent = `$${(saldoDebito + saldoCorriente).toLocaleString('es-CO')}`;

        const contenedor = document.getElementById('contenedorTarjetas');
        contenedor.innerHTML = '';

        contenedor.innerHTML += this.generarHTMLTarjeta('Débito', u.productos.debito.numero, u.productos.debito.saldo, 'card-debito', false);

        if (u.productos.credito) {
            document.getElementById('btnPedirCredito').style.display = 'none';
            const txtDeuda = document.getElementById('txtDeudaActual');
            if (txtDeuda) txtDeuda.textContent = `$${u.productos.credito.deuda.toLocaleString('es-CO')}`;
            contenedor.innerHTML += this.generarHTMLTarjeta('Crédito', u.productos.credito.numero, u.productos.credito.cupoDisponible, 'card-credito', true);
        } else {
            document.getElementById('btnPedirCredito').style.display = 'block';
        }

        if (u.productos.corriente) {
            document.getElementById('btnPedirCorriente').style.display = 'none';
            contenedor.innerHTML += `
                <div class="banco-card card-corriente mb-2">
                    <div class="card-type text-dark"><i class="bi bi-journal-check"></i> Cta. Corriente</div>
                    <div class="card-number text-dark">N° ${u.productos.corriente.numero}</div>
                    <div class="d-flex justify-content-between align-items-end mt-2">
                        <div class="card-balance text-success">$${u.productos.corriente.saldo.toLocaleString('es-CO')}</div>
                        <button class="btn btn-sm btn-outline-danger" onclick="dashboard.cancelarCorriente()">Cancelar Cuenta</button>
                    </div>
                </div>`;
        } else {
            document.getElementById('btnPedirCorriente').style.display = 'block';
        }

        this.renderizarMovimientos();
        this.cargarDatosPerfil();
    }

    generarHTMLTarjeta(tipo, numero, saldo, claseCss, esCredito) {
        let btnAccion = esCredito ? `<button class="btn btn-sm btn-light mt-2 text-dark w-100 fw-bold" onclick="abrirModal('modalCredito')">Gestionar Crédito</button>` : '';
        let labelSaldo = esCredito ? 'Cupo Disponible' : 'Saldo';
        return `
            <div class="banco-card ${claseCss} mb-2">
                <div class="card-type">${tipo}</div>
                <div class="card-number">${numero}</div>
                <div class="card-details">
                    <div class="text-end w-100">
                        <span>${labelSaldo}</span>
                        <div class="card-balance">$${saldo.toLocaleString('es-CO')}</div>
                    </div>
                </div>
                ${btnAccion}
            </div>`;
    }

    renderizarMovimientos() {
        const lista = document.getElementById('listaMovimientos');
        lista.innerHTML = '';
        const movs = [...this.user.info.movimientos].reverse().slice(0, 10);
        if (movs.length === 0) return lista.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay movimientos</td></tr>';

        movs.forEach(mov => {
            const esIngreso = mov.tipo.includes('Ingreso') || mov.tipo.includes('recibida');
            lista.innerHTML += `
                <tr>
                    <td class="text-muted small">${mov.fecha}</td>
                    <td class="fw-bold">${mov.tipo}</td>
                    <td><span class="badge-metodo">${mov.metodo || 'General'}</span></td>
                    <td class="text-end ${esIngreso ? 'text-success' : 'text-danger'} fw-bold">
                        ${esIngreso ? '+' : '-'}$${mov.monto.toLocaleString('es-CO')}
                    </td>
                </tr>`;
        });
    }

    pedirCredito() {
        const cupo = 2000000;
        this.user.info.productos.credito = { activa: true, numero: '5500 1234 5678 9012', cupoTotal: cupo, cupoDisponible: cupo, deuda: 0 };
        this.user.guardar(); this.actualizarInterfaz();
    }

    pedirCorriente() {
        this.user.info.productos.corriente = { activa: true, numero: '99' + Math.floor(10000000 + Math.random() * 90000000).toString(), saldo: 0 };
        this.user.guardar(); this.actualizarInterfaz();
    }

    cancelarCorriente() {
        if (confirm('¿Deseas cancelar la Cuenta Corriente? El saldo pasará a Débito.')) {
            const saldo = this.user.info.productos.corriente.saldo;
            this.user.info.productos.debito.saldo += saldo;
            this.user.info.productos.corriente = null;
            if (saldo > 0) this.user.registrarMovimiento("Traslado por cancelación Cta. Corriente", saldo, "Débito");
            this.user.guardar(); this.actualizarInterfaz();
        }
    }

    compraCredito() {
        let monto = parseFloat(document.getElementById('montoCompra').value);
        let cuotas = parseInt(document.getElementById('cuotasCompra').value);
        if (isNaN(monto) || monto <= 0 || isNaN(cuotas)) return alert('Datos inválidos');
        if (monto > this.user.info.productos.credito.cupoDisponible) return alert('Cupo insuficiente');

        let totalInteres = monto + (monto * this.user.info.interesCredito * cuotas);
        this.user.info.productos.credito.cupoDisponible -= monto;
        this.user.info.productos.credito.deuda += totalInteres;
        this.user.registrarMovimiento(`Compra a ${cuotas} cuotas`, totalInteres, "Crédito");
        this.cerrarModales(); this.actualizarInterfaz();
    }

    abonoCredito() {
        let monto = parseFloat(document.getElementById('montoAbono').value);
        if (isNaN(monto) || monto <= 0 || monto > this.user.info.productos.debito.saldo) return alert('Fondos insuficientes o monto inválido');
        
        if (monto > this.user.info.productos.credito.deuda) monto = this.user.info.productos.credito.deuda;

        this.user.info.productos.debito.saldo -= monto;
        this.user.info.productos.credito.deuda -= monto;
        this.user.info.productos.credito.cupoDisponible += monto;
        if (this.user.info.productos.credito.cupoDisponible > this.user.info.productos.credito.cupoTotal) 
            this.user.info.productos.credito.cupoDisponible = this.user.info.productos.credito.cupoTotal;

        this.user.registrarMovimiento("Abono a Tarjeta de Crédito", monto, "Débito");
        this.cerrarModales(); this.actualizarInterfaz();
    }

    cancelarCredito() {
        if (this.user.info.productos.credito.deuda > 0) return alert('Debes estar a PAZ Y SALVO para cancelar.');
        if (confirm('¿Cancelar tarjeta de crédito?')) {
            this.user.info.productos.credito = null;
            this.user.guardar(); this.actualizarInterfaz(); this.cerrarModales();
        }
    }

    procesarTransferencia(cuentaDestino, monto) {
        if (!cuentaDestino || isNaN(monto) || monto <= 0) return alert('Datos inválidos');
        if (cuentaDestino === this.user.info.numeroCuenta) return alert('No puedes transferirte a ti mismo');
        if (this.user.info.productos.debito.saldo < monto) return alert('Fondos insuficientes');

        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        let indexDestino = clientes.findIndex(c => c.numeroCuenta === cuentaDestino);
        if (indexDestino === -1) return alert('La cuenta no existe');

        this.user.info.productos.debito.saldo -= monto;
        this.user.registrarMovimiento(`Transferencia a Cta ${cuentaDestino}`, monto, "Débito");

        clientes[indexDestino].productos.debito.saldo += monto;
        if (!clientes[indexDestino].movimientos) clientes[indexDestino].movimientos = [];
        clientes[indexDestino].movimientos.push({
            tipo: `Transferencia recibida de ${this.user.info.firstName}`,
            monto: monto, metodo: 'Débito', fecha: new Date().toLocaleDateString()
        });

        localStorage.setItem('clientes', JSON.stringify(clientes));
        this.cerrarModales(); this.actualizarInterfaz();
        alert('Transferencia exitosa');
    }

    cargarDatosPerfil() {
        document.getElementById('perfilNombre').value = this.user.info.firstName;
        document.getElementById('perfilApellido').value = this.user.info.lastName || "";
    }

    actualizarPerfil() {
        const nom = document.getElementById('perfilNombre').value;
        const ape = document.getElementById('perfilApellido').value;
        const pass = document.getElementById('perfilPass').value;

        if (!nom) return alert("El nombre es obligatorio");
        this.user.info.firstName = nom;
        this.user.info.lastName = ape;
        if (pass.trim() !== "") this.user.info.password = pass;

        this.user.guardar();
        this.cerrarModales();
        this.actualizarInterfaz();
        alert("Perfil actualizado");
    }

    cerrarModales() {
        const modales = document.querySelectorAll('.modal.show');
        modales.forEach(m => {
            const instancia = bootstrap.Modal.getInstance(m);
            if (instancia) instancia.hide();
        });
    }
}

let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
    window.abrirModal = (id) => {
        const modal = new bootstrap.Modal(document.getElementById(id));
        modal.show();
    };
});