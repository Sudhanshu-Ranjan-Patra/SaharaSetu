// Contact Page Script

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const loadingIndicator = document.querySelector('.loading-indicator');
const navbar = document.querySelector('.navbar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.querySelector('.theme-toggle');
const searchInput = document.querySelector('.search-input');
const clearSearch = document.querySelector('.clear-search');
const notificationBtn = document.querySelector('.notification-btn');
const profileBtn = document.querySelector('.profile-btn');

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Form validation function
    const validateForm = (e) => {
        let isValid = true;
        const formData = new FormData(contactForm);
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        
        // Validate Full Name
        const fullName = formData.get('fullName');
        if (!fullName || fullName.trim().length < 2) {
            showError('fullName', 'Please enter a valid name (minimum 2 characters)');
            isValid = false;
        }
        
        // Validate Email
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate Subject
        const subject = formData.get('subject');
        if (!subject || subject.trim().length < 5) {
            showError('subject', 'Please enter a subject (minimum 5 characters)');
            isValid = false;
        }
        
        // Validate Message
        const message = formData.get('message');
        if (!message || message.trim().length < 10) {
            showError('message', 'Please enter a message (minimum 10 characters)');
            isValid = false;
        }
        
        return isValid;
    };
    
    // Show error message
    const showError = (fieldName, message) => {
        const errorElement = document.querySelector(`[name="${fieldName}"]`).closest('.form-group').querySelector('.error-message');
        errorElement.textContent = message;
        
        // Add shake animation to the input
        const input = document.querySelector(`[name="${fieldName}"]`).closest('.input-container');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    };
    
    // Handle form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(e)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Show error message
            showToast('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const errorElement = group.querySelector('.error-message');
        
        input.addEventListener('input', () => {
            errorElement.textContent = '';
            input.closest('.input-container').classList.remove('shake');
        });
        
        // Add focus effects
        input.addEventListener('focus', () => {
            input.closest('.input-container').classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.closest('.input-container').classList.remove('focused');
        });
    });
});

// Toast Notifications
const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Team Cards Animation
document.addEventListener('DOMContentLoaded', () => {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const socialIcons = card.querySelectorAll('.social-icon');
            socialIcons.forEach((icon, index) => {
                icon.style.transitionDelay = `${index * 0.1}s`;
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const socialIcons = card.querySelectorAll('.social-icon');
            socialIcons.forEach(icon => {
                icon.style.transitionDelay = '0s';
            });
        });
    });
});

// Parallax Effect for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.contact-hero');
    const decorativeElements = document.querySelectorAll('.decorative-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        decorativeElements.forEach((element, index) => {
            const speed = index === 0 ? 0.5 : 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});

// Map Initialization
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.querySelector('.map-container');
    
    // Initialize map when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Replace with actual map initialization code
                mapContainer.innerHTML = `
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.69714941680709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043439265!5m2!1sen!2s"
                        width="100%"
                        height="450"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy">
                    </iframe>
                `;
                observer.unobserve(mapContainer);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(mapContainer);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.3s ease-in-out;
    }
    
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .toast-success {
        background: linear-gradient(135deg, #48bb78, #38a169);
    }
    
    .toast-error {
        background: linear-gradient(135deg, #f56565, #e53e3e);
    }
    
    .input-container.focused {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.3);
    }
    
    .input-container.focused i {
        color: var(--accent-color);
    }
`;

document.head.appendChild(style);

// Loading Indicator
window.addEventListener('load', () => {
    loadingIndicator.style.opacity = '0';
    setTimeout(() => {
        loadingIndicator.style.display = 'none';
    }, 300);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Sidebar Toggle
sidebarToggle.addEventListener('click', () => {
    const isExpanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
    sidebarToggle.setAttribute('aria-expanded', !isExpanded);
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarToggle.setAttribute('aria-expanded', 'false');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Search Functionality
searchInput.addEventListener('input', () => {
    clearSearch.style.display = searchInput.value ? 'block' : 'none';
});

clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    searchInput.focus();
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.notifications')) {
        document.querySelector('.notification-dropdown')?.classList.remove('show');
    }
    if (!e.target.closest('.profile')) {
        document.querySelector('.profile-dropdown')?.classList.remove('show');
    }
});

// Notification Toggle
notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.querySelector('.notification-dropdown');
    dropdown.classList.toggle('show');
});

// Profile Toggle
profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = document.querySelector('.profile-dropdown');
    dropdown.classList.toggle('show');
});

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Enhanced Animations with GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Hero section animations
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-stats .stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Team cards animation
    gsap.from('.team-card', {
        scrollTrigger: {
            trigger: '.team-section',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Contact form animation
    gsap.from('.contact-form-container', {
        scrollTrigger: {
            trigger: '.contact-form-section',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
}); 