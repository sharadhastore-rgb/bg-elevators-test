import "./testimonials-section.css";

const avatarByCustomer = {
  Suresh: 0,
  Priya: 1,
  "Anil K": 2,
  Deepa: 3,
  Vinay: 4,
  Lakshmi: 6,
  "Rakesh N": 5,
  "Sahana P": 8,
  Nagaraj: 7,
  Meena: 11,
  "Sasaank K": 10,
  "Roopesh P": 9,
};

function TestimonialCard({ item }) {
  const avatarIndex = avatarByCustomer[item.heading] ?? 0;

  return (
    <article className="feedback-card">
      <span className="feedback-quote" aria-hidden="true">“</span>
      <p>{item.description}</p>
      <footer>
        <div
          className="feedback-avatar"
          aria-hidden="true"
          style={{ "--avatar-column": avatarIndex % 4, "--avatar-row": Math.floor(avatarIndex / 4) }}
        />
        <div>
          <strong>{item.heading}</strong>
          <span>{item.description2}</span>
        </div>
      </footer>
    </article>
  );
}

function TestimonialRow({ items, reverse = false }) {
  return (
    <div className="feedback-row" aria-label="Customer testimonials">
      <div className={`feedback-track${reverse ? " is-reverse" : ""}`}>
        {[0, 1].map((copy) => (
          <div className="feedback-group" aria-hidden={copy === 1 ? "true" : undefined} key={copy}>
            {items.map((item, index) => (
              <TestimonialCard item={item} key={`${copy}-${item.heading}-${index}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection({ data }) {
  const midpoint = Math.ceil(data.items.length / 2);

  return (
    <section className="feedback-section" aria-labelledby="feedback-heading">
      <div className="feedback-heading-wrap">
        <div>
          <span className="feedback-label">{data.text}</span>
          <h2 id="feedback-heading">{data.heading}<span>{data.text2}</span></h2>
        </div>
        <p className="feedback-summary">{data.description}</p>
      </div>
      <div className="feedback-marquee">
        <TestimonialRow items={data.items.slice(0, midpoint)} />
        <TestimonialRow items={data.items.slice(midpoint)} reverse />
      </div>
    </section>
  );
}
