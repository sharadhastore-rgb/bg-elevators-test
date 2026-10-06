import BlogListingSection from "@/components/blogpage/BlogListingSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/blogs.json";

export default function BlogsPage({ initialArticles }) {
  return (
    <>
      <BlogListingSection initialArticles={initialArticles} />
      <TestimonialsSection data={data.section2} />
      <ConsultationSection data={data.section3} />
    </>
  );
}
