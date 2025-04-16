// Global variables
let predictionData = null;
let updateInterval = null;
let activeFilter = 'all';
let isDarkMode = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadPredictionData();
    setupAutoRefresh();
    setupEventListeners();
    setupScrollAnimations();
    setupMouseParallax();
    setupGlobeAnimation();
});

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    isDarkMode = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark);
    updateTheme();

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateTheme();
    });
}

function updateTheme() {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('themeToggle').innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Load prediction data from JSON file
async function loadPredictionData() {
    try {
        showLoadingState();
        
        const response = await fetch('prediction-data.json');
        predictionData = await response.json();
        
        // Simulate network delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateUI();
        removeLoadingState();
    } catch (error) {
        console.error('Error loading prediction data:', error);
        showError('Failed to load prediction data. Please try again later.');
        removeLoadingState();
    }
}

// Update the UI with prediction data
function updateUI() {
    if (!predictionData) return;

    const predictions = predictionData.predictions;
    
    // Update each prediction card
    predictions.forEach(prediction => {
        const card = document.querySelector(`[data-prediction-id="${prediction.id}"]`);
        if (card) {
            updatePredictionCard(card, prediction);
            createPredictionChart(prediction);
        }
    });

    // Update last updated time
    const lastUpdated = new Date(predictions[0].last_updated).toLocaleString();
    document.querySelector('.last-updated').textContent = `Last Updated: ${lastUpdated}`;
}

// Update individual prediction card
function updatePredictionCard(card, prediction) {
    // Update risk level
    const riskLevel = card.querySelector('.risk-level');
    riskLevel.className = `risk-level ${prediction.severity}`;
    riskLevel.querySelector('span').textContent = `${prediction.severity.charAt(0).toUpperCase() + prediction.severity.slice(1)} Risk`;
    
    // Update risk bar with animation
    const riskBar = card.querySelector('.risk-bar');
    const riskPercentage = getRiskPercentage(prediction.severity);
    riskBar.style.width = '0';
    setTimeout(() => {
        riskBar.style.width = `${riskPercentage}%`;
    }, 100);
    
    // Update prediction details with fade-in effect
    const details = card.querySelector('.prediction-details');
    details.style.opacity = '0';
    setTimeout(() => {
        details.innerHTML = `
            <p><strong>${getPredictionMetric(prediction)}</strong></p>
            <p><strong>Affected Areas:</strong> ${prediction.forecast.affected_areas.join(', ')}</p>
            <p><strong>Confidence Level:</strong> ${prediction.confidence}%</p>
        `;
        details.style.opacity = '1';
    }, 300);
}

// Create prediction chart with animation
function createPredictionChart(prediction) {
    const canvas = document.getElementById(`${prediction.type}Chart`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const timeSeries = prediction.forecast.time_series;
    
    // Clear previous chart if it exists
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    canvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeSeries.map(item => `Day ${item.day}`),
            datasets: [{
                label: getChartLabel(prediction.type),
                data: timeSeries.map(item => getChartValue(item, prediction.type)),
                borderColor: getChartColor(prediction.severity),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: getChartColor(prediction.severity),
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            }
        }
    });
}

// Setup auto-refresh
function setupAutoRefresh() {
    // Refresh data every 5 minutes
    updateInterval = setInterval(loadPredictionData, 5 * 60 * 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Manual refresh button
    const refreshButton = document.querySelector('.refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            refreshButton.classList.add('loading');
            loadPredictionData();
            showToast('Data refreshed successfully');
            setTimeout(() => {
                refreshButton.classList.remove('loading');
            }, 1000);
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            activeFilter = type;
            filterPredictions(type);
            updateFilterButtons(button);
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterPredictionsBySearch(searchTerm);
        });
    }

    // Card hover effects
    const cards = document.querySelectorAll('.prediction-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // View details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.prediction-card');
            const predictionId = card.dataset.predictionId;
            showDetailedView(predictionId);
        });
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.prediction-card, .insight-card').forEach(card => {
        observer.observe(card);
    });
}

// Setup mouse parallax effect
function setupMouseParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.documentElement.style.setProperty('--parallax-x', `${x * 20}px`);
        document.documentElement.style.setProperty('--parallax-y', `${y * 20}px`);
    });
}

// Setup globe animation
function setupGlobeAnimation() {
    const globe = document.querySelector('.globe');
    if (!globe) return;

    let rotation = 0;
    setInterval(() => {
        rotation += 0.5;
        globe.style.transform = `rotateY(${rotation}deg)`;
    }, 50);
}

// Update filter buttons
function updateFilterButtons(activeButton) {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Filter predictions by type
function filterPredictions(type) {
    const cards = document.querySelectorAll('.prediction-card');
    cards.forEach(card => {
        if (type === 'all' || card.dataset.predictionType === type) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Filter predictions by search term
function filterPredictionsBySearch(searchTerm) {
    const cards = document.querySelectorAll('.prediction-card');
    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        if (cardText.includes(searchTerm)) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Show detailed view
function showDetailedView(predictionId) {
    const prediction = predictionData.predictions.find(p => p.id === predictionId);
    if (!prediction) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)} Forecast Details</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-chart">
                    <canvas id="modalChart"></canvas>
                </div>
                <div class="modal-details">
                    <h3>Forecast Data</h3>
                    <p><strong>Severity:</strong> ${prediction.severity}</p>
                    <p><strong>Confidence:</strong> ${prediction.confidence}%</p>
                    <p><strong>Affected Areas:</strong> ${prediction.forecast.affected_areas.join(', ')}</p>
                    <h3>Safety Recommendations</h3>
                    <ul>
                        ${prediction.forecast.safety_tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    // Create detailed chart
    const ctx = document.getElementById('modalChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: prediction.forecast.time_series.map(item => `Day ${item.day}`),
            datasets: [{
                label: getChartLabel(prediction.type),
                data: prediction.forecast.time_series.map(item => getChartValue(item, prediction.type)),
                borderColor: getChartColor(prediction.severity),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

    // Close modal
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
}

// Show loading state
function showLoadingState() {
    document.querySelectorAll('.prediction-card').forEach(card => {
        card.classList.add('loading');
    });
}

// Remove loading state
function removeLoadingState() {
    document.querySelectorAll('.prediction-card').forEach(card => {
        card.classList.remove('loading');
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Helper functions
function getRiskPercentage(severity) {
    const riskLevels = {
        'low': 30,
        'medium': 60,
        'high': 85,
        'very_high': 95,
        'extreme': 100
    };
    return riskLevels[severity] || 50;
}

function getPredictionMetric(prediction) {
    switch (prediction.type) {
        case 'wildfire':
            return `Predicted Spread: ${prediction.forecast.spread}`;
        case 'flood':
            return `Predicted Water Level: ${prediction.forecast.water_level}`;
        case 'storm':
            return `Predicted Intensity: ${prediction.forecast.intensity}`;
        case 'landslide':
            return `Predicted Stability: ${prediction.forecast.stability}`;
        default:
            return '';
    }
}

function getChartLabel(type) {
    const labels = {
        'wildfire': 'Spread (miles)',
        'flood': 'Water Level (feet)',
        'storm': 'Intensity (Category)',
        'landslide': 'Stability Index'
    };
    return labels[type] || '';
}

function getChartValue(item, type) {
    switch (type) {
        case 'wildfire':
            return parseFloat(item.spread);
        case 'flood':
            return parseFloat(item.level);
        case 'storm':
            return parseInt(item.intensity.replace('Category ', ''));
        case 'landslide':
            return getStabilityValue(item.stability);
        default:
            return 0;
    }
}

function getStabilityValue(stability) {
    const values = {
        'Very Low': 1,
        'Low': 2,
        'Moderate': 3,
        'High': 4,
        'Very High': 5
    };
    return values[stability] || 3;
}

function getChartColor(severity) {
    const colors = {
        'low': '#2ecc71',
        'medium': '#f1c40f',
        'high': '#e67e22',
        'very_high': '#e74c3c',
        'extreme': '#c0392b'
    };
    return colors[severity] || '#3498db';
} 