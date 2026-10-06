"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { contentBlocks } from "@/lib/blog";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function nodeHtml(node: any): string {
  if (typeof node === "string") return escapeHtml(node).replaceAll("\n", "<br>");
  const tag = /^(?:p|h[2-6]|ul|ol|li|blockquote|strong|em|a)$/.test(node.tag) ? node.tag : "p";
  const children = (node.children || []).map(nodeHtml).join("");
  const href = tag === "a" && /^(?:https?:\/\/|\/|#)/.test(node.attributes?.href || "")
    ? ` href="${escapeHtml(node.attributes.href)}"` : "";
  return `<${tag}${href}>${children}</${tag}>`;
}

const markdownHtml = (markdown: string) => contentBlocks(markdown).body.map(nodeHtml).join("") || "<p><br></p>";

function inlineMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent || "").replace(/\u00a0/g, " ");
  if (!(node instanceof HTMLElement)) return "";
  if (node.tagName === "BR") return "\n";
  const text = Array.from(node.childNodes).map(inlineMarkdown).join("");
  if (node.matches("strong,b")) return `**${text}**`;
  if (node.matches("em,i")) return `*${text}*`;
  if (node.matches("a")) return node.getAttribute("href") ? `[${text}](${node.getAttribute("href")})` : text;
  return text;
}

function blockMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent || "").trim();
  if (!(node instanceof HTMLElement)) return "";
  const tag = node.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tag)) {
    const level = Math.max(2, Number(tag.slice(1)) || 2);
    return `${"#".repeat(level)} ${Array.from(node.childNodes).map(inlineMarkdown).join("").trim()}`;
  }
  if (tag === "ul" || tag === "ol") return Array.from(node.children)
    .filter((child) => child.tagName === "LI")
    .map((child, index) => `${tag === "ol" ? `${index + 1}.` : "-"} ${Array.from(child.childNodes).map(inlineMarkdown).join("").trim()}`)
    .join("\n");
  if (tag === "blockquote") return Array.from(node.childNodes).map(inlineMarkdown).join("").split("\n").map((line) => `> ${line}`).join("\n");
  return Array.from(node.childNodes).map(inlineMarkdown).join("").trim();
}

const editorMarkdown = (editor: HTMLElement) => Array.from(editor.childNodes).map(blockMarkdown).filter(Boolean).join("\n\n").trim();

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useRef<HTMLDivElement>(null);
  const emitted = useRef(value);

  useEffect(() => {
    if (!editor.current || emitted.current === value) return;
    editor.current.innerHTML = markdownHtml(value);
    emitted.current = value;
  }, [value]);
  useEffect(() => { if (editor.current) editor.current.innerHTML = markdownHtml(value); }, []);

  const run = (command: string, argument?: string) => {
    editor.current?.focus();
    document.execCommand(command, false, argument);
    if (!editor.current) return;
    const next = editorMarkdown(editor.current);
    emitted.current = next;
    onChange(next);
  };
  const button = (title: string, action: () => void, child: ReactNode) => (
    <button type="button" title={title} aria-label={title} onMouseDown={(event) => event.preventDefault()} onClick={action}>{child}</button>
  );

  return (
    <div className="article-rich-editor">
      <div className="article-format-toolbar" role="toolbar" aria-label="Article formatting">
        {button("Paragraph", () => run("formatBlock", "p"), "¶")}
        {button("Heading 2", () => run("formatBlock", "h2"), "H2")}
        {button("Heading 3", () => run("formatBlock", "h3"), "H3")}
        <span />
        {button("Bold", () => run("bold"), <Bold size={16} />)}
        {button("Italic", () => run("italic"), <Italic size={16} />)}
        <span />
        {button("Bulleted list", () => run("insertUnorderedList"), <List size={17} />)}
        {button("Numbered list", () => run("insertOrderedList"), <ListOrdered size={17} />)}
        {button("Quote", () => run("formatBlock", "blockquote"), <Quote size={16} />)}
        {button("Link", () => { const href = window.prompt("Enter the link URL", "https://"); if (href && /^(?:https?:\/\/|\/|#)/.test(href)) run("createLink", href); }, <LinkIcon size={16} />)}
        <span />
        {button("Undo", () => run("undo"), <Undo2 size={16} />)}
        {button("Redo", () => run("redo"), <Redo2 size={16} />)}
      </div>
      <div ref={editor} className="article-rich-editor-content" contentEditable suppressContentEditableWarning role="textbox" aria-label="Article body" aria-multiline="true" data-placeholder="Start writing your article…" onInput={(event) => { const next = editorMarkdown(event.currentTarget); emitted.current = next; onChange(next); }} />
      <input type="hidden" name="content" value={value} />
      <div className="article-rich-editor-footer"><span>Visual editor</span><span>{value.length.toLocaleString()} / 100,000</span></div>
    </div>
  );
}
