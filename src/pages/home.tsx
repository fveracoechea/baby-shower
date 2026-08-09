import { Hono } from "hono";
import { Card } from "../components/card";
import { H1, H2, P } from "../components/typography";
import RsvpForm from "../islands/RsvpForm";
import { asLanguage, t, type Messages } from "../lib/i18n";

type HomePageProps = {
  lang: ReturnType<typeof asLanguage>;
  messages: Messages;
};

function HomePage({ lang, messages: m }: HomePageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 bg-base px-6 py-12 text-text">
      <header className="flex flex-col gap-4 border border-overlay bg-surface p-6">
        <P className="text-sm uppercase tracking-widest text-subtle">Case file</P>
        <H1>{m.caseFileHeading}</H1>
        <P>{m.caseFileIntro}</P>
        <nav aria-label={m.languageToggleLabel} className="flex gap-3 text-sm">
          <a
            href="?lang=es"
            aria-current={lang === "es" ? "true" : undefined}
            className="text-emerald-700"
          >
            ES
          </a>
          <a
            href="?lang=en"
            aria-current={lang === "en" ? "true" : undefined}
            className="text-emerald-700"
          >
            EN
          </a>
        </nav>
      </header>

      <Card>
        <H2>{m.rsvpHeading}</H2>
        <RsvpForm lang={lang} />
      </Card>
    </main>
  );
}

export default new Hono()
  /*
   * Render HomePage
   */
  .get("/", async (c) => {
    const lang = asLanguage(c.get("language"));
    return c.render(<HomePage lang={lang} messages={t(lang)} />, { title: "Home", lang });
  });
