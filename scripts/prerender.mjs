import {pageHead as head,escapeHtml as escape} from "../server/pageHead.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderPage, allPaths } from "../.ssr/entry-server.js";

const shell = await readFile("dist/index.html", "utf8");
await writeFile(".ssr/shell.html", shell);
let count = 0;
for (const pathname of [...allPaths, "/404.html"]) {
  const page = await renderPage(pathname);
  const html = shell
    .replace(
      /<title>.*?<\/title>/s,
      `<title>${escape(page.meta.title)}</title>`,
    )
    .replace("<!--page-head-->", () => head(page.meta))
    .replace("<!--page-html-->", () => page.html);
  const filename =
    pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`;
  await writeFile(`dist/${filename}`, html);
  count++;
}
console.log(
  `Pre-rendered ${count - 1} original routes and a 404 page with full article content and page metadata.`,
);
await mkdir("docs", { recursive: true });
await writeFile(
  "docs/route-list.json",
  JSON.stringify(allPaths, null, 2) + "\n",
);
