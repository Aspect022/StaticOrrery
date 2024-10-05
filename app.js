// Create a scene
const scene = new THREE.Scene();

// Create a camera (PerspectiveCamera simulates human eye view)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a renderer and attach it to the document
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the camera's position
camera.position.z = 50; // Move further back for a better view of more planets

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32); // Radius 3
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow color
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create a planet with a given size, color, and orbit radius
function createPlanet(radius, color, orbitRadius) {
    const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    const orbitGeometry = new THREE.RingGeometry(orbitRadius, orbitRadius + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate orbit to lie flat
    scene.add(orbit);

    return { planet, orbitRadius };
}

// Create Earth and its moon
const earthData = createPlanet(1, 0x0000ff, 8);
const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(earthData.planet);
scene.add(moon);

// Add more planets (Mars, Venus, Jupiter)
const venusData = createPlanet(0.9, 0xffa500, 5);  // Venus
const marsData = createPlanet(0.6, 0xff4500, 12);  // Mars
const jupiterData = createPlanet(2.5, 0xffe4b5, 20);  // Jupiter

scene.add(venusData.planet);
scene.add(marsData.planet);
scene.add(jupiterData.planet);

// Variables to track orbits
let earthOrbitAngle = 0;
let moonOrbitAngle = 0;
let venusOrbitAngle = 0;
let marsOrbitAngle = 0;
let jupiterOrbitAngle = 0;

// Create a simple animate loop
function animate() {
    requestAnimationFrame(animate);

    // Animate Earth's orbit around the Sun
    earthOrbitAngle += 0.01; // Increment the angle over time
    earthData.planet.position.x = earthData.orbitRadius * Math.cos(earthOrbitAngle);
    earthData.planet.position.z = earthData.orbitRadius * Math.sin(earthOrbitAngle);

    // Animate Moon's orbit around Earth
    moonOrbitAngle += 0.02;
    const moonOrbitRadius = 2; 
    moon.position.x = earthData.planet.position.x + moonOrbitRadius * Math.cos(moonOrbitAngle);
    moon.position.z = earthData.planet.position.z + moonOrbitRadius * Math.sin(moonOrbitAngle);

    // Animate Venus
    venusOrbitAngle += 0.015;
    venusData.planet.position.x = venusData.orbitRadius * Math.cos(venusOrbitAngle);
    venusData.planet.position.z = venusData.orbitRadius * Math.sin(venusOrbitAngle);

    // Animate Mars
    marsOrbitAngle += 0.008;
    marsData.planet.position.x = marsData.orbitRadius * Math.cos(marsOrbitAngle);
    marsData.planet.position.z = marsData.orbitRadius * Math.sin(marsOrbitAngle);

    // Animate Jupiter
    jupiterOrbitAngle += 0.004;
    jupiterData.planet.position.x = jupiterData.orbitRadius * Math.cos(jupiterOrbitAngle);
    jupiterData.planet.position.z = jupiterData.orbitRadius * Math.sin(jupiterOrbitAngle);

    renderer.render(scene, camera);
}

animate();
