// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Orbit Controls for better navigation
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true;
controls.enableRotate = true;
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.minDistance = 50;
controls.maxDistance = 3000;

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
scene.add(pointLight);

// Function to update the intensity of the light based on distance from the Sun
function updateLighting() {
    planets.forEach((planet) => {
        const distance = planet.position.length();
        const intensity = Math.max(1 / (distance * distance), 0.1);
        pointLight.intensity = intensity;
    });
}

// Load textures
const textureLoader = new THREE.TextureLoader();
const starryTexture = textureLoader.load('textures/stars_milky_way.jpg');
scene.background = starryTexture;

const sunTexture = textureLoader.load('textures/sun.jpg');

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(50, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture, emissive: 0xffff00, emissiveIntensity: 0.5 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create glow effect for the Sun
const sunGlowGeometry = new THREE.SphereGeometry(55, 32, 32);
const sunGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        "c": { type: "f", value: 0.4 },
        "p": { type: "f", value: 3.0 },
        glowColor: { type: "c", value: new THREE.Color(0xffff33) },
        viewVector: { type: "v3", value: camera.position }
    },
    vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(viewVector - (modelViewMatrix * vec4(position, 1.0)).xyz);
            intensity = pow(0.6 - dot(vNormal, vNormel), 6.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
        }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
scene.add(sunGlow);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(directionalLight);

const planetsData = [
    { name: "Mercury", texture: "textures/mercury.jpg", semi_major_axis: 150, eccentricity: 0.2056, period: 7600544, inclination: 7.0, size: 1, color: 0xffa500, rotationSpeed: 0.00001, orbitalSpeed: 4.74, info: "Smallest planet, closest to the Sun", nasaLink: "https://science.nasa.gov/mercury/facts/" },
    { name: "Venus", texture: "textures/venus.jpg", semi_major_axis: 250, eccentricity: 0.0067, period: 19414149, inclination: 3.4, size: 1.5, color: 0xffd700, rotationSpeed: -0.00000005, orbitalSpeed: 3.5, info: "Hottest planet, rotates backwards", nasaLink: "https://science.nasa.gov/venus/venus-facts/" },
    { name: "Earth", texture: "textures/earth.jpg", semi_major_axis: 350, eccentricity: 0.0167, period: 31557600, inclination: 0.0, size: 1.6, color: 0x00ff00, rotationSpeed: 0.01, orbitalSpeed: 2.98, info: "Our home, the blue planet",nasaLink: "https://science.nasa.gov/earth/facts/" },
    { name: "Mars", texture: "textures/mars.jpg", semi_major_axis: 450, eccentricity: 0.0934, period: 59355072, inclination: 1.85, size: 1.2, color: 0xff4500, rotationSpeed: 0.01, orbitalSpeed: 2.41, info: "The Red Planet, home to Olympus Mons",nasaLink: "https://science.nasa.gov/mars/facts/" },
    { name: "Jupiter", texture: "textures/jupiter.jpg", semi_major_axis: 650, eccentricity: 0.0489, period: 374335776, inclination: 1.31, size: 4, color: 0xffff00, rotationSpeed: 0.02, orbitalSpeed: 1.31, info: "Largest planet, Great Red Spot", nasaLink: "https://science.nasa.gov/jupiter/facts/" },
    { name: "Saturn", texture: "textures/saturn.jpg", semi_major_axis: 850, eccentricity: 0.0565, period: 929596608, inclination: 2.49, size: 3, color: 0x87ceeb, rotationSpeed: 0.015, orbitalSpeed: 0.97, info: "Known for its beautiful rings",nasaLink: "https://science.nasa.gov/saturn/facts/" },
    { name: "Uranus", texture: "textures/uranus.jpg", semi_major_axis: 1050, eccentricity: 0.0457, period: 2651370019, inclination: 0.77, size: 2.5, color: 0x4682b4, rotationSpeed: -0.01, orbitalSpeed: 0.68, info: "Ice giant, tilted on its side",nasaLink: "https://science.nasa.gov/uranus/facts/" },
    { name: "Neptune", texture: "textures/neptune.jpg", semi_major_axis: 1250, eccentricity: 0.0086, period: 5200418560, inclination: 1.77, size: 2.5, color: 0x0000ff, rotationSpeed: 0.015, orbitalSpeed: 0.54, info: "Windiest planet, dark spot",nasaLink: "https://science.nasa.gov/neptune/facts/" }
];


// Function to create planet meshes with textures
function createPlanet(radius, textureUrl) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const texture = textureLoader.load(textureUrl);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    return new THREE.Mesh(geometry, material);
}

// Function to create rings for gas giants
function createSaturnRings(radius, innerRadius, textureUrl) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, radius, 32);
    const ringTexture = textureLoader.load(textureUrl);
    const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    return ring;
}

// Function to create simple white rings for other gas giants
function createCloudyRings(radius, innerRadius) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, radius, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    return ring;
}// Function to create simple white rings for other gas giants
function createCloudyRingsforuranus(radius, innerRadius) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, radius, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.x = Math.PI / 2;
    return ring;
}

function calculate_position(a, e, t, T, inclination) {
    const M = 2 * Math.PI * t / T;
    let E = M + e * Math.sin(M);
    let deltaE = 1;
    const tolerance = 1e-6;
    let iteration = 0;

    while (Math.abs(deltaE) > tolerance && iteration < 10) {
        deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= deltaE;
        iteration++;
    }

    const r = a * (1 - e * Math.cos(E));
    const theta = Math.atan2(Math.sqrt(1 - e * e) * Math.sin(E), Math.cos(E) - e);

    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);

    const i = THREE.MathUtils.degToRad(inclination);
    const y = z * Math.sin(i);
    const z_rotated = z * Math.cos(i);

    return [x, y, z_rotated];
}

// Create planets and add them to the scene
const planets = planetsData.map((planetData) => {
    const planet = createPlanet(planetData.size * 5, planetData.texture);
    scene.add(planet);
    planet.orbitalData = planetData; // Store orbital data for each planet
    planet.orbitAngle = 0; // Initialize orbit angle
    return planet;
});

// Function to update planets' positions based on their orbits
// Update function to move the planets in their orbits
function updatePlanets() {
    const elapsedTime = clock.getElapsedTime(); // Use elapsed time from the clock

    planets.forEach((planet) => {
        const { semi_major_axis, eccentricity, period, inclination } = planet.orbitalData;

        // Calculate normalized time in the orbital period
        const orbitalTime = elapsedTime / period; // Time scaled by orbital period

        // Calculate the position in the orbit using the function
        const [x, y, z] = calculate_position(semi_major_axis, eccentricity, orbitalTime, period, inclination);

        // Update planet position based on the calculated orbit
        planet.position.set(x, y, z);

        // Update planet's rotation to give it a spinning effect
        planet.rotation.y += planet.orbitalData.rotationSpeed; // Spin the planet
    });
}


// Function to create orbit paths
function createOrbitPath(planetData) {
    const { semi_major_axis, eccentricity } = planetData;
    const segments = 128;
    const points = [];

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const radius = semi_major_axis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
        
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        
        points.push(new THREE.Vector3(x, 0, z));
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: planetData.color,
        transparent: true,
        opacity: 0.6
    });
    
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    
    // Apply inclination rotation
    const inclination = THREE.MathUtils.degToRad(planetData.inclination);
    orbit.rotation.x = Math.PI / 2;  // This puts the orbit in the XZ plane
    orbit.rotation.z = inclination;  // This applies the inclination
    
    return orbit;
}

// Replace the existing orbit creation code with this
// Remove any existing orbits first
scene.children.forEach(child => {
    if (child instanceof THREE.Line) {
        scene.remove(child);
    }
});

// Add new, correct orbits to the scene
planetsData.forEach((planetData) => {
    const orbit = createOrbitPath(planetData);
    scene.add(orbit);
});

// Create rings for Saturn (with texture)
const saturnRing = createSaturnRings(40, 85, 'textures/saturn_ring.png');
planets[5].add(saturnRing);

// Create rings for Jupiter, Uranus, and Neptune (white cloudy appearance)
const jupiterRing = createCloudyRings(50, 45);
planets[4].add(jupiterRing);

const uranusRing = createCloudyRingsforuranus(40, 35);
uranusRing.rotation.z = Math.PI / 2;
planets[6].add(uranusRing);

const neptuneRing = createCloudyRings(30, 25);
planets[7].add(neptuneRing);

// Create the moon
const moonRadius = 2;
const moon = createPlanet(moonRadius, 'textures/moon.jpg');
scene.add(moon);

let moonOrbitAngle = 0;
const moonOrbitRadius = 30;

// Create a background for the scene
const starsGeometry = new THREE.SphereGeometry(5000, 32, 32);
const starsMaterial = new THREE.MeshBasicMaterial({ map: starryTexture, side: THREE.BackSide });
const stars = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(stars);

// Position the camera
camera.position.z = 1000;

// Sun particles for solar flares
function createSunParticles() {
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    const color = new THREE.Color();

    for (let i = 0; i < particlesCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 55 + Math.random() * 10;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        color.setHSL(0.1, 0.9, Math.random() * 0.5 + 0.5);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({ 
        size: 0.5, 
        vertexColors: true, 
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sun.add(particles);

    return particles;
}

const sunParticles = createSunParticles();

// Initialize a clock for consistent timing
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    updatePlanets();
    
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    
    // Update each planet's position and rotation
    planets.forEach((planet) => {
        const { semi_major_axis, eccentricity, period, inclination, orbitalSpeed, rotationSpeed } = planet.orbitalData;
         
        
        // Calculate orbital position
        const orbitalTime = elapsed / period; // Normalize time based on period
        const [x, y, z] = calculate_position(semi_major_axis, eccentricity, orbitalTime, period, inclination);
        
        // Set the planet's position
        planet.position.set(x, y, z);
        
        // Update planet's rotation
        planet.rotation.y += rotationSpeed; 
        planet.rotation.y += rotationSpeed * delta;// Rotate the planet around its axis
    });


    // Update Moon position (if applicable)
    moonOrbitAngle += 0.02;
    const earth = planets.find(p => p.orbitalData.name === "Earth");
    if (earth) {
        moon.position.x = earth.position.x + moonOrbitRadius * Math.cos(moonOrbitAngle);
        moon.position.y = earth.position.y + moonOrbitRadius * Math.sin(moonOrbitAngle) * Math.sin(5.14); // Moon's orbit inclination
        moon.position.z = earth.position.z + moonOrbitRadius * Math.sin(moonOrbitAngle) * Math.cos(5.14);
        moon.rotation.y += 0.01;
    }

    // Animate sun particles
    const positions = sunParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        const newX = x * Math.cos(0.01) - z * Math.sin(0.01);
        const newZ = z * Math.cos(0.01) + x * Math.sin(0.01);
        
        positions[i] = newX;
        positions[i + 2] = newZ;
    }
    sunParticles.geometry.attributes.position.needsUpdate = true;

    updateLighting();

    // Update sun glow material
    sunGlowMaterial.uniforms.viewVector.value.copy(camera.position);

    controls.update();
    renderer.render(scene, camera);
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

// Raycaster for planet selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle planet selection
function selectPlanet(planet) {
    if (planet) {
        const distance = planet.geometry.parameters.radius * 5;
        new TWEEN.Tween(camera.position)
            .to({
                x: planet.position.x,
                y: planet.position.y,
                z: planet.position.z + distance
            }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        new TWEEN.Tween(controls.target)
            .to({
                x: planet.position.x,
                y: planet.position.y,
                z: planet.position.z
            }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        updatePlanetInfo(planet);
    } else {
        new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 0, z: 1000 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        new TWEEN.Tween(controls.target)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        updatePlanetInfo(null);
    }
}

function updatePlanetInfo(planet) {
    const infoPanel = document.getElementById('infoPanel');
    const planetName = document.getElementById('planetName');
    const planetInfo = document.getElementById('planetInfo');
    const nasaLink = document.getElementById('nasaLink');

    if (planet && planet.orbitalData) {
        const { name, info, nasaLink: url } = planet.orbitalData;
        planetName.textContent = name;
        planetInfo.textContent = info;
        nasaLink.href = url;
        infoPanel.style.display = 'block';
    } else {
        infoPanel.style.display = 'none';
    }
}

// Event listener for planet selection
renderer.domElement.addEventListener('click', onDocumentMouseDown, false);

function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        selectPlanet(intersects[0].object);
    } else {
        selectPlanet(null);
    }
}

// Initialize the scene
function init() {
    // Set initial camera position
    camera.position.z = 1000;

    // Add event listener for window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start the animation loop
    animate();
}

// Call the init function to set up the scene
init();