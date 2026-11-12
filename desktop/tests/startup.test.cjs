/**
 * @file Runs the unchanged real main against synthetic Electron startup refusals and actual profile ownership files.
 * Functions: refused and injected host API; no Chromium or normal user data is opened.
 * Variables: fixed startup modes and exact lock-at-exit observations; a mock OS refusal is not live OS evidence.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  os = require("node:os");
const { pathToFileURL } = require("node:url"),
  { spawnSync } = require("node:child_process");
const { openProfile } = require("../profile.cjs");
const host = `
import fs from 'node:fs'; import path from 'node:path';
const f = globalThis.fixture;
export const app = {
  isPackaged:false, commandLine:{appendSwitch(){}}, setName(){}, on(){},
  getAppPath(){return f.resources}, setPath(){ f.calls.push('setPath'); if(f.mode==='set-path')throw Error('inert refusal') },
  requestSingleInstanceLock(){ f.calls.push('instance'); if(f.mode==='changed')fs.writeFileSync(path.join(f.profile,'owner.lock'),'foreign token retained'); return f.mode==='ready' },
  whenReady(){return Promise.reject(Error('inert readiness refusal'))},
  quit(){throw Error('Failed startup must never report successful Quit')},
  exit(code){ f.calls.push('exit:'+code); f.lockAtExit=fs.existsSync(path.join(f.profile,'owner.lock')); process.exitCode=code }
};
export const protocol={registerSchemesAsPrivileged(){}};
export const dialog={showErrorBox(){f.errors++}};
export const BrowserWindow=class {}; export const Menu={};export const ipcMain={};export const session={};export const shell={};
`;
function refused(t, mode) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-startup-"));
  t.after(() => fs.rmSync(root, { recursive: true }));
  const profile = path.join(root, "profile"),
    resources = path.join(root, "application");
  fs.mkdirSync(resources);
  const owner = openProfile(profile);
  owner.close();
  const marker = fs.readFileSync(path.join(profile, "owner.json"));
  if (mode === "preexisting")
    fs.writeFileSync(path.join(profile, "owner.lock"), "preexisting token retained");
  const proof = path.join(root, "proof.json");
  const script = `import fs from 'node:fs';import {registerHooks} from 'node:module';
globalThis.fixture=${JSON.stringify({ profile, resources, mode, calls: [], errors: 0 })};process.resourcesPath=${JSON.stringify(resources)};process.argv.push('--profile',${JSON.stringify(profile)});
registerHooks({resolve(s,c,next){return s==='electron'?{url:'test:electron',shortCircuit:true}:next(s,c)},load(u,c,next){return u==='test:electron'?{format:'module',source:${JSON.stringify(host)},shortCircuit:true}:next(u,c)}});
await import(${JSON.stringify(pathToFileURL(require.resolve("../main.mjs")).href)});await new Promise(r=>setImmediate(r));fs.writeFileSync(${JSON.stringify(proof)},JSON.stringify(globalThis.fixture));`;
  const child = spawnSync(process.execPath, ["--input-type=module", "--eval", script], {
    timeout: 15000,
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(child.error, undefined);
  assert.equal(child.signal, null);
  assert.equal(child.status, 1, child.stderr);
  const result = JSON.parse(fs.readFileSync(proof, "utf8"));
  assert.equal(result.errors, 1);
  assert.equal(result.calls.filter((x) => x === "exit:1").length, 1);
  assert.deepEqual(fs.readFileSync(path.join(profile, "owner.json")), marker);
  assert.doesNotMatch(child.stderr, /Unhandled|TypeError/);
  return { profile, result };
}
for (const mode of ["instance", "set-path", "ready"])
  test("real main releases only its acquired lock BEFORE failure exit: " + mode, (t) => {
    const { profile, result } = refused(t, mode);
    assert.equal(result.lockAtExit, false);
    assert.equal(fs.existsSync(path.join(profile, "owner.lock")), false);
    openProfile(profile).close();
  });
for (const mode of ["changed", "preexisting"])
  test("real failed main preserves a different existing owner: " + mode, (t) => {
    const { profile, result } = refused(t, mode);
    assert.equal(result.lockAtExit, true);
    assert.equal(
      fs.readFileSync(path.join(profile, "owner.lock"), "utf8"),
      mode === "changed" ? "foreign token retained" : "preexisting token retained",
    );
  });
