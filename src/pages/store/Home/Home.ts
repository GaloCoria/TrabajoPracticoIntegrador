const sessionJson = localStorage.getItem('user_session');
if (!sessionJson) {
    window.location.href = '../../auth/login/login.html';
}

document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session');
    window.location.href = '../../auth/login/login.html';
});

let carrito: any[] = JSON.parse(localStorage.getItem('carrito') || '[]');

function actualizarContadorCarrito() {
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
actualizarContadorCarrito();

const API_PRODUCTOS = 'http://localhost:8080/api/producto';
const API_CATEGORIAS = 'http://localhost:8080/api/categoria';

let productosCatalogo: any[] = [];

const listaCategorias = document.getElementById('lista-categorias') as HTMLElement;
const contenedorProductos = document.getElementById('contenedor-productos') as HTMLElement;

async function iniciarTienda() {
    await cargarCategoriasCliente();
    await cargarProductosCliente();
}

async function cargarCategoriasCliente() {
    try {
        const response = await fetch(API_CATEGORIAS);
        if (response.ok) {
            const categorias = await response.json();
            renderFiltros(categorias);
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

async function cargarProductosCliente() {
    try {
        const response = await fetch(API_PRODUCTOS);
        if (response.ok) {
            const todos = await response.json();
            productosCatalogo = todos.filter((p: any) => p.disponible && p.stock > 0);
            renderTarjetas(productosCatalogo);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function renderFiltros(categorias: any[]) {
    if (!listaCategorias) return;
    
    listaCategorias.innerHTML = `
        <li style="display: inline-block; margin: 0 5px;">
            <button class="btn-filtro activo" data-id="todas" style="padding: 10px 20px; border-radius: 20px; background: #e63946; color: white; border: none; cursor: pointer; font-weight: bold;">Todas</button>
        </li>`;
    
    categorias.forEach(c => {
        listaCategorias.innerHTML += `
            <li style="display: inline-block; margin: 0 5px;">
                <button class="btn-filtro" data-id="${c.id}" style="padding: 10px 20px; border-radius: 20px; background: white; color: #333; border: 1px solid #ddd; cursor: pointer; font-weight: bold;">${c.nombre}</button>
            </li>`;
    });

    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            document.querySelectorAll('.btn-filtro').forEach(b => {
                (b as HTMLElement).style.background = 'white';
                (b as HTMLElement).style.color = '#333';
                (b as HTMLElement).style.border = '1px solid #ddd';
            });
            target.style.background = '#e63946';
            target.style.color = 'white';
            target.style.border = 'none';

            const catId = target.dataset.id;
            if (catId === 'todas') {
                renderTarjetas(productosCatalogo);
            } else {
                const filtrados = productosCatalogo.filter(p => p.categoria && p.categoria.id.toString() === catId);
                renderTarjetas(filtrados);
            }
        });
    });
}

function renderTarjetas(lista: any[]) {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = '';
    
    contenedorProductos.style.display = 'grid';
    contenedorProductos.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    contenedorProductos.style.gap = '20px';

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1 / -1;">No hay productos disponibles.</p>`;
        return;
    }

    lista.forEach(p => {
        contenedorProductos.innerHTML += `
            <div class="card-producto" style="border: 1px solid #eee; border-radius: 15px; overflow: hidden; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                <div class="abrir-detalle" data-id="${p.id}" style="width: 100%; height: 200px; background: #f8f9fa; cursor: pointer;">
                    <img src="${p.imagen}" alt="${p.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 20px; text-align: center; display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #2b2d42;">${p.nombre}</h3>
                    <p style="font-size: 13px; color: #6c757d; min-height: 40px; margin-bottom: 15px;">${p.descripcion}</p>
                    <h4 style="color: #e63946; font-size: 20px; margin-bottom: 20px; margin-top: auto;">$${p.precio}</h4>
                    <button class="btn-agregar" data-id="${p.id}" style="width: 100%; padding: 12px; background: #e63946; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
    });
}


contenedorProductos.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    
    const btnAgregar = target.closest('.btn-agregar');
    if (btnAgregar) {
        const prodId = Number((btnAgregar as HTMLElement).dataset.id);
        agregarAlCarrito(prodId);
        return; 
    }

    
    const divDetalle = target.closest('.abrir-detalle');
    if (divDetalle) {
        const prodId = Number((divDetalle as HTMLElement).dataset.id);
        
        window.location.href = `/src/pages/store/ProductDetail/ProductDetail.html?id=${prodId}`;
    }
});

function agregarAlCarrito(idProducto: number) {
    const producto = productosCatalogo.find(p => p.id === idProducto);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.producto.id === idProducto);

    if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
            mostrarNotificacionVerde(`¡Solo hay ${producto.stock} unidades de ${producto.nombre} en stock!`);
            return;
        }
        itemExistente.cantidad++;
    } else {
        carrito.push({
            producto: producto,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarNotificacionVerde(`¡Agregaste ${producto.nombre} al carrito!`);
}

function mostrarNotificacionVerde(mensaje: string) {
    let toast = document.getElementById('toast-notificacion');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notificacion';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#10b981';
        toast.style.color = 'white';
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        toast.style.fontWeight = 'bold';
        toast.style.zIndex = '9999';
        toast.style.transition = 'opacity 0.3s ease-in-out';
        document.body.appendChild(toast);
    }

    toast.textContent = mensaje;
    toast.style.opacity = '1';

    setTimeout(() => {
        if (toast) toast.style.opacity = '0';
    }, 3000);
}

const btnBuscar = document.getElementById('btn-buscar');
const inputBusqueda = document.getElementById('input-busqueda') as HTMLInputElement;

btnBuscar?.addEventListener('click', () => {
    const texto = inputBusqueda.value.toLowerCase().trim();
    if (texto === '') {
        renderTarjetas(productosCatalogo);
    } else {
        const filtrados = productosCatalogo.filter(p => p.nombre.toLowerCase().includes(texto));
        renderTarjetas(filtrados);
    }
});

inputBusqueda?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnBuscar?.click();
});
const selectOrden = document.getElementById('select-orden') as HTMLSelectElement;

selectOrden?.addEventListener('change', (e) => {
    const criterio = (e.target as HTMLSelectElement).value;
    
    
    let productosAordenar = [...productosCatalogo]; 
    
    
    const textoBuscado = inputBusqueda.value.toLowerCase().trim();
    if (textoBuscado !== '') {
        productosAordenar = productosAordenar.filter(p => p.nombre.toLowerCase().includes(textoBuscado));
    }

    
    switch (criterio) {
        case 'precio-asc':
            productosAordenar.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosAordenar.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre-asc':
            productosAordenar.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-desc':
            productosAordenar.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        default:
            
            productosAordenar.sort((a, b) => a.id - b.id);
            break;
    }

    
    renderTarjetas(productosAordenar);
});
iniciarTienda();