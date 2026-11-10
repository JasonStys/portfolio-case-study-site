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
      "Simulate spacecraft software faults and compare onboard transitions with downlinked evidence.",
    caseStudySlug: "spacecraft-flight-software-testbed",
  },
  {
    name: "spacecraft-telemetry-anomaly-studio",
    roles: ["Data scientist", "Systems engineer", "Software engineer"],
    domains: ["Space systems", "Telemetry", "Statistical learning"],
    maturity: "validated",
    outcome:
      "Investigate telemetry alert episodes with recovery, data gaps, boundary limits and human review.",
    caseStudySlug: "spacecraft-telemetry-anomaly-studio",
  },
  {
    name: "mission-contact-resource-scheduler",
    roles: ["Software engineer", "Operations research engineer", "Systems engineer"],
    domains: ["Space systems", "Optimization", "Resource scheduling"],
    maturity: "validated",
    outcome:
      "Replan bounded ground-station contacts during outages and inspect changed resource allocations.",
    caseStudySlug: "mission-contact-resource-scheduler",
  },
  {
    name: "spacecraft-power-thermal-lab",
    roles: ["C++ engineer", "Simulation engineer", "Systems engineer"],
    domains: ["Space systems", "Scientific computing", "Energy"],
    maturity: "validated",
    outcome:
      "Simulate spacecraft power and heat, tracing unmet loads and interrupted-service recovery.",
  },
  {
    name: "mission-verification-evidence-kit",
    roles: ["Verification engineer", "Systems engineer", "Developer tools engineer"],
    domains: ["Space systems", "Requirements traceability", "Software assurance"],
    maturity: "validated",
    outcome:
      "Trace mission requirements to evidence and prioritize stale or missing revalidation work.",
    caseStudySlug: "mission-verification-evidence-kit",
  },
  {
    name: "orbital-safety-workbench",
    roles: ["Simulation engineer", "Software engineer", "Systems engineer"],
    domains: ["Space systems", "Orbital modeling", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Explore civilian close-approach simulations with threshold windows and explicit sampling limits.",
  },
  {
    name: "ccsds-telemetry-integrity-lab",
    roles: ["Rust engineer", "Systems engineer", "Software engineer"],
    domains: ["Space systems", "Binary protocols", "Data integrity"],
    maturity: "validated",
    outcome:
      "Inspect packet continuity by APID, with provisional gaps, late recovery and ambiguous sequence history.",
  },
  {
    name: "delay-tolerant-mission-network-lab",
    roles: ["Rust engineer", "Network engineer", "Systems engineer"],
    domains: ["Space systems", "Store-and-forward networking", "Reliability"],
    maturity: "validated",
    outcome:
      "Replay delayed message delivery and explain queue, hop, expiry and contact bottlenecks.",
  },
  {
    name: "earth-observation-change-studio",
    roles: ["Geospatial developer", "Data scientist", "Software engineer"],
    domains: ["Space systems", "Earth observation", "Data quality"],
    maturity: "validated",
    outcome:
      "Review mapped image changes with crop-edge, excluded-area and unknown-context overlays.",
  },
  {
    name: "mission-clock-integrity-lab",
    roles: ["C++ engineer", "Rust engineer", "Systems engineer"],
    domains: ["Space systems", "Timing integrity", "Distributed systems"],
    maturity: "validated",
    outcome:
      "Reconstruct supported event order from clock uncertainty without forcing ambiguous observations.",
  },
  {
    name: "resilient-energy-microgrid-lab",
    roles: ["Simulation engineer", "Software engineer", "Data analyst"],
    domains: ["Space systems", "Energy", "Resilience"],
    maturity: "validated",
    outcome:
      "Compare feeder-loss simulations and critical-load shortfalls using consistent energy accounting.",
  },
  {
    name: "scientific-sensor-calibration-lab",
    roles: ["C# engineer", "Scientific software engineer", "Data analyst"],
    domains: ["Space systems", "Metrology", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Fit sensor calibrations and explain covariance contributions, cross terms and uncertainty limits.",
  },
  {
    name: "space-weather-impact-observatory",
    roles: ["Data analyst", "Scientific software engineer", "Systems engineer"],
    domains: ["Space systems", "Space weather", "Data provenance"],
    maturity: "validated",
    outcome:
      "Compare space-weather evidence by lead time and observation window while retaining coverage gaps.",
  },
  {
    name: "reactor-systems-simulator",
    roles: ["Simulation engineer", "Scientific software engineer", "Software engineer"],
    domains: ["Space systems", "Energy", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Compare bounded educational thermal scenarios, forcing changes and sampled peak responses.",
  },
] as const satisfies readonly ProjectCuration[];
