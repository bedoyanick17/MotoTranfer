const usuarioLogueadoStr = localStorage.getItem('usuarioLogueado');
if (!usuarioLogueadoStr) { 
    window.location.href = 'login.html'; 
}

// Declaramos miUsuario de forma global para que los demás scripts puedan acceder a ella
let miUsuario = JSON.parse(usuarioLogueadoStr);

if (!miUsuario.numeroCuenta) miUsuario.numeroCuenta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
if (!miUsuario.interesCredito) miUsuario.interesCredito = 0.03;


// ==========================================
// 2. FUNCIONES GLOBALES
// ==========================================
window.abrirModal = function(idModal) {
    const modal = new bootstrap.Modal(document.getElementById(idModal));
    modal.show();
};

function cerrarModales() {
    if (document.activeElement) {
        document.activeElement.blur();
    }

    const modales = document.querySelectorAll('.modal.show');
    modales.forEach(modal => {
        const instancia = bootstrap.Modal.getInstance(modal);
        if (instancia) instancia.hide();
    });
}

function guardarCambios() {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let index = clientes.findIndex(c => c.email === miUsuario.email);
    if (index !== -1) {
        clientes[index] = miUsuario;
        localStorage.setItem('clientes', JSON.stringify(clientes));
        localStorage.setItem('usuarioLogueado', JSON.stringify(miUsuario));
    }
}

function generarHTMLTarjeta(tipo, numero, saldo, claseCss, esCredito) {
    let btnAccion = esCredito ? `<button class="btn btn-sm btn-light mt-2 text-dark w-100" onclick="abrirModal('modalCredito')">Gestionar Crédito</button>` : '';
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
        </div>
    `;
}

function renderizarMovimientos() {
    const listaMovimientos = document.getElementById('listaMovimientos');
    listaMovimientos.innerHTML = '';
    const movs = [...miUsuario.movimientos].reverse().slice(0, 10);
    if (movs.length === 0) return listaMovimientos.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay movimientos</td></tr>';

    movs.forEach(mov => {
        const esIngreso = mov.tipo.includes('Ingreso') || mov.tipo.includes('recibida');
        const colorValor = esIngreso ? 'text-success' : 'text-danger';
        listaMovimientos.innerHTML += `
            <tr>
                <td class="text-muted small">${mov.fecha}</td>
                <td class="fw-bold">${mov.tipo}</td>
                <td><span class="badge-metodo">${mov.metodo || 'General'}</span></td>
                <td class="text-end ${colorValor} fw-bold">${esIngreso ? '+' : '-'}$${mov.monto.toLocaleString('es-CO')}</td>
            </tr>
        `;
    });
}

function actualizarInterfaz() {
    document.getElementById('txtNombreHeader').textContent = miUsuario.firstName;
    document.getElementById('txtMiCuenta').textContent = miUsuario.numeroCuenta;

    let saldoDebito = miUsuario.productos.debito.saldo || 0;
    let saldoCorriente = miUsuario.productos.corriente ? miUsuario.productos.corriente.saldo : 0;
    document.getElementById('txtSaldoTotal').textContent = `$${(saldoDebito + saldoCorriente).toLocaleString('es-CO')}`;

    const contenedorTarjetas = document.getElementById('contenedorTarjetas');
    contenedorTarjetas.innerHTML = '';

    contenedorTarjetas.innerHTML += generarHTMLTarjeta('Débito', miUsuario.productos.debito.numero, miUsuario.productos.debito.saldo, 'card-debito', false);

    if (miUsuario.productos.credito) {
        document.getElementById('btnPedirCredito').style.display = 'none';
        document.getElementById('txtDeudaActual').textContent = `$${miUsuario.productos.credito.deuda.toLocaleString('es-CO')}`;
        contenedorTarjetas.innerHTML += generarHTMLTarjeta('Crédito', miUsuario.productos.credito.numero, miUsuario.productos.credito.cupoDisponible, 'card-credito', true);
    } else {
        document.getElementById('btnPedirCredito').style.display = 'block';
    }

    if (miUsuario.productos.corriente) {
        document.getElementById('btnPedirCorriente').style.display = 'none';
        contenedorTarjetas.innerHTML += `
            <div class="banco-card card-corriente mb-2">
                <div class="card-type text-dark"><i class="bi bi-journal-check"></i> Cta. Corriente</div>
                <div class="card-number text-dark">N° ${miUsuario.productos.corriente.numero}</div>
                <div class="d-flex justify-content-between align-items-end mt-2">
                    <div class="card-balance text-success">$${miUsuario.productos.corriente.saldo.toLocaleString('es-CO')}</div>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarCorriente()">Cancelar Cuenta</button>
                </div>
            </div>
        `;
    } else {
        document.getElementById('btnPedirCorriente').style.display = 'block';
    }

    renderizarMovimientos();
}


document.addEventListener('DOMContentLoaded', () => {
    
    actualizarInterfaz();

    document.getElementById('btnProcesarConsignacion').addEventListener('click', () => {
        let monto = parseFloat(document.getElementById('montoConsignar').value);
        if(monto > 0) {
            miUsuario.productos.debito.saldo += monto;
            miUsuario.movimientos.push({ tipo: `Ingreso en cajero`, monto: monto, metodo: 'Débito', fecha: new Date().toLocaleDateString() });
            guardarCambios(); cerrarModales(); actualizarInterfaz();
        }
    });

    document.getElementById('btnGuardarInteres').addEventListener('click', () => {
        let interesForm = parseFloat(document.getElementById('inputInteres').value);
        if(interesForm >= 0) {
            miUsuario.interesCredito = interesForm / 100;
            guardarCambios(); cerrarModales();
            alert(`Política actualizada. El nuevo interés es del ${interesForm}% mensual.`);
        }
    });

    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado'); 
        window.location.href = 'login.html';
    });
});