import type { ComponentChildren } from "preact";
import { renderToReadableStream } from "preact-render-to-string/stream";
import { t, type Language } from "../lib/i18n";
import { createMiddleware } from "hono/factory";
import { stream } from "hono/streaming";

interface RendererLayoutProps {
  title: string;
  lang: Language;
}

interface DocumentProps extends RendererLayoutProps {
  children?: ComponentChildren;
}

function Document({ lang, children }: DocumentProps) {
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{t(lang).pageTitle}</title>
        <link rel="stylesheet" href="/static/global.css" />
        <link rel="stylesheet" href="/static/islands.css" />
        <script type="module" src="/static/islands.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

export const preactRenderer = createMiddleware(async (c, next) => {
  c.setRenderer((children, docProps) => {
    c.header("Transfer-Encoding", "chunked");
    c.header("Content-Type", "text/html; charset=UTF-8");
    c.header("Content-Encoding", "Identity");

    return stream(c, async (response) => {
      await response.write("<!DOCTYPE html>");
      const preactStream = renderToReadableStream(<Document {...docProps}>{children}</Document>);
      await response.pipe(preactStream);
    });
  });

  return next();
});

declare module "hono" {
  interface ContextRenderer {
    (content: ComponentChildren | Promise<ComponentChildren>, props: RendererLayoutProps): Response;
  }
}
