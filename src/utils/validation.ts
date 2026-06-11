export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  checks: {
    minLength: boolean;
    maxLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasDigit: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Validates that an email is syntactically valid and belongs to one of the allowed enterprise domains.
 */
export function isEnterpriseEmail(email: string, allowedDomains: string[]): boolean {
  // Basic email syntax: must have exactly one @, non-empty local part and domain part
  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex === email.length - 1) {
    return false;
  }

  // Ensure no additional @ symbols
  if (email.indexOf('@', atIndex + 1) !== -1) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1).toLowerCase();

  // Local part must not be empty and must not contain whitespace
  if (localPart.length === 0 || /\s/.test(localPart)) {
    return false;
  }

  // Domain part must not be empty, must not contain whitespace, and must have at least one dot
  if (domainPart.length === 0 || /\s/.test(domainPart) || !domainPart.includes('.')) {
    return false;
  }

  // Check domain against whitelist (case-insensitive)
  return allowedDomains.some(
    (allowed) => domainPart === allowed.toLowerCase()
  );
}

/**
 * Validates that a username is between 3-30 characters and contains only
 * alphanumeric characters, hyphens, or underscores.
 */
export function isValidUsername(username: string): boolean {
  if (username.length < 3 || username.length > 30) {
    return false;
  }
  return /^[a-zA-Z0-9_-]+$/.test(username);
}

const SPECIAL_CHARS = '!@#$%^&*()-_+=';

/**
 * Validates a password and returns a result with strength classification and individual checks.
 *
 * Strength classification:
 * - "strong": meets all rules (8-64 chars, uppercase, lowercase, digit, special char)
 * - "medium": meets length requirement (minLength + maxLength) plus exactly 2 or 3 of the 4 character-type rules
 * - "weak": everything else (doesn't meet length requirements, or meets length but fewer than 2 character-type rules)
 */
export function validatePassword(password: string): PasswordValidationResult {
  const checks = {
    minLength: password.length >= 8,
    maxLength: password.length <= 64,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSpecialChar: hasSpecialCharacter(password),
  };

  const meetsLength = checks.minLength && checks.maxLength;
  const charTypeChecks = [
    checks.hasUppercase,
    checks.hasLowercase,
    checks.hasDigit,
    checks.hasSpecialChar,
  ];
  const charTypeCount = charTypeChecks.filter(Boolean).length;

  let strength: PasswordStrength;

  if (meetsLength && charTypeCount === 4) {
    strength = 'strong';
  } else if (meetsLength && (charTypeCount === 2 || charTypeCount === 3)) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    isValid: strength === 'strong',
    strength,
    checks,
  };
}

function hasSpecialCharacter(password: string): boolean {
  for (const char of password) {
    if (SPECIAL_CHARS.includes(char)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if the password and confirmation are strictly equal.
 */
export function passwordsMatch(password: string, confirmation: string): boolean {
  return password === confirmation;
}
