// Función para generar hash SHA256 (igual que en Registrar.js)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Función para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para obtener usuarios del localStorage
function getUsers() {
    const users = localStorage.getItem('usuarios');
    return users ? JSON.parse(users) : [];
}

// Función para limpiar errores
function clearErrors() {
    const errorElements = document.querySelectorAll('.invalid-feedback');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Función para mostrar error
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(alertDiv, form);
}

// Función para mostrar mensaje de error
function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(alertDiv, form);
}

// Función para manejar el toggle de la contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const icon = passwordToggle.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'bi bi-eye';
    }
}

// Función para verificar credenciales
async function verifyCredentials(email, password) {
    const users = getUsers();
    const passwordHash = await hashPassword(password);
    
    const user = users.find(u => u.email === email && u.password === passwordHash);
    return user || null;
}

// Función para guardar sesión
function saveSession(user, rememberMe) {
    const sessionData = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        imagen: user.imagen,
        loginTime: new Date().toISOString()
    };

    if (rememberMe) {
        localStorage.setItem('userSession', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('userSession', JSON.stringify(sessionData));
    }
}

// Variable para evitar múltiples verificaciones de sesión
let sessionCheckInProgress = false;

// Función para verificar si hay sesión activa
function checkActiveSession() {
    // Evitar múltiples verificaciones simultáneas
    if (sessionCheckInProgress) {
        console.log('Verificación de sesión ya en progreso, saltando...');
        return;
    }
    
    sessionCheckInProgress = true;
    
    try {
        const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        if (session) {
            try {
                const userData = JSON.parse(session);
                // Verificar que la sesión sea válida y no esté expirada
                if (userData && userData.rol && userData.nombre) {
                    console.log('Sesión activa encontrada, redirigiendo...');
                    // Redirigir al dashboard si ya está logueado
                    redirectToDashboard(userData.rol);
                } else {
                    // Sesión inválida, limpiarla
                    console.log('Sesión inválida encontrada, limpiando...');
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('userSession');
                }
            } catch (error) {
                console.error('Error al verificar sesión:', error);
                // Limpiar sesión corrupta
                localStorage.removeItem('userSession');
                sessionStorage.removeItem('userSession');
            }
        }
    } finally {
        sessionCheckInProgress = false;
    }
}

// Función para redirigir según el rol
function redirectToDashboard(rol) {
    console.log('Redirigiendo a dashboard con rol:', rol);
    
    // Verificar que no estemos ya en la página de destino
    const currentPage = window.location.pathname.split('/').pop();
    
    if (rol === 'admin') {
        if (currentPage !== 'Main_administrador.html') {
            window.location.href = 'Main_administrador.html';
        }
    } else {
        if (currentPage !== 'Main_user.html') {
            window.location.href = 'Main_user.html';
        }
    }
}

// Función principal de login
async function handleLogin(formData) {
    try {
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';

        // Validar email
        if (!validateEmail(email)) {
            showError('emailError', 'Por favor ingresa un email válido');
            return false;
        }

        // Verificar credenciales
        const user = await verifyCredentials(email, password);
        
        if (!user) {
            showError('passwordError', 'Email o contraseña incorrectos');
            return false;
        }

        // Guardar sesión
        saveSession(user, rememberMe);

        // Mostrar mensaje de éxito
        showSuccessMessage(`¡Bienvenido ${user.nombre}! Redirigiendo...`);
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            redirectToDashboard(user.rol);
        }, 2000);

        return true;

    } catch (error) {
        console.error('Error en el login:', error);
        showErrorMessage('Error en el login. Por favor intenta de nuevo.');
        return false;
    }
}

// Funciones para cuentas de demostración
function fillDemoClient() {
    document.getElementById('email').value = 'cliente@test.com';
    document.getElementById('password').value = 'password123';
}

function fillDemoAdmin() {
    document.getElementById('email').value = 'admin@cafeteria.com';
    document.getElementById('password').value = 'password123';
}

// Función para crear cuentas de demostración si no existen
function createDemoAccounts() {
    const users = getUsers();
    
    // Verificar si ya existen las cuentas de demo
    const demoClientExists = users.some(u => u.email === 'cliente@test.com');
    const demoAdminExists = users.some(u => u.email === 'admin@cafeteria.com');
    
    if (!demoClientExists || !demoAdminExists) {
        // Crear cuenta de cliente demo
        if (!demoClientExists) {
            hashPassword('password123').then(hash => {
                const demoClient = {
                    id: Date.now().toString(),
                    nombre: 'Cliente Demo',
                    email: 'cliente@test.com',
                    password: hash,
                    rol: 'cliente',
                    imagen: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                    fecha_registro: new Date().toISOString()
                };
                users.push(demoClient);
                localStorage.setItem('usuarios', JSON.stringify(users));
            });
        }
        
        // Crear cuenta de admin demo
        if (!demoAdminExists) {
            hashPassword('password123').then(hash => {
                const demoAdmin = {
                    id: (Date.now() + 1).toString(),
                    nombre: 'Administrador',
                    email: 'admin@cafeteria.com',
                    password: hash,
                    rol: 'admin',
                    imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    fecha_registro: new Date().toISOString()
                };
                users.push(demoAdmin);
                localStorage.setItem('usuarios', JSON.stringify(users));
            });
        }
    }
}

// Función para limpiar sesión
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    window.location.href = 'Login.html';
}

// Función para obtener usuario actual
function getCurrentUser() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
}

// Función para mostrar todas las cuentas (solo para desarrollo)
function showAllUsers() {
    const users = getUsers();
    console.log('Usuarios registrados:', users);
}

// Función para limpiar todas las sesiones
function clearAllSessions() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    console.log('Todas las sesiones han sido limpiadas');
}

// Función para obtener la sesión actual
function getCurrentSession() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    console.log('Sesión actual:', session ? JSON.parse(session) : 'No hay sesión');
    return session ? JSON.parse(session) : null;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login.js cargado');
    
    // Crear cuentas de demostración
    createDemoAccounts();
    
    // Verificar sesión activa después de un pequeño delay
    setTimeout(() => {
        checkActiveSession();
    }, 100);
    
    // Mostrar cuentas de demo después de 2 segundos
    setTimeout(() => {
        const demoAccounts = document.getElementById('demoAccounts');
        if (demoAccounts) {
            demoAccounts.style.display = 'block';
        }
    }, 2000);

    // Event listener para el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            clearErrors();
            
            const formData = new FormData(this);
            await handleLogin(formData);
        });
    }

    // Event listener para el toggle de contraseña
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePassword);
    }
});
