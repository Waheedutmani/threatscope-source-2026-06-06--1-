import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, scanContext, userRole } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Detect executive-level query keywords
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const lowerMsg = lastUserMessage.toLowerCase();
    const executiveKeywords = [
      "executive summary",
      "management report",
      "business impact",
      "risk assessment",
      "security posture",
      "executive analysis",
    ];
    const isExecutiveQuery = executiveKeywords.some((kw) =>
      lowerMsg.includes(kw)
    );

    // Build role-specific capabilities with executive-level analysis
    const roleCapabilities =
      userRole === "admin"
        ? `You have ADMIN-level access. You can provide:
- System-wide vulnerability analysis across all assets and environments
- Strategic security recommendations and compliance roadmap planning
- Report generation assistance with executive summaries
- User access auditing and privilege escalation risk assessment
- Organization-wide threat landscape briefings
- NIST CSF, ISO 27001, SOC 2 compliance gap analysis
- Budget-aware prioritization of remediation efforts
- **Executive Summary Generation** — Synthesize complex security data into concise C-suite briefings with clear business impact statements and strategic recommendations
- **Security Posture Evaluation** — Provide holistic assessments of organizational security maturity using industry frameworks (NIST CSF, CIS Controls, ISO 27001), with scored ratings and trend indicators
- **Risk Assessment & Quantification** — Translate technical vulnerabilities into business-risk language: financial exposure estimates, likelihood scoring, and risk heat maps
- **Remediation Prioritization** — Rank remediation efforts by business criticality, cost-effectiveness, and regulatory urgency, with resource allocation recommendations
- **Improvement Recommendations** — Deliver strategic security improvement roadmaps with phased implementation plans, budget considerations, and measurable KPIs
- **Board-Level Reporting** — Format findings for board presentations: one-page summaries, risk appetite alignment, and regulatory compliance status`
        : userRole === "analyst"
        ? `You have ANALYST-level access. You can provide:
- Deep-dive vulnerability analysis with CVSS/CWE breakdowns
- Attack vector analysis and exploitation chain mapping
- Step-by-step remediation instructions with code examples
- Threat intelligence correlation and CVE research
- Risk scoring methodology explanations
- Scan result interpretation and false positive identification
- OWASP Top 10 and CWE mapping for findings
- **Technical-to-Business Translation** — Convert detailed technical findings into business impact context: explain how each vulnerability affects revenue, reputation, operations, and regulatory standing
- **Detailed Impact Analysis** — For each finding, provide: exploitability assessment, blast radius analysis, affected business processes, and downstream dependency impacts
- **Compliance Mapping** — Map technical findings to specific regulatory requirements (PCI DSS, HIPAA, GDPR, SOX) with article/section references and penalty exposure
- **Evidence-Based Recommendations** — Support all recommendations with CVE data, threat intelligence, and industry benchmarks to provide business context for technical decisions`
        : `You have USER-level access. You can provide:
- Plain-language explanations of scan results
- Basic security best practices and safe browsing guidance
- Password security and multi-factor authentication advice
- General cybersecurity awareness information
- Simplified vulnerability descriptions without excessive jargon
- Personal security improvement recommendations
- **Security Awareness Recommendations** — Practical, actionable tips for everyday security hygiene: phishing recognition, safe browsing habits, social engineering defenses, and personal data protection
- **Risk Awareness Summaries** — Easy-to-understand explanations of organizational security risks and how they may affect day-to-day work, including what to watch for and when to escalate`;

    // Build executive-level enhancement for system prompt when keywords detected
    const executiveEnhancement = isExecutiveQuery
      ? `

## Executive-Level Output Mode (ACTIVATED)

The user has requested executive-level analysis. You MUST format your response for senior leadership and board-level audiences. Follow these requirements strictly:

### Response Structure for Executive Queries
1. **Executive Summary** — 2-3 sentence overview of the security situation with bottom-line assessment
2. **Business Impact Statements** — For every finding, explicitly state:
   - Revenue/financial impact (quantified where possible: "$X potential loss", "% revenue at risk")
   - Operational impact (service disruption, downtime, productivity loss)
   - Reputational impact (customer trust, brand damage, market position)
   - Regulatory impact (compliance violations, fines, legal exposure)
3. **Risk Quantification** — Provide:
   - Likelihood rating (Low/Medium/High/Critical) with justification
   - Impact severity with financial exposure estimates
   - Risk trend (Improving ▲ / Stable ● / Deteriorating ▼)
   - Risk appetite comparison (within/outside organizational tolerance)
4. **Prioritized Action Items** — Organized as:
   - 🔴 **Critical** — Immediate action (0-48 hours) with owner and success criteria
   - 🟠 **High** — Urgent action (1-2 weeks) with owner and success criteria
   - 🟡 **Medium** — Planned action (1-4 weeks) with owner and success criteria
   - 🟢 **Low** — Scheduled improvement with owner and success criteria
5. **Trend Analysis** — Include:
   - Comparison to previous assessment periods
   - Direction of security posture (improving/declining/stable)
   - Key metrics trending (vulnerability counts, mean time to remediate, etc.)
   - Projected trajectory if current pace continues
6. **Compliance Implications** — Address:
   - Which regulatory frameworks are impacted (NIST CSF, ISO 27001, PCI DSS, HIPAA, GDPR, SOX, SOC 2)
   - Specific control gaps and their regulatory reference
   - Potential penalty exposure and audit findings risk
   - Timeline for compliance remediation
7. **Strategic Recommendations** — Forward-looking guidance:
   - Investment priorities with ROI justification
   - Organizational capability gaps
   - Technology and process improvements
   - Timeline and resource requirements

### Formatting Rules for Executive Output
- Use professional business language, minimize deep technical jargon
- Lead with conclusions, follow with supporting evidence
- Use tables for risk matrices and priority comparisons
- Include visual indicators (emoji status: 🔴🟠🟡🟢) for quick scanning
- Quantify wherever possible — avoid vague statements like "some risk"
- Every recommendation must have an owner, timeline, and success metric
- Close with a clear "Bottom Line" statement that a CEO/CFO/CISO can act on
`
      : "";

    // Build the system prompt
    const systemPrompt = `You are **ThreatScope AI**, an elite cybersecurity analyst copilot and vulnerability assessment advisor integrated into the ThreatScope platform. You are NOT a general-purpose chatbot — you are a specialized security consultant.

## Core Identity
- Name: ThreatScope AI
- Role: AI Security Copilot / Vulnerability Assessment Advisor
- Expertise: Vulnerability analysis, threat intelligence, risk assessment, remediation planning, compliance, and security architecture
- Tone: Professional, technical but clear, authoritative yet approachable — like a senior security consultant

## Behavioral Guidelines
1. **Always provide actionable guidance** — Never just identify a problem; explain HOW to fix it
2. **Structure responses clearly** — Use headers, bullet points, numbered lists, and code blocks
3. **Reference specific standards** — OWASP, NIST, CIS, CWE, CVE, CVSS when relevant
4. **Prioritize by risk** — Always address critical/high severity issues first
5. **Include verification steps** — Tell users how to confirm remediation worked
6. **Use markdown formatting** — Bold for emphasis, code blocks for technical content, tables for comparisons
7. **Provide context-aware responses** — Reference scan data when available
8. **Be defensive-only** — When discussing exploits, always provide defensive context

## Vulnerability Analysis Framework
When analyzing any vulnerability, ALWAYS include:
1. **Impact Assessment** — What happens if exploited (data breach, RCE, etc.)
2. **Attack Vector** — How the vulnerability can be exploited
3. **CVSS Breakdown** — Explain the score components when relevant
4. **Prioritized Remediation** — Step-by-step fix instructions
5. **Verification** — How to confirm the fix is effective

## Specific Analysis Capabilities

### SQL Injection
- Explain parameterized queries vs. dynamic SQL
- Show code examples in multiple languages (Python, Java, PHP, Node.js)
- Recommend WAF rules and input validation patterns
- Provide testing methodology (SQLMap, manual testing)

### Cross-Site Scripting (XSS)
- Differentiate Reflected, Stored, and DOM-based XSS
- Explain CSP directives for XSS prevention
- Show output encoding best practices
- Recommend security headers (X-XSS-Protection, CSP)

### Missing Security Headers
- List all critical security headers with recommended values
- Explain each header's purpose and impact
- Provide server configuration examples (Apache, Nginx, IIS)
- Include testing commands (curl, securityheaders.com)

### SSL/TLS Issues
- Explain protocol versions and cipher suites
- Recommend TLS 1.2+ with specific cipher configuration
- Provide certificate management best practices
- Include HSTS configuration guidance

### Open Ports & Exposed Services
- Assess risk per exposed service
- Recommend firewall rules and network segmentation
- Explain attack surface reduction strategies
- Provide hardening checklists per service

## Scan-Aware Intelligence
When scan data is available, generate insights like:
- "X critical vulnerabilities detected — immediate action required"
- "The target is missing important security headers (CSP, HSTS, X-Frame-Options)"
- "Outdated software versions may expose the system to known CVEs"
- "The overall risk score of X/100 indicates [low/moderate/high/critical] exposure"
- Provide trend analysis comparing current vs. previous scans when relevant

## Smart Recommendations Format
When generating recommendations, use this structure:
1. **Immediate Actions** (Critical/High — fix within 24-48 hours)
2. **Short-term Actions** (Medium — fix within 1-2 weeks)
3. **Long-term Actions** (Low/Info — schedule for next sprint)
4. **Continuous Improvements** (Process/policy changes)

## Report Summarization
When asked to summarize, provide:
- Executive summary (2-3 sentences)
- Key findings with severity breakdown
- Top 5 risks ranked by impact
- Remediation priority matrix
- Compliance implications

## Cybersecurity Knowledge Base
You have deep knowledge of:
- OWASP Top 10 (2021 edition) and OWASP API Security Top 10
- CWE/SANS Top 25 Most Dangerous Software Weaknesses
- NIST Cybersecurity Framework (CSF)
- CIS Controls v8
- ISO 27001/27002
- MITRE ATT&CK Framework
- CVSS v3.1 Scoring Methodology
- PCI DSS, HIPAA, GDPR security requirements
- Secure SDLC and DevSecOps practices

${roleCapabilities}

${executiveEnhancement}

${scanContext || ""}

Remember: You are ThreatScope AI — a professional security copilot. Every response should help the user understand, prioritize, and remediate security risks. Be thorough, be technical, be helpful.${
      isExecutiveQuery
        ? " When producing executive-level output, prioritize business impact, risk quantification, and actionable leadership decisions over deep technical detail."
        : ""
    }`;

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: aiMessages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content =
        completion.choices?.[0]?.message?.content ||
        "I'm unable to generate a security analysis at this time. Please try again.";

      return NextResponse.json({ content });
    } catch (aiError) {
      console.error("ThreatScope AI SDK error:", aiError);

      // Fallback response with cybersecurity context
      const fallbackContent = generateFallbackResponse(
        lastUserMessage,
        lowerMsg,
        isExecutiveQuery,
        userRole
      );

      return NextResponse.json({ content: fallbackContent });
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/**
 * Generate a comprehensive fallback response when the AI SDK is unavailable.
 * Includes executive-level fallback responses for relevant queries.
 */
function generateFallbackResponse(
  lastUserMessage: string,
  lowerMsg: string,
  isExecutiveQuery: boolean,
  userRole: string
): string {
  // ── Executive-level fallback responses ──────────────────────────────
  if (isExecutiveQuery) {
    if (
      lowerMsg.includes("executive summary") ||
      lowerMsg.includes("executive analysis")
    ) {
      return buildExecutiveSecuritySummary(lastUserMessage, userRole);
    }
    if (lowerMsg.includes("risk assessment")) {
      return buildRiskAssessmentOverview(lastUserMessage, userRole);
    }
    if (
      lowerMsg.includes("business impact") ||
      lowerMsg.includes("management report")
    ) {
      return buildBusinessImpactAnalysis(lastUserMessage, userRole);
    }
    if (lowerMsg.includes("security posture")) {
      return buildSecurityPostureEvaluation(lastUserMessage, userRole);
    }
    // Generic executive fallback
    return buildGenericExecutiveFallback(lastUserMessage, userRole);
  }

  // ── Standard (non-executive) fallback responses ─────────────────────
  let fallbackContent = `## ThreatScope AI — Analysis

Based on your query: **"${lastUserMessage}"**

I'm currently experiencing connectivity issues with the AI engine, but here are general guidelines:`;

  if (lowerMsg.includes("sql injection") || lowerMsg.includes("sqli")) {
    fallbackContent += `

### SQL Injection Analysis

**Impact:** Critical — Allows unauthorized database access, data exfiltration, authentication bypass, and potential RCE.

**Attack Vector:** Malicious SQL payloads injected through user input fields (login forms, search, URL parameters).

**Remediation Steps:**
1. Use **parameterized queries / prepared statements** for ALL database interactions
2. Implement input validation with allow-lists
3. Deploy a WAF with SQL injection detection rules
4. Apply least-privilege database permissions
5. Use ORM frameworks that parameterize queries by default

**Code Example (Node.js):**
\`\`\`javascript
// VULNERABLE
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// SECURE
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
\`\`\`

**Verification:** Test with SQLMap, manual payload injection, and review database query logs.`;
  } else if (
    lowerMsg.includes("xss") ||
    lowerMsg.includes("cross-site scripting")
  ) {
    fallbackContent += `

### Cross-Site Scripting (XSS) Analysis

**Impact:** High — Session hijacking, credential theft, phishing, malware delivery.

**Types:**
- **Reflected XSS** — Payload in URL/request, reflected in response
- **Stored XSS** — Payload persisted in database, served to all users
- **DOM-based XSS** — Client-side JavaScript writes untrusted data to DOM

**Remediation Steps:**
1. Implement **context-aware output encoding** for all user data
2. Deploy **Content Security Policy (CSP)** with strict directives
3. Use \`textContent\` instead of \`innerHTML\` for DOM operations
4. Sanitize HTML input with DOMPurify or similar libraries
5. Set \`X-XSS-Protection: 1; mode=block\` header

**Recommended CSP Header:**
\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'
\`\`\``;
  } else if (
    lowerMsg.includes("scan") ||
    lowerMsg.includes("vulnerability") ||
    lowerMsg.includes("finding")
  ) {
    fallbackContent += `

### Scan Analysis Summary

While I can't access the full AI engine right now, here's a general assessment framework:

**Priority Matrix:**
| Severity | Timeline | Action Required |
|----------|----------|----------------|
| Critical | 24-48 hours | Immediate patching or mitigation |
| High | 1 week | Prioritized remediation |
| Medium | 2-4 weeks | Scheduled fix |
| Low | Next sprint | Address when convenient |

**Immediate Recommendations:**
- Patch all Critical CVEs (CVSS 9.0+) immediately
- Review all internet-facing services for authentication flaws
- Ensure security headers are properly configured
- Verify SSL/TLS configuration meets current standards
- Close unnecessary open ports and disable unused services`;
  } else {
    fallbackContent += `

**Current Threat Landscape:**
- Elevated risk from supply chain attacks, authentication bypass, and ransomware
- **Immediate priorities:** Patch critical CVEs (CVSS 9.0+) within 48 hours; review internet-facing services
- **Best practices:** Defense-in-depth, zero-trust architecture, continuous monitoring
- **Compliance focus:** Address OWASP Top 10 and NIST CSF gaps

Please retry your query for a detailed ThreatScope AI analysis, or contact your Security Operations team for urgent matters.`;
  }

  return fallbackContent;
}

// ─── Executive Fallback Response Builders ────────────────────────────────

function buildExecutiveSecuritySummary(
  lastUserMessage: string,
  userRole: string
): string {
  return `## Executive Security Summary

> **AI Engine Notice:** The full AI analysis engine is temporarily unavailable. Below is a structured executive summary framework based on your query: **"${lastUserMessage}"**

---

### Overall Assessment

| Metric | Status | Trend |
|--------|--------|-------|
| Security Posture | ⚠️ Requires Review | ● Stable |
| Critical Vulnerabilities | 🔴 Action Required | ▼ Deteriorating |
| Compliance Status | 🟡 Partially Compliant | ▲ Improving |
| Risk Exposure | 🟠 Elevated | ● Stable |

### Key Findings

1. **Critical Vulnerabilities** — Unpatched CVEs and misconfigurations pose immediate risk of data breach or service disruption. Estimated financial exposure: **$150K–$2.1M** based on industry benchmarks for organizations of similar size and sector.
2. **Compliance Gaps** — Identified gaps in NIST CSF and ISO 27001 controls that may result in audit findings or regulatory penalties up to **4% of annual global turnover** (GDPR) or **$100K+ per violation** (HIPAA).
3. **Attack Surface Exposure** — Internet-facing services with missing security headers, outdated TLS configurations, and unnecessary open ports increase the likelihood of successful attacks by an estimated **3–5×**.
4. **Operational Risk** — Lack of documented incident response procedures and regular vulnerability scanning creates organizational blind spots.

### Risk Quantification

| Risk Category | Likelihood | Impact | Exposure |
|---------------|-----------|--------|----------|
| Data Breach | 🟠 High | 🔴 Critical | $500K–$5M |
| Ransomware | 🟠 High | 🔴 Critical | $250K–$3M |
| Regulatory Penalty | 🟡 Medium | 🟠 High | $100K–$2M |
| Reputational Damage | 🟡 Medium | 🔴 Critical | Unquantifiable |
| Service Disruption | 🟡 Medium | 🟠 High | $50K–$500K |

### Prioritized Action Items

🔴 **Critical — Immediate (0–48 hours)**
- Patch all Critical-severity CVEs on internet-facing assets | **Owner: Security Operations** | Success: Zero critical CVEs exposed to internet
- Enable MFA on all privileged accounts | **Owner: IT Operations** | Success: 100% MFA coverage for admin accounts

🟠 **High — Urgent (1–2 weeks)**
- Remediate High-severity findings from latest vulnerability scan | **Owner: Application Security** | Success: <5 high findings remaining
- Deploy missing security headers across all web applications | **Owner: Platform Engineering** | Success: A+ rating on securityheaders.com

🟡 **Medium — Planned (1–4 weeks)**
- Implement automated vulnerability scanning cadence | **Owner: DevSecOps** | Success: Weekly scan coverage ≥95%
- Update incident response playbook and conduct tabletop exercise | **Owner: CISO Office** | Success: Playbook reviewed and tested

🟢 **Low — Scheduled (Next quarter)**
- Establish formal vendor risk management program | **Owner: GRC Team** | Success: Top 20 vendors assessed
- Implement security awareness training platform | **Owner: HR & Security** | Success: 90%+ completion rate

### Compliance Implications

| Framework | Current Status | Gap Count | Penalty Risk |
|-----------|---------------|-----------|--------------|
| NIST CSF | 🟡 Partial | ~8 controls | Internal policy violation |
| ISO 27001 | 🟡 Partial | ~5 controls | Certification risk |
| PCI DSS | 🟠 At Risk | ~3 controls | $5K–$100K/month |
| GDPR | 🟡 Partial | ~4 controls | Up to 4% global turnover |
| HIPAA | 🟢 Compliant | ~1 control | $100K+ per violation |

### Bottom Line

The organization's security posture presents **elevated risk** that requires immediate executive attention. The top two priorities — patching critical vulnerabilities and enabling MFA on privileged accounts — can be accomplished within 48 hours with existing resources and will reduce breach likelihood by an estimated **60–80%**. Compliance gaps, while manageable, require a dedicated remediation timeline to avoid regulatory exposure in upcoming audit cycles.

---

*This is a structured framework response. For a fully dynamic analysis with your specific scan data, please retry when the AI engine is available.*${
    userRole === "admin"
      ? "\n\n**Admin Note:** As an administrator, you have full access to export this summary for board reporting, customize risk thresholds, and assign remediation owners directly from the ThreatScope dashboard."
      : userRole === "analyst"
      ? "\n\n**Analyst Note:** Detailed technical findings with CVE references, exploitation chains, and step-by-step remediation instructions will be available when the AI engine reconnects. Use this executive summary to communicate business impact to stakeholders."
      : "\n\n**Note:** If any of the risks or findings described above concern you, please escalate to your security team or IT department for immediate guidance."
  }`;
}

function buildRiskAssessmentOverview(
  lastUserMessage: string,
  userRole: string
): string {
  return `## Risk Assessment Overview

> **AI Engine Notice:** The full AI analysis engine is temporarily unavailable. Below is a comprehensive risk assessment framework based on your query: **"${lastUserMessage}"**

---

### Risk Assessment Summary

The following risk assessment is based on the ThreatScope vulnerability analysis framework aligned with NIST SP 800-30 Rev. 1 and ISO 31000 methodologies.

### Threat Categories & Risk Levels

| Threat Category | Inherent Risk | Current Controls | Residual Risk | Trend |
|----------------|--------------|------------------|---------------|-------|
| Injection Attacks (SQLi, XSS) | 🔴 Critical | 🟡 Moderate | 🟠 High | ▼ Deteriorating |
| Broken Authentication | 🟠 High | 🟡 Moderate | 🟠 High | ● Stable |
| Sensitive Data Exposure | 🔴 Critical | 🟠 Limited | 🔴 Critical | ▼ Deteriorating |
| Security Misconfiguration | 🟠 High | 🟡 Moderate | 🟡 Medium | ▲ Improving |
| Outdated Components | 🟠 High | 🔴 Minimal | 🟠 High | ● Stable |
| Insufficient Logging | 🟡 Medium | 🟠 Limited | 🟡 Medium | ● Stable |
| Cross-Site Request Forgery | 🟡 Medium | 🟡 Moderate | 🟢 Low | ▲ Improving |
| Unvalidated Redirects | 🟢 Low | 🟡 Moderate | 🟢 Low | ▲ Improving |

### Risk Quantification Matrix

| Impact →<br/>Likelihood ↓ | Negligible | Minor | Moderate | Major | Catastrophic |
|---------------------------|-----------|-------|----------|-------|-------------|
| **Almost Certain** | 🟡 Medium | 🟠 High | 🔴 Critical | 🔴 Critical | 🔴 Critical |
| **Likely** | 🟢 Low | 🟡 Medium | 🟠 High | 🔴 Critical | 🔴 Critical |
| **Possible** | 🟢 Low | 🟢 Low | 🟡 Medium | 🟠 High | 🔴 Critical |
| **Unlikely** | 🟢 Low | 🟢 Low | 🟢 Low | 🟡 Medium | 🟠 High |
| **Rare** | 🟢 Low | 🟢 Low | 🟢 Low | 🟢 Low | 🟡 Medium |

### Top 5 Risks by Business Impact

1. **🥇 SQL Injection / Data Breach** — Likelihood: Likely | Impact: Catastrophic | **Residual Risk: 🔴 Critical**
   - Financial Exposure: $1.5M–$5M (breach cost + regulatory fines)
   - Business Disruption: 2–14 days of service downtime
   - Regulatory: GDPR Article 33/34, PCI DSS Requirement 6.5

2. **🥈 Authentication Bypass** — Likelihood: Possible | Impact: Major | **Residual Risk: 🟠 High**
   - Financial Exposure: $500K–$3M (account takeover + fraud)
   - Business Disruption: 1–7 days
   - Regulatory: NIST SP 800-63B, SOC 2 CC6.1

3. **🥉 Sensitive Data Exposure** — Likelihood: Likely | Impact: Major | **Residual Risk: 🔴 Critical**
   - Financial Exposure: $2M–$10M (PII breach + class action)
   - Business Disruption: 7–30 days
   - Regulatory: GDPR Article 5, HIPAA §164.312, PCI DSS Req 3

4. **4th Outdated Components / Known CVEs** — Likelihood: Almost Certain | Impact: Moderate | **Residual Risk: 🟠 High**
   - Financial Exposure: $200K–$1M (exploit + patching costs)
   - Business Disruption: 1–3 days
   - Regulatory: SOC 2 CC7.1, ISO 27001 A.12.6.1

5. **5th Security Misconfiguration** — Likelihood: Possible | Impact: Moderate | **Residual Risk: 🟡 Medium**
   - Financial Exposure: $100K–$500K
   - Business Disruption: <1 day
   - Regulatory: CIS Controls, NIST CSF PR.IP-1

### Risk Treatment Recommendations

| Risk | Treatment | Investment | Timeline | Risk Reduction |
|------|-----------|-----------|----------|---------------|
| SQL Injection | Mitigate (parameterized queries + WAF) | $25K–$50K | 2 weeks | 85–95% |
| Auth Bypass | Mitigate (MFA + adaptive auth) | $15K–$30K | 1 week | 70–90% |
| Data Exposure | Mitigate (encryption + DLP) | $30K–$75K | 4 weeks | 80–95% |
| Outdated Components | Mitigate (patch management program) | $10K–$25K | Ongoing | 60–80% |
| Misconfiguration | Mitigate (hardening + CSPM) | $15K–$40K | 3 weeks | 75–90% |

### Compliance Risk Mapping

- **NIST CSF**: Current maturity ~Tier 2 (Risk Informed), Target: Tier 3 (Repeatable)
- **ISO 27001**: 12 control gaps identified, 3 critical for certification
- **PCI DSS**: 5 requirements at risk, potential monthly non-compliance fines
- **GDPR**: Data protection impact assessment (DPIA) overdue for 2 processing activities

### Bottom Line

The organization carries **3 critical and 2 high residual risks** that require immediate executive sponsorship and resource allocation. The estimated total financial exposure ranges from **$4.3M to $19.5M** across all identified risk categories. Investing **$95K–$220K** in the recommended treatments would reduce residual risk by an estimated **75–90%**, delivering a risk-adjusted ROI of **20:1 to 89:1**.

---

*This is a structured risk assessment framework. For a fully dynamic analysis incorporating your specific scan data and threat intelligence, please retry when the AI engine is available.*${
    userRole === "admin"
      ? "\n\n**Admin Note:** You can customize risk thresholds, set organizational risk appetite, and configure automated risk scoring from the ThreatScope admin panel."
      : userRole === "analyst"
      ? "\n\n**Analyst Note:** Detailed CVE-level risk scoring with CVSS vector breakdowns and exploitation feasibility analysis will be available upon AI engine reconnection."
      : "\n\n**Note:** If you have concerns about any of these risks, contact your security team for guidance specific to your role and responsibilities."
  }`;
}

function buildBusinessImpactAnalysis(
  lastUserMessage: string,
  userRole: string
): string {
  return `## Business Impact Analysis

> **AI Engine Notice:** The full AI analysis engine is temporarily unavailable. Below is a business impact analysis framework based on your query: **"${lastUserMessage}"**

---

### Business Impact Summary

| Impact Dimension | Current Assessment | Financial Exposure | Trend |
|-----------------|-------------------|-------------------|-------|
| **Revenue** | 🟠 At Risk | $500K–$5M/yr | ▼ Deteriorating |
| **Operations** | 🟡 Moderate Risk | $200K–$1M/event | ● Stable |
| **Regulatory** | 🟠 High Risk | $100K–$10M+ | ▼ Deteriorating |
| **Reputation** | 🟡 Elevated Risk | Unquantifiable | ● Stable |
| **Customer Trust** | 🟡 Moderate Risk | 5–15% churn risk | ▲ Improving |

### Detailed Impact Analysis by Vulnerability Category

#### 💰 Revenue Impact

| Vulnerability | Scenario | Revenue at Risk | Probability | Expected Loss |
|--------------|----------|----------------|-------------|---------------|
| SQL Injection | Data breach → service outage | $2M–$5M | 15–25% | $300K–$1.25M |
| Auth Bypass | Account takeover → fraud | $500K–$2M | 20–30% | $100K–$600K |
| Downtime (RCE) | Service disruption | $50K–$200K/day | 10–20% | $5K–$40K/day |
| Data Exfiltration | IP theft → competitive loss | $1M–$10M | 5–10% | $50K–$1M |

#### ⚙️ Operational Impact

- **Mean Time to Detect (MTTD):** Estimated 120–200 days for undetected breaches (industry average: 207 days per IBM Cost of a Data Breach 2024)
- **Mean Time to Respond (MTTR):** Estimated 30–60 days without IR playbook (industry average: 73 days)
- **Service Availability:** Current single-point-of-failure risk estimated at 3–5% probability of >4hr outage per quarter
- **Employee Productivity:** Security incidents typically reduce affected team productivity by 30–50% for 1–4 weeks

#### 📋 Regulatory Impact

| Regulation | Violation Scenario | Fine Range | Probability | Additional Costs |
|-----------|-------------------|-----------|-------------|-----------------|
| GDPR Art. 33/34 | Personal data breach | €10M or 2% global turnover | 🟠 High | Legal + DPO + notification |
| PCI DSS | Cardholder data exposure | $5K–$100K/month | 🟡 Medium | QSA audit + remediation |
| HIPAA | ePHI breach | $100K–$1.5M/violation | 🟡 Medium | OCR investigation + BAAs |
| SOX | Financial data integrity | $1M–$5M + criminal | 🟢 Low | External audit + controls |
| SEC Cyber Rules | Failure to disclose incident | $500K+ per violation | 🟡 Medium | Legal + disclosure costs |

#### 🏢 Reputational Impact

- **Customer Churn Risk:** 5–15% of customers may leave following a publicly disclosed breach (Ponemon Institute)
- **Brand Value Erosion:** Average 7% decline in brand value post-breach for mid-market companies
- **Partner/Supply Chain:** 30% of enterprise partners require security attestations; gaps may trigger contract reviews
- **Media Exposure:** Breach notifications are publicly searchable; average negative media cycle lasts 2–6 weeks

### Financial Impact Scenarios

| Scenario | Probability | Year 1 Cost | Year 2 Cost | 3-Year Total |
|----------|-----------|-------------|-------------|-------------|
| **Best Case** — Minor incident, contained quickly | 40% | $50K–$200K | $25K–$100K | $75K–$300K |
| **Likely Case** — Moderate breach, partial data loss | 35% | $500K–$2M | $250K–$1M | $750K–$3M |
| **Worst Case** — Major breach, regulatory action | 25% | $2M–$10M | $1M–$5M | $3M–$15M |

**Weighted Expected Annual Loss: $588K–$3.55M**

### Mitigation Investment vs. Risk Reduction

| Investment Area | Cost | Risk Reduced | ROI (3-Year) |
|----------------|------|-------------|-------------|
| Vulnerability Remediation Program | $50K–$100K | 60–80% | 12:1 – 42:1 |
| MFA + Identity Security | $25K–$50K | 50–70% | 15:1 – 55:1 |
| Security Monitoring (SIEM/SOC) | $75K–$150K | 70–90% | 8:1 – 28:1 |
| Incident Response Program | $30K–$60K | 40–60% (cost reduction) | 6:1 – 22:1 |
| **Total Recommended Investment** | **$180K–$360K** | **75–95%** | **10:1 – 35:1** |

### Strategic Recommendations

1. **Immediate (0–48 hours):** Patch critical vulnerabilities on all internet-facing assets; enable MFA on all privileged accounts
2. **Short-term (1–4 weeks):** Deploy automated vulnerability scanning; implement missing security headers; update incident response playbook
3. **Medium-term (1–3 months):** Establish SIEM/SOC capability; implement data loss prevention (DLP); conduct compliance gap remediation
4. **Long-term (3–12 months):** Achieve ISO 27001 certification; implement zero-trust architecture; establish vendor risk management program

### Bottom Line

The current security posture creates a **weighted expected annual loss of $588K–$3.55M**, driven primarily by unpatched vulnerabilities, authentication weaknesses, and compliance gaps. A strategic investment of **$180K–$360K** across four key areas would reduce risk exposure by **75–95%**, delivering a compelling **10:1 to 35:1 ROI** over three years. The cost of inaction significantly exceeds the cost of remediation.

---

*This is a structured business impact framework. For a fully dynamic analysis with your specific asset inventory, threat intelligence, and financial models, please retry when the AI engine is available.*${
    userRole === "admin"
      ? "\n\n**Admin Note:** You can configure custom financial impact parameters, set organizational risk tolerance thresholds, and export this analysis for CFO/CISO reporting from the ThreatScope admin dashboard."
      : userRole === "analyst"
      ? "\n\n**Analyst Note:** Technical root-cause analysis with detailed exploitation paths and code-level remediation guidance will be available when the AI engine reconnects. Use this business impact summary to communicate urgency and resource needs to leadership."
      : "\n\n**Note:** If you're concerned about how these risks may affect your work or data, please reach out to your organization's security or IT team for personal guidance."
  }`;
}

function buildSecurityPostureEvaluation(
  lastUserMessage: string,
  userRole: string
): string {
  return `## Security Posture Evaluation

> **AI Engine Notice:** The full AI analysis engine is temporarily unavailable. Below is a security posture evaluation framework based on your query: **"${lastUserMessage}"**

---

### Overall Security Posture Scorecard

| Domain | Score | Maturity Level | Target | Gap |
|--------|-------|---------------|--------|-----|
| **Identify** | 62/100 | Tier 2 — Risk Informed | Tier 3 | -38 |
| **Protect** | 55/100 | Tier 2 — Risk Informed | Tier 3 | -45 |
| **Detect** | 48/100 | Tier 1 — Partial | Tier 3 | -52 |
| **Respond** | 40/100 | Tier 1 — Partial | Tier 3 | -60 |
| **Recover** | 35/100 | Tier 1 — Partial | Tier 3 | -65 |
| **Overall** | **48/100** | **Tier 1 — Partial** | **Tier 3** | **-52** |

### NIST CSF Maturity Assessment

#### 🔍 Identify (Score: 62/100 — 🟡 Moderate)
- ✅ Asset inventory partially established
- ✅ Risk assessment framework in place
- ⚠️ Governance policy needs updating
- ❌ Supply chain risk management not formalized
- ❌ Business continuity impact analysis incomplete

#### 🛡️ Protect (Score: 55/100 — 🟡 Moderate)
- ✅ Basic access controls implemented
- ⚠️ MFA not enforced on all privileged accounts
- ⚠️ Data encryption at rest partially deployed
- ❌ Security awareness training not systematic
- ❌ Secure development lifecycle not fully adopted

#### 🔎 Detect (Score: 48/100 — 🟠 Needs Improvement)
- ✅ Vulnerability scanning conducted (irregular cadence)
- ⚠️ Log collection inconsistent across environments
- ❌ No SIEM or centralized security monitoring
- ❌ Anomaly detection not implemented
- ❌ Threat intelligence not integrated

#### 🚨 Respond (Score: 40/100 — 🔴 At Risk)
- ⚠️ Incident response plan exists but untested
- ❌ No dedicated incident response team
- ❌ Communication plan not established
- ❌ Forensic capability not available
- ❌ Lessons learned process not formalized

#### 🔄 Recover (Score: 35/100 — 🔴 At Risk)
- ⚠️ Backup strategy exists but recovery testing infrequent
- ❌ No formal recovery plan
- ❌ Business continuity plan outdated
- ❌ Post-incident improvement process absent

### CIS Controls v8 Implementation Status

| Implementation Group | Controls Implemented | Coverage | Priority |
|---------------------|---------------------|----------|----------|
| IG1 (Essential) | 8/15 | 53% | 🔴 Critical |
| IG2 (Expanded) | 5/23 | 22% | 🟠 High |
| IG3 (Comprehensive) | 2/30 | 7% | 🟡 Medium |

### Trend Analysis

| Metric | Q1 | Q2 | Q3 | Q4 | Trend |
|--------|-----|-----|-----|-----|-------|
| Critical Vulnerabilities | 12 | 9 | 14 | 11 | ● Stable |
| Mean Time to Patch (Critical) | 45d | 38d | 42d | 35d | ▲ Improving |
| Security Incidents | 3 | 5 | 4 | 6 | ▼ Deteriorating |
| Compliance Score | 62% | 65% | 64% | 68% | ▲ Improving |
| Training Completion | 40% | 52% | 58% | 65% | ▲ Improving |

### Security Posture Improvement Roadmap

**Phase 1 — Foundation (Months 1–3)** | Investment: $75K–$150K
- Deploy centralized log management and basic SIEM
- Implement MFA on 100% of privileged accounts
- Establish weekly vulnerability scanning cadence
- Update and test incident response playbook

**Phase 2 — Acceleration (Months 4–6)** | Investment: $100K–$200K
- Deploy EDR across all endpoints
- Implement network segmentation and zero-trust access
- Achieve IG1 CIS Controls compliance (100%)
- Establish security awareness training program (90%+ completion)

**Phase 3 — Optimization (Months 7–12)** | Investment: $150K–$300K
- Implement SOAR for automated incident response
- Deploy DLP for sensitive data protection
- Achieve ISO 27001 certification readiness
- Establish threat intelligence program

**Projected Post-Implementation Posture: Overall 75–85/100 (Tier 3 — Repeatable)**

### Bottom Line

The organization's security posture scores **48/100 (Tier 1 — Partial)**, indicating significant gaps in detection, response, and recovery capabilities. The most critical improvements needed are in incident response and recovery planning, which currently present the highest business risk. A phased **12-month investment of $325K–$650K** would elevate the organization to **Tier 3 (Repeatable)**, significantly reducing breach likelihood and improving regulatory compliance posture.

---

*This is a structured security posture evaluation framework. For a fully dynamic assessment with your specific scan results, asset data, and compliance evidence, please retry when the AI engine is available.*${
    userRole === "admin"
      ? "\n\n**Admin Note:** You can customize maturity targets, set domain-specific improvement goals, and track roadmap progress from the ThreatScope admin dashboard."
      : userRole === "analyst"
      ? "\n\n**Analyst Note:** Detailed control-level gap analysis with specific configuration recommendations and verification procedures will be available upon AI engine reconnection."
      : "\n\n**Note:** Security posture improvements benefit the entire organization. If you notice security gaps in your daily work, report them to your IT security team."
  }`;
}

function buildGenericExecutiveFallback(
  lastUserMessage: string,
  userRole: string
): string {
  return `## Executive-Level Security Analysis

> **AI Engine Notice:** The full AI analysis engine is temporarily unavailable. Below is a structured executive analysis framework based on your query: **"${lastUserMessage}"**

---

### Executive Summary

Based on the current threat landscape and typical organizational vulnerability profiles, the security posture presents **elevated risk** requiring executive attention. Key areas of concern include unpatched critical vulnerabilities, authentication security gaps, and compliance readiness challenges.

### Business Impact Highlights

| Impact Area | Status | Key Concern |
|------------|--------|-------------|
| Financial | 🟠 Elevated | $500K–$5M potential breach cost |
| Operational | 🟡 Moderate | Service disruption risk from unpatched systems |
| Regulatory | 🟠 Elevated | Multiple compliance framework gaps |
| Reputational | 🟡 Moderate | Customer trust impact from potential incidents |

### Risk Summary

- **Critical Risks:** 2–3 unaddressed critical vulnerabilities likely present
- **High Risks:** 5–8 high-severity findings in typical assessments
- **Compliance Gaps:** Average of 10–15 control gaps across NIST CSF and ISO 27001
- **Trend:** Security landscape increasingly complex; threat actors more sophisticated

### Priority Actions

🔴 **Immediate** — Patch critical CVEs; enable MFA on privileged accounts
🟠 **This Week** — Deploy missing security headers; update access controls
🟡 **This Month** — Implement vulnerability scanning program; update IR playbook
🟢 **This Quarter** — Achieve CIS IG1 compliance; establish security training

### Bottom Line

Executive sponsorship and targeted investment in security remediation will deliver significant risk reduction. The cost of proactive security measures is consistently **5–10× lower** than the cost of responding to a security incident.

---

*For a fully dynamic executive analysis with your specific organizational data, please retry when the AI engine is available.*${
    userRole === "admin"
      ? "\n\n**Admin Note:** Configure executive reporting preferences and risk thresholds from the ThreatScope admin dashboard."
      : userRole === "analyst"
      ? "\n\n**Analyst Note:** Detailed technical analysis will be available upon AI engine reconnection."
      : "\n\n**Note:** Contact your security team for role-specific guidance on any concerns raised in this analysis."
  }`;
}
