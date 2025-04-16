import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class Globe {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = null;
        this.globe = null;
        this.markers = [];
        this.isRotating = true;
        this.disasters = [
            { lat: 35.6762, lng: 139.6503, type: 'earthquake', severity: 'high' },
            { lat: 37.7749, lng: -122.4194, type: 'flood', severity: 'moderate' },
            { lat: -33.8688, lng: 151.2093, type: 'wildfire', severity: 'low' }
        ];

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;

        // Create globe
        this.createGlobe();
        
        // Add disaster markers
        this.addDisasterMarkers();

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
    }

    createGlobe() {
        // Create Earth geometry
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        
        // Load Earth texture
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
        const bumpTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
        const specularTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
        
        // Create material
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.05,
            specularMap: specularTexture,
            specular: new THREE.Color('grey'),
            shininess: 5
        });

        // Create mesh
        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);

        // Add cloud layer
        const cloudGeometry = new THREE.SphereGeometry(2.01, 64, 64);
        const cloudTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: 0.4
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.scene.add(clouds);
    }

    addDisasterMarkers() {
        const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        
        this.disasters.forEach(disaster => {
            const color = this.getSeverityColor(disaster.severity);
            const material = new THREE.MeshBasicMaterial({ color });
            const marker = new THREE.Mesh(markerGeometry, material);
            
            // Convert lat/lng to 3D coordinates
            const position = this.latLngToVector3(disaster.lat, disaster.lng);
            marker.position.copy(position);
            
            this.globe.add(marker);
            this.markers.push(marker);

            // Add pulse animation
            this.animateMarker(marker, disaster.severity);
        });
    }

    latLngToVector3(lat, lng) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const radius = 2;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
    }

    getSeverityColor(severity) {
        const colors = {
            high: 0xff0000,
            moderate: 0xffa500,
            low: 0x00ff00
        };
        return colors[severity] || colors.low;
    }

    animateMarker(marker, severity) {
        const scale = severity === 'high' ? 1.5 : 1;
        const duration = severity === 'high' ? 1 : 2;
        
        gsap.to(marker.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: duration,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Handle map controls
        const rotateBtn = document.querySelector('[data-action="rotate"]');
        const resetBtn = document.querySelector('[data-action="reset"]');

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.isRotating = !this.isRotating;
                rotateBtn.classList.toggle('active');
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.camera.position.set(0, 0, 5);
                this.controls.reset();
            });
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isRotating) {
            this.globe.rotation.y += 0.001;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize globe when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const globe = new Globe('globe-container');
}); 