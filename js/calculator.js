// Variables para la calculadora
let calculatorDisplay = '';
let calculatorHistory = [];

// Inicializar calculadora
function initCalculator() {
    clearCalculator();
    loadCalculatorHistory();
}

// Agregar valor al display de la calculadora
function appendToCalculator(value) {
    calculatorDisplay += value;
    document.getElementById('calculatorDisplay').value = calculatorDisplay;
}

// Limpiar calculadora
function clearCalculator() {
    calculatorDisplay = '';
    document.getElementById('calculatorDisplay').value = '';
}

// Eliminar último carácter
function deleteLastChar() {
    calculatorDisplay = calculatorDisplay.slice(0, -1);
    document.getElementById('calculatorDisplay').value = calculatorDisplay;
}

// Calcular resultado
function calculateResult() {
    try {
        const result = eval(calculatorDisplay);
        const calculation = {
            expression: calculatorDisplay,
            result: result,
            timestamp: new Date().toLocaleString()
        };
        
        calculatorHistory.push(calculation);
        saveCalculatorHistory();
        
        document.getElementById('calculatorDisplay').value = result;
        calculatorDisplay = result.toString();
        
        // Mostrar resultado con SweetAlert
        Swal.fire({
            title: 'Resultado',
            text: `${calculation.expression} = ${result}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
    } catch (error) {
        document.getElementById('calculatorDisplay').value = 'Error';
        calculatorDisplay = '';
        
        Swal.fire({
            title: 'Error',
            text: 'Expresión matemática inválida',
            icon: 'error'
        });
    }
}

// Calculadora de precios de negocio
function calcularPrecioVenta() {
    const costo = parseFloat(document.getElementById('costoProducto').value) || 0;
    const margen = parseFloat(document.getElementById('margenProducto').value) || 0;
    
    if (costo <= 0) {
        Swal.fire('Error', 'El costo debe ser mayor a 0', 'error');
        return;
    }
    
    if (margen < 0 || margen >= 100) {
        Swal.fire('Error', 'El margen debe estar entre 0 y 100%', 'error');
        return;
    }
    
    const precioVenta = costo / (1 - margen / 100);
    const ganancia = precioVenta - costo;
    const margenReal = (ganancia / precioVenta) * 100;
    
    document.getElementById('precioVenta').textContent = `$${precioVenta.toFixed(2)}`;
    
    // Mostrar detalles del cálculo
    Swal.fire({
        title: 'Cálculo de Precio de Venta',
        html: `
            <div class="text-start">
                <p><strong>Costo:</strong> $${costo.toFixed(2)}</p>
                <p><strong>Margen deseado:</strong> ${margen}%</p>
                <p><strong>Precio de venta:</strong> $${precioVenta.toFixed(2)}</p>
                <p><strong>Ganancia:</strong> $${ganancia.toFixed(2)}</p>
                <p><strong>Margen real:</strong> ${margenReal.toFixed(1)}%</p>
            </div>
        `,
        icon: 'info'
    });
}

// Calculadora de descuentos
function calcularDescuento() {
    const precioOriginal = parseFloat(document.getElementById('precioOriginal').value) || 0;
    const descuento = parseFloat(document.getElementById('descuentoPorcentaje').value) || 0;
    
    if (precioOriginal <= 0) {
        Swal.fire('Error', 'El precio original debe ser mayor a 0', 'error');
        return;
    }
    
    if (descuento < 0 || descuento > 100) {
        Swal.fire('Error', 'El descuento debe estar entre 0 y 100%', 'error');
        return;
    }
    
    const precioFinal = precioOriginal * (1 - descuento / 100);
    const ahorro = precioOriginal - precioFinal;
    
    document.getElementById('precioFinal').textContent = `$${precioFinal.toFixed(2)}`;
    
    // Mostrar detalles del descuento
    Swal.fire({
        title: 'Cálculo de Descuento',
        html: `
            <div class="text-start">
                <p><strong>Precio original:</strong> $${precioOriginal.toFixed(2)}</p>
                <p><strong>Descuento:</strong> ${descuento}%</p>
                <p><strong>Precio final:</strong> $${precioFinal.toFixed(2)}</p>
                <p><strong>Ahorro:</strong> $${ahorro.toFixed(2)}</p>
            </div>
        `,
        icon: 'info'
    });
}

// Calculadora de propinas
function calcularPropina() {
    const cuenta = parseFloat(document.getElementById('cuentaTotal').value) || 0;
    const porcentajePropina = parseFloat(document.getElementById('porcentajePropina').value) || 15;
    const personas = parseInt(document.getElementById('numeroPersonas').value) || 1;
    
    if (cuenta <= 0) {
        Swal.fire('Error', 'El monto de la cuenta debe ser mayor a 0', 'error');
        return;
    }
    
    const propina = cuenta * (porcentajePropina / 100);
    const totalConPropina = cuenta + propina;
    const porPersona = totalConPropina / personas;
    
    document.getElementById('propinaCalculada').textContent = `$${propina.toFixed(2)}`;
    document.getElementById('totalConPropinaCalculado').textContent = `$${totalConPropina.toFixed(2)}`;
    document.getElementById('porPersonaCalculado').textContent = `$${porPersona.toFixed(2)}`;
}

// Calculadora de conversión de monedas
function convertirMoneda() {
    const cantidad = parseFloat(document.getElementById('cantidadMoneda').value) || 0;
    const monedaOrigen = document.getElementById('monedaOrigen').value;
    const monedaDestino = document.getElementById('monedaDestino').value;
    
    if (cantidad <= 0) {
        Swal.fire('Error', 'La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    // Tasas de cambio simuladas (en un caso real, se obtendrían de una API)
    const tasas = {
        'USD': { 'EUR': 0.85, 'MXN': 20.5, 'COP': 3800 },
        'EUR': { 'USD': 1.18, 'MXN': 24.2, 'COP': 4470 },
        'MXN': { 'USD': 0.049, 'EUR': 0.041, 'COP': 185 },
        'COP': { 'USD': 0.00026, 'EUR': 0.00022, 'MXN': 0.0054 }
    };
    
    let resultado;
    if (monedaOrigen === monedaDestino) {
        resultado = cantidad;
    } else {
        const tasa = tasas[monedaOrigen][monedaDestino];
        resultado = cantidad * tasa;
    }
    
    document.getElementById('resultadoConversion').textContent = `${resultado.toFixed(2)} ${monedaDestino}`;
}

// Guardar historial de calculadora
function saveCalculatorHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculatorHistory));
}

// Cargar historial de calculadora
function loadCalculatorHistory() {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
        calculatorHistory = JSON.parse(saved);
    }
}

// Mostrar historial de calculadora
function showCalculatorHistory() {
    if (calculatorHistory.length === 0) {
        Swal.fire('Historial vacío', 'No hay cálculos guardados', 'info');
        return;
    }
    
    let historyHTML = '<div class="text-start">';
    calculatorHistory.slice(-10).reverse().forEach((calc, index) => {
        historyHTML += `
            <div class="mb-2 p-2 border rounded">
                <small class="text-muted">${calc.timestamp}</small><br>
                <strong>${calc.expression} = ${calc.result}</strong>
            </div>
        `;
    });
    historyHTML += '</div>';
    
    Swal.fire({
        title: 'Historial de Cálculos',
        html: historyHTML,
        width: '600px',
        showConfirmButton: true,
        confirmButtonText: 'Cerrar'
    });
}

// Limpiar historial de calculadora
function clearCalculatorHistory() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminará todo el historial de cálculos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            calculatorHistory = [];
            saveCalculatorHistory();
            Swal.fire('Eliminado', 'El historial ha sido eliminado', 'success');
        }
    });
}

// Exportar historial de calculadora
function exportCalculatorHistory() {
    if (calculatorHistory.length === 0) {
        Swal.fire('Historial vacío', 'No hay cálculos para exportar', 'info');
        return;
    }
    
    const dataStr = JSON.stringify(calculatorHistory, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historial_calculadora.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    Swal.fire('Exportado', 'El historial ha sido exportado correctamente', 'success');
} 