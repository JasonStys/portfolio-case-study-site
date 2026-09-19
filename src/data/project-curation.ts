/**
 * @file Curates employer-facing roles, domains, outcomes, maturity, and featured ordering.
 * Functions: none; exports reviewed project presentation metadata.
 * Variables: projectCuration, a unique-name immutable project list.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import type { ProjectCuration } from "@/lib/types";

export const projectCuration = [
  {
    name: "integration-operations-console",
    roles: ["Full-stack engineer", "Backend engineer", "Software engineer"],
    domains: ["Integrations", "Reliability", "Operations"],
    maturity: "validated",
    outcome:
      "Makes retries, rate limits, audit trails, and dead-letter recovery inspectable end to end.",
    featuredOrder: 1,
    caseStudySlug: "integration-operations-console",
  },
  {
    name: "player-telemetry-analytics-platform",
    roles: ["Data engineer", "Data analyst", "Full-stack engineer"],
    domains: ["Analytics", "Game technology", "Data quality"],
    maturity: "validated",
    outcome:
      "Turns synthetic player events into tested funnels, cohorts, timelines, and anomaly reviews.",
    featuredOrder: 2,
    caseStudySlug: "player-telemetry-analytics-platform",
  },
  {
    name: "ml-model-lifecycle-observatory",
    roles: ["ML engineer", "AI engineer", "Backend engineer"],
    domains: ["Machine learning", "MLOps", "Observability"],
    maturity: "validated",
    outcome:
      "Demonstrates promotion gates, drift detection, canary routing, monitoring, and rollback.",
    featuredOrder: 3,
    caseStudySlug: "ml-model-lifecycle-observatory",
  },
  {
    name: "forge2d-engine",
    roles: ["Game engine engineer", "C++ engineer", "Game programmer"],
    domains: ["Game technology", "Systems", "Simulation"],
    maturity: "validated",
    outcome:
      "Combines a sparse-set ECS, deterministic replays, A*, collision broadphase, fuzzing, and SDL3.",
    featuredOrder: 4,
    caseStudySlug: "forge2d-engine",
  },
  {
    name: "accessible-design-system-lab",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Accessibility", "Design systems", "Developer experience"],
    maturity: "validated",
    outcome:
      "Packages native-first React components with Storybook, accessibility evidence, and bundle budgets.",
    featuredOrder: 5,
    caseStudySlug: "accessible-design-system-lab",
  },
  {
    name: "cloud-job-orchestrator",
    roles: ["Cloud engineer", "Backend engineer", "DevOps engineer"],
    domains: ["Distributed systems", "Cloud computing", "Operations"],
    maturity: "validated",
    outcome:
      "Builds a safe DAG control plane with leases, observability, Kubernetes, and Terraform.",
    featuredOrder: 6,
    caseStudySlug: "cloud-job-orchestrator",
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
    name: "unity-tactical-ai-sandbox",
    roles: ["Game programmer", "Game designer", "AI engineer"],
    domains: ["Game AI", "Simulation", "Game technology"],
    maturity: "validated",
    outcome:
      "Explores deterministic A*, utility decisions, replay verification, and Unity integration.",
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
    name: "offline-incident-timeline-pwa",
    roles: ["Frontend engineer", "Web developer", "Software engineer"],
    domains: ["Offline-first", "Incident response", "Accessibility"],
    maturity: "validated",
    outcome:
      "Processes large local incident logs with Web Workers, IndexedDB, visualization, and PWA recovery.",
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
    name: "industrial-edge-digital-twin",
    roles: ["C++ engineer", "IoT engineer", "Full-stack engineer"],
    domains: ["Industrial IoT", "Simulation", "Telemetry"],
    maturity: "validated",
    outcome:
      "Pairs a deterministic C++ process twin with typed edge APIs, MQTT telemetry, faults, and an HMI.",
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
    name: "documentation-quality-gate",
    roles: ["Developer tools engineer", "Software engineer", "Technical writer"],
    domains: ["Documentation", "Static analysis", "CI/CD"],
    maturity: "validated",
    outcome:
      "Provides deterministic document diagnostics, expiring suppressions, SARIF, and accessible reports.",
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
    name: "industrial-memory-protocol-workbench",
    roles: ["C++ engineer", "Systems engineer", "Security engineer"],
    domains: ["Protocols", "Industrial systems", "Security"],
    maturity: "validated",
    outcome:
      "Exercises defensive binary parsing with packet traces, fault injection, fuzzing, and sanitizers.",
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
] as const satisfies readonly ProjectCuration[];
