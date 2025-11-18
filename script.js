
// State Management
const appState = {
    currentPage: 'home',
    formData: {
        name: '',
        email: '',
        phone: '',
        message: ''
    },
    formErrors: {
        name: '',
        email: '',
        phone: '',
        message: ''
    },
    touched: {
        name: false,
        email: false,
        phone: false,
        message: false
    },
    isSubmitted: false
};

// Validation Functions
function validateName(name) {
    if (!name || name.trim() === '') {
        return 'Name is required';
    }
    if (name.trim().length < 3) {
        return 'Name must be at least 3 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
}

function validateEmail(email) {
    if (!email || email.trim() === '') {
        return 'Email is required';
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return 'Phone number is required';
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 12) {
        return 'Phone number must be between 9 and 12 digits';
    }
    if (!/^[0-9]+$/.test(cleanPhone)) {
        return 'Phone number can only contain digits';
    }
    return '';
}

function validateMessage(message) {
    if (!message || message.trim() === '') {
        return 'Message is required';
    }
    if (message.trim().length < 10) {
        return 'Message must be at least 10 characters';
    }
    if (message.trim().length > 500) {
        return 'Message must not exceed 500 characters';
    }
    return '';
}

// Form Validation and Display Functions
function validateField(fieldName, value) {
    let error = '';
    switch (fieldName) {
        case 'name':
            error = validateName(value);
            break;
        case 'email':
            error = validateEmail(value);
            break;
        case 'phone':
            error = validatePhone(value);
            break;
        case 'message':
            error = validateMessage(value);
            break;
    }
    appState.formErrors[fieldName] = error;
    return error;
}

function displayFieldError(fieldName) {
    const input = document.getElementById(fieldName);
    const errorSpan = document.getElementById(fieldName + 'Error');
    const error = appState.formErrors[fieldName];

    if (error && appState.touched[fieldName]) {
        errorSpan.textContent = error;
        input.classList.add('error');
        input.classList.remove('valid');
        input.setAttribute('aria-invalid', 'true');
    } else if (!error && appState.touched[fieldName] && appState.formData[fieldName]) {
        errorSpan.textContent = '';
        input.classList.remove('error');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
    } else {
        errorSpan.textContent = '';
        input.classList.remove('error', 'valid');
        input.setAttribute('aria-invalid', 'false');
    }
}

function validateForm() {
    const errors = {
        name: validateName(appState.formData.name),
        email: validateEmail(appState.formData.email),
        phone: validatePhone(appState.formData.phone),
        message: validateMessage(appState.formData.message)
    };
    appState.formErrors = errors;
    return !Object.values(errors).some(error => error !== '');
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    const isValid = validateForm();
    submitBtn.disabled = !isValid;
}

// Navigation Functions
function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.remove('hidden');
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    appState.currentPage = pageName;

    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
    document.getElementById('hamburger').setAttribute('aria-expanded', 'false');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize App
function initApp() {
    // Navigation event listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            switchPage(page);
        });
    });

    // Hamburger menu
    document.getElementById('hamburger').addEventListener('click', () => {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Hero contact button
    document.getElementById('heroContactBtn').addEventListener('click', () => {
        switchPage('contact');
    });

    // Logo link to home
    document.getElementById('logoLink').addEventListener('click', (e) => {
        e.preventDefault();
        switchPage('home');
    });

    // Footer navigation links
    document.querySelectorAll('.footer-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            switchPage(page);
        });
    });

    // Form event listeners
    const form = document.getElementById('contactForm');
    const fields = ['name', 'email', 'phone', 'message'];

    fields.forEach(fieldName => {
        const input = document.getElementById(fieldName);

        // Handle input changes
        input.addEventListener('input', (e) => {
            appState.formData[fieldName] = e.target.value;
            validateField(fieldName, e.target.value);
            displayFieldError(fieldName);
            updateSubmitButton();
        });

        // Handle blur (when user leaves field)
        input.addEventListener('blur', () => {
            appState.touched[fieldName] = true;
            validateField(fieldName, appState.formData[fieldName]);
            displayFieldError(fieldName);
        });
    });








    // Form submission -> send to Node backend /api/contact
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // we'll handle submission via JS

        // Mark all fields as touched
        fields.forEach(field => {
            appState.touched[field] = true;
        });

        // Validate all fields
        const isValid = validateForm();

        // Display errors
        fields.forEach(field => {
            displayFieldError(field);
        });

        if (!isValid) {
            // Focus first error field
            const firstErrorField = fields.find(field => appState.formErrors[field]);
            if (firstErrorField) {
                document.getElementById(firstErrorField).focus();
            }
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const successMessage = document.getElementById('successMessage');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Build payload from state
        const payload = {
            name: appState.formData.name,
            email: appState.formData.email,
            phone: appState.formData.phone,
            message: appState.formData.message
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.ok) {
                resetForm();
                successMessage.classList.remove('hidden');
                successMessage.textContent = '✓ Thank you for your message! We will get back to you soon.';
            } else {
                alert(data.error || 'Something went wrong while sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending form:', error);
            alert('Unable to send your message right now. Please check your connection and try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });







    // // Form submission
    // form.addEventListener('submit', (e) => {
    //     // Mark all fields as touched
    //     fields.forEach(field => {
    //         appState.touched[field] = true;
    //     });

    //     // Validate all fields
    //     const isValid = validateForm();

    //     // Display errors
    //     fields.forEach(field => {
    //         displayFieldError(field);
    //     });

    //     if (!isValid) {
    //         e.preventDefault();
    //         // Focus first error field
    //         const firstErrorField = fields.find(field => appState.formErrors[field]);
    //         if (firstErrorField) {
    //             document.getElementById(firstErrorField).focus();
    //         }
    //     }
    //     // If valid, form will submit to FormSubmit service
    // });




    // Clear button
    document.getElementById('clearBtn').addEventListener('click', () => {
        resetForm();
    });
}

function resetForm() {
    // Reset state
    appState.formData = { name: '', email: '', phone: '', message: '' };
    appState.formErrors = { name: '', email: '', phone: '', message: '' };
    appState.touched = { name: false, email: false, phone: false, message: false };
    appState.isSubmitted = false;

    // Reset form inputs
    document.getElementById('contactForm').reset();

    // Clear error messages and styles
    ['name', 'email', 'phone', 'message'].forEach(field => {
        const input = document.getElementById(field);
        const errorSpan = document.getElementById(field + 'Error');
        errorSpan.textContent = '';
        input.classList.remove('error', 'valid');
        input.setAttribute('aria-invalid', 'false');
    });

    // Hide success message
    document.getElementById('successMessage').classList.add('hidden');

    // Update submit button
    updateSubmitButton();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
