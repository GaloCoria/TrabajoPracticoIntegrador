const formPerfil = document.getElementById('form-perfil') as HTMLFormElement;
const inputNombre = document.getElementById('perfil-nombre') as HTMLInputElement;
const inputApellido = document.getElementById('perfil-apellido') as HTMLInputElement;
const inputCelular = document.getElementById('perfil-celular') as HTMLInputElement;


const sessionJson = localStorage.getItem('user_session');
if (!sessionJson) window.location.href = '../../auth/login/login.html';
const usuarioLogueado = JSON.parse(sessionJson as string);

document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session'); 
    window.location.href = '/src/pages/auth/login/login.html';
});
if (inputNombre) inputNombre.value = usuarioLogueado.nombre || '';
if (inputApellido) inputApellido.value = usuarioLogueado.apellido || '';
if (inputCelular) inputCelular.value = usuarioLogueado.celular || '';


formPerfil?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    
    const datosActualizados = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        celular: inputCelular.value
    };

    try {
        const response = await fetch(`http://localhost:8080/api/usuario/${usuarioLogueado.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(datosActualizados)
        });

        if (response.ok) {
            const usuarioModificado = await response.json();
            
            
            const nuevaSesion = { ...usuarioLogueado, ...usuarioModificado };
            localStorage.setItem('user_session', JSON.stringify(nuevaSesion));
            
            alert('¡Tus datos fueron actualizados con éxito!');
        } else {
            const errorText = await response.text();
            alert(`Hubo un error al actualizar: ${errorText}`);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert('No se pudo conectar con el servidor.');
    }
});