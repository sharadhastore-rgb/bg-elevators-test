export default function ServiceImageGallery({ images = [] }) {
  if (!images.length) return null;

  return (
    <aside
      aria-label="Service gallery"
      className="tw:sticky tw:top-28 tw:grid tw:grid-cols-2 tw:gap-4 tw:max-[991px]:static"
    >
      {images.map((image, index) => (
        <figure
          className={`tw:m-0 tw:overflow-hidden tw:rounded-xl tw:bg-surface-soft ${index === 0 ? "tw:col-span-2" : ""}`}
          key={image.src}
        >
          <img
            alt={image.alt}
            className={`tw:w-full tw:object-cover ${index === 0 ? "tw:h-[19rem]" : "tw:h-40"}`}
            loading={index === 0 ? "eager" : "lazy"}
            src={image.src}
          />
        </figure>
      ))}
    </aside>
  );
}
