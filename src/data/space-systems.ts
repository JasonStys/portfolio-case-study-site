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
      "Exercises a deterministic C++ executive, watchdog deadlines, validated checkpoints and fault recovery against nominal replay.",
    caseStudySlug: "spacecraft-flight-software-testbed",
  },
  {
    name: "spacecraft-telemetry-anomaly-studio",
    roles: ["Data scientist", "Systems engineer", "Software engineer"],
    domains: ["Space systems", "Telemetry", "Statistical learning"],
    maturity: "validated",
    outcome:
      "Compares frozen context-aware telemetry limits with a pooled baseline using causal scoring, held-out evaluation and explicit missing data.",
    caseStudySlug: "spacecraft-telemetry-anomaly-studio",
  },
  {
    name: "mission-contact-resource-scheduler",
    roles: ["Software engineer", "Operations research engineer", "Systems engineer"],
    domains: ["Space systems", "Optimization", "Resource scheduling"],
    maturity: "validated",
    outcome:
      "Solves bounded contact allocation with exact branch-and-bound, a greedy comparison, resource ledgers and an independent exhaustive oracle.",
    caseStudySlug: "mission-contact-resource-scheduler",
  },
  {
    name: "spacecraft-power-thermal-lab",
    roles: ["C++ engineer", "Simulation engineer", "Systems engineer"],
    domains: ["Space systems", "Scientific computing", "Energy"],
    maturity: "validated",
    outcome:
      "Checks C++ power allocation and RK4 thermal integration against an independent Python model and separate energy ledgers.",
  },
  {
    name: "mission-verification-evidence-kit",
    roles: ["Verification engineer", "Systems engineer", "Developer tools engineer"],
    domains: ["Space systems", "Requirements traceability", "Software assurance"],
    maturity: "validated",
    outcome:
      "Links requirements, tests, fault scenarios and release metadata with latest-attempt rules, stale-evidence checks and independent SQL verdicts.",
    caseStudySlug: "mission-verification-evidence-kit",
  },
  {
    name: "orbital-safety-workbench",
    roles: ["Simulation engineer", "Software engineer", "Systems engineer"],
    domains: ["Space systems", "Orbital modeling", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Explores civilian orbital propagation and close-approach screening with reproducible evidence and explicit model limits—not targeting or guidance.",
  },
  {
    name: "ccsds-telemetry-integrity-lab",
    roles: ["Rust engineer", "Systems engineer", "Software engineer"],
    domains: ["Space systems", "Binary protocols", "Data integrity"],
    maturity: "validated",
    outcome:
      "Differentially checks a bounded Rust telemetry-packet parser against Python while distinguishing gaps, reordering and unauthenticated payloads.",
  },
  {
    name: "delay-tolerant-mission-network-lab",
    roles: ["Rust engineer", "Network engineer", "Systems engineer"],
    domains: ["Space systems", "Store-and-forward networking", "Reliability"],
    maturity: "validated",
    outcome:
      "Replays intermittent-contact queues, expiry, backpressure and a real Rust-worker restart with independent Python event verification.",
  },
  {
    name: "earth-observation-change-studio",
    roles: ["Geospatial developer", "Data scientist", "Software engineer"],
    domains: ["Space systems", "Earth observation", "Data quality"],
    maturity: "validated",
    outcome:
      "Reviews public Sentinel-2 dates with quality masks, aligned spectral differences, independently checked classifications and GeoTIFF/GeoJSON exports.",
  },
  {
    name: "mission-clock-integrity-lab",
    roles: ["C++ engineer", "Rust engineer", "Systems engineer"],
    domains: ["Space systems", "Timing integrity", "Distributed systems"],
    maturity: "validated",
    outcome:
      "Cross-checks integer-nanosecond clock simulation and interval-order audits across C++, Rust and Python without changing the host clock.",
  },
  {
    name: "resilient-energy-microgrid-lab",
    roles: ["Simulation engineer", "Software engineer", "Data analyst"],
    domains: ["Space systems", "Energy", "Resilience"],
    maturity: "validated",
    outcome:
      "Compares two synthetic research-station dispatch policies with exact-rational energy accounting, outage scenarios and explicit unmet demand.",
  },
  {
    name: "scientific-sensor-calibration-lab",
    roles: ["C# engineer", "Scientific software engineer", "Data analyst"],
    domains: ["Space systems", "Metrology", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Checks a C# weighted calibration fit against exact-rational Python, propagates uncertainty and evaluates separate check observations.",
  },
  {
    name: "space-weather-impact-observatory",
    roles: ["Data analyst", "Scientific software engineer", "Systems engineer"],
    domains: ["Space systems", "Space weather", "Data provenance"],
    maturity: "validated",
    outcome:
      "Preserves frozen NOAA Kp provenance and missing bins, enforces forecast eligibility and separates descriptive associations from causal claims.",
  },
  {
    name: "reactor-systems-simulator",
    roles: ["Simulation engineer", "Scientific software engineer", "Software engineer"],
    domains: ["Space systems", "Energy", "Scientific computing"],
    maturity: "validated",
    outcome:
      "Explores bounded educational reactor-system dynamics with documented assumptions, scenario comparisons and explicit non-operational limits.",
  },
] as const satisfies readonly ProjectCuration[];
