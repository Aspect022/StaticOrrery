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

// Load Sun texture
const textureLoader = new THREE.TextureLoader();

const starryTexture = textureLoader.load('textures/stars_milky_way.jpg');
scene.background = starryTexture;

const sunTexture = textureLoader.load('textures/sun.jpg');

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(50, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
const sunPosition = new THREE.Vector3(0, 0, 0);

// Create glow sphere geometry
const glowGeometry = new THREE.SphereGeometry(60, 32, 32);
const glowMaterial = new THREE.ShaderMaterial({
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
            vec3 vNormel = normalize(viewVector - modelViewMatrix * vec4(position, 1.0)).xyz;
            intensity = pow(max(0.0, 0.6 - dot(vNormal, vNormel)), 6.0);  // Adjust intensity calculation
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

// Create glow mesh
const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
glowMesh.position.copy(sunPosition);

// Add objects to the scene
scene.add(glowMesh);
scene.add(sun);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 1).normalize();
scene.add(directionalLight);
const planetsData = [
    { name: "Mercury", texture: "textures/mercury.jpg", semi_major_axis: 150, eccentricity: 0.2056, period: 7600544, inclination: 7.0, size: 1, color: 0xffa500, rotationSpeed: 0.00001, orbitalSpeed: 4.74, info: "Smallest planet, closest to the Sun" },
    { name: "Venus", texture: "textures/venus.jpg", semi_major_axis: 250, eccentricity: 0.0067, period: 19414149, inclination: 3.4, size: 1.5, color: 0xffd700, rotationSpeed: -0.00000005, orbitalSpeed: 3.5, info: "Hottest planet, rotates backwards" },
    { name: "Earth", texture: "textures/earth.jpg", semi_major_axis: 350, eccentricity: 0.0167, period: 31557600, inclination: 0.0, size: 1.6, color: 0x00ff00, rotationSpeed: 0.01, orbitalSpeed: 2.98, info: "Our home, the blue planet" },
    { name: "Mars", texture: "textures/mars.jpg", semi_major_axis: 450, eccentricity: 0.0934, period: 59355072, inclination: 1.85, size: 1.2, color: 0xff4500, rotationSpeed: 0.01, orbitalSpeed: 2.41, info: "The Red Planet, home to Olympus Mons" },
    { name: "Jupiter", texture: "textures/jupiter.jpg", semi_major_axis: 650, eccentricity: 0.0489, period: 374335776, inclination: 1.31, size: 4, color: 0xffff00, rotationSpeed: 0.02, orbitalSpeed: 1.31, info: "Largest planet, Great Red Spot" },
    { name: "Saturn", texture: "textures/saturn.jpg", semi_major_axis: 850, eccentricity: 0.0565, period: 929596608, inclination: 2.49, size: 3, color: 0x87ceeb, rotationSpeed: 0.015, orbitalSpeed: 0.97, info: "Known for its beautiful rings" },
    { name: "Uranus", texture: "textures/uranus.jpg", semi_major_axis: 1050, eccentricity: 0.0457, period: 2651370019, inclination: 0.77, size: 2.5, color: 0x4682b4, rotationSpeed: -0.01, orbitalSpeed: 0.68, info: "Ice giant, tilted on its side" },
    { name: "Neptune", texture: "textures/neptune.jpg", semi_major_axis: 1250, eccentricity: 0.0086, period: 5200418560, inclination: 1.77, size: 2.5, color: 0x0000ff, rotationSpeed: 0.015, orbitalSpeed: 0.54, info: "Windiest planet, dark spot" }
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
function createCloudyRingsForUranus(radius, innerRadius) {
    const ringGeometry = new THREE.RingGeometry(innerRadius, radius, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.x = Math.PI / 2;  // Rotate to lay flat
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

// Function to create orbit paths
function createOrbitPath(semiMajorAxis, color) {
    const orbitGeometry = new THREE.RingGeometry(semiMajorAxis - 1, semiMajorAxis + 1, 64);  // Create a thin ring
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6  // Slight transparency for the orbit path
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;  // Rotate the orbit to lie flat (on the XZ plane)
    return orbit;
}

// Add orbits to the scene
planetsData.forEach((planetData) => {
    const orbit = createOrbitPath(planetData.semi_major_axis, planetData.color);
    scene.add(orbit);  // Add each orbit to the scene
});


// Create rings for Saturn (with texture)
const saturnRing = createSaturnRings(40, 85, 'textures/saturn_ring.png');  // Increased ring size
planets[5].add(saturnRing);  // Attach the ring to Saturn

// Create rings for Jupiter, Uranus, and Neptune (white cloudy appearance)
const jupiterRing = createCloudyRings(50, 45); // White cloudy rings for Jupiter
planets[4].add(jupiterRing); // Attach to Jupiter

const uranusRing = createCloudyRingsForUranus(40, 35);  // White cloudy rings for Uranus
uranusRing.rotation.z = Math.PI / 2;  // Tilt Uranus' rings by 90 degrees to appear vertical
planets[6].add(uranusRing);  // Attach to Uranus

const neptuneRing = createCloudyRings(30, 25);  // White cloudy rings for Neptune
planets[7].add(neptuneRing);  // Attach to Neptune


function createMoon(radius, textureUrl) {
    const moonGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(textureUrl);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    return new THREE.Mesh(moonGeometry, moonMaterial);
}
// Create a variable to store the currently selected planet
let selectedPlanet = null;

// Create a text sprite for displaying planet information
const planetInfoSprite = createTextSprite("");
scene.add(planetInfoSprite);

function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    context.font = "Bold 20px Arial";
    context.fillStyle = "rgba(255,255,255,0.95)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = "black";
    context.fillText(text, 10, 30);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(50, 25, 1);
    sprite.visible = false;

    return sprite;
}

function updatePlanetInfo(planet) {
    if (planet) {
        const { name, semi_major_axis, eccentricity, period, inclination } = planet.orbitalData;
        const text = `${name}\nSemi-major axis: ${semi_major_axis}\nEccentricity: ${eccentricity}\nOrbital period: ${period}\nInclination: ${inclination}°`;
        
        const canvas = planetInfoSprite.material.map.image;
        const context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(0,0,0,0.7)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = "Bold 16px Arial";
        context.fillStyle = "white";
        
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            context.fillText(line, 10, 20 + (index * 20));
        });
        
        planetInfoSprite.material.map.needsUpdate = true;
        planetInfoSprite.visible = true;
    } else {
        planetInfoSprite.visible = false;
    }
}

// Function to handle planet selection and camera zoom
function selectPlanet(planet) {
    selectedPlanet = planet;
    if (planet) {
        const distance = planet.geometry.parameters.radius * 5;
        new THREE.Tween(camera.position)
            .to({
                x: planet.position.x,
                y: planet.position.y,
                z: planet.position.z + distance
            }, 1000)
            .easing(THREE.Easing.Quadratic.Out)
            .start();

        new THREE.Tween(controls.target)
            .to({
                x: planet.position.x,
                y: planet.position.y,
                z: planet.position.z
            }, 1000)
            .easing(THREE.Easing.Quadratic.Out)
            .start();

        updatePlanetInfo(planet);
    } else {
        new THREE.Tween(camera.position)
            .to({ x: 0, y: 0, z: 1000 }, 1000)
            .easing(THREE.Easing.Quadratic.Out)
            .start();

        new THREE.Tween(controls.target)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(THREE.Easing.Quadratic.Out)
            .start();

        updatePlanetInfo(null);
    }
}

// Add click event listener to the renderer
renderer.domElement.addEventListener('click', onDocumentMouseDown, false);

function onDocumentMouseDown(event) {
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        selectPlanet(intersects[0].object);
    } else {
        selectPlanet(null);
    }
}

// Modify the animate function
function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = Date.now() * 0.000001;

    planets.forEach((planet) => {
        const { semi_major_axis, eccentricity, period, inclination, orbitalSpeed, rotationSpeed } = planet.orbitalData;
        
        const orbitalTime = currentTime * orbitalSpeed;
        const [x, y, z] = calculate_position(semi_major_axis, eccentricity, orbitalTime, period, inclination);
        
        planet.position.set(x, y, z);
        planet.rotation.y += rotationSpeed;
    });

    moonOrbitAngle += 0.01;
    
    const earthX = planets[2].position.x;
    const earthZ = planets[2].position.z;

    moon.position.x = earthX + moonOrbitRadius * Math.cos(moonOrbitAngle);
    moon.position.z = earthZ + moonOrbitRadius * Math.sin(moonOrbitAngle);

    moon.rotation.y = -moonOrbitAngle;

    updateLighting();

    // Update the position of the planetInfoSprite to follow the selected planet
    if (selectedPlanet) {
        planetInfoSprite.position.set(
            selectedPlanet.position.x,
            selectedPlanet.position.y + selectedPlanet.geometry.parameters.radius * 2,
            selectedPlanet.position.z
        );
    }
    requestAnimationFrame(animate);
    glowMaterial.uniforms.viewVector.value.copy(camera.position); // Update view vector

    THREE.Tween.update(); // Update tweens
    controls.update();
    renderer.render(scene, camera);
}

// Create the moon (give it a decent size for visibility, e.g., 1 unit)
const moonRadius = 10;  // Adjust if too small or large
const moon = createMoon(moonRadius, 'textures/moon.jpg');

// Set the moon's initial position (relative to the Earth's position)
moon.position.set(10, 0, 0);  // 10 units away from Earth

// Add the moon to the scene, not to Earth
scene.add(moon);

// In the animation loop, make the Moon orbit around Earth
let moonOrbitAngle = 6;  // Angle to control the orbit
const moonOrbitRadius = 30;  // Distance from Earth (can adjust for better visibility)

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
    
    // Spread particles in all directions
    const spreadFactor = 300; // Adjust this to increase or decrease the overall spread

    for (let i = 0; i < particlesCount; i++) {
        // Generate spherical coordinates
        const theta = Math.random() * Math.PI * 2; // Random angle around the Y-axis
        const phi = Math.acos(Math.random() * 2 - 1); // Random angle from the Y-axis
        
        // Convert spherical coordinates to Cartesian coordinates
        const x = spreadFactor * Math.sin(phi) * Math.cos(theta);
        const y = spreadFactor * Math.sin(phi) * Math.sin(theta);
        const z = spreadFactor * Math.cos(phi);
        
        // Assign positions
        positions[i * 3] = x; // x position
        positions[i * 3 + 1] = y; // y position
        positions[i * 3 + 2] = z; // z position
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
// Orbit animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = Date.now() * 0.000001;  // Time in some arbitrary unit

    // Update each planet's position (orbit around the Sun) and axial rotation
    planets.forEach((planet) => {
        const { semi_major_axis, eccentricity, period, inclination, orbitalSpeed, rotationSpeed } = planet.orbitalData;
        
        // Calculate the orbital position using orbital speed
        const orbitalTime = currentTime * orbitalSpeed;  // Speed factor for this planet
        const [x, y, z] = calculate_position(semi_major_axis, eccentricity, orbitalTime, period, inclination);
        
        planet.position.set(x, y, z);  // Update planet position in orbit

        // Rotate the planet on its own axis (simulate day/night rotation)
        planet.rotation.y += rotationSpeed;  // Adjust rotation on Y-axis for axial rotation
    });

    // Make the Moon orbit Earth (if applicable)
    moonOrbitAngle += 0.01;  // Adjust for orbit speed
    
    const earthX = planets[2].position.x;  // Earth's X position
    const earthZ = planets[2].position.z;  // Earth's Z position

    moon.position.x = earthX + moonOrbitRadius * Math.cos(moonOrbitAngle);
    moon.position.z = earthZ + moonOrbitRadius * Math.sin(moonOrbitAngle);

    moon.rotation.y = -moonOrbitAngle;  // Keep one side of the Moon facing the Earth

    updateLighting();  // Update lighting conditions

    controls.update();  // Update controls for the scene
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
