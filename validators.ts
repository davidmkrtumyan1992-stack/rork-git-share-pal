/**
 * Input Validation Utilities
 * Валидация пользовательских данных для предотвращения XSS и инъекций
 */

/**
 * Валидирует длину строки
 */
export function validateLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Валидирует email адрес
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидирует имя пользователя
 */
export function validateUsername(username: string): boolean {
  // Только буквы, цифры, дефисы и подчеркивания
  const usernameRegex = /^[\p{L}\p{N}_-]+$/u;
  return usernameRegex.test(username) && validateLength(username, 3, 50);
}

/**
 * Валидирует пароль
 */
export function validatePassword(password: string): boolean {
  return validateLength(password, 6, 100);
}

/**
 * Проверяет наличие SQL инъекций
 */
export function containsSqlInjection(value: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(-{2}|\/\*|\*\/)/,
    /(;|\||&)/
  ];
  
  return sqlPatterns.some(pattern => pattern.test(value));
}

/**
 * Проверяет наличие потенциальных XSS паттернов
 */
export function containsXssPattern(value: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\(/i
  ];
  
  return xssPatterns.some(pattern => pattern.test(value));
}

/**
 * Комплексная валидация пользовательского ввода
 */
export function validateUserInput(
  value: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowHtml?: boolean;
    checkSql?: boolean;
    checkXss?: boolean;
  } = {}
): { valid: boolean; error?: string } {
  const {
    minLength = 0,
    maxLength = 1000,
    allowHtml = false,
    checkSql = true,
    checkXss = true
  } = options;

  if (!validateLength(value, minLength, maxLength)) {
    return {
      valid: false,
      error: `Length must be between ${minLength} and ${maxLength} characters`
    };
  }

  if (checkSql && containsSqlInjection(value)) {
    return {
      valid: false,
      error: 'Input contains potentially dangerous SQL patterns'
    };
  }

  if (!allowHtml && checkXss && containsXssPattern(value)) {
    return {
      valid: false,
      error: 'Input contains potentially dangerous XSS patterns'
    };
  }

  return { valid: true };
}
