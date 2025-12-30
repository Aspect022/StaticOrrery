# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently, the following versions are being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The StaticOrrery team takes the security of our software seriously. If you believe you have found a security vulnerability in StaticOrrery, we encourage you to let us know right away.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them by:

1. **Opening a GitHub Security Advisory**
   - Navigate to the [Security tab](https://github.com/Aspect022/StaticOrrery/security) of this repository
   - Click "Report a vulnerability"
   - Fill in the details of the vulnerability

2. **Or by opening a private issue**
   - Create a new issue with the label "security"
   - Mark it as confidential if the option is available
   - Include as much information as possible

### What to Include in Your Report

Please include the following information in your security report:

- **Type of vulnerability** (e.g., XSS, code injection, etc.)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** (what an attacker could do)
- **Your assessment of the severity** (critical, high, medium, low)

### What to Expect

After submitting a vulnerability report:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Assessment**: We will assess the vulnerability and determine its impact and severity
3. **Updates**: We will keep you informed about our progress toward a fix
4. **Resolution**: Once the vulnerability is fixed, we will release a patch and publicly disclose the vulnerability (with credit to you, if desired)

**Timeline:**
- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days for critical vulnerabilities

## Security Best Practices for Contributors

If you're contributing to StaticOrrery, please follow these security best practices:

### Client-Side Security

1. **Input Validation**
   - Validate all user inputs
   - Sanitize data before rendering
   - Use proper escaping for dynamic content

2. **Cross-Site Scripting (XSS) Prevention**
   - Avoid using `innerHTML` with user-provided data
   - Use `textContent` or proper sanitization libraries
   - Validate and sanitize URLs before using them

3. **Content Security Policy**
   - Be mindful of external resources loaded
   - Use integrity attributes for CDN resources when possible

4. **Dependencies**
   - Keep dependencies up to date
   - Review dependency security advisories regularly
   - Use `npm audit` to check for known vulnerabilities

### Code Review Checklist

Before submitting code, ensure:

- [ ] No hardcoded credentials or API keys
- [ ] No sensitive data logged to console
- [ ] User inputs are properly validated
- [ ] External URLs are validated
- [ ] No use of `eval()` or similar dangerous functions
- [ ] Dependencies are up to date and secure
- [ ] No unnecessary permissions requested

### Dependency Management

Run security audits regularly:

```bash
# Check for vulnerabilities in dependencies
npm audit

# Fix vulnerabilities automatically (where possible)
npm audit fix

# For more serious issues
npm audit fix --force
```

## Known Security Considerations

### Current Security Measures

1. **Client-Side Only**: This is a static web application with no backend, reducing server-side attack vectors
2. **No User Data Collection**: We don't collect or store personal user data
3. **External Resources**: We use reputable CDNs (Three.js, Font Awesome) for dependencies
4. **Texture Loading**: Textures are loaded from the local filesystem, not user-provided URLs

### Areas of Concern

1. **Third-Party Libraries**
   - Three.js and Tween.js are external dependencies
   - Keep them updated to latest secure versions

2. **Browser Compatibility**
   - WebGL vulnerabilities in older browsers
   - Encourage users to keep browsers updated

3. **Performance**
   - Large texture files could cause denial-of-service-like behavior
   - Consider implementing lazy loading for better performance

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed and fixed. Updates will be announced through:

1. GitHub Security Advisories
2. Release notes
3. README updates

## Disclosure Policy

We follow a **coordinated disclosure** approach:

1. Security issues are handled privately until a fix is available
2. Once fixed, we publicly disclose the vulnerability with:
   - Description of the vulnerability
   - Affected versions
   - Fixed version
   - Credit to the reporter (if they wish)
   - Mitigation steps for users

## Contact

For security-related questions not covered here, please open an issue with the "security" label.

## Hall of Fame

We appreciate security researchers who help keep StaticOrrery safe. Contributors who responsibly disclose vulnerabilities will be acknowledged here (with their permission):

- _No reports yet - be the first!_

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Three.js Security Considerations](https://threejs.org/docs/#manual/en/introduction/Security)

---

Thank you for helping keep StaticOrrery and its users safe! 🔒
