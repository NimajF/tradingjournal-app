// Email validation
export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";

  return null;
}

// Password validation
export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";

  return null;
}

// Username validation
export function validateUsername(username: string): string | null {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    // Only allow letters, numbers, _ and -
    return "Username can only contain letters, numbers, _, and -";

  return null;
}
