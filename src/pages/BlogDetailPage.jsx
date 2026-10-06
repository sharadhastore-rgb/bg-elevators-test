import ArticleHeader from "@/components/blogdetailpage/ArticleHeader";
import ArticleContent from "@/components/blogdetailpage/ArticleContent";
import ArticleContents from "@/components/blogdetailpage/ArticleContents";
import AdditionalSections from "@/components/blogdetailpage/AdditionalSections";

export default function BlogDetailPage({ article }) {
  return (
    <>
      <article className="editorial-article">
        <ArticleHeader article={article} />
        <div className="editorial-container article-layout">
          <div>
            <ArticleContent article={article} />
          </div>
          <ArticleContents article={article} />
        </div>
      </article>
      <AdditionalSections sections={article.additionalSections} />
    </>
  );
}
