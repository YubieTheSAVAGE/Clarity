type BadgeVariant = "income" | "expense" | "neutral";

type BadgeProps = {
  variant: BadgeVariant;
  children: React.ReactNode;
};

export function Badge({ variant, children }: BadgeProps) {
  return <span className={`ui-badge ui-badge--${variant}`}>{children}</span>;
}
