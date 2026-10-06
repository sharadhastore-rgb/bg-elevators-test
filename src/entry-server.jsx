import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./app/App";
import { resolvePage } from "./app/resolvePage";
export { allPaths } from "./app/resolvePage";
export async function renderPage(pathname, article, publishedBlogs) {
  const page = await resolvePage(pathname, article, publishedBlogs);
  return {
    html: renderToString(
      <StaticRouter location={pathname}>
        <App initialPage={page} />
      </StaticRouter>,
    ),
    meta: page.meta,
    found: page.found,
  };
}
