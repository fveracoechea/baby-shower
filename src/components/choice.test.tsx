import { describe, expect, test } from "bun:test";
import { renderToString } from "preact-render-to-string";
import { Baby, CalendarX } from "lucide-preact";
import { Checkbox, ChoiceGroup, Radio } from "./choice";

describe("Radio", () => {
  test("renders a visually hidden native radio with its label", () => {
    const html = renderToString(
      <Radio name="theory" value="girl" label="Girl" icon={Baby} accent="secondary" />,
    );
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="theory"');
    expect(html).toContain('value="girl"');
    expect(html).toContain("sr-only");
    expect(html).toContain("Girl");
  });

  test("tints the selected state with the accent color", () => {
    const html = renderToString(
      <Radio name="theory" value="boy" label="Boy" icon={Baby} accent="primary" />,
    );
    expect(html).toContain("--choice:var(--color-primary)");
  });

  test("defaults to the primary accent", () => {
    const html = renderToString(<Radio name="attending" value="yes" label="Yes" icon={Baby} />);
    expect(html).toContain("--choice:var(--color-primary)");
  });

  test("renders the icon and the stamp badge", () => {
    const html = renderToString(<Radio name="attending" value="no" label="No" icon={CalendarX} />);
    expect(html.match(/<svg/g)?.length).toBe(2);
  });
});

describe("Checkbox", () => {
  test("renders a visually hidden native checkbox", () => {
    const html = renderToString(<Checkbox name="plusOne" label="Plus-one" icon={Baby} />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('name="plusOne"');
    expect(html).toContain("Plus-one");
  });
});

describe("ChoiceGroup", () => {
  test("renders the legend and options in a grid", () => {
    const html = renderToString(
      <ChoiceGroup legend="Your theory">
        <Radio name="theory" value="girl" label="Girl" icon={Baby} />
        <Radio name="theory" value="boy" label="Boy" icon={Baby} />
      </ChoiceGroup>,
    );
    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
    expect(html).toContain("Your theory");
    expect(html).toContain("grid-cols-2");
  });

  test("renders a group error", () => {
    const html = renderToString(
      <ChoiceGroup legend="Your theory" error="Pick one">
        <Radio name="theory" value="girl" label="Girl" icon={Baby} />
      </ChoiceGroup>,
    );
    expect(html).toContain("Pick one");
    expect(html).toContain("text-destructive");
  });
});
