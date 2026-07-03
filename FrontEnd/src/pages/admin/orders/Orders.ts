
const sessionJson = localStorage.getItem('user_session');
if (!sessionJson) {
    window.location.href = '../../auth/login/login.html';
}

const usuarioLogueado = JSON.parse(sessionJson as string);
if (usuarioLogueado.rol.toUpperCase() !== 'ADMIN') {
    alert('Acceso denegado. Área exclusiva para administradores.');
    window.location.href = '../../store/home/Home.html';
}


document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session');
    window.location.href = '../../auth/login/login.html';
});


const contenedorPedidos = document.getElementById('orders-container') as HTMLElement;
const modal = document.getElementById('admin-order-modal') as HTMLElement;
const closeModalBtn = document.getElementById('close-modal-btn') as HTMLElement;
const btnActualizarEstado = document.getElementById('btn-actualizar-estado') as HTMLButtonElement;
const selectEstado = document.getElementById('select-estado') as HTMLSelectElement;


let pedidoSeleccionadoId: number | null = null;


async function cargarTodosLosPedidos() {
    if (!contenedorPedidos) return;
    contenedorPedidos.innerHTML = '<p style="text-align: center;">Cargando comandas globales...</p>';

    try {
        const response = await fetch('http://localhost:8080/api/pedido/todos');
        
        if (response.ok) {
            const todosLosPedidos = await response.json();
            renderAdminPedidos(todosLosPedidos);
        } else {
            contenedorPedidos.innerHTML = '<p style="color: red; text-align: center;">Error al cargar los pedidos.</p>';
        }
    } catch (error) {
        console.error('Error de red:', error);
        contenedorPedidos.innerHTML = '<p style="text-align: center;">Servidor desconectado.</p>';
    }
}


function renderAdminPedidos(pedidos: any[]) {
    contenedorPedidos.innerHTML = '';

    if (pedidos.length === 0) {
        contenedorPedidos.innerHTML = '<h3 style="text-align: center; width: 100%;">No hay pedidos en el sistema</h3>';
        return;
    }

    pedidos.sort((a, b) => a.id - b.id);

    pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fecha).toLocaleDateString('es-AR');
        
        let colorEstado = '#f59e0b'; 
        if (pedido.estado === 'EN_CAMINO' || pedido.estado === 'EN_PREPARACION') colorEstado = '#3b82f6'; 
        if (pedido.estado === 'ENTREGADO') colorEstado = '#10b981'; 
        if (pedido.estado === 'CANCELADO') colorEstado = '#e63946';

        let detalleTexto = '';

        pedido.detalles.forEach((det: any) => {
            detalleTexto += `<li>${det.cantidad}x ${det.nombreProducto}</li>`;
        });

        
        const card = document.createElement('div');
        card.style.cssText = `background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid ${colorEstado}; cursor: pointer; transition: transform 0.2s;`;
        
        
        card.onmouseover = () => card.style.transform = 'translateY(-2px)';
        card.onmouseout = () => card.style.transform = 'translateY(0)';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div>
                    <strong style="font-size: 18px; color: #2b2d42;">Pedido #${pedido.id}</strong>
                    <span style="color: #6c757d; margin-left: 10px; font-size: 14px;">${fecha}</span>
                    <div style="font-size: 14px; color: #4a4e69; margin-top: 5px;">👤 ${pedido.clienteNombre}</div>
                </div>
                <div style="background: ${colorEstado}20; color: ${colorEstado}; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 13px;">
                    ${pedido.estado.replace('_', ' ')}
                </div>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0 0 15px 0; color: #4a4e69; line-height: 1.6;">
                ${detalleTexto}
            </ul>
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <span style="color: #6c757d; font-size: 14px;">Pago: ${pedido.formaPago}</span>
                <span style="font-size: 18px; color: #e63946;">Total: $${pedido.total}</span>
            </div>
            <div style="text-align: right; margin-top: 10px;">
                <span style="color: #3b82f6; font-size: 13px; text-decoration: underline;">Hacé clic para gestionar estado</span>
            </div>
        `;

        
        card.addEventListener('click', () => abrirModal(pedido));
        
        contenedorPedidos.appendChild(card);
    });
}


function abrirModal(pedido: any) {
    pedidoSeleccionadoId = pedido.id;
    
    (document.getElementById('modal-order-title') as HTMLElement).textContent = `Detalle Pedido #${pedido.id}`;
    (document.getElementById('pedido-fecha') as HTMLElement).textContent = new Date(pedido.fecha).toLocaleDateString('es-AR');
    (document.getElementById('pedido-total') as HTMLElement).textContent = `$${pedido.total}`;
    
    (document.getElementById('cliente-nombre') as HTMLElement).textContent = `${pedido.clienteNombre} (${pedido.clienteMail})`;

    const ulItems = document.getElementById('modal-order-items') as HTMLElement;
    ulItems.innerHTML = '';
    pedido.detalles.forEach((det: any) => {
        ulItems.innerHTML += `<li><strong>${det.cantidad}x</strong> ${det.nombreProducto} <span style="float:right; color:#6c757d;">$${det.subtotal}</span></li>`;
    });

    selectEstado.value = pedido.estado;

    
    modal.classList.remove('hidden');
    modal.style.display = 'flex'; 
}

closeModalBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.style.display = 'none'; 
    pedidoSeleccionadoId = null;
});


window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        pedidoSeleccionadoId = null;
    }
});


btnActualizarEstado?.addEventListener('click', async () => {
    if (!pedidoSeleccionadoId) return;
    
    const nuevoEstado = selectEstado.value;
    btnActualizarEstado.textContent = 'Guardando...';
    btnActualizarEstado.disabled = true;

    try {
        const response = await fetch(`http://localhost:8080/api/pedido/${pedidoSeleccionadoId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado }) // ¡Enviamos el nuevo estado!
        });

        if (response.ok) {
            alert(`Estado actualizado a: ${nuevoEstado.replace('_', ' ')}`);
            modal.classList.add('hidden');
            cargarTodosLosPedidos(); // Recargamos para ver el cambio de color inmediato
        } else {
            alert('Error al actualizar el estado en el servidor.');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión.');
    } finally {
        btnActualizarEstado.textContent = 'Actualizar';
        btnActualizarEstado.disabled = false;
    }
});


cargarTodosLosPedidos();