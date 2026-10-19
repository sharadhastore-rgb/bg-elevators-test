"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bold, ImagePlus, Italic, Link as LinkIcon, List, ListOrdered, Quote, Redo2, Undo2, X } from "lucide-react";
import { contentBlocks } from "@/lib/blog";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function nodeHtml(node: any): string {
  if (typeof node === "string") return escapeHtml(node).replaceAll("\n", "<br>");
  if (node.tag === "img" && /^https:\/\/ik\.imagekit\.io\//.test(node.attributes?.src || ""))
    return `<img src="${escapeHtml(node.attributes.src)}" alt="${escapeHtml(node.attributes.alt || "")}" loading="lazy">`;
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
  if (tag === "img") {
    const image = node as HTMLImageElement;
    return image.src ? `![${image.alt}](${image.src})` : "";
  }
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
  const savedRange = useRef<Range | null>(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkError, setLinkError] = useState("");

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
  const openLink = () => {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    savedRange.current = range && editor.current?.contains(range.commonAncestorContainer)
      ? range.cloneRange()
      : null;
    setLinkText(selection?.toString().trim() || "");
    setLinkHref("");
    setLinkError("");
    setLinkOpen(true);
  };
  const openImage = () => {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    savedRange.current = range && editor.current?.contains(range.commonAncestorContainer)
      ? range.cloneRange()
      : null;
    setImageFile(null);
    setImageAlt("");
    setImageError("");
    setImageOpen(true);
  };
  const insertLink = () => {
    const text = linkText.trim();
    const href = linkHref.trim();
    if (!text) return setLinkError("Enter descriptive link text.");
    if (!/^\/(?!\/)[a-zA-Z0-9_./#-]*$/.test(href))
      return setLinkError("Use an internal path beginning with /, for example /services.");
    editor.current?.focus();
    const selection = window.getSelection();
    if (savedRange.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`,
    );
    if (editor.current) {
      const next = editorMarkdown(editor.current);
      emitted.current = next;
      onChange(next);
    }
    setLinkOpen(false);
  };
  const insertImage = async () => {
    if (!imageFile) return setImageError("Choose an image.");
    if (imageAlt.trim().length < 5)
      return setImageError("Add useful alt text with at least 5 characters.");
    setUploading(true);
    setImageError("");
    try {
      const data = new FormData();
      data.set("image", imageFile);
      const response = await fetch("/api/blog-covers", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      const alt = imageAlt.trim().replace(/[\[\]]/g, "");
      const imageHtml = `<img src="${escapeHtml(result.url)}" alt="${escapeHtml(alt)}" loading="lazy"><p><br></p>`;
      if (editor.current) {
        const anchor = savedRange.current?.commonAncestorContainer;
        const anchorElement = anchor instanceof HTMLElement ? anchor : anchor?.parentElement;
        const block = anchorElement?.closest("p,h2,h3,h4,h5,h6,blockquote,ul,ol");
        if (block && editor.current.contains(block)) block.insertAdjacentHTML("afterend", imageHtml);
        else editor.current.insertAdjacentHTML("beforeend", imageHtml);
        const next = editorMarkdown(editor.current);
        emitted.current = next;
        onChange(next);
      }
      setImageOpen(false);
      setImageFile(null);
      setImageAlt("");
    } catch (error: any) {
      setImageError(error.message || "Unable to upload the image.");
    } finally {
      setUploading(false);
    }
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
        {button("Internal link", openLink, <LinkIcon size={16} />)}
        {button("Insert image", openImage, <ImagePlus size={16} />)}
        <span />
        {button("Undo", () => run("undo"), <Undo2 size={16} />)}
        {button("Redo", () => run("redo"), <Redo2 size={16} />)}
      </div>
      <div ref={editor} className="article-rich-editor-content" contentEditable suppressContentEditableWarning role="textbox" aria-label="Article body" aria-multiline="true" data-placeholder="Start writing your article…" onInput={(event) => { const next = editorMarkdown(event.currentTarget); emitted.current = next; onChange(next); }} />
      <input type="hidden" name="content" value={value} />
      <div className="article-rich-editor-footer"><span>Visual editor</span><span>{value.length.toLocaleString()} / 100,000</span></div>
      {linkOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLinkOpen(false); }}>
          <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="internal-link-title">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="internal-link-title" className="text-lg font-semibold text-slate-950">Add internal link</h2><p className="mt-1 text-sm text-slate-500">Link to another page on the BG Elevators website.</p></div>
              <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close" onClick={() => setLinkOpen(false)}><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-slate-800">Link text<input className="min-h-11 rounded-lg border border-slate-300 px-3" value={linkText} onChange={(event) => setLinkText(event.target.value)} placeholder="Residential elevators" /></label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-800">Internal page path<input className="min-h-11 rounded-lg border border-slate-300 px-3" value={linkHref} onChange={(event) => setLinkHref(event.target.value)} placeholder="/residential-elevators" /></label>
              {linkError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{linkError}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold" onClick={() => setLinkOpen(false)}>Cancel</button><button type="button" className="min-h-10 rounded-lg bg-[#006699] px-4 text-sm font-semibold text-white" onClick={insertLink}>Insert link</button></div>
          </section>
        </div>
      )}
      {imageOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !uploading) setImageOpen(false); }}>
          <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="article-image-title">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="article-image-title" className="text-lg font-semibold text-slate-950">Add article image</h2><p className="mt-1 text-sm text-slate-500">The image is optimized, saved in ImageKit, and inserted at the cursor.</p></div>
              <button type="button" disabled={uploading} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50" aria-label="Close" onClick={() => setImageOpen(false)}><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-800">Image file<span className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-sky-300 bg-sky-50 px-4 text-[#006699]"><span className="min-w-0 truncate">{imageFile?.name || "Choose JPG, PNG or WebP"}</span><ImagePlus className="shrink-0" size={18} /></span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} /></label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-800">Image alt text<input className="min-h-11 rounded-lg border border-slate-300 px-3" value={imageAlt} maxLength={180} onChange={(event) => setImageAlt(event.target.value)} placeholder="Describe what is visible in the image" /><span className="text-xs font-normal text-slate-500">Required for accessibility and search engines.</span></label>
              {imageError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{imageError}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={uploading} className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:opacity-50" onClick={() => setImageOpen(false)}>Cancel</button><button type="button" disabled={uploading} className="min-h-10 rounded-lg bg-[#006699] px-4 text-sm font-semibold text-white disabled:opacity-60" onClick={insertImage}>{uploading ? "Uploading…" : "Upload & insert"}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
