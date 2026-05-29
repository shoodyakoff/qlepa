import React from "react";
import { createRoot } from "react-dom/client";

import { tokens } from "../brand/tokens";
import { getRenderRoute, renderRoutes } from "./render-routes";
import "./styles.css";

function App() {
  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Qlepa</p>
        <h1>Template workbench</h1>
        <p>
          Stage 1 skeleton is ready for preview routes, slide templates, and
          Playwright rendering.
        </p>
        <dl>
          <div>
            <dt>Slide</dt>
            <dd>
              {tokens.sizes.slide.w}x{tokens.sizes.slide.h}
            </dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>PNG carousel assets</dd>
          </div>
        </dl>
        <nav className="preview-nav" aria-label="Render previews">
          {renderRoutes.map((route) => (
            <a href={route.path} key={route.path}>
              {route.name}
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}

function Root() {
  const route = getRenderRoute(window.location.pathname);

  if (route) {
    return route.render(new URLSearchParams(window.location.search));
  }

  return <App />;
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

createRoot(root).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
