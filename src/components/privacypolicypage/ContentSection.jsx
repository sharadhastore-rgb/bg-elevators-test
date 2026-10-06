import { AppLink } from "@/components/ui";

export default function ContentSection({ data }) {
  return (
    <section className="tw:px-[5%] tw:py-12 tw:max-[991px]:px-10 tw:max-[991px]:py-8 tw:max-[479px]:px-5">
      <div className="tw:mx-auto tw:w-full tw:max-w-[82.5rem]">
        <div className="tw:max-w-[52rem] tw:text-base tw:leading-[1.6] tw:text-[#2e2e2e] tw:[&_h1]:mt-0 tw:[&_h1]:mb-6 tw:[&_h1]:text-[2rem] tw:[&_h1]:leading-[1.2] tw:[&_h1]:font-semibold tw:[&_h1]:text-[#181818] tw:[&_h3]:mt-8 tw:[&_h3]:mb-4 tw:[&_h3]:text-xl tw:[&_h3]:font-semibold tw:[&_h3]:text-[#181818] tw:[&_h4]:mt-6 tw:[&_h4]:mb-3 tw:[&_h4]:text-lg tw:[&_h4]:font-semibold tw:[&_h4]:text-[#181818] tw:[&_p]:mt-0 tw:[&_p]:mb-4 tw:[&_ul]:mb-4 tw:[&_ul]:pl-6 tw:[&_li]:mb-2 tw:[&_a]:text-brand tw:[&_a]:underline">
          <h1>
            <strong>{data.text}</strong>
          </h1>
          <p>
            {data.description}
            <AppLink href={data.link}>{data.label}</AppLink>
            {data.description2}
          </p>
          <br />
          <h3>
            <strong>{data.text2}</strong>
          </h3>
          <p>{data.description3}</p>
          <ul>
            {data.items.map((item, index) => (
              <li key={index}>
                <strong>{item.text}</strong>
                {item.text2}
              </li>
            ))}
          </ul>
          <h3>
            <strong>{data.text3}</strong>
          </h3>
          <p>{data.description4}</p>
          <ul>
            {data.items2.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
          <h3>
            <strong>{data.text4}</strong>
          </h3>
          {data.items3.map((item, index) => (
            <p key={index}>{item.description}</p>
          ))}
          <h3>
            <strong>{data.text5}</strong>
          </h3>
          <p>{data.description5}</p>
          <ul>
            {data.items4.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
          <h4>
            <strong>{data.text6}</strong>
          </h4>
          <p>{data.description6}</p>
          <h4>
            <strong>{data.text7}</strong>
          </h4>
          <p>{data.description7}</p>
          <h4>
            <strong>{data.text8}</strong>
          </h4>
          <p>{data.description8}</p>
          <ul>
            {data.items5.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
          <h4>
            <strong>{data.text9}</strong>
          </h4>
          <p>{data.description9}</p>
          <h4>
            <strong>{data.text10}</strong>
          </h4>
          <p>{data.description10}</p>
          <h4>
            <strong>{data.text11}</strong>
          </h4>
          <p>{data.description11}</p>
          <p>
            <strong>{data.text12}</strong>
            <br />
            {data.description12}
            <br />
            {data.description13}
            <br />
            {data.description14}
            <AppLink
              href={data.link2}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.label2}
            </AppLink>
          </p>
          <h4>
            <strong>{data.text13}</strong>
          </h4>
          <p>{data.description15}</p>
        </div>
      </div>
    </section>
  );
}
