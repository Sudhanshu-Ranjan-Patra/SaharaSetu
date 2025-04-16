// News Page Configuration
const config = {
    apiKey: 'YOUR_NEWS_API_KEY', // Replace with your actual API key
    baseUrl: 'https://newsapi.org/v2',
    pageSize: 9,
    updateInterval: 300000, // 5 minutes
    maxRetries: 3,
    retryDelay: 1000,
    animationDuration: 300,
    perspective: 1000,
    rotateX: 5,
    rotateY: 5
};

// DOM Elements
const elements = {
    newsContainer: document.querySelector('.news-grid'),
    searchInput: document.querySelector('.search-input'),
    searchButton: document.querySelector('.search-button'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    pagination: document.querySelector('.pagination'),
    loadingState: document.querySelector('.news-loading'),
    errorState: document.querySelector('.news-error'),
    themeToggle: document.querySelector('.theme-toggle'),
    header: document.querySelector('.news-header'),
    filters: document.querySelector('.news-filters')
};

// State Management
const state = {
    currentPage: 1,
    currentFilter: 'all',
    searchQuery: '',
    articles: [],
    totalResults: 0,
    isLoading: false,
    error: null,
    theme: localStorage.getItem('theme') || 'light',
    is3DEnabled: true,
    isAnimating: false
};

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    elements.themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// 3D Effects
function initialize3DEffects() {
    if (!state.is3DEnabled) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x4a6bff,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.001;
        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Loading Animation
function showLoadingState() {
    state.isLoading = true;
    elements.loadingState.style.display = 'block';
    elements.newsContainer.style.opacity = '0.5';
    
    // Add loading animation
    const loadingIcon = elements.loadingState.querySelector('i');
    loadingIcon.style.animation = 'spin 1s linear infinite';
}

function hideLoadingState() {
    state.isLoading = false;
    elements.loadingState.style.display = 'none';
    elements.newsContainer.style.opacity = '1';
    
    // Remove loading animation
    const loadingIcon = elements.loadingState.querySelector('i');
    loadingIcon.style.animation = '';
}

// Error Handling
function showErrorState(message) {
    state.error = message;
    elements.errorState.style.display = 'block';
    elements.errorState.querySelector('p').textContent = message;
    
    // Add error animation
    elements.errorState.style.animation = 'shake 0.5s ease-in-out';
}

function hideErrorState() {
    state.error = null;
    elements.errorState.style.display = 'none';
    elements.errorState.style.animation = '';
}

// News Fetching
async function fetchNews() {
    try {
        showLoadingState();
        hideErrorState();

        const response = await fetch(`${config.baseUrl}/everything?q=${state.searchQuery}&page=${state.currentPage}&pageSize=${config.pageSize}&apiKey=${config.apiKey}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message);
        }

        state.articles = data.articles;
        state.totalResults = data.totalResults;

        renderNews();
        updatePagination();
    } catch (error) {
        showErrorState(error.message);
    } finally {
        hideLoadingState();
    }
}

// News Rendering
function renderNews() {
    if (!elements.newsContainer) return;

    elements.newsContainer.innerHTML = '';
    
    state.articles.forEach((article, index) => {
        const card = createNewsCard(article, index);
        elements.newsContainer.appendChild(card);
        
        // Add entrance animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createNewsCard(article, index) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';
    
    card.innerHTML = `
        <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" class="news-card-image">
        <div class="news-card-content">
            <h3 class="news-card-title">${article.title}</h3>
            <p class="news-card-description">${article.description || ''}</p>
            <div class="news-card-meta">
                <span class="news-card-date">
                    <i class="far fa-calendar"></i>
                    ${new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <span class="news-card-source">
                    <i class="far fa-newspaper"></i>
                    ${article.source.name}
                </span>
            </div>
        </div>
    `;

    // Add hover effects
    card.addEventListener('mouseenter', () => {
        if (state.isAnimating) return;
        state.isAnimating = true;
        
        card.style.transform = 'translateZ(30px) scale(1.02)';
        card.style.boxShadow = 'var(--card-hover-shadow)';
        
        const image = card.querySelector('.news-card-image');
        image.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            state.isAnimating = false;
        }, config.animationDuration);
    });

    card.addEventListener('mouseleave', () => {
        if (state.isAnimating) return;
        state.isAnimating = true;
        
        card.style.transform = 'translateZ(0) scale(1)';
        card.style.boxShadow = 'var(--card-shadow)';
        
        const image = card.querySelector('.news-card-image');
        image.style.transform = 'scale(1)';
        
        setTimeout(() => {
            state.isAnimating = false;
        }, config.animationDuration);
    });

    return card;
}

// Pagination
function updatePagination() {
    if (!elements.pagination) return;

    const totalPages = Math.ceil(state.totalResults / config.pageSize);
    elements.pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `pagination-btn ${i === state.currentPage ? 'active' : ''}`;
        button.textContent = i;
        
        button.addEventListener('click', () => {
            if (i === state.currentPage) return;
            state.currentPage = i;
            fetchNews();
        });

        elements.pagination.appendChild(button);
    }
}

// Event Listeners
function initializeEventListeners() {
    // Search
    elements.searchButton?.addEventListener('click', () => {
        state.searchQuery = elements.searchInput.value.trim();
        state.currentPage = 1;
        fetchNews();
    });

    elements.searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            state.searchQuery = elements.searchInput.value.trim();
            state.currentPage = 1;
            fetchNews();
        }
    });

    // Filters
    elements.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (filter === state.currentFilter) return;

            state.currentFilter = filter;
            state.currentPage = 1;

            // Update active state
            elements.filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            fetchNews();
        });
    });

    // Scroll Animation
    window.addEventListener('scroll', () => {
        if (state.isAnimating) return;
        
        const scrollPosition = window.scrollY;
        const header = elements.header;
        const filters = elements.filters;

        if (scrollPosition > 100) {
            header.style.transform = 'translateY(-20px)';
            header.style.opacity = '0.8';
            filters.style.position = 'fixed';
            filters.style.top = '80px';
            filters.style.zIndex = '1000';
        } else {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
            filters.style.position = 'relative';
            filters.style.top = '0';
        }
    });
}

// Initialization
function initialize() {
    initializeTheme();
    initialize3DEffects();
    initializeEventListeners();
    fetchNews();

    // Auto-refresh news
    setInterval(fetchNews, config.updateInterval);
}

// Start the application
document.addEventListener('DOMContentLoaded', initialize); 