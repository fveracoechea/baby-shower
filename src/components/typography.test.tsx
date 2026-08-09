import { describe, expect, test } from "bun:test";
import { renderToString } from "preact-render-to-string";
import { H1, H2, H3, H4, Label, P } from "./typography";

describe("typography", () => {
  test("H1 renders an h1 in the display font", () => {
    const html = renderToString(<H1>The Mystery</H1>);
    expect(html).toContain("<h1");
    expect(html).toContain("font-display");
    expect(html).toContain("text-4xl");
    expect(html).toContain("text-emerald-600");
  });

  test.each([
    { Component: H2, tag: "<h2", size: "text-2xl" },
    { Component: H3, tag: "<h3", size: "text-xl" },
    { Component: H4, tag: "<h4", size: "text-lg" },
  ])("renders the right tag and size", ({ Component, tag, size }) => {
    const html = renderToString(<Component>Title</Component>);
    expect(html).toContain(tag);
    expect(html).toContain("font-display");
    expect(html).toContain(size);
  });

  test("P renders relaxed body text", () => {
    const html = renderToString(<P>Case file intro</P>);
    expect(html).toContain("<p");
    expect(html).toContain("leading-relaxed");
  });

  test("Label requires and renders htmlFor", () => {
    const html = renderToString(<Label htmlFor="name">Name</Label>);
    expect(html).toContain("<label");
    expect(html).toContain('for="name"');
    expect(html).toContain("text-subtle");
  });

  test("merges a custom class", () => {
    const html = renderToString(<P className="mt-4">Intro</P>);
    expect(html).toContain("mt-4");
    expect(html).toContain("leading-relaxed");
  });
});
