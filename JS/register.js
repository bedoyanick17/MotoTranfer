<<<<<<< HEAD
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
=======
class Cliente {
    constructor(nombre, apellido, email, password, telefono) {
        this.id = Date.now();
        this.firstName = nombre;
        this.lastName = apellido;
        this.email = email;
        this.password = password;
        this.phone = telefono;
        this.numeroCuenta = this.generarNumeroCuenta();
        this.interesCredito = 0.03;
        this.movimientos = [];
        this.productos = this.generarProductosIniciales();
    }

    generarNumeroCuenta() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    generarProductosIniciales() {
        return {
            debito: {
                activa: true,
                numero: `4500 ${this.generarBloqueTC()} ${this.generarBloqueTC()} ${this.generarBloqueTC()}`,
>>>>>>> 72218c3f4b4b2b1ce2e96951dd43e92c07ae6365
                vencimiento: '12/30',
                cvv: Math.floor(100 + Math.random() * 900).toString(),
                saldo: 0
            },
            credito: null,
            corriente: null
<<<<<<< HEAD
        }
    };

    listaClientes.push(nuevoCliente);
    localStorage.setItem('clientes', JSON.stringify(listaClientes));

    console.log("✅ Cliente registrado con éxito:", nuevoCliente);

    imputNombre.value = ''; imputApellido.value = '';
    imputEmail.value = ''; imputPassword.value = ''; imputPhone.value = '';

    alert(`¡Registro exitoso! Tu número de cuenta es: ${nuevoCliente.numeroCuenta}`);
    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
=======
        };
    }

    generarBloqueTC() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
}

class StorageManager {
    constructor(clave = 'clientes') {
        this.clave = clave;
    }

    obtenerTodos() {
        return JSON.parse(localStorage.getItem(this.clave)) || [];
    }

    guardar(cliente) {
        const clientes = this.obtenerTodos();
        clientes.push(cliente);
        localStorage.setItem(this.clave, JSON.stringify(clientes));
    }

    existeEmail(email) {
        return this.obtenerTodos().some(c => c.email === email);
    }
}

class RegistroUI {
    constructor() {
        this.storage = new StorageManager();
        this.inicializarDOM();
        this.asignarEventos();
    }

    inicializarDOM() {
        this.btnGuardar = document.getElementById('btnGuardar');
        this.inputNombre = document.getElementById('firstName');
        this.inputApellido = document.getElementById('lastName');
        this.inputEmail = document.getElementById('email');
        this.inputPassword = document.getElementById('password');
        this.inputPhone = document.getElementById('phone');
    }

    asignarEventos() {
        this.btnGuardar.addEventListener('click', () => this.procesarRegistro());
    }

    camposValidos() {
        return this.inputNombre.value && this.inputEmail.value && this.inputPassword.value;
    }

    limpiarFormulario() {
        this.inputNombre.value = '';
        this.inputApellido.value = '';
        this.inputEmail.value = '';
        this.inputPassword.value = '';
        this.inputPhone.value = '';
    }

    procesarRegistro() {
        if (!this.camposValidos()) {
            console.error('❌ Faltan datos obligatorios');
            alert('Por favor, completa Nombre, Correo y Contraseña.');
            return;
        }

        const email = this.inputEmail.value;

        if (this.storage.existeEmail(email)) {
            alert('Ese correo ya está registrado. Inicia sesión.');
            return;
        }

        const nuevoCliente = new Cliente(
            this.inputNombre.value,
            this.inputApellido.value,
            email,
            this.inputPassword.value,
            this.inputPhone.value
        );

        this.storage.guardar(nuevoCliente);
        console.log("✅ Cliente registrado con éxito:", nuevoCliente);

        this.limpiarFormulario();
        alert(`¡Registro exitoso! Tu número de cuenta es: ${nuevoCliente.numeroCuenta}`);
        
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegistroUI();
>>>>>>> 72218c3f4b4b2b1ce2e96951dd43e92c07ae6365
});