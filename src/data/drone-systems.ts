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
      "Edit and replay civilian drone scenes with obstacle checks, saved routes and timeline scrubbing.",
  },
  {
    name: "mavlink-sitl-assurance-lab",
    roles: ["C++ engineer", "Robotics software engineer", "Test engineer"],
    domains: ["Drone safety", "Protocol assurance", "Fault injection"],
    maturity: "validated",
    outcome:
      "Test simulated MAVLink faults and inspect delay, drop and ambiguous packet-correlation evidence.",
  },
  {
    name: "first-response-drone-coordinator",
    roles: ["Software engineer", "Backend engineer", "Optimization engineer"],
    domains: ["Drone safety", "Resource allocation", "Human review"],
    maturity: "validated",
    outcome:
      "Compare civilian response plans under aircraft or operator loss with revision-bound human review.",
  },
  {
    name: "drone-video-privacy-studio",
    roles: ["Full-stack engineer", "Computer vision engineer", "Security engineer"],
    domains: ["Drone safety", "Privacy", "Media processing"],
    maturity: "validated",
    outcome:
      "Redact video and review manual keyframes with conservative privacy envelopes and controlled exports.",
  },
  {
    name: "drone-maintenance-readiness-studio",
    roles: ["Full-stack engineer", "Backend engineer", "Reliability engineer"],
    domains: ["Drone safety", "Reliability", "Evidence review"],
    maturity: "validated",
    outcome:
      "Track component life and compare draft maintenance standards before changing approved records.",
  },
  {
    name: "drone-airspace-awareness-lab",
    roles: ["Rust engineer", "Software engineer", "Scientific software engineer"],
    domains: ["Drone safety", "Scientific computing", "Uncertainty"],
    maturity: "validated",
    outcome:
      "Inspect synthetic traffic overlaps with track freshness, altitude-reference limits and coverage gaps.",
  },
  {
    name: "drone-flight-policy-workbench",
    roles: ["Security engineer", "DevOps engineer", "Backend engineer"],
    domains: ["Drone safety", "Policy as code", "Governance"],
    maturity: "validated",
    outcome:
      "Compare active and draft drone policies against identical evidence without authorizing flight.",
  },
] as const satisfies readonly ProjectCuration[];

export const droneHighlightNames = [
  "drone-operations-console",
  "mavlink-sitl-assurance-lab",
  "drone-video-privacy-studio",
  "drone-maintenance-readiness-studio",
] as const;
