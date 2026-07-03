
const sessionJson = localStorage.getItem('user_session');
if (!sessionJson || JSON.parse(sessionJson).rol.toUpperCase() !== 'ADMIN') {
    window.location.href = '../../auth/login/login.html';
}

document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('user_session');
    window.location.href = '../../auth/login/login.html';
});


const API_PRODUCTOS = 'http://localhost:8080/api/producto';
const API_CATEGORIAS = 'http://localhost:8080/api/categoria';

let productos: any[] = [];
let categoriasActivas: any[] = [];


const tbody = document.getElementById('tabla-productos-body') as HTMLElement;
const modal = document.getElementById('product-modal') as HTMLElement;
const form = document.getElementById('form-producto') as HTMLFormElement;
const selectCategoria = document.getElementById('prod-categoria') as HTMLSelectElement;


async function cargarCategorias() {
    try {
        const response = await fetch(API_CATEGORIAS);
        if (response.ok) {
            categoriasActivas = await response.json();
            poblarSelectCategorias();
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}


async function cargarProductos() {
    try {
        const response = await fetch(API_PRODUCTOS);
        if (response.ok) {
            productos = await response.json();
            renderTabla();
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}


async function borrarProducto(id: number) {
    if (confirm('¿Eliminar producto del catálogo?')) {
        try {
            const response = await fetch(`${API_PRODUCTOS}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                cargarProductos(); 
            } else {
                alert('No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idStr = (document.getElementById('prod-id') as HTMLInputElement).value;
    
    
    const payload = {
        nombre: (document.getElementById('prod-nombre') as HTMLInputElement).value,
        precio: Number((document.getElementById('prod-precio') as HTMLInputElement).value),
        stock: Number((document.getElementById('prod-stock') as HTMLInputElement).value),
        descripcion: (document.getElementById('prod-descripcion') as HTMLInputElement).value,
        imagen: (document.getElementById('prod-imagen') as HTMLInputElement).value,
        disponible: (document.getElementById('prod-disponible') as HTMLInputElement).checked,
        categoria: {
            id: Number((document.getElementById('prod-categoria') as HTMLSelectElement).value)
        }
    };

    try {
        let response;
        if (idStr) {
            response = await fetch(`${API_PRODUCTOS}/${idStr}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(API_PRODUCTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (response.ok) {
            modal.classList.add('hidden');
            cargarProductos();
        } else {
            alert('Error al guardar el producto');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
    }
});



function renderTabla() {
    tbody.innerHTML = '';
    productos.forEach(p => {
        const catNombre = p.categoria ? p.categoria.nombre : 'Sin Categoría';
        const badge = p.disponible && p.stock > 0 
            ? `<span class="badge-estado status-completed">Activo</span>` 
            : `<span class="badge-estado status-cancelled">Inactivo/Sin Stock</span>`;

        tbody.innerHTML += `
            <tr>
                <td>#${p.id}</td>
                <td><img src="${p.imagen}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;"></td>
                <td><strong>${p.nombre}</strong></td>
                <td>${catNombre}</td>
                <td style="color:#e63946; font-weight:bold;">$${p.precio}</td>
                <td>${p.stock} u.</td>
                <td>${badge}</td>
                <td style="text-align: right;">
                    <button class="btn-outline btn-sm btn-editar" data-id="${p.id}">Editar</button>
                    <button class="btn-eliminar btn-sm btn-borrar" data-id="${p.id}">Borrar</button>
                </td>
            </tr>`;
    });

    
    document.querySelectorAll('.btn-editar').forEach(btn => 
        btn.addEventListener('click', (e) => abrirModal(Number((e.currentTarget as HTMLElement).dataset.id)))
    );
    document.querySelectorAll('.btn-borrar').forEach(btn => 
        btn.addEventListener('click', (e) => borrarProducto(Number((e.currentTarget as HTMLElement).dataset.id)))
    );
}

function poblarSelectCategorias() {
    selectCategoria.innerHTML = categoriasActivas.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

function abrirModal(id?: number) {
    form.reset();
    if (id) {
        const p = productos.find(x => x.id === id);
        if (p) {
            (document.getElementById('modal-titulo') as HTMLElement).textContent = "Editar Producto";
            (document.getElementById('prod-id') as HTMLInputElement).value = p.id.toString();
            (document.getElementById('prod-nombre') as HTMLInputElement).value = p.nombre;
            (document.getElementById('prod-precio') as HTMLInputElement).value = p.precio.toString();
            (document.getElementById('prod-stock') as HTMLInputElement).value = p.stock.toString();
            (document.getElementById('prod-categoria') as HTMLSelectElement).value = p.categoria ? p.categoria.id.toString() : '';
            (document.getElementById('prod-descripcion') as HTMLInputElement).value = p.descripcion;
            (document.getElementById('prod-imagen') as HTMLInputElement).value = p.imagen;
            (document.getElementById('prod-disponible') as HTMLInputElement).checked = p.disponible;
        }
    } else {
        (document.getElementById('modal-titulo') as HTMLElement).textContent = "Nuevo Producto";
        (document.getElementById('prod-id') as HTMLInputElement).value = "";
    }
    
    
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

document.getElementById('btn-nuevo-producto')?.addEventListener('click', () => abrirModal());


const cerrarModal = () => {
    modal.classList.add('hidden');
    modal.style.display = 'none';
};

document.getElementById('btn-cerrar-modal')?.addEventListener('click', cerrarModal);
document.getElementById('btn-cancelar')?.addEventListener('click', cerrarModal);

cargarCategorias().then(() => cargarProductos());