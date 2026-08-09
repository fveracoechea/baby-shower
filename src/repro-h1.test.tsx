/*
 * THROWAWAY debug harness for: "H1 disappears after island hydration".
 * Repro: SSR the real page through the Hono app, mount the <body> HTML into
 * happy-dom, run the real island registration + hydration path, then assert
 * the h1 still exists.
 * Delete after the bug is fixed.
 */
import { describe, expect, test } from "bun:test";
import app from "./main";

describe("repro: h1 after hydration", () => {
  test("h1 survives island hydration", async () => {
    // SSR must happen before happy-dom globals are registered: hono's
    // streaming response breaks under happy-dom's ReadableStream.
    const res = await app.request("/");
    const html = await res.text();
    expect(html).toContain("<h1");

    await import("./happydom");
    const { registerIslands } = await import("./lib/preact-islands");
    registerIslands();

    const bodyHtml = html.match(/<body>([\s\S]*)<\/body>/)?.[1];
    expect(bodyHtml).toBeTruthy();
    document.body.innerHTML = bodyHtml!;
    expect(document.querySelector("h1")).not.toBeNull();

    // wait for the async island hydration to settle
    await new Promise((resolve) => setTimeout(resolve, 250));

    const h1 = document.querySelector("h1");
    console.log("[DEBUG-h1bug] h1 after hydration:", h1 ? "PRESENT" : "MISSING");
    if (!h1) {
      console.log("[DEBUG-h1bug] body after hydration:", document.body.innerHTML.slice(0, 600));
    }
    expect(h1).not.toBeNull();
  });
});
