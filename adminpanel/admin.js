// Admin Panel JavaScript

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const themeToggle = document.querySelector('.theme-toggle');
const searchInput = document.querySelector('.search-container input');
const notificationBtn = document.querySelector('.notification-btn');
const helpBtn = document.querySelector('.help-btn');
const toastContainer = document.querySelector('.toast-container');

// State Management
let currentTheme = localStorage.getItem('theme') || 'light';
let notifications = [];
let activeAlerts = [];
let shelters = [];
let contributors = [];
let rescueRequests = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadData();
    setupEventListeners();
    initializeCharts();
    startRealTimeUpdates();
});

// Theme Management
function initializeTheme() {
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    initializeTheme();
}

// Data Loading
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Update dashboard stats
        updateDashboardStats(data.dashboard);
        
        // Load other data
        notifications = data.notifications || [];
        activeAlerts = data.alerts || [];
        shelters = data.shelters || [];
        contributors = data.contributors || [];
        rescueRequests = data.rescueRequests || [];
        
        // Update UI
        updateNotifications();
        updateAlertsList();
        updateSheltersList();
        updateContributorsList();
        updateRescueRequestsList();
    } catch (error) {
        showToast('Error loading data', 'error');
    }
}

// Dashboard Updates
function updateDashboardStats(stats) {
    const elements = {
        activeAlerts: document.querySelector('.stat-card:nth-child(1) .stat-value'),
        activeShelters: document.querySelector('.stat-card:nth-child(2) .stat-value'),
        pendingVerifications: document.querySelector('.stat-card:nth-child(3) .stat-value'),
        rescueRequests: document.querySelector('.stat-card:nth-child(4) .stat-value')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (element && stats[key] !== undefined) {
            element.textContent = stats[key];
            // Add animation class
            element.classList.add('stat-update');
            setTimeout(() => element.classList.remove('stat-update'), 1000);
        }
    }
}

// Charts
function initializeCharts() {
    const ctx = document.getElementById('alertChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Alerts',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Event Listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    notificationBtn.addEventListener('click', toggleNotifications);
    helpBtn.addEventListener('click', showHelp);
    
    // Sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.getAttribute('data-section');
            navigateToSection(section);
        });
    });
}

// Navigation
function navigateToSection(section) {
    // Remove active class from all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Add active class to target section
    const targetSection = document.querySelector(`.${section}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update URL without page reload
        history.pushState({}, '', `#${section}`);
    }
}

// Search Functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach(section => {
        const items = section.querySelectorAll('.list-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Real-time Updates
function startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Update random stat
        const stats = {
            activeAlerts: Math.floor(Math.random() * 50),
            activeShelters: Math.floor(Math.random() * 200),
            pendingVerifications: Math.floor(Math.random() * 20),
            rescueRequests: Math.floor(Math.random() * 100)
        };
        
        updateDashboardStats(stats);
    }, 30000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        updateDashboardStats,
        showToast,
        handleSearch
    };
}
