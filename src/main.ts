import { serveStatic } from "hono/bun";
import { languageDetector } from "hono/language";
import { Hono } from "hono";
import { supportedLanguages } from "./lib/i18n";
import homeRoute from "./pages/home";
import { preactRenderer } from "./middleware/preact-renderer";
import { orpcHandlerMiddleware } from "./middleware/orpc";

const app = new Hono();

app.use(
  languageDetector({
    supportedLanguages: [...supportedLanguages],
    fallbackLanguage: "es",
  }),
);

app.use("/static/*", serveStatic({ root: "./" }));
app.use("/rpc/*", orpcHandlerMiddleware);

app.use("/*", preactRenderer);
app.route("/", homeRoute);

export default app;
