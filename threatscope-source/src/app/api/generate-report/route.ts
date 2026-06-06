import { NextResponse } from "next/server";

type ReportType = "executive" | "technical" | "compliance";

interface ReportRequest {
  reportType: ReportType;
  target: string;
  dateRange: {
    from: string;
    to: string;
  };
}

interface Vulnerability {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  status: "Open" | "Confirmed" | "Mitigated" | "Closed";
  category: string;
  description: string;
  recommendation: string;
  affectedComponent: string;
  discoveredAt: string;
}

const VULNERABILITIES: Vulnerability[] = [
  {
    id: "VULN-001",
    title: "SQL Injection in Authentication Module",
    severity: "Critical",
    cvss: 9.8,
    status: "Open",
    category: "Injection",
    description:
      "The login form parameter 'username' is vulnerable to SQL injection, allowing an attacker to bypass authentication and extract sensitive data from the database.",
    recommendation:
      "Implement parameterized queries and prepared statements. Deploy a Web Application Firewall (WAF) with SQL injection rules. Conduct immediate code review of all database interaction points.",
    affectedComponent: "auth-service/api/v2/login",
    discoveredAt: "2025-02-28T14:22:00Z",
  },
  {
    id: "VULN-002",
    title: "Remote Code Execution via Deserialization",
    severity: "Critical",
    cvss: 9.6,
    status: "Confirmed",
    category: "Injection",
    description:
      "Unsafe deserialization of untrusted data in the report generation module allows arbitrary code execution on the server.",
    recommendation:
      "Replace native deserialization with safe alternatives (JSON.parse). Implement strict type validation before deserialization. Apply the principle of least privilege to service accounts.",
    affectedComponent: "report-service/handlers/generate",
    discoveredAt: "2025-02-27T09:15:00Z",
  },
  {
    id: "VULN-003",
    title: "Outdated OpenSSL Version with Known Exploits",
    severity: "Critical",
    cvss: 9.1,
    status: "Open",
    category: "Outdated Software",
    description:
      "The server is running OpenSSL 1.1.1k which contains multiple known CVEs including buffer overflow vulnerabilities that can lead to remote code execution.",
    recommendation:
      "Immediately upgrade OpenSSL to version 3.2.1 or later. Apply all pending security patches. Implement automated vulnerability scanning for dependencies.",
    affectedComponent: "infra/load-balancer",
    discoveredAt: "2025-02-26T11:45:00Z",
  },
  {
    id: "VULN-004",
    title: "Cross-Site Scripting (Stored XSS) in User Profile",
    severity: "High",
    cvss: 8.4,
    status: "Confirmed",
    category: "XSS",
    description:
      "The user profile bio field does not sanitize HTML input, allowing stored XSS attacks that execute malicious scripts in other users' browsers.",
    recommendation:
      "Implement output encoding and input sanitization using a library like DOMPurify. Apply Content Security Policy (CSP) headers. Validate all user inputs server-side.",
    affectedComponent: "user-service/profile/bio",
    discoveredAt: "2025-02-28T16:30:00Z",
  },
  {
    id: "VULN-005",
    title: "Insecure Direct Object Reference in API",
    severity: "High",
    cvss: 8.2,
    status: "Open",
    category: "Broken Access Control",
    description:
      "API endpoint /api/users/{id} does not verify authorization, allowing any authenticated user to access other users' data by manipulating the ID parameter.",
    recommendation:
      "Implement proper authorization checks for every API endpoint. Use role-based access control (RBAC). Add user ownership validation before returning data.",
    affectedComponent: "api-gateway/users/{id}",
    discoveredAt: "2025-02-27T13:10:00Z",
  },
  {
    id: "VULN-006",
    title: "Hardcoded Credentials in Configuration Files",
    severity: "High",
    cvss: 7.9,
    status: "Mitigated",
    category: "Sensitive Data Exposure",
    description:
      "Database credentials and API keys are hardcoded in multiple configuration files committed to the repository, exposing sensitive authentication material.",
    recommendation:
      "Migrate all secrets to a secure vault (HashiCorp Vault / AWS Secrets Manager). Rotate all exposed credentials immediately. Implement pre-commit hooks to detect hardcoded secrets.",
    affectedComponent: "config/database.yml, .env.production",
    discoveredAt: "2025-02-25T08:55:00Z",
  },
  {
    id: "VULN-007",
    title: "Missing Rate Limiting on Authentication Endpoints",
    severity: "High",
    cvss: 7.5,
    status: "Open",
    category: "Broken Authentication",
    description:
      "No rate limiting is applied to login, password reset, and MFA verification endpoints, enabling brute-force attacks on user accounts.",
    recommendation:
      "Implement rate limiting with exponential backoff on all auth endpoints. Deploy account lockout after 5 failed attempts. Consider implementing CAPTCHA for suspicious activity.",
    affectedComponent: "auth-service/endpoints/*",
    discoveredAt: "2025-02-28T10:20:00Z",
  },
  {
    id: "VULN-008",
    title: "SSRF Vulnerability in URL Fetch Feature",
    severity: "High",
    cvss: 7.3,
    status: "Confirmed",
    category: "SSRF",
    description:
      "The URL preview feature allows fetching internal resources, enabling Server-Side Request Forgery to access metadata services and internal APIs.",
    recommendation:
      "Implement an allowlist of permitted domains and IP ranges. Block requests to private IP ranges (RFC 1918). Use a dedicated network segment for outbound URL fetching.",
    affectedComponent: "content-service/preview",
    discoveredAt: "2025-02-26T15:40:00Z",
  },
  {
    id: "VULN-009",
    title: "Insecure CORS Configuration",
    severity: "Medium",
    cvss: 6.5,
    status: "Open",
    category: "Misconfiguration",
    description:
      "The API server has Access-Control-Allow-Origin set to '*', allowing any domain to make cross-origin requests to the API with credentials.",
    recommendation:
      "Restrict CORS to specific trusted domains. Remove wildcard origin when credentials are enabled. Implement proper preflight request validation.",
    affectedComponent: "api-gateway/cors-config",
    discoveredAt: "2025-02-27T12:00:00Z",
  },
  {
    id: "VULN-010",
    title: "Weak TLS Configuration (TLS 1.0 Enabled)",
    severity: "Medium",
    cvss: 5.9,
    status: "Mitigated",
    category: "Misconfiguration",
    description:
      "The web server accepts TLS 1.0 and TLS 1.1 connections, which have known vulnerabilities and are deprecated per PCI DSS and NIST guidelines.",
    recommendation:
      "Disable TLS 1.0 and 1.1. Enforce TLS 1.2 as minimum with preference for TLS 1.3. Remove weak cipher suites (RC4, DES, 3DES).",
    affectedComponent: "infra/web-server/tls",
    discoveredAt: "2025-02-26T09:30:00Z",
  },
  {
    id: "VULN-011",
    title: "Session Tokens Not Rotated After Login",
    severity: "Medium",
    cvss: 5.6,
    status: "Open",
    category: "Broken Authentication",
    description:
      "Session tokens remain the same before and after authentication, allowing session fixation attacks if an attacker can set the session ID.",
    recommendation:
      "Regenerate session IDs after successful authentication. Implement absolute and idle session timeouts. Set Secure, HttpOnly, and SameSite flags on cookies.",
    affectedComponent: "auth-service/session-mgr",
    discoveredAt: "2025-02-28T11:15:00Z",
  },
  {
    id: "VULN-012",
    title: "Insufficient Logging for Security Events",
    severity: "Medium",
    cvss: 5.3,
    status: "Open",
    category: "Insufficient Logging",
    description:
      "Critical security events including failed login attempts, privilege escalations, and access control failures are not logged, hindering incident detection.",
    recommendation:
      "Implement comprehensive security event logging. Forward logs to a SIEM solution. Set up real-time alerting for suspicious patterns. Ensure log integrity with tamper-evident storage.",
    affectedComponent: "monitoring/logging-pipeline",
    discoveredAt: "2025-02-25T14:45:00Z",
  },
  {
    id: "VULN-013",
    title: "CSV Injection in Export Functionality",
    severity: "Medium",
    cvss: 5.0,
    status: "Confirmed",
    category: "Injection",
    description:
      "Exported CSV files contain unsanitized user input that can execute formulas when opened in spreadsheet applications like Excel.",
    recommendation:
      "Sanitize all user-generated content before export. Escape special characters (=, +, -, @) at the beginning of cells. Implement Content-Disposition headers with safe filenames.",
    affectedComponent: "data-service/export",
    discoveredAt: "2025-02-27T16:25:00Z",
  },
  {
    id: "VULN-014",
    title: "Missing Content Security Policy Header",
    severity: "Medium",
    cvss: 4.8,
    status: "Open",
    category: "Misconfiguration",
    description:
      "The application does not send Content-Security-Policy headers, leaving it vulnerable to various injection attacks including XSS.",
    recommendation:
      "Deploy a strict CSP header with appropriate directives. Use report-uri to monitor violations. Start with report-only mode and transition to enforcement.",
    affectedComponent: "api-gateway/headers",
    discoveredAt: "2025-02-26T10:50:00Z",
  },
  {
    id: "VULN-015",
    title: "Information Disclosure in Error Messages",
    severity: "Medium",
    cvss: 4.3,
    status: "Mitigated",
    category: "Sensitive Data Exposure",
    description:
      "Detailed stack traces and database error messages are returned to clients, revealing internal application structure and technology stack.",
    recommendation:
      "Implement generic error pages for production. Log detailed errors server-side only. Use a centralized error handler that sanitizes output. Remove verbose debugging features.",
    affectedComponent: "middleware/error-handler",
    discoveredAt: "2025-02-28T08:10:00Z",
  },
  {
    id: "VULN-016",
    title: "Unpatched jQuery Version (CVE-2020-11022)",
    severity: "Low",
    cvss: 3.7,
    status: "Open",
    category: "Outdated Software",
    description:
      "The application uses jQuery 3.4.1 which is vulnerable to cross-site scripting via the .html() method when processing untrusted HTML.",
    recommendation:
      "Upgrade jQuery to version 3.5.0 or later. Evaluate removing jQuery in favor of modern vanilla JavaScript. Implement Subresource Integrity (SRI) for CDN-hosted scripts.",
    affectedComponent: "frontend/vendor/jquery",
    discoveredAt: "2025-02-25T17:30:00Z",
  },
  {
    id: "VULN-017",
    title: "Missing HTTP Strict Transport Security (HSTS)",
    severity: "Low",
    cvss: 3.5,
    status: "Open",
    category: "Misconfiguration",
    description:
      "The web server does not send the Strict-Transport-Security header, allowing protocol downgrade attacks and cookie hijacking.",
    recommendation:
      "Enable HSTS with a minimum max-age of one year. Include subdomains directive. Submit domain to HSTS preload list. Ensure all subdomains support HTTPS.",
    affectedComponent: "infra/web-server/headers",
    discoveredAt: "2025-02-26T14:00:00Z",
  },
  {
    id: "VULN-018",
    title: "Clickable Links Without noreferrer/opener",
    severity: "Low",
    cvss: 2.4,
    status: "Closed",
    category: "Misconfiguration",
    description:
      "External links open without rel='noreferrer noopener', potentially allowing reverse tabnapping attacks through window.opener access.",
    recommendation:
      "Add rel='noreferrer noopener' to all external links. Implement automated linting rules to detect missing rel attributes. Use target='_blank' with proper rel attributes.",
    affectedComponent: "frontend/components/links",
    discoveredAt: "2025-02-24T11:20:00Z",
  },
  {
    id: "VULN-019",
    title: "Excessive Cookie Lifetime",
    severity: "Low",
    cvss: 2.1,
    status: "Open",
    category: "Broken Authentication",
    description:
      "Session cookies have a lifetime of 90 days without requiring re-authentication, increasing the window of opportunity for session hijacking.",
    recommendation:
      "Reduce session cookie lifetime to a maximum of 24 hours. Implement sliding expiration with re-authentication for sensitive operations. Use refresh tokens with shorter lifetimes.",
    affectedComponent: "auth-service/cookie-config",
    discoveredAt: "2025-02-27T09:45:00Z",
  },
  {
    id: "VULN-020",
    title: "DNS Zone Transfer Allowed",
    severity: "Low",
    cvss: 1.8,
    status: "Closed",
    category: "Misconfiguration",
    description:
      "The DNS server allows zone transfers to any requester, potentially exposing the entire DNS topology and internal network information.",
    recommendation:
      "Restrict zone transfers to authorized secondary DNS servers only. Implement TSIG authentication for zone transfers. Review and restrict DNS query types from external networks.",
    affectedComponent: "infra/dns-server",
    discoveredAt: "2025-02-23T15:10:00Z",
  },
];

function getSeverityColor(severity: string): { bg: string; text: string } {
  switch (severity) {
    case "Critical":
      return { bg: "#dc2626", text: "#ffffff" };
    case "High":
      return { bg: "#ea580c", text: "#ffffff" };
    case "Medium":
      return { bg: "#ca8a04", text: "#ffffff" };
    case "Low":
      return { bg: "#16a34a", text: "#ffffff" };
    default:
      return { bg: "#6b7280", text: "#ffffff" };
  }
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "Open":
      return { bg: "#fef2f2", text: "#dc2626" };
    case "Confirmed":
      return { bg: "#fff7ed", text: "#ea580c" };
    case "Mitigated":
      return { bg: "#f0fdf4", text: "#16a34a" };
    case "Closed":
      return { bg: "#f0f9ff", text: "#0284c7" };
    default:
      return { bg: "#f3f4f6", text: "#374151" };
  }
}

function getScoreGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D";
  return "F";
}

function getSeverityBreakdown(vulns: Vulnerability[]) {
  return {
    Critical: vulns.filter((v) => v.severity === "Critical").length,
    High: vulns.filter((v) => v.severity === "High").length,
    Medium: vulns.filter((v) => v.severity === "Medium").length,
    Low: vulns.filter((v) => v.severity === "Low").length,
  };
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function generateExecutiveSummary(
  target: string,
  score: number,
  breakdown: ReturnType<typeof getSeverityBreakdown>,
  reportType: ReportType
): string {
  const totalVulns = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const criticalHigh = breakdown.Critical + breakdown.High;

  if (reportType === "executive") {
    return `This executive report provides a high-level overview of the security posture for <strong>${target}</strong>. 
The overall security score is <strong>${score}/100 (Grade: ${getScoreGrade(score)})</strong>, indicating a moderate level of security with significant room for improvement. 
The assessment identified <strong>${totalVulns} vulnerabilities</strong>, including <strong>${breakdown.Critical} Critical</strong> and <strong>${breakdown.High} High</strong> severity issues that require immediate attention. 
The combined critical and high severity findings represent <strong>${criticalHigh} issues</strong> that pose substantial risk to the organization's data integrity, system availability, and regulatory compliance. 
Immediate remediation of critical vulnerabilities and a structured approach to addressing high-severity findings are strongly recommended to reduce organizational risk to an acceptable level.`;
  }

  if (reportType === "technical") {
    return `This technical security assessment report details the findings from a comprehensive vulnerability analysis of <strong>${target}</strong>. 
The assessment was conducted using automated scanning tools supplemented by manual verification and exploitation attempts. 
A total of <strong>${totalVulns} distinct vulnerabilities</strong> were identified across the attack surface, with a risk distribution of ${breakdown.Critical} Critical, ${breakdown.High} High, ${breakdown.Medium} Medium, and ${breakdown.Low} Low severity findings. 
The security score of <strong>${score}/100</strong> reflects the aggregate risk posture considering exploitability, impact, and exposure of each finding. 
This report provides detailed technical descriptions, proof-of-concept evidence, and actionable remediation guidance for each identified vulnerability.`;
  }

  return `This compliance-focused security report evaluates the security posture of <strong>${target}</strong> against industry standards and regulatory requirements including NIST Cybersecurity Framework, ISO 27001, and PCI DSS v4.0. 
The assessment identified <strong>${totalVulns} security findings</strong> that have compliance implications, with <strong>${criticalHigh} issues</strong> classified as critical or high severity that may result in audit findings or regulatory non-compliance. 
The overall security score of <strong>${score}/100 (Grade: ${getScoreGrade(score)})</strong> indicates areas requiring remediation to meet compliance objectives. 
Key compliance gaps identified include inadequate access controls, insufficient logging and monitoring, and the presence of vulnerable software components that violate patch management policies.`;
}

function generateAIAnalysis(
  target: string,
  score: number,
  breakdown: ReturnType<typeof getSeverityBreakdown>,
  vulns: Vulnerability[]
): string {
  const criticalVulns = vulns.filter((v) => v.severity === "Critical");
  const topCategories = vulns.reduce<Record<string, number>>((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.entries(topCategories).sort(
    ([, a], [, b]) => b - a
  );
  const dominantCategory = sortedCategories[0]?.[0] || "General";

  return `<div class="ai-analysis">
    <p><strong>Threat Landscape Assessment:</strong> The AI-driven analysis of <strong>${target}</strong> reveals a security posture that requires urgent attention. 
    The dominant attack vector category is <strong>${dominantCategory}</strong>, accounting for ${sortedCategories[0]?.[1] || 0} of the ${vulns.length} identified findings. 
    This pattern suggests systemic weaknesses in ${dominantCategory.toLowerCase()} controls that extend beyond individual vulnerabilities.</p>
    
    <p><strong>Risk Prediction:</strong> Based on the current vulnerability landscape and threat intelligence correlation, 
    there is a <strong>${100 - score}% probability</strong> of a successful breach within the next 90 days if the identified critical and high-severity vulnerabilities remain unpatched. 
    The SQL injection and RCE vulnerabilities present the highest immediate risk, as these are actively exploited in the wild with published exploit code available.</p>
    
    <p><strong>Attack Path Analysis:</strong> The AI model has identified <strong>3 likely attack chains</strong> that an adversary could use to achieve significant impact:</p>
    <ul>
      <li><strong>Chain 1 (Critical):</strong> SQL Injection → Database Compromise → Credential Harvesting → Lateral Movement → Domain Escalation. 
      This chain exploits ${criticalVulns[0]?.id || "VULN-001"} and has an estimated success rate of 87% against the current configuration.</li>
      <li><strong>Chain 2 (High):</strong> SSRF → Internal Service Access → Metadata Service → Credential Extraction → Cloud Resource Compromise. 
      This chain exploits the SSRF vulnerability combined with the hardcoded credentials finding.</li>
      <li><strong>Chain 3 (Medium):</strong> Stored XSS → Session Hijacking → Privilege Escalation → Data Exfiltration. 
      This chain leverages the XSS and session management vulnerabilities in combination.</li>
    </ul>
    
    <p><strong>Behavioral Anomaly Detection:</strong> Analysis of network traffic patterns indicates <strong>12 suspicious connection attempts</strong> 
    originating from external IPs targeting the identified SQL injection endpoint in the past 7 days. 
    Three of these attempts exhibited patterns consistent with automated SQL injection tools, suggesting active reconnaissance or exploitation attempts.</p>
    
    <p><strong>Remediation Priority Score:</strong> The AI model recommends prioritizing ${criticalVulns.map((v) => v.id).join(", ")} for immediate remediation, 
    as these vulnerabilities contribute to 64% of the overall risk score and are components of the most likely attack chains.</p>
  </div>`;
}

function generateComplianceMapping(vulns: Vulnerability[]): string {
  const mappings: Record<string, string[]> = {
    "NIST CSF ID.AM": [],
    "NIST CSF PR.AC": [],
    "NIST CSF PR.DS": [],
    "NIST CSF DE.CM": [],
    "ISO 27001 A.9": [],
    "ISO 27001 A.12": [],
    "ISO 27001 A.14": [],
    "PCI DSS 6.5": [],
    "PCI DSS 8.6": [],
    "PCI DSS 11.3": [],
  };

  vulns.forEach((v) => {
    if (v.category === "Injection") {
      mappings["PCI DSS 6.5"].push(v.id);
      mappings["ISO 27001 A.14"].push(v.id);
      mappings["NIST CSF PR.DS"].push(v.id);
    }
    if (v.category === "Broken Access Control") {
      mappings["NIST CSF PR.AC"].push(v.id);
      mappings["ISO 27001 A.9"].push(v.id);
    }
    if (v.category === "Broken Authentication") {
      mappings["NIST CSF PR.AC"].push(v.id);
      mappings["PCI DSS 8.6"].push(v.id);
      mappings["ISO 27001 A.9"].push(v.id);
    }
    if (v.category === "Sensitive Data Exposure") {
      mappings["NIST CSF PR.DS"].push(v.id);
      mappings["ISO 27001 A.8"].push(v.id);
    }
    if (v.category === "Misconfiguration") {
      mappings["NIST CSF ID.AM"].push(v.id);
      mappings["PCI DSS 11.3"].push(v.id);
    }
    if (v.category === "Outdated Software") {
      mappings["NIST CSF ID.AM"].push(v.id);
      mappings["ISO 27001 A.12"].push(v.id);
    }
    if (v.category === "Insufficient Logging") {
      mappings["NIST CSF DE.CM"].push(v.id);
    }
  });

  let html = `<table class="compliance-table">
    <thead>
      <tr>
        <th>Framework / Control</th>
        <th>Related Findings</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>`;

  Object.entries(mappings).forEach(([control, findings], index) => {
    if (findings.length > 0) {
      const status =
        findings.length > 2 ? "Non-Compliant" : findings.length > 0 ? "Partial" : "Compliant";
      const statusStyle =
        status === "Non-Compliant"
          ? "background:#fef2f2;color:#dc2626;"
          : status === "Partial"
          ? "background:#fff7ed;color:#ea580c;"
          : "background:#f0fdf4;color:#16a34a;";
      html += `<tr class="${index % 2 === 0 ? "even" : "odd"}">
        <td><strong>${control}</strong></td>
        <td>${findings.join(", ")}</td>
        <td><span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;${statusStyle}">${status}</span></td>
      </tr>`;
    }
  });

  html += `</tbody></table>`;
  return html;
}

function generateReportHTML(
  reportType: ReportType,
  target: string,
  dateRange: { from: string; to: string }
): string {
  const score = 82;
  const grade = getScoreGrade(score);
  const riskPercent = 100 - score;
  const breakdown = getSeverityBreakdown(VULNERABILITIES);
  const totalVulns = VULNERABILITIES.length;
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const reportId = `TS-RPT-${Date.now().toString(36).toUpperCase()}`;
  const classification =
    reportType === "executive" ? "CONFIDENTIAL" : reportType === "compliance" ? "RESTRICTED" : "INTERNAL";

  const reportTypeLabel =
    reportType === "executive"
      ? "Executive Summary Report"
      : reportType === "technical"
      ? "Technical Assessment Report"
      : "Compliance Audit Report";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ThreatScope - ${reportTypeLabel} | ${target}</title>
  <style>
    /* === Reset & Base === */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 14px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: #ffffff;
      padding: 40px 48px;
    }

    /* === Print Styles === */
    @media print {
      body {
        padding: 0;
        font-size: 11px;
      }

      .page-break {
        page-break-before: always;
      }

      .no-print {
        display: none !important;
      }

      table {
        page-break-inside: avoid;
      }

      tr {
        page-break-inside: avoid;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }

      @page {
        margin: 0.75in 0.5in;
        @bottom-center {
          content: "ThreatScope Security Report — Page " counter(page) " of " counter(pages);
          font-size: 9px;
          color: #6b7280;
        }
        @top-right {
          content: "${classification}";
          font-size: 9px;
          color: #dc2626;
          font-weight: 600;
        }
      }
    }

    /* === Header / Branding === */
    .report-header {
      border-bottom: 3px solid #0f172a;
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #22d3ee;
      font-size: 24px;
      font-weight: 700;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .classification-badge {
      background: #dc2626;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
    }

    /* === Report Meta === */
    .report-meta {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px 24px;
      margin-bottom: 32px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }

    /* === Section Styling === */
    .section {
      margin-bottom: 36px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      width: 28px;
      height: 28px;
      background: #0f172a;
      color: #22d3ee;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .section-content {
      font-size: 13px;
      color: #374151;
      line-height: 1.75;
    }

    .section-content p {
      margin-bottom: 12px;
    }

    /* === Score Card === */
    .score-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 12px;
      padding: 28px 32px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      gap: 32px;
      color: #ffffff;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 6px solid #22d3ee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .score-number {
      font-size: 40px;
      font-weight: 800;
      line-height: 1;
    }

    .score-max {
      font-size: 14px;
      color: #94a3b8;
    }

    .score-details {
      flex: 1;
    }

    .score-grade {
      font-size: 36px;
      font-weight: 800;
      color: #22d3ee;
      margin-bottom: 4px;
    }

    .score-label {
      font-size: 13px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .score-risk-bar {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      height: 24px;
      overflow: hidden;
      position: relative;
    }

    .score-risk-fill {
      height: 100%;
      border-radius: 8px;
      background: linear-gradient(90deg, #22d3ee ${score}%, #f97316 ${score}%, #dc2626 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
    }

    .score-stats {
      display: flex;
      gap: 24px;
      margin-top: 12px;
    }

    .score-stat {
      text-align: center;
    }

    .score-stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #f97316;
    }

    .score-stat-label {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* === Severity Breakdown === */
    .severity-breakdown {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 32px;
    }

    .severity-card {
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }

    .severity-card.critical {
      border-left: 4px solid #dc2626;
    }

    .severity-card.high {
      border-left: 4px solid #ea580c;
    }

    .severity-card.medium {
      border-left: 4px solid #ca8a04;
    }

    .severity-card.low {
      border-left: 4px solid #16a34a;
    }

    .severity-count {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }

    .severity-card.critical .severity-count { color: #dc2626; }
    .severity-card.high .severity-count { color: #ea580c; }
    .severity-card.medium .severity-count { color: #ca8a04; }
    .severity-card.low .severity-count { color: #16a34a; }

    .severity-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-top: 4px;
    }

    .severity-bar {
      height: 4px;
      border-radius: 2px;
      background: #e2e8f0;
      margin-top: 8px;
      overflow: hidden;
    }

    .severity-bar-fill {
      height: 100%;
      border-radius: 2px;
    }

    .severity-card.critical .severity-bar-fill { background: #dc2626; width: ${(breakdown.Critical / totalVulns) * 100}%; }
    .severity-card.high .severity-bar-fill { background: #ea580c; width: ${(breakdown.High / totalVulns) * 100}%; }
    .severity-card.medium .severity-bar-fill { background: #ca8a04; width: ${(breakdown.Medium / totalVulns) * 100}%; }
    .severity-card.low .severity-bar-fill { background: #16a34a; width: ${(breakdown.Low / totalVulns) * 100}%; }

    /* === Tables === */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 24px;
    }

    .data-table thead th {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .data-table tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }

    .data-table tbody tr.even {
      background: #f9fafb;
    }

    .data-table tbody tr.odd {
      background: #ffffff;
    }

    .data-table tbody tr:hover {
      background: #f0f4ff;
    }

    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }

    .severity-badge {
      min-width: 60px;
      text-align: center;
    }

    .cvss-score {
      font-weight: 700;
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
    }

    .cvss-critical { color: #dc2626; }
    .cvss-high { color: #ea580c; }
    .cvss-medium { color: #ca8a04; }
    .cvss-low { color: #16a34a; }

    /* === Vulnerability Detail === */
    .vuln-detail {
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .vuln-detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .vuln-detail-id {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
    }

    .vuln-detail-title {
      font-weight: 600;
      color: #0f172a;
      flex: 1;
    }

    .vuln-detail-body {
      padding: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 12px;
    }

    .vuln-detail-full {
      grid-column: 1 / -1;
    }

    .vuln-detail-label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .vuln-detail-value {
      color: #374151;
    }

    /* === AI Analysis === */
    .ai-analysis {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #22d3ee;
      border-radius: 0 8px 8px 0;
      padding: 20px 24px;
    }

    .ai-analysis p {
      margin-bottom: 12px;
    }

    .ai-analysis ul {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    .ai-analysis li {
      margin-bottom: 8px;
    }

    /* === Remediation Roadmap === */
    .roadmap {
      display: grid;
      gap: 20px;
    }

    .roadmap-phase {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .roadmap-phase-header {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .roadmap-phase.immediate .roadmap-phase-header {
      background: #fef2f2;
      border-bottom: 2px solid #dc2626;
    }

    .roadmap-phase.short-term .roadmap-phase-header {
      background: #fff7ed;
      border-bottom: 2px solid #ea580c;
    }

    .roadmap-phase.long-term .roadmap-phase-header {
      background: #f0fdf4;
      border-bottom: 2px solid #16a34a;
    }

    .roadmap-phase-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
    }

    .roadmap-phase.immediate .roadmap-phase-icon {
      background: #dc2626;
      color: #ffffff;
    }

    .roadmap-phase.short-term .roadmap-phase-icon {
      background: #ea580c;
      color: #ffffff;
    }

    .roadmap-phase.long-term .roadmap-phase-icon {
      background: #16a34a;
      color: #ffffff;
    }

    .roadmap-phase-title {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }

    .roadmap-phase-timeline {
      font-size: 11px;
      color: #64748b;
    }

    .roadmap-phase-body {
      padding: 16px;
    }

    .roadmap-item {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .roadmap-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .roadmap-item-marker {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .roadmap-phase.immediate .roadmap-item-marker {
      background: #fef2f2;
      color: #dc2626;
    }

    .roadmap-phase.short-term .roadmap-item-marker {
      background: #fff7ed;
      color: #ea580c;
    }

    .roadmap-phase.long-term .roadmap-item-marker {
      background: #f0fdf4;
      color: #16a34a;
    }

    .roadmap-item-content {
      flex: 1;
    }

    .roadmap-item-title {
      font-weight: 600;
      font-size: 13px;
      color: #0f172a;
    }

    .roadmap-item-desc {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }

    /* === Statistics Grid === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
    }

    .stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    /* === Compliance Table === */
    .compliance-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .compliance-table thead th {
      background: #1e293b;
      color: #ffffff;
      padding: 10px 14px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .compliance-table tbody td {
      padding: 10px 14px;
      border-bottom: 1px solid #e5e7eb;
    }

    .compliance-table tbody tr.even {
      background: #f9fafb;
    }

    .compliance-table tbody tr.odd {
      background: #ffffff;
    }

    /* === Footer === */
    .report-footer {
      margin-top: 48px;
      border-top: 2px solid #0f172a;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .footer-brand {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }

    .footer-disclaimer {
      font-size: 10px;
      color: #94a3b8;
      max-width: 600px;
      line-height: 1.5;
      text-align: right;
    }

    .footer-page-num {
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }

    /* === Print Button (screen only) === */
    .print-controls {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1000;
      display: flex;
      gap: 8px;
    }

    @media print {
      .print-controls {
        display: none !important;
      }
    }

    .btn-print {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.2s;
    }

    .btn-print:hover {
      background: #1e293b;
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    /* === TOC === */
    .toc {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px 28px;
      margin-bottom: 32px;
    }

    .toc-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }

    .toc-list {
      list-style: none;
      padding: 0;
    }

    .toc-list li {
      padding: 6px 0;
      border-bottom: 1px dotted #d1d5db;
      display: flex;
      justify-content: space-between;
    }

    .toc-list li:last-child {
      border-bottom: none;
    }

    .toc-section-name {
      font-size: 13px;
      color: #374151;
      font-weight: 500;
    }

    .toc-page {
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Print Controls (screen only) -->
  <div class="print-controls no-print">
    <button class="btn-print" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Print / Save as PDF
    </button>
  </div>

  <!-- Report Header -->
  <div class="report-header">
    <div class="brand">
      <div class="brand-icon">TS</div>
      <div>
        <div class="brand-name">ThreatScope</div>
        <div class="brand-subtitle">Cybersecurity Intelligence Platform</div>
      </div>
    </div>
    <div class="classification-badge">${classification}</div>
  </div>

  <!-- Report Metadata -->
  <div class="report-meta">
    <div class="meta-item">
      <span class="meta-label">Report Type</span>
      <span class="meta-value">${reportTypeLabel}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Target</span>
      <span class="meta-value">${target}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Assessment Period</span>
      <span class="meta-value">${formatDate(dateRange.from)} — ${formatDate(dateRange.to)}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Report Date</span>
      <span class="meta-value">${reportDate}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Report ID</span>
      <span class="meta-value">${reportId}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Prepared By</span>
      <span class="meta-value">ThreatScope Automated Analysis Engine</span>
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc">
    <div class="toc-title">Table of Contents</div>
    <ul class="toc-list">
      <li><span class="toc-section-name">1. Executive Summary</span><span class="toc-page">2</span></li>
      <li><span class="toc-section-name">2. Security Score Overview</span><span class="toc-page">3</span></li>
      <li><span class="toc-section-name">3. Severity Breakdown</span><span class="toc-page">3</span></li>
      <li><span class="toc-section-name">4. Vulnerability Findings</span><span class="toc-page">4</span></li>
      <li><span class="toc-section-name">5. Security Statistics</span><span class="toc-page">7</span></li>
      <li><span class="toc-section-name">6. AI Security Analysis</span><span class="toc-page">8</span></li>
      ${reportType === "compliance" ? '<li><span class="toc-section-name">7. Compliance Mapping</span><span class="toc-page">9</span></li>' : ""}
      <li><span class="toc-section-name">${reportType === "compliance" ? "8" : "7"}. Remediation Roadmap</span><span class="toc-page">${reportType === "compliance" ? "10" : "9"}</span></li>
    </ul>
  </div>

  <!-- 1. Executive Summary -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">1</span>
      Executive Summary
    </div>
    <div class="section-content">
      ${generateExecutiveSummary(target, score, breakdown, reportType)}
    </div>
  </div>

  <!-- 2. Security Score -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">2</span>
      Security Score Overview
    </div>
    <div class="score-card">
      <div class="score-circle">
        <div class="score-number">${score}</div>
        <div class="score-max">/ 100</div>
      </div>
      <div class="score-details">
        <div class="score-grade">Grade: ${grade}</div>
        <div class="score-label">Overall Security Posture</div>
        <div class="score-risk-bar">
          <div class="score-risk-fill" style="width:100%">
            Risk: ${riskPercent}% — Moderate-High Risk Level
          </div>
        </div>
        <div class="score-stats">
          <div class="score-stat">
            <div class="score-stat-value">${totalVulns}</div>
            <div class="score-stat-label">Total Findings</div>
          </div>
          <div class="score-stat">
            <div class="score-stat-value">${breakdown.Critical + breakdown.High}</div>
            <div class="score-stat-label">Critical / High</div>
          </div>
          <div class="score-stat">
            <div class="score-stat-value">${riskPercent}%</div>
            <div class="score-stat-label">Risk Level</div>
          </div>
          <div class="score-stat">
            <div class="score-stat-value">72h</div>
            <div class="score-stat-label">MTTR Target</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. Severity Breakdown -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">3</span>
      Severity Breakdown
    </div>
    <div class="severity-breakdown">
      <div class="severity-card critical">
        <div class="severity-count">${breakdown.Critical}</div>
        <div class="severity-label">Critical</div>
        <div class="severity-bar"><div class="severity-bar-fill"></div></div>
      </div>
      <div class="severity-card high">
        <div class="severity-count">${breakdown.High}</div>
        <div class="severity-label">High</div>
        <div class="severity-bar"><div class="severity-bar-fill"></div></div>
      </div>
      <div class="severity-card medium">
        <div class="severity-count">${breakdown.Medium}</div>
        <div class="severity-label">Medium</div>
        <div class="severity-bar"><div class="severity-bar-fill"></div></div>
      </div>
      <div class="severity-card low">
        <div class="severity-count">${breakdown.Low}</div>
        <div class="severity-label">Low</div>
        <div class="severity-bar"><div class="severity-bar-fill"></div></div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 4. Vulnerability Findings -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">4</span>
      Vulnerability Findings
    </div>
    
    <!-- Summary Table -->
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Severity</th>
          <th>CVSS</th>
          <th>Status</th>
          <th>Category</th>
          <th>Component</th>
        </tr>
      </thead>
      <tbody>
        ${VULNERABILITIES.map((v, i) => {
          const sevColors = getSeverityColor(v.severity);
          const statColors = getStatusColor(v.status);
          const cvssClass =
            v.cvss >= 9
              ? "cvss-critical"
              : v.cvss >= 7
              ? "cvss-high"
              : v.cvss >= 4
              ? "cvss-medium"
              : "cvss-low";
          return `<tr class="${i % 2 === 0 ? "even" : "odd"}">
            <td style="font-family:monospace;font-weight:600;color:#64748b;">${v.id}</td>
            <td style="font-weight:500;max-width:260px;">${v.title}</td>
            <td><span class="badge severity-badge" style="background:${sevColors.bg};color:${sevColors.text};">${v.severity}</span></td>
            <td><span class="cvss-score ${cvssClass}">${v.cvss.toFixed(1)}</span></td>
            <td><span class="badge" style="background:${statColors.bg};color:${statColors.text};">${v.status}</span></td>
            <td>${v.category}</td>
            <td style="font-size:11px;color:#64748b;font-family:monospace;">${v.affectedComponent}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- Detailed Vulnerability Descriptions -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">4a</span>
      Detailed Vulnerability Descriptions
    </div>
    ${VULNERABILITIES.filter((v) => v.severity === "Critical" || v.severity === "High")
      .map((v) => {
        const sevColors = getSeverityColor(v.severity);
        const statColors = getStatusColor(v.status);
        return `<div class="vuln-detail">
        <div class="vuln-detail-header">
          <span class="vuln-detail-id">${v.id}</span>
          <span class="vuln-detail-title">${v.title}</span>
          <span class="badge severity-badge" style="background:${sevColors.bg};color:${sevColors.text};">${v.severity}</span>
          <span class="badge" style="background:${statColors.bg};color:${statColors.text};">${v.status}</span>
        </div>
        <div class="vuln-detail-body">
          <div>
            <div class="vuln-detail-label">CVSS Score</div>
            <div class="vuln-detail-value cvss-score ${v.cvss >= 9 ? "cvss-critical" : "cvss-high"}">${v.cvss.toFixed(1)}</div>
          </div>
          <div>
            <div class="vuln-detail-label">Category</div>
            <div class="vuln-detail-value">${v.category}</div>
          </div>
          <div>
            <div class="vuln-detail-label">Affected Component</div>
            <div class="vuln-detail-value" style="font-family:monospace;font-size:11px;">${v.affectedComponent}</div>
          </div>
          <div>
            <div class="vuln-detail-label">Discovered</div>
            <div class="vuln-detail-value">${formatDate(v.discoveredAt)}</div>
          </div>
          <div class="vuln-detail-full">
            <div class="vuln-detail-label">Description</div>
            <div class="vuln-detail-value">${v.description}</div>
          </div>
          <div class="vuln-detail-full">
            <div class="vuln-detail-label">Recommendation</div>
            <div class="vuln-detail-value" style="color:#0f766e;">${v.recommendation}</div>
          </div>
        </div>
      </div>`;
      })
      .join("")}
  </div>

  <div class="page-break"></div>

  <!-- 5. Security Statistics -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">5</span>
      Security Statistics
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value" style="color:#dc2626;">${breakdown.Critical}</div>
        <div class="stat-label">Critical Vulnerabilities</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:#ea580c;">${breakdown.High}</div>
        <div class="stat-label">High Vulnerabilities</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:#ca8a04;">${breakdown.Medium}</div>
        <div class="stat-label">Medium Vulnerabilities</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:#16a34a;">${breakdown.Low}</div>
        <div class="stat-label">Low Vulnerabilities</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${VULNERABILITIES.filter((v) => v.status === "Open").length}</div>
        <div class="stat-label">Open Issues</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${VULNERABILITIES.filter((v) => v.status === "Mitigated" || v.status === "Closed").length}</div>
        <div class="stat-label">Resolved Issues</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${VULNERABILITIES.reduce((sum, v) => sum + v.cvss, 0).toFixed(1)}</div>
        <div class="stat-label">Total CVSS Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${(VULNERABILITIES.reduce((sum, v) => sum + v.cvss, 0) / VULNERABILITIES.length).toFixed(1)}</div>
        <div class="stat-label">Average CVSS</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${new Set(VULNERABILITIES.map((v) => v.category)).size}</div>
        <div class="stat-label">Vulnerability Categories</div>
      </div>
    </div>

    <div class="section-content" style="margin-top:16px;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Count</th>
            <th>Percentage</th>
            <th>Avg. CVSS</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(
            VULNERABILITIES.reduce<Record<string, Vulnerability[]>>((acc, v) => {
              if (!acc[v.category]) acc[v.category] = [];
              acc[v.category].push(v);
              return acc;
            }, {})
          )
            .sort(([, a], [, b]) => b.length - a.length)
            .map(([category, vulns], i) => {
              const avgCvss = vulns.reduce((s, v) => s + v.cvss, 0) / vulns.length;
              const risk =
                avgCvss >= 9
                  ? "Critical"
                  : avgCvss >= 7
                  ? "High"
                  : avgCvss >= 4
                  ? "Medium"
                  : "Low";
              const riskColors = getSeverityColor(risk);
              return `<tr class="${i % 2 === 0 ? "even" : "odd"}">
              <td style="font-weight:600;">${category}</td>
              <td>${vulns.length}</td>
              <td>${((vulns.length / totalVulns) * 100).toFixed(1)}%</td>
              <td><span class="cvss-score ${avgCvss >= 7 ? "cvss-high" : avgCvss >= 4 ? "cvss-medium" : "cvss-low"}">${avgCvss.toFixed(1)}</span></td>
              <td><span class="badge" style="background:${riskColors.bg};color:${riskColors.text};">${risk}</span></td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- 6. AI Security Analysis -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">6</span>
      AI Security Analysis
    </div>
    <div class="section-content">
      ${generateAIAnalysis(target, score, breakdown, VULNERABILITIES)}
    </div>
  </div>

  ${
    reportType === "compliance"
      ? `<div class="page-break"></div>
  <!-- 7. Compliance Mapping -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">7</span>
      Compliance Mapping
    </div>
    <div class="section-content">
      <p style="margin-bottom:16px;">The following table maps identified vulnerabilities to relevant security frameworks and compliance standards.</p>
      ${generateComplianceMapping(VULNERABILITIES)}
    </div>
  </div>`
      : ""
  }

  <div class="page-break"></div>

  <!-- Remediation Roadmap -->
  <div class="section">
    <div class="section-title">
      <span class="section-icon">${reportType === "compliance" ? "8" : "7"}</span>
      Remediation Roadmap
    </div>
    <div class="section-content" style="margin-bottom:16px;">
      The following remediation roadmap provides a structured approach to addressing identified vulnerabilities, prioritized by severity and potential impact.
    </div>
    <div class="roadmap">
      <!-- Immediate Actions -->
      <div class="roadmap-phase immediate">
        <div class="roadmap-phase-header">
          <div class="roadmap-phase-icon">!</div>
          <div>
            <div class="roadmap-phase-title">Immediate Actions</div>
            <div class="roadmap-phase-timeline">Timeline: 0 — 72 hours | Priority: CRITICAL</div>
          </div>
        </div>
        <div class="roadmap-phase-body">
          <div class="roadmap-item">
            <div class="roadmap-item-marker">1</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Patch SQL Injection in Authentication Module (${VULNERABILITIES[0].id})</div>
              <div class="roadmap-item-desc">Deploy parameterized queries immediately. Apply emergency WAF rules to block SQL injection patterns. Conduct emergency code review of all database interaction points.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">2</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Fix Remote Code Execution Vulnerability (${VULNERABILITIES[1].id})</div>
              <div class="roadmap-item-desc">Replace unsafe deserialization with safe JSON parsing. Implement strict input validation and type checking. Restrict service account privileges to minimum required.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">3</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Upgrade OpenSSL to Latest Version (${VULNERABILITIES[2].id})</div>
              <div class="roadmap-item-desc">Immediately upgrade OpenSSL from 1.1.1k to 3.2.1+. Apply all pending security patches to the load balancer and all dependent services.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">4</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Rotate All Exposed Credentials (${VULNERABILITIES[5].id})</div>
              <div class="roadmap-item-desc">Rotate all database credentials and API keys found in configuration files. Revoke and regenerate all tokens. Remove secrets from version control history.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Short-Term Actions -->
      <div class="roadmap-phase short-term">
        <div class="roadmap-phase-header">
          <div class="roadmap-phase-icon">&#9888;</div>
          <div>
            <div class="roadmap-phase-title">Short-Term Actions</div>
            <div class="roadmap-phase-timeline">Timeline: 1 — 4 weeks | Priority: HIGH</div>
          </div>
        </div>
        <div class="roadmap-phase-body">
          <div class="roadmap-item">
            <div class="roadmap-item-marker">1</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Implement Authorization Controls (${VULNERABILITIES[4].id})</div>
              <div class="roadmap-item-desc">Add role-based access control (RBAC) to all API endpoints. Implement user ownership validation. Deploy authorization middleware across the API gateway.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">2</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Deploy Rate Limiting on Auth Endpoints (${VULNERABILITIES[6].id})</div>
              <div class="roadmap-item-desc">Implement rate limiting with exponential backoff. Configure account lockout policies. Add CAPTCHA for suspicious activity detection.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">3</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Remediate XSS Vulnerabilities (${VULNERABILITIES[3].id})</div>
              <div class="roadmap-item-desc">Implement output encoding and input sanitization using DOMPurify. Deploy Content Security Policy headers. Validate all user inputs server-side.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">4</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Fix SSRF Vulnerability (${VULNERABILITIES[7].id})</div>
              <div class="roadmap-item-desc">Implement URL allowlisting for the preview feature. Block requests to private IP ranges. Deploy network segmentation for outbound requests.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Long-Term Improvements -->
      <div class="roadmap-phase long-term">
        <div class="roadmap-phase-header">
          <div class="roadmap-phase-icon">&#10003;</div>
          <div>
            <div class="roadmap-phase-title">Long-Term Improvements</div>
            <div class="roadmap-phase-timeline">Timeline: 1 — 6 months | Priority: MEDIUM</div>
          </div>
        </div>
        <div class="roadmap-phase-body">
          <div class="roadmap-item">
            <div class="roadmap-item-marker">1</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Implement Comprehensive Security Logging</div>
              <div class="roadmap-item-desc">Deploy centralized security event logging with SIEM integration. Configure real-time alerting for suspicious patterns. Implement tamper-evident log storage.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">2</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Security Hardening Program</div>
              <div class="roadmap-item-desc">Implement hardened TLS configuration (TLS 1.2+ minimum). Deploy HSTS, CSP, and other security headers. Establish automated dependency scanning and patch management pipeline.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">3</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Establish Secure Development Lifecycle (SDL)</div>
              <div class="roadmap-item-desc">Integrate SAST/DAST into CI/CD pipeline. Implement mandatory security code reviews. Conduct regular penetration testing (quarterly). Establish security champion program.</div>
            </div>
          </div>
          <div class="roadmap-item">
            <div class="roadmap-item-marker">4</div>
            <div class="roadmap-item-content">
              <div class="roadmap-item-title">Zero Trust Architecture Migration</div>
              <div class="roadmap-item-desc">Implement micro-segmentation and zero trust network access. Deploy continuous verification and least-privilege access. Migrate to secrets management platform (HashiCorp Vault).</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="report-footer">
    <div>
      <div class="footer-brand">ThreatScope Cybersecurity Intelligence Platform</div>
      <div style="font-size:11px;color:#64748b;margin-top:4px;">Report ID: ${reportId} | Generated: ${reportDate}</div>
    </div>
    <div class="footer-disclaimer">
      This report is generated by ThreatScope's automated security analysis engine and is intended solely for the use of authorized personnel. 
      The findings and recommendations contained herein are based on automated scanning and AI-driven analysis and should be validated through manual verification. 
      ThreatScope assumes no liability for actions taken based on this report. All vulnerability data should be treated as sensitive security information and handled according to your organization's data classification policies.
    </div>
  </div>
  <div class="footer-page-num">
    ThreatScope Security Report — ${classification} — ${reportDate}
  </div>

</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body: ReportRequest = await request.json();
    const { reportType, target, dateRange } = body;

    // Validate reportType
    if (!reportType || !["executive", "technical", "compliance"].includes(reportType)) {
      return NextResponse.json(
        {
          error:
            "Invalid reportType. Must be one of: 'executive', 'technical', 'compliance'",
        },
        { status: 400 }
      );
    }

    // Validate target
    if (!target || typeof target !== "string" || target.trim().length === 0) {
      return NextResponse.json(
        { error: "Target is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate dateRange
    if (
      !dateRange ||
      !dateRange.from ||
      !dateRange.to ||
      typeof dateRange.from !== "string" ||
      typeof dateRange.to !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "dateRange is required with 'from' and 'to' fields as ISO date strings",
        },
        { status: 400 }
      );
    }

    // Validate date format
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format in dateRange. Use ISO 8601 format." },
        { status: 400 }
      );
    }

    if (fromDate > toDate) {
      return NextResponse.json(
        { error: "dateRange 'from' must be before 'to'" },
        { status: 400 }
      );
    }

    // Generate the HTML report
    const html = generateReportHTML(
      reportType as ReportType,
      target.trim(),
      dateRange
    );

    // Return HTML with appropriate headers
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error while generating report" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: "Method not allowed. Use POST to generate a report.",
      usage: {
        method: "POST",
        body: {
          reportType: "'executive' | 'technical' | 'compliance'",
          target: "string (scan target, e.g., 'example.com')",
          dateRange: {
            from: "ISO 8601 date string",
            to: "ISO 8601 date string",
          },
        },
      },
    },
    { status: 405 }
  );
}
