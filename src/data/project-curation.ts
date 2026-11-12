/**
 * @file Curates reviewed roles, domains, outcomes, maturity, and six featured cases.
 * Functions: none; exports presentation data in canonical portfolio-priority order.
 * Variables: projectCuration; exact file/declaration locations are indexed below.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import type { ProjectCuration } from "@/lib/types";
import { spaceSystemsCuration } from "@/data/space-systems";
import { droneSystemsCuration } from "@/data/drone-systems";

export const projectCuration = [
  {
    name: "code-flow-studio",
    roles: ["AI engineer", "Full-stack engineer", "Developer tools engineer"],
    domains: ["AI developer tools", "Testing", "Security", "Compiler instrumentation"],
    maturity: "validated",
    outcome:
      "Review source-bound diagnostics, unused-code candidates and C# Coverlet coverage with separate collector evidence in a desktop workspace.",
    featuredOrder: 1,
    caseStudySlug: "code-flow-studio",
  },
  {
    name: "business-knowledge-workbench",
    roles: ["Full-stack engineer", "Data engineer", "App developer"],
    domains: ["Document processing", "Data normalization", "Privacy"],
    maturity: "validated",
    outcome:
      "Standardize business files, search numeric ranges with same-cell units and preview/export authorized records in a desktop workspace.",
    featuredOrder: 2,
    caseStudySlug: "business-knowledge-workbench",
  },
  {
    name: "personal-image-model-studio",
    roles: ["Deep-learning engineer", "AI engineer", "App developer"],
    domains: ["Generative AI", "Machine learning", "Privacy"],
    maturity: "validated",
    outcome:
      "Review datasets, train compact CPU diffusion models and compare learned generation in a private desktop workspace.",
    featuredOrder: 3,
    caseStudySlug: "personal-image-model-studio",
  },
  {
    name: "forge2d-engine",
    roles: ["Game engine engineer", "C++ engineer", "Game programmer"],
    domains: ["Game technology", "Systems", "Simulation"],
    maturity: "validated",
    outcome:
      "Edit game scenes, inspect collisions and replay real engine inputs with reproducible state and reusable project exports.",
    caseStudySlug: "forge2d-engine",
    featuredOrder: 4,
  },
  {
    name: "secure-delivery-pipeline-lab",
    roles: ["DevOps engineer", "Security engineer", "Software engineer"],
    domains: ["CI/CD", "Supply-chain security", "Reliability"],
    maturity: "validated",
    outcome:
      "Inspect offline release integrity, original inputs and saved review evidence while keeping authenticated promotion in the CLI.",
    featuredOrder: 5,
    caseStudySlug: "secure-delivery-pipeline-lab",
  },
  {
    name: "applicant-evidence-studio",
    roles: ["Full-stack engineer", "AI engineer", "Software engineer"],
    domains: ["Evidence review", "Privacy", "Accessibility"],
    maturity: "validated",
    outcome:
      "Compare cited applicant records against one rubric and retain private evidence, unknowns and human-reviewed coaching exports.",
    featuredOrder: 6,
    caseStudySlug: "applicant-evidence-studio",
  },
  ...spaceSystemsCuration,
  ...droneSystemsCuration,
  {
    name: "cloud-job-orchestrator",
    roles: ["Cloud engineer", "Backend engineer", "DevOps engineer"],
    domains: ["Distributed systems", "Cloud computing", "Operations"],
    maturity: "validated",
    outcome:
      "Author DAG jobs, inspect lease and retry state, and replay real Rust/PostgreSQL execution in a durable desktop workspace.",
    caseStudySlug: "cloud-job-orchestrator",
  },
  {
    name: "integration-operations-console",
    roles: ["Full-stack engineer", "Backend engineer", "Software engineer"],
    domains: ["Integrations", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Search persistent integration jobs, inspect complete audit pages and export exact results through the local Java and React app.",
    caseStudySlug: "integration-operations-console",
  },
  {
    name: "ml-model-lifecycle-observatory",
    roles: ["ML engineer", "AI engineer", "Backend engineer"],
    domains: ["Machine learning", "MLOps", "Observability"],
    maturity: "validated",
    outcome:
      "Train supported models, inspect verified dossiers and retain explicit promotion, rollback, prediction and drift evidence.",
    caseStudySlug: "ml-model-lifecycle-observatory",
  },
  {
    name: "player-telemetry-analytics-platform",
    roles: ["Data engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Analytics", "Game technology", "Data quality"],
    maturity: "validated",
    outcome:
      "Import event batches and inspect cohorts, sessions and retention with explicit receipt cutoffs and mature-window denominators.",
    caseStudySlug: "player-telemetry-analytics-platform",
  },
  {
    name: "industrial-edge-digital-twin",
    roles: ["C++ engineer", "IoT engineer", "Full-stack engineer"],
    domains: ["Industrial IoT", "Simulation", "Telemetry"],
    maturity: "validated",
    outcome:
      "Edit a synthetic C++ process model, record faults and replay signal quality, requested outputs and actual responses in a desktop HMI.",
  },
  {
    name: "accessible-design-system-lab",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Accessibility", "Design systems", "Developer experience"],
    maturity: "validated",
    outcome:
      "Author component blueprints with interactive accessible previews, realistic states and editable React and CSS exports.",
    caseStudySlug: "accessible-design-system-lab",
  },
  {
    name: "edge-vision-deployment-benchmark",
    roles: ["Deep-learning engineer", "ML engineer", "Systems engineer"],
    domains: ["Computer vision", "Edge computing", "Benchmarking"],
    maturity: "validated",
    outcome:
      "Train on synthetic shape data and compare five inference engines with held-out recall, calibration and configurable review gates.",
  },
  {
    name: "secure-service-desk",
    roles: ["Full-stack engineer", "Backend engineer", "Web developer"],
    domains: ["Security", "Workflow systems", "Reliability"],
    maturity: "validated",
    outcome:
      "Exercise tenant-scoped tickets, assignment and SLA queues with version checks, atomic audit writes and persistent local profiles.",
  },
  {
    name: "offline-first-field-app",
    roles: ["App developer", "Full-stack engineer", "C# engineer"],
    domains: ["Offline-first", "Synchronization", "Mobile"],
    maturity: "validated",
    outcome:
      "Edit inspection records offline, pair local profiles and resolve base, local and server conflicts without losing pending work.",
  },
  {
    name: "mips-pipeline-workbench",
    roles: ["Systems engineer", "Software engineer", "Frontend engineer"],
    domains: ["Computer architecture", "Developer tools", "Education"],
    maturity: "validated",
    outcome:
      "Edit assembly and inspect real Rust pipeline and cache simulations beside an independent reference, saved history and exact exports.",
  },
  {
    name: "firmware-release-recovery-lab",
    roles: ["Firmware engineer", "Systems engineer", "Rust engineer"],
    domains: ["Firmware", "Reliability", "Security"],
    maturity: "validated",
    outcome:
      "Rehearse inert firmware packages, slot recovery and fleet faults with editable inputs, durable evidence and busy-state protection.",
  },
  {
    name: "ot-security-monitor-lab",
    roles: ["Security engineer", "IoT engineer", "Systems engineer"],
    domains: ["Industrial systems", "Detection engineering", "Protocols"],
    maturity: "validated",
    outcome:
      "Review passive captures, register coverage and policy changes with source-linked dispositions, literal search and exact exports.",
  },
  {
    name: "industrial-memory-protocol-workbench",
    roles: ["C++ engineer", "Systems engineer", "Security engineer"],
    domains: ["Protocols", "Industrial systems", "Security"],
    maturity: "validated",
    outcome:
      "Explore real C++ codec sessions and stream chunks with simulated writes, retry evidence, framing limits and exact saved reports.",
  },
  {
    name: "detection-engineering-lab",
    roles: ["Security engineer", "Detection engineer", "Data analyst"],
    domains: ["Detection engineering", "Incident response", "Security"],
    maturity: "validated",
    outcome:
      "Replay security events, compare rule and label changes and retain reasoned analyst dispositions beside original alerts.",
  },
  {
    name: "sre-observability-workbench",
    roles: ["Reliability engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Observability", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Inspect service objectives and real local telemetry drills with explicit windows, journey denominators and weakened-objective queues.",
  },
  {
    name: "gitops-platform-lab",
    roles: ["DevOps engineer", "Cloud engineer", "Platform engineer"],
    domains: ["GitOps", "Kubernetes", "CI/CD"],
    maturity: "validated",
    outcome:
      "Compare desired manifests with captured convergence, dependency readiness and freshness through a saved offline review workflow.",
  },
  {
    name: "container-runtime-security-lab",
    roles: ["Security engineer", "DevOps engineer", "Platform engineer"],
    domains: ["Container security", "Detection engineering", "Privacy"],
    maturity: "validated",
    outcome:
      "Triage supplied container episodes with editable policy and health inputs, pseudonymized identities and explicit visibility gaps.",
  },
  {
    name: "zero-trust-segmentation-lab",
    roles: ["Security engineer", "Network engineer", "DevOps engineer"],
    domains: ["Network security", "Zero trust", "Policy"],
    maturity: "validated",
    outcome:
      "Compare offline permission graphs and inspect continuity at policy and exception boundaries without granting live access.",
  },
  {
    name: "application-security-regression-lab",
    roles: ["Security engineer", "Backend engineer", "Software engineer"],
    domains: ["Application security", "Testing", "Security"],
    maturity: "validated",
    outcome:
      "Run four reference web-service engines and compare exact case outcomes, changed assertions and missing execution in a desktop app.",
  },
  {
    name: "cloud-identity-access-lab",
    roles: ["Security engineer", "Cloud engineer", "DevOps engineer"],
    domains: ["Identity", "Cloud security", "Policy"],
    maturity: "validated",
    outcome:
      "Verify signed fictional identities and compare closed-schema OPA entitlements with explicit reasons, context and retained history.",
  },
  {
    name: "ai-security-evaluation-lab",
    roles: ["Security engineer", "AI engineer", "Software engineer"],
    domains: ["AI security", "Testing", "Privacy"],
    maturity: "validated",
    outcome:
      "Review paired AI response snapshots with separate unsafe allowance, benign availability, completion and oracle-coverage evidence.",
  },
  {
    name: "infrastructure-policy-lab",
    roles: ["DevOps engineer", "Security engineer", "Cloud engineer"],
    domains: ["Infrastructure as code", "Policy", "Cloud security"],
    maturity: "validated",
    outcome:
      "Inspect infrastructure drift, replacement risk and exact-decimal costs with saved reviews that remain separate from policy gates.",
  },
  {
    name: "disaster-recovery-drill-lab",
    roles: ["DevOps engineer", "Reliability engineer", "Backend engineer"],
    domains: ["Disaster recovery", "Reliability", "Data protection"],
    maturity: "validated",
    outcome:
      "Compare captured restore candidates against explicit objectives, lost-record evidence and supplied timing in a desktop workspace.",
  },
  {
    name: "disconnected-release-kit",
    roles: ["DevOps engineer", "Security engineer", "Systems engineer"],
    domains: ["Supply-chain security", "Offline delivery", "CI/CD"],
    maturity: "validated",
    outcome:
      "Verify signed offline release candidates against selected trust and target identity, retaining exact evidence and no-overwrite exports.",
  },
  {
    name: "incident-response-evidence-kit",
    roles: ["Security engineer", "Incident responder", "Software engineer"],
    domains: ["Incident response", "Evidence integrity", "Security"],
    maturity: "validated",
    outcome:
      "Preserve local evidence, inspect UTC events and export minimized analyst handoffs with exact source-line and checkpoint bindings.",
  },
  {
    name: "secret-rotation-reliability-lab",
    roles: ["Security engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Secrets management", "Reliability", "Identity"],
    maturity: "validated",
    outcome:
      "Rehearse secret-free consumer handoffs through editable scripts, virtual time, generation acknowledgements and explicit drain evidence.",
  },
  {
    name: "vulnerability-prioritization-console",
    roles: ["Security engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Vulnerability management", "Risk analysis", "Security"],
    maturity: "validated",
    outcome:
      "Rank supplied vulnerabilities, compare assumptions and retain remediation queues, deadlines and identity changes in a desktop app.",
  },
  {
    name: "windows-identity-audit-lab",
    roles: ["Security engineer", "Systems engineer", "Software engineer"],
    domains: ["Windows security", "Identity", "Audit"],
    maturity: "validated",
    outcome:
      "Compare offline identity snapshots and inspect nested exposure, completeness, expiry and recertification queues through saved reports.",
  },
  {
    name: "network-defense-analysis-lab",
    roles: ["Security engineer", "Network engineer", "Data analyst"],
    domains: ["Network security", "Detection engineering", "Protocols"],
    maturity: "validated",
    outcome:
      "Investigate offline captures with the real Rust decoder, snapshot-bound filters, source-linked reviews and explicit visibility limits.",
  },
  {
    name: "memory-safety-analysis-lab",
    roles: ["Security engineer", "Systems engineer", "C++ engineer"],
    domains: ["Memory safety", "Systems", "Testing"],
    maturity: "validated",
    outcome:
      "Run fixed C++, Rust and Python parsers and reduce reproducible disagreements with shared budgets, exact history and exports.",
  },
  {
    name: "unity-tactical-ai-sandbox",
    roles: ["Game programmer", "Game designer", "AI engineer"],
    domains: ["Game AI", "Simulation", "Game technology"],
    maturity: "validated",
    outcome:
      "Author fictional game boards, replay the original C# simulation and compare bounded seeded encounters in a Windows designer.",
  },
  {
    name: "mqtt-lifecycle-reliability-lab",
    roles: ["IoT engineer", "Software engineer", "Reliability engineer"],
    domains: ["Industrial IoT", "Messaging", "Reliability"],
    maturity: "validated",
    outcome:
      "Edit offline message campaigns and inspect reconnect, TTL loss, duplicates and cold recovery through replayable checkpoints.",
  },
  {
    name: "offline-incident-timeline-pwa",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Offline-first", "Incident response", "Accessibility"],
    maturity: "validated",
    outcome:
      "Filter local incident JSON and CSV with exact UTC views and complete exports in a native origin that retains browser state.",
  },
  {
    name: "documentation-quality-gate",
    roles: ["Developer tools engineer", "Software engineer", "Technical writer"],
    domains: ["Documentation", "Static analysis", "CI/CD"],
    maturity: "validated",
    outcome:
      "Edit documentation with the original quality engine, retain accepted debt and inspect exact findings across durable revisions.",
  },
  {
    name: "versioned-product-knowledge-portal",
    roles: ["Frontend engineer", "Developer tools engineer", "Web developer"],
    domains: ["Documentation", "Search", "Accessibility"],
    maturity: "validated",
    outcome:
      "Author versioned product documentation, compare warnings and retain immutable catalog revisions with exact JSON and HTML exports.",
  },
  {
    name: "engineering-documentation-foundry",
    roles: ["Software engineer", "Technical writer", "Data engineer"],
    domains: ["Documentation", "Data pipelines", "Accessibility"],
    maturity: "validated",
    outcome:
      "Turn authorized PDFs into cited, immutable publications with editable registries, safety-change comparison, previews and exact exports.",
  },
  {
    name: "node-red-resilient-metadata",
    roles: ["IoT engineer", "Backend engineer", "Software engineer"],
    domains: ["Industrial IoT", "Integrations", "Node-RED"],
    maturity: "validated",
    outcome:
      "Author metadata projects and inspect real Node-RED retries, cancellation, redeployment and exact completion evidence in a desktop app.",
  },
  {
    name: "host-hardening-assurance-lab",
    roles: ["Security engineer", "DevOps engineer", "Systems engineer"],
    domains: ["Host security", "Policy", "Audit"],
    maturity: "validated",
    outcome:
      "Assess supplied host snapshots and inspect fleet drift, stale evidence, expected-host gaps and refresh queues in a desktop workspace.",
  },
  {
    name: "rmf-evidence-workbench",
    roles: ["Security engineer", "Compliance engineer", "Software engineer"],
    domains: ["Governance", "Evidence integrity", "Security"],
    maturity: "validated",
    outcome:
      "Compare scoped security evidence and supported OSCAL exports with freshness, integrity, risk and owner-calendar review queues.",
  },
  {
    name: "portfolio-case-study-site",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Portfolio", "Accessibility", "Developer experience"],
    maturity: "validated",
    outcome:
      "Explore ordered projects, case studies and source-bound evidence through the implemented offline portfolio reader and live site.",
  },
] as const satisfies readonly ProjectCuration[];
