
const formRegistro = document.getElementById('form-registro') as HTMLFormElement;

formRegistro.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    
    const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const celular = (document.getElementById('celular') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

    
    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return; 
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, verificalas.");
        return;
    }

    
    const usuarioRegistro = {
        nombre: nombre,
        apellido: apellido,
        mail: email, 
        celular: celular,
        contrasenia: password 
    };

    try {
        
        const resRegistro = await fetch("http://localhost:8080/api/usuario/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioRegistro)
        });

        if (resRegistro.ok) {
            
            const resLogin = await fetch("http://localhost:8080/api/usuario/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (resLogin.ok) {
                const usuarioLogueado = await resLogin.json();

                
                localStorage.setItem("usuario", JSON.stringify(usuarioLogueado));

                
                alert("¡Registro exitoso! Entrando a la tienda...");
                
                
                window.location.href = '/src/pages/store/Home/Home.html'; 
            } else {
                alert("Cuenta creada, pero falló el inicio de sesión automático. Por favor, logueate manualmente.");
                window.location.href = '/src/pages/auth/login/login.html';
            }
        } else {
            
            const errorText = await resRegistro.text();
            alert("Error: " + errorText);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
});