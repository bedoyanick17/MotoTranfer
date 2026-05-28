    // ==========================================
    // CUENTA CORRIENTE
    // ==========================================
    document.getElementById('btnPedirCorriente').addEventListener('click', () => {
        miUsuario.productos.corriente = { activa: true, numero: '99' + Math.floor(10000000 + Math.random() * 90000000).toString(), saldo: 0 };
        guardarCambios(); actualizarInterfaz(); alert('Cuenta Corriente habilitada');
    });

    window.cancelarCorriente = function() {
        if(confirm('¿Seguro que deseas cancelar tu Cuenta Corriente? El dinero restante pasará a tu Débito.')) {
            let saldoRestante = miUsuario.productos.corriente.saldo;
            miUsuario.productos.debito.saldo += saldoRestante; // Mover plata
            miUsuario.productos.corriente = null; // Eliminar cuenta
            
            if(saldoRestante > 0) {
                miUsuario.movimientos.push({ tipo: `Traslado por cancelación de Cta. Corriente`, monto: saldoRestante, metodo: 'Débito', fecha: new Date().toLocaleDateString() });
            }
            guardarCambios(); actualizarInterfaz(); alert('Cuenta cancelada. Fondos trasladados.');
        }
    };
