const sessionJson = localStorage.getItem('user_session'); 
if (!sessionJson) {
    window.location.href = '../../auth/login/login.html';
}

const usuarioLogueado = JSON.parse(sessionJson as string);


console.log("Datos de sesión:", usuarioLogueado);


const idUsuarioReal = usuarioLogueado.id || usuarioLogueado.idUsuario || usuarioLogueado.usuarioId || usuarioLogueado.clienteId;

console.log("Buscando pedidos para el ID:", idUsuarioReal);

document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session'); 
    window.location.href = '/src/pages/auth/login/login.html';
});


const contenedorPedidos = document.getElementById('orders-container') as HTMLElement;
const modal = document.getElementById('order-modal') as HTMLElement;
const btnCerrarModal = document.getElementById('close-modal-btn') as HTMLElement;
let listaDePedidosGlobal: any[] = []; 


async function cargarMisPedidos() {
    if (!contenedorPedidos) return;
    
    contenedorPedidos.innerHTML = '<p style="text-align: center;">Cargando tus pedidos...</p>';

    try {
        
        const response = await fetch(`http://localhost:8080/api/pedido/todos`);
        
        if (response.ok) {
            const todosLosPedidos = await response.json();
            
            
            listaDePedidosGlobal = todosLosPedidos.filter((p: any) => p.clienteMail === usuarioLogueado.email);
            
            renderPedidos(listaDePedidosGlobal);
        } else {
            contenedorPedidos.innerHTML = '<p style="color: red; text-align: center;">Error al cargar el historial.</p>';
        }
    } catch (error) {
        console.error('Error de red:', error);
        contenedorPedidos.innerHTML = '<p style="text-align: center;">Servidor desconectado.</p>';
    }
}


function renderPedidos(pedidos: any[]) {
    contenedorPedidos.innerHTML = '';

    if (pedidos.length === 0) {
        contenedorPedidos.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h3 style="color: #2b2d42;">Todavía no hiciste ninguna compra</h3>
                <p style="color: #6c757d;">¡Andá al catálogo para armar tu primer pedido!</p>
            </div>
        `;
        return;
    }

    pedidos.sort((a, b) => b.id - a.id);

    pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fecha).toLocaleDateString('es-AR');
        
        let colorEstado = '#f59e0b'; 
        if (pedido.estado === 'EN_CAMINO') colorEstado = '#3b82f6'; 
        if (pedido.estado === 'ENTREGADO') colorEstado = '#10b981'; 

        contenedorPedidos.innerHTML += `
            <div style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid ${colorEstado};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <div>
                        <strong style="font-size: 18px; color: #2b2d42;">Tu Pedido</strong>
                        <span style="color: #6c757d; margin-left: 10px; font-size: 14px;">${fecha}</span>
                    </div>
                    <div style="background: ${colorEstado}20; color: ${colorEstado}; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 13px;">
                        ${pedido.estado.replace('_', ' ')}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                    <span style="font-size: 18px; color: #e63946;">Total: $${pedido.total}</span>
                    <button onclick="abrirModal(${pedido.id})" style="background-color: #2b2d42; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; transition: 0.3s;">Ver detalles</button>
                </div>
            </div>
        `;
    });
}


(window as any).abrirModal = (idPedido: number) => {
    
    const pedido = listaDePedidosGlobal.find(p => p.id === idPedido);
    if (!pedido) return;

    
    (document.getElementById('modal-order-title') as HTMLElement).innerText = `Pedido #${pedido.id}`;
    (document.getElementById('modal-order-status') as HTMLElement).innerText = `Estado: ${pedido.estado.replace('_', ' ')}`;

    
    const listaItems = document.getElementById('modal-order-items') as HTMLElement;
    listaItems.innerHTML = '';
    pedido.detalles.forEach((det: any) => {
        
        const nombreItem = det.nombreProducto || `Producto ID: ${det.productoId}`;
        listaItems.innerHTML += `<li>${det.cantidad}x ${nombreItem} - $${det.subtotal}</li>`;
    });

    
    (document.getElementById('modal-subtotal') as HTMLElement).innerText = `$${pedido.total}`;

    (document.getElementById('modal-shipping') as HTMLElement).innerText = `$0.00`; 
    (document.getElementById('modal-total') as HTMLElement).innerText = `$${pedido.total}`;

    
    modal.classList.remove('hidden');
    modal.style.display = 'flex'; 
};


btnCerrarModal?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.style.display = 'none';
});


window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
});


cargarMisPedidos();