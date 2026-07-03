
const sessionJson = localStorage.getItem('user_session');
if (!sessionJson) window.location.href = '../../auth/login/login.html';
const usuarioLogueado = JSON.parse(sessionJson as string);
if (usuarioLogueado.rol.toUpperCase() !== 'ADMIN') {
    window.location.href = '../../auth/login/login.html';
}
document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session');
    window.location.href = '/src/pages/auth/login/login.html'; 
});
const API_USUARIOS = 'http://localhost:8080/api/usuario';
const tablaUsuarios = document.getElementById('tabla-usuarios') as HTMLElement;

async function cargarUsuarios() {
    try {
        const response = await fetch(API_USUARIOS);
        if (response.ok) {
            const usuarios = await response.json();
            dibujarTabla(usuarios);
        }
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

function dibujarTabla(usuarios: any[]) {
    if (!tablaUsuarios) return;
    tablaUsuarios.innerHTML = '';
    
    usuarios.forEach(u => {
        
        const rolSeguro = u.rol ? u.rol.toUpperCase() : 'USUARIO';

        
        const botonEliminar = (rolSeguro !== 'ADMIN') 
            ? `<button class="btn-eliminar" data-id="${u.id}" style="background:#e63946; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">Eliminar</button>` 
            : `<span style="color:gray; font-size:12px;">No se puede borrar</span>`;

        
        tablaUsuarios.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px 10px;">${u.id}</td>
                <td style="padding: 15px 10px;">${u.nombre || 'Sin nombre'} ${u.apellido || ''}</td>
                <td style="padding: 15px 10px;">${u.mail || 'Sin correo'}</td>
                <td style="padding: 15px 10px;">${u.celular || 'Sin celular'}</td>
                <td style="padding: 15px 10px;"><span style="background:#4a4e69; color:white; padding:4px 8px; border-radius:10px; font-size:12px;">${rolSeguro}</span></td>
                <td style="padding: 15px 10px;">${botonEliminar}</td>
            </tr>
        `;
    });
}


tablaUsuarios?.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest('.btn-eliminar');
    if (btn) {
        const id = (btn as HTMLElement).dataset.id;
        if (confirm('¿Estás seguro de eliminar este usuario? Sus pedidos históricos NO se borrarán.')) {
            try {
                const response = await fetch(`${API_USUARIOS}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Usuario eliminado correctamente.');
                    cargarUsuarios(); // Recargamos la tabla
                } else {
                    alert('Error al eliminar el usuario.');
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }
});

cargarUsuarios();