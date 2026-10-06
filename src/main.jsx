import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import Analytics from "./app/Analytics";
import { resolvePage } from "./app/resolvePage";
import "./styles/index.css";

async function start() {
  const suppliedBlogs = JSON.parse(
    document.getElementById("cms-blogs")?.textContent || "null",
  );
  const initialPage = await resolvePage(
    window.location.pathname,
    JSON.parse(document.getElementById("cms-article")?.textContent || "null"),
    suppliedBlogs,
  );
  const app = (
    <BrowserRouter>
      <Analytics />
      <App initialPage={initialPage} />
    </BrowserRouter>
  );
  const root = document.getElementById("root");
  if (root.querySelector(".page-wrapper")) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
start().catch(() => {
  document.getElementById("root").innerHTML =
    '<main style="padding:3rem;font-family:Arial"><h1>Page temporarily unavailable</h1><p>Please reload or try again shortly.</p><a href="/blogs">Browse articles</a></main>';
});
