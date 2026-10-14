import { createElement, Fragment } from "react";
import { AppLink } from "@/components/ui";

/** Structured article blocks keep every paragraph, link, heading and table editable. */
function Block({ node }) {
  if (typeof node === "string") return node;
  const attrs = { ...node.attributes };
  const children = node.children?.map((child, i) => (
    <Block node={child} key={i} />
  ));
  if (node.tag === "a") return <AppLink {...attrs}>{children}</AppLink>;
  if (["img", "br", "hr", "wbr", "source"].includes(node.tag))
    return createElement(node.tag, attrs);
  if (node.tag === "table")
    return (
      <div className="tw:my-[30px] tw:overflow-x-auto tw:rounded-xl tw:border tw:border-[#c8ddea] tw:bg-white tw:max-[767px]:my-6 tw:max-[767px]:w-full tw:max-[767px]:rounded-md tw:[&_table]:w-full tw:[&_table]:min-w-[480px] tw:[&_table]:border-collapse tw:[&_table]:text-sm tw:[&_table]:leading-[1.6] tw:[&_th]:bg-[#0877ba] tw:[&_th]:px-[18px] tw:[&_th]:py-4 tw:[&_th]:text-left tw:[&_th]:font-semibold tw:[&_th]:text-white tw:[&_td]:border-r tw:[&_td]:border-b tw:[&_td]:border-[#d9e7ef] tw:[&_td]:bg-white tw:[&_td]:px-[18px] tw:[&_td]:py-4 tw:[&_td]:text-[#18384b] tw:[&_td:last-child]:border-r-0 tw:[&_tr:last-child_td]:border-b-0 tw:[&_tbody_tr:nth-child(odd):not(:first-child)_td]:bg-[#f2f8fc] tw:[&_table:not(:has(th))_tr:first-child_td]:border-white/20 tw:[&_table:not(:has(th))_tr:first-child_td]:bg-[#0877ba] tw:[&_table:not(:has(th))_tr:first-child_td]:font-semibold tw:[&_table:not(:has(th))_tr:first-child_td]:text-white tw:[&_table:not(:has(th))_tr:nth-child(even)_td]:bg-[#f2f8fc] tw:[&_table:not(:has(th))_tr:nth-child(odd):not(:first-child)_td]:bg-white">
        {createElement("table", attrs, children)}
      </div>
    );
  return createElement(node.tag, attrs, children);
}
function nodeText(node) {
  if (typeof node === "string") return node;
  return node?.children?.map(nodeText).join(" ") || "";
}
function directAnswer(node, followingNodes) {
  const heading = nodeText(node).replace(/\s+/g, " ").trim();
  if (
    !/^h[2-4]$/.test(node?.tag || "") ||
    (!heading.endsWith("?") &&
      !/^(how|what|why|when|which|can|does|is|are|should)\b/i.test(heading))
  )
    return "";
  const nextNode = followingNodes.find(
    (candidate) =>
      candidate && typeof candidate === "object" && candidate.tag !== "br",
  );
  if (nextNode?.tag !== "p") return "";
  const text = nodeText(nextNode).replace(/\s+/g, " ").trim();
  return (
    text
      .match(/[^.!?]+[.!?]+/g)
      ?.slice(0, 2)
      .join(" ") || text
  )
    .slice(0, 320)
    .trim();
}
export default function ArticleContent({ article }) {
  const introductionIndex = article.body.findIndex(
    (node) =>
      node?.tag === "p" &&
      node.children?.some((child) => typeof child === "string" && child.trim()),
  );
  return (
    <div className="tw:min-w-0 tw:max-w-none tw:text-[17px] tw:leading-[1.88] tw:text-[#344b5b] tw:max-[767px]:text-base tw:[&>*]:max-w-full tw:[&_a]:rounded-sm tw:[&_a]:font-semibold tw:[&_a]:text-[#0877ba] tw:[&_a]:underline tw:[&_a]:decoration-2 tw:[&_a]:decoration-[#3396d6] tw:[&_a]:underline-offset-4 tw:[&_a]:transition-colors tw:[&_a]:[overflow-wrap:anywhere] tw:[&_a:hover]:bg-[#dceef8] tw:[&_a:hover]:text-[#005b8f] tw:[&_b]:font-semibold tw:[&_b]:text-[#18364a] tw:[&_blockquote]:my-[26px] tw:[&_blockquote]:border-l-[3px] tw:[&_blockquote]:border-[#3396d6] tw:[&_blockquote]:bg-[#f0f7fc] tw:[&_blockquote]:px-[25px] tw:[&_blockquote]:py-5 tw:[&_blockquote]:text-lg tw:[&_blockquote]:leading-[1.7] tw:[&_h2]:my-0 tw:[&_h2]:mt-12 tw:[&_h2]:mb-[18px] tw:[&_h2]:scroll-mt-[110px] tw:[&_h2]:text-[31px] tw:[&_h2]:leading-[1.3] tw:[&_h2]:font-semibold tw:[&_h2]:tracking-[-0.025em] tw:[&_h2]:text-[#012034] tw:[&_h2]:[overflow-wrap:anywhere] tw:[&_h3]:my-0 tw:[&_h3]:mt-12 tw:[&_h3]:mb-[18px] tw:[&_h3]:scroll-mt-[110px] tw:[&_h3]:text-[23px] tw:[&_h3]:leading-[1.3] tw:[&_h3]:font-semibold tw:[&_h3]:tracking-[-0.025em] tw:[&_h3]:text-[#012034] tw:[&_h3]:[overflow-wrap:anywhere] tw:[&_h4]:my-0 tw:[&_h4]:mt-12 tw:[&_h4]:mb-[18px] tw:[&_h4]:scroll-mt-[110px] tw:[&_h4]:text-[23px] tw:[&_h4]:leading-[1.3] tw:[&_h4]:font-semibold tw:[&_h4]:tracking-[-0.025em] tw:[&_h4]:text-[#012034] tw:[&_h4]:[overflow-wrap:anywhere] tw:[&_img]:my-[34px] tw:[&_img]:block tw:[&_img]:h-auto tw:[&_img]:w-full tw:[&_img]:rounded-xl tw:[&_li]:my-[9px] tw:[&_li]:pl-[3px] tw:[&_li]:[overflow-wrap:anywhere] tw:[&_li::marker]:text-[#3396d6] tw:[&_ol]:mb-[26px] tw:[&_ol]:pl-[25px] tw:[&_p]:mb-6 tw:[&_p]:text-[inherit] tw:[&_p]:leading-[inherit] tw:[&_p]:text-[color:inherit] tw:[&_p]:[overflow-wrap:anywhere] tw:[&_strong]:font-semibold tw:[&_strong]:text-[#18364a] tw:[&_ul]:mb-[26px] tw:[&_ul]:pl-[25px] tw:max-[767px]:[&_blockquote]:mx-0 tw:max-[767px]:[&_blockquote]:px-[18px] tw:max-[767px]:[&_blockquote]:py-[17px] tw:max-[767px]:[&_blockquote]:text-base tw:max-[767px]:[&_h2]:text-[25px] tw:max-[767px]:[&_h3]:text-[21px] tw:max-[767px]:[&_h4]:text-[21px] tw:max-[767px]:[&_img]:my-[26px] tw:max-[767px]:[&_img]:rounded-lg tw:max-[767px]:[&_ol]:pl-[21px] tw:max-[767px]:[&_ul]:pl-[21px]">
      {article.body.map((node, index) => {
        if (/^alt\s*text\s*:/i.test(nodeText(node).trim())) return null;
        if (index === introductionIndex) return null;
        const answer = directAnswer(node, article.body.slice(index + 1));
        return (
          <Fragment key={index}>
            <Block node={node} />
            {answer && (
              <p className="tw:mt-3 tw:mb-[22px] tw:border-l-[3px] tw:border-[#b47a22] tw:bg-[#f7f2e8] tw:px-4 tw:py-3.5 tw:text-[#3d3029]">
                <strong>Short answer:</strong> {answer}
              </p>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
