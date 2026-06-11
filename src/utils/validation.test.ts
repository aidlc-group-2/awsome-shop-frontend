import { describe, it, expect } from 'vitest';
import {
  isEnterpriseEmail,
  isValidUsername,
  validatePassword,
  passwordsMatch,
} from './validation';

describe('isEnterpriseEmail', () => {
  const allowedDomains = ['amazon.com', 'aws.com'];

  it('returns true for valid enterprise email', () => {
    expect(isEnterpriseEmail('user@amazon.com', allowedDomains)).toBe(true);
    expect(isEnterpriseEmail('user@aws.com', allowedDomains)).toBe(true);
  });

  it('is case-insensitive on domain', () => {
    expect(isEnterpriseEmail('user@AMAZON.COM', allowedDomains)).toBe(true);
    expect(isEnterpriseEmail('user@Amazon.Com', allowedDomains)).toBe(true);
  });

  it('returns false for non-enterprise domain', () => {
    expect(isEnterpriseEmail('user@gmail.com', allowedDomains)).toBe(false);
  });

  it('returns false for invalid email syntax', () => {
    expect(isEnterpriseEmail('noatsign', allowedDomains)).toBe(false);
    expect(isEnterpriseEmail('@amazon.com', allowedDomains)).toBe(false);
    expect(isEnterpriseEmail('user@', allowedDomains)).toBe(false);
    expect(isEnterpriseEmail('user@@amazon.com', allowedDomains)).toBe(false);
    expect(isEnterpriseEmail('user @amazon.com', allowedDomains)).toBe(false);
  });

  it('returns false when domain has no dot', () => {
    expect(isEnterpriseEmail('user@localhost', ['localhost'])).toBe(false);
  });
});

describe('isValidUsername', () => {
  it('returns true for valid usernames', () => {
    expect(isValidUsername('abc')).toBe(true);
    expect(isValidUsername('user-name')).toBe(true);
    expect(isValidUsername('user_name')).toBe(true);
    expect(isValidUsername('User123')).toBe(true);
    expect(isValidUsername('a'.repeat(30))).toBe(true);
  });

  it('returns false for too short', () => {
    expect(isValidUsername('ab')).toBe(false);
    expect(isValidUsername('')).toBe(false);
  });

  it('returns false for too long', () => {
    expect(isValidUsername('a'.repeat(31))).toBe(false);
  });

  it('returns false for invalid characters', () => {
    expect(isValidUsername('user name')).toBe(false);
    expect(isValidUsername('user@name')).toBe(false);
    expect(isValidUsername('user.name')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('returns strong for password meeting all rules', () => {
    const result = validatePassword('Abcdef1!');
    expect(result.strength).toBe('strong');
    expect(result.isValid).toBe(true);
    expect(result.checks.minLength).toBe(true);
    expect(result.checks.maxLength).toBe(true);
    expect(result.checks.hasUppercase).toBe(true);
    expect(result.checks.hasLowercase).toBe(true);
    expect(result.checks.hasDigit).toBe(true);
    expect(result.checks.hasSpecialChar).toBe(true);
  });

  it('returns medium for length + 2 char-type rules', () => {
    const result = validatePassword('abcdefg1'); // lowercase + digit
    expect(result.strength).toBe('medium');
    expect(result.isValid).toBe(false);
  });

  it('returns medium for length + 3 char-type rules', () => {
    const result = validatePassword('Abcdefg1'); // uppercase + lowercase + digit
    expect(result.strength).toBe('medium');
    expect(result.isValid).toBe(false);
  });

  it('returns weak for password meeting only length', () => {
    const result = validatePassword('abcdefgh'); // only lowercase, only 1 char-type
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
  });

  it('returns weak for password too short', () => {
    const result = validatePassword('Ab1!');
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
    expect(result.checks.minLength).toBe(false);
  });

  it('returns weak for password too long', () => {
    const result = validatePassword('A'.repeat(65) + 'a1!');
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
    expect(result.checks.maxLength).toBe(false);
  });

  it('recognizes special characters from the set !@#$%^&*()-_+=', () => {
    const specialChars = '!@#$%^&*()-_+=';
    for (const char of specialChars) {
      const result = validatePassword(`Abcdef1${char}`);
      expect(result.checks.hasSpecialChar).toBe(true);
    }
  });
});

describe('passwordsMatch', () => {
  it('returns true for identical strings', () => {
    expect(passwordsMatch('password123', 'password123')).toBe(true);
  });

  it('returns false for different strings', () => {
    expect(passwordsMatch('password123', 'password124')).toBe(false);
  });

  it('returns true for empty strings', () => {
    expect(passwordsMatch('', '')).toBe(true);
  });

  it('is case-sensitive', () => {
    expect(passwordsMatch('Password', 'password')).toBe(false);
  });
});
