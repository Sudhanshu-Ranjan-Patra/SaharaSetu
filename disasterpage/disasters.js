// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// User Profile Dropdown
const userProfile = document.querySelector('.user-profile');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!userProfile.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

userProfile.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Sample Disaster Data
const disasterData = [
    {
        id: 1,
        type: 'earthquake',
        severity: 'high',
        dateTime: '2024-06-15 08:30:00',
        location: 'San Francisco, CA',
        status: 'ongoing',
        description: 'Magnitude 6.2 earthquake with multiple aftershocks',
        affectedPeople: 5000
    },
    {
        id: 2,
        type: 'flood',
        severity: 'medium',
        dateTime: '2024-06-14 15:45:00',
        location: 'New Orleans, LA',
        status: 'ongoing',
        description: 'Heavy rainfall causing river overflow',
        affectedPeople: 3000
    },
    {
        id: 3,
        type: 'wildfire',
        severity: 'high',
        dateTime: '2024-06-13 12:15:00',
        location: 'Los Angeles, CA',
        status: 'ongoing',
        description: 'Fast-spreading wildfire in dry conditions',
        affectedPeople: 8000
    },
    {
        id: 4,
        type: 'hurricane',
        severity: 'high',
        dateTime: '2024-06-12 09:00:00',
        location: 'Miami, FL',
        status: 'warning',
        description: 'Category 3 hurricane approaching coastline',
        affectedPeople: 15000
    },
    {
        id: 5,
        type: 'earthquake',
        severity: 'low',
        dateTime: '2024-06-11 14:20:00',
        location: 'Seattle, WA',
        status: 'resolved',
        description: 'Minor earthquake with no significant damage',
        affectedPeople: 500
    },
    {
        id: 6,
        type: 'flood',
        severity: 'high',
        dateTime: '2024-06-10 11:30:00',
        location: 'Houston, TX',
        status: 'ongoing',
        description: 'Flash flooding in urban areas',
        affectedPeople: 12000
    },
    {
        id: 7,
        type: 'wildfire',
        severity: 'medium',
        dateTime: '2024-06-09 16:45:00',
        location: 'Denver, CO',
        status: 'ongoing',
        description: 'Wildfire spreading in forested area',
        affectedPeople: 2000
    },
    {
        id: 8,
        type: 'hurricane',
        severity: 'medium',
        dateTime: '2024-06-08 10:15:00',
        location: 'Charleston, SC',
        status: 'resolved',
        description: 'Category 1 hurricane with minimal impact',
        affectedPeople: 3000
    },
    {
        id: 9,
        type: 'earthquake',
        severity: 'medium',
        dateTime: '2024-06-07 07:30:00',
        location: 'Portland, OR',
        status: 'resolved',
        description: 'Moderate earthquake with some structural damage',
        affectedPeople: 1500
    },
    {
        id: 10,
        type: 'flood',
        severity: 'low',
        dateTime: '2024-06-06 13:20:00',
        location: 'Chicago, IL',
        status: 'resolved',
        description: 'Localized flooding due to heavy rain',
        affectedPeople: 800
    }
];

// DOM Elements
const disasterTableBody = document.getElementById('disasterTableBody');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const activeCount = document.getElementById('activeCount');
const affectedCount = document.getElementById('affectedCount');
const riskCount = document.getElementById('riskCount');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Populate the disaster table
    renderDisasterTable(disasterData);
    
    // Update dashboard stats
    updateDashboardStats(disasterData);
    
    // Add event listeners
    setupEventListeners();
});

// Render the disaster table
function renderDisasterTable(disasters) {
    disasterTableBody.innerHTML = '';
    
    if (disasters.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6" style="text-align: center; padding: 2rem;">No disasters found matching your criteria</td>';
        disasterTableBody.appendChild(emptyRow);
        return;
    }
    
    disasters.forEach(disaster => {
        const row = document.createElement('tr');
        
        // Format date and time
        const dateTime = new Date(disaster.dateTime);
        const formattedDateTime = dateTime.toLocaleString();
        
        // Get disaster icon based on type
        let disasterIcon = '';
        switch(disaster.type) {
            case 'earthquake':
                disasterIcon = '<i class="fas fa-mountain"></i>';
                break;
            case 'flood':
                disasterIcon = '<i class="fas fa-water"></i>';
                break;
            case 'wildfire':
                disasterIcon = '<i class="fas fa-fire"></i>';
                break;
            case 'hurricane':
                disasterIcon = '<i class="fas fa-hurricane"></i>';
                break;
            default:
                disasterIcon = '<i class="fas fa-exclamation-triangle"></i>';
        }
        
        // Capitalize first letter of disaster type
        const disasterType = disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1);
        
        row.innerHTML = `
            <td>
                <div class="disaster-type ${disaster.type}">
                    ${disasterIcon}
                    <span>${disasterType}</span>
                </div>
            </td>
            <td><span class="severity ${disaster.severity}">${disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1)}</span></td>
            <td>${formattedDateTime}</td>
            <td>${disaster.location}</td>
            <td><span class="status ${disaster.status}">${disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${disaster.id}">View Details</button>
                </div>
            </td>
        `;
        
        disasterTableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const disasterId = parseInt(btn.getAttribute('data-id'));
            const disaster = disasterData.find(d => d.id === disasterId);
            if (disaster) {
                showDisasterDetails(disaster);
            }
        });
    });
}

// Update dashboard statistics
function updateDashboardStats(disasters) {
    // Count active alerts
    const activeAlerts = disasters.filter(d => d.status === 'ongoing' || d.status === 'warning').length;
    activeCount.textContent = activeAlerts;
    
    // Count affected areas (unique locations)
    const uniqueLocations = new Set(disasters.map(d => d.location)).size;
    affectedCount.textContent = uniqueLocations;
    
    // Calculate total people at risk
    const totalPeopleAtRisk = disasters.reduce((sum, d) => sum + d.affectedPeople, 0);
    riskCount.textContent = totalPeopleAtRisk.toLocaleString() + '+';
}

// Show disaster details in a modal
function showDisasterDetails(disaster) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'disaster-modal';
    
    // Format date and time
    const dateTime = new Date(disaster.dateTime);
    const formattedDateTime = dateTime.toLocaleString();
    
    // Capitalize first letter of disaster type and status
    const disasterType = disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1);
    const disasterStatus = disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1);
    const disasterSeverity = disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1);
    
    // Get disaster icon based on type
    let disasterIcon = '';
    switch(disaster.type) {
        case 'earthquake':
            disasterIcon = '<i class="fas fa-mountain"></i>';
            break;
        case 'flood':
            disasterIcon = '<i class="fas fa-water"></i>';
            break;
        case 'wildfire':
            disasterIcon = '<i class="fas fa-fire"></i>';
            break;
        case 'hurricane':
            disasterIcon = '<i class="fas fa-hurricane"></i>';
            break;
        default:
            disasterIcon = '<i class="fas fa-exclamation-triangle"></i>';
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <div class="disaster-type ${disaster.type}">
                    ${disasterIcon}
                    <h2>${disasterType} Alert</h2>
                </div>
                <span class="severity ${disaster.severity}">${disasterSeverity} Severity</span>
            </div>
            <div class="modal-body">
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${disaster.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${formattedDateTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status ${disaster.status}">${disasterStatus}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Affected People:</span>
                    <span class="detail-value">${disaster.affectedPeople.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${disaster.description}</span>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn primary">Get Emergency Resources</button>
                <button class="btn secondary">Report Incident</button>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modal);
    
    // Add styles for the modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .disaster-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: modalFadeIn 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .close-modal {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #7f8c8d;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #2c3e50;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .detail-row {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-weight: 600;
            color: #7f8c8d;
            margin-bottom: 5px;
        }
        
        .detail-value {
            color: #2c3e50;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        @media (max-width: 576px) {
            .modal-content {
                width: 95%;
            }
            
            .modal-footer {
                flex-direction: column;
            }
            
            .modal-footer .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Add event listener to close button
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter disasters
            let filteredDisasters = [...disasterData];
            
            if (filterValue !== 'all') {
                filteredDisasters = disasterData.filter(disaster => disaster.type === filterValue);
            }
            
            // Apply search filter if there's a search term
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                filteredDisasters = filteredDisasters.filter(disaster => 
                    disaster.location.toLowerCase().includes(searchTerm)
                );
            }
            
            // Render filtered disasters
            renderDisasterTable(filteredDisasters);
        });
    });
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Get active filter
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        // Filter disasters
        let filteredDisasters = [...disasterData];
        
        // Apply type filter
        if (activeFilter !== 'all') {
            filteredDisasters = disasterData.filter(disaster => disaster.type === activeFilter);
        }
        
        // Apply search filter
        if (searchTerm) {
            filteredDisasters = filteredDisasters.filter(disaster => 
                disaster.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Render filtered disasters
        renderDisasterTable(filteredDisasters);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
} 







const apiUrl = 'https://api.reliefweb.int/v1/disasters?appname=disaster-alert&profile=full&filter[field]=country&filter[value]=India';

async function fetchDisasters() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const container = document.getElementById('disaster-alerts');
    container.innerHTML = '';

    data.data.forEach(item => {
      const name = item.fields.name || "Unnamed Event";
      const date = new Date(item.fields.date.created).toLocaleDateString();
      const type = item.fields.type?.[0]?.name || "Unknown";
      const card = `
        <div class="alert-card">
          <h3>${name}</h3>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (err) {
    console.error("Failed to fetch data:", err);
    document.getElementById('disaster-alerts').innerHTML = `<p>Error fetching disaster alerts.</p>`;
  }
}

// Fetch data when page loads
window.addEventListener('DOMContentLoaded', fetchDisasters);