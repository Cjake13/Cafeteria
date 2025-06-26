// Variables globales
let currentSection = 'dashboard';
let sidebarCollapsed = false;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    loadDashboardData();
    setupEventListeners();
});

// Función de inicialización principal
function initializeAdminPanel() {
    // Cargar datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('currentUser')) || {};
    document.getElementById('userName').textContent = userData.name || 'Administrador';
    document.getElementById('userAvatar').textContent = userData.name ? userData.name.charAt(0).toUpperCase() : 'A';
    
    // Mostrar sección por defecto
    showSection('dashboard');
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle sidebar
    document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
    
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Función para mostrar/ocultar secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName).style.display = 'block';
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Cargar datos específicos de la sección
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'categorias':
            loadCategories();
            break;
        case 'productos':
            loadProducts();
            break;
        case 'usuarios':
            loadUsers();
            break;
        case 'pedidos':
            loadOrders();
            break;
        case 'reportes':
            loadReports();
            break;
        case 'videojuegos':
            loadGameStats();
            break;
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarHeader = document.getElementById('sidebarHeader');
    
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        sidebarHeader.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        sidebarHeader.classList.remove('collapsed');
    }
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Simular datos del dashboard
    const stats = {
        users: 1250,
        products: 89,
        orders: 342,
        revenue: 15420.50
    };
    
    document.getElementById('totalUsers').textContent = stats.users.toLocaleString();
    document.getElementById('totalProducts').textContent = stats.products;
    document.getElementById('totalOrders').textContent = stats.orders;
    document.getElementById('totalRevenue').textContent = `$${stats.revenue.toLocaleString()}`;
    
    // Crear gráficos
    createSalesChart();
    createCategoryChart();
    loadTopProducts();
    loadRecentOrders();
}

// Crear gráfico de ventas
function createSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ventas Mensuales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Crear gráfico de categorías
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Café', 'Bebidas', 'Postres', 'Snacks'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: ['#667eea', '#764ba2', '#28a745', '#ffc107']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Cargar productos más vendidos
function loadTopProducts() {
    const topProducts = [
        { position: 1, name: 'Café Americano', image: '☕', sold: 156, revenue: 2340, stock: 45 },
        { position: 2, name: 'Cappuccino', image: '☕', sold: 142, revenue: 2840, stock: 32 },
        { position: 3, name: 'Brownie', image: '🍰', sold: 98, revenue: 1470, stock: 28 }
    ];
    
    const tbody = document.querySelector('#topProductsTable tbody');
    tbody.innerHTML = '';
    
    topProducts.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.position}</td>
                <td>${product.name}</td>
                <td><span style="font-size: 1.5em;">${product.image}</span></td>
                <td>${product.sold}</td>
                <td>$${product.revenue}</td>
                <td>${product.stock}</td>
            </tr>
        `;
    });
}

// Cargar pedidos recientes
function loadRecentOrders() {
    const recentOrders = [
        { id: 'ORD-001', customer: 'Juan Pérez', date: '2024-01-15', total: 45.50, status: 'pagado' },
        { id: 'ORD-002', customer: 'María García', date: '2024-01-15', total: 32.00, status: 'enviado' },
        { id: 'ORD-003', customer: 'Carlos López', date: '2024-01-14', total: 67.80, status: 'pendiente' }
    ];
    
    const tbody = document.querySelector('#recentOrdersTable tbody');
    tbody.innerHTML = '';
    
    recentOrders.forEach(order => {
        tbody.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>$${order.total}</td>
                <td><span class="badge-status status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Funciones para categorías
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const tbody = document.querySelector('#categoriesTable tbody');
    tbody.innerHTML = '';
    
    categories.forEach(category => {
        tbody.innerHTML += `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>${category.productCount || 0}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editCategory(${category.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteCategory(${category.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Funciones para productos
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Funciones para usuarios
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>
                    <div class="user-avatar" style="width: 30px; height: 30px; font-size: 0.8em;">
                        ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role || 'Usuario'}</td>
                <td>${user.registrationDate || 'N/A'}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editUser(${user.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteUser(${user.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Funciones para pedidos
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        tbody.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.date}</td>
                <td>${order.items ? order.items.length : 0} productos</td>
                <td>$${order.total}</td>
                <td><span class="badge-status status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editOrder('${order.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Funciones para reportes
function loadReports() {
    createPeriodSalesChart();
    createTopProductsChart();
}

// Crear gráfico de ventas por período
function createPeriodSalesChart() {
    const ctx = document.getElementById('periodSalesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ventas Semanales',
                data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Crear gráfico de productos más vendidos
function createTopProductsChart() {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Café Americano', 'Cappuccino', 'Brownie', 'Latte', 'Muffin'],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [156, 142, 98, 87, 76],
                backgroundColor: '#764ba2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y'
        }
    });
}

// Funciones para videojuegos
function loadGameStats() {
    createGamesChart();
    createGamesByClientChart();
}

// Crear gráfico de juegos más jugados
function createGamesChart() {
    const ctx = document.getElementById('chartJuegosMasJugados').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Snake', 'Tetris', 'Pong', 'Breakout'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: ['#28a745', '#007bff', '#dc3545', '#6f42c1']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Crear gráfico de juegos por cliente
function createGamesByClientChart() {
    const ctx = document.getElementById('chartJuegosPorCliente').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Snake', 'Tetris', 'Pong', 'Breakout'],
            datasets: [{
                label: 'Jugadores Activos',
                data: [23, 18, 12, 8],
                backgroundColor: '#17a2b8'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Funciones de la calculadora
let calculatorDisplay = '';

function appendToCalculator(value) {
    calculatorDisplay += value;
    document.getElementById('calculatorDisplay').value = calculatorDisplay;
}

function clearCalculator() {
    calculatorDisplay = '';
    document.getElementById('calculatorDisplay').value = '';
}

function deleteLastChar() {
    calculatorDisplay = calculatorDisplay.slice(0, -1);
    document.getElementById('calculatorDisplay').value = calculatorDisplay;
}

function calculateResult() {
    try {
        const result = eval(calculatorDisplay);
        document.getElementById('calculatorDisplay').value = result;
        calculatorDisplay = result.toString();
    } catch (error) {
        document.getElementById('calculatorDisplay').value = 'Error';
        calculatorDisplay = '';
    }
}

function calcularPrecioVenta() {
    const costo = parseFloat(document.getElementById('costoProducto').value) || 0;
    const margen = parseFloat(document.getElementById('margenProducto').value) || 0;
    const precioVenta = costo / (1 - margen / 100);
    document.getElementById('precioVenta').textContent = `$${precioVenta.toFixed(2)}`;
}

function calcularDescuento() {
    const precioOriginal = parseFloat(document.getElementById('precioOriginal').value) || 0;
    const descuento = parseFloat(document.getElementById('descuentoPorcentaje').value) || 0;
    const precioFinal = precioOriginal * (1 - descuento / 100);
    document.getElementById('precioFinal').textContent = `$${precioFinal.toFixed(2)}`;
}

// Funciones de utilidad
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'Login.html';
}

function clearSearchAdmin() {
    document.getElementById('searchProductosAdmin').value = '';
    loadProducts();
}

// Funciones placeholder para modales (se implementarán según necesidad)
function openCategoryModal() {
    Swal.fire('Función en desarrollo', 'Modal de categorías próximamente', 'info');
}

function openProductModal() {
    Swal.fire('Función en desarrollo', 'Modal de productos próximamente', 'info');
}

function openUserModal() {
    Swal.fire('Función en desarrollo', 'Modal de usuarios próximamente', 'info');
}

function openGameModal(game) {
    Swal.fire('Función en desarrollo', `Modal del juego ${game} próximamente`, 'info');
}

function exportData() {
    Swal.fire('Función en desarrollo', 'Exportación de datos próximamente', 'info');
}

function importData() {
    Swal.fire('Función en desarrollo', 'Importación de datos próximamente', 'info');
}

function clearAllData() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará todos los datos del sistema",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire('Eliminado', 'Todos los datos han sido eliminados', 'success');
            loadDashboardData();
        }
    });
}

// Funciones placeholder para acciones CRUD
function editCategory(id) {
    Swal.fire('Función en desarrollo', `Editar categoría ${id} próximamente`, 'info');
}

function deleteCategory(id) {
    Swal.fire('Función en desarrollo', `Eliminar categoría ${id} próximamente`, 'info');
}

function editProduct(id) {
    Swal.fire('Función en desarrollo', `Editar producto ${id} próximamente`, 'info');
}

function deleteProduct(id) {
    Swal.fire('Función en desarrollo', `Eliminar producto ${id} próximamente`, 'info');
}

function editUser(id) {
    Swal.fire('Función en desarrollo', `Editar usuario ${id} próximamente`, 'info');
}

function deleteUser(id) {
    Swal.fire('Función en desarrollo', `Eliminar usuario ${id} próximamente`, 'info');
}

function viewOrder(id) {
    Swal.fire('Función en desarrollo', `Ver pedido ${id} próximamente`, 'info');
}

function editOrder(id) {
    Swal.fire('Función en desarrollo', `Editar pedido ${id} próximamente`, 'info');
} 