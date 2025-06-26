// Contraseña de administrador (en producción debería estar en el servidor)
const ADMIN_PASSWORD = "admin123";

// Función para generar hash SHA256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Función para convertir imagen a base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Función para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar contraseña
function validatePassword(password) {
    // Mínimo 8 caracteres, al menos una letra y un número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Función para evaluar la fortaleza de la contraseña
function evaluatePasswordStrength(password) {
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength < 3) {
        feedback = '<span class="strength-weak">Débil</span>';
    } else if (strength < 4) {
        feedback = '<span class="strength-medium">Media</span>';
    } else {
        feedback = '<span class="strength-strong">Fuerte</span>';
    }

    return feedback;
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

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para obtener usuarios del localStorage
function getUsers() {
    const users = localStorage.getItem('usuarios');
    return users ? JSON.parse(users) : [];
}

// Función para guardar usuarios en localStorage
function saveUsers(users) {
    localStorage.setItem('usuarios', JSON.stringify(users));
}

// Función para verificar si el email ya existe
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Función para manejar la vista previa de imagen
function handleImagePreview(file) {
    const preview = document.getElementById('imagePreview');
    const previewText = preview.querySelector('.image-preview-text');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            previewText.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.backgroundImage = 'none';
        previewText.style.display = 'block';
    }
}

// Función para manejar el cambio de rol
function handleRoleChange() {
    const rolSelect = document.getElementById('rol');
    const adminPasswordSection = document.getElementById('adminPasswordSection');
    const adminPasswordInput = document.getElementById('adminPassword');

    if (rolSelect.value === 'admin') {
        adminPasswordSection.style.display = 'block';
        adminPasswordInput.required = true;
    } else {
        adminPasswordSection.style.display = 'none';
        adminPasswordInput.required = false;
        adminPasswordInput.value = '';
        showError('adminPasswordError', '');
    }
}

// Función para validar contraseña de administrador
function validateAdminPassword(password) {
    return password === ADMIN_PASSWORD;
}

// Función principal de registro
async function handleRegistration(formData) {
    try {
        // Validaciones
        const nombre = formData.get('nombre').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const rol = formData.get('rol');
        const adminPassword = formData.get('adminPassword');
        const imagenFile = document.getElementById('imagen').files[0];

        // Validar nombre
        if (nombre.length < 2) {
            showError('nombreError', 'El nombre debe tener al menos 2 caracteres');
            return false;
        }

        // Validar email
        if (!validateEmail(email)) {
            showError('emailError', 'Por favor ingresa un email válido');
            return false;
        }

        // Verificar si el email ya existe
        if (emailExists(email)) {
            showError('emailError', 'Este email ya está registrado');
            return false;
        }

        // Validar contraseña
        if (!validatePassword(password)) {
            showError('passwordError', 'La contraseña debe tener al menos 8 caracteres, una letra y un número');
            return false;
        }

        // Validar confirmación de contraseña
        if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Las contraseñas no coinciden');
            return false;
        }

        // Validar contraseña de administrador si es necesario
        if (rol === 'admin') {
            if (!adminPassword) {
                showError('adminPasswordError', 'La contraseña de administrador es requerida');
                return false;
            }
            if (!validateAdminPassword(adminPassword)) {
                showError('adminPasswordError', 'Contraseña de administrador incorrecta');
                return false;
            }
        }

        // Procesar imagen
        let imagenBase64 = null;
        if (imagenFile) {
            // Validar tamaño de imagen (máximo 5MB)
            if (imagenFile.size > 5 * 1024 * 1024) {
                showError('imagenError', 'La imagen debe ser menor a 5MB');
                return false;
            }
            
            // Validar tipo de imagen
            if (!imagenFile.type.startsWith('image/')) {
                showError('imagenError', 'Por favor selecciona un archivo de imagen válido');
                return false;
            }

            imagenBase64 = await convertImageToBase64(imagenFile);
        }

        // Generar hash de la contraseña
        const passwordHash = await hashPassword(password);

        // Crear objeto de usuario
        const nuevoUsuario = {
            id: generateId(),
            nombre: nombre,
            email: email,
            password: passwordHash,
            rol: rol,
            imagen: imagenBase64,
            fechaRegistro: new Date().toISOString()
        };

        // Guardar en localStorage
        const usuarios = getUsers();
        usuarios.push(nuevoUsuario);
        saveUsers(usuarios);

        // Mostrar mensaje de éxito con Bootstrap
        showSuccessMessage('¡Registro exitoso! Ya puedes iniciar sesión.');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 2000);
        
        return true;

    } catch (error) {
        console.error('Error en el registro:', error);
        showErrorMessage('Error en el registro. Por favor intenta de nuevo.');
        return false;
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
    
    const form = document.getElementById('registroForm');
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
    
    const form = document.getElementById('registroForm');
    form.parentNode.insertBefore(alertDiv, form);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const imagenInput = document.getElementById('imagen');
    const rolSelect = document.getElementById('rol');

    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();
        
        const formData = new FormData(form);
        await handleRegistration(formData);
    });

    // Manejar cambio de rol
    rolSelect.addEventListener('change', handleRoleChange);

    // Manejar vista previa de imagen
    imagenInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        handleImagePreview(file);
    });

    // Validación en tiempo real
    document.getElementById('nombre').addEventListener('input', function() {
        const nombre = this.value.trim();
        if (nombre.length > 0 && nombre.length < 2) {
            showError('nombreError', 'El nombre debe tener al menos 2 caracteres');
        } else {
            showError('nombreError', '');
        }
    });

    document.getElementById('email').addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError('emailError', 'Por favor ingresa un email válido');
        } else if (email && emailExists(email)) {
            showError('emailError', 'Este email ya está registrado');
        } else {
            showError('emailError', '');
        }
    });

    document.getElementById('password').addEventListener('input', function() {
        const password = this.value;
        const strengthElement = document.getElementById('passwordStrength');
        
        if (password) {
            const strength = evaluatePasswordStrength(password);
            strengthElement.innerHTML = `Fortaleza: ${strength}`;
            
            if (!validatePassword(password)) {
                showError('passwordError', 'La contraseña debe tener al menos 8 caracteres, una letra y un número');
            } else {
                showError('passwordError', '');
            }
        } else {
            strengthElement.innerHTML = '';
            showError('passwordError', '');
        }
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPasswordError', 'Las contraseñas no coinciden');
        } else {
            showError('confirmPasswordError', '');
        }
    });

    document.getElementById('adminPassword').addEventListener('input', function() {
        const adminPassword = this.value;
        if (adminPassword && !validateAdminPassword(adminPassword)) {
            showError('adminPasswordError', 'Contraseña de administrador incorrecta');
        } else {
            showError('adminPasswordError', '');
        }
    });
});

// Función para mostrar información de usuarios registrados (solo para desarrollo)
function showRegisteredUsers() {
    const users = getUsers();
    console.log('Usuarios registrados:', users);
    return users;
}

// Función para limpiar localStorage (solo para desarrollo)
function clearLocalStorage() {
    localStorage.removeItem('usuarios');
    console.log('LocalStorage limpiado');
}

// Función para cambiar la contraseña de administrador (solo para desarrollo)
function changeAdminPassword(newPassword) {
    ADMIN_PASSWORD = newPassword;
    console.log('Contraseña de administrador cambiada');
}
