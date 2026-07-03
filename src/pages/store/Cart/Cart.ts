const sessionJson = localStorage.getItem('user_session');
if (!sessionJson) window.location.href = '../../auth/login/login.html';

document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session');
    window.location.href = '../../auth/login/login.html';
});

let carrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');

const tbody = document.getElementById('lista-carrito') as HTMLElement;
const spanTotal = document.getElementById('total-precio') as HTMLElement;

function renderCarrito() {
    if (!tbody) return;
    tbody.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 30px; color: #666;">Tu carrito está vacío</td></tr>`;
        if (spanTotal) spanTotal.textContent = '$0.00';
        actualizarContadorHeader();
        return;
    }

    carrito.forEach((item, index) => {
        const subtotal = item.producto.precio * item.cantidad;
        total += subtotal;
        
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px 0; display: flex; align-items: center; gap: 10px;">
                    <img src="${item.producto.imagen}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                    <strong>${item.producto.nombre}</strong>
                </td>
                <td>$${item.producto.precio}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="btn-restar btn-outline" style="padding: 2px 10px; cursor: pointer;" data-index="${index}">-</button>
                        <span style="font-weight: bold;">${item.cantidad}</span>
                        <button class="btn-sumar btn-outline" style="padding: 2px 10px; cursor: pointer;" data-index="${index}">+</button>
                    </div>
                </td>
                <td style="font-weight: bold; color: #e63946;">$${subtotal}</td>
                <td>
                    <button class="btn-eliminar btn-eliminar-item" style="padding: 5px 10px; cursor: pointer; color: white; background: #e63946; border: none; border-radius: 5px;" data-index="${index}">Borrar</button>
                </td>
            </tr>
        `;
    });

    if (spanTotal) spanTotal.textContent = `$${total}`;
    actualizarContadorHeader();
    asignarEventos();
}

function asignarEventos() {
    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number((e.target as HTMLElement).dataset.index);
            const item = carrito[index];
            if (item.cantidad < item.producto.stock) {
                item.cantidad++;
                guardarYRenderizar();
            } else {
                alert(`Límite de stock alcanzado (${item.producto.stock} unidades).`);
            }
        });
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number((e.target as HTMLElement).dataset.index);
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
                guardarYRenderizar();
            }
        });
    });

    document.querySelectorAll('.btn-eliminar-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number((e.target as HTMLElement).dataset.index);
            carrito.splice(index, 1);
            guardarYRenderizar();
        });
    });
}

function guardarYRenderizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

function actualizarContadorHeader() {
    const contador = document.getElementById('cart-counter');
    if (contador) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.textContent = totalItems.toString();
        contador.style.display = totalItems > 0 ? 'inline-block' : 'none';
        contador.style.background = '#e63946';
        contador.style.color = 'white';
        contador.style.borderRadius = '50%';
        contador.style.padding = '2px 8px';
        contador.style.fontSize = '12px';
        contador.style.fontWeight = 'bold';
        contador.style.marginLeft = '5px';
        contador.style.verticalAlign = 'top';
    }
}

document.getElementById('btn-vaciar')?.addEventListener('click', () => {
    if (carrito.length > 0 && confirm('¿Seguro que querés vaciar todo el carrito?')) {
        carrito = [];
        guardarYRenderizar();
    }
});

document.getElementById('btn-finalizar')?.addEventListener('click', async () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío. ¡Agregá productos primero!');
        return;
    }

    const sessionString = localStorage.getItem('user_session');
    if (!sessionString) {
        alert('Error: No se encontró la sesión del usuario.');
        return;
    }
    const usuarioLogueado = JSON.parse(sessionString);
    const idUsuarioReal = usuarioLogueado.id;


    const formaPagoSeleccionada = (document.getElementById('select-pago') as HTMLSelectElement).value;

    const detallesDto = carrito.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
    }));

    const pedidoPayload = {
        usuarioId: idUsuarioReal, 
        idUsuario: idUsuarioReal,
        usuario: { id: idUsuarioReal },
        formaPago: formaPagoSeleccionada, 
        detalles: detallesDto
    };

    try {
        const response = await fetch('http://localhost:8080/api/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoPayload)
        });

        if (response.ok) {
            alert('¡Compra realizada con éxito! Tu pedido ya está en la cocina.');
            carrito = [];
            guardarYRenderizar();
            window.location.href = '../home/home.html';
        } else {
            const errorMsg = await response.text();
            alert('Ups, no se pudo procesar la compra: ' + errorMsg);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Error de conexión. Verificá que el servidor Java esté corriendo.');
    }
});

renderCarrito();