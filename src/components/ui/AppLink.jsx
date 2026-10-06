import { Link } from "react-router-dom";

export default function AppLink({ href = "/", children, ...props }) {
  const internal =
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !/\.(pdf|webp|png|jpe?g|ttf|svg)(?:[?#]|$)/i.test(href);
  if (internal && !props.download && !props.target)
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
