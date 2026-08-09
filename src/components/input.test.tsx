import { describe, expect, test } from "bun:test";
import { renderToString } from "preact-render-to-string";
import { Input, TextField } from "./input";

describe("Input", () => {
  test("renders a text input with base styles", () => {
    const html = renderToString(<Input name="name" />);
    expect(html).toContain('name="name"');
    expect(html).toContain("border-overlay");
    expect(html).toContain("bg-surface");
  });

  test("renders the invalid state with aria wiring", () => {
    const html = renderToString(<Input name="name" invalid />);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("border-destructive");
  });

  test("merges a custom class", () => {
    const html = renderToString(<Input name="name" className="mt-4" />);
    expect(html).toContain("mt-4");
  });
});

describe("TextField", () => {
  test("associates the label with the input", () => {
    const html = renderToString(<TextField name="name" label="Your name" />);
    const id = html.match(/id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`for="${id}"`);
    expect(html).toContain("Your name");
  });

  test("renders the error and points aria-describedby at it", () => {
    const html = renderToString(<TextField name="name" label="Your name" error="Required" />);
    expect(html).toContain("Required");
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="');
    expect(html).toContain("text-destructive");
  });

  test("omits the error element when there is no error", () => {
    const html = renderToString(<TextField name="name" label="Your name" />);
    expect(html).not.toContain("aria-describedby");
    expect(html).not.toContain("text-destructive");
  });
});
