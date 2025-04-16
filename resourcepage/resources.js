// DOM Elements
const resourcesGrid = document.getElementById('resourcesGrid');
const resourcesMap = document.getElementById('resourcesMap');
const mapCanvas = document.getElementById('mapCanvas');
const searchInput = document.getElementById('searchInput');
const availabilityFilter = document.getElementById('availabilityFilter');
const shelterTypeFilter = document.getElementById('shelterTypeFilter');
const filterButtons = document.querySelectorAll('.filter-btn');
const viewButtons = document.querySelectorAll('.view-btn');
const loadingIndicator = document.getElementById('loadingIndicator');
const toastContainer = document.getElementById('toastContainer');
const rescueForm = document.getElementById('rescueForm');
const locationAlert = document.getElementById('locationAlert');
const themeToggle = document.querySelector('.theme-toggle');
const notificationToggle = document.querySelector('.notification-toggle');

// Stats Elements
const activeSheltersElement = document.getElementById('activeShelters');
const activeHospitalsElement = document.getElementById('activeHospitals');
const activeFoodBanksElement = document.getElementById('activeFoodBanks');
const activeWaterStationsElement = document.getElementById('activeWaterStations');

// Global Variables
let resourcesData = [];
let filteredResources = [];
let currentView = 'grid';
let currentFilter = 'all';
let currentAvailability = 'all';
let currentShelterType = 'all';
let searchQuery = '';
let mapInitialized = false;
let mapMarkers = [];

// Resource Icons
const resourceIcons = {
    shelter: 'fa-home',
    hospital: 'fa-hospital',
    food: 'fa-utensils',
    water: 'fa-tint',
    evacuation: 'fa-route'
};

// Resource Colors
const resourceColors = {
    shelter: '#4f46e5',
    hospital: '#ef4444',
    food: '#f59e0b',
    water: '#3b82f6',
    evacuation: '#10b981'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show loading indicator
    loadingIndicator.classList.remove('hidden');
    
    // Fetch resources data
    fetchResourcesData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check user location
    checkUserLocation();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup auto-refresh
    setupAutoRefresh();
});

// Fetch resources data from JSON file
async function fetchResourcesData() {
    try {
        // In a real application, this would be an API call
        // For this demo, we'll use a simulated delay to mimic an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulated data - in a real app, this would come from an API
        resourcesData = [
            {
                id: 1,
                name: "Community Emergency Shelter",
                type: "shelter",
                shelterType: "government",
                address: "123 Main St, Anytown, India",
                contact: "+91 98765 43210",
                availability: "open",
                latitude: 28.6139,
                longitude: 77.2090,
                description: "Government-operated emergency shelter with capacity for 200 people. Equipped with basic amenities and medical supplies."
            },
            {
                id: 2,
                name: "City General Hospital",
                type: "hospital",
                address: "456 Health Ave, Anytown, India",
                contact: "+91 98765 43211",
                availability: "open",
                latitude: 28.6140,
                longitude: 77.2095,
                description: "24/7 emergency hospital with trauma center and emergency response team."
            },
            {
                id: 3,
                name: "Red Cross Food Bank",
                type: "food",
                address: "789 Food St, Anytown, India",
                contact: "+91 98765 43212",
                availability: "limited",
                latitude: 28.6145,
                longitude: 77.2100,
                description: "Food distribution center providing emergency food supplies to affected communities."
            },
            {
                id: 4,
                name: "Municipal Water Station",
                type: "water",
                address: "321 Water Rd, Anytown, India",
                contact: "+91 98765 43213",
                availability: "open",
                latitude: 28.6150,
                longitude: 77.2105,
                description: "Clean water distribution point with purification systems."
            },
            {
                id: 5,
                name: "North Evacuation Route",
                type: "evacuation",
                address: "North Highway, Anytown, India",
                contact: "Emergency Services",
                availability: "open",
                latitude: 28.6155,
                longitude: 77.2110,
                description: "Designated evacuation route heading north to safe zones."
            },
            {
                id: 6,
                name: "Local Community Shelter",
                type: "shelter",
                shelterType: "local",
                address: "555 Community Center, Anytown, India",
                contact: "+91 98765 43214",
                availability: "open",
                latitude: 28.6160,
                longitude: 77.2115,
                description: "Community-operated shelter with space for 50 people. Basic amenities available."
            },
            {
                id: 7,
                name: "St. Mary's Hospital",
                type: "hospital",
                address: "777 Medical Blvd, Anytown, India",
                contact: "+91 98765 43215",
                availability: "full",
                latitude: 28.6165,
                longitude: 77.2120,
                description: "Private hospital with emergency services. Currently at capacity."
            },
            {
                id: 8,
                name: "Community Food Pantry",
                type: "food",
                address: "888 Nutrition St, Anytown, India",
                contact: "+91 98765 43216",
                availability: "open",
                latitude: 28.6170,
                longitude: 77.2125,
                description: "Local food pantry providing emergency food supplies to affected families."
            },
            {
                id: 9,
                name: "Emergency Water Tanker",
                type: "water",
                address: "999 Mobile Unit, Anytown, India",
                contact: "+91 98765 43217",
                availability: "limited",
                latitude: 28.6175,
                longitude: 77.2130,
                description: "Mobile water tanker providing clean water to affected areas."
            },
            {
                id: 10,
                name: "South Evacuation Route",
                type: "evacuation",
                address: "South Highway, Anytown, India",
                contact: "Emergency Services",
                availability: "open",
                latitude: 28.6180,
                longitude: 77.2135,
                description: "Designated evacuation route heading south to safe zones."
            }
        ];
        
        // Update stats
        updateStats();
        
        // Apply filters and render
        filterResources();
        
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
        
        // Show success toast
        showToast('success', 'Resources loaded successfully', 'Resource data has been updated.');
        
    } catch (error) {
        console.error('Error fetching resources data:', error);
        
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
        
        // Show error toast
        showToast('error', 'Error loading resources', 'Failed to load resource data. Please try again later.');
    }
}

// Update dashboard stats
function updateStats() {
    // Count resources by type
    const shelters = resourcesData.filter(resource => resource.type === 'shelter');
    const hospitals = resourcesData.filter(resource => resource.type === 'hospital');
    const foodBanks = resourcesData.filter(resource => resource.type === 'food');
    const waterStations = resourcesData.filter(resource => resource.type === 'water');
    
    // Update stats elements
    activeSheltersElement.textContent = shelters.length;
    activeHospitalsElement.textContent = hospitals.length;
    activeFoodBanksElement.textContent = foodBanks.length;
    activeWaterStationsElement.textContent = waterStations.length;
}

// Filter resources based on current filters
function filterResources() {
    // Apply filters
    filteredResources = resourcesData.filter(resource => {
        // Filter by type
        const typeMatch = currentFilter === 'all' || resource.type === currentFilter;
        
        // Filter by availability
        const availabilityMatch = currentAvailability === 'all' || resource.availability === currentAvailability;
        
        // Filter by shelter type (only applies to shelters)
        const shelterTypeMatch = resource.type !== 'shelter' || currentShelterType === 'all' || resource.shelterType === currentShelterType;
        
        // Filter by search query
        const searchMatch = searchQuery === '' || 
            resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.address.toLowerCase().includes(searchQuery.toLowerCase());
        
        return typeMatch && availabilityMatch && shelterTypeMatch && searchMatch;
    });
    
    // Render resources based on current view
    if (currentView === 'grid') {
        renderResourcesGrid();
    } else {
        renderResourcesMap();
    }
}

// Render resources in grid view
function renderResourcesGrid() {
    // Clear grid
    resourcesGrid.innerHTML = '';
    
    // Hide map
    resourcesMap.classList.remove('active');
    
    // Show grid
    resourcesGrid.style.display = 'grid';
    
    // If no resources found
    if (filteredResources.length === 0) {
        resourcesGrid.innerHTML = `
            <div class="no-resources">
                <i class="fas fa-search"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }
    
    // Add resources to grid
    filteredResources.forEach((resource, index) => {
        // Create resource card
        const card = document.createElement('div');
        card.className = `resource-card ${resource.type} ${resource.availability}`;
        
        // Add shelter type class if it's a shelter
        if (resource.type === 'shelter') {
            card.classList.add(resource.shelterType);
        }
        
        // Set animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Create card content
        card.innerHTML = `
            <div class="resource-header">
                <i class="fas ${resourceIcons[resource.type]}"></i>
                <h3>${resource.name}</h3>
                ${resource.type === 'shelter' ? `<span class="resource-type ${resource.shelterType}">${resource.shelterType === 'government' ? 'Government' : 'Local'}</span>` : ''}
            </div>
            <div class="resource-info">
                <p>${resource.description}</p>
                <div class="resource-address">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${resource.address}</span>
                </div>
                <div class="resource-availability ${resource.availability}">
                    <i class="fas ${resource.availability === 'open' ? 'fa-check-circle' : resource.availability === 'limited' ? 'fa-exclamation-circle' : 'fa-times-circle'}"></i>
                    <span>${resource.availability.charAt(0).toUpperCase() + resource.availability.slice(1)}</span>
                </div>
            </div>
            <div class="resource-actions">
                <button class="view-details" data-id="${resource.id}">View Details</button>
                <button class="get-directions" data-id="${resource.id}">Get Directions</button>
            </div>
        `;
        
        // Add card to grid
        resourcesGrid.appendChild(card);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const resourceId = parseInt(button.getAttribute('data-id'));
            const resource = resourcesData.find(r => r.id === resourceId);
            showResourceDetails(resource);
        });
    });
    
    document.querySelectorAll('.get-directions').forEach(button => {
        button.addEventListener('click', () => {
            const resourceId = parseInt(button.getAttribute('data-id'));
            const resource = resourcesData.find(r => r.id === resourceId);
            getDirections(resource);
        });
    });
}

// Render resources in map view
function renderResourcesMap() {
    // Clear map markers
    mapMarkers = [];
    
    // Hide grid
    resourcesGrid.style.display = 'none';
    
    // Show map
    resourcesMap.classList.add('active');
    
    // Initialize map if not already initialized
    if (!mapInitialized) {
        initializeMap();
        mapInitialized = true;
    }
    
    // Add markers to map
    filteredResources.forEach(resource => {
        addMarkerToMap(resource);
    });
    
    // If no resources found
    if (filteredResources.length === 0) {
        mapCanvas.innerHTML = `
            <div class="no-resources">
                <i class="fas fa-search"></i>
                <h3>No resources found</h3>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `;
    }
}

// Initialize map (simplified version)
function initializeMap() {
    // In a real application, this would initialize a map library like Leaflet or Google Maps
    // For this demo, we'll create a simple canvas-based visualization
    
    const ctx = mapCanvas.getContext('2d');
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw title
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Resource Map (Simulated)', width / 2, 30);
    
    // Draw legend
    const legendX = width - 150;
    const legendY = 50;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(legendX, legendY, 140, 150);
    ctx.strokeStyle = '#e5e7eb';
    ctx.strokeRect(legendX, legendY, 140, 150);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Legend', legendX + 10, legendY + 20);
    
    // Draw legend items
    const legendItems = [
        { type: 'shelter', label: 'Shelter', color: '#4f46e5' },
        { type: 'hospital', label: 'Hospital', color: '#ef4444' },
        { type: 'food', label: 'Food Bank', color: '#f59e0b' },
        { type: 'water', label: 'Water Station', color: '#3b82f6' },
        { type: 'evacuation', label: 'Evacuation Route', color: '#10b981' }
    ];
    
    legendItems.forEach((item, index) => {
        const y = legendY + 40 + (index * 20);
        
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(legendX + 15, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#1f2937';
        ctx.fillText(item.label, legendX + 30, y + 5);
    });
}

// Add marker to map
function addMarkerToMap(resource) {
    // In a real application, this would add a marker to the map
    // For this demo, we'll draw a circle on the canvas
    
    const ctx = mapCanvas.getContext('2d');
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    
    // Calculate position (simplified)
    // In a real app, this would convert lat/lng to pixel coordinates
    const x = (resource.longitude - 77.2090) * 1000 + width / 2;
    const y = (resource.latitude - 28.6139) * 1000 + height / 2;
    
    // Draw marker
    ctx.fillStyle = resourceColors[resource.type];
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw availability indicator
    ctx.fillStyle = resource.availability === 'open' ? '#10b981' : 
                    resource.availability === 'limited' ? '#f59e0b' : '#ef4444';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Store marker for interaction
    mapMarkers.push({
        resource,
        x,
        y,
        radius: 8
    });
    
    // Add click event to canvas
    mapCanvas.addEventListener('click', handleMapClick);
}

// Handle map click
function handleMapClick(event) {
    const rect = mapCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is on a marker
    for (const marker of mapMarkers) {
        const distance = Math.sqrt(Math.pow(x - marker.x, 2) + Math.pow(y - marker.y, 2));
        
        if (distance <= marker.radius) {
            showResourceDetails(marker.resource);
            break;
        }
    }
}

// Show resource details
function showResourceDetails(resource) {
    // In a real application, this would show a modal or navigate to a details page
    // For this demo, we'll show a toast notification
    
    showToast('success', resource.name, `
        <p><strong>Type:</strong> ${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</p>
        <p><strong>Address:</strong> ${resource.address}</p>
        <p><strong>Contact:</strong> ${resource.contact}</p>
        <p><strong>Availability:</strong> ${resource.availability.charAt(0).toUpperCase() + resource.availability.slice(1)}</p>
        ${resource.type === 'shelter' ? `<p><strong>Shelter Type:</strong> ${resource.shelterType.charAt(0).toUpperCase() + resource.shelterType.slice(1)}</p>` : ''}
        <p><strong>Description:</strong> ${resource.description}</p>
    `);
}

// Get directions to resource
function getDirections(resource) {
    // In a real application, this would open a maps application or provide directions
    // For this demo, we'll show a toast notification
    
    showToast('info', 'Directions', `Directions to ${resource.name} would be provided here.`);
}

// Check user location
function checkUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // User location obtained
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Check if there are resources near the user
                const nearbyResources = resourcesData.filter(resource => {
                    // Simple distance calculation (not accurate for real-world use)
                    const distance = Math.sqrt(
                        Math.pow(resource.latitude - userLat, 2) + 
                        Math.pow(resource.longitude - userLng, 2)
                    );
                    
                    return distance < 0.01; // Within approximately 1km
                });
                
                // Show location alert if there are nearby resources
                if (nearbyResources.length > 0) {
                    locationAlert.style.display = 'block';
                } else {
                    locationAlert.style.display = 'none';
                }
            },
            error => {
                // Error getting location
                console.error('Error getting location:', error);
                locationAlert.style.display = 'none';
            }
        );
    } else {
        // Geolocation not supported
        console.log('Geolocation not supported');
        locationAlert.style.display = 'none';
    }
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
            
            // Update current filter
            currentFilter = button.getAttribute('data-filter');
            
            // Apply filters
            filterResources();
        });
    });
    
    // View toggle buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update current view
            currentView = button.getAttribute('data-view');
            
            // Apply filters
            filterResources();
        });
    });
    
    // Search input
    searchInput.addEventListener('input', () => {
        // Update search query
        searchQuery = searchInput.value;
        
        // Apply filters
        filterResources();
    });
    
    // Availability filter
    availabilityFilter.addEventListener('change', () => {
        // Update current availability
        currentAvailability = availabilityFilter.value;
        
        // Apply filters
        filterResources();
    });
    
    // Shelter type filter
    shelterTypeFilter.addEventListener('change', () => {
        // Update current shelter type
        currentShelterType = shelterTypeFilter.value;
        
        // Apply filters
        filterResources();
    });
    
    // Rescue form
    rescueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value;
        const contact = document.getElementById('contact').value;
        const message = document.getElementById('message').value;
        
        // In a real application, this would submit the form to a server
        // For this demo, we'll show a success toast
        
        showToast('success', 'Rescue Request Submitted', 'Your rescue request has been submitted. Emergency services will contact you shortly.');
        
        // Reset form
        rescueForm.reset();
    });
    
    // Alert action button
    document.querySelector('.alert-action').addEventListener('click', () => {
        showToast('success', 'SMS Alerts Enabled', 'You will now receive SMS alerts for resources in your area.');
    });
}

// Setup theme toggle
function setupThemeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update icon
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Add click event
    themeToggle.addEventListener('click', () => {
        // Toggle theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save preference
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        if (newTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Setup auto-refresh
function setupAutoRefresh() {
    // Refresh data every 60 seconds
    setInterval(() => {
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        
        // Fetch resources data
        fetchResourcesData();
    }, 60000);
}

// Show toast notification
function showToast(type, title, message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    let icon = '';
    if (type === 'success') {
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        icon = 'fa-exclamation-circle';
    } else if (type === 'warning') {
        icon = 'fa-exclamation-triangle';
    } else if (type === 'info') {
        icon = 'fa-info-circle';
    }
    
    // Set toast content
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Add close event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
} 