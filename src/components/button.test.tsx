import { describe, expect, test } from "bun:test";
import { renderToString } from "preact-render-to-string";
import { Button } from "./button";

describe("Button", () => {
  test("renders primary intent by default", () => {
    const html = renderToString(<Button>Send RSVP</Button>);
    expect(html).toContain("bg-primary");
    expect(html).toContain("text-mauve-950");
  });

  test("renders ghost intent", () => {
    const html = renderToString(<Button intent="ghost">ES</Button>);
    expect(html).toContain("text-emerald-700");
    expect(html).not.toContain("bg-primary");
  });

  test("merges a custom class", () => {
    const html = renderToString(<Button className="mt-4">Send RSVP</Button>);
    expect(html).toContain("mt-4");
  });
});
