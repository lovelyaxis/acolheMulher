// src/components/Button.jsx
export default function ButtonLuna({
  variant = "primary",
  onClick,
  type = "button",
  children,
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "border border-brand bg-white text-brand hover:bg-page",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-xl px-5 py-3 font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant] ?? variants.primary}`}
    >
      {children}
    </button>
  );
}
