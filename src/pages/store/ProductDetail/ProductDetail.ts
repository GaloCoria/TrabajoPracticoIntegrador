

const imgProducto = document.getElementById('detalle-img') as HTMLImageElement;
const tituloProducto = document.getElementById('detalle-titulo') as HTMLElement;
const descProducto = document.getElementById('detalle-desc') as HTMLElement;
const precioProducto = document.getElementById('detalle-precio') as HTMLElement;
const stockProducto = document.getElementById('detalle-stock') as HTMLElement;
const badgeEstado = document.getElementById('detalle-estado') as HTMLElement;

const inputCantidad = document.getElementById('input-cantidad') as HTMLInputElement;
const btnAgregar = document.getElementById('btn-agregar-detalle') as HTMLButtonElement;
document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session'); 
    window.location.href = '/src/pages/auth/login/login.html'; 
});
const urlParams = new URLSearchParams(window.location.search);
const productIdStr = urlParams.get('id');

if (!productIdStr) {
    window.location.href = '../home/home.html';
}

const productId = Number(productIdStr);
let productoActual: any = null; 


async function cargarDetalleProducto() {
    try {
        const response = await fetch(`http://localhost:8080/api/producto/${productId}`);
        
        if (response.ok) {
            productoActual = await response.json();
            renderizarDetalle();
        } else {
            document.body.innerHTML = '<h2 style="text-align:center; margin-top:50px;">Producto no encontrado</h2><div style="text-align:center;"><a href="../home/home.html">Volver a la tienda</a></div>';
        }
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
    }
}

function renderizarDetalle() {
    if (!productoActual) return;

    
    if (imgProducto) imgProducto.src = productoActual.imagen;
    if (tituloProducto) tituloProducto.textContent = productoActual.nombre;
    if (descProducto) descProducto.textContent = productoActual.descripcion;
    if (precioProducto) precioProducto.textContent = `$${productoActual.precio}`;
    if (stockProducto) stockProducto.textContent = `Stock disponible: ${productoActual.stock}`;

    if (productoActual.disponible && productoActual.stock > 0) {
        if (badgeEstado) {
            badgeEstado.textContent = "DISPONIBLE";
            badgeEstado.style.backgroundColor = "green";
        }
        if (inputCantidad) {
            inputCantidad.max = productoActual.stock.toString();
            inputCantidad.disabled = false;
        }
        if (btnAgregar) btnAgregar.disabled = false;
    } else {
        if (badgeEstado) {
            badgeEstado.textContent = "NO DISPONIBLE";
            badgeEstado.style.backgroundColor = "red";
        }
        if (btnAgregar) btnAgregar.disabled = true;
        if (inputCantidad) inputCantidad.disabled = true;
    }
}


if (btnAgregar && inputCantidad) {
    btnAgregar.addEventListener('click', () => {
        if (!productoActual) return;

        const cantidadSeleccionada = parseInt(inputCantidad.value);

        if (!productoActual.disponible) {
            alert('El producto no está disponible para la venta.');
            return;
        }

        if (productoActual.stock <= 0) {
            alert('No hay stock disponible.');
            return;
        }

        if (cantidadSeleccionada > productoActual.stock) {
            alert(`No podés agregar más del stock disponible (${productoActual.stock}).`);
            return;
        }

        if (cantidadSeleccionada <= 0 || isNaN(cantidadSeleccionada)) {
            alert('Ingresá una cantidad válida.');
            return;
        }
        
        guardarEnCarrito(productoActual, cantidadSeleccionada);
    });
}

function guardarEnCarrito(producto: any, cantidad: number) {
    const carritoJson = localStorage.getItem('carrito');
    const carrito = carritoJson ? JSON.parse(carritoJson) : [];

    
    const index = carrito.findIndex((item: any) => item.producto.id === producto.id);

    if (index !== -1) {
        if (carrito[index].cantidad + cantidad > producto.stock) {
            alert('La cantidad total en tu carrito supera el stock disponible.');
            return;
        }
        carrito[index].cantidad += cantidad;
    } else {
        
        carrito.push({ 
            producto: producto, 
            cantidad: cantidad 
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} (x${cantidad}) agregado al carrito.`);
}


cargarDetalleProducto();