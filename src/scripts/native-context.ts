/**
 * @file Enhances only the fixed native scheme with visible offline navigation and manual public-link requests.
 * Functions: initializeNativeContext and main-frame click/navigation handlers.
 * Variables: isolated preload contract; normal HTTP(S) website navigation is unchanged.
 * Line locations: see docs/CODE_INDEX.md for the generated symbol index.
 */
type NativeState = Readonly<{
  version: string;
  source: string;
  sourceDirty: boolean;
  offline: true;
  canGoBack: boolean;
  canGoForward: boolean;
}>;
type NativeBridge = Readonly<{
  state: () => Promise<NativeState>;
  openLink: (value: string) => Promise<Readonly<{ opened: boolean; canceled: boolean }>>;
  navigate: (action: "back" | "forward" | "home") => Promise<void>;
  quit: () => void;
  onClosing: (callback: () => void) => () => void;
  onNavigation: (callback: (value: NativeState) => void) => () => void;
}>;

async function initializeNativeContext(api: NativeBridge): Promise<void> {
  const notice = document.querySelector<HTMLElement>("[data-native-context]");
  const output = notice?.querySelector<HTMLElement>("[data-native-status]");
  const version = notice?.querySelector<HTMLElement>("[data-native-version]");
  if (!notice || !output || !version) throw new Error("Native portfolio controls are missing.");
  const back = notice.querySelector<HTMLButtonElement>('[data-native-action="back"]');
  const forward = notice.querySelector<HTMLButtonElement>('[data-native-action="forward"]');
  let closing = false;
  let receivedNavigation = false;
  const applyNavigation = (value: NativeState): void => {
    if (closing) return;
    if (back) back.disabled = !value.canGoBack;
    if (forward) forward.disabled = !value.canGoForward;
  };
  // Subscribe before the initial request. A later history notification must not be replaced by an earlier reply.
  api.onNavigation((value) => {
    receivedNavigation = true;
    applyNavigation(value);
  });
  const state = await api.state();
  if (!state.offline) throw new Error("Offline portfolio identity is missing.");
  document.documentElement.dataset.nativePortfolio = "";
  notice.hidden = false;
  version.textContent = `v${state.version} · snapshot ${state.source.slice(0, 12)}${state.sourceDirty ? " · local candidate" : ""}`;
  if (!receivedNavigation) applyNavigation(state);
  notice.addEventListener("click", (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>("button[data-native-action]")
        : null;
    if (!target) return;
    const action = target.dataset.nativeAction;
    if (action === "exit") {
      api.quit();
      return;
    }
    if (action === "back" || action === "forward" || action === "home")
      void api.navigate(action).catch(() => {
        output.textContent = "The offline page could not be opened.";
      });
  });
  document.addEventListener(
    "click",
    (event) => {
      if (!event.isTrusted || event.defaultPrevented) return;
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link) return;
      const original = link.getAttribute("href") ?? "";
      const target = original.startsWith("//")
        ? new URL("https:" + original)
        : new URL(link.href, window.location.href);
      if (target.protocol === "portfolio:") return; // Preserve normal links, queries and fragments.
      event.preventDefault();
      if (target.protocol !== "https:") {
        output.textContent = "This link is unavailable in the offline application.";
        return;
      }
      output.textContent = "Choose Open or Cancel in the public-link dialog.";
      void api
        .openLink(target.href)
        .then((result) => {
          output.textContent = result.opened
            ? "The approved public link was sent to your browser."
            : "Stayed in the offline portfolio.";
        })
        .catch(() => {
          output.textContent = "This link is not available in this offline snapshot.";
        });
    },
    true,
  );
  api.onClosing(() => {
    closing = true;
    output.textContent = "Finishing the accepted public-link request before closing...";
    for (const button of notice.querySelectorAll<HTMLButtonElement>("button"))
      button.disabled = true;
  });
}

const bridge = (window as Window & { portfolioNative?: NativeBridge }).portfolioNative;
if (window.location.protocol === "portfolio:" && bridge)
  void initializeNativeContext(bridge).catch(() => {
    /* The verified site remains readable if an OS bridge cannot initialize. */
  });

export {};
