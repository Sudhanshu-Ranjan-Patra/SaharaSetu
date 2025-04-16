// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupTooltips();
    setupInsightButtons();
});

// Initialize all charts
function initializeCharts() {
    createWildfireChart();
    createFloodChart();
    createStormChart();
    createLandslideChart();
    createAccuracyChart();
}

// Create wildfire prediction chart
function createWildfireChart() {
    const ctx = document.getElementById('wildfireChart').getContext('2d');
    const wildfireChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Predicted Spread (miles)',
                data: [0, 0.8, 1.5, 2.1, 2.8, 3.2, 3.5],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
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
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Spread Distance (miles)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create flood prediction chart
function createFloodChart() {
    const ctx = document.getElementById('floodChart').getContext('2d');
    const floodChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Water Level (feet above normal)',
                data: [0, 0.5, 1.2, 1.8, 2.3, 2.8, 3.1],
                backgroundColor: '#3498db',
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
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Water Level (feet)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create storm prediction chart
function createStormChart() {
    const ctx = document.getElementById('stormChart').getContext('2d');
    const stormChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Wind Speed', 'Precipitation', 'Pressure', 'Temperature', 'Humidity', 'Duration'],
            datasets: [{
                label: 'Storm Intensity',
                data: [65, 75, 45, 60, 80, 70],
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.2)',
                pointBackgroundColor: '#9b59b6',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#9b59b6'
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
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// Create landslide prediction chart
function createLandslideChart() {
    const ctx = document.getElementById('landslideChart').getContext('2d');
    const landslideChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Soil Stability Index',
                data: [100, 95, 85, 75, 65, 60, 55],
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
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
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Stability Index (%)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create accuracy comparison chart
function createAccuracyChart() {
    const ctx = document.getElementById('accuracyChart').getContext('2d');
    const accuracyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Wildfire', 'Flood', 'Storm', 'Landslide'],
            datasets: [{
                label: 'Prediction Accuracy (%)',
                data: [87, 92, 78, 65],
                backgroundColor: [
                    '#e74c3c',
                    '#3498db',
                    '#9b59b6',
                    '#f39c12'
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
                            return `Accuracy: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Accuracy (%)'
                    }
                }
            }
        }
    });
}

// Setup tooltips for info icons
function setupTooltips() {
    const infoIcons = document.querySelectorAll('.info-icon');
    
    infoIcons.forEach(icon => {
        icon.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.closest('.info-icon').getAttribute('data-tooltip');
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        });
        
        icon.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Setup insight buttons
function setupInsightButtons() {
    const insightButtons = document.querySelectorAll('.insight-btn');
    
    insightButtons.forEach(button => {
        button.addEventListener('click', () => {
            const insightTitle = button.closest('.insight-content').querySelector('h3').textContent;
            
            // Show a modal or alert with more detailed information
            alert(`Detailed analysis for "${insightTitle}" would be displayed here.`);
            
            // In a real application, this would open a modal with detailed information
            // or navigate to a more detailed page
        });
    });
}

// Add CSS for tooltips
const style = document.createElement('style');
style.textContent = `
    .tooltip {
        position: absolute;
        background-color: #2c3e50;
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 0.9rem;
        z-index: 1000;
        max-width: 250px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #2c3e50;
    }
`;
document.head.appendChild(style); 