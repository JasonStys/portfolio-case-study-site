/**
 * @file Jason Stys's reviewed drone-safety collection and employer reading path.
 * Functions: none; literal presentation data, not flight instructions or live telemetry.
 * Variables: droneSystemsCuration and droneHighlightNames; priority follows independent evidence.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import type { ProjectCuration } from "@/lib/types";

export const droneSystemsCuration = [
  {
    name: "drone-operations-console",
    roles: ["Full-stack engineer", "Robotics software engineer", "DevOps engineer"],
    domains: ["Drone safety", "Simulation", "Operations"],
    maturity: "validated",
    outcome:
      "Binds operator approvals to mission revisions, prevents command replay, and validates a typed console against actual PX4 SIH and native MAVSDK simulation.",
  },
  {
    name: "mavlink-sitl-assurance-lab",
    roles: ["C++ engineer", "Robotics software engineer", "Test engineer"],
    domains: ["Drone safety", "Protocol assurance", "Fault injection"],
    maturity: "validated",
    outcome:
      "Checks two pinned PX4 versions through a bounded C++ fault relay with blackout, delay, reorder, duplication and lost acknowledgements, using independent recovery oracles.",
  },
  {
    name: "first-response-drone-coordinator",
    roles: ["Software engineer", "Backend engineer", "Optimization engineer"],
    domains: ["Drone safety", "Resource allocation", "Human review"],
    maturity: "validated",
    outcome:
      "Independently validates synthetic aircraft, operator, time-slot and battery constraints, with revision-bound review and explicit stop gates rather than live dispatch.",
  },
  {
    name: "drone-video-privacy-studio",
    roles: ["Full-stack engineer", "Computer vision engineer", "Security engineer"],
    domains: ["Drone safety", "Privacy", "Media processing"],
    maturity: "validated",
    outcome:
      "Re-encodes every video frame with solid privacy masks, verifies the exported pixels, strips audio and telemetry, and requires independent current-revision approval.",
  },
  {
    name: "drone-maintenance-readiness-studio",
    roles: ["Full-stack engineer", "Backend engineer", "Reliability engineer"],
    domains: ["Drone safety", "Reliability", "Evidence review"],
    maturity: "validated",
    outcome:
      "Tracks serialized component life across swaps, records usage exactly once, and binds readiness assessments to fresh inspections and independently verified maintenance evidence.",
  },
  {
    name: "drone-airspace-awareness-lab",
    roles: ["Rust engineer", "Software engineer", "Scientific software engineer"],
    domains: ["Drone safety", "Scientific computing", "Uncertainty"],
    maturity: "validated",
    outcome:
      "Cross-checks Rust analytic overlap windows against an independent numerical oracle, preserving freshness, uncertainty and altitude-reference limits for synthetic traffic.",
  },
  {
    name: "drone-flight-policy-workbench",
    roles: ["Security engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Drone safety", "Policy as code", "Governance"],
    maturity: "validated",
    outcome:
      "Compares actual OPA/Rego decisions with an independent Python oracle, holds stale or unknown policy evidence, and preserves immutable reviewed SQL snapshots.",
  },
] as const satisfies readonly ProjectCuration[];

export const droneHighlightNames = [
  "drone-operations-console",
  "mavlink-sitl-assurance-lab",
  "drone-video-privacy-studio",
  "drone-maintenance-readiness-studio",
] as const;
