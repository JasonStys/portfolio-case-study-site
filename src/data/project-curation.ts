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
    domains: ["AI developer tools", "Testing", "Security"],
    maturity: "validated",
    outcome:
      "Inspect source-bound diagnostics, coverage and unused-code candidates; navigate only to matching drafts.",
    featuredOrder: 1,
    caseStudySlug: "code-flow-studio",
  },
  {
    name: "business-knowledge-workbench",
    roles: ["Full-stack engineer", "Data engineer", "App developer"],
    domains: ["Document processing", "Data normalization", "Privacy"],
    maturity: "validated",
    outcome:
      "Standardize documents and units, search numeric ranges and export authorized record bundles.",
    featuredOrder: 2,
    caseStudySlug: "business-knowledge-workbench",
  },
  {
    name: "personal-image-model-studio",
    roles: ["Deep-learning engineer", "AI engineer", "App developer"],
    domains: ["Generative AI", "Machine learning", "Privacy"],
    maturity: "validated",
    outcome:
      "Review captions, declared provenance and bounded split similarities before local model training.",
    featuredOrder: 3,
    caseStudySlug: "personal-image-model-studio",
  },
  {
    name: "forge2d-engine",
    roles: ["Game engine engineer", "C++ engineer", "Game programmer"],
    domains: ["Game technology", "Systems", "Simulation"],
    maturity: "validated",
    outcome:
      "Build deterministic 2D games with collision layers, scene migration and overlap inspection.",
    caseStudySlug: "forge2d-engine",
    featuredOrder: 4,
  },
  {
    name: "secure-delivery-pipeline-lab",
    roles: ["DevOps engineer", "Security engineer", "Software engineer"],
    domains: ["CI/CD", "Supply-chain security", "Reliability"],
    maturity: "validated",
    outcome:
      "Review authenticated release changes, preserve deployment receipts and verify rollback trust.",
    featuredOrder: 5,
    caseStudySlug: "secure-delivery-pipeline-lab",
  },
  {
    name: "applicant-evidence-studio",
    roles: ["Full-stack engineer", "AI engineer", "Software engineer"],
    domains: ["Evidence review", "Privacy", "Accessibility"],
    maturity: "validated",
    outcome:
      "Compare authorized applicant evidence by criterion, with citations, unknowns and private exports.",
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
      "Diagnose job DAGs, retries and lease state through coherent snapshots and a PostgreSQL workflow.",
    caseStudySlug: "cloud-job-orchestrator",
  },
  {
    name: "integration-operations-console",
    roles: ["Full-stack engineer", "Backend engineer", "Software engineer"],
    domains: ["Integrations", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Search integration jobs, inspect captured audit history and download exact support reviews.",
    caseStudySlug: "integration-operations-console",
  },
  {
    name: "ml-model-lifecycle-observatory",
    roles: ["ML engineer", "AI engineer", "Backend engineer"],
    domains: ["Machine learning", "MLOps", "Observability"],
    maturity: "validated",
    outcome:
      "Review authenticated model release dossiers with recorded quality gates, history and drift context.",
    caseStudySlug: "ml-model-lifecycle-observatory",
  },
  {
    name: "player-telemetry-analytics-platform",
    roles: ["Data engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Analytics", "Game technology", "Data quality"],
    maturity: "validated",
    outcome:
      "Analyze player retention with receipt-time cutoffs and explicit mature versus incomplete cohorts.",
    caseStudySlug: "player-telemetry-analytics-platform",
  },
  {
    name: "industrial-edge-digital-twin",
    roles: ["C++ engineer", "IoT engineer", "Full-stack engineer"],
    domains: ["Industrial IoT", "Simulation", "Telemetry"],
    maturity: "validated",
    outcome:
      "Replay simulated industrial signals, faults and alarms with synchronized trends and read-only review.",
  },
  {
    name: "accessible-design-system-lab",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Accessibility", "Design systems", "Developer experience"],
    maturity: "validated",
    outcome:
      "Use accessible React tables with stable sorting, paging, preserved focus and clear status feedback.",
    caseStudySlug: "accessible-design-system-lab",
  },
  {
    name: "edge-vision-deployment-benchmark",
    roles: ["Deep-learning engineer", "ML engineer", "Systems engineer"],
    domains: ["Computer vision", "Edge computing", "Benchmarking"],
    maturity: "validated",
    outcome:
      "Compare inference runtimes across shared image conditions using per-class quality and calibration gates.",
  },
  {
    name: "secure-service-desk",
    roles: ["Full-stack engineer", "Backend engineer", "Web developer"],
    domains: ["Security", "Workflow systems", "Reliability"],
    maturity: "validated",
    outcome:
      "Manage tenant ticket ownership with version checks, atomic audit history and owner/SLA work queues.",
  },
  {
    name: "offline-first-field-app",
    roles: ["App developer", "Full-stack engineer", "C# engineer"],
    domains: ["Offline-first", "Synchronization", "Mobile"],
    maturity: "validated",
    outcome:
      "Resolve offline sync conflicts with explicit field choices and protection against stale overwrites.",
  },
  {
    name: "mips-pipeline-workbench",
    roles: ["Systems engineer", "Software engineer", "Frontend engineer"],
    domains: ["Computer architecture", "Developer tools", "Education"],
    maturity: "validated",
    outcome:
      "Inspect imported MIPS pipeline traces, navigate hazards and measure performance beyond display limits.",
  },
  {
    name: "firmware-release-recovery-lab",
    roles: ["Firmware engineer", "Systems engineer", "Rust engineer"],
    domains: ["Firmware", "Reliability", "Security"],
    maturity: "validated",
    outcome:
      "Rehearse simulated fleet updates with compatibility checks, trial outcomes and rollback safeguards.",
  },
  {
    name: "ot-security-monitor-lab",
    roles: ["Security engineer", "IoT engineer", "Systems engineer"],
    domains: ["Industrial systems", "Detection engineering", "Protocols"],
    maturity: "validated",
    outcome:
      "Audit passive Modbus read coverage by asset, function and address while keeping capture gaps visible.",
  },
  {
    name: "industrial-memory-protocol-workbench",
    roles: ["C++ engineer", "Systems engineer", "Security engineer"],
    domains: ["Protocols", "Industrial systems", "Security"],
    maturity: "validated",
    outcome:
      "Reassemble fragmented binary streams with bounded buffering and exact corruption and EOF offsets.",
  },
  {
    name: "detection-engineering-lab",
    roles: ["Security engineer", "Detection engineer", "Data analyst"],
    domains: ["Detection engineering", "Incident response", "Security"],
    maturity: "validated",
    outcome:
      "Compare detection rules on the same events and preserve alert evidence with reasoned analyst review.",
  },
  {
    name: "sre-observability-workbench",
    roles: ["Reliability engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Observability", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Compare service and user-journey SLOs over matched windows, exposing quality gaps and weakened targets.",
  },
  {
    name: "gitops-platform-lab",
    roles: ["DevOps engineer", "Cloud engineer", "Platform engineer"],
    domains: ["GitOps", "Kubernetes", "CI/CD"],
    maturity: "validated",
    outcome:
      "Verify GitOps convergence across desired and applied revisions, dependencies and evidence freshness.",
  },
  {
    name: "container-runtime-security-lab",
    roles: ["Security engineer", "DevOps engineer", "Platform engineer"],
    domains: ["Container security", "Detection engineering", "Privacy"],
    maturity: "validated",
    outcome:
      "Triage runtime alert episodes with coverage limits and human dispositions that preserve original evidence.",
  },
  {
    name: "zero-trust-segmentation-lab",
    roles: ["Security engineer", "Network engineer", "DevOps engineer"],
    domains: ["Network security", "Zero trust", "Policy"],
    maturity: "validated",
    outcome:
      "Review policy and exception expiry against owner-defined access continuity requirements.",
  },
  {
    name: "application-security-regression-lab",
    roles: ["Security engineer", "Backend engineer", "Software engineer"],
    domains: ["Application security", "Testing", "Security"],
    maturity: "validated",
    outcome:
      "Compare saved HTTP security regressions while exposing changed assertions and unexecuted cases.",
  },
  {
    name: "cloud-identity-access-lab",
    roles: ["Security engineer", "Cloud engineer", "DevOps engineer"],
    domains: ["Identity", "Cloud security", "Policy"],
    maturity: "validated",
    outcome:
      "Compare signed access-policy decisions across MFA, expiry and authenticated registry contexts.",
  },
  {
    name: "ai-security-evaluation-lab",
    roles: ["Security engineer", "AI engineer", "Software engineer"],
    domains: ["AI security", "Testing", "Privacy"],
    maturity: "validated",
    outcome:
      "Replay reviewed AI security cases and separate unsafe allowances from unavailable or untested behavior.",
  },
  {
    name: "infrastructure-policy-lab",
    roles: ["DevOps engineer", "Security engineer", "Cloud engineer"],
    domains: ["Infrastructure as code", "Policy", "Cloud security"],
    maturity: "validated",
    outcome:
      "Review infrastructure drift and replacements with plan-bound receipts that preserve policy gates.",
  },
  {
    name: "disaster-recovery-drill-lab",
    roles: ["DevOps engineer", "Reliability engineer", "Backend engineer"],
    domains: ["Disaster recovery", "Reliability", "Data protection"],
    maturity: "validated",
    outcome:
      "Compare measured recovery candidates, data loss and retention choices without deleting backups.",
  },
  {
    name: "disconnected-release-kit",
    roles: ["DevOps engineer", "Security engineer", "Systems engineer"],
    domains: ["Supply-chain security", "Offline delivery", "CI/CD"],
    maturity: "validated",
    outcome:
      "Review authenticated offline release contents and inventories with state-bound, non-executing receipts.",
  },
  {
    name: "incident-response-evidence-kit",
    roles: ["Security engineer", "Incident responder", "Software engineer"],
    domains: ["Incident response", "Evidence integrity", "Security"],
    maturity: "validated",
    outcome:
      "Bookmark verified incident evidence by digest and line, then export minimized, traceable handoffs.",
  },
  {
    name: "secret-rotation-reliability-lab",
    roles: ["Security engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Secrets management", "Reliability", "Identity"],
    maturity: "validated",
    outcome:
      "Review secret rotation by generation, consumer acknowledgement, drain state and expiry.",
  },
  {
    name: "vulnerability-prioritization-console",
    roles: ["Security engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Vulnerability management", "Risk analysis", "Security"],
    maturity: "validated",
    outcome:
      "Compare vulnerability evidence and owner deadlines without treating absent findings as proven fixes.",
  },
  {
    name: "windows-identity-audit-lab",
    roles: ["Security engineer", "Systems engineer", "Software engineer"],
    domains: ["Windows security", "Identity", "Audit"],
    maturity: "validated",
    outcome:
      "Review nested identity exposure, source completeness and owner recertification deadlines.",
  },
  {
    name: "network-defense-analysis-lab",
    roles: ["Security engineer", "Network engineer", "Data analyst"],
    domains: ["Network security", "Detection engineering", "Protocols"],
    maturity: "validated",
    outcome:
      "Filter captured network events by UTC, protocol and severity with snapshot paging and visible data gaps.",
  },
  {
    name: "memory-safety-analysis-lab",
    roles: ["Security engineer", "Systems engineer", "C++ engineer"],
    domains: ["Memory safety", "Systems", "Testing"],
    maturity: "validated",
    outcome:
      "Minimize reproducible parser disagreements under shared budgets, preserving unstable outcomes.",
  },
  {
    name: "unity-tactical-ai-sandbox",
    roles: ["Game programmer", "Game designer", "AI engineer"],
    domains: ["Game AI", "Simulation", "Game technology"],
    maturity: "validated",
    outcome:
      "Inspect deterministic game replays with timeline scrubbing, terrain and independent bot diagnostics.",
  },
  {
    name: "mqtt-lifecycle-reliability-lab",
    roles: ["IoT engineer", "Software engineer", "Reliability engineer"],
    domains: ["Industrial IoT", "Messaging", "Reliability"],
    maturity: "validated",
    outcome:
      "Recover bounded MQTT outboxes with original TTLs, explicit losses and retained failed publishes.",
  },
  {
    name: "offline-incident-timeline-pwa",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Offline-first", "Incident response", "Accessibility"],
    maturity: "validated",
    outcome:
      "Investigate local incident logs with UTC filters, shareable query state and offline restoration.",
  },
  {
    name: "documentation-quality-gate",
    roles: ["Developer tools engineer", "Software engineer", "Technical writer"],
    domains: ["Documentation", "Static analysis", "CI/CD"],
    maturity: "validated",
    outcome:
      "Track documentation debt by exact location and refresh baselines without losing unexamined findings.",
  },
  {
    name: "versioned-product-knowledge-portal",
    roles: ["Frontend engineer", "Developer tools engineer", "Web developer"],
    domains: ["Documentation", "Search", "Accessibility"],
    maturity: "validated",
    outcome:
      "Compare documentation editions beside canonical sources, warnings and missing counterparts.",
  },
  {
    name: "engineering-documentation-foundry",
    roles: ["Software engineer", "Technical writer", "Data engineer"],
    domains: ["Documentation", "Data pipelines", "Accessibility"],
    maturity: "validated",
    outcome:
      "Publish accessible documentation and compare source-cited revisions, including safety-warning changes.",
  },
  {
    name: "node-red-resilient-metadata",
    roles: ["IoT engineer", "Backend engineer", "Software engineer"],
    domains: ["Industrial IoT", "Integrations", "Node-RED"],
    maturity: "validated",
    outcome:
      "Recover metadata lookups with bounded Retry-After delays, rate-limit spacing and cancellation.",
  },
  {
    name: "host-hardening-assurance-lab",
    roles: ["Security engineer", "DevOps engineer", "Systems engineer"],
    domains: ["Host security", "Policy", "Audit"],
    maturity: "validated",
    outcome:
      "Review host-hardening evidence against expected inventory, policies and owner refresh queues.",
  },
  {
    name: "rmf-evidence-workbench",
    roles: ["Security engineer", "Compliance engineer", "Software engineer"],
    domains: ["Governance", "Evidence integrity", "Security"],
    maturity: "validated",
    outcome:
      "Maintain scoped OSCAL evidence with owner calendars, freshness checks and risk/milestone queues.",
  },
  {
    name: "portfolio-case-study-site",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Portfolio", "Accessibility", "Developer experience"],
    maturity: "validated",
    outcome:
      "Explore ranked projects through searchable case studies, technical rationale and validation links.",
  },
] as const satisfies readonly ProjectCuration[];
