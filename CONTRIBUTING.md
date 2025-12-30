# Contributing to StaticOrrery 🌌

First off, thank you for considering contributing to StaticOrrery! It's people like you that make this project such a great tool for learning about our solar system.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Guidelines](#development-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Style Guide](#javascript-style-guide)
  - [HTML/CSS Style Guide](#htmlcss-style-guide)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Questions?](#questions)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior by opening an issue.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
 - Browser: [e.g. Chrome 95, Firefox 94, Safari 15]
 - Version: [e.g. commit hash or release version]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear and descriptive title**
- **Detailed description** of the proposed enhancement
- **Use cases** explaining why this would be useful
- **Possible implementation** (if you have ideas)
- **Screenshots or mockups** (if applicable)

**Enhancement areas we're particularly interested in:**

- New celestial objects (asteroids, comets, dwarf planets)
- Improved visual effects and animations
- Educational features and information panels
- Performance optimizations
- Mobile responsiveness improvements
- Accessibility enhancements
- Additional mini-games or interactive features

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**:
   - Write clear, commented code
   - Follow the existing code style
   - Test your changes thoroughly

3. **Commit your changes**:
   ```bash
   git commit -m "Add some amazing feature"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots/GIFs of visual changes
   - List of changes made

## Development Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

**Examples:**
```
Add Saturn's ring texture enhancement
Fix orbital calculation for eccentric orbits
Update README with new installation instructions
Refactor planet creation logic
```

### JavaScript Style Guide

- Use **ES6+** features where appropriate
- Use **camelCase** for variable and function names
- Use **PascalCase** for class names
- Add **comments** for complex logic
- Keep functions **small and focused**
- Use **meaningful variable names**

**Example:**
```javascript
// Good
function calculateOrbitalPosition(semiMajorAxis, eccentricity, time) {
    const meanAnomaly = calculateMeanAnomaly(time);
    return solveKeplerEquation(meanAnomaly, eccentricity);
}

// Avoid
function calc(a, e, t) {
    let m = 2 * Math.PI * t;
    return m;
}
```

### HTML/CSS Style Guide

- Use **semantic HTML5** elements
- Keep **CSS organized** and commented
- Use **consistent indentation** (2 or 4 spaces)
- Follow **BEM naming convention** for CSS classes where appropriate
- Ensure **responsive design** principles
- Test across **multiple browsers**

**Example:**
```html
<!-- Good -->
<section class="planet-info">
    <h2 class="planet-info__title">Mars</h2>
    <p class="planet-info__description">The Red Planet</p>
</section>

<!-- Good CSS -->
.planet-info {
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.7);
}

.planet-info__title {
    color: #39ff14;
    font-size: 24px;
}
```

## Project Structure

Understanding the project structure will help you contribute effectively:

```
StaticOrrery/
├── app.js              # Main Three.js solar system logic
├── index.html          # Landing page
├── star.html           # Solar system visualization page
├── game1.js/html/css   # Space Shooter game files
├── game2.js/html/css   # Space Shuffler puzzle files
├── resource.html       # Resources and credits page
├── style.css           # Main styles
├── style2.css          # Landing page styles
├── textures/           # Planet and space texture images
└── images/             # UI and game images
```

### Key Files to Understand

- **app.js**: Contains all the Three.js logic for rendering the solar system
  - Planet creation and texturing
  - Orbital mechanics calculations
  - Camera controls and interactions
  - Animation loop

- **star.html**: The main visualization page that imports Three.js and app.js

- **game1.js/game2.js**: Independent game logic

## Testing

Before submitting a pull request:

1. **Visual Testing**:
   - Open the application in multiple browsers
   - Test all interactive features (planet selection, camera controls)
   - Verify animations run smoothly
   - Check responsive design on different screen sizes

2. **Performance Testing**:
   - Monitor frame rate (should maintain 30+ fps)
   - Check memory usage for leaks
   - Test on lower-end devices if possible

3. **Cross-Browser Testing**:
   - Chrome/Chromium
   - Firefox
   - Safari (if on macOS)
   - Edge

4. **Code Quality**:
   - Remove console.log statements
   - Check for JavaScript errors in browser console
   - Validate HTML/CSS where appropriate

## Adding New Features

### Adding a New Planet or Celestial Body

1. Add texture to `/textures/` directory
2. Update `planetsData` array in `app.js`:
   ```javascript
   {
       name: "Pluto",
       texture: "textures/pluto.jpg",
       semi_major_axis: 1450,
       eccentricity: 0.2488,
       period: 7816176000,
       inclination: 17.14,
       size: 0.8,
       color: 0x8b7355,
       rotationSpeed: 0.00001,
       orbitalSpeed: 0.47,
       info: "Dwarf planet in the Kuiper belt",
       nasaLink: "https://science.nasa.gov/dwarf-planets/pluto/facts/"
   }
   ```

### Adding New Visual Effects

1. Study existing shader code in `app.js` (sun glow effect)
2. Create shader materials using Three.js ShaderMaterial
3. Test performance impact
4. Document any new uniforms or parameters

### Improving Performance

Areas to focus on:
- Texture optimization (size and format)
- Geometry simplification (reduce polygon count)
- Render optimization (frustum culling, LOD)
- Asset loading (lazy loading, compression)

## Questions?

Don't hesitate to ask questions by:
- Opening a GitHub issue with the "question" label
- Reaching out to the team members listed in the README

## Recognition

Contributors will be acknowledged in the README and/or a CONTRIBUTORS.md file.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StaticOrrery! 🚀✨
