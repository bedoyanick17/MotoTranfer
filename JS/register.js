const btnGuardar = document.getElementById('btnGuardar');
const imputNombre = document.getElementById('firstName');
const imputApellido = document.getElementById('lastName');
const imputEmail = document.getElementById('email');
const imputPassword = document.getElementById('password');
const imputPhone = document.getElementById('phone');

function generarNumeroCuenta() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

btnGuardar.addEventListener('click', () => {
    // Validar campos obligatorios
    if (!imputNombre.value || !imputEmail.value || !imputPassword.value) {
        console.error('❌ Faltan datos obligatorios');
        alert('Por favor, completa Nombre, Correo y Contraseña.');
        return;
    }

    let listaClientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    // Verificar si el correo ya existe
    const existe = listaClientes.find(c => c.email === imputEmail.value);
    if (existe) {
        alert('Ese correo ya está registrado. Inicia sesión.');
        return;
    }

    // CREACIÓN DEL CLIENTE CON TODOS SUS PRODUCTOS
    const nuevoCliente = {
        id: Date.now(),
        firstName: imputNombre.value,
        lastName: imputApellido.value,
        email: imputEmail.value,
        password: imputPassword.value,
        phone: imputPhone.value,
        numeroCuenta: generarNumeroCuenta(), // <-- Cuenta bancaria principal
        interesCredito: 0.03, // <-- 3% de interés mensual por defecto
        movimientos: [],
        productos: {
            debito: {
                activa: true,
                numero: '4500 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
                vencimiento: '12/30',
                cvv: Math.floor(100 + Math.random() * 900).toString(),
                saldo: 0
            },
            credito: null,
            corriente: null
        }
    };

    listaClientes.push(nuevoCliente);
    localStorage.setItem('clientes', JSON.stringify(listaClientes));

    console.log("✅ Cliente registrado con éxito:", nuevoCliente);

    imputNombre.value = ''; imputApellido.value = '';
    imputEmail.value = ''; imputPassword.value = ''; imputPhone.value = '';

    alert(`¡Registro exitoso! Tu número de cuenta es: ${nuevoCliente.numeroCuenta}`);
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
});