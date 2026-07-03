
const sessionJson = localStorage.getItem('user_session');
if (!sessionJson) {
    window.location.href = '../../auth/login/login.html';
}
document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session'); 
    window.location.href = '/src/pages/auth/login/login.html'; 
});
const usuarioLogueado = JSON.parse(sessionJson as string);


if (usuarioLogueado.rol.toUpperCase() !== 'ADMIN') {
    alert('Acceso denegado. Área exclusiva para administradores.');
    window.location.href = '../../auth/login/login.html';
}

const API_CATEGORIAS = 'http://localhost:8080/api/categoria';
const API_PRODUCTOS = 'http://localhost:8080/api/producto';
const API_PEDIDOS = 'http://localhost:8080/api/pedido/todos';

async function cargarEstadisticas() {
    try {
       
        const resCat = await fetch(API_CATEGORIAS);
        if (resCat.ok) {
            const categorias = await resCat.json();
            const statCategorias = document.getElementById('stat-categorias');
            if (statCategorias) statCategorias.textContent = categorias.length.toString();
        }

        
        const resProd = await fetch(API_PRODUCTOS);
        if (resProd.ok) {
            const productos = await resProd.json();
            
            
            const statProductos = document.getElementById('stat-productos');
            if (statProductos) statProductos.textContent = productos.length.toString();

            
            const statDisponibles = document.getElementById('stat-disponibles');
            if (statDisponibles) {
                const disponibles = productos.filter((p: any) => p.disponible && p.stock > 0).length;
                statDisponibles.textContent = disponibles.toString();
            }
        }

        const resPedidos = await fetch(API_PEDIDOS);
        if (resPedidos.ok) {
            const pedidos = await resPedidos.json();
            const statPedidos = document.getElementById('stat-pedidos');
            if (statPedidos) {
                statPedidos.textContent = pedidos.length.toString();
            }
        }
        
    } catch (error) {
        console.error('Error de red al cargar estadísticas:', error);
    }
    
}


cargarEstadisticas();