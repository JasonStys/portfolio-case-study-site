/**
 * @file Jason Stys: keeps the README portfolio summary aligned with reviewed site curation.
 * Functions: evaluate, loadCuration, main. No source evaluation or network access is used.
 * Variables: ROOT, declarations, entries, priority, table; AST accepts data literals/spreads only.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { format } from "prettier";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Read only literal curation syntax; unsupported expressions fail instead of executing code. */
function evaluate(node, declarations, seen = new Set()) {
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  )
    return evaluate(node.expression, declarations, seen);
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isIdentifier(node)) {
    if (seen.has(node.text) || !declarations.has(node.text))
      throw new Error("Unknown or cyclic curation declaration");
    return evaluate(declarations.get(node.text), declarations, new Set([...seen, node.text]));
  }
  if (ts.isArrayLiteralExpression(node))
    return node.elements.flatMap((element) =>
      ts.isSpreadElement(element)
        ? evaluate(element.expression, declarations, seen)
        : [evaluate(element, declarations, seen)],
    );
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties.map((property) => {
        if (
          !ts.isPropertyAssignment(property) ||
          (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name))
        )
          throw new Error("Unsupported curation property");
        return [property.name.text, evaluate(property.initializer, declarations, seen)];
      }),
    );
  throw new Error("Only reviewed literal curation expressions are supported");
}

/** Collect declarations from fixed authored data files, never discover arbitrary paths. */
async function loadCuration() {
  const declarations = new Map();
  for (const name of [
    "src/data/space-systems.ts",
    "src/data/drone-systems.ts",
    "src/data/project-curation.ts",
  ]) {
    const source = ts.createSourceFile(
      name,
      await readFile(path.join(ROOT, name), "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    for (const statement of source.statements)
      if (ts.isVariableStatement(statement))
        for (const declaration of statement.declarationList.declarations)
          if (ts.isIdentifier(declaration.name) && declaration.initializer)
            declarations.set(declaration.name.text, declaration.initializer);
  }
  return evaluate(declarations.get("projectCuration"), declarations);
}

/** Generate/check exactly the ordered summary table; preserve all surrounding authored prose. */
async function main() {
  const entries = await loadCuration();
  const priority = JSON.parse(
    await readFile(path.join(ROOT, "src/data/portfolio-priority.json"), "utf8"),
  );
  const byName = new Map(entries.map((entry) => [entry.name, entry]));
  if (
    byName.size !== entries.length ||
    priority.length !== entries.length ||
    new Set(priority).size !== priority.length ||
    priority.some((name) => !byName.has(name))
  )
    throw new Error("Summary priority and curation disagree");
  const rows = priority.map(
    (name, index) =>
      `| ${index + 1} | [${name}](https://github.com/JasonStys/${name}) | ${byName.get(name).outcome.replaceAll("|", "\\|")} |`,
  );
  const table = await format(
    ["| Order | Repository | Demonstrated outcome |", "| --- | --- | --- |", ...rows].join("\n") +
      "\n",
    { parser: "markdown" },
  );
  const target = path.join(ROOT, "README.md");
  const source = await readFile(target, "utf8");
  const pattern = /\| Order[^\n]*\n\|[^\n]*\n(?:\|[^\n]*\n)+/u;
  if (!pattern.test(source)) throw new Error("Expected one canonical README summary table");
  const output = source.replace(pattern, () => table);
  if (process.argv.includes("--check")) {
    if (output !== source)
      throw new Error("README portfolio summary is stale; run npm run summary:sync");
  } else await writeFile(target, output, "utf8");
  console.log(`README summary matches all ${priority.length} reviewed projects.`);
}

await main();
