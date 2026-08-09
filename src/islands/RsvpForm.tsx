import { useState } from "preact/hooks";
import { Button } from "../components/button";
import { $, safe, getIssueMessage, parseFormData } from "../lib/client";
import { t, type Language } from "../lib/i18n";
import { island } from "../lib/preact-islands";
import type { TargetedSubmitEvent } from "preact";
import { H1 } from "../components/typography";

type RsvpFormProps = {
  lang: Language;
};

function RsvpForm({ lang }: RsvpFormProps) {
  const m = t(lang);

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [formError, setError] = useState<Error | null>(null);

  async function handleSubmit(event: TargetedSubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const input = parseFormData(new FormData(event.currentTarget));
    console.log("input", input);
    const { error, data } = await safe($.rsvp(input));
    if (error) {
      setError(error);
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("done");
    console.log(data);
  }

  console.log({ status });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <H1>TEST</H1>
      <label className="flex flex-col gap-1">
        <span>{m.nameLabel}</span>
        <input name="name" required className="border border-overlay bg-base px-2 py-1" />
        <span className="text-destructive">{getIssueMessage(formError, "name")}</span>
      </label>

      <fieldset className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="attending" value="yes" checked />
          <span>{m.attendingYes}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="attending" value="no" />
          <span>{m.attendingNo}</span>
        </label>
      </fieldset>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="plusOne" />
        <span>{m.plusOneLabel}</span>
      </label>

      <label className="flex flex-col gap-1">
        <span>{m.plusOneNameLabel}</span>
        <input name="plusOneName" className="border border-overlay bg-base px-2 py-1" />
      </label>

      <fieldset className="flex gap-4">
        <legend className="text-subtle">{m.theoryLabel}</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="theory" value="girl" />
          <span>{m.theoryGirl}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="theory" value="boy" />
          <span>{m.theoryBoy}</span>
        </label>
      </fieldset>

      <Button type="submit" disabled={status === "submitting"}>
        {m.submitLabel}
      </Button>

      {status === "error" && (
        <p role="alert" className="text-rose-700">
          {m.errorMessage}
        </p>
      )}
    </form>
  );
}

export default island(RsvpForm, "RsvpForm");
