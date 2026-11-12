/**
 * @file Jason Stys's reviewed civilian space/energy portfolio collection and highlight rationale.
 * Functions: none; data-only curation shared by the homepage, collection and complete catalog.
 * Variables: spaceSystemsCuration, spaceHighlightNames; order is editorial, not certification.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import type { ProjectCuration } from "@/lib/types";

export const spaceHighlightNames = [
  "spacecraft-flight-software-testbed",
  "spacecraft-telemetry-anomaly-studio",
  "mission-contact-resource-scheduler",
  "mission-verification-evidence-kit",
] as const;

export const spaceSystemsCuration = [
  {
    name: "spacecraft-flight-software-testbed",
    roles: ["Flight software engineer", "C++ engineer", "Systems engineer"],
    domains: ["Space systems", "Fault recovery", "Simulation"],
    maturity: "validated",
    outcome:
      "Explore fictional onboard transitions and fault recovery against delayed or missing observations in a portable simulator.",
    caseStudySlug: "spacecraft-flight-software-testbed",
  },
  {
    name: "spacecraft-telemetry-anomaly-studio",
    roles: ["Data scientist", "Systems engineer", "Software engineer"],
    domains: ["Space systems", "Telemetry", "Statistical learning"],
    maturity: "validated",
    outcome:
      "Investigate telemetry episodes with explicit gaps, modes, censored recovery and detached review annotations in a portable app.",
    caseStudySlug: "spacecraft-telemetry-anomaly-studio",
  },
  {
    name: "mission-contact-resource-scheduler",
    roles: ["Software engineer", "Operations research engineer", "Systems engineer"],
    domains: ["Space systems", "Optimization", "Resource scheduling"],
    maturity: "validated",
    outcome:
      "Compare fictional contact schedules before and after station loss, with exact resource limits and retained-plan evidence.",
    caseStudySlug: "mission-contact-resource-scheduler",
  },
  {
    name: "spacecraft-power-thermal-lab",
    roles: ["C++ engineer", "Simulation engineer", "Systems engineer"],
    domains: ["Space systems", "Scientific computing", "Energy"],
    maturity: "validated",
    outcome:
      "Explore fictional power and thermal traces with per-load shortfall, interruption episodes and explicit science shedding.",
  },
  {
    name: "mission-verification-evidence-kit",
    roles: ["Verification engineer", "Systems engineer", "Developer tools engineer"],
    domains: ["Space systems", "Requirements traceability", "Software assurance"],
    maturity: "validated",
    outcome:
      "Inspect stale requirement evidence, component dependencies and a scoped revalidation queue through a desktop review workflow.",
    caseStudySlug: "mission-verification-evidence-kit",
  },
  {
    name: "orbital-safety-workbench",
    roles: ["Simulation engineer", "Software engineer", "Systems engineer"],
    domains: ["Space systems", "Orbital modeling", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Explore civilian screening windows, tangencies and sampled-orbit uncertainty with editable scenarios and graphical replay.",
  },
  {
    name: "ccsds-telemetry-integrity-lab",
    roles: ["Rust engineer", "Systems engineer", "Software engineer"],
    domains: ["Space systems", "Binary protocols", "Data integrity"],
    maturity: "validated",
    outcome:
      "Inspect packet timelines, provisional gaps and late recovery while preserving original per-APID continuity decisions.",
  },
  {
    name: "delay-tolerant-mission-network-lab",
    roles: ["Rust engineer", "Network engineer", "Systems engineer"],
    domains: ["Space systems", "Store-and-forward networking", "Reliability"],
    maturity: "validated",
    outcome:
      "Trace fictional message delivery through queue, hop, expiry and bottleneck waterfalls with exact timing exports.",
  },
  {
    name: "earth-observation-change-studio",
    roles: ["Geospatial developer", "Data scientist", "Software engineer"],
    domains: ["Space systems", "Earth observation", "Data quality"],
    maturity: "validated",
    outcome:
      "Review mapped environmental-change candidates with crop edges, excluded regions, unknown context and matching geospatial exports.",
  },
  {
    name: "mission-clock-integrity-lab",
    roles: ["C++ engineer", "Rust engineer", "Systems engineer"],
    domains: ["Space systems", "Timing integrity", "Distributed systems"],
    maturity: "validated",
    outcome:
      "Inspect uncertain event ordering through interval edges and alternative frontiers without forcing unsupported chronology.",
  },
  {
    name: "resilient-energy-microgrid-lab",
    roles: ["Simulation engineer", "Software engineer", "Data analyst"],
    domains: ["Space systems", "Energy", "Resilience"],
    maturity: "validated",
    outcome:
      "Compare modeled dispatch policies under identical feeder loss, with explicit unmet demand and checked energy accounting.",
  },
  {
    name: "scientific-sensor-calibration-lab",
    roles: ["C# engineer", "Scientific software engineer", "Data analyst"],
    domains: ["Space systems", "Metrology", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Inspect calibration uncertainty contributions, signed covariance terms and withheld components in a portable review workflow.",
  },
  {
    name: "space-weather-impact-observatory",
    roles: ["Data analyst", "Scientific software engineer", "Systems engineer"],
    domains: ["Space systems", "Space weather", "Data provenance"],
    maturity: "validated",
    outcome:
      "Compare forecast scores by lead time and observation window while preserving unknown issuance states and coverage denominators.",
  },
  {
    name: "reactor-systems-simulator",
    roles: ["Simulation engineer", "Scientific software engineer", "Software engineer"],
    domains: ["Space systems", "Energy", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Compare matched forcing scenarios in a fictional dimensionless thermal model with graphical traces and exact baseline exports.",
  },
] as const satisfies readonly ProjectCuration[];
