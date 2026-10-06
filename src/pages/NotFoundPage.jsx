import { AppLink } from "@/components/ui";
import ui from "@/data/ui.json";
export default function NotFoundPage() {
  return (
    <section className="section not-found">
      <div className="container">
        <p className="editorial-eyebrow">404</p>
        <h1>{ui.notFound.title}</h1>
        <p>{ui.notFound.description}</p>
        <AppLink href="/" className="btn-primary">
          {ui.notFound.link}
        </AppLink>
      </div>
    </section>
  );
}
