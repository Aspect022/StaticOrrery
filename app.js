// Function to solve Kepler's Equation for eccentric anomaly (E)
function solveKepler(eccentricity, meanAnomaly, tolerance = 1e-6) {
    let eccentricAnomaly = meanAnomaly;
    let difference = 1;

    while (Math.abs(difference) > tolerance) {
        difference = (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
                     (1 - eccentricity * Math.cos(eccentricAnomaly));
        eccentricAnomaly -= difference;
    }
    
    return eccentricAnomaly;
}

// Calculate the position of the planet based on elliptical orbit
function calculateEllipticalOrbit(semiMajorAxis, eccentricity, meanAnomaly) {
    // Get Eccentric Anomaly using Kepler's Equation
    let eccentricAnomaly = solveKepler(eccentricity, meanAnomaly);

    // True Anomaly
    let trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
    );

    // Distance from focus (Sun)
    let radius = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));

    // Convert Polar Coordinates (radius, trueAnomaly) to Cartesian Coordinates (x, y)
    let x = radius * Math.cos(trueAnomaly);
    let y = radius * Math.sin(trueAnomaly);

    return { x: x, y: y };
}

// Function to update the planet's position over time
function updatePlanetPosition(planet, semiMajorAxis, eccentricity, initialMeanAnomaly, deltaT) {
    let meanAnomaly = initialMeanAnomaly + deltaT; // Progress the orbit over time
    let orbit = calculateEllipticalOrbit(semiMajorAxis, eccentricity, meanAnomaly);
    
    // Set the new position in Three.js (Assuming 2D view for now)
    planet.position.set(orbit.x, 0, orbit.y);
}

// Example planet setup (Earth)
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32), // Adjust size as per your scaling
    new THREE.MeshStandardMaterial({ color: 0x0077FF }) // Earth-like color
);

earth.position.set(1, 0, 0); // Starting position
scene.add(earth);

// Earth's orbital parameters
const earthSemiMajorAxis = 1; // AU (Astronomical Units)
const earthEccentricity = 0.0167;
let earthMeanAnomaly = 0; // Initial mean anomaly

// Three.js clock for time tracking
const clock = new THREE.Clock();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    let deltaT = clock.getDelta(); // Get time passed since the last frame
    updatePlanetPosition(earth, earthSemiMajorAxis, earthEccentricity, earthMeanAnomaly, deltaT);

    renderer.render(scene, camera);
}

// Start the animation
animate();
