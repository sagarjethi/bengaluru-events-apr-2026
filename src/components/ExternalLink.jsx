export default function ExternalLink({ href, children, className = '', ...rest }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={className}
      {...rest}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
