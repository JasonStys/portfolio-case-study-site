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
      "Rehearse civilian drone scenes with animated routes, obstacles, saved plans and reliable desktop upgrades.",
  },
  {
    name: "mavlink-sitl-assurance-lab",
    roles: ["C++ engineer", "Robotics software engineer", "Test engineer"],
    domains: ["Drone safety", "Protocol assurance", "Fault injection"],
    maturity: "validated",
    outcome:
      "Import, filter and export offline MAVLink evidence while distinguishing relay observations from receiver acknowledgement.",
  },
  {
    name: "first-response-drone-coordinator",
    roles: ["Software engineer", "Backend engineer", "Optimization engineer"],
    domains: ["Drone safety", "Resource allocation", "Human review"],
    maturity: "validated",
    outcome:
      "Review fictional response plans and resource-loss contingencies with staff roles, durable inputs and exact evidence exports.",
  },
  {
    name: "drone-video-privacy-studio",
    roles: ["Full-stack engineer", "Computer vision engineer", "Security engineer"],
    domains: ["Drone safety", "Privacy", "Media processing"],
    maturity: "validated",
    outcome:
      "Edit moving privacy envelopes, inspect processed frames and retain reviewer approval before exporting minimized footage.",
  },
  {
    name: "drone-maintenance-readiness-studio",
    roles: ["Full-stack engineer", "Backend engineer", "Reliability engineer"],
    domains: ["Drone safety", "Reliability", "Evidence review"],
    maturity: "validated",
    outcome:
      "Import maintenance ledgers, inspect component findings and compare draft standards against the same workload and assessment time.",
  },
  {
    name: "drone-airspace-awareness-lab",
    roles: ["Rust engineer", "Software engineer", "Scientific software engineer"],
    domains: ["Drone safety", "Scientific computing", "Uncertainty"],
    maturity: "validated",
    outcome:
      "Inspect track and zone evidence with a bundled Rust kernel, readable map labels and explicit freshness and coverage limits.",
  },
  {
    name: "drone-flight-policy-workbench",
    roles: ["Security engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Drone safety", "Policy as code", "Governance"],
    maturity: "validated",
    outcome:
      "Edit organizational drone policies and compare actual OPA decisions against the same operation evidence without publishing drafts.",
  },
] as const satisfies readonly ProjectCuration[];

export const droneHighlightNames = [
  "drone-operations-console",
  "mavlink-sitl-assurance-lab",
  "drone-video-privacy-studio",
  "drone-maintenance-readiness-studio",
] as const;
