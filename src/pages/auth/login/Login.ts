const loginForm = document.getElementById('form') as HTMLFormElement;

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            
            const response = await fetch('http://localhost:8080/api/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            if (response.ok) {
                
                const usuarioBD = await response.json();
                
                const usuarioSesion = {
                    id: usuarioBD.id, 
                    email: usuarioBD.mail, 
                    rol: usuarioBD.rol,
                    isLogged: true
                };
                
                localStorage.setItem('user_session', JSON.stringify(usuarioSesion));

                if (usuarioBD.rol.toUpperCase() === 'ADMIN') {
                    window.location.href = '../../admin/home/home.html';
                } else {
                    window.location.href = '../../store/home/Home.html'; 
                }
            } else {
                alert('Email o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error al conectar con Java:', error);
            alert('Error de conexión con el servidor.');
        }
    });
}