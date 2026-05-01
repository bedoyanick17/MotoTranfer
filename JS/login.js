class AuthService {
    constructor() {
        this.storageKey = 'clientes';
        this.sessionKey = 'usuarioLogueado';
    }

    intentarLogin(email, password) {
        const clientes = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        const usuario = clientes.find(c => c.email === email && c.password === password);

        if (usuario) {
            this.crearSesion(usuario);
            return { success: true, nombre: usuario.firstName };
        }
        return { success: false, error: "Credenciales incorrectas" };
    }

    crearSesion(usuario) {
        localStorage.setItem(this.sessionKey, JSON.stringify(usuario));
    }
}

class LoginInterface {
    constructor() {
        this.auth = new AuthService();
        this.form = document.querySelector('form');
        this.emailInput = document.querySelector('input[name="email"]');
        this.passInput = document.querySelector('input[name="password"]');
        
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value;
        const pass = this.passInput.value;

        const resultado = this.auth.intentarLogin(email, pass);

        if (resultado.success) {
            console.log(`✅ ¡Bienvenido ${resultado.nombre}! Credenciales correctas.`);
            console.log("🔄 Redirigiendo a la consola principal...");
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            console.error(`❌ Error: ${resultado.error}`);
            alert("Correo o contraseña incorrectos.");
        }
    }
}

// Inicialización limpia
document.addEventListener('DOMContentLoaded', () => {
    new LoginInterface();
});