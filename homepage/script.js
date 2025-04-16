// Global variables
let isRotating = true;
let rotationInterval;

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinksContainer = document.querySelector('.nav-links-container');
const dropdowns = document.querySelectorAll('.dropdown');
const themeToggle = document.querySelector('.theme-toggle');
const alertCount = document.getElementById('alert-count');
const alertSeverity = document.getElementById('alert-severity');
const alertBadge = document.querySelector('.alert-badge');

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
    
    // Update theme toggle icon
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Update icon with animation
    const icon = themeToggle.querySelector('i');
    icon.classList.add('theme-transition');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Remove animation class after transition
    setTimeout(() => {
        icon.classList.remove('theme-transition');
    }, 300);
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    icon.classList.remove('fa-moon', 'fa-sun');
    icon.classList.add(currentTheme === 'dark' ? 'fa-sun' : 'fa-moon');
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    // Add theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateThemeIcon();
        }
    });
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    
    // Close all dropdowns when mobile menu is closed
    if (!navLinksContainer.classList.contains('active')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Dropdown Toggle for Mobile
dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('.nav-link');
    
    dropdownLink.addEventListener('click', (e) => {
        // Only toggle on mobile
        if (window.innerWidth <= 992) {
        e.preventDefault();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            dropdown.classList.toggle('active');
        }
    });
});

// Simulate real-time alert updates
function updateAlerts() {
    // Update alert counts
    const highAlerts = Math.floor(Math.random() * 20) + 5;
    const moderateAlerts = Math.floor(Math.random() * 30) + 15;
    const lowAlerts = Math.floor(Math.random() * 40) + 25;

    document.getElementById('high-alerts').textContent = highAlerts;
    document.getElementById('moderate-alerts').textContent = moderateAlerts;
    document.getElementById('low-alerts').textContent = lowAlerts;

    // Update alert chart
    alertChart.data.datasets[0].data = alertChart.data.datasets[0].data.slice(1).concat(highAlerts);
    alertChart.data.datasets[1].data = alertChart.data.datasets[1].data.slice(1).concat(moderateAlerts);
    alertChart.data.datasets[2].data = alertChart.data.datasets[2].data.slice(1).concat(lowAlerts);
    alertChart.update();

    // Update recent alerts list
    const recentAlertsList = document.getElementById('recent-alerts-list');
    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item';
    newAlert.innerHTML = `
        <div class="alert-icon ${Math.random() > 0.5 ? 'high' : 'moderate'}">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="alert-info">
            <span class="alert-title">New ${Math.random() > 0.5 ? 'Earthquake' : 'Flood'} Alert</span>
            <span class="alert-location">Location: ${Math.floor(Math.random() * 90)}°N, ${Math.floor(Math.random() * 180)}°E</span>
        </div>
        <div class="alert-time">${new Date().toLocaleTimeString()}</div>
    `;
    recentAlertsList.insertBefore(newAlert, recentAlertsList.firstChild);
    if (recentAlertsList.children.length > 5) {
        recentAlertsList.removeChild(recentAlertsList.lastChild);
    }
}

// Simulate weather updates
function updateWeather() {
    // Update current weather
    const temperature = Math.floor(Math.random() * 15) + 15;
    document.querySelector('.temperature').textContent = `${temperature}°C`;

    // Update weather chart
    weatherChart.data.datasets[0].data = weatherChart.data.datasets[0].data.slice(1).concat(temperature);
    weatherChart.data.datasets[1].data = weatherChart.data.datasets[1].data.slice(1).concat(Math.floor(Math.random() * 100));
    weatherChart.update();

    // Update risk indicators
    const riskLevels = document.querySelectorAll('.risk-level');
    riskLevels.forEach(level => {
        const newWidth = Math.floor(Math.random() * 100);
        level.style.width = `${newWidth}%`;
        const valueElement = level.parentElement.querySelector('.risk-value');
        valueElement.textContent = newWidth > 70 ? 'High' : newWidth > 30 ? 'Moderate' : 'Low';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initCharts();
    
    // Add event listeners for controls
    document.querySelector('.map-control[data-action="rotate"]').addEventListener('click', toggleRotation);
    document.querySelector('.map-control[data-action="reset"]').addEventListener('click', resetCamera);
    
    // Start real-time updates
    setInterval(updateAlerts, 5000);
    setInterval(updateWeather, 10000);
    
    // Initial updates
    updateAlerts();
    updateWeather();
});

// Three.js Scene Setup
let scene, camera, renderer, controls;
let globe, atmosphere;
let markers = [];

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('map-container').appendChild(renderer.domElement);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 3;
    controls.maxDistance = 10;

    // Create globe
    createGlobe();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();

    // Add initial disaster markers
    simulateDisasterData();
}

// Create the globe and atmosphere
function createGlobe() {
    // Create globe geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.05,
        specularMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color('grey'),
        shininess: 5
    });

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Create atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });

    atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (isRotating) {
        globe.rotation.y += 0.001;
        atmosphere.rotation.y += 0.001;
    }

    controls.update();
    renderer.render(scene, camera);
}

// Toggle rotation
function toggleRotation() {
    isRotating = !isRotating;
    const button = document.querySelector('.map-control[data-action="rotate"]');
    button.classList.toggle('active');
    
    if (isRotating) {
        rotationInterval = setInterval(() => {
            map.rotateTo((map.getBearing() + 1) % 360, { duration: 0 });
        }, 50);
    } else {
        clearInterval(rotationInterval);
    }
}

// Reset camera position
function resetCamera() {
    gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 5,
        duration: 1,
        ease: 'power2.inOut'
    });
    gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power2.inOut'
    });
}

// Add disaster markers
function addDisasterMarkers(disasters) {
    disasters.forEach(disaster => {
        const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: getSeverityColor(disaster.severity),
            transparent: true,
            opacity: 0.8
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);

        // Convert lat/long to 3D coordinates
        const phi = (90 - disaster.latitude) * (Math.PI / 180);
        const theta = (disaster.longitude + 180) * (Math.PI / 180);
        marker.position.x = -(Math.sin(phi) * Math.cos(theta)) * 2;
        marker.position.y = Math.cos(phi) * 2;
        marker.position.z = (Math.sin(phi) * Math.sin(theta)) * 2;

        globe.add(marker);
        markers.push(marker);

        // Add pulse animation
        gsap.to(marker.scale, {
            x: 2,
            y: 2,
            z: 2,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

// Get color based on severity
function getSeverityColor(severity) {
    switch(severity) {
        case 'high':
            return 0xff0000;
        case 'moderate':
            return 0xffa500;
        case 'low':
            return 0x00ff00;
        default:
            return 0xffffff;
    }
}

// Simulate real-time disaster data
function simulateDisasterData() {
    const disasters = [
        { latitude: 35.6762, longitude: 139.6503, severity: 'high', type: 'earthquake' },
        { latitude: 40.7128, longitude: -74.0060, severity: 'moderate', type: 'flood' },
        { latitude: -33.8688, longitude: 151.2093, severity: 'low', type: 'fire' }
    ];

    addDisasterMarkers(disasters);
}

// Chart.js Setup
let alertChart, weatherChart;

// Initialize charts
function initCharts() {
    // Alert Chart
    const alertCtx = document.getElementById('alertChart').getContext('2d');
    alertChart = new Chart(alertCtx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [
                {
                    label: 'High Severity',
                    data: [5, 8, 12, 10, 15, 12],
                    borderColor: 'rgb(255, 0, 0)',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Moderate',
                    data: [15, 20, 25, 22, 28, 25],
                    borderColor: 'rgb(255, 165, 0)',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Low Severity',
                    data: [25, 30, 35, 32, 38, 35],
                    borderColor: 'rgb(0, 255, 0)',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                },
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                }
            }
        }
    });

    // Weather Chart
    const weatherCtx = document.getElementById('weatherChart').getContext('2d');
    weatherChart = new Chart(weatherCtx, {
        type: 'line',
        data: {
            labels: ['Now', '3h', '6h', '9h', '12h', '15h', '18h', '21h'],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [24, 26, 28, 27, 25, 23, 22, 21],
                    borderColor: 'rgb(255, 165, 0)',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Precipitation (%)',
                    data: [0, 10, 30, 60, 80, 50, 20, 0],
                    borderColor: 'rgb(0, 119, 255)',
                    backgroundColor: 'rgba(0, 119, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                },
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                    }
                }
            }
        }
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    // Check if click is outside any dropdown
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // If window is resized to desktop view, reset mobile menu
    if (window.innerWidth > 992) {
        mobileMenuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Add active class to current nav link based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});

// Contribute button functionality
document.addEventListener('DOMContentLoaded', () => {
    const contributeBtn = document.getElementById('contributeBtn');
    if (contributeBtn) {
        contributeBtn.addEventListener('click', () => {
            // Show contribution modal or redirect to contribution form
            const contributionTypes = [
                { type: 'volunteer', title: 'Volunteer', icon: 'fa-user-friends' },
                { type: 'donate', title: 'Donate', icon: 'fa-hand-holding-heart' },
                { type: 'share', title: 'Share Resources', icon: 'fa-share-alt' },
                { type: 'report', title: 'Report Incidents', icon: 'fa-flag' }
            ];

            // Create and show modal
            const modal = document.createElement('div');
            modal.className = 'contribution-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>How would you like to contribute?</h3>
                    <div class="contribution-options">
                        ${contributionTypes.map(option => `
                            <button class="contribution-option" data-type="${option.type}">
                                <i class="fas ${option.icon}"></i>
                                <span>${option.title}</span>
                            </button>
                        `).join('')}
                    </div>
                    <button class="modal-close">×</button>
                </div>
            `;

            document.body.appendChild(modal);

            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .contribution-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    position: relative;
                    max-width: 500px;
                    width: 90%;
                }

                .contribution-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .contribution-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .contribution-option:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .contribution-option i {
                    font-size: 1.5rem;
                    color: #3b82f6;
                }

                .modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                }
            `;
            document.head.appendChild(style);

            // Handle contribution option clicks
            modal.querySelectorAll('.contribution-option').forEach(option => {
                option.addEventListener('click', () => {
                    const type = option.dataset.type;
                    // Handle different contribution types
                    switch(type) {
                        case 'volunteer':
                            window.location.href = '/volunteer';
                            break;
                        case 'donate':
                            window.location.href = '/donate';
                            break;
                        case 'share':
                            window.location.href = '/share-resources';
                            break;
                        case 'report':
                            window.location.href = '/report-incident';
                            break;
                    }
                });
            });

            // Handle modal close
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
                style.remove();
            });

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    style.remove();
                }
            });
        });
    }
});

// Enhanced Map Controls with 3D Effects
function initializeMapControls() {
    const controls = document.querySelectorAll('.map-control');
    controls.forEach(control => {
        // Add 3D tilt effect on hover
        control.addEventListener('mousemove', (e) => {
            const rect = control.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            control.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });
        
        control.addEventListener('mouseleave', () => {
            control.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Enhanced Feature Cards with Parallax Effect
function initializeFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        // Add parallax effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translate(0, 0) scale(1)';
        });
        
        // Add floating animation to icons
        const icon = card.querySelector('.icon');
        if (icon) {
            icon.classList.add('floating');
        }
    });
}

// Enhanced Alert Box with Dynamic Updates
function initializeAlertBox() {
    const alertBox = document.querySelector('.alert-box');
    if (alertBox) {
        // Add pulse animation to high severity alerts
        const highSeverityAlerts = alertBox.querySelectorAll('.alert[data-severity="high"]');
        highSeverityAlerts.forEach(alert => {
            alert.classList.add('pulsing');
        });
        
        // Add hover effect with 3D transform
        alertBox.addEventListener('mouseenter', () => {
            alertBox.style.transform = 'translateY(-2px) rotateX(5deg)';
            alertBox.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        });
        
        alertBox.addEventListener('mouseleave', () => {
            alertBox.style.transform = 'translateY(0) rotateX(0)';
            alertBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    }
}

// Enhanced Navigation Links with Smooth Transitions
function initializeNavigationLinks() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        // Add hover effect with gradient
        link.addEventListener('mouseenter', () => {
            link.style.background = 'var(--primary-gradient)';
            link.style.webkitBackgroundClip = 'text';
            link.style.webkitTextFillColor = 'transparent';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.background = 'none';
            link.style.webkitTextFillColor = '';
        });
    });
}

// Enhanced Contribution Modal with 3D Effects
function initializeContributionModal() {
    const modal = document.querySelector('.contribution-modal');
    if (modal) {
        const options = modal.querySelectorAll('.contribution-option');
        options.forEach(option => {
            // Add 3D tilt effect
            option.addEventListener('mousemove', (e) => {
                const rect = option.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                option.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
            
            // Add rotating animation to icons
            const icon = option.querySelector('i');
            if (icon) {
                icon.classList.add('rotating');
            }
        });
    }
}

// Initialize all enhancements with smooth loading
document.addEventListener('DOMContentLoaded', () => {
    // Add loading state to elements
    const elements = document.querySelectorAll('.feature-card, .alert-box, .contribution-option');
    elements.forEach(el => {
        el.classList.add('loading');
    });
    
    // Initialize all enhancements
    setTimeout(() => {
        initializeMapControls();
        initializeFeatureCards();
        initializeAlertBox();
        initializeNavigationLinks();
        initializeContributionModal();
        
        // Remove loading state
        elements.forEach(el => {
            el.classList.remove('loading');
        });
        
        // Add smooth scrolling with easing
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add parallax effect to hero section
        const hero = document.querySelector('.hero-section');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            });
        }
        
        // Add intersection observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.feature-card, .alert-box, .contribution-option').forEach(el => {
            observer.observe(el);
        });
    }, 500); // Delay initialization for smooth loading effect
});

// Map initialization and controls
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupMapControls();
    setupAnimations();
});

function initializeMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Initialize Mapbox GL JS
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        center: [0, 0],
        zoom: 1.5,
        pitch: 45,
        bearing: 0
    });

    // Add 3D terrain
    map.on('style.load', () => {
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        
        // Add sky layer
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        })
    );

    // Store map instance
    window.disasterMap = map;
}

function setupMapControls() {
    const controls = document.querySelectorAll('.map-control');
    controls.forEach(control => {
        control.addEventListener('click', () => {
            const action = control.dataset.action;
            handleMapControl(action);
        });
    });
}

function handleMapControl(action) {
    const map = window.disasterMap;
    if (!map) return;

    switch (action) {
        case 'zoom-in':
            map.zoomIn();
            break;
        case 'zoom-out':
            map.zoomOut();
            break;
        case 'rotate':
            toggleMapRotation();
            break;
        case 'fullscreen':
            toggleFullscreen();
            break;
    }
}

function toggleMapRotation() {
    const map = window.disasterMap;
    if (!map) return;

    const rotateButton = document.querySelector('[data-action="rotate"]');
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
        rotateButton.classList.remove('active');
    } else {
        rotationInterval = setInterval(() => {
            map.rotateTo((map.getBearing() + 1) % 360, {
                duration: 0
            });
        }, 50);
        rotateButton.classList.add('active');
    }
}

function toggleFullscreen() {
    const mapContainer = document.getElementById('map-container');
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function setupAnimations() {
    // Add intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
        observer.observe(el);
    });

    // Add hover effects for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.02)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add disaster markers
function addDisasterMarker(coordinates, severity, type, description) {
    const map = window.disasterMap;
    if (!map) return;

    const colors = {
        high: '#ff4444',
        moderate: '#ffaa00',
        low: '#44ff44'
    };

    const marker = document.createElement('div');
    marker.className = 'disaster-marker';
    marker.style.backgroundColor = colors[severity];
    marker.style.width = '20px';
    marker.style.height = '20px';
    marker.style.borderRadius = '50%';
    marker.style.boxShadow = `0 0 20px ${colors[severity]}`;
    marker.style.cursor = 'pointer';

    // Add pulse animation
    marker.style.animation = 'pulse 2s infinite';

    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
            <div class="disaster-popup">
                <h3>${type}</h3>
                <p>${description}</p>
                <span class="severity ${severity}">${severity.toUpperCase()}</span>
            </div>
        `);

    // Add marker to map
    new mapboxgl.Marker(marker)
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
}

// Example disaster markers
const disasters = [
    {
        location: [139.6917, 35.6895], // Tokyo
        type: 'earthquake',
        severity: 'high',
        description: 'Magnitude 7.2 earthquake reported in Tokyo area'
    },
    {
        location: [-122.4194, 37.7749], // San Francisco
        type: 'flood',
        severity: 'moderate',
        description: 'Flooding reported in downtown area'
    },
    {
        location: [151.2093, -33.8688], // Sydney
        type: 'wildfire',
        severity: 'low',
        description: 'Small brush fire contained in national park'
    }
];

// Add markers when map is loaded
window.disasterMap.on('load', () => {
    disasters.forEach(disaster => {
        addDisasterMarker(
            disaster.location,
            disaster.severity,
            disaster.type,
            disaster.description
        );
    });
});

// Map controls
const rotateButton = document.getElementById('rotate-map');
const resetButton = document.getElementById('reset-map');
const fullscreenButton = document.getElementById('fullscreen-map');

// Use existing rotationInterval variable
rotateButton.addEventListener('click', () => {
    isRotating = !isRotating;
    rotateButton.classList.toggle('active');
    
    if (isRotating) {
        rotationInterval = setInterval(() => {
            map.rotateTo((map.getBearing() + 1) % 360, { duration: 0 });
        }, 50);
    } else {
        clearInterval(rotationInterval);
    }
});

resetButton.addEventListener('click', () => {
    map.flyTo({
        center: [0, 0],
        zoom: 1.5,
        bearing: 0,
        pitch: 0,
        duration: 2000
    });
    isRotating = false;
    rotateButton.classList.remove('active');
    clearInterval(rotationInterval);
});

fullscreenButton.addEventListener('click', () => {
    const container = document.querySelector('.hero-map-container');
    
    if (!document.fullscreenElement) {
        container.requestFullscreen();
        fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    }
});

// Handle fullscreen change
document.addEventListener('fullscreenchange', () => {
    const container = document.querySelector('.hero-map-container');
    if (!document.fullscreenElement) {
        fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    }
});

// Add fade-in animation to elements
document.querySelectorAll('.fade-in').forEach(element => {
    element.style.opacity = '0';
    element.style.animation = 'fadeIn 0.6s ease forwards';
}); 