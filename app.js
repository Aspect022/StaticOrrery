// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Orbit Controls for better navigation
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;  // Enable zooming in and out
controls.enablePan = true;   // Enable panning left/right and up/down
controls.enableRotate = true; // Enable rotating the camera around the scene
controls.enableDamping = true;  // Add damping (inertia)
controls.dampingFactor = 0.25;  // Damping factor
controls.minDistance = 50;      // Reduce minimum zoom distance for closer zoom
controls.maxDistance = 3000;    // Increase max zoom distance to see all planets

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040);  // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 1000); // Point light for the Sun
scene.add(pointLight);

// Function to update the intensity of the light based on distance from the Sun
function updateLighting() {
    planets.forEach((planet) => {
        const distance = planet.position.length();  // Get distance from the origin (Sun)
        const intensity = Math.max(1 / distance, 0.1);  // Calculate intensity (limit to a minimum of 0.1)
        pointLight.intensity = intensity;
    });
}

// Create the Sun (increase size for better visibility)
const sunGeometry = new THREE.SphereGeometry(50, 32, 32);  // Larger Sun for better visibility
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Orbital data for planets (adjusted semi-major axis for better spacing)
const planetsData = [
    { name: "Mercury", texture: "textures/mercury.jpg", semi_major_axis: 150, eccentricity: 0.2056, period: 7600544, inclination: 7.0, size: 1 },
    { name: "Venus", texture: "textures/venus.jpg", semi_major_axis: 250, eccentricity: 0.0067, period: 19414149, inclination: 3.4, size: 1.5 },
    { name: "Earth", texture: "textures/earth.jpg", semi_major_axis: 350, eccentricity: 0.0167, period: 31557600, inclination: 0.0, size: 1.6 },
    { name: "Mars", texture: "textures/mars.jpg", semi_major_axis: 450, eccentricity: 0.0934, period: 59355072, inclination: 1.85, size: 1.2 },
    { name: "Jupiter", texture: "textures/jupiter.jpg", semi_major_axis: 650, eccentricity: 0.0489, period: 374335776, inclination: 1.31, size: 4 },
    { name: "Saturn", texture: "textures/saturn.jpg", semi_major_axis: 850, eccentricity: 0.0565, period: 929596608, inclination: 2.49, size: 3 },
    { name: "Uranus", texture: "textures/uranus.jpg", semi_major_axis: 1050, eccentricity: 0.0457, period: 2651370019, inclination: 0.77, size: 2.5 },
    { name: "Neptune", texture: "textures/neptune.jpg", semi_major_axis: 1250, eccentricity: 0.0086, period: 5200418560, inclination: 1.77, size: 2.5 }
];

// Function to create planet meshes with textures
function createPlanet(radius, textureUrl) {
    const geometry = new THREE.SphereGeometry(radius * 2, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textureUrl);  // Load the texture
    const material = new THREE.MeshStandardMaterial({ map: texture });  // Use MeshStandardMaterial for better lighting effects
    return new THREE.Mesh(geometry, material);
}

// Function to create rings for gas giants
function createSaturnRings(radius, innerRadius, textureUrl) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, radius, 32);
    const textureLoader = new THREE.TextureLoader();
    const ringTexture = textureLoader.load(textureUrl);  // Load texture for Saturn's rings
    const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;  // Rotate to lay flat
    return ring;
}

// Function to create simple white rings for other gas giants
function createCloudyRings(radius, innerRadius) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, radius, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;  // Rotate to lay flat
    return ring;
}


// Function to calculate the position based on orbital data
function calculate_position(a, e, t, T, inclination) {
    const M = 2 * Math.PI * t / T;
    let E = M + e * Math.sin(M); // Initial guess for E
    let deltaE = 1;
    const tolerance = 1e-6;
    let iteration = 0;

    // Newton's Method for refining E
    while (Math.abs(deltaE) > tolerance && iteration < 10) {
        deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= deltaE;
        iteration++;
    }

    const r = a * (1 - e * Math.cos(E));
    const theta = Math.atan2(Math.sqrt(1 - e * e) * Math.sin(E), Math.cos(E) - e);

    // Convert polar to Cartesian coordinates
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);

    // Apply inclination
    const i = THREE.Math.degToRad(inclination);  // Convert inclination to radians
    const y = z * Math.sin(i);  // Height above/below the ecliptic plane
    const z_rotated = z * Math.cos(i);  // New z value after inclination

    return [x, y, z_rotated];  // Return Cartesian coordinates
}

// Create planets and add them to the scene
const planets = planetsData.map((planetData) => {
    const planet = createPlanet(planetData.size * 5, planetData.texture);  // Use the texture URL
    scene.add(planet);
    planet.orbitalData = planetData;  // Attach orbital data to each planet
    return planet;
});

// Create rings for Saturn (with texture)
const saturnRing = createSaturnRings(40, 85, 'textures/saturn_ring.png');  // Increased ring size
planets[5].add(saturnRing);  // Attach the ring to Saturn

// Create rings for Jupiter, Uranus, and Neptune (white cloudy appearance)
const jupiterRing = createCloudyRings(50, 45); // White cloudy rings for Jupiter
planets[4].add(jupiterRing); // Attach to Jupiter

const uranusRing = createCloudyRings(40, 35);  // White cloudy rings for Uranus
uranusRing.rotation.z = Math.PI / 2;  // Tilt Uranus' rings by 90 degrees to appear vertical
planets[6].add(uranusRing);  // Attach to Uranus

const neptuneRing = createCloudyRings(30, 25);  // White cloudy rings for Neptune
planets[7].add(neptuneRing);  // Attach to Neptune


function createMoonWithTexture(radius, textureUrl) {
    const moonGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(textureUrl);  // Load the texture for the Moon
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    return new THREE.Mesh(moonGeometry, moonMaterial);
}

// Example for Earth’s Moon with texture
const moonTextureUrl = "textures/moon.jpg"; // Replace this with the path to your Moon texture
const earthMoon = createMoonWithTexture(0.5, moonTextureUrl); // Moon with texture
earthMoon.position.set(8, 0, 0); // Position it 8 units from Earth
planets[2].add(earthMoon); // Attach to Earth

// Create a background for the scene
const starsGeometry = new THREE.SphereGeometry(1000, 32, 32);
const starsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.1, transparent: true });
const stars = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(stars);

// Position the camera to see the planets better
camera.position.z = 300;  // Set camera closer to the scene

// Sun particles for solar flares
function createSunParticles() {
    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 200; // Random position within a range
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({ color: 0xffcc00, size: 0.5 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    
    sun.add(particles); // Attach particles to the Sun
}

// Call to create Sun particles
createSunParticles();

// Orbit animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = (Date.now() % 60000) / 60000;  // Normalized time for orbit

    // Update each planet's position
    planets.forEach((planet) => {
        const { semi_major_axis, eccentricity, period, inclination } = planet.orbitalData;
        const [x, y, z] = calculate_position(semi_major_axis, eccentricity, time * period, period, inclination);
        planet.position.set(x, y, z);  // Update planet position
    });

    // Update moon positions (example for Earth Moon)
    earthMoon.position.x = planets[2].position.x + 8; // Position moon relative to Earth
    earthMoon.position.y = planets[2].position.y;  // Keep the same height as Earth
    earthMoon.position.z = planets[2].position.z;  // Keep the same depth as Earth

    // Update lighting based on distance from the Sun
    updateLighting();

    // Update Orbit Controls
    controls.update();  // Update controls
    renderer.render(scene, camera);  // Render the scene
}

// Start animation loop
animate();

// Window resize event
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
