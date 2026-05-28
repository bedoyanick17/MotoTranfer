    // ==========================================
    // TRANSFERENCIAS
    // ==========================================
    document.getElementById('btnProcesarTransferencia').addEventListener('click', () => {
        let cuentaDestino = document.getElementById('cuentaDestino').value;
        let monto = parseFloat(document.getElementById('montoTransferir').value);

        if (!cuentaDestino || isNaN(monto) || monto <= 0) return alert('Datos inválidos');
        if (cuentaDestino === miUsuario.numeroCuenta) return alert('No puedes transferirte a ti mismo');
        if (miUsuario.productos.debito.saldo < monto) return alert('Fondos insuficientes en la cuenta Débito');

        let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        let indexDestino = clientes.findIndex(c => c.numeroCuenta === cuentaDestino);

        if (indexDestino === -1) return alert('La cuenta destino no existe');

        miUsuario.productos.debito.saldo -= monto;
        miUsuario.movimientos.push({ tipo: `Transferencia a Cta ${cuentaDestino}`, monto: monto, metodo: 'Débito', fecha: new Date().toLocaleDateString() });

        clientes[indexDestino].productos.debito.saldo += monto;
        clientes[indexDestino].movimientos.push({ tipo: `Transferencia recibida de ${miUsuario.firstName}`, monto: monto, metodo: 'Débito', fecha: new Date().toLocaleDateString() });

        localStorage.setItem('clientes', JSON.stringify(clientes));
        guardarCambios();
        cerrarModales();
        actualizarInterfaz();
        alert('Transferencia exitosa');
    });