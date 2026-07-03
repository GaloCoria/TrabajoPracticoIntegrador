    
const sessionJson = localStorage.getItem('user_session');
if (!sessionJson || JSON.parse(sessionJson).rol.toUpperCase() !== 'ADMIN') {
    window.location.href = '../../auth/login/login.html';
}

document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user_session');
    window.location.href = '../../auth/login/login.html';
});


const API_URL = 'http://localhost:8080/api/categoria';
let categorias: any[] = [];


const tbody = document.getElementById('tabla-categorias-body') as HTMLElement;
const modal = document.getElementById('category-modal') as HTMLElement; // ¡Corregido!
const form = document.getElementById('form-categoria') as HTMLFormElement;


async function cargarCategorias() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            categorias = await response.json();
            renderTabla();
        } else {
            console.error('Error al cargar las categorías');
        }
    } catch (error) {
        console.error('Error de red al conectar con Spring Boot:', error);
    }
}

async function borrarCategoria(id: number) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                cargarCategorias(); 
            } else {
                alert('No se pudo eliminar la categoría');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    
    const idStr = (document.getElementById('categoria-id-input') as HTMLInputElement).value;
    const catNombre = (document.getElementById('categoria-nombre') as HTMLInputElement).value;
    const catDesc = (document.getElementById('categoria-descripcion') as HTMLInputElement).value;

    const payload = {
        nombre: catNombre,
        descripcion: catDesc
    };

    try {
        let response;
        if (idStr) {
            response = await fetch(`${API_URL}/${idStr}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (response.ok) {
            modal.classList.add('hidden');
            cargarCategorias();
        } else {
            alert('Error al guardar la categoría');
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
});

function renderTabla() {
    tbody.innerHTML = '';
    categorias.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>#${c.id}</td>
                <td style="color: #ccc; font-style: italic;">Sin imagen</td>
                <td><strong>${c.nombre}</strong></td>
                <td>${c.descripcion || 'Sin descripción'}</td>
                <td style="text-align: right;">
                    <button class="btn-outline btn-sm btn-editar" data-id="${c.id}">Editar</button>
                    <button class="btn-eliminar btn-sm btn-borrar" data-id="${c.id}">Borrar</button>
                </td>
            </tr>`;
    });

    
    document.querySelectorAll('.btn-editar').forEach(btn => 
        btn.addEventListener('click', (e) => abrirModal(Number((e.currentTarget as HTMLElement).dataset.id)))
    );
    document.querySelectorAll('.btn-borrar').forEach(btn => 
        btn.addEventListener('click', (e) => borrarCategoria(Number((e.currentTarget as HTMLElement).dataset.id)))
    );
}

function abrirModal(id?: number) {
    form.reset();
    if (id) {
        const c = categorias.find(x => x.id === id);
        if (c) {
            (document.getElementById('modal-titulo') as HTMLElement).textContent = "Editar Categoría";
            (document.getElementById('categoria-id-input') as HTMLInputElement).value = c.id.toString();
            (document.getElementById('categoria-nombre') as HTMLInputElement).value = c.nombre;
            (document.getElementById('categoria-descripcion') as HTMLInputElement).value = c.descripcion;
        }
    } else {
        (document.getElementById('modal-titulo') as HTMLElement).textContent = "Nueva Categoría";
        (document.getElementById('categoria-id-input') as HTMLInputElement).value = "";
    }
    

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

document.getElementById('btn-nueva-categoria')?.addEventListener('click', () => abrirModal());


const cerrarModalCat = () => {
    modal.classList.add('hidden');
    modal.style.display = 'none';
};

document.getElementById('btn-cerrar-modal')?.addEventListener('click', cerrarModalCat);
document.getElementById('btn-cancelar-form')?.addEventListener('click', cerrarModalCat);

cargarCategorias();