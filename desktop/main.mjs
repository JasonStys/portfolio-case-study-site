/**
 * @file Hosts the same static portfolio offline with an isolated native browser and retained owner lifecycle.
 * Functions: state, sender, openLink, navigate, menuNavigate, closeOwned, failedOwned and configureMenu.
 * Variables: fixed immutable snapshot, ordinary owner-local browser profile and accepted confirmation promises.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
import { app, BrowserWindow, Menu, dialog, ipcMain, protocol, session, shell } from "electron";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const { openProfile } = require("./profile.cjs");
const { VERSION, HOME, LIVE_HOME, ownUrl, senderAllowed } = require("./policy.cjs");
const { verifiedSnapshot, responseFor, canNavigate } = require("./resources.cjs");
const { createOperations, openPublicLink } = require("./operations.cjs");
const ownerRoot = import.meta.dirname;
const resourceRoot = app.isPackaged
  ? path.join(process.resourcesPath, "portfolio-site")
  : path.resolve(
      process.env.PORTFOLIO_NATIVE_RESOURCES ?? path.join(ownerRoot, "../.runtime/native-snapshot"),
    );
const flag = process.argv.indexOf("--profile");
const profilePath =
  flag < 0
    ? path.join(
        process.env.LOCALAPPDATA ?? app.getPath("appData"),
        "JasonStysPortfolio",
        "portfolio-case-study-site",
        "workspace",
      )
    : process.argv[flag + 1];
const operations = createOperations();
let profile,
  window,
  snapshot,
  startup,
  closing,
  failing,
  exiting = false;
app.setName("Jason Stys Portfolio");
app.commandLine.appendSwitch("disable-background-networking");
protocol.registerSchemesAsPrivileged([
  {
    scheme: "portfolio",
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
  },
]);

function sender(event) {
  if (
    !snapshot ||
    !window ||
    window.isDestroyed() ||
    operations.closing ||
    !senderAllowed(event, window.webContents, snapshot)
  )
    throw new Error("The active offline portfolio main frame is required.");
}
function state() {
  return {
    version: VERSION,
    source: snapshot.metadata.source,
    sourceDirty: snapshot.metadata.sourceDirty,
    offline: true,
    canGoBack: window.webContents.navigationHistory.canGoBack(),
    canGoForward: window.webContents.navigationHistory.canGoForward(),
  };
}
function openLink(value) {
  return operations.run(() =>
    openPublicLink(
      value,
      snapshot,
      async (target) => {
        const answer = await dialog.showMessageBox(window, {
          type: "question",
          message: "Open this public link in your browser?",
          detail: target,
          buttons: ["Cancel", "Open"],
          defaultId: 0,
          cancelId: 0,
          noLink: true,
        });
        return answer.response === 1;
      },
      (target) => shell.openExternal(target),
    ),
  );
}
function navigate(action) {
  if (operations.closing || !window || window.isDestroyed())
    throw new Error("The application is closing.");
  if (action === "home") return window.loadURL(HOME);
  if (action === "back") {
    if (window.webContents.navigationHistory.canGoBack())
      window.webContents.navigationHistory.goBack();
    return;
  }
  if (action === "forward") {
    if (window.webContents.navigationHistory.canGoForward())
      window.webContents.navigationHistory.goForward();
    return;
  }
  throw new Error("Unsupported portfolio navigation.");
}
function menuNavigate(action) {
  if (operations.closing || !snapshot) return;
  Promise.resolve()
    .then(() => navigate(action))
    .catch((error) => {
      if (error?.code !== "ERR_ABORTED") void failedOwned(error);
    });
}
function closeOwned() {
  if (!closing)
    closing = (async () => {
      await startup;
      operations.stopAdmission();
      window?.webContents.send("portfolio:closing");
      await operations.finish();
      session.defaultSession.flushStorageData();
      profile?.close();
      exiting = true;
      setImmediate(() => app.quit());
    })().catch((error) => failedOwned(error));
  return closing;
}
function failedOwned(error) {
  if (!failing)
    failing = Promise.resolve()
      .then(async () => {
        operations.stopAdmission();
        console.error("portfolio-native-stage", "failure", error?.code ?? "application");
        try {
          dialog.showErrorBox(
            "Offline portfolio could not finish",
            "The site snapshot or private browser profile could not be opened or closed normally. Existing files were preserved.",
          );
        } catch {
          /* The failure still drains and reports its actual status if the OS dialog is unavailable. */
        }
        await operations.finish();
        try {
          profile?.close();
        } catch {
          /* Preserve a changed ownership token rather than removing another owner. */
        }
        exiting = true;
        app.exit(1);
      })
      .catch(() => {
        console.error("portfolio-native-stage", "cleanup-unproven");
      });
  return failing;
}
function configureMenu() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "Portfolio",
        submenu: [
          {
            id: "native-home",
            label: "Overview",
            click: () => menuNavigate("home"),
          },
          {
            id: "native-back",
            label: "Back",
            accelerator: "Alt+Left",
            click: () => menuNavigate("back"),
          },
          {
            id: "native-forward",
            label: "Forward",
            accelerator: "Alt+Right",
            click: () => menuNavigate("forward"),
          },
          { type: "separator" },
          {
            id: "native-live",
            label: "Open live portfolio",
            click: () => {
              void openLink(LIVE_HOME).catch(() => {});
            },
          },
          {
            id: "native-help",
            label: "Help",
            click: () => {
              if (operations.closing) return;
              void operations
                .run(() =>
                  dialog.showMessageBox(window, {
                    message: "Jason Stys Portfolio | Offline application",
                    detail:
                      "Browse the same portfolio pages, project search, case studies and recorded evidence offline. Public source, contact and download links open in your browser only after you choose Open. This application does not discover or launch other installed projects, fetch live evidence or install downloads. Its browser profile belongs to your OS account. Close normally; interrupted ownership files remain for review.",
                  }),
                )
                .catch(() => {});
            },
          },
          {
            id: "native-exit",
            label: "Exit application",
            accelerator: "Alt+F4",
            click: () => {
              void closeOwned();
            },
          },
        ],
      },
      { role: "editMenu" },
      {
        label: "View",
        submenu: [
          { role: "zoomIn" },
          { role: "zoomOut" },
          { role: "resetZoom" },
          { role: "togglefullscreen" },
        ],
      },
    ]),
  );
  const update = () => {
    if (!window || window.isDestroyed()) return;
    const menu = Menu.getApplicationMenu();
    menu?.getMenuItemById("native-back") &&
      (menu.getMenuItemById("native-back").enabled =
        window.webContents.navigationHistory.canGoBack());
    menu?.getMenuItemById("native-forward") &&
      (menu.getMenuItemById("native-forward").enabled =
        window.webContents.navigationHistory.canGoForward());
  };
  window.webContents.on("did-navigate", update);
  window.webContents.on("did-navigate-in-page", update);
  update();
}
app.on("before-quit", (event) => {
  if (!exiting) {
    event.preventDefault();
    void closeOwned();
  }
});
app.on("window-all-closed", () => {
  if (!exiting) void closeOwned();
});
try {
  if (typeof profilePath !== "string") throw new Error("An absolute private profile is required.");
  profile = openProfile(profilePath, [
    path.dirname(process.execPath),
    process.resourcesPath,
    app.getAppPath(),
  ]);
  app.setPath("userData", profile.browser);
  if (!app.requestSingleInstanceLock()) throw new Error("This profile already has an owner.");
  startup = app.whenReady().then(async () => {
    window = new BrowserWindow({
      width: 1280,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      show: false,
      title: "Jason Stys Portfolio | Opening offline snapshot",
      webPreferences: {
        preload: path.join(ownerRoot, "preload.cjs"),
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        devTools: false,
      },
    });
    window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    window.webContents.on("will-navigate", (event, url) => {
      if (!snapshot || !canNavigate(url, snapshot)) event.preventDefault();
    });
    window.on("close", (event) => {
      if (!exiting) {
        event.preventDefault();
        void closeOwned();
      }
    });
    await window.loadURL(
      "data:text/html;charset=utf-8," +
        encodeURIComponent(
          "<!doctype html><meta charset=utf-8><meta http-equiv=Content-Security-Policy content=\"default-src 'none'; style-src 'unsafe-inline'\"><title>Jason Stys Portfolio</title><body style=\"font:18px Segoe UI;background:#07151d;color:white;padding:45px\"><h1>Jason Stys Portfolio</h1><p>Opening the verified offline site...</p><p>v1.1.0</p>",
        ),
    );
    window.show();
    snapshot = verifiedSnapshot(resourceRoot, ownerRoot);
    protocol.handle("portfolio", (request) => responseFor(request, snapshot));
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) =>
      callback(false),
    );
    session.defaultSession.setPermissionCheckHandler(() => false);
    session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => callback(null));
    session.defaultSession.webRequest.onBeforeRequest((details, callback) =>
      callback({ cancel: !ownUrl(details.url) }),
    );
    session.defaultSession.on("will-download", (event) => event.preventDefault());
    ipcMain.handle("portfolio:state", (event) => {
      sender(event);
      return state();
    });
    ipcMain.handle("portfolio:open", (event, value) => {
      sender(event);
      return openLink(value);
    });
    ipcMain.handle("portfolio:navigate", (event, action) => {
      sender(event);
      return navigate(action);
    });
    ipcMain.on("portfolio:quit", (event) => {
      if (operations.closing) return;
      try {
        sender(event);
      } catch {
        return;
      }
      void closeOwned();
    });
    await window.loadURL(HOME);
    window.webContents.navigationHistory.clear();
    configureMenu();
    window.setTitle(`Jason Stys Portfolio | Offline | ${VERSION}`);
    window.show();
  });
  startup.catch((error) => failedOwned(error));
} catch (error) {
  void failedOwned(error);
}
