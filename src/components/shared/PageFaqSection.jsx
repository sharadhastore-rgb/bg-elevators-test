import FaqSection from "@/components/homepage/FaqSection";

const productSlugs = new Set([
  "additional-features",
  "bg-glass-finish-cabin",
  "bg-mirror-finish-cabin",
  "bg-stainless-steel-finish-cabin",
  "cabin-option",
  "ceiling",
  "control-system",
  "cop-and-lop",
  "doors",
  "features",
  "glass-door",
  "gold-finish",
  "motors",
  "ms-powder-coated-finish",
  "products",
  "rose-gold-finish",
  "ss-hairline-finish",
  "ss-mirror-finish",
  "wooden-finish",
]);

const serviceSlugs = new Set([
  "amc-and-service-maintence",
  "breakdown-and-emergency-repairs",
  "elevator-installation",
  "elevator-modernization",
  "service-details",
  "service-for-non-bg-elevators",
  "services",
]);

const content = {
  company: {
    description: "Helpful information about BG Elevators, our approach and support.",
    items: [
      {
        question: "What elevator solutions does BG Elevators provide?",
        answer:
          "BG Elevators provides elevator design, installation, modernization and maintenance solutions for residential, commercial and other suitable building requirements.",
      },
      {
        question: "Can solutions be customized for a building?",
        answer:
          "Yes. The team evaluates the site, intended use, capacity and design preferences before recommending a suitable configuration.",
      },
      {
        question: "How can I discuss a new elevator requirement?",
        answer:
          "Use the website enquiry form or contact BG Elevators directly to arrange an initial discussion and site-specific guidance.",
      },
    ],
  },
  services: {
    description: "Clear answers about elevator installation, service and ongoing support.",
    items: [
      {
        question: "How is the right elevator service identified?",
        answer:
          "The appropriate service is identified after reviewing the elevator condition, building usage, technical requirements and the work needed at the site.",
      },
      {
        question: "Do you support existing elevator systems?",
        answer:
          "Support may be available for existing systems after a technical inspection confirms their condition, compatibility and service requirements.",
      },
      {
        question: "How do I request inspection or service support?",
        answer:
          "Submit the service enquiry with your location and requirement. The BG Elevators team can then coordinate the appropriate next step.",
      },
    ],
  },
  products: {
    description: "Essential guidance about elevator options, finishes and compatibility.",
    items: [
      {
        question: "How do I choose the right elevator option?",
        answer:
          "Selection depends on building type, available space, expected usage, capacity, travel requirements and the preferred cabin or component finish.",
      },
      {
        question: "Can finishes and features be customized?",
        answer:
          "Available finishes and features can be reviewed against the selected elevator configuration and the technical requirements of the project.",
      },
      {
        question: "Is a site assessment required before final selection?",
        answer:
          "A site and technical assessment is recommended so dimensions, compatibility and installation requirements can be confirmed accurately.",
      },
    ],
  },
  projects: {
    description: "Common questions about project planning and delivery.",
    items: [
      {
        question: "What information is needed to discuss a project?",
        answer:
          "Share the building type, location, number of floors, intended usage and any available drawings or elevator requirements.",
      },
      {
        question: "Does every project follow the same process?",
        answer:
          "No. Planning and execution are adapted to the site, selected system, building readiness and confirmed scope of work.",
      },
      {
        question: "Can I request details about a relevant completed project?",
        answer:
          "Yes. Contact the BG Elevators team with your project type so the most relevant available information can be discussed.",
      },
    ],
  },
  careers: {
    description: "Useful information for candidates interested in joining BG Elevators.",
    items: [
      {
        question: "How can I apply for an available position?",
        answer:
          "Open the relevant vacancy, complete the application form and attach your current resume in the requested format.",
      },
      {
        question: "Can I submit a general application?",
        answer:
          "Yes. Where a general application option is available, you may submit your profile for consideration against suitable opportunities.",
      },
      {
        question: "What happens after an application is submitted?",
        answer:
          "The submitted profile is reviewed against current requirements. Suitable candidates may be contacted using the details provided in the application.",
      },
    ],
  },
  contact: {
    description: "Quick answers for enquiries and support requests.",
    items: [
      {
        question: "What details should I include in my enquiry?",
        answer:
          "Include your name, contact details, location, building type and a clear description of the elevator or service requirement.",
      },
      {
        question: "Can I enquire about both new installations and service?",
        answer:
          "Yes. Use the enquiry form for new elevator requirements, modernization, maintenance or other service-related questions.",
      },
      {
        question: "How will BG Elevators contact me?",
        answer:
          "The team will use the email address or phone number supplied with your enquiry to discuss the next steps.",
      },
    ],
  },
  blogs: {
    description: "Information about the BG Elevators knowledge and insights section.",
    items: [
      {
        question: "What topics are covered in the journal?",
        answer:
          "Articles cover elevator selection, applications, maintenance, modernization, design considerations and other useful industry topics.",
      },
      {
        question: "Can an article replace a technical site assessment?",
        answer:
          "No. Articles provide general information; project decisions should be based on a site-specific technical assessment.",
      },
      {
        question: "How can I ask about a topic discussed in an article?",
        answer:
          "Contact BG Elevators and include the article topic along with your building or elevator requirement.",
      },
    ],
  },
};

function categoryFor(slug) {
  if (productSlugs.has(slug)) return "products";
  if (serviceSlugs.has(slug)) return "services";
  if (slug === "projects" || slug === "client") return "projects";
  if (slug === "career" || slug === "career-details") return "careers";
  if (slug === "contact-us") return "contact";
  if (slug === "blogs") return "blogs";
  if (slug === "about-us" || slug === "why-choose-us") return "company";
  return null;
}

export default function PageFaqSection({ slug }) {
  const category = categoryFor(slug);
  if (!category) return null;

  return (
    <FaqSection
      data={{
        badge: "Frequently Asked Questions",
        heading: "Questions,",
        accent: "answered clearly",
        ...content[category],
      }}
    />
  );
}
