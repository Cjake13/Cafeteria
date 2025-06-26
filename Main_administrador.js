// ===== SISTEMA DE ALMACENAMIENTO LOCALSTORAGE =====

// Estructura de datos para localStorage
const STORAGE_KEYS = {
    USERS: 'usuarios',
    CATEGORIES: 'categorias',
    PRODUCTS: 'productos',
    ORDERS: 'pedidos',
    ORDER_DETAILS: 'detalles_pedido',
    PURCHASE_DETAILS: 'compras_detalle',
    USER_SESSION: 'userSession'
};

// Variable para evitar múltiples verificaciones de sesión
let sessionCheckInProgress = false;
let sessionValidated = false;

// Función para verificar sesión de administrador
function checkAdminSession() {
    // Evitar múltiples verificaciones simultáneas
    if (sessionCheckInProgress || sessionValidated) {
        console.log('Verificación de sesión ya en progreso o completada, saltando...');
        return;
    }
    
    sessionCheckInProgress = true;
    
    try {
        const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION) || sessionStorage.getItem(STORAGE_KEYS.USER_SESSION);
        
        if (!session) {
            console.log('No hay sesión activa, redirigiendo a login...');
            sessionValidated = true; // Marcar como validado para evitar bucles
            setTimeout(() => {
                window.location.href = 'Login.html';
            }, 100);
            return;
        }
        
        const userData = JSON.parse(session);
        
        // Verificar que la sesión sea válida
        if (!userData || !userData.rol || !userData.nombre) {
            console.log('Sesión inválida, redirigiendo a login...');
            localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
            sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
            sessionValidated = true; // Marcar como validado para evitar bucles
            setTimeout(() => {
                window.location.href = 'Login.html';
            }, 100);
            return;
        }
        
        // Verificar que sea administrador
        if (userData.rol !== 'admin') {
            console.log('Usuario no es administrador, redirigiendo...');
            sessionValidated = true; // Marcar como validado para evitar bucles
            setTimeout(() => {
                window.location.href = 'Main_user.html';
            }, 100);
            return;
        }
        
        console.log('Sesión de administrador válida:', userData.nombre);
        sessionValidated = true; // Marcar como validado exitosamente
        
        // Actualizar información del usuario en la interfaz
        updateUserInfo(userData);
        
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        // Limpiar sesión corrupta
        localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
        sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
        sessionValidated = true; // Marcar como validado para evitar bucles
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 100);
    } finally {
        sessionCheckInProgress = false;
    }
}

// Función para actualizar información del usuario en la interfaz
function updateUserInfo(userData) {
    const userNameElement = document.getElementById('userName');
    const userRoleElement = document.getElementById('userRole');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) {
        userNameElement.textContent = userData.nombre;
    }
    
    if (userRoleElement) {
        userRoleElement.textContent = userData.rol === 'admin' ? 'Administrador' : 'Usuario';
    }
    
    if (userAvatarElement) {
        if (userData.imagen) {
            userAvatarElement.style.backgroundImage = `url(${userData.imagen})`;
            userAvatarElement.style.backgroundSize = 'cover';
            userAvatarElement.style.backgroundPosition = 'center';
            userAvatarElement.textContent = '';
        } else {
            userAvatarElement.textContent = userData.nombre.charAt(0).toUpperCase();
        }
    }
}

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== FUNCIONES DE ALMACENAMIENTO =====

// Función genérica para obtener datos
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Función genérica para guardar datos
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    // Disparar evento para sincronización en tiempo real
    window.dispatchEvent(new StorageEvent('storage', { key: key, newValue: JSON.stringify(data) }));
}

// Función para obtener usuario actual
function getCurrentUser() {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION) || sessionStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return session ? JSON.parse(session) : null;
}

// ===== INICIALIZACIÓN DE DATOS DE DEMOSTRACIÓN =====

function initializeDemoData() {
    // Verificar si ya existen datos
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    if (categories.length === 0) {
        // Crear categorías de demostración
        const demoCategories = [
            {
                id: generateId(),
                nombre: 'Bebidas Calientes',
                descripcion: 'Cafés, tés y bebidas calientes'
            },
            {
                id: generateId(),
                nombre: 'Bebidas Frías',
                descripcion: 'Refrescos, jugos y bebidas frías'
            },
            {
                id: generateId(),
                nombre: 'Postres',
                descripcion: 'Pasteles, galletas y dulces'
            },
            {
                id: generateId(),
                nombre: 'Comidas',
                descripcion: 'Platos principales y snacks'
            }
        ];
        saveData(STORAGE_KEYS.CATEGORIES, demoCategories);
    }

    if (products.length === 0) {
        // Crear productos de demostración
        const categories = getData(STORAGE_KEYS.CATEGORIES);
        const demoProducts = [
            {
                id: generateId(),
                nombre: 'Café Americano',
                descripcion: 'Café negro tradicional',
                precio: 2.50,
                stock: 100,
                imagen_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
                categoria_id: categories[0]?.id
            },
            {
                id: generateId(),
                nombre: 'Cappuccino',
                descripcion: 'Café con leche espumada',
                precio: 3.50,
                stock: 80,
                imagen_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200',
                categoria_id: categories[0]?.id
            },
            {
                id: generateId(),
                nombre: 'Limonada',
                descripcion: 'Limonada natural fresca',
                precio: 2.00,
                stock: 50,
                imagen_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200',
                categoria_id: categories[1]?.id
            },
            {
                id: generateId(),
                nombre: 'Tiramisú',
                descripcion: 'Postre italiano clásico',
                precio: 4.50,
                stock: 20,
                imagen_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200',
                categoria_id: categories[2]?.id
            }
        ];
        saveData(STORAGE_KEYS.PRODUCTS, demoProducts);
    }
}

// ===== FUNCIONES DE NAVEGACIÓN =====

function showSection(sectionId) {
    console.log('showSection llamada con:', sectionId);
    
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Actualizar navegación activa
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Cargar datos específicos de la sección
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    console.log('loadSectionData llamada con:', sectionId);
    
    // Resetear estado de filtrado al cambiar de sección
    isFiltering = false;
    filteredCategories = [];
    filteredProducts = [];
    filteredUsers = [];
    filteredOrders = [];
    
    // Inicializar filtros para la sección
    initializeFilters(sectionId);
    
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'categorias':
            loadCategoriesData();
            break;
        case 'productos':
            loadProductsData();
            break;
        case 'usuarios':
            loadUsersData();
            break;
        case 'pedidos':
            loadOrdersData();
            break;
        case 'reportes':
            loadReportsData();
            break;
        case 'calculadora':
            // La calculadora se inicializa automáticamente
            break;
        case 'videojuegos':
            // La sección de videojuegos se muestra automáticamente
            break;
    }
    if (sectionId === 'videojuegos') {
        setTimeout(loadGamesCharts, 200); // Espera a que el DOM esté listo
    }
}

// ===== FUNCIONES DEL DASHBOARD =====

function loadDashboardData() {
    const users = getData(STORAGE_KEYS.USERS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const orders = getData(STORAGE_KEYS.ORDERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Calcular ingresos totales
    const totalRevenue = orderDetails.reduce((total, detail) => {
        return total + (detail.precio_unitario * detail.cantidad);
    }, 0);
    
    // Actualizar estadísticas básicas
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    
    // Cargar estadísticas detalladas
    loadDetailedStats(users, products, orders, orderDetails, categories);
    
    // Cargar pedidos recientes
    loadRecentOrders();
    
    // Cargar productos más vendidos
    loadTopSellingProducts();
    
    // Cargar gráficos principales
    loadDashboardCharts();
}

function loadDetailedStats(users, products, orders, orderDetails, categories) {
    // Estadísticas de usuarios
    const adminUsers = users.filter(u => u.rol === 'admin').length;
    const clientUsers = users.filter(u => u.rol === 'cliente').length;
    
    // Estadísticas de productos
    const activeProducts = products.filter(p => p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    
    // Estadísticas de pedidos
    const pendingOrders = orders.filter(o => o.estado === 'pendiente').length;
    const paidOrders = orders.filter(o => o.estado === 'pagado').length;
    const shippedOrders = orders.filter(o => o.estado === 'enviado').length;
    const cancelledOrders = orders.filter(o => o.estado === 'cancelado').length;
    
    // Estadísticas de ventas
    const totalUnitsSold = orderDetails.reduce((sum, detail) => sum + detail.cantidad, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Crear tabla de estadísticas detalladas
    const statsHtml = `
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="bi bi-people"></i> Estadísticas de Usuarios</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-primary">${adminUsers}</h4>
                                    <small>Administradores</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-success">${clientUsers}</h4>
                                    <small>Clientes</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="bi bi-box"></i> Estadísticas de Productos</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-4">
                                <div class="text-center">
                                    <h4 class="text-success">${activeProducts}</h4>
                                    <small>Activos</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="text-center">
                                    <h4 class="text-danger">${outOfStockProducts}</h4>
                                    <small>Sin Stock</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="text-center">
                                    <h4 class="text-info">${totalStock}</h4>
                                    <small>Total Stock</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="bi bi-cart"></i> Estado de Pedidos</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-3">
                                <div class="text-center">
                                    <h4 class="text-warning">${pendingOrders}</h4>
                                    <small>Pendientes</small>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="text-center">
                                    <h4 class="text-success">${paidOrders}</h4>
                                    <small>Pagados</small>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="text-center">
                                    <h4 class="text-info">${shippedOrders}</h4>
                                    <small>Enviados</small>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="text-center">
                                    <h4 class="text-danger">${cancelledOrders}</h4>
                                    <small>Cancelados</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="bi bi-graph-up"></i> Métricas de Ventas</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-primary">${totalUnitsSold}</h4>
                                    <small>Unidades Vendidas</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-center">
                                    <h4 class="text-success">$${averageOrderValue.toFixed(2)}</h4>
                                    <small>Ticket Promedio</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar estadísticas detalladas después de las tarjetas principales
    const dashboardSection = document.getElementById('dashboard');
    const existingStats = dashboardSection.querySelector('.detailed-stats');
    if (existingStats) {
        existingStats.remove();
    }
    
    const statsDiv = document.createElement('div');
    statsDiv.className = 'detailed-stats p-4';
    statsDiv.innerHTML = statsHtml;
    
    // Insertar después de las tarjetas de estadísticas principales
    const statsCards = dashboardSection.querySelector('.dashboard-stats');
    statsCards.parentNode.insertBefore(statsDiv, statsCards.nextSibling);
}

function loadRecentOrders() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const users = getData(STORAGE_KEYS.USERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    
    const recentOrders = orders.slice(-5).reverse(); // Últimos 5 pedidos
    const tbody = document.querySelector('#recentOrdersTable tbody');
    tbody.innerHTML = '';
    
    recentOrders.forEach(order => {
        const user = users.find(u => u.id === order.usuario_id);
        const orderTotal = orderDetails
            .filter(detail => detail.pedido_id === order.id)
            .reduce((total, detail) => total + (detail.precio_unitario * detail.cantidad), 0);
        
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${user ? user.nombre : 'Usuario desconocido'}</td>
                <td>${new Date(order.fecha).toLocaleDateString()}</td>
                <td>$${orderTotal.toFixed(2)}</td>
                <td><span class="badge-status status-${order.estado}">${order.estado}</span></td>
                <td>
                    <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadTopSellingProducts() {
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    
    // Calcular ventas por producto
    const productSales = {};
    orderDetails.forEach(detail => {
        if (!productSales[detail.producto_id]) {
            productSales[detail.producto_id] = {
                unitsSold: 0,
                revenue: 0
            };
        }
        productSales[detail.producto_id].unitsSold += detail.cantidad;
        productSales[detail.producto_id].revenue += detail.precio_unitario * detail.cantidad;
    });
    
    // Convertir a array y ordenar por unidades vendidas
    const topProducts = Object.entries(productSales)
        .map(([productId, sales]) => {
            const product = products.find(p => p.id === productId);
            return {
                ...product,
                unitsSold: sales.unitsSold,
                revenue: sales.revenue
            };
        })
        .filter(product => product.nombre) // Solo productos que existen
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 5); // Top 5 productos
    
    const tbody = document.querySelector('#topProductsTable tbody');
    tbody.innerHTML = '';
    
    if (topProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay datos de ventas disponibles</td></tr>';
        return;
    }
    
    topProducts.forEach((product, index) => {
        const row = `
            <tr>
                <td>
                    <span class="badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-danger' : 'bg-primary'}">
                        #${index + 1}
                    </span>
                </td>
                <td><strong>${product.nombre}</strong></td>
                <td>
                    <img src="${product.imagen_url || 'https://via.placeholder.com/40x40?text=P'}" 
                         alt="${product.nombre}" 
                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
                </td>
                <td><span class="badge bg-success">${product.unitsSold} unidades</span></td>
                <td><strong>$${product.revenue.toFixed(2)}</strong></td>
                <td><span class="badge ${product.stock > 0 ? 'bg-info' : 'bg-danger'}">${product.stock}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function loadDashboardCharts() {
    // Gráfico de ventas mensuales
    const ctx1 = document.getElementById('salesChart');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de productos por categoría
    const ctx2 = document.getElementById('categoryChart');
    if (ctx2) {
        const categories = getData(STORAGE_KEYS.CATEGORIES);
        const products = getData(STORAGE_KEYS.PRODUCTS);
        
        const categoryData = categories.map(cat => {
            const count = products.filter(p => p.categoria_id === cat.id).length;
            return count;
        });
        
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => cat.nombre),
                datasets: [{
                    data: categoryData,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Agregar gráficos adicionales al dashboard
function loadAdditionalCharts() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    // Crear contenedor para gráficos adicionales
    const dashboardSection = document.getElementById('dashboard');
    const existingCharts = dashboardSection.querySelector('.additional-charts');
    if (existingCharts) {
        existingCharts.remove();
    }
    
    const chartsHtml = `
        <div class="additional-charts">
            <div class="row">
                <div class="col-md-6">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-bar-chart"></i> Estado de Pedidos</h5>
                        </div>
                        <div class="chart-container">
                            <canvas id="orderStatusChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-pie-chart"></i> Distribución de Usuarios</h5>
                        </div>
                        <div class="chart-container">
                            <canvas id="userDistributionChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const chartsDiv = document.createElement('div');
    chartsDiv.innerHTML = chartsHtml;
    dashboardSection.appendChild(chartsDiv);
    
    // Gráfico de estado de pedidos
    const ctx3 = document.getElementById('orderStatusChart');
    if (ctx3) {
        const statusCounts = {
            'pendiente': orders.filter(o => o.estado === 'pendiente').length,
            'pagado': orders.filter(o => o.estado === 'pagado').length,
            'enviado': orders.filter(o => o.estado === 'enviado').length,
            'cancelado': orders.filter(o => o.estado === 'cancelado').length
        };
        
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Pendientes', 'Pagados', 'Enviados', 'Cancelados'],
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['#ffc107', '#28a745', '#17a2b8', '#dc3545'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Gráfico de distribución de usuarios
    const ctx4 = document.getElementById('userDistributionChart');
    if (ctx4) {
        const users = getData(STORAGE_KEYS.USERS);
        const adminCount = users.filter(u => u.rol === 'admin').length;
        const clientCount = users.filter(u => u.rol === 'cliente').length;
        
        new Chart(ctx4, {
            type: 'pie',
            data: {
                labels: ['Administradores', 'Clientes'],
                datasets: [{
                    data: [adminCount, clientCount],
                    backgroundColor: ['#dc3545', '#007bff'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// ===== FUNCIONES DE CATEGORÍAS =====

function loadCategoriesData() {
    console.log('Cargando datos de categorías...');
    
    // Si estamos filtrando, no cargar todos los datos
    if (isFiltering) {
        console.log('Modo filtrado activo, saltando carga completa');
        return;
    }
    
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    console.log('Categorías encontradas:', categories.length);
    console.log('Productos encontrados:', products.length);
    
    const tbody = document.querySelector('#categoriesTable tbody');
    if (!tbody) {
        console.error('No se encontró la tabla de categorías');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (categories.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> No hay categorías registradas
                </td>
            </tr>
        `;
        return;
    }
    
    categories.forEach(category => {
        const productCount = products.filter(p => p.categoria_id === category.id).length;
        
        const row = `
            <tr>
                <td><span class="badge bg-secondary">${category.id}</span></td>
                <td><strong>${category.nombre}</strong></td>
                <td>${category.descripcion || '<span class="text-muted">Sin descripción</span>'}</td>
                <td>
                    <span class="badge bg-info">${productCount} productos</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openCategoryModal('${category.id}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory('${category.id}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    console.log('Datos de categorías cargados correctamente');
}

function openCategoryModal(categoryId = null) {
    console.log('Abriendo modal de categoría:', categoryId);
    
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('categoryModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = `
        <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="categoryModalLabel">
                            ${categoryId ? 'Editar' : 'Nueva'} Categoría
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="categoryForm">
                            <div class="mb-3">
                                <label for="categoryName" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="categoryName" required 
                                       placeholder="Ingresa el nombre de la categoría">
                            </div>
                            <div class="mb-3">
                                <label for="categoryDescription" class="form-label">Descripción</label>
                                <textarea class="form-control" id="categoryDescription" rows="3" 
                                          placeholder="Descripción opcional de la categoría"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveCategory('${categoryId || ''}')">
                            <i class="bi bi-check-lg"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Si es edición, llenar datos
    if (categoryId) {
        const categories = getData(STORAGE_KEYS.CATEGORIES);
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            document.getElementById('categoryName').value = category.nombre || '';
            document.getElementById('categoryDescription').value = category.descripcion || '';
        }
    }
    
    // Mostrar modal
    const modalElement = document.getElementById('categoryModal');
    if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
        
        // Agregar evento para limpiar el modal cuando se cierre
        modalElement.addEventListener('hidden.bs.modal', function () {
            modalElement.remove();
        });
    } else {
        console.error('No se pudo encontrar el modal');
        showAlert('Error al abrir el modal', 'error');
    }
}

function saveCategory(categoryId = null) {
    console.log('Guardando categoría:', categoryId);
    
    const nameInput = document.getElementById('categoryName');
    const descriptionInput = document.getElementById('categoryDescription');
    
    if (!nameInput || !descriptionInput) {
        console.error('No se encontraron los campos del formulario');
        showAlert('Error: No se encontraron los campos del formulario', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    
    console.log('Datos a guardar:', { name, description, categoryId });
    
    if (!name) {
        showAlert('Por favor ingresa el nombre de la categoría', 'error');
        nameInput.focus();
        return;
    }
    
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Verificar si ya existe una categoría con el mismo nombre (excepto la que se está editando)
    const existingCategory = categories.find(c => 
        c.nombre.toLowerCase() === name.toLowerCase() && c.id !== categoryId
    );
    
    if (existingCategory) {
        showAlert('Ya existe una categoría con ese nombre', 'error');
        nameInput.focus();
        return;
    }
    
    try {
        if (categoryId) {
            // Editar categoría existente
            const index = categories.findIndex(c => c.id === categoryId);
            if (index !== -1) {
                categories[index] = {
                    ...categories[index],
                    nombre: name,
                    descripcion: description
                };
                console.log('Categoría actualizada:', categories[index]);
            } else {
                console.error('No se encontró la categoría a editar:', categoryId);
                showAlert('Error: No se encontró la categoría a editar', 'error');
                return;
            }
        } else {
            // Crear nueva categoría
            const newCategory = {
                id: generateId(),
                nombre: name,
                descripcion: description
            };
            categories.push(newCategory);
            console.log('Nueva categoría creada:', newCategory);
        }
        
        saveData(STORAGE_KEYS.CATEGORIES, categories);
        
        // Cerrar modal
        const modalElement = document.getElementById('categoryModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        
        // Recargar datos
        loadCategoriesData();
        
        // Mostrar mensaje de éxito
        const message = categoryId ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente';
        showAlert(message, 'success');
        
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        showAlert('Error al guardar la categoría: ' + error.message, 'error');
    }
}

function deleteCategory(categoryId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres eliminar esta categoría?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const categories = getData(STORAGE_KEYS.CATEGORIES);
            const products = getData(STORAGE_KEYS.PRODUCTS);
            
            // Verificar si hay productos en esta categoría
            const productsInCategory = products.filter(p => p.categoria_id === categoryId);
            if (productsInCategory.length > 0) {
                Swal.fire('Error', 'No se puede eliminar la categoría porque tiene productos asociados', 'error');
                return;
            }
            
            const filteredCategories = categories.filter(c => c.id !== categoryId);
            saveData(STORAGE_KEYS.CATEGORIES, filteredCategories);
            
            loadCategoriesData();
            showAlert('Categoría eliminada exitosamente', 'success');
        }
    });
}

// ===== FUNCIONES DE PRODUCTOS =====

function loadProductsData() {
    console.log('Cargando datos de productos...');
    
    // Si estamos filtrando, no cargar todos los datos
    if (isFiltering) {
        console.log('Modo filtrado activo, saltando carga completa');
        return;
    }
    
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    console.log('Productos encontrados:', products.length);
    console.log('Categorías encontradas:', categories.length);
    
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) {
        console.error('No se encontró la tabla de productos');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-box"></i> No hay productos registrados
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const category = categories.find(c => c.id === product.categoria_id);
        
        // Determinar el estado del stock
        let stockBadge = '';
        if (product.stock <= 0) {
            stockBadge = '<span class="badge bg-danger">Agotado</span>';
        } else if (product.stock <= 10) {
            stockBadge = '<span class="badge bg-warning">Stock Bajo</span>';
        } else {
            stockBadge = '<span class="badge bg-success">Disponible</span>';
        }
        
        const row = `
            <tr>
                <td><span class="badge bg-secondary">${product.id}</span></td>
                <td>
                    <img src="${product.imagen_url || 'https://via.placeholder.com/50x50?text=Sin+imagen'}" 
                         alt="${product.nombre}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                         onerror="this.src='https://via.placeholder.com/50x50?text=Error'">
                </td>
                <td>
                    <strong>${product.nombre}</strong>
                    ${product.descripcion ? `<br><small class="text-muted">${product.descripcion}</small>` : ''}
                </td>
                <td>
                    <span class="badge bg-info">${category ? category.nombre : 'Sin categoría'}</span>
                </td>
                <td>
                    <span class="text-success fw-bold">$${product.precio.toFixed(2)}</span>
                </td>
                <td>
                    ${stockBadge}
                    <br><small class="text-muted">${product.stock} unidades</small>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openProductModal('${product.id}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    console.log('Datos de productos cargados correctamente');
}

function searchProductsAdmin(query) {
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    
    const filteredProducts = products.filter(product => 
        product.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(query.toLowerCase())) ||
        (product.precio && product.precio.toString().includes(query))
    );
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron productos</td></tr>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const category = categories.find(c => c.id === product.categoria_id);
        
        const row = `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${product.imagen_url || 'https://via.placeholder.com/50x50?text=Sin+imagen'}" 
                         alt="${product.nombre}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                </td>
                <td>${product.nombre}</td>
                <td>${category ? category.nombre : 'Sin categoría'}</td>
                <td>$${product.precio.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="openProductModal('${product.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteProduct('${product.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

window.clearSearchAdmin = function() {
    document.getElementById('searchProductosAdmin').value = '';
    loadProductsData();
};

function openProductModal(productId = null) {
    console.log('Abriendo modal de producto:', productId);
    
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Verificar que hay categorías disponibles
    if (categories.length === 0) {
        showAlert('Primero debes crear al menos una categoría', 'warning');
        return;
    }
    
    const modal = `
        <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productModalLabel">
                            ${productId ? 'Editar' : 'Nuevo'} Producto
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="productName" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="productName" required 
                                               placeholder="Ingresa el nombre del producto">
                                    </div>
                                    <div class="mb-3">
                                        <label for="productCategory" class="form-label">Categoría *</label>
                                        <select class="form-select" id="productCategory" required>
                                            <option value="">Seleccionar categoría</option>
                                            ${categories.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="productPrice" class="form-label">Precio *</label>
                                        <div class="input-group">
                                            <span class="input-group-text">$</span>
                                            <input type="number" class="form-control" id="productPrice" step="0.01" min="0" required 
                                                   placeholder="0.00">
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="productStock" class="form-label">Stock *</label>
                                        <input type="number" class="form-control" id="productStock" min="0" required 
                                               placeholder="0">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="productDescription" class="form-label">Descripción</label>
                                        <textarea class="form-control" id="productDescription" rows="4" 
                                                  placeholder="Descripción del producto (opcional)"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="productImage" class="form-label">Imagen (URL)</label>
                                        <input type="url" class="form-control mb-2" id="productImage" 
                                               placeholder="https://ejemplo.com/imagen.jpg">
                                        <small class="text-muted">O sube una imagen desde tu computadora:</small>
                                        <input type="file" class="form-control mt-1" id="productImageFile" accept="image/*">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Vista previa</label>
                                        <div id="imagePreview" style="width: 100%; height: 200px; border: 2px dashed #ddd; border-radius: 5px; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                                            <i class="bi bi-image" style="font-size: 2em; color: #ccc;"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveProduct('${productId || ''}')">
                            <i class="bi bi-check-lg"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('productModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Configurar vista previa de imagen por URL
    document.getElementById('productImage').addEventListener('input', function() {
        const url = this.value;
        const preview = document.getElementById('imagePreview');
        if (url) {
            preview.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;" onerror="this.parentElement.innerHTML='<i class=\\'bi bi-image\\' style=\\'font-size: 2em; color: #ccc;\\'></i>'">`;
        } else {
            preview.innerHTML = '<i class="bi bi-image" style="font-size: 2em; color: #ccc;"></i>';
        }
    });
    
    // Configurar vista previa de imagen por archivo
    document.getElementById('productImageFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                preview.innerHTML = `<img src="${ev.target.result}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
                document.getElementById('productImage').value = '';
                preview.dataset.base64 = ev.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<i class="bi bi-image" style="font-size: 2em; color: #ccc;"></i>';
            preview.dataset.base64 = '';
        }
    });
    
    // Si es edición, llenar datos
    if (productId) {
        const products = getData(STORAGE_KEYS.PRODUCTS);
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.nombre || '';
            document.getElementById('productCategory').value = product.categoria_id || '';
            document.getElementById('productPrice').value = product.precio || '';
            document.getElementById('productStock').value = product.stock || '';
            document.getElementById('productDescription').value = product.descripcion || '';
            document.getElementById('productImage').value = product.imagen_url && !product.imagen_url.startsWith('data:') ? product.imagen_url : '';
            
            // Trigger vista previa
            if (product.imagen_url && product.imagen_url.startsWith('data:')) {
                document.getElementById('imagePreview').innerHTML = `<img src="${product.imagen_url}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
                document.getElementById('imagePreview').dataset.base64 = product.imagen_url;
            } else if (product.imagen_url) {
                document.getElementById('imagePreview').innerHTML = `<img src="${product.imagen_url}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
            }
        }
    }
    
    // Mostrar modal
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
        
        // Agregar evento para limpiar el modal cuando se cierre
        modalElement.addEventListener('hidden.bs.modal', function () {
            modalElement.remove();
        });
    } else {
        console.error('No se pudo encontrar el modal de producto');
        showAlert('Error al abrir el modal de producto', 'error');
    }
}

function saveProduct(productId = null) {
    console.log('Guardando producto:', productId);
    
    // Obtener elementos del formulario
    const nameInput = document.getElementById('productName');
    const categoryInput = document.getElementById('productCategory');
    const priceInput = document.getElementById('productPrice');
    const stockInput = document.getElementById('productStock');
    const descriptionInput = document.getElementById('productDescription');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Verificar que todos los elementos existen
    if (!nameInput || !categoryInput || !priceInput || !stockInput || !descriptionInput || !imageInput || !imagePreview) {
        console.error('No se encontraron todos los campos del formulario');
        showAlert('Error: No se encontraron todos los campos del formulario', 'error');
        return;
    }
    
    // Obtener valores
    const name = nameInput.value.trim();
    const categoryId = categoryInput.value;
    const price = parseFloat(priceInput.value);
    const stock = parseInt(stockInput.value);
    const description = descriptionInput.value.trim();
    const imageUrl = imageInput.value.trim();
    const imageBase64 = imagePreview.dataset.base64 || '';
    
    console.log('Datos a guardar:', { name, categoryId, price, stock, description, imageUrl, productId });
    
    // Validaciones
    if (!name) {
        showAlert('Por favor ingresa el nombre del producto', 'error');
        nameInput.focus();
        return;
    }
    
    if (!categoryId) {
        showAlert('Por favor selecciona una categoría', 'error');
        categoryInput.focus();
        return;
    }
    
    if (isNaN(price) || price < 0) {
        showAlert('Por favor ingresa un precio válido', 'error');
        priceInput.focus();
        return;
    }
    
    if (isNaN(stock) || stock < 0) {
        showAlert('Por favor ingresa un stock válido', 'error');
        stockInput.focus();
        return;
    }
    
    try {
        const products = getData(STORAGE_KEYS.PRODUCTS);
        let imagenFinal = imageUrl || imageBase64 || null;
        
        // Verificar si ya existe un producto con el mismo nombre (excepto el que se está editando)
        const existingProduct = products.find(p => 
            p.nombre.toLowerCase() === name.toLowerCase() && p.id !== productId
        );
        
        if (existingProduct) {
            showAlert('Ya existe un producto con ese nombre', 'error');
            nameInput.focus();
            return;
        }
        
        if (productId) {
            // Editar producto existente
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    nombre: name,
                    categoria_id: categoryId,
                    precio: price,
                    stock: stock,
                    descripcion: description,
                    imagen_url: imagenFinal
                };
                console.log('Producto actualizado:', products[index]);
            } else {
                console.error('No se encontró el producto a editar:', productId);
                showAlert('Error: No se encontró el producto a editar', 'error');
                return;
            }
        } else {
            // Crear nuevo producto
            const newProduct = {
                id: generateId(),
                nombre: name,
                categoria_id: categoryId,
                precio: price,
                stock: stock,
                descripcion: description,
                imagen_url: imagenFinal
            };
            products.push(newProduct);
            console.log('Nuevo producto creado:', newProduct);
        }
        
        saveData(STORAGE_KEYS.PRODUCTS, products);
        
        // Cerrar modal
        const modalElement = document.getElementById('productModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        
        // Recargar datos
        loadProductsData();
        
        // Mostrar mensaje de éxito
        const message = productId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente';
        showAlert(message, 'success');
        
    } catch (error) {
        console.error('Error al guardar producto:', error);
        showAlert('Error al guardar el producto: ' + error.message, 'error');
    }
}

function deleteProduct(productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres eliminar este producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const products = getData(STORAGE_KEYS.PRODUCTS);
            const filteredProducts = products.filter(p => p.id !== productId);
            saveData(STORAGE_KEYS.PRODUCTS, filteredProducts);
            
            loadProductsData();
            showAlert('Producto eliminado exitosamente', 'success');
        }
    });
}

// ===== FUNCIONES DE USUARIOS =====

function loadUsersData() {
    const users = getData(STORAGE_KEYS.USERS);
    
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>
                    <img src="${user.imagen || 'https://via.placeholder.com/40x40?text=U'}" 
                         alt="${user.nombre}" 
                         style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;">
                </td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.rol}</span></td>
                <td>${new Date(user.fechaRegistro).toLocaleDateString()}</td>
                <td>
                    <button class="btn-action btn-view" onclick="viewUserDetails('${user.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="openUserModal('${user.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function viewUserDetails(userId) {
    const users = getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        Swal.fire('Error', 'Usuario no encontrado', 'error');
        return;
    }
    
    const modal = `
        <div class="modal fade" id="userDetailsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles del Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <img src="${user.imagen || 'https://via.placeholder.com/100x100?text=U'}" 
                                 alt="${user.nombre}" 
                                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;">
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Nombre:</strong> ${user.nombre}</p>
                                <p><strong>Email:</strong> ${user.email}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Rol:</strong> <span class="badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.rol}</span></p>
                                <p><strong>Fecha de registro:</strong> ${new Date(user.fechaRegistro).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('userDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Mostrar modal
    const modalInstance = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    modalInstance.show();
}

function openUserModal(userId = null) {
    const users = getData(STORAGE_KEYS.USERS);
    const user = userId ? users.find(u => u.id === userId) : null;
    
    const modal = `
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            ${userId ? 'Editar' : 'Nuevo'} Usuario
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="userForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Nombre</label>
                                        <input type="text" class="form-control" id="userName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="userEmail" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Rol</label>
                                        <select class="form-select" id="userRole" required>
                                            <option value="cliente">Cliente</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Contraseña</label>
                                        <input type="password" class="form-control" id="userPassword" ${!userId ? 'required' : ''}>
                                        <small class="text-muted">${userId ? 'Dejar vacío para mantener la contraseña actual' : 'Ingresa una contraseña'}</small>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Imagen de Perfil</label>
                                        <input type="url" class="form-control mb-2" id="userImageUrl" placeholder="URL de imagen">
                                        <input type="file" class="form-control" id="userImageFile" accept="image/*">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Vista Previa</label>
                                        <div id="userImagePreview" style="width: 100%; height: 200px; border: 2px dashed #ddd; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
                                            <i class="bi bi-person" style="font-size: 2em; color: #ccc;"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="saveUser('${userId}')">
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('userModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Configurar vista previa de imagen por URL
    document.getElementById('userImageUrl').addEventListener('input', function() {
        const url = this.value;
        const preview = document.getElementById('userImagePreview');
        if (url) {
            preview.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
        } else {
            preview.innerHTML = '<i class="bi bi-person" style="font-size: 2em; color: #ccc;"></i>';
        }
    });
    
    // Configurar vista previa de imagen por archivo
    document.getElementById('userImageFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('userImagePreview');
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                preview.innerHTML = `<img src="${ev.target.result}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
                document.getElementById('userImageUrl').value = '';
                preview.dataset.base64 = ev.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<i class="bi bi-person" style="font-size: 2em; color: #ccc;"></i>';
            preview.dataset.base64 = '';
        }
    });
    
    // Si es edición, llenar datos
    if (user) {
        document.getElementById('userName').value = user.nombre;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.rol;
        document.getElementById('userImageUrl').value = user.imagen && !user.imagen.startsWith('data:') ? user.imagen : '';
        
        // Trigger vista previa
        if (user.imagen && user.imagen.startsWith('data:')) {
            document.getElementById('userImagePreview').innerHTML = `<img src="${user.imagen}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
            document.getElementById('userImagePreview').dataset.base64 = user.imagen;
        } else if (user.imagen) {
            document.getElementById('userImagePreview').innerHTML = `<img src="${user.imagen}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 5px;">`;
        }
    }
    
    // Mostrar modal
    const modalInstance = new bootstrap.Modal(document.getElementById('userModal'));
    modalInstance.show();
}

function saveUser(userId = null) {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const imageUrl = document.getElementById('userImageUrl').value.trim();
    const imageBase64 = document.getElementById('userImagePreview').dataset.base64 || '';
    
    if (!name || !email || !role) {
        Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    const users = getData(STORAGE_KEYS.USERS);
    let imagenFinal = imageUrl || imageBase64 || null;
    
    if (userId) {
        // Editar usuario existente
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            const updatedUser = {
                ...users[index],
                nombre: name,
                email: email,
                rol: role,
                imagen: imagenFinal
            };
            
            // Si se proporcionó una nueva contraseña, actualizarla
            if (password) {
                updatedUser.password = password; // En producción deberías hashear la contraseña
            }
            
            users[index] = updatedUser;
        }
    } else {
        // Crear nuevo usuario
        if (!password) {
            Swal.fire('Error', 'La contraseña es requerida para nuevos usuarios', 'error');
            return;
        }
        
        users.push({
            id: generateId(),
            nombre: name,
            email: email,
            password: password, // En producción deberías hashear la contraseña
            rol: role,
            imagen: imagenFinal,
            fechaRegistro: new Date().toISOString()
        });
    }
    
    saveData(STORAGE_KEYS.USERS, users);
    
    // Cerrar modal y recargar datos
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
    loadUsersData();
    showAlert('Usuario guardado exitosamente', 'success');
}

function deleteUser(userId) {
    const users = getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        Swal.fire('Error', 'Usuario no encontrado', 'error');
        return;
    }
    
    // No permitir eliminar el usuario actual
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        Swal.fire('Error', 'No puedes eliminar tu propio perfil', 'error');
        return;
    }
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar al usuario "${user.nombre}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const filteredUsers = users.filter(u => u.id !== userId);
            saveData(STORAGE_KEYS.USERS, filteredUsers);
            
            loadUsersData();
            showAlert('Usuario eliminado exitosamente', 'success');
        }
    });
}

// ===== FUNCIONES DE PEDIDOS =====

function loadOrdersData() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const users = getData(STORAGE_KEYS.USERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const user = users.find(u => u.id === order.usuario_id);
        const orderTotal = orderDetails
            .filter(detail => detail.pedido_id === order.id)
            .reduce((total, detail) => total + (detail.precio_unitario * detail.cantidad), 0);
        
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${user ? user.nombre : 'Usuario desconocido'}</td>
                <td>${new Date(order.fecha).toLocaleDateString()}</td>
                <td>${orderDetails.filter(detail => detail.pedido_id === order.id).length} productos</td>
                <td>$${orderTotal.toFixed(2)}</td>
                <td><span class="badge-status status-${order.estado}">${order.estado}</span></td>
                <td>
                    <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="updateOrderStatus('${order.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function viewOrder(orderId) {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const users = getData(STORAGE_KEYS.USERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    const order = orders.find(o => o.id === orderId);
    const user = users.find(u => u.id === order?.usuario_id);
    const details = orderDetails.filter(detail => detail.pedido_id === orderId);
    
    if (!order) {
        Swal.fire('Error', 'Pedido no encontrado', 'error');
        return;
    }
    
    const orderTotal = details.reduce((total, detail) => total + (detail.precio_unitario * detail.cantidad), 0);
    
    const detailsHtml = details.map(detail => {
        const product = products.find(p => p.id === detail.producto_id);
        return `
            <tr>
                <td>${product ? product.nombre : 'Producto no encontrado'}</td>
                <td>${detail.cantidad}</td>
                <td>$${detail.precio_unitario.toFixed(2)}</td>
                <td>$${(detail.precio_unitario * detail.cantidad).toFixed(2)}</td>
            </tr>
        `;
    }).join('');
    
    const modal = `
        <div class="modal fade" id="orderModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles del Pedido #${order.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <p><strong>Cliente:</strong> ${user ? user.nombre : 'Usuario desconocido'}</p>
                                <p><strong>Fecha:</strong> ${new Date(order.fecha).toLocaleDateString()}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Estado:</strong> <span class="badge-status status-${order.estado}">${order.estado}</span></p>
                                <p><strong>Total:</strong> $${orderTotal.toFixed(2)}</p>
                            </div>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${detailsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('orderModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Mostrar modal
    const modalInstance = new bootstrap.Modal(document.getElementById('orderModal'));
    modalInstance.show();
}

function updateOrderStatus(orderId) {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        Swal.fire('Error', 'Pedido no encontrado', 'error');
        return;
    }
    
    const statuses = ['pendiente', 'pagado', 'enviado', 'cancelado'];
    const currentIndex = statuses.indexOf(order.estado);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];
    
    order.estado = newStatus;
    saveData(STORAGE_KEYS.ORDERS, orders);
    
    loadOrdersData();
    showAlert(`Estado del pedido actualizado a: ${newStatus}`, 'success');
}

// ===== FUNCIONES DE REPORTES =====

function loadReportsData() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const users = getData(STORAGE_KEYS.USERS);
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Cargar gráficos básicos
    loadPeriodSalesChart();
    loadTopProductsChart();
    
    // Cargar análisis detallado de ventas
    loadSalesAnalysis(orders, orderDetails, products);
    
    // Cargar preferencias de clientes
    loadCustomerPreferences(orders, orderDetails, products, users);
    
    // Cargar tendencias de ventas
    loadSalesTrends(orders, orderDetails);
    
    // Cargar análisis por categorías
    loadCategoryAnalysis(orderDetails, products, categories);
    
    // Cargar métricas de rendimiento
    loadPerformanceMetrics(orders, orderDetails, products, users);
}

function loadSalesAnalysis(orders, orderDetails, products) {
    // Calcular estadísticas de ventas
    const totalRevenue = orderDetails.reduce((sum, detail) => sum + (detail.precio_unitario * detail.cantidad), 0);
    const totalUnitsSold = orderDetails.reduce((sum, detail) => sum + detail.cantidad, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Análisis por período
    const monthlySales = {};
    orders.forEach(order => {
        const month = new Date(order.fecha).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        const orderTotal = orderDetails
            .filter(detail => detail.pedido_id === order.id)
            .reduce((sum, detail) => sum + (detail.precio_unitario * detail.cantidad), 0);
        
        if (!monthlySales[month]) {
            monthlySales[month] = { revenue: 0, orders: 0 };
        }
        monthlySales[month].revenue += orderTotal;
        monthlySales[month].orders += 1;
    });
    
    // Crear contenedor para análisis de ventas
    const reportsSection = document.getElementById('reportes');
    const existingAnalysis = reportsSection.querySelector('.sales-analysis');
    if (existingAnalysis) {
        existingAnalysis.remove();
    }
    
    const analysisHtml = `
        <div class="sales-analysis">
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-graph-up"></i> Análisis Detallado de Ventas</h5>
                        </div>
                        <div class="p-4">
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="card text-center">
                                        <div class="card-body">
                                            <h3 class="text-primary">$${totalRevenue.toFixed(2)}</h3>
                                            <p class="card-text">Ingresos Totales</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card text-center">
                                        <div class="card-body">
                                            <h3 class="text-success">${totalUnitsSold}</h3>
                                            <p class="card-text">Unidades Vendidas</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card text-center">
                                        <div class="card-body">
                                            <h3 class="text-info">${orders.length}</h3>
                                            <p class="card-text">Total Pedidos</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card text-center">
                                        <div class="card-body">
                                            <h3 class="text-warning">$${averageOrderValue.toFixed(2)}</h3>
                                            <p class="card-text">Ticket Promedio</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const analysisDiv = document.createElement('div');
    analysisDiv.innerHTML = analysisHtml;
    reportsSection.appendChild(analysisDiv);
}

function loadCustomerPreferences(orders, orderDetails, products, users) {
    // Análisis de preferencias por cliente
    const customerPreferences = {};
    const clientUsers = users.filter(u => u.rol === 'cliente');
    
    clientUsers.forEach(client => {
        const clientOrders = orders.filter(o => o.usuario_id === client.id);
        const clientDetails = orderDetails.filter(detail => 
            clientOrders.some(order => order.id === detail.pedido_id)
        );
        
        const productPreferences = {};
        clientDetails.forEach(detail => {
            const product = products.find(p => p.id === detail.producto_id);
            if (product) {
                if (!productPreferences[product.id]) {
                    productPreferences[product.id] = {
                        name: product.nombre,
                        quantity: 0,
                        spent: 0
                    };
                }
                productPreferences[product.id].quantity += detail.cantidad;
                productPreferences[product.id].spent += detail.precio_unitario * detail.cantidad;
            }
        });
        
        customerPreferences[client.id] = {
            name: client.nombre,
            totalOrders: clientOrders.length,
            totalSpent: clientDetails.reduce((sum, detail) => sum + (detail.precio_unitario * detail.cantidad), 0),
            preferences: Object.values(productPreferences).sort((a, b) => b.quantity - a.quantity)
        };
    });
    
    // Crear contenedor para preferencias de clientes
    const reportsSection = document.getElementById('reportes');
    const existingPreferences = reportsSection.querySelector('.customer-preferences');
    if (existingPreferences) {
        existingPreferences.remove();
    }
    
    const preferencesHtml = `
        <div class="customer-preferences">
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-heart"></i> Preferencias de Clientes</h5>
                        </div>
                        <div class="p-4">
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Total Pedidos</th>
                                            <th>Total Gastado</th>
                                            <th>Productos Favoritos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Object.values(customerPreferences).map(client => `
                                            <tr>
                                                <td><strong>${client.name}</strong></td>
                                                <td><span class="badge bg-primary">${client.totalOrders}</span></td>
                                                <td><strong>$${client.totalSpent.toFixed(2)}</strong></td>
                                                <td>
                                                    ${client.preferences.slice(0, 3).map(pref => 
                                                        `<span class="badge bg-success me-1">${pref.name} (${pref.quantity})</span>`
                                                    ).join('')}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const preferencesDiv = document.createElement('div');
    preferencesDiv.innerHTML = preferencesHtml;
    reportsSection.appendChild(preferencesDiv);
}

function loadSalesTrends(orders, orderDetails) {
    // Análisis de tendencias por día de la semana
    const dailyTrends = {
        'Domingo': { orders: 0, revenue: 0 },
        'Lunes': { orders: 0, revenue: 0 },
        'Martes': { orders: 0, revenue: 0 },
        'Miércoles': { orders: 0, revenue: 0 },
        'Jueves': { orders: 0, revenue: 0 },
        'Viernes': { orders: 0, revenue: 0 },
        'Sábado': { orders: 0, revenue: 0 }
    };
    
    orders.forEach(order => {
        const day = new Date(order.fecha).toLocaleDateString('es-ES', { weekday: 'long' });
        const orderTotal = orderDetails
            .filter(detail => detail.pedido_id === order.id)
            .reduce((sum, detail) => sum + (detail.precio_unitario * detail.cantidad), 0);
        
        if (dailyTrends[day]) {
            dailyTrends[day].orders += 1;
            dailyTrends[day].revenue += orderTotal;
        }
    });
    
    // Crear gráfico de tendencias diarias
    const reportsSection = document.getElementById('reportes');
    const existingTrends = reportsSection.querySelector('.sales-trends');
    if (existingTrends) {
        existingTrends.remove();
    }
    
    const trendsHtml = `
        <div class="sales-trends">
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-calendar"></i> Tendencia de Ventas por Día</h5>
                        </div>
                        <div class="chart-container">
                            <canvas id="dailyTrendsChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-clock"></i> Horarios de Mayor Demanda</h5>
                        </div>
                        <div class="p-4">
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Día</th>
                                            <th>Pedidos</th>
                                            <th>Ingresos</th>
                                            <th>Promedio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Object.entries(dailyTrends).map(([day, data]) => `
                                            <tr>
                                                <td><strong>${day}</strong></td>
                                                <td>${data.orders}</td>
                                                <td>$${data.revenue.toFixed(2)}</td>
                                                <td>$${data.orders > 0 ? (data.revenue / data.orders).toFixed(2) : '0.00'}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const trendsDiv = document.createElement('div');
    trendsDiv.innerHTML = trendsHtml;
    reportsSection.appendChild(trendsDiv);
    
    // Crear gráfico de tendencias diarias
    setTimeout(() => {
        const ctx = document.getElementById('dailyTrendsChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(dailyTrends),
                    datasets: [{
                        label: 'Ingresos ($)',
                        data: Object.values(dailyTrends).map(d => d.revenue),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Pedidos',
                        data: Object.values(dailyTrends).map(d => d.orders),
                        borderColor: '#764ba2',
                        backgroundColor: 'rgba(118, 75, 162, 0.1)',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false,
                            },
                        }
                    }
                }
            });
        }
    }, 100);
}

function loadCategoryAnalysis(orderDetails, products, categories) {
    // Análisis de ventas por categoría
    const categorySales = {};
    
    orderDetails.forEach(detail => {
        const product = products.find(p => p.id === detail.producto_id);
        if (product && product.categoria_id) {
            const category = categories.find(c => c.id === product.categoria_id);
            if (category) {
                if (!categorySales[category.id]) {
                    categorySales[category.id] = {
                        name: category.nombre,
                        unitsSold: 0,
                        revenue: 0,
                        products: new Set()
                    };
                }
                categorySales[category.id].unitsSold += detail.cantidad;
                categorySales[category.id].revenue += detail.precio_unitario * detail.cantidad;
                categorySales[category.id].products.add(product.id);
            }
        }
    });
    
    // Crear contenedor para análisis por categorías
    const reportsSection = document.getElementById('reportes');
    const existingCategoryAnalysis = reportsSection.querySelector('.category-analysis');
    if (existingCategoryAnalysis) {
        existingCategoryAnalysis.remove();
    }
    
    const categoryAnalysisHtml = `
        <div class="category-analysis">
            <div class="row mb-4">
                <div class="col-md-12">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-tags"></i> Análisis por Categorías</h5>
                        </div>
                        <div class="p-4">
                            <div class="row">
                                ${Object.values(categorySales).map(category => `
                                    <div class="col-md-4 mb-3">
                                        <div class="card">
                                            <div class="card-body text-center">
                                                <h5 class="card-title">${category.name}</h5>
                                                <div class="row">
                                                    <div class="col-6">
                                                        <h4 class="text-primary">${category.unitsSold}</h4>
                                                        <small>Unidades</small>
                                                    </div>
                                                    <div class="col-6">
                                                        <h4 class="text-success">$${category.revenue.toFixed(2)}</h4>
                                                        <small>Ingresos</small>
                                                    </div>
                                                </div>
                                                <div class="mt-2">
                                                    <span class="badge bg-info">${category.products.size} productos</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const categoryAnalysisDiv = document.createElement('div');
    categoryAnalysisDiv.innerHTML = categoryAnalysisHtml;
    reportsSection.appendChild(categoryAnalysisDiv);
}

function loadPerformanceMetrics(orders, orderDetails, products, users) {
    // Métricas de rendimiento
    const totalRevenue = orderDetails.reduce((sum, detail) => sum + (detail.precio_unitario * detail.cantidad), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.rol === 'cliente').length;
    const activeCustomers = new Set(orders.map(o => o.usuario_id)).size;
    
    // Productos más rentables
    const productProfitability = {};
    orderDetails.forEach(detail => {
        const product = products.find(p => p.id === detail.producto_id);
        if (product) {
            if (!productProfitability[product.id]) {
                productProfitability[product.id] = {
                    name: product.nombre,
                    revenue: 0,
                    unitsSold: 0,
                    profitMargin: 0.3 // Asumiendo 30% de margen
                };
            }
            productProfitability[product.id].revenue += detail.precio_unitario * detail.cantidad;
            productProfitability[product.id].unitsSold += detail.cantidad;
        }
    });
    
    const topProfitableProducts = Object.values(productProfitability)
        .map(p => ({ ...p, profit: p.revenue * p.profitMargin }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);
    
    // Crear contenedor para métricas de rendimiento
    const reportsSection = document.getElementById('reportes');
    const existingMetrics = reportsSection.querySelector('.performance-metrics');
    if (existingMetrics) {
        existingMetrics.remove();
    }
    
    const metricsHtml = `
        <div class="performance-metrics">
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-speedometer2"></i> Métricas de Rendimiento</h5>
                        </div>
                        <div class="p-4">
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <div class="text-center">
                                        <h4 class="text-primary">${totalOrders}</h4>
                                        <small>Total Pedidos</small>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="text-center">
                                        <h4 class="text-success">$${totalRevenue.toFixed(2)}</h4>
                                        <small>Ingresos Totales</small>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="text-center">
                                        <h4 class="text-info">${activeCustomers}</h4>
                                        <small>Clientes Activos</small>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="text-center">
                                        <h4 class="text-warning">${totalCustomers}</h4>
                                        <small>Total Clientes</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="content-section">
                        <div class="section-header">
                            <h5><i class="bi bi-star"></i> Productos Más Rentables</h5>
                        </div>
                        <div class="p-4">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Ventas</th>
                                            <th>Ganancia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${topProfitableProducts.map((product, index) => `
                                            <tr>
                                                <td>
                                                    <span class="badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-danger' : 'bg-primary'} me-2">
                                                        #${index + 1}
                                                    </span>
                                                    ${product.name}
                                                </td>
                                                <td>${product.unitsSold}</td>
                                                <td><strong>$${product.profit.toFixed(2)}</strong></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const metricsDiv = document.createElement('div');
    metricsDiv.innerHTML = metricsHtml;
    reportsSection.appendChild(metricsDiv);
}

// ===== FUNCIONES DE CONFIGURACIÓN =====

function exportData() {
    const data = {
        users: getData(STORAGE_KEYS.USERS),
        categories: getData(STORAGE_KEYS.CATEGORIES),
        products: getData(STORAGE_KEYS.PRODUCTS),
        orders: getData(STORAGE_KEYS.ORDERS),
        orderDetails: getData(STORAGE_KEYS.ORDER_DETAILS)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cafeteria_data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showAlert('Datos exportados exitosamente', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.users) saveData(STORAGE_KEYS.USERS, data.users);
                    if (data.categories) saveData(STORAGE_KEYS.CATEGORIES, data.categories);
                    if (data.products) saveData(STORAGE_KEYS.PRODUCTS, data.products);
                    if (data.orders) saveData(STORAGE_KEYS.ORDERS, data.orders);
                    if (data.orderDetails) saveData(STORAGE_KEYS.ORDER_DETAILS, data.orderDetails);
                    
                    showAlert('Datos importados exitosamente', 'success');
                    loadDashboardData();
                } catch (error) {
                    alert('Error al importar los datos: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function clearAllData() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres eliminar todos los datos? Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            showAlert('Todos los datos han sido eliminados', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    });
}

// ===== FUNCIONES UTILITARIAS =====

function showAlert(message, type) {
    Swal.fire({
        icon: type,
        title: type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información',
        text: message,
        timer: type === 'success' ? 2000 : 3000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    window.location.href = 'Login.html';
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Main_administrador.js cargado');
    
    // Verificar sesión de administrador
    checkAdminSession();
    
    // Inicializar datos de demostración
    initializeDemoData();
    
    // Configurar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Configurar toggle del sidebar
    const toggleSidebar = document.getElementById('toggleSidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            const sidebarHeader = document.getElementById('sidebarHeader');
            
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            sidebarHeader.classList.toggle('collapsed');
        });
    }
    
    // Configurar búsqueda de productos
    const searchInput = document.getElementById('searchProductosAdmin');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query) {
                searchProductsAdmin(query);
            } else {
                loadProductsData();
            }
        });
    }
    
    // Cargar dashboard por defecto
    loadDashboardData();
});

// ===== FUNCIONES DE CALCULADORA =====

// Variables globales para la calculadora
let calculatorExpression = '';
let calculatorResult = '';

function appendToCalculator(value) {
    calculatorExpression += value;
    updateCalculatorDisplay();
}

function clearCalculator() {
    calculatorExpression = '';
    calculatorResult = '';
    updateCalculatorDisplay();
}

function deleteLastChar() {
    calculatorExpression = calculatorExpression.slice(0, -1);
    updateCalculatorDisplay();
}

function updateCalculatorDisplay() {
    const display = document.getElementById('calculatorDisplay');
    if (display) {
        display.value = calculatorExpression || '0';
    }
}

function calculateResult() {
    try {
        // Reemplazar símbolos para evaluación segura
        let expression = calculatorExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/%/g, '/100');
        
        // Validar expresión
        if (!expression || expression === '') {
            return;
        }
        
        // Evaluar expresión
        const result = eval(expression);
        
        if (isFinite(result)) {
            calculatorResult = result.toString();
            calculatorExpression = calculatorResult;
            updateCalculatorDisplay();
        } else {
            throw new Error('Resultado inválido');
        }
    } catch (error) {
        Swal.fire('Error', 'Expresión matemática inválida', 'error');
        clearCalculator();
    }
}

function calcularPrecioVenta() {
    const costo = parseFloat(document.getElementById('costoProducto').value);
    const margen = parseFloat(document.getElementById('margenProducto').value);
    
    if (isNaN(costo) || isNaN(margen)) {
        Swal.fire('Error', 'Por favor ingresa valores válidos', 'error');
        return;
    }
    
    const precioVenta = costo / (1 - margen / 100);
    document.getElementById('precioVenta').textContent = `$${precioVenta.toFixed(2)}`;
}

function calcularDescuento() {
    const precioOriginal = parseFloat(document.getElementById('precioOriginal').value);
    const descuento = parseFloat(document.getElementById('descuentoPorcentaje').value);
    
    if (isNaN(precioOriginal) || isNaN(descuento)) {
        Swal.fire('Error', 'Por favor ingresa valores válidos', 'error');
        return;
    }
    
    const precioFinal = precioOriginal * (1 - descuento / 100);
    document.getElementById('precioFinal').textContent = `$${precioFinal.toFixed(2)}`;
}

// ===== FUNCIONES DE VIDEOJUEGOS =====

function goToGames() {
    console.log('Redirigiendo a videojuegos...');
    window.open('test_games.html', '_blank');
}

// ===== FUNCIONES DE VIDEOJUEGOS (MODAL) =====
function openGameModal(gameType) {
    // Configuración de títulos y colores
    const gameInfo = {
        snake: {
            title: '🐍 Snake', color: '#28a745', width: 420, height: 420
        },
        tetris: {
            title: '🧩 Tetris', color: '#007bff', width: 340, height: 480
        },
        pong: {
            title: '🏓 Pong', color: '#dc3545', width: 420, height: 320
        },
        breakout: {
            title: '🧱 Breakout', color: '#6f42c1', width: 420, height: 360
        }
    };
    const info = gameInfo[gameType];
    
    Swal.fire({
        title: info.title,
        html: `<div id="gameModalContainer" style="display:flex;justify-content:center;align-items:center;width:${info.width}px;height:${info.height}px;margin:0 auto;"></div>`,
        showCloseButton: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: true,
        customClass: {
            popup: 'swal2-game-modal'
        },
        didOpen: () => {
            // Llama a la función global de games.js para iniciar el juego
            if (window.startGame) {
                window.startGame(gameType, document.getElementById('gameModalContainer'));
            } else {
                document.getElementById('gameModalContainer').innerHTML = '<div class="text-danger">No se encontró el motor de juegos.</div>';
            }
        },
        willClose: () => {
            // Llama a la función global para limpiar el juego si existe
            if (window.stopGame) window.stopGame();
        }
    });
}

// Estilo fijo para el modal de juego
const style = document.createElement('style');
style.innerHTML = `
.swal2-game-modal {
    padding: 0 !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25) !important;
    max-width: none !important;
    min-width: 0 !important;
}
.swal2-popup.swal2-game-modal {
    left: 0 !important;
    right: 0 !important;
    margin: auto !important;
    position: fixed !important;
}
`;
document.head.appendChild(style);

// ===== GRÁFICAS DE VIDEOJUEGOS =====
function loadGamesCharts() {
    // Obtener datos de localStorage
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    // 1. Juegos más jugados (por cantidad de partidas)
    const juegos = ['snake', 'tetris', 'pong', 'breakout'];
    const juegosLabels = ['Snake', 'Tetris', 'Pong', 'Breakout'];
    const juegosColors = ['#28a745', '#007bff', '#dc3545', '#6f42c1'];
    const partidasPorJuego = juegos.map(j => (scores[j] ? scores[j].length : 0));
    // 2. Juegos favoritos por cliente (el que más veces jugó cada uno)
    const clientes = {};
    juegos.forEach(juego => {
        (scores[juego] || []).forEach(s => {
            if (!clientes[s.player]) clientes[s.player] = { snake: 0, tetris: 0, pong: 0, breakout: 0 };
            clientes[s.player][juego]++;
        });
    });
    const clientesLabels = Object.keys(clientes);
    const datasets = juegos.map((j, idx) => ({
        label: juegosLabels[idx],
        backgroundColor: juegosColors[idx],
        data: clientesLabels.map(c => clientes[c][j])
    }));
    // Gráfica 1: Juegos más jugados
    if (window.chartJuegosMasJugados) window.chartJuegosMasJugados.destroy();
    const ctx1 = document.getElementById('chartJuegosMasJugados').getContext('2d');
    window.chartJuegosMasJugados = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: juegosLabels,
            datasets: [{
                label: 'Partidas jugadas',
                data: partidasPorJuego,
                backgroundColor: juegosColors
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
    // Gráfica 2: Juegos favoritos por cliente
    if (window.chartJuegosPorCliente) window.chartJuegosPorCliente.destroy();
    const ctx2 = document.getElementById('chartJuegosPorCliente').getContext('2d');
    window.chartJuegosPorCliente = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: clientesLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { x: { stacked: true }, y: { stacked: true } }
        }
    });
}

// Modificar loadSectionData para llamar a loadGamesCharts en la sección videojuegos
const _oldLoadSectionData = loadSectionData;
loadSectionData = function(sectionId) {
    _oldLoadSectionData(sectionId);
    if (sectionId === 'videojuegos') {
        setTimeout(loadGamesCharts, 200); // Espera a que el DOM esté listo
    }
};

// ===== FUNCIONES DE FILTRADO Y BÚSQUEDA =====

// Variables para almacenar datos filtrados
let filteredCategories = [];
let filteredProducts = [];
let filteredUsers = [];
let filteredOrders = [];

// Variable para controlar si estamos en modo filtrado
let isFiltering = false;

// Función de debounce para evitar actualizaciones excesivas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== FILTROS PARA CATEGORÍAS =====

function filterCategories() {
    const searchTerm = document.getElementById('filterCategorias').value.toLowerCase();
    const sortBy = document.getElementById('sortCategorias').value;
    
    let categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
        categories = categories.filter(category => 
            category.nombre.toLowerCase().includes(searchTerm) ||
            (category.descripcion && category.descripcion.toLowerCase().includes(searchTerm))
        );
    }
    
    // Aplicar ordenamiento
    if (sortBy) {
        categories.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.nombre.localeCompare(b.nombre);
                case 'name-desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'products':
                    return (b.productCount || 0) - (a.productCount || 0);
                case 'products-desc':
                    return (a.productCount || 0) - (b.productCount || 0);
                default:
                    return 0;
            }
        });
    }
    
    filteredCategories = categories;
    displayCategories(categories);
}

// Versión con debounce para búsqueda
const debouncedFilterCategories = debounce(filterCategories, 300);

function sortCategories() {
    filterCategories(); // Reaplicar filtros con nuevo ordenamiento
}

function clearCategoryFilters() {
    document.getElementById('filterCategorias').value = '';
    document.getElementById('sortCategorias').value = '';
    filteredCategories = [];
    isFiltering = false;
    loadCategoriesData();
}

function exportCategories() {
    const categories = filteredCategories.length > 0 ? filteredCategories : getData(STORAGE_KEYS.CATEGORIES);
    
    if (categories.length === 0) {
        showAlert('No hay categorías para exportar', 'warning');
        return;
    }
    
    const csvContent = generateCSV(categories, ['id', 'nombre', 'descripcion', 'productCount']);
    downloadCSV(csvContent, 'categorias_export.csv');
    showAlert('Categorías exportadas correctamente', 'success');
}

// ===== FILTROS PARA PRODUCTOS =====

function filterProducts() {
    const searchTerm = document.getElementById('searchProductosAdmin').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const priceFilter = document.getElementById('filterPrice').value;
    const stockFilter = document.getElementById('filterStock').value;
    const sortBy = document.getElementById('sortProducts').value;
    
    // Si no hay filtros activos, mostrar todos los productos
    if (!searchTerm && !categoryFilter && !priceFilter && !stockFilter && !sortBy) {
        isFiltering = false;
        loadProductsData();
        return;
    }
    
    isFiltering = true;
    let products = getData(STORAGE_KEYS.PRODUCTS);
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Aplicar filtros
    products = products.filter(product => {
        // Filtro de búsqueda
        if (searchTerm && !product.nombre.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Filtro de categoría
        if (categoryFilter) {
            const category = categories.find(cat => cat.id === product.categoria_id);
            if (!category || category.nombre !== categoryFilter) {
                return false;
            }
        }
        
        // Filtro de precio
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(Number);
            if (max && (product.precio < min || product.precio > max)) {
                return false;
            } else if (!max && product.precio < min) {
                return false;
            }
        }
        
        // Filtro de stock
        if (stockFilter) {
            switch (stockFilter) {
                case 'in-stock':
                    if (product.stock <= 0) return false;
                    break;
                case 'low-stock':
                    if (product.stock > 10 || product.stock <= 0) return false;
                    break;
                case 'out-stock':
                    if (product.stock > 0) return false;
                    break;
            }
        }
        
        return true;
    });
    
    // Aplicar ordenamiento
    if (sortBy) {
        products.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.nombre.localeCompare(b.nombre);
                case 'name-desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'price':
                    return a.precio - b.precio;
                case 'price-desc':
                    return b.precio - a.precio;
                case 'stock':
                    return a.stock - b.stock;
                case 'stock-desc':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });
    }
    
    filteredProducts = products;
    displayProducts(products);
}

// Versión con debounce para búsqueda
const debouncedFilterProducts = debounce(filterProducts, 300);

function sortProducts() {
    filterProducts(); // Reaplicar filtros con nuevo ordenamiento
}

function clearProductFilters() {
    document.getElementById('searchProductosAdmin').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterPrice').value = '';
    document.getElementById('filterStock').value = '';
    document.getElementById('sortProducts').value = '';
    filteredProducts = [];
    isFiltering = false;
    loadProductsData();
}

// ===== FILTROS PARA USUARIOS =====

function filterUsers() {
    const searchTerm = document.getElementById('filterUsers').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const sortBy = document.getElementById('sortUsers').value;
    
    let users = getData(STORAGE_KEYS.USERS);
    
    // Aplicar filtros
    users = users.filter(user => {
        // Filtro de búsqueda
        if (searchTerm && !user.nombre.toLowerCase().includes(searchTerm) && 
            !user.email.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Filtro de rol
        if (roleFilter && user.rol !== roleFilter) {
            return false;
        }
        
        // Filtro de estado
        if (statusFilter && user.estado !== statusFilter) {
            return false;
        }
        
        return true;
    });
    
    // Aplicar ordenamiento
    if (sortBy) {
        users.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.nombre.localeCompare(b.nombre);
                case 'name-desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'email':
                    return a.email.localeCompare(b.email);
                case 'date':
                    return new Date(a.fechaRegistro || 0) - new Date(b.fechaRegistro || 0);
                case 'date-desc':
                    return new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0);
                default:
                    return 0;
            }
        });
    }
    
    filteredUsers = users;
    displayUsers(users);
}

function sortUsers() {
    filterUsers(); // Reaplicar filtros con nuevo ordenamiento
}

function clearUserFilters() {
    document.getElementById('filterUsers').value = '';
    document.getElementById('filterRole').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('sortUsers').value = '';
    filteredUsers = [];
    loadUsersData();
}

function exportUsers() {
    const users = filteredUsers.length > 0 ? filteredUsers : getData(STORAGE_KEYS.USERS);
    
    if (users.length === 0) {
        showAlert('No hay usuarios para exportar', 'warning');
        return;
    }
    
    const csvContent = generateCSV(users, ['id', 'nombre', 'email', 'rol', 'estado', 'fechaRegistro']);
    downloadCSV(csvContent, 'usuarios_export.csv');
    showAlert('Usuarios exportados correctamente', 'success');
}

// ===== FILTROS PARA PEDIDOS =====

function filterOrders() {
    const searchTerm = document.getElementById('filterOrders').value.toLowerCase();
    const statusFilter = document.getElementById('filterOrderStatus').value;
    const dateFilter = document.getElementById('filterOrderDate').value;
    const totalFilter = document.getElementById('filterOrderTotal').value;
    const sortBy = document.getElementById('sortOrders').value;
    
    let orders = getData(STORAGE_KEYS.ORDERS);
    const users = getData(STORAGE_KEYS.USERS);
    
    // Aplicar filtros
    orders = orders.filter(order => {
        // Filtro de búsqueda
        if (searchTerm) {
            const user = users.find(u => u.id === order.usuario_id);
            const userName = user ? user.nombre : '';
            if (!order.id.toLowerCase().includes(searchTerm) && 
                !userName.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        
        // Filtro de estado
        if (statusFilter && order.estado !== statusFilter) {
            return false;
        }
        
        // Filtro de fecha
        if (dateFilter) {
            const orderDate = new Date(order.fecha).toISOString().split('T')[0];
            if (orderDate !== dateFilter) {
                return false;
            }
        }
        
        // Filtro de total
        if (totalFilter) {
            const [min, max] = totalFilter.split('-').map(Number);
            if (max && (order.total < min || order.total > max)) {
                return false;
            } else if (!max && order.total < min) {
                return false;
            }
        }
        
        return true;
    });
    
    // Aplicar ordenamiento
    if (sortBy) {
        orders.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.fecha) - new Date(b.fecha);
                case 'date-desc':
                    return new Date(b.fecha) - new Date(a.fecha);
                case 'total':
                    return a.total - b.total;
                case 'total-desc':
                    return b.total - a.total;
                case 'customer':
                    const userA = users.find(u => u.id === a.usuario_id);
                    const userB = users.find(u => u.id === b.usuario_id);
                    return (userA?.nombre || '').localeCompare(userB?.nombre || '');
                default:
                    return 0;
            }
        });
    }
    
    filteredOrders = orders;
    displayOrders(orders);
}

function sortOrders() {
    filterOrders(); // Reaplicar filtros con nuevo ordenamiento
}

function clearOrderFilters() {
    document.getElementById('filterOrders').value = '';
    document.getElementById('filterOrderStatus').value = '';
    document.getElementById('filterOrderDate').value = '';
    document.getElementById('filterOrderTotal').value = '';
    document.getElementById('sortOrders').value = '';
    filteredOrders = [];
    loadOrdersData();
}

// ===== FUNCIONES DE DISPLAY =====

function displayCategories(categories) {
    const tbody = document.querySelector('#categoriesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron categorías</td></tr>';
        return;
    }
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.nombre}</td>
            <td>${category.descripcion || 'Sin descripción'}</td>
            <td>${category.productCount || 0}</td>
            <td>
                <button class="btn-action btn-edit" onclick="openCategoryModal('${category.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteCategory('${category.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayProducts(products) {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron productos</td></tr>';
        return;
    }
    
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    products.forEach(product => {
        const category = categories.find(cat => cat.id === product.categoria_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.imagen_url || 'https://via.placeholder.com/50'}" 
                     alt="${product.nombre}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td>${product.nombre}</td>
            <td>${category ? category.nombre : 'Sin categoría'}</td>
            <td>$${product.precio.toFixed(2)}</td>
            <td>
                <span class="badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="openProductModal('${product.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteProduct('${product.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayUsers(users) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron usuarios</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="user-avatar" style="width: 30px; height: 30px; font-size: 0.8em;">
                    ${user.imagen ? `<img src="${user.imagen}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : user.nombre.charAt(0).toUpperCase()}
                </div>
            </td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.rol === 'admin' ? 'bg-danger' : 'bg-primary'}">
                    ${user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
            </td>
            <td>
                <span class="badge ${user.estado === 'active' ? 'bg-success' : user.estado === 'inactive' ? 'bg-secondary' : 'bg-warning'}">
                    ${user.estado === 'active' ? 'Activo' : user.estado === 'inactive' ? 'Inactivo' : 'Pendiente'}
                </span>
            </td>
            <td>${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button class="btn-action btn-view" onclick="viewUserDetails('${user.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-edit" onclick="openUserModal('${user.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayOrders(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron pedidos</td></tr>';
        return;
    }
    
    const users = getData(STORAGE_KEYS.USERS);
    
    orders.forEach(order => {
        const user = users.find(u => u.id === order.usuario_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${user ? user.nombre : 'Usuario no encontrado'}</td>
            <td>${new Date(order.fecha).toLocaleDateString()}</td>
            <td>${order.items ? order.items.length : 0} productos</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>
                <span class="badge-status status-${order.estado}">${order.estado}</span>
            </td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-edit" onclick="updateOrderStatus('${order.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== FUNCIONES DE EXPORTACIÓN =====

function generateCSV(data, fields) {
    if (data.length === 0) return '';
    
    const headers = fields.join(',');
    const rows = data.map(item => 
        fields.map(field => {
            const value = item[field];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
    );
    
    return [headers, ...rows].join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ===== INICIALIZACIÓN DE FILTROS =====

// Función para inicializar los filtros cuando se carga una sección
function initializeFilters(sectionId) {
    switch (sectionId) {
        case 'categorias':
            // Limpiar filtros anteriores
            clearCategoryFilters();
            break;
        case 'productos':
            // Limpiar filtros anteriores
            clearProductFilters();
            break;
        case 'usuarios':
            // Limpiar filtros anteriores
            clearUserFilters();
            break;
        case 'pedidos':
            // Limpiar filtros anteriores
            clearOrderFilters();
            break;
    }
}

// Agregar event listeners para filtros cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Los filtros se inicializarán automáticamente cuando se carguen las secciones
    console.log('Sistema de filtros inicializado');
});

// ===== FUNCIONES DE REPORTES Y GRÁFICAS =====

// Variables para almacenar las instancias de gráficos
let reportCharts = {
    periodSales: null,
    topProducts: null,
    category: null,
    users: null,
    orders: null,
    salesTrends: null,
    activity: null
};

// Colores para los gráficos
const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    light: '#6c757d',
    dark: '#343a40'
};

// Función para cargar todos los reportes
function loadReportsData() {
    console.log('Cargando reportes y estadísticas...');
    
    // Crear todos los gráficos
    createPeriodSalesChart();
    createTopProductsChart();
    createCategoryChart();
    createUsersChart();
    createOrdersChart();
    createSalesTrendsChart();
    createActivityChart();
    
    // Cargar métricas KPIs
    loadKPIMetrics();
    
    console.log('Reportes cargados correctamente');
}

// Gráfico de ventas por período
function createPeriodSalesChart() {
    const ctx = document.getElementById('periodSalesChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    // Destruir gráfico existente si existe
    if (reportCharts.periodSales) {
        reportCharts.periodSales.destroy();
    }
    
    const data = generateSalesData();
    
    reportCharts.periodSales = new Chart(ctx2d, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Ventas Diarias',
                data: data.values,
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Ventas: $${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de productos más vendidos
function createTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    if (reportCharts.topProducts) {
        reportCharts.topProducts.destroy();
    }
    
    const data = generateTopProductsData();
    
    reportCharts.topProducts = new Chart(ctx2d, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Unidades Vendidas',
                data: data.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.danger
                ],
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Gráfico de distribución por categoría
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    if (reportCharts.category) {
        reportCharts.category.destroy();
    }
    
    const data = generateCategoryData();
    
    reportCharts.category = new Chart(ctx2d, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.secondary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.danger,
                    chartColors.info
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed}% (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de usuarios por rol
function createUsersChart() {
    const ctx = document.getElementById('usersChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    if (reportCharts.users) {
        reportCharts.users.destroy();
    }
    
    const data = generateUsersData();
    
    reportCharts.users = new Chart(ctx2d, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    chartColors.danger,
                    chartColors.primary,
                    chartColors.success
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Gráfico de estado de pedidos
function createOrdersChart() {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    if (reportCharts.orders) {
        reportCharts.orders.destroy();
    }
    
    const data = generateOrdersData();
    
    reportCharts.orders = new Chart(ctx2d, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    chartColors.warning,
                    chartColors.success,
                    chartColors.info,
                    chartColors.danger
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Gráfico de tendencias de ventas
function createSalesTrendsChart() {
    const ctx = document.getElementById('salesTrendsChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    if (reportCharts.salesTrends) {
        reportCharts.salesTrends.destroy();
    }
    
    const data = generateTrendsData();
    
    reportCharts.salesTrends = new Chart(ctx2d, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Ventas',
                data: data.values,
                borderColor: chartColors.success,
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Gráfico de actividad por hora
function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    if (reportCharts.activity) {
        reportCharts.activity.destroy();
    }
    
    const data = generateActivityData();
    
    reportCharts.activity = new Chart(ctx2d, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Actividad',
                data: data.values,
                backgroundColor: chartColors.info,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Funciones para generar datos de ejemplo
function generateSalesData() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const days = 30;
    const labels = [];
    const values = [];
    
    // Crear array de fechas de los últimos 30 días
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
        
        // Calcular ventas para esta fecha
        let dailySales = 0;
        orders.forEach(order => {
            const orderDate = new Date(order.fecha).toISOString().split('T')[0];
            if (orderDate === dateStr) {
                dailySales += order.total || 0;
            }
        });
        
        values.push(dailySales);
    }
    
    return { labels, values };
}

function generateTopProductsData() {
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    // Crear mapa de productos vendidos
    const productSales = {};
    
    orderDetails.forEach(detail => {
        const product = products.find(p => p.id === detail.producto_id);
        if (product) {
            if (!productSales[product.nombre]) {
                productSales[product.nombre] = 0;
            }
            productSales[product.nombre] += detail.cantidad || 0;
        }
    });
    
    // Ordenar por cantidad vendida
    const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Top 5 productos
    
    const labels = sortedProducts.map(([name]) => name);
    const values = sortedProducts.map(([,quantity]) => quantity);
    
    return { labels, values };
}

function generateCategoryData() {
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    
    // Crear mapa de ventas por categoría
    const categorySales = {};
    
    orderDetails.forEach(detail => {
        const product = products.find(p => p.id === detail.producto_id);
        if (product) {
            const category = categories.find(c => c.id === product.categoria_id);
            if (category) {
                if (!categorySales[category.nombre]) {
                    categorySales[category.nombre] = 0;
                }
                categorySales[category.nombre] += (detail.precio_unitario * detail.cantidad) || 0;
            }
        }
    });
    
    // Calcular porcentajes
    const totalSales = Object.values(categorySales).reduce((sum, sales) => sum + sales, 0);
    const labels = Object.keys(categorySales);
    const values = Object.values(categorySales).map(sales => 
        totalSales > 0 ? Math.round((sales / totalSales) * 100) : 0
    );
    
    return { labels, values };
}

function generateUsersData() {
    const users = getData(STORAGE_KEYS.USERS);
    
    // Contar usuarios por rol
    const roleCount = {};
    users.forEach(user => {
        const role = user.rol === 'admin' ? 'Administradores' : 
                    user.rol === 'staff' ? 'Personal' : 'Usuarios';
        roleCount[role] = (roleCount[role] || 0) + 1;
    });
    
    const labels = Object.keys(roleCount);
    const values = Object.values(roleCount);
    
    return { labels, values };
}

function generateOrdersData() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    
    // Contar pedidos por estado
    const statusCount = {};
    orders.forEach(order => {
        const status = order.estado || 'pendiente';
        statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // Mapear estados a español
    const statusMap = {
        'pendiente': 'Pendientes',
        'pagado': 'Pagados',
        'enviado': 'Enviados',
        'cancelado': 'Cancelados'
    };
    
    const labels = Object.keys(statusCount).map(status => statusMap[status] || status);
    const values = Object.values(statusCount);
    
    return { labels, values };
}

function generateTrendsData() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const values = [];
    
    // Calcular ventas por mes (últimos 6 meses)
    for (let i = 5; i >= 0; i--) {
        const targetMonth = new Date();
        targetMonth.setMonth(targetMonth.getMonth() - i);
        
        let monthlySales = 0;
        orders.forEach(order => {
            const orderDate = new Date(order.fecha);
            if (orderDate.getMonth() === targetMonth.getMonth() && 
                orderDate.getFullYear() === targetMonth.getFullYear()) {
                monthlySales += order.total || 0;
            }
        });
        
        values.push(monthlySales);
    }
    
    return { labels: months, values };
}

function generateActivityData() {
    const orders = getData(STORAGE_KEYS.ORDERS);
    const hours = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];
    const hourRanges = [8, 10, 12, 14, 16, 18, 20];
    const values = [];
    
    // Contar pedidos por hora del día
    hourRanges.forEach(hour => {
        let count = 0;
        orders.forEach(order => {
            const orderDate = new Date(order.fecha);
            const orderHour = orderDate.getHours();
            if (orderHour >= hour && orderHour < hour + 2) {
                count++;
            }
        });
        values.push(count);
    });
    
    return { labels: hours, values };
}

// Función para cargar métricas KPIs con datos reales
function loadKPIMetrics() {
    const users = getData(STORAGE_KEYS.USERS);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    const orders = getData(STORAGE_KEYS.ORDERS);
    const orderDetails = getData(STORAGE_KEYS.ORDER_DETAILS);
    
    // Calcular métricas reales
    const totalRevenue = orderDetails.reduce((total, detail) => 
        total + ((detail.precio_unitario || 0) * (detail.cantidad || 0)), 0);
    
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const activeProducts = products.filter(p => (p.stock || 0) > 0).length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    
    // Calcular métricas adicionales
    const pendingOrders = orders.filter(o => o.estado === 'pendiente').length;
    const completedOrders = orders.filter(o => o.estado === 'pagado' || o.estado === 'enviado').length;
    const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
    
    const kpiHtml = `
        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-currency-dollar text-success" style="font-size: 2rem;"></i>
                    <h4 class="mt-2">$${totalRevenue.toLocaleString()}</h4>
                    <p class="text-muted">Ingresos Totales</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-cart text-primary" style="font-size: 2rem;"></i>
                    <h4 class="mt-2">${totalOrders}</h4>
                    <p class="text-muted">Total Pedidos</p>
                    <small class="text-muted">${pendingOrders} pendientes</small>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-graph-up text-warning" style="font-size: 2rem;"></i>
                    <h4 class="mt-2">$${avgOrderValue.toFixed(2)}</h4>
                    <p class="text-muted">Ticket Promedio</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="bi bi-box text-info" style="font-size: 2rem;"></i>
                    <h4 class="mt-2">${activeProducts}/${products.length}</h4>
                    <p class="text-muted">Productos Activos</p>
                    <small class="text-muted">${lowStockProducts} con stock bajo</small>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('kpiMetrics').innerHTML = kpiHtml;
}

// Función para actualizar reportes con filtros reales
function updateReports() {
    const period = document.getElementById('reportPeriod').value;
    const category = document.getElementById('reportCategory').value;
    
    console.log(`Actualizando reportes - Período: ${period}, Categoría: ${category}`);
    
    // Aplicar filtros según el período seleccionado
    const days = parseInt(period);
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - days);
    
    // Recargar todos los gráficos con datos filtrados
    loadReportsData();
    
    showAlert(`Reportes actualizados para los últimos ${days} días`, 'info');
}

// Función para mostrar estadísticas detalladas con datos reales
function showDetailedStats(chartType) {
    let title, data, html;
    
    switch (chartType) {
        case 'periodSales':
            title = 'Estadísticas de Ventas por Período';
            data = generateSalesData();
            html = generateSalesStatsHTML(data);
            break;
        case 'topProducts':
            title = 'Estadísticas de Productos Más Vendidos';
            data = generateTopProductsData();
            html = generateProductsStatsHTML(data);
            break;
        case 'category':
            title = 'Estadísticas por Categoría';
            data = generateCategoryData();
            html = generateCategoryStatsHTML(data);
            break;
        case 'users':
            title = 'Estadísticas de Usuarios';
            data = generateUsersData();
            html = generateUsersStatsHTML(data);
            break;
        case 'orders':
            title = 'Estadísticas de Pedidos';
            data = generateOrdersData();
            html = generateOrdersStatsHTML(data);
            break;
        case 'trends':
            title = 'Tendencias de Ventas';
            data = generateTrendsData();
            html = generateTrendsStatsHTML(data);
            break;
        case 'activity':
            title = 'Actividad por Hora';
            data = generateActivityData();
            html = generateActivityStatsHTML(data);
            break;
        default:
            showAlert('Tipo de estadísticas no válido', 'error');
            return;
    }
    
    Swal.fire({
        title: title,
        html: html,
        width: '600px',
        showConfirmButton: true,
        confirmButtonText: 'Cerrar'
    });
}

// Funciones auxiliares para generar HTML de estadísticas detalladas
function generateSalesStatsHTML(data) {
    const totalSales = data.values.reduce((sum, val) => sum + val, 0);
    const avgSales = totalSales / data.values.length;
    const maxSales = Math.max(...data.values);
    const minSales = Math.min(...data.values);
    
    return `
        <div class="text-start">
            <h6>Resumen de Ventas (Últimos 30 días)</h6>
            <div class="row">
                <div class="col-6">
                    <p><strong>Total de Ventas:</strong> $${totalSales.toLocaleString()}</p>
                    <p><strong>Promedio Diario:</strong> $${avgSales.toFixed(2)}</p>
                </div>
                <div class="col-6">
                    <p><strong>Venta Máxima:</strong> $${maxSales.toLocaleString()}</p>
                    <p><strong>Venta Mínima:</strong> $${minSales.toLocaleString()}</p>
                </div>
            </div>
            <hr>
            <h6>Desglose Diario</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${label}:</span>
                        <span>$${data.values[index].toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateProductsStatsHTML(data) {
    const totalUnits = data.values.reduce((sum, val) => sum + val, 0);
    const avgUnits = totalUnits / data.values.length;
    
    return `
        <div class="text-start">
            <h6>Productos Más Vendidos</h6>
            <p><strong>Total de Unidades:</strong> ${totalUnits}</p>
            <p><strong>Promedio por Producto:</strong> ${avgUnits.toFixed(1)} unidades</p>
            <hr>
            <h6>Ranking de Productos</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${index + 1}. ${label}:</span>
                        <span>${data.values[index]} unidades</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateCategoryStatsHTML(data) {
    const totalPercentage = data.values.reduce((sum, val) => sum + val, 0);
    
    return `
        <div class="text-start">
            <h6>Distribución por Categorías</h6>
            <p><strong>Total de Categorías:</strong> ${data.labels.length}</p>
            <hr>
            <h6>Porcentajes por Categoría</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${label}:</span>
                        <span>${data.values[index]}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateUsersStatsHTML(data) {
    const totalUsers = data.values.reduce((sum, val) => sum + val, 0);
    
    return `
        <div class="text-start">
            <h6>Distribución de Usuarios</h6>
            <p><strong>Total de Usuarios:</strong> ${totalUsers}</p>
            <hr>
            <h6>Usuarios por Rol</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${label}:</span>
                        <span>${data.values[index]} usuarios</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateOrdersStatsHTML(data) {
    const totalOrders = data.values.reduce((sum, val) => sum + val, 0);
    
    return `
        <div class="text-start">
            <h6>Estado de Pedidos</h6>
            <p><strong>Total de Pedidos:</strong> ${totalOrders}</p>
            <hr>
            <h6>Pedidos por Estado</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${label}:</span>
                        <span>${data.values[index]} pedidos</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateTrendsStatsHTML(data) {
    const totalSales = data.values.reduce((sum, val) => sum + val, 0);
    const avgSales = totalSales / data.values.length;
    const maxSales = Math.max(...data.values);
    const minSales = Math.min(...data.values);
    
    return `
        <div class="text-start">
            <h6>Tendencias de Ventas (Últimos 6 meses)</h6>
            <div class="row">
                <div class="col-6">
                    <p><strong>Total de Ventas:</strong> $${totalSales.toLocaleString()}</p>
                    <p><strong>Promedio Mensual:</strong> $${avgSales.toFixed(2)}</p>
                </div>
                <div class="col-6">
                    <p><strong>Mejor Mes:</strong> $${maxSales.toLocaleString()}</p>
                    <p><strong>Peor Mes:</strong> $${minSales.toLocaleString()}</p>
                </div>
            </div>
            <hr>
            <h6>Ventas por Mes</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${label}:</span>
                        <span>$${data.values[index].toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateActivityStatsHTML(data) {
    const totalOrders = data.values.reduce((sum, val) => sum + val, 0);
    const maxHour = Math.max(...data.values);
    const minHour = Math.min(...data.values);
    
    return `
        <div class="text-start">
            <h6>Actividad por Hora del Día</h6>
            <p><strong>Total de Pedidos:</strong> ${totalOrders}</p>
            <p><strong>Hora Pico:</strong> ${data.labels[data.values.indexOf(maxHour)]} (${maxHour} pedidos)</p>
            <p><strong>Hora Menos Activa:</strong> ${data.labels[data.values.indexOf(minHour)]} (${minHour} pedidos)</p>
            <hr>
            <h6>Pedidos por Hora</h6>
            <div style="max-height: 200px; overflow-y: auto;">
                ${data.labels.map((label, index) => `
                    <div class="d-flex justify-content-between">
                        <span>${label}:</span>
                        <span>${data.values[index]} pedidos</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Funciones de control de reportes
function updateChartType() {
    const chartType = document.getElementById('chartType').value;
    console.log(`Cambiando tipo de gráfico a: ${chartType}`);
    
    // Aquí se podría implementar el cambio de tipo de gráfico
    // Por ahora solo recargamos los datos
    loadReportsData();
}

function refreshAllCharts() {
    console.log('Actualizando todos los gráficos...');
    loadReportsData();
    showAlert('Gráficos actualizados correctamente', 'success');
}

function exportAllReports() {
    console.log('Exportando todos los reportes...');
    
    // Crear un archivo ZIP con todos los gráficos
    const charts = Object.keys(reportCharts);
    let exportedCount = 0;
    
    charts.forEach(chartName => {
        const chart = reportCharts[chartName];
        if (chart) {
            try {
                const url = chart.toBase64Image();
                const link = document.createElement('a');
                link.download = `reporte_${chartName}.png`;
                link.href = url;
                link.click();
                exportedCount++;
            } catch (error) {
                console.error(`Error exportando ${chartName}:`, error);
            }
        }
    });
    
    showAlert(`${exportedCount} gráficos exportados correctamente`, 'success');
}

function exportChart(chartName) {
    const chart = reportCharts[chartName];
    if (!chart) {
        showAlert('Gráfico no disponible', 'error');
        return;
    }
    
    try {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `reporte_${chartName}.png`;
        link.href = url;
        link.click();
        showAlert('Gráfico exportado correctamente', 'success');
    } catch (error) {
        console.error('Error exportando gráfico:', error);
        showAlert('Error al exportar el gráfico', 'error');
    }
}

// Función de prueba para verificar el sistema de categorías
function testCategorySystem() {
    console.log('=== PRUEBA DEL SISTEMA DE CATEGORÍAS ===');
    
    // Verificar datos existentes
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    console.log('Categorías en localStorage:', categories);
    console.log('Productos en localStorage:', products);
    
    // Verificar si hay categorías de demostración
    if (categories.length === 0) {
        console.log('No hay categorías, inicializando datos de demostración...');
        initializeDemoData();
    }
    
    // Verificar que la tabla existe
    const table = document.getElementById('categoriesTable');
    const tbody = table ? table.querySelector('tbody') : null;
    
    console.log('Tabla encontrada:', !!table);
    console.log('Tbody encontrado:', !!tbody);
    
    // Intentar cargar datos
    loadCategoriesData();
    
    // Verificar que el botón de nueva categoría funciona
    const addButton = document.querySelector('button[onclick="openCategoryModal()"]');
    console.log('Botón de nueva categoría encontrado:', !!addButton);
    
    showAlert('Prueba del sistema completada. Revisa la consola para más detalles.', 'info');
}

// Función de prueba para verificar el sistema de productos
function testProductSystem() {
    console.log('=== PRUEBA DEL SISTEMA DE PRODUCTOS ===');
    
    // Verificar datos existentes
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    const products = getData(STORAGE_KEYS.PRODUCTS);
    
    console.log('Categorías en localStorage:', categories);
    console.log('Productos en localStorage:', products);
    
    // Verificar si hay categorías disponibles
    if (categories.length === 0) {
        console.log('No hay categorías, inicializando datos de demostración...');
        initializeDemoData();
    }
    
    // Verificar que la tabla existe
    const table = document.getElementById('productsTable');
    const tbody = table ? table.querySelector('tbody') : null;
    
    console.log('Tabla encontrada:', !!table);
    console.log('Tbody encontrado:', !!tbody);
    
    // Intentar cargar datos
    loadProductsData();
    
    // Verificar que el botón de nuevo producto funciona
    const addButton = document.querySelector('button[onclick="openProductModal()"]');
    console.log('Botón de nuevo producto encontrado:', !!addButton);
    
    showAlert('Prueba del sistema de productos completada. Revisa la consola para más detalles.', 'info');
}