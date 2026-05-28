    // ==========================================
    // TARJETA DE CRÉDITO
    // ==========================================
    document.getElementById('btnPedirCredito').addEventListener('click', () => {
        const cupo = 2000000; // Cupo base de 2 millones
        miUsuario.productos.credito = { activa: true, numero: '5500 1234 5678 9012', cupoTotal: cupo, cupoDisponible: cupo, deuda: 0 };
        guardarCambios(); actualizarInterfaz(); alert('Tarjeta de Crédito Aprobada');
    });

    document.getElementById('btnProcesarCompra').addEventListener('click', () => {
        let monto = parseFloat(document.getElementById('montoCompra').value);
        let cuotas = parseInt(document.getElementById('cuotasCompra').value);

        if (isNaN(monto) || monto <= 0 || isNaN(cuotas) || cuotas < 1 || cuotas > 36) return alert('Datos de compra inválidos');
        if (monto > miUsuario.productos.credito.cupoDisponible) return alert('Cupo insuficiente');

        let totalConIntereses = monto + (monto * miUsuario.interesCredito * cuotas);
        
        miUsuario.productos.credito.cupoDisponible -= monto; // Descuenta solo el capital del cupo
        miUsuario.productos.credito.deuda += totalConIntereses; // Suma la deuda con intereses
        
        miUsuario.movimientos.push({ tipo: `Compra a ${cuotas} cuotas`, monto: totalConIntereses, metodo: 'Crédito', fecha: new Date().toLocaleDateString() });
        
        guardarCambios(); cerrarModales(); actualizarInterfaz();
        alert(`Compra exitosa. Total a pagar con intereses (${(miUsuario.interesCredito*100)}%/mes): $${totalConIntereses.toLocaleString('es-CO')}`);
    });

    document.getElementById('btnPagarDeuda').addEventListener('click', () => {
        let monto = parseFloat(document.getElementById('montoAbono').value);
        if (isNaN(monto) || monto <= 0) return alert('Ingresa un monto válido');
        if (monto > miUsuario.productos.debito.saldo) return alert('Fondos insuficientes en Débito');
        if (monto > miUsuario.productos.credito.deuda) monto = miUsuario.productos.credito.deuda; // No pagar más de lo que debe

        miUsuario.productos.debito.saldo -= monto;
        miUsuario.productos.credito.deuda -= monto;
        miUsuario.productos.credito.cupoDisponible += monto; // Libera el cupo
        if (miUsuario.productos.credito.cupoDisponible > miUsuario.productos.credito.cupoTotal) {
            miUsuario.productos.credito.cupoDisponible = miUsuario.productos.credito.cupoTotal; // No pasarse del tope
        }

        miUsuario.movimientos.push({ tipo: `Abono a Tarjeta de Crédito`, monto: monto, metodo: 'Débito', fecha: new Date().toLocaleDateString() });
        guardarCambios(); cerrarModales(); actualizarInterfaz(); alert('Pago realizado con éxito');
    });

    document.getElementById('btnCancelarCredito').addEventListener('click', () => {
        if (miUsuario.productos.credito.deuda > 0) {
            alert('❌ No puedes cancelar la tarjeta. Debes estar a PAZ Y SALVO. Deuda actual: $' + miUsuario.productos.credito.deuda);
            return;
        }
        if(confirm('¿Seguro que deseas cancelar tu tarjeta de crédito?')) {
            miUsuario.productos.credito = null;
            guardarCambios(); cerrarModales(); actualizarInterfaz(); alert('Tarjeta cancelada correctamente');
        }
    });
