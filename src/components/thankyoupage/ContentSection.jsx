import { AppLink } from "@/components/ui";

export default function ContentSection({ data }) {
  return (
    <div className="tw:relative tw:h-screen tw:w-full tw:overflow-hidden tw:text-center">
      <img
        alt={data.imageAlt}
        className="tw:block tw:h-screen tw:w-full tw:object-cover"
        src={data.image}
      />
      <div className="tw:absolute tw:top-1/2 tw:left-1/2 tw:max-w-[90%] tw:-translate-x-1/2 tw:-translate-y-1/2 tw:rounded-[10px] tw:bg-black/60 tw:px-[30px] tw:py-5 tw:text-white tw:max-[767px]:px-5 tw:max-[767px]:py-[15px] tw:max-[479px]:w-[95%] tw:max-[479px]:px-[15px] tw:max-[479px]:py-2.5">
        <h1 className="tw:my-2.5 tw:text-[2rem] tw:max-[767px]:text-2xl tw:max-[479px]:text-[1.2rem]">
          {data.heading}
        </h1>
        <h2 className="tw:my-[15px] tw:text-[1.2rem] tw:max-[767px]:text-base tw:max-[479px]:text-[0.9rem]">
          {data.heading2}
        </h2>
        <p className="tw:my-1.5 tw:text-base tw:max-[767px]:text-[0.9rem] tw:max-[479px]:text-[0.8rem]">
          <AppLink
            className="tw:inline-flex tw:items-center tw:font-bold tw:text-white tw:no-underline"
            href={data.link}
          >
            <img
              alt={data.imageAlt2}
              className="tw:mr-1.5 tw:rounded-full tw:bg-white tw:p-0.5"
              height="12"
              width="12"
            />
            {data.label}
          </AppLink>
        </p>
      </div>
    </div>
  );
}
