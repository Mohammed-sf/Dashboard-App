// Utility Functions for Enhanced Usability

// DOM Elements
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Apply Dark Mode if enabled
    initDarkMode();
    
    // Initialize Tooltips
    initTooltips();
    
    // Add event listener to dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Add confirmation before dangerous actions
    addConfirmations();
    
    // Add keyboard shortcuts
    initKeyboardShortcuts();
});

// Dark Mode Functions
function initDarkMode() {
    // Check if dark mode is enabled in local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode if enabled
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateDarkModeToggleIcon(true);
    }
}

function toggleDarkMode() {
    // Toggle dark mode class on body
    body.classList.toggle('dark-mode');
    
    // Update local storage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update toggle icon
    updateDarkModeToggleIcon(isDarkMode);
    
    // Show notification
    if (typeof showNotification === 'function') {
        const message = isDarkMode ? getTranslation('darkModeEnabled') : getTranslation('lightModeEnabled');
        showNotification(message);
    }
}

function updateDarkModeToggleIcon(isDarkMode) {
    if (darkModeToggle) {
        // Update icon
        if (isDarkMode) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.title = getTranslation('switchToLightMode');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.title = getTranslation('switchToDarkMode');
        }
    }
}

// Tooltip Functions
function initTooltips() {
    // Get all elements with tooltip attribute
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    // Add tooltip functionality to each element
    elementsWithTooltips.forEach(element => {
        // Create tooltip element
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip-content';
        tooltipElement.textContent = tooltipText;
        
        // Add tooltip to element
        element.appendChild(tooltipElement);
        
        // Add event listeners
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltipContent = event.currentTarget.querySelector('.tooltip-content');
    if (tooltipContent) {
        tooltipContent.classList.add('show');
    }
}

function hideTooltip(event) {
    const tooltipContent = event.currentTarget.querySelector('.tooltip-content');
    if (tooltipContent) {
        tooltipContent.classList.remove('show');
    }
}

// Add tooltip dynamically to an element
function addTooltip(element, tooltipText) {
    if (!element) return;
    
    // Set tooltip attribute
    element.setAttribute('data-tooltip', tooltipText);
    
    // Create tooltip element
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltip-content';
    tooltipElement.textContent = tooltipText;
    
    // Add tooltip to element
    element.appendChild(tooltipElement);
    
    // Add event listeners
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('focus', showTooltip);
    element.addEventListener('blur', hideTooltip);
}

// Confirmation Dialogs
function addConfirmations() {
    // Add confirmation to delete buttons
    document.querySelectorAll('.btn-danger, [data-confirm]').forEach(btn => {
        if (!btn.hasAttribute('data-has-confirmation')) {
            btn.setAttribute('data-has-confirmation', 'true');
            
            // Store the original click event
            const originalClick = btn.onclick;
            
            // Replace with confirmation dialog
            btn.onclick = function(e) {
                e.preventDefault();
                
                // Get confirmation message
                const message = btn.getAttribute('data-confirm') || getTranslation('confirmAction');
                
                // Show confirmation dialog
                if (confirm(message)) {
                    // If confirmed, proceed with original action
                    if (originalClick) {
                        originalClick.call(this, e);
                    }
                }
            };
        }
    });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        // Only apply shortcuts when not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + / - Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            toggleDarkMode();
        }
        
        // Alt + H - Go to Home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            if (typeof switchPage === 'function') {
                switchPage('home');
            }
        }
        
        // Alt + C - Go to Clients
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            if (typeof switchPage === 'function') {
                switchPage('clients');
            }
        }
        
        // Alt + T - Go to Tasks
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            if (typeof switchPage === 'function') {
                switchPage('tasks');
            }
        }
        
        // Alt + F - Go to Files
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            if (typeof switchPage === 'function') {
                switchPage('uploads');
            }
        }
        
        // Alt + P - Go to Profile
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            if (typeof switchPage === 'function') {
                switchPage('profile');
            }
        }
        
        // Esc - Close all modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                // Find close button and click it
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.click();
                }
            });
        }
    });
}

// Form Validation Helper
function validateForm(form) {
    let isValid = true;
    
    // Check all required fields
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            
            // Add error class
            field.classList.add('error');
            
            // Create error message if it doesn't exist
            let errorMessage = field.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('field-error')) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'field-error';
                errorMessage.textContent = getTranslation('fieldRequired');
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
            
            // Add event listener to remove error on input
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            }, { once: true });
        }
    });
    
    // Validate email fields
    form.querySelectorAll('input[type="email"]').forEach(field => {
        if (field.value.trim() && !validateEmail(field.value)) {
            isValid = false;
            
            // Add error class
            field.classList.add('error');
            
            // Create error message if it doesn't exist
            let errorMessage = field.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('field-error')) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'field-error';
                errorMessage.textContent = getTranslation('invalidEmail');
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
            
            // Add event listener to remove error on input
            field.addEventListener('input', () => {
                if (validateEmail(field.value)) {
                    field.classList.remove('error');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            }, { once: true });
        }
    });
    
    return isValid;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Helper to generate formatted date string
function formatDate(date) {
    if (!date) return '';
    
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    // Safe language check to avoid dependency issues
    const lang = typeof getCurrentLanguage === 'function' ? 
        getCurrentLanguage() : 
        (localStorage.getItem('preferredLanguage') || 'en');
    
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Helper to format currency
function formatCurrency(amount) {
    if (isNaN(amount)) return '';
    
    return new Intl.NumberFormat(getCurrentLanguage() === 'fr' ? 'fr-FR' : 'en-US', { 
        style: 'currency', 
        currency: 'MAD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Helper to get translation or fallback to key
function getTranslationSafe(key) {
    if (typeof getTranslation === 'function') {
        return getTranslation(key);
    }
    return key;
}

// Expose utility functions globally
window.addTooltip = addTooltip;
window.validateForm = validateForm;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.toggleDarkMode = toggleDarkMode;
