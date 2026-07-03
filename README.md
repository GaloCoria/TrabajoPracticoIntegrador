Food Store - Sistema de Gestión de Pedidos
Trabajo Práctico Integrador - Programación 3 | Universidad Tecnológica Nacional (UTN)

Food Store es una aplicación web Full Stack orientada a la venta de productos para un negocio de comidas. El sistema permite a los clientes navegar por un catálogo filtrable, administrar un carrito de compras y realizar pedidos. A su vez, cuenta con un panel de administración completo para gestionar categorías, inventario de productos y el estado de los pedidos, aplicando borrado lógico (Soft Delete) para mantener la integridad histórica.

Tecnologías Utilizadas
Backend:

Java 17+

Spring Boot 3.x

Spring Data JPA / Hibernate

Base de datos H2 (Modo archivo local)

Frontend:

TypeScript

HTML5 & CSS3

Vite

LocalStorage (Gestión de sesión y persistencia del carrito)

Instrucciones de Ejecución
Para probar el proyecto en un entorno local, sigue estos pasos:

1. Levantar el Backend (API REST)
Abre la carpeta del backend en tu IDE de preferencia (IntelliJ IDEA, Eclipse, VS Code).

Espera a que Maven/Gradle descargue las dependencias.

Ejecuta la clase principal FoodstoreApplication.java.

El servidor se iniciará en el puerto 8080.

2. Levantar el Frontend (Cliente Web)
Abre una terminal y navega hasta la carpeta raíz del frontend.

Instala las dependencias ejecutando:


npm install
Inicia el servidor de desarrollo de Vite ejecutando:

Bash
npm run dev/pnpm dev
Abre tu navegador en la dirección que indique la consola (generalmente http://localhost:5173).




Autor: Galo Coria Maiorano
