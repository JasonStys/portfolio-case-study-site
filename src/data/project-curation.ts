/**
 * @file Curates reviewed roles, domains, outcomes, maturity, and six featured cases.
 * Functions: none; exports presentation data in canonical portfolio-priority order.
 * Variables: projectCuration; exact file/declaration locations are indexed below.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import type { ProjectCuration } from "@/lib/types";

export const projectCuration = [
  {
    name: "code-flow-studio",
    roles: ["AI engineer", "Full-stack engineer", "Developer tools engineer"],
    domains: ["AI developer tools", "Testing", "Security"],
    maturity: "validated",
    outcome:
      "Connects a polyglot editor, isolated compiler workers, bounded fuzzing, revision evidence, and private local accounts.",
    featuredOrder: 1,
    caseStudySlug: "code-flow-studio",
  },
  {
    name: "business-knowledge-workbench",
    roles: ["Full-stack engineer", "Data engineer", "App developer"],
    domains: ["Document processing", "Analytics", "Privacy"],
    maturity: "validated",
    outcome:
      "Combines HTML-first document ingestion, dimension-safe units, provenance, role previews, and encrypted local workspaces.",
    featuredOrder: 2,
    caseStudySlug: "business-knowledge-workbench",
  },
  {
    name: "personal-image-model-studio",
    roles: ["Deep-learning engineer", "AI engineer", "App developer"],
    domains: ["Generative AI", "Machine learning", "Privacy"],
    maturity: "validated",
    outcome:
      "Trains a real caption-conditioned image model with held-out evaluation, rights-aware datasets, and encrypted local accounts.",
    featuredOrder: 3,
    caseStudySlug: "personal-image-model-studio",
  },
  {
    name: "forge2d-engine",
    roles: ["Game engine engineer", "C++ engineer", "Game programmer"],
    domains: ["Game technology", "Systems", "Simulation"],
    maturity: "validated",
    outcome:
      "Combines a sparse-set ECS, deterministic replays, A*, collision broadphase, fuzzing, and SDL3.",
    caseStudySlug: "forge2d-engine",
    featuredOrder: 4,
  },
  {
    name: "secure-delivery-pipeline-lab",
    roles: ["DevOps engineer", "Security engineer", "Software engineer"],
    domains: ["CI/CD", "Supply-chain security", "Reliability"],
    maturity: "validated",
    outcome:
      "Verifies signed build identity, SBOMs, tamper resistance, staged promotion, and independently authenticated rollback.",
    featuredOrder: 5,
    caseStudySlug: "secure-delivery-pipeline-lab",
  },
  {
    name: "applicant-evidence-studio",
    roles: ["Full-stack engineer", "AI engineer", "Software engineer"],
    domains: ["Evidence review", "Privacy", "Accessibility"],
    maturity: "validated",
    outcome:
      "Links job-relevant skills to source evidence, preserves education uncertainty, and offers factual resume coaching without automated hiring.",
    featuredOrder: 6,
    caseStudySlug: "applicant-evidence-studio",
  },
  {
    name: "cloud-job-orchestrator",
    roles: ["Cloud engineer", "Backend engineer", "DevOps engineer"],
    domains: ["Distributed systems", "Cloud computing", "Operations"],
    maturity: "validated",
    outcome:
      "Builds a safe DAG control plane with leases, observability, Kubernetes, and Terraform.",
    caseStudySlug: "cloud-job-orchestrator",
  },
  {
    name: "integration-operations-console",
    roles: ["Full-stack engineer", "Backend engineer", "Software engineer"],
    domains: ["Integrations", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Makes retries, rate limits, audit trails, and dead-letter recovery inspectable end to end.",
    caseStudySlug: "integration-operations-console",
  },
  {
    name: "ml-model-lifecycle-observatory",
    roles: ["ML engineer", "AI engineer", "Backend engineer"],
    domains: ["Machine learning", "MLOps", "Observability"],
    maturity: "validated",
    outcome:
      "Demonstrates promotion gates, drift detection, canary routing, monitoring, and rollback.",
    caseStudySlug: "ml-model-lifecycle-observatory",
  },
  {
    name: "player-telemetry-analytics-platform",
    roles: ["Data engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Analytics", "Game technology", "Data quality"],
    maturity: "validated",
    outcome:
      "Turns synthetic player events into tested funnels, cohorts, timelines, and anomaly reviews.",
    caseStudySlug: "player-telemetry-analytics-platform",
  },
  {
    name: "industrial-edge-digital-twin",
    roles: ["C++ engineer", "IoT engineer", "Full-stack engineer"],
    domains: ["Industrial IoT", "Simulation", "Telemetry"],
    maturity: "validated",
    outcome:
      "Pairs a deterministic C++ process twin with typed edge APIs, MQTT telemetry, faults, and an HMI.",
  },
  {
    name: "accessible-design-system-lab",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Accessibility", "Design systems", "Developer experience"],
    maturity: "validated",
    outcome:
      "Packages native-first React components with Storybook, accessibility evidence, and bundle budgets.",
    caseStudySlug: "accessible-design-system-lab",
  },
  {
    name: "edge-vision-deployment-benchmark",
    roles: ["Deep-learning engineer", "ML engineer", "Systems engineer"],
    domains: ["Computer vision", "Edge computing", "Benchmarking"],
    maturity: "validated",
    outcome:
      "Compares reproducible ONNX inference across Python, C++, and Rust with quantization analysis.",
  },
  {
    name: "secure-service-desk",
    roles: ["Full-stack engineer", "Backend engineer", "Web developer"],
    domains: ["Security", "Workflow systems", "Reliability"],
    maturity: "validated",
    outcome:
      "Models multi-tenant support workflows with an outbox, signed webhooks, and auditable state.",
  },
  {
    name: "offline-first-field-app",
    roles: ["App developer", "Full-stack engineer", "C# engineer"],
    domains: ["Offline-first", "Synchronization", "Mobile"],
    maturity: "validated",
    outcome:
      "Demonstrates transactional SQLite sync, conflict handling, and a compatible ASP.NET Core API.",
  },
  {
    name: "mips-pipeline-workbench",
    roles: ["Systems engineer", "Software engineer", "Frontend engineer"],
    domains: ["Computer architecture", "Developer tools", "Education"],
    maturity: "validated",
    outcome:
      "Connects assembly, emulation, a five-stage pipeline, cache behavior, and an accessible trace UI.",
  },
  {
    name: "firmware-release-recovery-lab",
    roles: ["Firmware engineer", "Systems engineer", "Rust engineer"],
    domains: ["Firmware", "Reliability", "Security"],
    maturity: "validated",
    outcome:
      "Simulates signed A/B updates, bounded trial boots, rollback, and power-loss recovery.",
  },
  {
    name: "ot-security-monitor-lab",
    roles: ["Security engineer", "IoT engineer", "Systems engineer"],
    domains: ["Industrial systems", "Detection engineering", "Protocols"],
    maturity: "validated",
    outcome:
      "Analyzes bounded Modbus captures against asset baselines and scoped maintenance windows without contacting industrial devices.",
  },
  {
    name: "industrial-memory-protocol-workbench",
    roles: ["C++ engineer", "Systems engineer", "Security engineer"],
    domains: ["Protocols", "Industrial systems", "Security"],
    maturity: "validated",
    outcome:
      "Exercises defensive binary parsing with packet traces, fault injection, fuzzing, and sanitizers.",
  },
  {
    name: "detection-engineering-lab",
    roles: ["Security engineer", "Detection engineer", "Data analyst"],
    domains: ["Detection engineering", "Incident response", "Security"],
    maturity: "validated",
    outcome:
      "Evaluates synthetic endpoint and cloud events with explainable rules, correlation windows, and false-positive evidence.",
  },
  {
    name: "sre-observability-workbench",
    roles: ["Reliability engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Observability", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Traces real service calls through telemetry and exact SLO burn-rate checks with finite fault and recovery scenarios.",
  },
  {
    name: "gitops-platform-lab",
    roles: ["DevOps engineer", "Cloud engineer", "Platform engineer"],
    domains: ["GitOps", "Kubernetes", "CI/CD"],
    maturity: "validated",
    outcome:
      "Tests declarative platform reconciliation, promotion policies, drift handling, and recovery in an isolated cluster lab.",
  },
  {
    name: "container-runtime-security-lab",
    roles: ["Security engineer", "DevOps engineer", "Platform engineer"],
    domains: ["Container security", "Detection engineering", "Privacy"],
    maturity: "validated",
    outcome:
      "Combines Falco replay checks with live isolated container probes and privacy-preserving runtime evidence.",
  },
  {
    name: "zero-trust-segmentation-lab",
    roles: ["Security engineer", "Network engineer", "DevOps engineer"],
    domains: ["Network security", "Zero trust", "Policy"],
    maturity: "validated",
    outcome:
      "Checks admission boundaries and real Linux IPv4 TCP segmentation with synthetic identities and explicit trust limits.",
  },
  {
    name: "application-security-regression-lab",
    roles: ["Security engineer", "Backend engineer", "Software engineer"],
    domains: ["Application security", "Testing", "Security"],
    maturity: "validated",
    outcome:
      "Exercises four native services with authorization, session isolation, negative HTTP cases, and concurrency regressions.",
  },
  {
    name: "cloud-identity-access-lab",
    roles: ["Security engineer", "Cloud engineer", "DevOps engineer"],
    domains: ["Identity", "Cloud security", "Policy"],
    maturity: "validated",
    outcome:
      "Validates Ed25519 tokens and least-privilege policies with typed reviews and provider-free IAM fixtures.",
  },
  {
    name: "ai-security-evaluation-lab",
    roles: ["Security engineer", "AI engineer", "Software engineer"],
    domains: ["AI security", "Testing", "Privacy"],
    maturity: "validated",
    outcome:
      "Evaluates tenant, approval, schema, canary, and integrity boundaries using reproducible offline agent fixtures.",
  },
  {
    name: "infrastructure-policy-lab",
    roles: ["DevOps engineer", "Security engineer", "Cloud engineer"],
    domains: ["Infrastructure as code", "Policy", "Cloud security"],
    maturity: "validated",
    outcome:
      "Checks infrastructure policy against explicit allowed and denied fixtures before deployment.",
  },
  {
    name: "disaster-recovery-drill-lab",
    roles: ["DevOps engineer", "Reliability engineer", "Backend engineer"],
    domains: ["Disaster recovery", "Reliability", "Data protection"],
    maturity: "validated",
    outcome:
      "Restores encrypted backups and isolated PostgreSQL data while measuring RPO, RTO, and failure budgets.",
  },
  {
    name: "disconnected-release-kit",
    roles: ["DevOps engineer", "Security engineer", "Systems engineer"],
    domains: ["Supply-chain security", "Offline delivery", "CI/CD"],
    maturity: "validated",
    outcome:
      "Builds independently verified signed offline bundles with staged activation and a hash-locked wheelhouse.",
  },
  {
    name: "incident-response-evidence-kit",
    roles: ["Security engineer", "Incident responder", "Software engineer"],
    domains: ["Incident response", "Evidence integrity", "Security"],
    maturity: "validated",
    outcome:
      "Organizes synthetic incident evidence with reproducible integrity checks and traceable investigation records.",
  },
  {
    name: "secret-rotation-reliability-lab",
    roles: ["Security engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Secrets management", "Reliability", "Identity"],
    maturity: "validated",
    outcome:
      "Tests real OpenBao and PostgreSQL credential handoff, expiry, revocation, and bounded outage recovery.",
  },
  {
    name: "vulnerability-prioritization-console",
    roles: ["Security engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Vulnerability management", "Risk analysis", "Security"],
    maturity: "validated",
    outcome:
      "Prioritizes supplied findings using exposure, applicability, confidence, and dated remediation evidence—not live scanning.",
  },
  {
    name: "windows-identity-audit-lab",
    roles: ["Security engineer", "Systems engineer", "Software engineer"],
    domains: ["Windows security", "Identity", "Audit"],
    maturity: "validated",
    outcome:
      "Reviews read-only SID and group metadata with nested-membership, cycle, and unknown-identity handling.",
  },
  {
    name: "network-defense-analysis-lab",
    roles: ["Security engineer", "Network engineer", "Data analyst"],
    domains: ["Network security", "Detection engineering", "Protocols"],
    maturity: "validated",
    outcome:
      "Analyzes supplied synthetic traffic evidence with bounded parsing and documented detection limitations.",
  },
  {
    name: "memory-safety-analysis-lab",
    roles: ["Security engineer", "Systems engineer", "C++ engineer"],
    domains: ["Memory safety", "Systems", "Testing"],
    maturity: "validated",
    outcome:
      "Pairs native memory-safety checks, sanitizer evidence, and defensive regression fixtures.",
  },
  {
    name: "unity-tactical-ai-sandbox",
    roles: ["Game programmer", "Game designer", "AI engineer"],
    domains: ["Game AI", "Simulation", "Game technology"],
    maturity: "validated",
    outcome:
      "Explores deterministic A*, utility decisions, replay verification, and Unity integration.",
  },
  {
    name: "mqtt-lifecycle-reliability-lab",
    roles: ["IoT engineer", "Software engineer", "Reliability engineer"],
    domains: ["Industrial IoT", "Messaging", "Reliability"],
    maturity: "validated",
    outcome:
      "Makes MQTT ordering, retained state, ACL behavior, fault injection, and bounded buffering measurable.",
  },
  {
    name: "offline-incident-timeline-pwa",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Offline-first", "Incident response", "Accessibility"],
    maturity: "validated",
    outcome:
      "Processes large local incident logs with Web Workers, IndexedDB, visualization, and PWA recovery.",
  },
  {
    name: "documentation-quality-gate",
    roles: ["Developer tools engineer", "Software engineer", "Technical writer"],
    domains: ["Documentation", "Static analysis", "CI/CD"],
    maturity: "validated",
    outcome:
      "Provides deterministic document diagnostics, expiring suppressions, SARIF, and accessible reports.",
  },
  {
    name: "versioned-product-knowledge-portal",
    roles: ["Frontend engineer", "Developer tools engineer", "Web developer"],
    domains: ["Documentation", "Search", "Accessibility"],
    maturity: "validated",
    outcome:
      "Builds version-aware product search with relevance evaluation, citations, provenance, and static output.",
  },
  {
    name: "engineering-documentation-foundry",
    roles: ["Software engineer", "Technical writer", "Data engineer"],
    domains: ["Documentation", "Data pipelines", "Accessibility"],
    maturity: "validated",
    outcome:
      "Migrates synthetic PDFs into accessible HTML with provenance and deterministic quality gates.",
  },
  {
    name: "node-red-resilient-metadata",
    roles: ["IoT engineer", "Backend engineer", "Software engineer"],
    domains: ["Industrial IoT", "Integrations", "Node-RED"],
    maturity: "validated",
    outcome:
      "Adds credential-safe, bounded metadata lookups with cancellation and structured lifecycle errors.",
  },
  {
    name: "host-hardening-assurance-lab",
    roles: ["Security engineer", "DevOps engineer", "Systems engineer"],
    domains: ["Host security", "Policy", "Audit"],
    maturity: "validated",
    outcome:
      "Tests host-hardening evidence and explicit policy exceptions without silently changing the workstation.",
  },
  {
    name: "rmf-evidence-workbench",
    roles: ["Security engineer", "Compliance engineer", "Software engineer"],
    domains: ["Governance", "Evidence integrity", "Security"],
    maturity: "validated",
    outcome:
      "Links six OSCAL model types to hashed artifacts, observations, milestones, and fictional authorization history.",
  },
  {
    name: "portfolio-case-study-site",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Portfolio", "Accessibility", "Developer experience"],
    maturity: "validated",
    outcome:
      "Provides the ranked, searchable navigation hub with schema-checked case studies and static delivery budgets.",
  },
] as const satisfies readonly ProjectCuration[];
