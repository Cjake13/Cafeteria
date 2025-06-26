// ====== KEYS ======
const STORAGE_KEYS = {
    USERS: 'usuarios',
    CATEGORIES: 'categorias',
    PRODUCTS: 'productos',
    USER_SESSION: 'userSession',
    CART: 'carrito'
};

// ====== UTILS ======
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    // Disparar evento para sincronización en tiempo real
    window.dispatchEvent(new StorageEvent('storage', { key: key, newValue: JSON.stringify(data) }));
}
function getCurrentUser() {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION) || sessionStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return session ? JSON.parse(session) : null;
}
function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    window.location.href = 'Login.html';
}

// ====== NAVIGATION ======
document.getElementById('navProductos').onclick = function() {
    showSection('productosSection');
    renderProductos();
};
document.getElementById('navCategorias').onclick = function() {
    showSection('categoriasSection');
    renderCategorias();
};
document.getElementById('navPerfil').onclick = function() {
    showSection('perfilSection');
    renderPerfil();
};
document.getElementById('navCarrito').onclick = function() {
    showSection('carritoSection');
    renderCarrito();
};
document.getElementById('navHistorial').onclick = function() {
    showSection('historialSection');
    renderHistorial();
};
function showSection(sectionId) {
    document.getElementById('productosSection').style.display = 'none';
    document.getElementById('categoriasSection').style.display = 'none';
    document.getElementById('perfilSection').style.display = 'none';
    document.getElementById('carritoSection').style.display = 'none';
    document.getElementById('historialSection').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
    // Cambiar activo en sidebar
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if(sectionId === 'productosSection') document.getElementById('navProductos').classList.add('active');
    if(sectionId === 'categoriasSection') document.getElementById('navCategorias').classList.add('active');
    if(sectionId === 'perfilSection') document.getElementById('navPerfil').classList.add('active');
    if(sectionId === 'carritoSection') document.getElementById('navCarrito').classList.add('active');
    if(sectionId === 'historialSection') document.getElementById('navHistorial').classList.add('active');
}

// ====== BÚSQUEDA ======
function searchProductos(query) {
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const categorias = getData(STORAGE_KEYS.CATEGORIES);
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '';
    
    const filteredProductos = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(query.toLowerCase()))
    );
    
    if (filteredProductos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron productos</td></tr>';
        return;
    }
    
    filteredProductos.forEach(producto => {
        const categoria = categorias.find(c => c.id === producto.categoria_id);
        const estado = producto.stock > 0 ? 'Activo' : 'Agotado';
        const estadoClass = producto.stock > 0 ? 'badge-status' : 'badge bg-danger';
        const row = `<tr>
            <td><img src="${producto.imagen_url || 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'}" class="product-img"></td>
            <td><b>${producto.nombre}</b><br><span style='font-size:0.95em;color:#888;'>${producto.descripcion || ''}</span></td>
            <td><span class="badge-category">${categoria ? categoria.nombre : 'Sin categoría'}</span></td>
            <td style="color:#43a047;font-weight:600;">$${producto.precio.toFixed(2)}</td>
            <td><span class="badge-stock">${producto.stock} unidades</span></td>
            <td><span class="${estadoClass}">${estado}</span></td>
            <td>${producto.stock > 0 ? `<button class='btn btn-sm btn-success' onclick='addToCart("${producto.id}")'><i class='bi bi-cart-plus'></i> Agregar</button>` : ''}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

window.clearSearch = function() {
    document.getElementById('searchProductos').value = '';
    renderProductos();
};

// ====== PRODUCTOS ======
function renderProductos() {
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const categorias = getData(STORAGE_KEYS.CATEGORIES);
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '';
    productos.forEach(producto => {
        const categoria = categorias.find(c => c.id === producto.categoria_id);
        const estado = producto.stock > 0 ? 'Activo' : 'Agotado';
        const estadoClass = producto.stock > 0 ? 'badge-status' : 'badge bg-danger';
        const row = `<tr>
            <td><img src="${producto.imagen_url || 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'}" class="product-img"></td>
            <td><b>${producto.nombre}</b><br><span style='font-size:0.95em;color:#888;'>${producto.descripcion || ''}</span></td>
            <td><span class="badge-category">${categoria ? categoria.nombre : 'Sin categoría'}</span></td>
            <td style="color:#43a047;font-weight:600;">$${producto.precio.toFixed(2)}</td>
            <td><span class="badge-stock">${producto.stock} unidades</span></td>
            <td><span class="${estadoClass}">${estado}</span></td>
            <td>${producto.stock > 0 ? `<button class='btn btn-sm btn-success' onclick='addToCart("${producto.id}")'><i class='bi bi-cart-plus'></i> Agregar</button>` : ''}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function addToCart(productId) {
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const producto = productos.find(p => p.id === productId);
    if (!producto || producto.stock <= 0) return;
    let carrito = getData(STORAGE_KEYS.CART);
    const item = carrito.find(i => i.id === productId);
    if (item) {
        if (item.cantidad < producto.stock) {
            item.cantidad++;
        } else {
            Swal.fire('Error', 'No hay más stock disponible.', 'error');
            return;
        }
    } else {
        carrito.push({ 
            id: productId, 
            cantidad: 1,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen_url: producto.imagen_url
        });
    }
    saveData(STORAGE_KEYS.CART, carrito);
    showCartToast(producto.nombre);
}

function showCartToast(nombre) {
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${nombre} agregado al carrito!`,
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
}

// ====== CATEGORÍAS ======
function renderCategorias() {
    const categorias = getData(STORAGE_KEYS.CATEGORIES);
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const tbody = document.getElementById('categoriasTableBody');
    tbody.innerHTML = '';
    categorias.forEach(cat => {
        const count = productos.filter(p => p.categoria_id === cat.id).length;
        const row = `<tr>
            <td>${cat.nombre}</td>
            <td>${cat.descripcion || ''}</td>
            <td>${count}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// ====== PERFIL ======
function renderPerfil() {
    const user = getCurrentUser();
    if (!user) return;
    const perfilDiv = document.getElementById('perfilInfo');
    perfilDiv.innerHTML = `
        <div class='d-flex align-items-center mb-3'>
            <img src='${user.imagen || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}' width='70' height='70' style='object-fit:cover;border-radius:50%;margin-right:20px;'>
            <div>
                <h5>${user.nombre}</h5>
                <div style='color:#888;'>${user.email}</div>
                <span class='badge bg-primary'>${user.rol}</span>
            </div>
        </div>
        <div><b>Fecha de registro:</b> ${new Date(user.fechaRegistro).toLocaleDateString()}</div>
    `;
}

// ====== CARRITO ======
function renderCarrito() {
    const carrito = getData(STORAGE_KEYS.CART);
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const categorias = getData(STORAGE_KEYS.CATEGORIES);
    const div = document.getElementById('carritoContent');
    if (!carrito.length) {
        div.innerHTML = `<div class='text-center text-muted py-4'><i class='bi bi-cart-x' style='font-size:2em;'></i><br>Tu carrito está vacío</div>`;
        return;
    }
    let total = 0;
    let rows = carrito.map(item => {
        const prod = productos.find(p => p.id === item.id);
        if (!prod) return '';
        const cat = categorias.find(c => c.id === prod.categoria_id);
        const subtotal = prod.precio * item.cantidad;
        total += subtotal;
        return `<tr>
            <td><img src='${prod.imagen_url || 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'}' class='product-img'></td>
            <td><b>${prod.nombre}</b><br><span style='font-size:0.95em;color:#888;'>${prod.descripcion || ''}</span></td>
            <td><span class="badge-category">${cat ? cat.nombre : 'Sin categoría'}</span></td>
            <td>$${prod.precio.toFixed(2)}</td>
            <td>
                <button class='btn btn-sm btn-outline-secondary' onclick='updateCartQty("${prod.id}", -1)'>-</button>
                <span style='margin:0 10px;'>${item.cantidad}</span>
                <button class='btn btn-sm btn-outline-secondary' onclick='updateCartQty("${prod.id}", 1)'>+</button>
            </td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><button class='btn btn-sm btn-danger' onclick='removeFromCart("${prod.id}")'><i class='bi bi-trash'></i></button></td>
        </tr>`;
    }).join('');
    div.innerHTML = `
        <div class='table-responsive'>
            <table class='table products-table'>
                <thead>
                    <tr>
                        <th>IMAGEN</th><th>NOMBRE</th><th>CATEGORÍA</th><th>PRECIO</th><th>CANTIDAD</th><th>SUBTOTAL</th><th></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
                <tfoot>
                    <tr>
                        <td colspan='5' class='text-end'><b>Total:</b></td>
                        <td colspan='2' style='color:#43a047;font-weight:600;'>$${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class='text-end'>
            <button class='btn btn-success' onclick='finalizarCompra()'><i class='bi bi-bag-check'></i> Finalizar Compra</button>
        </div>
    `;
}

window.updateCartQty = function(id, delta) {
    let carrito = getData(STORAGE_KEYS.CART);
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const prod = productos.find(p => p.id === id);
    const item = carrito.find(i => i.id === id);
    if (!item || !prod) return;
    const newQty = item.cantidad + delta;
    if (newQty <= 0) {
        removeFromCart(id);
        return;
    }
    if (newQty > prod.stock) {
        Swal.fire('Error', 'No hay suficiente stock disponible.', 'error');
        return;
    }
    item.cantidad = newQty;
    saveData(STORAGE_KEYS.CART, carrito);
    renderCarrito();
};

window.removeFromCart = function(id) {
    let carrito = getData(STORAGE_KEYS.CART);
    carrito = carrito.filter(item => item.id !== id);
    saveData(STORAGE_KEYS.CART, carrito);
    renderCarrito();
};

window.finalizarCompra = function() {
    const carrito = getData(STORAGE_KEYS.CART);
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    const user = getCurrentUser();
    
    if (!carrito.length) {
        Swal.fire('Error', 'Tu carrito está vacío', 'error');
        return;
    }
    
    // Verificar stock
    for (let item of carrito) {
        const prod = productos.find(p => p.id === item.id);
        if (!prod || prod.stock < item.cantidad) {
            Swal.fire('Error', `No hay suficiente stock de ${prod ? prod.nombre : 'un producto'}`, 'error');
            return;
        }
    }
    
    // Crear pedido
    const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const orders = getData('pedidos') || [];
    const orderDetails = getData('detalles_pedido') || [];
    
    // Agregar pedido
    orders.push({
        id: orderId,
        usuario_id: user.id,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
    });
    
    // Agregar detalles del pedido y actualizar stock
    let total = 0;
    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        if (prod) {
            orderDetails.push({
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                pedido_id: orderId,
                producto_id: item.id,
                cantidad: item.cantidad,
                precio_unitario: prod.precio
            });
            // Actualizar stock
            prod.stock -= item.cantidad;
            total += prod.precio * item.cantidad;
        }
    });
    
    // Guardar datos
    saveData('pedidos', orders);
    saveData('detalles_pedido', orderDetails);
    saveData(STORAGE_KEYS.PRODUCTS, productos);
    
    // Limpiar carrito
    saveData(STORAGE_KEYS.CART, []);
    
    // Mostrar confirmación
    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada exitosamente!',
        html: `Total: $${total.toFixed(2)}<br>Pedido #${orderId}`,
        confirmButtonText: 'Aceptar'
    });
    renderCarrito();
};

// ====== SINCRONIZACIÓN EN TIEMPO REAL ======
window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEYS.PRODUCTS) {
        actualizarProductosUsuario();
        sincronizarCarritoConProductos();
    }
});

function actualizarProductosUsuario() {
    // Recargar productos desde localStorage y renderizar
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    renderProductos(productos);
}

function sincronizarCarritoConProductos() {
    let carrito = getData(STORAGE_KEYS.CART) || [];
    const productos = getData(STORAGE_KEYS.PRODUCTS);
    let cambios = false;
    carrito = carrito.filter(item => {
        const prod = productos.find(p => p.id === item.id);
        if (!prod) {
            cambios = true;
            mostrarAlertaCarrito(`Un producto fue eliminado del catálogo y se quitó del carrito.`);
            return false;
        }
        // Si cambió el stock o precio, actualizar
        if (prod.stock < item.cantidad) {
            item.cantidad = prod.stock;
            cambios = true;
            mostrarAlertaCarrito(`El stock de "${prod.nombre}" cambió. Se ajustó la cantidad en tu carrito.`);
        }
        if (prod.precio !== item.precio) {
            item.precio = prod.precio;
            cambios = true;
            mostrarAlertaCarrito(`El precio de "${prod.nombre}" cambió. Se actualizó en tu carrito.`);
        }
        item.nombre = prod.nombre;
        item.imagen_url = prod.imagen_url;
        return true;
    });
    if (cambios) {
        saveData(STORAGE_KEYS.CART, carrito);
        renderCarrito(carrito);
    }
}

function mostrarAlertaCarrito(msg) {
    Swal.fire({
        icon: 'info',
        title: 'Carrito actualizado',
        text: msg,
        timer: 2500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
}

// ====== HISTORIAL ======
function renderHistorial() {
    const user = getCurrentUser();
    const orders = getData('pedidos') || [];
    const orderDetails = getData('detalles_pedido') || [];
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const div = document.getElementById('historialContent');
    
    // Filtrar pedidos del usuario actual
    const userOrders = orders.filter(order => order.usuario_id === user.id);
    
    if (userOrders.length === 0) {
        div.innerHTML = `<div class='text-center text-muted py-4'><i class='bi bi-clock-history' style='font-size:2em;'></i><br>Aún no tienes compras</div>`;
        return;
    }
    
    let historialHtml = '';
    userOrders.reverse().forEach(order => {
        const details = orderDetails.filter(detail => detail.pedido_id === order.id);
        const total = details.reduce((sum, detail) => sum + (detail.precio_unitario * detail.cantidad), 0);
        
        const detailsHtml = details.map(detail => {
            const product = products.find(p => p.id === detail.producto_id);
            return `
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                        <strong>${product ? product.nombre : 'Producto no encontrado'}</strong>
                        <br><small class="text-muted">Cantidad: ${detail.cantidad}</small>
                    </div>
                    <div class="text-end">
                        <div>$${detail.precio_unitario.toFixed(2)} c/u</div>
                        <div class="text-success fw-bold">$${(detail.precio_unitario * detail.cantidad).toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        const statusClass = {
            'pendiente': 'bg-warning',
            'pagado': 'bg-success',
            'enviado': 'bg-info',
            'cancelado': 'bg-danger'
        }[order.estado] || 'bg-secondary';
        
        historialHtml += `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">Pedido #${order.id}</h6>
                        <small class="text-muted">${new Date(order.fecha).toLocaleDateString()} - ${new Date(order.fecha).toLocaleTimeString()}</small>
                    </div>
                    <div>
                        <span class="badge ${statusClass}">${order.estado}</span>
                        <span class="badge bg-primary ms-2">$${total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="card-body">
                    ${detailsHtml}
                </div>
            </div>
        `;
    });
    
    div.innerHTML = historialHtml;
}

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'Login.html';
        return;
    }
    
    // Configurar búsqueda
    document.getElementById('searchProductos').addEventListener('input', function() {
        const query = this.value.trim();
        if (query) {
            searchProductos(query);
        } else {
            renderProductos();
        }
    });
    
    // Cargar datos iniciales
    renderProductos();
    renderCategorias();
    renderPerfil();
}); 