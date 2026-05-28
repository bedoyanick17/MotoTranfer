MotoTransfer - Sistema Bancario Digital

Este proyecto es una aplicación web de gestión bancaria desarrollada como parte de los proyectos académicos institucionales para el CESDE. El sistema permite a los usuarios gestionar sus productos financieros, realizar transferencias y administrar créditos de forma intuitiva, aplicando principios de arquitectura de software y modularidad en JavaScript.

🚀 Descripción del Proyecto
MotoTransfer es una plataforma diseñada para simular operaciones bancarias reales. El objetivo principal es ofrecer una experiencia de usuario limpia y profesional, integrando funcionalidades de backend y frontend web.

Funcionalidades principales:
Gestión de Cuentas: Creación y administración de cuentas de ahorro (Débito) y Cuentas Corrientes.

Transferencias: Sistema de envío de dinero entre usuarios mediante validación de cuentas.

Gestión de Créditos: Solicitud de tarjetas de crédito con cálculo de intereses, simulación de compras a cuotas y pagos de deuda.

Interfaz Dinámica: Interfaz con temática profesional, optimizada para una navegación fluida.

🛠 Tecnologías Utilizadas
Frontend: HTML5, CSS3, Bootstrap 5.3.3.

Lógica: JavaScript (Modularizado en múltiples archivos: dashboard.js, transferencias.js, tarjeta_credito.js, cuentacorriente.js).

Almacenamiento: localStorage para la persistencia de datos del usuario y transacciones.

📂 Estructura del Código
El proyecto ha sido organizado para facilitar el mantenimiento y la escalabilidad:

dashboard.js: Gestiona el estado global del usuario, la interfaz principal y las funciones compartidas.

transferencias.js: Contiene la lógica específica para el manejo de transferencias entre cuentas.

tarjeta_credito.js: Encargado de la lógica de negocio para productos de crédito y gestión de cuotas.

cuentacorriente.js: Gestiona la apertura y cancelación de cuentas corrientes.

📋 Requisitos para Ejecución
Clonar este repositorio.

Abrir el archivo dashboard.html en un navegador moderno.

Asegurarse de contar con una sesión activa (el sistema redirige automáticamente a login.html si no hay un usuario autenticado).

🎓 Autores

- Nicolas Bedoya Cardona
- Juan Manuel Patiño
- Roynel Rene Ramirez
- Isabela Quintero

Institución: CESDE

Proyecto desarrollado con enfoque en Programación Orientada a Objetos (POO) y diseño de interfaces minimalistas.
