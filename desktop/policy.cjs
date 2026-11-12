/**
 * @file Defines the fixed native origin, readable routes and canonical HTTPS syntax for an exact build-declared anchor list.
 * Functions: ownUrl, publicUrl, documentRoutes and senderAllowed.
 * Variables: explicit scheme/host/base, version and finite URL budget; URL.origin is deliberately unused.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const VERSION = "1.1.0";
const { isIP } = require("node:net");
const SCHEME = "portfolio:";
const HOST = "catalog";
const BASE = "/portfolio-case-study-site/";
const HOME = `portfolio://${HOST}${BASE}`;
const LIVE_HOME = "https://jasonstys.github.io/portfolio-case-study-site/";
const LINKEDIN = "https://www.linkedin.com/in/jason-stys-31b30b351/";
const MAX_URL = 8192;
function hasControls(value, includeSpace = false) {
  return [...value].some(
    (character) =>
      character.codePointAt(0) <= (includeSpace ? 32 : 31) || character.codePointAt(0) === 127,
  );
}

function ownUrl(value) {
  if (typeof value !== "string" || value.length > MAX_URL || hasControls(value, true)) return null;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (
    parsed.protocol !== SCHEME ||
    parsed.hostname !== HOST ||
    parsed.port ||
    parsed.username ||
    parsed.password ||
    (parsed.pathname !== BASE.slice(0, -1) && !parsed.pathname.startsWith(BASE))
  )
    return null;
  return parsed;
}

function publicUrl(value) {
  if (typeof value !== "string" || !value || value.length > 4096 || hasControls(value, true))
    return null;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.href !== value
  )
    return null;
  const host = parsed.hostname.replace(/^\[|\]$/gu, "");
  if (
    !host.includes(".") ||
    host.endsWith(".") ||
    isIP(host) ||
    /(?:^|\.)(?:localhost|local|internal|test|invalid|example)$/iu.test(host)
  )
    return null;
  return value; // Eligibility is not permission: the exact parsed build anchor must also be in the snapshot set.
}

function safeName(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 1024 &&
    !value.startsWith("/") &&
    !/[<>:"\\|?*]/u.test(value) &&
    !hasControls(value) &&
    value
      .split("/")
      .every(
        (part) =>
          part &&
          part !== "." &&
          part !== ".." &&
          !/[. ]$/u.test(part) &&
          !/^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/iu.test(part),
      )
  );
}

function documentRoutes(files) {
  const routes = new Map();
  for (const [name, value] of Object.entries(files)) {
    if (!safeName(name)) throw new Error("Unsafe static resource name.");
    if (value.mediaType === "text/html") {
      routes.set(BASE + name, name);
      if (name.endsWith("index.html")) {
        const directory = BASE + name.slice(0, -"index.html".length);
        routes.set(directory, name);
        routes.set(directory.slice(0, -1), name);
      }
    } else if (/\.(?:json|xml|txt|webmanifest)$/u.test(name)) routes.set(BASE + name, name);
  }
  return routes;
}

function senderAllowed(event, contents, snapshot) {
  if (
    !event ||
    !contents ||
    !contents.mainFrame ||
    event.sender !== contents ||
    event.senderFrame !== contents.mainFrame
  )
    return false;
  const url = ownUrl(event.senderFrame.url);
  return Boolean(url && snapshot.documents.has(url.pathname));
}

module.exports = {
  VERSION,
  SCHEME,
  HOST,
  BASE,
  HOME,
  LIVE_HOME,
  LINKEDIN,
  MAX_URL,
  ownUrl,
  publicUrl,
  safeName,
  documentRoutes,
  senderAllowed,
};
