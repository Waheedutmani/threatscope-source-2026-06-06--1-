import type { Vulnerability, User, ScanResult, Notification } from "@/store/vulnguard-store";

// ═══════════════════════════════════════════════════════════════════
// VULNERABILITIES (30+)
// ═══════════════════════════════════════════════════════════════════

export const vulnerabilities: Vulnerability[] = [
  // ── Injection & Input Validation ─────────────────────────────────
  {
    id: "vuln-001",
    name: "SQL Injection – Login Endpoint",
    severity: "critical",
    description:
      "The authentication endpoint at /api/auth/login is vulnerable to SQL injection through the username parameter. An attacker can bypass authentication by injecting malicious SQL payloads such as ' OR 1=1 --, potentially gaining unauthorized access to all user accounts and sensitive database contents.",
    riskLevel: "Critical",
    affectedAsset: "webapp-prod.corp.local (192.168.1.10)",
    recommendation:
      "Use parameterized queries or prepared statements for all database interactions. Implement input validation and sanitize all user-supplied data. Deploy a Web Application Firewall (WAF) with SQL injection rules. Conduct a full code review of all data access layers.",
    status: "open",
    cvssScore: 9.8,
    category: "Injection",
    discoveredAt: "2025-05-28T10:30:00Z",
    cwe: "CWE-89",
  },
  {
    id: "vuln-002",
    name: "Reflected XSS – Search Parameter",
    severity: "high",
    description:
      "The search functionality reflects user input without proper encoding, allowing execution of arbitrary JavaScript in the context of the victim's browser. This can be leveraged to steal session tokens, redirect users, or perform actions on their behalf.",
    riskLevel: "High",
    affectedAsset: "portal.corp.local (10.0.2.15)",
    recommendation:
      "Implement context-aware output encoding for all user-supplied data. Deploy Content Security Policy (CSP) headers with strict directives. Use frameworks that auto-escape output by default (React, Angular).",
    status: "in_progress",
    cvssScore: 7.5,
    category: "Cross-Site Scripting",
    discoveredAt: "2025-05-27T14:22:00Z",
    cwe: "CWE-79",
  },
  {
    id: "vuln-003",
    name: "Stored XSS – User Profile Comments",
    severity: "high",
    description:
      "The user profile comment section stores unsanitized HTML content, allowing persistent cross-site scripting attacks. Any user viewing the compromised profile will execute the embedded malicious script automatically.",
    riskLevel: "High",
    affectedAsset: "portal.corp.local (10.0.2.15)",
    recommendation:
      "Sanitize all user-generated content before storage using an HTML sanitizer library. Implement Content Security Policy headers. Apply server-side input validation with strict allow-lists for acceptable HTML tags.",
    status: "open",
    cvssScore: 8.2,
    category: "Cross-Site Scripting",
    discoveredAt: "2025-05-26T09:15:00Z",
    cwe: "CWE-79",
  },
  {
    id: "vuln-004",
    name: "DOM-Based XSS – URL Fragment",
    severity: "medium",
    description:
      "Client-side JavaScript reads the URL fragment (location.hash) and writes it to the DOM without sanitization. An attacker can craft a malicious URL that executes JavaScript when visited, potentially stealing credentials or performing actions on behalf of the user.",
    riskLevel: "Medium",
    affectedAsset: "app.corp.local (10.0.3.20)",
    recommendation:
      "Avoid using untrusted data sources like URL fragments in DOM operations. Use safe APIs such as textContent instead of innerHTML. Implement DOM sanitization and context-aware encoding for all dynamic content.",
    status: "open",
    cvssScore: 6.1,
    category: "Cross-Site Scripting",
    discoveredAt: "2025-05-25T11:00:00Z",
    cwe: "CWE-79",
  },
  {
    id: "vuln-005",
    name: "CSRF – Password Change Endpoint",
    severity: "high",
    description:
      "The password change functionality lacks CSRF token validation, allowing an attacker to craft a malicious page that changes a victim's password without their consent. The endpoint uses POST but does not verify the origin of the request.",
    riskLevel: "High",
    affectedAsset: "api.corp.local (10.0.2.30)",
    recommendation:
      "Implement anti-CSRF tokens for all state-changing operations. Use the SameSite cookie attribute set to Strict or Lax. Verify the Origin and Referer headers on the server side. Consider implementing double-submit cookie pattern.",
    status: "in_progress",
    cvssScore: 8.0,
    category: "Cross-Site Request Forgery",
    discoveredAt: "2025-05-24T16:30:00Z",
    cwe: "CWE-352",
  },
  {
    id: "vuln-006",
    name: "Open Redirect – Logout Handler",
    severity: "medium",
    description:
      "The logout endpoint accepts a redirect URL parameter without validation, enabling phishing attacks through crafted URLs that appear to originate from the trusted domain. Users can be redirected to attacker-controlled sites that mimic the login page.",
    riskLevel: "Medium",
    affectedAsset: "auth.corp.local (10.0.1.5)",
    recommendation:
      "Validate redirect URLs against an allow-list of trusted domains. Use relative paths instead of absolute URLs for redirects. Implement user confirmation for external redirects. Log all redirect attempts for monitoring.",
    status: "open",
    cvssScore: 5.4,
    category: "Open Redirect",
    discoveredAt: "2025-05-23T08:45:00Z",
    cwe: "CWE-601",
  },
  // ── UI Redressing & Navigation ───────────────────────────────────
  {
    id: "vuln-007",
    name: "Clickjacking – Admin Panel",
    severity: "medium",
    description:
      "The administration panel does not set X-Frame-Options or Content-Security-Policy frame-ancestors headers, allowing the page to be embedded in iframes on malicious sites. An attacker could overlay invisible frames to trick administrators into performing unintended actions.",
    riskLevel: "Medium",
    affectedAsset: "admin.corp.local (10.0.1.2)",
    recommendation:
      "Set the X-Frame-Options header to DENY or SAMEORIGIN. Implement CSP frame-ancestors directive. For legacy browser support, include JavaScript frame-busting code as a secondary measure.",
    status: "resolved",
    cvssScore: 5.3,
    category: "Clickjacking",
    discoveredAt: "2025-05-22T13:20:00Z",
    cwe: "CWE-1021",
  },
  // ── Path Traversal & File Inclusion ──────────────────────────────
  {
    id: "vuln-008",
    name: "Directory Traversal – File Download API",
    severity: "critical",
    description:
      "The file download API endpoint does not properly validate file paths, allowing traversal sequences (../) to access files outside the intended directory. An attacker can read sensitive system files such as /etc/passwd, /etc/shadow, and application configuration files.",
    riskLevel: "Critical",
    affectedAsset: "fileserver.corp.local (192.168.1.50)",
    recommendation:
      "Validate and canonicalize all file paths before processing. Use chroot jails or restrict file access to designated directories. Implement strict input validation that rejects path traversal sequences. Map file identifiers to paths server-side rather than accepting user-supplied paths.",
    status: "open",
    cvssScore: 9.1,
    category: "Path Traversal",
    discoveredAt: "2025-05-21T10:10:00Z",
    cwe: "CWE-22",
  },
  {
    id: "vuln-009",
    name: "Local File Inclusion – Template Engine",
    severity: "critical",
    description:
      "The template rendering engine accepts user-controlled file paths, enabling local file inclusion. An attacker can include arbitrary files from the server, potentially executing PHP/JSP code or exposing sensitive configuration data containing database credentials and API keys.",
    riskLevel: "Critical",
    affectedAsset: "webapp-prod.corp.local (192.168.1.10)",
    recommendation:
      "Never pass user input directly to file inclusion functions. Use allow-lists for template names. Store templates outside the web root. Disable PHP's allow_url_include and use opcache for production. Implement strict input validation and path canonicalization.",
    status: "open",
    cvssScore: 9.0,
    category: "File Inclusion",
    discoveredAt: "2025-05-20T15:45:00Z",
    cwe: "CWE-98",
  },
  {
    id: "vuln-010",
    name: "Remote File Inclusion – Plugin Loader",
    severity: "critical",
    description:
      "The plugin loading mechanism fetches resources based on user-supplied URLs without validation, enabling remote file inclusion. An attacker can inject a remote malicious script that gets executed server-side, resulting in complete system compromise.",
    riskLevel: "Critical",
    affectedAsset: "cms.corp.local (192.168.1.25)",
    recommendation:
      "Disable remote file inclusion in PHP configuration (allow_url_include=Off). Use an allow-list of trusted plugin sources. Implement code signing verification for plugins. Store plugins locally and never fetch from user-supplied URLs.",
    status: "in_progress",
    cvssScore: 9.8,
    category: "File Inclusion",
    discoveredAt: "2025-05-19T07:30:00Z",
    cwe: "CWE-98",
  },
  // ── Security Headers & Transport ─────────────────────────────────
  {
    id: "vuln-011",
    name: "Missing Security Headers – Main Web Application",
    severity: "medium",
    description:
      "The web application is missing critical security headers including X-Content-Type-Options, X-Frame-Options, Content-Security-Policy, Strict-Transport-Security, and X-XSS-Protection. These headers are essential for preventing various client-side attacks and enforcing secure browser behaviors.",
    riskLevel: "Medium",
    affectedAsset: "www.corp.local (10.0.0.5)",
    recommendation:
      "Implement a comprehensive security header policy: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, CSP with strict directives, HSTS with max-age of at least 1 year and includeSubDomains, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy to restrict browser features.",
    status: "in_progress",
    cvssScore: 5.3,
    category: "Security Headers",
    discoveredAt: "2025-05-18T12:00:00Z",
    cwe: "CWE-693",
  },
  {
    id: "vuln-012",
    name: "Weak SSL/TLS Configuration – External API",
    severity: "high",
    description:
      "The external-facing API server supports deprecated TLS 1.0 and TLS 1.1 protocols, along with weak cipher suites (RC4, DES, 3DES). This exposes communications to man-in-the-middle attacks, decryption of captured traffic, and data interception by malicious actors.",
    riskLevel: "High",
    affectedAsset: "api.corp.local (10.0.2.30)",
    recommendation:
      "Disable TLS 1.0 and TLS 1.1, enforcing TLS 1.2 minimum (prefer TLS 1.3). Remove all weak cipher suites and only allow AEAD ciphers (AES-GCM, ChaCha20-Poly1305). Enable HSTS with long max-age. Obtain certificates from trusted CAs and implement certificate pinning for mobile clients.",
    status: "open",
    cvssScore: 8.1,
    category: "Weak SSL/TLS",
    discoveredAt: "2025-05-17T09:30:00Z",
    cwe: "CWE-326",
  },
  {
    id: "vuln-013",
    name: "Insecure Cookie Configuration – Session Management",
    severity: "medium",
    description:
      "Session cookies are set without the Secure and HttpOnly flags, making them accessible via JavaScript (enabling XSS-based session theft) and transmitted over unencrypted connections. The SameSite attribute is also not configured, increasing CSRF risk.",
    riskLevel: "Medium",
    affectedAsset: "auth.corp.local (10.0.1.5)",
    recommendation:
      "Set Secure flag on all cookies to ensure HTTPS-only transmission. Set HttpOnly flag on session cookies to prevent JavaScript access. Set SameSite to Strict or Lax. Use __Host- and __Secure- cookie prefixes. Implement short session timeouts and secure regeneration of session IDs.",
    status: "resolved",
    cvssScore: 5.4,
    category: "Insecure Cookies",
    discoveredAt: "2025-05-16T14:15:00Z",
    cwe: "CWE-614",
  },
  // ── Exposed Services & Misconfigurations ─────────────────────────
  {
    id: "vuln-014",
    name: "Exposed Admin Panel – No Authentication",
    severity: "critical",
    description:
      "The administrative panel is accessible on port 9090 without any authentication requirement. The panel provides full control over system configuration, user management, and data exports. An attacker with network access can gain complete administrative control.",
    riskLevel: "Critical",
    affectedAsset: "admin.corp.local:9090 (10.0.1.2)",
    recommendation:
      "Immediately restrict access to the admin panel using IP allow-listing and VPN requirements. Implement strong authentication with multi-factor verification. Move the admin panel to a non-standard internal-only path. Add rate limiting and account lockout mechanisms.",
    status: "open",
    cvssScore: 9.8,
    category: "Exposed Services",
    discoveredAt: "2025-05-15T08:00:00Z",
    cwe: "CWE-306",
  },
  {
    id: "vuln-015",
    name: "Debug Mode Enabled – Production Server",
    severity: "high",
    description:
      "The production web server has debug mode enabled, exposing detailed stack traces, environment variables, and internal application paths in error responses. This information leak significantly aids attackers in understanding the application architecture and crafting targeted exploits.",
    riskLevel: "High",
    affectedAsset: "webapp-prod.corp.local (192.168.1.10)",
    recommendation:
      "Disable debug mode in production environments immediately. Use environment-specific configuration to ensure debug is only active in development. Implement custom error pages that do not expose internal details. Review all error handling to ensure no sensitive information leaks.",
    status: "resolved",
    cvssScore: 7.5,
    category: "Misconfiguration",
    discoveredAt: "2025-05-14T16:45:00Z",
    cwe: "CWE-489",
  },
  // ── Network & Service Vulnerabilities ────────────────────────────
  {
    id: "vuln-016",
    name: "Open SSH Port with Password Authentication",
    severity: "medium",
    description:
      "The SSH service on port 22 is internet-facing and permits password-based authentication without rate limiting or account lockout. This makes the server susceptible to brute-force attacks attempting to guess weak credentials.",
    riskLevel: "Medium",
    affectedAsset: "bastion.corp.local (203.0.113.10)",
    recommendation:
      "Disable password authentication and require SSH key-based authentication. Implement fail2ban or similar intrusion prevention. Change the default SSH port. Restrict SSH access to specific IP ranges via firewall rules. Use two-factor authentication for SSH access.",
    status: "in_progress",
    cvssScore: 6.5,
    category: "Open Ports",
    discoveredAt: "2025-05-13T11:20:00Z",
    cwe: "CWE-521",
  },
  {
    id: "vuln-017",
    name: "Unnecessary Open Ports – Development Services in Production",
    severity: "high",
    description:
      "Multiple development-only services are exposed on the production server including Redis (6379), MongoDB (27017), and Elasticsearch (9200) without authentication. These services contain sensitive application data and can be leveraged for lateral movement.",
    riskLevel: "High",
    affectedAsset: "dbserver.corp.local (192.168.1.30)",
    recommendation:
      "Close all unnecessary ports on production servers. Bind database services to localhost only. Implement firewall rules restricting access to database ports from application servers only. Enable authentication on all database services. Use VPN for remote administrative access.",
    status: "open",
    cvssScore: 8.6,
    category: "Open Ports",
    discoveredAt: "2025-05-12T10:00:00Z",
    cwe: "CWE-284",
  },
  {
    id: "vuln-018",
    name: "Service Enumeration – Version Disclosure",
    severity: "low",
    description:
      "Multiple services disclose their exact version numbers in banners and response headers, including Apache 2.4.49, OpenSSH 8.2, and MySQL 8.0.28. This information allows attackers to identify known vulnerabilities specific to these versions and plan targeted attacks.",
    riskLevel: "Low",
    affectedAsset: "www.corp.local (10.0.0.5)",
    recommendation:
      "Configure services to suppress version information in banners and headers. For Apache, set ServerTokens Prod and ServerSignature Off. For SSH, modify the banner in sshd_config. Regularly update services to the latest versions regardless.",
    status: "open",
    cvssScore: 3.7,
    category: "Service Enumeration",
    discoveredAt: "2025-05-11T14:30:00Z",
    cwe: "CWE-200",
  },
  {
    id: "vuln-019",
    name: "Outdated Apache Server – Known RCE Vulnerability",
    severity: "critical",
    description:
      "The Apache HTTP Server version 2.4.49 is running and is vulnerable to CVE-2021-41773, a path traversal and remote code execution vulnerability. This allows unauthenticated attackers to read files outside the document root and potentially execute arbitrary code on the server.",
    riskLevel: "Critical",
    affectedAsset: "www.corp.local (10.0.0.5)",
    recommendation:
      "Upgrade Apache HTTP Server to the latest stable version immediately. Apply all available security patches. Review and restrict directory configurations. Implement mod_security WAF rules. Conduct a post-patch scan to verify the vulnerability is remediated.",
    status: "open",
    cvssScore: 9.8,
    category: "Outdated Services",
    discoveredAt: "2025-05-10T08:00:00Z",
    cwe: "CWE-22",
  },
  {
    id: "vuln-020",
    name: "Outdated OpenSSL – Heartbleed Vulnerable",
    severity: "critical",
    description:
      "The server is running OpenSSL 1.0.1f, which is vulnerable to the Heartbleed bug (CVE-2014-0160). This allows attackers to read up to 64KB of server memory per request, potentially exposing private keys, session tokens, and other sensitive data.",
    riskLevel: "Critical",
    affectedAsset: "secure.corp.local (192.168.1.15)",
    recommendation:
      "Upgrade OpenSSL to version 1.0.1g or later immediately. Revoke and reissue all SSL/TLS certificates. Reset all user passwords and session tokens. Implement a patch management program to ensure timely updates of critical security libraries.",
    status: "accepted",
    cvssScore: 9.1,
    category: "Outdated Services",
    discoveredAt: "2025-05-09T06:00:00Z",
    cwe: "CWE-119",
  },
  // ── DNS & Network Configuration ──────────────────────────────────
  {
    id: "vuln-021",
    name: "DNS Zone Transfer Allowed",
    severity: "high",
    description:
      "The primary DNS server allows zone transfers to any requesting host, exposing the complete list of internal hostnames, IP addresses, and network topology. This information significantly aids attackers in mapping the internal network and identifying high-value targets.",
    riskLevel: "High",
    affectedAsset: "dns1.corp.local (10.0.0.2)",
    recommendation:
      "Restrict DNS zone transfers to authorized secondary DNS servers only. Configure ACLs on the DNS server to deny AXFR/IXFR requests from unauthorized hosts. Monitor DNS logs for unauthorized zone transfer attempts. Consider splitting internal and external DNS infrastructure.",
    status: "open",
    cvssScore: 7.5,
    category: "DNS Issues",
    discoveredAt: "2025-05-08T13:00:00Z",
    cwe: "CWE-404",
  },
  {
    id: "vuln-022",
    name: "DNS Cache Poisoning Vulnerability",
    severity: "high",
    description:
      "The DNS resolver does not implement source port randomization or query ID randomization, making it susceptible to DNS cache poisoning attacks. An attacker can inject forged DNS responses to redirect users to malicious websites.",
    riskLevel: "High",
    affectedAsset: "dns2.corp.local (10.0.0.3)",
    recommendation:
      "Enable source port randomization and query ID randomization on DNS resolvers. Implement DNSSEC for zone signing and validation. Deploy DNS-over-HTTPS or DNS-over-TLS for encrypted resolution. Use trusted upstream DNS providers.",
    status: "in_progress",
    cvssScore: 7.4,
    category: "DNS Issues",
    discoveredAt: "2025-05-07T09:30:00Z",
    cwe: "CWE-346",
  },
  // ── Additional Web Vulnerabilities ────────────────────────────────
  {
    id: "vuln-023",
    name: "Insecure Direct Object Reference – User API",
    severity: "high",
    description:
      "The user profile API endpoint accepts a user ID parameter without proper authorization checks. An authenticated user can modify the ID to access or modify other users' profile data, including email addresses, phone numbers, and role assignments.",
    riskLevel: "High",
    affectedAsset: "api.corp.local (10.0.2.30)",
    recommendation:
      "Implement proper authorization checks on all API endpoints. Verify that the requesting user has permission to access or modify the requested resource. Use indirect reference maps instead of exposing internal identifiers. Log all access attempts for audit purposes.",
    status: "open",
    cvssScore: 8.1,
    category: "Broken Access Control",
    discoveredAt: "2025-05-06T15:00:00Z",
    cwe: "CWE-639",
  },
  {
    id: "vuln-024",
    name: "XML External Entity Injection – SOAP API",
    severity: "high",
    description:
      "The SOAP API endpoint processes XML input without disabling external entity resolution, allowing XXE attacks. An attacker can read arbitrary files, perform server-side request forgery, or cause denial of service by submitting crafted XML payloads.",
    riskLevel: "High",
    affectedAsset: "soap-api.corp.local (192.168.1.40)",
    recommendation:
      "Disable DTD processing and external entity resolution in the XML parser. Use JSON instead of XML where possible. Implement input validation with XML schema validation. Deploy a WAF with XXE detection rules. Monitor for suspicious XML payloads in logs.",
    status: "in_progress",
    cvssScore: 8.6,
    category: "Injection",
    discoveredAt: "2025-05-05T10:20:00Z",
    cwe: "CWE-611",
  },
  {
    id: "vuln-025",
    name: "Server-Side Request Forgery – Webhook Handler",
    severity: "high",
    description:
      "The webhook registration endpoint allows arbitrary URL submission without validation, enabling SSRF attacks. An attacker can make the server send requests to internal services, cloud metadata endpoints, and other resources that are not publicly accessible.",
    riskLevel: "High",
    affectedAsset: "api.corp.local (10.0.2.30)",
    recommendation:
      "Validate and restrict webhook URLs to approved domains and IP ranges. Block requests to private IP ranges, loopback addresses, and cloud metadata endpoints (169.254.169.254). Use allow-lists for outbound requests. Implement network segmentation to limit SSRF impact.",
    status: "open",
    cvssScore: 8.5,
    category: "SSRF",
    discoveredAt: "2025-05-04T11:45:00Z",
    cwe: "CWE-918",
  },
  {
    id: "vuln-026",
    name: "Insecure Deserialization – Session Handler",
    severity: "critical",
    description:
      "The application uses native object deserialization for session data without integrity verification. An attacker can craft malicious serialized objects that execute arbitrary code upon deserialization, leading to complete server compromise.",
    riskLevel: "Critical",
    affectedAsset: "webapp-prod.corp.local (192.168.1.10)",
    recommendation:
      "Replace native serialization with safe data formats like JSON. Implement cryptographic signing for all serialized data. Apply strict type checking during deserialization. Use deserialization filters or look-ahead limits. Run application with minimal required privileges.",
    status: "open",
    cvssScore: 9.8,
    category: "Insecure Deserialization",
    discoveredAt: "2025-05-03T08:15:00Z",
    cwe: "CWE-502",
  },
  // ── Authentication & Session ─────────────────────────────────────
  {
    id: "vuln-027",
    name: "Weak Password Policy – No Complexity Requirements",
    severity: "medium",
    description:
      "The application enforces no password complexity requirements, allowing passwords as short as 4 characters with no requirement for uppercase, lowercase, numbers, or special characters. This makes accounts highly susceptible to brute-force and credential stuffing attacks.",
    riskLevel: "Medium",
    affectedAsset: "auth.corp.local (10.0.1.5)",
    recommendation:
      "Enforce minimum password length of 12 characters. Require complexity including uppercase, lowercase, numbers, and special characters. Implement password strength meters. Check against commonly breached password lists. Enable multi-factor authentication.",
    status: "in_progress",
    cvssScore: 5.3,
    category: "Authentication",
    discoveredAt: "2025-05-02T14:30:00Z",
    cwe: "CWE-521",
  },
  {
    id: "vuln-028",
    name: "Session Fixation Vulnerability",
    severity: "high",
    description:
      "The application does not regenerate session IDs after authentication. An attacker can set a known session ID on a victim's browser before login, then use that same ID to hijack the authenticated session and impersonate the victim.",
    riskLevel: "High",
    affectedAsset: "auth.corp.local (10.0.1.5)",
    recommendation:
      "Always regenerate session IDs after successful authentication. Do not accept session IDs from URLs or query parameters. Set session cookies with proper flags (Secure, HttpOnly, SameSite). Implement session timeouts and activity-based expiration.",
    status: "open",
    cvssScore: 7.5,
    category: "Authentication",
    discoveredAt: "2025-05-01T16:00:00Z",
    cwe: "CWE-384",
  },
  // ── Cryptography & Data Protection ───────────────────────────────
  {
    id: "vuln-029",
    name: "Sensitive Data in Cleartext – Database Storage",
    severity: "high",
    description:
      "The database stores sensitive information including passwords (hashed with MD5), credit card numbers, and personal data in cleartext. MD5 is cryptographically broken and unsuitable for password hashing, and cleartext storage of PII violates compliance requirements.",
    riskLevel: "High",
    affectedAsset: "dbserver.corp.local (192.168.1.30)",
    recommendation:
      "Migrate password hashing to bcrypt, scrypt, or Argon2id with appropriate work factors. Encrypt sensitive data at rest using AES-256. Implement field-level encryption for PII. Ensure encryption keys are managed through a dedicated key management system (KMS).",
    status: "open",
    cvssScore: 8.2,
    category: "Cryptography",
    discoveredAt: "2025-04-30T09:00:00Z",
    cwe: "CWE-312",
  },
  {
    id: "vuln-030",
    name: "Hardcoded Cryptographic Keys in Source Code",
    severity: "critical",
    description:
      "Cryptographic keys and API secrets are hardcoded in the application source code repository, including JWT signing keys, database passwords, and third-party API keys. Anyone with source code access can extract these credentials to impersonate the application or access protected resources.",
    riskLevel: "Critical",
    affectedAsset: "git.corp.local (10.0.1.10)",
    recommendation:
      "Remove all hardcoded secrets from source code immediately. Use environment variables or a secrets management solution (HashiCorp Vault, AWS Secrets Manager). Implement pre-commit hooks to detect secrets in code. Rotate all exposed keys and credentials. Use git history rewriting tools to remove traces.",
    status: "open",
    cvssScore: 9.1,
    category: "Cryptography",
    discoveredAt: "2025-04-29T10:30:00Z",
    cwe: "CWE-798",
  },
  // ── Additional Vulnerabilities ───────────────────────────────────
  {
    id: "vuln-031",
    name: "Unrestricted File Upload – Web Application",
    severity: "high",
    description:
      "The file upload functionality does not validate file types, extensions, or content. An attacker can upload web shells, executable files, or malicious documents that, when accessed or processed, lead to remote code execution or cross-site scripting.",
    riskLevel: "High",
    affectedAsset: "portal.corp.local (10.0.2.15)",
    recommendation:
      "Implement strict file type validation using both extension checks and content-type/MIME verification. Use a dedicated file storage service separate from the web server. Rename uploaded files with random names. Scan uploads for malware. Set proper permissions on upload directories.",
    status: "open",
    cvssScore: 8.8,
    category: "File Upload",
    discoveredAt: "2025-04-28T12:00:00Z",
    cwe: "CWE-434",
  },
  {
    id: "vuln-032",
    name: "Race Condition – Financial Transaction Processing",
    severity: "medium",
    description:
      "The transaction processing endpoint lacks proper locking mechanisms, allowing concurrent requests to exploit race conditions. An attacker can submit multiple simultaneous withdrawal requests, potentially withdrawing more funds than the account balance permits.",
    riskLevel: "Medium",
    affectedAsset: "payments.corp.local (192.168.1.60)",
    recommendation:
      "Implement database-level locks or optimistic concurrency control for financial operations. Use atomic database operations and transactions. Add server-side request deduplication. Implement rate limiting on transaction endpoints. Add post-transaction verification checks.",
    status: "in_progress",
    cvssScore: 6.2,
    category: "Race Condition",
    discoveredAt: "2025-04-27T09:00:00Z",
    cwe: "CWE-362",
  },
  {
    id: "vuln-033",
    name: "Missing Rate Limiting – Authentication Endpoints",
    severity: "medium",
    description:
      "Authentication endpoints (login, password reset, 2FA verification) lack rate limiting, allowing unlimited attempts. This enables brute-force attacks to guess passwords, enumeration of valid email addresses, and denial of service through excessive requests.",
    riskLevel: "Medium",
    affectedAsset: "auth.corp.local (10.0.1.5)",
    recommendation:
      "Implement progressive rate limiting on all authentication endpoints. Use sliding window counters with reasonable thresholds (e.g., 5 failed attempts per 15 minutes). Implement account lockout with exponential backoff. Deploy CAPTCHA after failed attempts. Monitor for automated attack patterns.",
    status: "open",
    cvssScore: 5.3,
    category: "Authentication",
    discoveredAt: "2025-04-26T14:00:00Z",
    cwe: "CWE-307",
  },
  {
    id: "vuln-034",
    name: "CORS Misconfiguration – Wildcard Origin",
    severity: "medium",
    description:
      "The API server returns Access-Control-Allow-Origin: * for all endpoints, including those handling sensitive data and authentication. This allows any website to make cross-origin requests to the API, potentially enabling data theft through victim-initiated requests.",
    riskLevel: "Medium",
    affectedAsset: "api.corp.local (10.0.2.30)",
    recommendation:
      "Replace the wildcard CORS origin with a strict allow-list of trusted domains. Never allow wildcard origins for authenticated endpoints. Ensure Access-Control-Allow-Credentials is not combined with wildcard origins. Implement origin validation on the server side. Use Vary: Origin header.",
    status: "resolved",
    cvssScore: 5.0,
    category: "Misconfiguration",
    discoveredAt: "2025-04-25T11:30:00Z",
    cwe: "CWE-942",
  },
  {
    id: "vuln-035",
    name: "Information Exposure Through Error Messages",
    severity: "low",
    description:
      "Application error responses include detailed stack traces, database query strings, file paths, and framework version information. This internal information aids attackers in understanding the application structure and identifying potential attack vectors.",
    riskLevel: "Low",
    affectedAsset: "webapp-prod.corp.local (192.168.1.10)",
    recommendation:
      "Implement generic error pages for production that do not reveal internal details. Log detailed error information server-side only. Use a centralized error handling mechanism. Review all exception handling to ensure no sensitive data leaks in responses.",
    status: "resolved",
    cvssScore: 3.1,
    category: "Information Disclosure",
    discoveredAt: "2025-04-24T16:00:00Z",
    cwe: "CWE-209",
  },
];

// ═══════════════════════════════════════════════════════════════════
// CVEs (15+)
// ═══════════════════════════════════════════════════════════════════

export interface CVEEntry {
  id: string;
  cvss: number;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  affectedProducts: string[];
  publishedDate: string;
  exploitAvailable: boolean;
}

export const cveEntries: CVEEntry[] = [
  {
    id: "CVE-2024-38816",
    cvss: 9.8,
    severity: "critical",
    description:
      "Spring Framework path traversal vulnerability allowing arbitrary file read on the server via crafted HTTP requests.",
    affectedProducts: ["Spring Framework 6.1.x", "Spring Framework 6.0.x"],
    publishedDate: "2024-12-15",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-3094",
    cvss: 10.0,
    severity: "critical",
    description:
      "XZ Utils supply chain backdoor in versions 5.6.0 and 5.6.1, enabling unauthorized remote SSH access via compromised liblzma.",
    affectedProducts: ["xz-utils 5.6.0", "xz-utils 5.6.1"],
    publishedDate: "2024-03-29",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-4577",
    cvss: 9.8,
    severity: "critical",
    description:
      "PHP CGI argument injection vulnerability on Windows allowing remote code execution through specially crafted query strings.",
    affectedProducts: ["PHP 8.1-8.3 (Windows)", "PHP 8.0 (Windows)"],
    publishedDate: "2024-06-20",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-27198",
    cvss: 9.8,
    severity: "critical",
    description:
      "JetBrains TeamCity authentication bypass via alternate path allowing unauthenticated remote code execution.",
    affectedProducts: ["TeamCity 2023.11.x", "TeamCity 2024.03.x"],
    publishedDate: "2024-03-07",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-0012",
    cvss: 9.8,
    severity: "critical",
    description:
      "Palo Alto Networks PAN-OS management interface authentication bypass allowing admin access without credentials.",
    affectedProducts: ["PAN-OS 10.2", "PAN-OS 11.0", "PAN-OS 11.1"],
    publishedDate: "2024-01-12",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-21762",
    cvss: 9.6,
    severity: "critical",
    description:
      "FortiOS SSL VPN out-of-bound write vulnerability enabling remote code execution via crafted HTTP requests.",
    affectedProducts: ["FortiOS 7.4.x", "FortiOS 7.2.x", "FortiOS 7.0.x"],
    publishedDate: "2024-02-08",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-23897",
    cvss: 8.6,
    severity: "high",
    description:
      "Jenkins CLI path traversal allowing arbitrary file read on the controller through crafted command arguments.",
    affectedProducts: ["Jenkins 2.426.x", "Jenkins 2.440.x", "Jenkins 2.441"],
    publishedDate: "2024-01-24",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-29847",
    cvss: 8.0,
    severity: "high",
    description:
      "Ivanti EPM Agent remote code execution via crafted SOAP request allowing arbitrary command execution with SYSTEM privileges.",
    affectedProducts: ["Ivanti EPM 2021.x", "Ivanti EPM 2022.x"],
    publishedDate: "2024-06-11",
    exploitAvailable: false,
  },
  {
    id: "CVE-2024-1709",
    cvss: 8.4,
    severity: "high",
    description:
      "ConnectWise ScreenConnect authentication bypass allowing unauthorized access to the admin setup wizard.",
    affectedProducts: ["ScreenConnect 23.9.x", "ScreenConnect 23.8.x"],
    publishedDate: "2024-02-21",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-38063",
    cvss: 8.8,
    severity: "high",
    description:
      "Windows TCP/IP stack remote code execution vulnerability exploitable via crafted ICMP packets.",
    affectedProducts: ["Windows 10", "Windows 11", "Windows Server 2019-2022"],
    publishedDate: "2024-08-13",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-6387",
    cvss: 8.1,
    severity: "high",
    description:
      "OpenSSH server regreSSHion vulnerability allowing unauthenticated remote code execution via race condition in signal handling.",
    affectedProducts: ["OpenSSH 8.5p1-9.5p1"],
    publishedDate: "2024-07-01",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-29059",
    cvss: 7.5,
    severity: "high",
    description:
      "Docker Engine auth plugin bypass allowing unauthorized image operations when multiple plugins are configured.",
    affectedProducts: ["Docker Engine 25.0.x", "Docker Engine 24.0.x"],
    publishedDate: "2024-04-01",
    exploitAvailable: false,
  },
  {
    id: "CVE-2024-21626",
    cvss: 8.6,
    severity: "high",
    description:
      "runc container breakout vulnerability allowing access to the host filesystem via leaked file descriptors.",
    affectedProducts: ["runc 1.1.x (before 1.1.12)"],
    publishedDate: "2024-02-14",
    exploitAvailable: true,
  },
  {
    id: "CVE-2024-9464",
    cvss: 7.1,
    severity: "high",
    description:
      "Palo Alto Networks Expedition SQL injection allowing admin account disclosure and data exfiltration.",
    affectedProducts: ["Expedition 1.2.x"],
    publishedDate: "2024-10-09",
    exploitAvailable: false,
  },
  {
    id: "CVE-2024-10220",
    cvss: 6.5,
    severity: "medium",
    description:
      "Kubernetes ingress-nginx path traversal allowing unauthenticated access to arbitrary files on the controller.",
    affectedProducts: ["ingress-nginx 1.0-1.11"],
    publishedDate: "2024-10-28",
    exploitAvailable: false,
  },
];

// ═══════════════════════════════════════════════════════════════════
// USERS (8+)
// ═══════════════════════════════════════════════════════════════════

export const mockUsers: User[] = [
  {
    id: "usr-001",
    name: "Alex Chen",
    email: "admin@vulnguard.com",
    role: "admin",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T09:15:00Z",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "usr-002",
    name: "Sarah Mitchell",
    email: "analyst@vulnguard.com",
    role: "analyst",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T08:30:00Z",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "usr-003",
    name: "James Rodriguez",
    email: "user@vulnguard.com",
    role: "user",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-04T16:45:00Z",
    createdAt: "2024-06-10T14:00:00Z",
  },
  {
    id: "usr-004",
    name: "Priya Sharma",
    email: "priya.sharma@vulnguard.com",
    role: "analyst",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T07:00:00Z",
    createdAt: "2024-02-28T09:30:00Z",
  },
  {
    id: "usr-005",
    name: "Michael Torres",
    email: "michael.t@vulnguard.com",
    role: "user",
    avatar: "",
    status: "inactive",
    lastLogin: "2025-05-20T11:00:00Z",
    createdAt: "2024-04-12T12:00:00Z",
  },
  {
    id: "usr-006",
    name: "Emily Watson",
    email: "emily.w@vulnguard.com",
    role: "analyst",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-04T14:20:00Z",
    createdAt: "2024-07-05T08:45:00Z",
  },
  {
    id: "usr-007",
    name: "David Kim",
    email: "david.kim@vulnguard.com",
    role: "user",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-03T10:30:00Z",
    createdAt: "2024-08-18T15:00:00Z",
  },
  {
    id: "usr-008",
    name: "Lisa Nguyen",
    email: "lisa.n@vulnguard.com",
    role: "admin",
    avatar: "",
    status: "active",
    lastLogin: "2025-06-05T06:45:00Z",
    createdAt: "2024-01-15T08:30:00Z",
  },
];

// ═══════════════════════════════════════════════════════════════════
// SCAN HISTORY (10+)
// ═══════════════════════════════════════════════════════════════════

export const scanHistory: ScanResult[] = [
  {
    id: "scan-001",
    target: "192.168.1.0/24",
    type: "full",
    status: "completed",
    progress: 100,
    startedAt: "2025-06-01T08:00:00Z",
    completedAt: "2025-06-01T08:45:00Z",
    vulnerabilities: vulnerabilities.slice(0, 12),
    riskScore: 82,
  },
  {
    id: "scan-002",
    target: "webapp-prod.corp.local",
    type: "quick",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-30T10:30:00Z",
    completedAt: "2025-05-30T10:38:00Z",
    vulnerabilities: vulnerabilities.slice(0, 5),
    riskScore: 91,
  },
  {
    id: "scan-003",
    target: "10.0.0.0/16",
    type: "full",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-28T06:00:00Z",
    completedAt: "2025-05-28T07:15:00Z",
    vulnerabilities: vulnerabilities.slice(5, 18),
    riskScore: 74,
  },
  {
    id: "scan-004",
    target: "api.corp.local",
    type: "custom",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-25T14:00:00Z",
    completedAt: "2025-05-25T14:12:00Z",
    vulnerabilities: vulnerabilities.slice(12, 20),
    riskScore: 68,
  },
  {
    id: "scan-005",
    target: "dbserver.corp.local",
    type: "quick",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-22T09:00:00Z",
    completedAt: "2025-05-22T09:08:00Z",
    vulnerabilities: vulnerabilities.slice(20, 25),
    riskScore: 55,
  },
  {
    id: "scan-006",
    target: "bastion.corp.local",
    type: "quick",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-20T11:00:00Z",
    completedAt: "2025-05-20T11:07:00Z",
    vulnerabilities: vulnerabilities.slice(15, 19),
    riskScore: 62,
  },
  {
    id: "scan-007",
    target: "203.0.113.0/24",
    type: "full",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-18T08:00:00Z",
    completedAt: "2025-05-18T09:00:00Z",
    vulnerabilities: vulnerabilities.slice(0, 10),
    riskScore: 88,
  },
  {
    id: "scan-008",
    target: "secure.corp.local",
    type: "custom",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-15T13:30:00Z",
    completedAt: "2025-05-15T13:42:00Z",
    vulnerabilities: vulnerabilities.slice(8, 16),
    riskScore: 76,
  },
  {
    id: "scan-009",
    target: "cms.corp.local",
    type: "quick",
    status: "failed",
    progress: 45,
    startedAt: "2025-05-12T16:00:00Z",
    vulnerabilities: [],
    riskScore: 0,
  },
  {
    id: "scan-010",
    target: "payments.corp.local",
    type: "full",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-10T07:00:00Z",
    completedAt: "2025-05-10T07:50:00Z",
    vulnerabilities: vulnerabilities.slice(25, 35),
    riskScore: 79,
  },
  {
    id: "scan-011",
    target: "dns1.corp.local",
    type: "quick",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-08T10:00:00Z",
    completedAt: "2025-05-08T10:06:00Z",
    vulnerabilities: vulnerabilities.slice(20, 23),
    riskScore: 71,
  },
  {
    id: "scan-012",
    target: "git.corp.local",
    type: "custom",
    status: "completed",
    progress: 100,
    startedAt: "2025-05-05T15:00:00Z",
    completedAt: "2025-05-05T15:15:00Z",
    vulnerabilities: vulnerabilities.slice(28, 35),
    riskScore: 85,
  },
];

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS (6+)
// ═══════════════════════════════════════════════════════════════════

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    type: "critical_finding",
    title: "Critical SQL Injection Detected",
    message:
      "A critical SQL injection vulnerability was found in the login endpoint of webapp-prod.corp.local. Immediate remediation is required.",
    timestamp: "2025-06-05T10:30:00Z",
    read: false,
  },
  {
    id: "notif-002",
    type: "scan_complete",
    title: "Full Network Scan Completed",
    message:
      "The full network scan targeting 192.168.1.0/24 has completed. 12 vulnerabilities were identified with an overall risk score of 82.",
    timestamp: "2025-06-05T08:45:00Z",
    read: false,
  },
  {
    id: "notif-003",
    type: "report_ready",
    title: "Compliance Report Generated",
    message:
      "The OWASP Top 10 compliance report for the Q2 2025 assessment period is now available for download.",
    timestamp: "2025-06-04T16:00:00Z",
    read: true,
  },
  {
    id: "notif-004",
    type: "user_activity",
    title: "New User Registered",
    message:
      "A new user account has been created for david.kim@vulnguard.com with standard user permissions.",
    timestamp: "2025-06-04T10:15:00Z",
    read: true,
  },
  {
    id: "notif-005",
    type: "critical_finding",
    title: "Exposed Admin Panel Detected",
    message:
      "An unauthenticated admin panel was found on admin.corp.local:9090. This represents a critical security risk requiring immediate attention.",
    timestamp: "2025-06-03T14:20:00Z",
    read: false,
  },
  {
    id: "notif-006",
    type: "scan_complete",
    title: "Quick Scan Completed",
    message:
      "The quick scan of webapp-prod.corp.local has completed with 5 findings. Risk score: 91 (Critical).",
    timestamp: "2025-06-02T09:30:00Z",
    read: true,
  },
  {
    id: "notif-007",
    type: "report_ready",
    title: "Executive Summary Report Ready",
    message:
      "The monthly executive security summary for May 2025 has been generated and is available for review.",
    timestamp: "2025-06-01T08:00:00Z",
    read: true,
  },
];

// ═══════════════════════════════════════════════════════════════════
// THREAT INTELLIGENCE DATA
// ═══════════════════════════════════════════════════════════════════

export const threatCategories = [
  { category: "Ransomware", count: 48, trend: "up" as const },
  { category: "Phishing", count: 156, trend: "up" as const },
  { category: "Zero-Day Exploits", count: 12, trend: "up" as const },
  { category: "Supply Chain", count: 23, trend: "up" as const },
  { category: "Insider Threat", count: 8, trend: "stable" as const },
  { category: "DDoS", count: 34, trend: "down" as const },
  { category: "Malware", count: 89, trend: "stable" as const },
  { category: "APT Groups", count: 15, trend: "up" as const },
  { category: "Cryptojacking", count: 19, trend: "down" as const },
  { category: "Social Engineering", count: 67, trend: "up" as const },
];

export const threatTrends = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (11 - i));
  const monthStr = date.toLocaleDateString("en-US", { month: "short" });
  return {
    month: monthStr,
    ransomware: Math.floor(30 + i * 2 + Math.random() * 10),
    phishing: Math.floor(100 + i * 8 + Math.random() * 20),
    malware: Math.floor(70 + Math.sin(i * 0.5) * 15 + Math.random() * 10),
    apt: Math.floor(10 + i * 0.8 + Math.random() * 5),
  };
});

export const threatNewsItems = [
  {
    id: "news-001",
    title: "New Ransomware Group 'BlackVault' Targets Healthcare Sector",
    summary:
      "A newly identified ransomware group dubbed BlackVault has been targeting healthcare organizations across North America and Europe, utilizing double-extortion tactics and demanding payments in Monero.",
    source: "CERT Advisory",
    date: "2025-06-05",
    severity: "critical" as const,
  },
  {
    id: "news-002",
    title: "Critical Zero-Day in Popular VPN Appliance Under Active Exploit",
    summary:
      "A critical unauthenticated RCE vulnerability in a widely-deployed VPN appliance is being actively exploited in the wild. Vendors have released emergency patches and urge immediate deployment.",
    source: "NIST NVD",
    date: "2025-06-04",
    severity: "critical" as const,
  },
  {
    id: "news-003",
    title: "Supply Chain Attack Discovered in NPM Package with 2M+ Downloads",
    summary:
      "A malicious version of a popular NPM package was discovered containing a credential-stealing payload. The package had been downloaded over 2 million times before detection and removal.",
    source: "SANS ISC",
    date: "2025-06-03",
    severity: "high" as const,
  },
  {
    id: "news-004",
    title: "AI-Powered Phishing Campaigns Show 300% Increase in Success Rate",
    summary:
      "Security researchers report a dramatic increase in the effectiveness of phishing campaigns leveraging large language models to craft highly convincing and personalized lure messages.",
    source: "Dark Reading",
    date: "2025-06-02",
    severity: "high" as const,
  },
  {
    id: "news-005",
    title: "Nation-State APT 'Ember Panda' Exploits New VMware ESXi Flaw",
    summary:
      "Chinese-linked APT group Ember Panda has been observed exploiting a newly disclosed VMware ESXi vulnerability to gain initial access to enterprise environments across multiple sectors.",
    source: "Mandiant",
    date: "2025-06-01",
    severity: "high" as const,
  },
  {
    id: "news-006",
    title: "New Regulations Mandate 72-Hour Vulnerability Disclosure for Critical Infrastructure",
    summary:
      "The FCC has issued new rules requiring critical infrastructure operators to disclose exploitation of known vulnerabilities within 72 hours of discovery, with penalties for non-compliance.",
    source: "CISA",
    date: "2025-05-30",
    severity: "medium" as const,
  },
];

export const iocData = [
  {
    id: "ioc-001",
    type: "IP Address" as const,
    value: "185.220.101.34",
    threat: "C2 Server",
    severity: "critical" as const,
    source: "Threat Feed Alpha",
    firstSeen: "2025-05-10",
  },
  {
    id: "ioc-002",
    type: "Domain" as const,
    value: "malware-cdn.evil-domain.xyz",
    threat: "Malware Distribution",
    severity: "critical" as const,
    source: "OSINT Intel",
    firstSeen: "2025-05-11",
  },
  {
    id: "ioc-003",
    type: "File Hash" as const,
    value: "a3f2b8c9d4e5f6a7b8c9d0e1f2a3b4c5",
    threat: "RAT Payload",
    severity: "high" as const,
    source: "Sandbox Analysis",
    firstSeen: "2025-05-12",
  },
  {
    id: "ioc-004",
    type: "IP Address" as const,
    value: "91.234.12.45",
    threat: "Brute Force Origin",
    severity: "high" as const,
    source: "Honeypot Network",
    firstSeen: "2025-05-13",
  },
  {
    id: "ioc-005",
    type: "Domain" as const,
    value: "phish-login.secure-bank-verify.com",
    threat: "Phishing Kit",
    severity: "critical" as const,
    source: "CERT Advisory",
    firstSeen: "2025-05-14",
  },
  {
    id: "ioc-006",
    type: "File Hash" as const,
    value: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    threat: "Ransomware Binary",
    severity: "critical" as const,
    source: "Malware Zoo",
    firstSeen: "2025-05-15",
  },
  {
    id: "ioc-007",
    type: "IP Address" as const,
    value: "103.75.201.89",
    threat: "Tor Exit Node",
    severity: "medium" as const,
    source: "Tor Directory",
    firstSeen: "2025-05-15",
  },
  {
    id: "ioc-008",
    type: "Domain" as const,
    value: "update-service.malware-cdn.net",
    threat: "Backdoor C2",
    severity: "high" as const,
    source: "DNS Monitoring",
    firstSeen: "2025-05-14",
  },
];

// ═══════════════════════════════════════════════════════════════════
// COMPLIANCE DATA
// ═══════════════════════════════════════════════════════════════════

export const complianceData = [
  {
    framework: "OWASP Top 10 2021",
    score: 72,
    totalChecks: 10,
    passedChecks: 7,
    status: "warning" as const,
    categories: [
      { name: "A01 - Broken Access Control", score: 60, status: "fail" as const },
      { name: "A02 - Cryptographic Failures", score: 55, status: "fail" as const },
      { name: "A03 - Injection", score: 40, status: "fail" as const },
      { name: "A04 - Insecure Design", score: 75, status: "warning" as const },
      { name: "A05 - Security Misconfiguration", score: 65, status: "warning" as const },
      { name: "A06 - Vulnerable Components", score: 50, status: "fail" as const },
      { name: "A07 - Auth Failures", score: 70, status: "warning" as const },
      { name: "A08 - Software/Data Integrity", score: 85, status: "pass" as const },
      { name: "A09 - Logging Failures", score: 90, status: "pass" as const },
      { name: "A10 - SSRF", score: 80, status: "pass" as const },
    ],
  },
  {
    framework: "NIST CSF 2.0",
    score: 68,
    totalChecks: 108,
    passedChecks: 74,
    status: "warning" as const,
    categories: [
      { name: "Govern (GV)", score: 75, status: "warning" as const },
      { name: "Identify (ID)", score: 80, status: "pass" as const },
      { name: "Protect (PR)", score: 65, status: "warning" as const },
      { name: "Detect (DE)", score: 60, status: "warning" as const },
      { name: "Respond (RS)", score: 55, status: "fail" as const },
      { name: "Recover (RC)", score: 70, status: "warning" as const },
    ],
  },
  {
    framework: "CIS Controls v8",
    score: 81,
    totalChecks: 153,
    passedChecks: 124,
    status: "good" as const,
    categories: [
      { name: "Basic Controls (1-6)", score: 88, status: "pass" as const },
      { name: "Foundational Controls (7-16)", score: 78, status: "warning" as const },
      { name: "Organizational Controls (17-18)", score: 72, status: "warning" as const },
    ],
  },
  {
    framework: "ISO 27001:2022",
    score: 74,
    totalChecks: 114,
    passedChecks: 84,
    status: "warning" as const,
    categories: [
      { name: "Organizational (5-8)", score: 82, status: "pass" as const },
      { name: "People (6.1-6.8)", score: 70, status: "warning" as const },
      { name: "Physical (7.1-7.14)", score: 90, status: "pass" as const },
      { name: "Technological (8.1-8.25)", score: 58, status: "fail" as const },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD KPI DATA
// ═══════════════════════════════════════════════════════════════════

export const kpiData = {
  totalVulnerabilities: 287,
  totalTrend: -15,
  criticalIssues: 22,
  criticalTrend: -4,
  riskScore: 76,
  systemsScanned: 168,
  systemsTrend: 12,
  openIssues: 134,
  resolvedIssues: 98,
  acceptedRisks: 55,
};

export const severityDistribution = [
  { name: "Critical", value: 22, color: "#ef4444" },
  { name: "High", value: 58, color: "#f97316" },
  { name: "Medium", value: 95, color: "#eab308" },
  { name: "Low", value: 89, color: "#22c55e" },
  { name: "Info", value: 23, color: "#3b82f6" },
];

export const vulnerabilityTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    date: dateStr,
    critical: Math.max(0, Math.floor(18 + Math.sin(i * 0.3) * 6 + Math.random() * 4)),
    high: Math.max(0, Math.floor(50 + Math.cos(i * 0.2) * 12 + Math.random() * 6)),
    medium: Math.max(0, Math.floor(85 + Math.sin(i * 0.4) * 18 + Math.random() * 10)),
    low: Math.max(0, Math.floor(75 + Math.cos(i * 0.15) * 12 + Math.random() * 8)),
  };
});

export const attackSurfaceData = [
  { category: "Web Apps", count: 78, percentage: 27 },
  { category: "APIs", count: 52, percentage: 18 },
  { category: "Network", count: 43, percentage: 15 },
  { category: "Cloud", count: 40, percentage: 14 },
  { category: "Mobile", count: 32, percentage: 11 },
  { category: "IoT", count: 25, percentage: 9 },
  { category: "Other", count: 17, percentage: 6 },
];

// ═══════════════════════════════════════════════════════════════════
// BACKWARD-COMPATIBLE EXPORTS (for existing ThreatScope components)
// ═══════════════════════════════════════════════════════════════════

// Alias for severityDistribution (used by threatscope dashboard)
export const threatDistribution = severityDistribution;

// Backward-compatible CVE feed data format (used by threatscope threat-intel)
export const cveFeedData = cveEntries.map((cve) => ({
  id: cve.id,
  severity: cve.severity as "critical" | "high" | "medium" | "low",
  cvss: cve.cvss,
  description: cve.description,
  affectedProducts: cve.affectedProducts,
  publishedDate: cve.publishedDate,
}));

// Attack vectors for threatscope threat-intel
export const attackVectors = [
  { name: "Network", value: 58, color: "#ef4444" },
  { name: "Local", value: 28, color: "#f97316" },
  { name: "Physical", value: 14, color: "#eab308" },
];

// Simulated scan findings for threatscope scanner
export const simulatedScanFindings = [
  {
    title: "Open SSH Port (22)",
    severity: "medium" as const,
    description: "SSH service is exposed on port 22 with password authentication enabled",
    port: "22",
    service: "SSH",
  },
  {
    title: "Outdated TLS 1.0",
    severity: "high" as const,
    description: "Server supports deprecated TLS 1.0 protocol vulnerable to POODLE attack",
    port: "443",
    service: "HTTPS",
  },
  {
    title: "SQL Injection - Login Form",
    severity: "critical" as const,
    description: "Authentication bypass via SQL injection in /api/auth/login endpoint",
    port: "8080",
    service: "HTTP",
  },
  {
    title: "XSS Reflected - Search",
    severity: "high" as const,
    description: "Reflected XSS vulnerability in search parameter of /search endpoint",
    port: "8080",
    service: "HTTP",
  },
  {
    title: "Missing Security Headers",
    severity: "low" as const,
    description: "Missing X-Content-Type-Options, X-Frame-Options, and CSP headers",
    port: "443",
    service: "HTTPS",
  },
  {
    title: "Weak Cipher Suite",
    severity: "medium" as const,
    description: "Server supports weak cipher suites RC4-SHA and DES-CBC3-SHA",
    port: "443",
    service: "HTTPS",
  },
  {
    title: "Directory Traversal",
    severity: "critical" as const,
    description: "Path traversal vulnerability allowing access to /etc/passwd via /api/files endpoint",
    port: "8080",
    service: "HTTP",
  },
  {
    title: "Default Credentials",
    severity: "critical" as const,
    description: "Admin panel accessible with default credentials admin:admin on port 9090",
    port: "9090",
    service: "HTTP-ALT",
  },
  {
    title: "Information Disclosure",
    severity: "medium" as const,
    description: "Server version disclosure in HTTP response headers and error pages",
    port: "8080",
    service: "HTTP",
  },
  {
    title: "CSRF Token Missing",
    severity: "medium" as const,
    description: "CSRF protection not implemented on state-changing endpoints",
    port: "8080",
    service: "HTTP",
  },
  {
    title: "Insecure Cookie Flags",
    severity: "low" as const,
    description: "Session cookies missing Secure and HttpOnly flags",
    port: "443",
    service: "HTTPS",
  },
  {
    title: "Unrestricted File Upload",
    severity: "high" as const,
    description: "File upload endpoint does not validate file type, allowing PHP/JSP upload",
    port: "8080",
    service: "HTTP",
  },
];

// Remediation matrix for threatscope risk-assessment
export const remediationMatrix = [
  { id: "vuln-001", title: "SQL Injection", impact: 5, likelihood: 4, severity: "critical" as const },
  { id: "vuln-002", title: "Reflected XSS", impact: 4, likelihood: 4, severity: "high" as const },
  { id: "vuln-003", title: "Stored XSS", impact: 4, likelihood: 5, severity: "high" as const },
  { id: "vuln-008", title: "Directory Traversal", impact: 5, likelihood: 3, severity: "critical" as const },
  { id: "vuln-014", title: "Exposed Admin Panel", impact: 5, likelihood: 5, severity: "critical" as const },
  { id: "vuln-012", title: "Weak SSL/TLS", impact: 4, likelihood: 3, severity: "high" as const },
  { id: "vuln-024", title: "XXE Injection", impact: 3, likelihood: 3, severity: "high" as const },
  { id: "vuln-025", title: "SSRF", impact: 4, likelihood: 2, severity: "high" as const },
  { id: "vuln-011", title: "Missing Headers", impact: 2, likelihood: 2, severity: "medium" as const },
  { id: "vuln-018", title: "Version Disclosure", impact: 1, likelihood: 3, severity: "low" as const },
  { id: "vuln-013", title: "Insecure Cookies", impact: 2, likelihood: 3, severity: "medium" as const },
  { id: "vuln-007", title: "Clickjacking", impact: 2, likelihood: 2, severity: "medium" as const },
];

// Risk trend for threatscope risk-assessment
export const riskTrend = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (11 - i));
  const monthStr = date.toLocaleDateString("en-US", { month: "short" });
  return {
    month: monthStr,
    score: Math.floor(60 + Math.sin(i * 0.5) * 15 + Math.random() * 5),
  };
});
