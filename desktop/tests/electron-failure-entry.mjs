/**
 * @file Substitutes only the blocking OS error display before running the unchanged actual native main in failure tests.
 * Functions: error-display observation and actual main import; variables: synthetic test-only failure context.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import { dialog } from "electron";
dialog.showErrorBox = () => {
  console.log("PORTFOLIO_EXPECTED_ERROR_DISPLAY");
};
await import("../main.mjs");
