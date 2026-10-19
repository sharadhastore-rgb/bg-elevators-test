import { AppLink, Icon } from "@/components/ui";

function nodeText(node) {
  if (typeof node === "string") return node;
  return node?.children?.map(nodeText).join("") || "";
}

function InlineNode({ node }) {
  if (typeof node === "string") return node;
  if (!node) return null;
  const children = node.children?.map((child, index) => (
    <InlineNode node={child} key={index} />
  ));
  if (node.tag === "a")
    return <AppLink {...node.attributes}>{children}</AppLink>;
  if (node.tag === "strong" || node.tag === "b")
    return <strong>{children}</strong>;
  if (node.tag === "em") return <em>{children}</em>;
  if (node.tag === "br") return <br />;
  return children;
}

export default function ArticleHeader({ article }) {
  const introduction = article.body.find(
    (node) => node?.tag === "p" && nodeText(node).trim(),
  );
  return (
    <header className="tw:pt-7 tw:max-[767px]:pt-[22px]">
      <div className="tw:mx-auto tw:grid tw:w-[90%] tw:max-w-[1400px] tw:grid-cols-[minmax(20rem,0.95fr)_minmax(0,1.05fr)] tw:items-start tw:gap-x-[clamp(2.5rem,5vw,5rem)] tw:gap-y-[clamp(1.75rem,3vw,2.75rem)] tw:max-[1199px]:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] tw:max-[1199px]:gap-x-10 tw:max-[1199px]:gap-y-8 tw:max-[767px]:block tw:max-[767px]:w-[min(calc(100%_-_32px),860px)]">
        <div className="tw:col-span-full tw:border-b tw:border-[#ddd3c4] tw:pb-6">
          <AppLink
            href="/blogs"
            className="tw:m-0 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:text-[#38251d] tw:hover:text-[#a56d18]"
          >
            <Icon name="ArrowLeft" size={16} />
            Journal
          </AppLink>
        </div>
        <div className="tw:m-0 tw:max-[767px]:my-9 tw:max-[767px]:mb-[30px]">
          <h1 className="tw:m-0 tw:max-w-[620px] tw:text-left tw:text-[clamp(38px,4vw,58px)] tw:leading-[1.06] tw:font-semibold tw:tracking-[-0.045em] tw:text-pretty tw:text-[#211612] tw:max-[767px]:mb-5 tw:max-[767px]:text-[clamp(34px,10vw,48px)] tw:max-[767px]:leading-[1.08]">
            {article.title}
          </h1>
          {introduction && (
            <p className="tw:mt-7 tw:mb-0 tw:max-w-xl tw:p-0 tw:text-left tw:text-[15px] tw:leading-[1.65] tw:font-normal tw:text-pretty tw:text-[#674d40] tw:[&_a]:rounded-sm tw:[&_a]:font-semibold tw:[&_a]:text-[#0877ba] tw:[&_a]:underline tw:[&_a]:decoration-2 tw:[&_a]:underline-offset-4 tw:[&_a]:transition-colors tw:[&_a:hover]:bg-[#dceef8] tw:[&_a:hover]:text-[#005b8f] tw:max-[767px]:mt-0 tw:max-[767px]:pl-4 tw:max-[767px]:text-sm tw:max-[767px]:leading-[1.6]">
              {introduction.children?.map((child, index) => (
                <InlineNode node={child} key={index} />
              ))}
            </p>
          )}
        </div>
        {article.image && (
          <div className="tw:col-start-2 tw:w-full tw:max-w-[650px] tw:justify-self-end tw:overflow-hidden tw:rounded-2xl tw:bg-[#eaf2f6] tw:shadow-[0_20px_55px_rgb(1_32_52/0.1)] tw:max-[767px]:rounded-[10px]">
            <img
              src={article.image}
              alt={article.imageAlt || `${article.title} — BG Elevators`}
              className="tw:block tw:h-[clamp(350px,36vw,500px)] tw:w-full tw:object-cover tw:max-[767px]:h-auto tw:max-[767px]:min-h-[230px] tw:max-[767px]:max-h-[430px]"
              fetchPriority="high"
            />
          </div>
        )}
      </div>
    </header>
  );
}
