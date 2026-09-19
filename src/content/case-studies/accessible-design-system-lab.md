---
title: "Accessibility as a component contract"
repository: "https://github.com/JasonStys/accessible-design-system-lab"
summary: "A native-first React component package where keyboard behavior, focus, reduced motion, RTL layout, packaging, and bundle size are tested API guarantees."
role: "Frontend and design-system engineering"
languages: ["TypeScript", "JavaScript", "HTML", "CSS"]
evidence:
  ["WCAG-focused interactions", "Storybook documentation", "Package smoke tests", "Bundle budgets"]
featuredOrder: 5
---

## Problem

Reusable UI components can spread inaccessible behavior faster than application-specific code. A polished screenshot does not prove keyboard navigation, focus restoration, right-to-left layout, reduced-motion behavior, or compatibility for package consumers.

## Constraints

- Native HTML behavior should be preserved whenever possible.
- Components must remain usable with keyboards, zoom, and reduced motion.
- The distributed package must work outside its own repository.
- Documentation and examples must stay synchronized with the public API.

## Design

React and TypeScript expose a small set of composable components backed by design tokens and semantic HTML. State ownership remains explicit; focus movement occurs only where the interaction pattern requires it. CSS logical properties support bidirectional layouts, and animation tokens collapse under reduced-motion preferences.

Storybook explains behavior, states, and usage, while the library build publishes declarations and a framework-independent stylesheet.

## Verification

Component tests cover behavior and controlled state. Playwright and axe exercise keyboard flows, focus, RTL, motion preferences, and desktop/mobile layouts. A clean consumer installs the packed artifact, and deterministic budgets reject unexpectedly large bundles.

## Measured result

The release produces a consumable package, typed declarations, Storybook documentation, browser evidence, and machine-readable bundle measurements from the same source commit.

## Limitations

Automated accessibility checks cannot replace testing with assistive-technology users. The component set is intentionally small and does not claim to cover every product interaction or design language.
