const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const emailInput = document.querySelector('input[name="email"]').value;
    const passwordInput = document.querySelector('input[name="password"]').value;

    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const usuarioValido = clientes.find(cliente => cliente.email === emailInput && cliente.password === passwordInput);

    if (usuarioValido) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
        console.log("✅ ¡Bienvenido " + usuarioValido.firstName + "! Credenciales correctas.");
        console.log("🔄 Redirigiendo a la consola principal en 2 segundos...");
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        console.error('❌ Error: Correo o contraseña incorrectos.');
    }
});