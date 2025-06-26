// Variables para los gráficos
let salesChart, categoryChart, periodSalesChart, topProductsChart;
let gamesChart, gamesByClientChart;

// Inicializar todos los gráficos
function initCharts() {
    createSalesChart();
    createCategoryChart();
    createPeriodSalesChart();
    createTopProductsChart();
    createGamesChart();
    createGamesByClientChart();
}

// Crear gráfico de ventas mensuales
function createSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    salesChart = new Chart(ctx2d, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            datasets: [{
                label: 'Ventas Mensuales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
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
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
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

// Crear gráfico de productos por categoría
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    categoryChart = new Chart(ctx2d, {
        type: 'doughnut',
        data: {
            labels: ['Café', 'Bebidas', 'Postres', 'Snacks'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: ['#667eea', '#764ba2', '#28a745', '#ffc107'],
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

// Crear gráfico de ventas por período
function createPeriodSalesChart() {
    const ctx = document.getElementById('periodSalesChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    periodSalesChart = new Chart(ctx2d, {
        type: 'bar',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Ventas Semanales',
                data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#17a2b8',
                    '#6f42c1'
                ],
                borderRadius: 5
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

// Crear gráfico de productos más vendidos
function createTopProductsChart() {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    topProductsChart = new Chart(ctx2d, {
        type: 'bar',
        data: {
            labels: ['Café Americano', 'Cappuccino', 'Brownie', 'Latte', 'Muffin'],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [156, 142, 98, 87, 76],
                backgroundColor: '#764ba2',
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

// Crear gráfico de juegos más jugados
function createGamesChart() {
    const ctx = document.getElementById('chartJuegosMasJugados');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    gamesChart = new Chart(ctx2d, {
        type: 'doughnut',
        data: {
            labels: ['Snake', 'Tetris', 'Pong', 'Breakout'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: ['#28a745', '#007bff', '#dc3545', '#6f42c1'],
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

// Crear gráfico de juegos por cliente
function createGamesByClientChart() {
    const ctx = document.getElementById('chartJuegosPorCliente');
    if (!ctx) return;
    
    const ctx2d = ctx.getContext('2d');
    
    gamesByClientChart = new Chart(ctx2d, {
        type: 'bar',
        data: {
            labels: ['Snake', 'Tetris', 'Pong', 'Breakout'],
            datasets: [{
                label: 'Jugadores Activos',
                data: [23, 18, 12, 8],
                backgroundColor: '#17a2b8',
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

// Actualizar datos de los gráficos
function updateChartData(chartType, newData) {
    switch(chartType) {
        case 'sales':
            if (salesChart) {
                salesChart.data.datasets[0].data = newData;
                salesChart.update();
            }
            break;
        case 'category':
            if (categoryChart) {
                categoryChart.data.datasets[0].data = newData;
                categoryChart.update();
            }
            break;
        case 'periodSales':
            if (periodSalesChart) {
                periodSalesChart.data.datasets[0].data = newData;
                periodSalesChart.update();
            }
            break;
        case 'topProducts':
            if (topProductsChart) {
                topProductsChart.data.datasets[0].data = newData;
                topProductsChart.update();
            }
            break;
        case 'games':
            if (gamesChart) {
                gamesChart.data.datasets[0].data = newData;
                gamesChart.update();
            }
            break;
        case 'gamesByClient':
            if (gamesByClientChart) {
                gamesByClientChart.data.datasets[0].data = newData;
                gamesByClientChart.update();
            }
            break;
    }
}

// Generar datos aleatorios para demostración
function generateRandomData(min, max, count) {
    return Array.from({length: count}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Actualizar todos los gráficos con datos aleatorios
function refreshAllCharts() {
    // Actualizar ventas mensuales
    const newSalesData = generateRandomData(10000, 35000, 6);
    updateChartData('sales', newSalesData);
    
    // Actualizar ventas semanales
    const newPeriodData = generateRandomData(1000, 3500, 7);
    updateChartData('periodSales', newPeriodData);
    
    // Actualizar productos más vendidos
    const newProductsData = generateRandomData(50, 200, 5);
    updateChartData('topProducts', newProductsData);
    
    // Actualizar juegos
    const newGamesData = generateRandomData(10, 50, 4);
    updateChartData('games', newGamesData);
    
    // Actualizar juegos por cliente
    const newGamesClientData = generateRandomData(5, 30, 4);
    updateChartData('gamesByClient', newGamesClientData);
    
    Swal.fire('Actualizado', 'Los gráficos han sido actualizados con nuevos datos', 'success');
}

// Exportar gráfico como imagen
function exportChart(chartType) {
    let chart;
    let filename;
    
    switch(chartType) {
        case 'sales':
            chart = salesChart;
            filename = 'ventas_mensuales';
            break;
        case 'category':
            chart = categoryChart;
            filename = 'productos_por_categoria';
            break;
        case 'periodSales':
            chart = periodSalesChart;
            filename = 'ventas_semanales';
            break;
        case 'topProducts':
            chart = topProductsChart;
            filename = 'productos_mas_vendidos';
            break;
        case 'games':
            chart = gamesChart;
            filename = 'juegos_mas_jugados';
            break;
        case 'gamesByClient':
            chart = gamesByClientChart;
            filename = 'juegos_por_cliente';
            break;
        default:
            Swal.fire('Error', 'Tipo de gráfico no válido', 'error');
            return;
    }
    
    if (chart) {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = url;
        link.click();
        
        Swal.fire('Exportado', 'El gráfico ha sido exportado correctamente', 'success');
    } else {
        Swal.fire('Error', 'Gráfico no disponible', 'error');
    }
}

// Función para mostrar estadísticas detalladas
function showDetailedStats(chartType) {
    let title, data, html;
    
    switch(chartType) {
        case 'sales':
            title = 'Estadísticas de Ventas Mensuales';
            data = salesChart ? salesChart.data.datasets[0].data : [];
            html = generateSalesStatsHTML(data);
            break;
        case 'category':
            title = 'Estadísticas por Categoría';
            data = categoryChart ? categoryChart.data.datasets[0].data : [];
            html = generateCategoryStatsHTML(data);
            break;
        case 'games':
            title = 'Estadísticas de Videojuegos';
            data = gamesChart ? gamesChart.data.datasets[0].data : [];
            html = generateGamesStatsHTML(data);
            break;
        default:
            Swal.fire('Error', 'Tipo de estadísticas no válido', 'error');
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

// Generar HTML para estadísticas de ventas
function generateSalesStatsHTML(data) {
    const total = data.reduce((a, b) => a + b, 0);
    const promedio = total / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    return `
        <div class="text-start">
            <div class="row">
                <div class="col-6">
                    <p><strong>Total de ventas:</strong> $${total.toLocaleString()}</p>
                    <p><strong>Promedio mensual:</strong> $${promedio.toLocaleString()}</p>
                </div>
                <div class="col-6">
                    <p><strong>Venta máxima:</strong> $${max.toLocaleString()}</p>
                    <p><strong>Venta mínima:</strong> $${min.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}

// Generar HTML para estadísticas de categorías
function generateCategoryStatsHTML(data) {
    const total = data.reduce((a, b) => a + b, 0);
    const labels = ['Café', 'Bebidas', 'Postres', 'Snacks'];
    
    let html = '<div class="text-start">';
    data.forEach((value, index) => {
        const percentage = ((value / total) * 100).toFixed(1);
        html += `<p><strong>${labels[index]}:</strong> ${value}% (${percentage}%)</p>`;
    });
    html += '</div>';
    
    return html;
}

// Generar HTML para estadísticas de juegos
function generateGamesStatsHTML(data) {
    const total = data.reduce((a, b) => a + b, 0);
    const labels = ['Snake', 'Tetris', 'Pong', 'Breakout'];
    
    let html = '<div class="text-start">';
    data.forEach((value, index) => {
        const percentage = ((value / total) * 100).toFixed(1);
        html += `<p><strong>${labels[index]}:</strong> ${value}% (${percentage}%)</p>`;
    });
    html += '</div>';
    
    return html;
} 