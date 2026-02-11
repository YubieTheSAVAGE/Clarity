const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateTransactionType(type: string): string | null {
  if (type !== "income" && type !== "expense") return "Type must be 'income' or 'expense'";
  return null;
}

export function validateAmount(amount: unknown): number | null {
  const n = Number(amount);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}
