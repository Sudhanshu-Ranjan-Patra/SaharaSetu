// Three.js imports
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

// Scene setup
let scene, camera, renderer, controls;
let globe, atmosphere;
let isRotating = true;
let disasterMarkers = [];

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('globe-container').appendChild(renderer.domElement);

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 3;
    controls.maxDistance = 10;

    // Create globe
    createGlobe();
    createAtmosphere();
    addLights();

    // Add initial disaster markers
    addDisasterMarkers();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

// Create the Earth globe
function createGlobe() {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    const material = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.05,
        specularMap: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color('grey'),
        shininess: 5
    });

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
}

// Create atmosphere effect
function createAtmosphere() {
    const geometry = new THREE.SphereGeometry(2.1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });

    atmosphere = new THREE.Mesh(geometry, material);
    scene.add(atmosphere);
}

// Add lights to the scene
function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
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

// Toggle globe rotation
function toggleRotation() {
    isRotating = !isRotating;
    const button = document.querySelector('.map-control[data-action="rotate"]');
    button.classList.toggle('active');
}

// Reset camera position
function resetCamera() {
    camera.position.set(0, 0, 5);
    controls.reset();
}

// Add disaster markers
function addDisasterMarkers() {
    const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Example disaster locations
    const disasters = [
        { lat: 35.6762, lng: 139.6503, severity: 'high', type: 'earthquake' },    // Tokyo
        { lat: 37.7749, lng: -122.4194, severity: 'moderate', type: 'flood' },   // San Francisco
        { lat: -33.8688, lng: 151.2093, severity: 'low', type: 'wildfire' }      // Sydney
    ];

    disasters.forEach(disaster => {
        const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
        marker.material.color.setHex(getSeverityColor(disaster.severity));
        
        // Convert lat/lng to 3D position
        const phi = (90 - disaster.lat) * (Math.PI / 180);
        const theta = (disaster.lng + 180) * (Math.PI / 180);
        
        marker.position.x = -(Math.sin(phi) * Math.cos(theta)) * 2;
        marker.position.y = Math.cos(phi) * 2;
        marker.position.z = (Math.sin(phi) * Math.sin(theta)) * 2;

        globe.add(marker);
        disasterMarkers.push(marker);

        // Add pulsing animation for high severity markers
        if (disaster.severity === 'high') {
            animateMarker(marker);
        }
    });
}

// Get color based on severity
function getSeverityColor(severity) {
    switch (severity) {
        case 'high': return 0xff0000;
        case 'moderate': return 0xffa500;
        case 'low': return 0x00ff00;
        default: return 0xffffff;
    }
}

// Animate marker with pulse effect
function animateMarker(marker) {
    const scale = { value: 1 };
    gsap.to(scale, {
        value: 1.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        onUpdate: () => {
            marker.scale.set(scale.value, scale.value, scale.value);
        }
    });
}

// Simulate real-time disaster data
function simulateDisasterData() {
    setInterval(() => {
        // Remove old markers
        disasterMarkers.forEach(marker => {
            globe.remove(marker);
        });
        disasterMarkers = [];

        // Add new markers
        addDisasterMarkers();
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    simulateDisasterData();

    // Add event listeners for controls
    document.querySelector('.map-control[data-action="rotate"]').addEventListener('click', toggleRotation);
    document.querySelector('.map-control[data-action="reset"]').addEventListener('click', resetCamera);
}); 