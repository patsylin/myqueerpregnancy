// src/components/UI.jsx
import { isExternal, openInNewTab, safeOnClick } from "../lib/navigation";

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  style,
  ...rest
}) {
  return (
    <button
      type={type} // prevents accidental form submits
      onClick={safeOnClick(onClick)}
      disabled={disabled}
      style={{
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "#f2f2f2" : "#fff",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SmartLink({
  href = "",
  children,
  newTabIfExternal = true,
  ...rest
}) {
  if (newTabIfExternal && isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

export function ExternalLink({ href, children, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
