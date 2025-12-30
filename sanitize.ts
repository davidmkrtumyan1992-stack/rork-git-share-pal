import DOMPurify from 'dompurify';

/**
 * XSS Protection Utility
 * Санитизация и валидация пользовательских данных для защиты от XSS атак
 */

/**
 * Очищает HTML от потенциально опасных элементов и скриптов
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Не разрешаем HTML теги
    ALLOWED_ATTR: [], // Не разрешаем атрибуты
    KEEP_CONTENT: true // Сохраняем текстовое содержимое
  });
}

/**
 * Очищает текст от HTML и потенциально опасных символов
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Удаляем HTML теги и сущности
  const cleaned = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true
  });
  
  // Экранируем специальные символы
  return cleaned
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Валидирует и очищает имя пользователя
 */
export function sanitizeUsername(username: string): string {
  if (!username) return '';
  
  // Удаляем все, кроме букв, цифр, дефисов и подчеркиваний
  const cleaned = username
    .trim()
    .replace(/[^\p{L}\p{N}_-]/gu, '')
    .substring(0, 50); // Максимум 50 символов
  
  return sanitizeText(cleaned);
}

/**
 * Валидирует и очищает email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  const cleaned = email.trim().toLowerCase();
  
  // Базовая валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }
  
  return sanitizeText(cleaned);
}

/**
 * Очищает пользовательский текст (заметки, антидоты)
 */
export function sanitizeUserInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';
  
  // Обрезаем до максимальной длины
  const trimmed = input.trim().substring(0, maxLength);
  
  // Санитизация
  return sanitizeText(trimmed);
}

/**
 * Проверяет наличие потенциально опасных паттернов
 */
export function containsDangerousPatterns(text: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, и т.д.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(text));
}

/**
 * Безопасное отображение пользовательского контента
 */
export function safeDisplay(content: string | null | undefined): string {
  if (!content) return '';
  
  const sanitized = sanitizeText(content);
  
  // Дополнительная проверка на опасные паттерны
  if (containsDangerousPatterns(sanitized)) {
    console.warn('Dangerous pattern detected in content');
    return '[Content blocked for security reasons]';
  }
  
  return sanitized;
}

/**
 * Валидация URL для предотвращения javascript: и data: схем
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  const cleaned = url.trim();
  
  // Блокируем опасные схемы
  const dangerousSchemes = /^(javascript|data|vbscript):/i;
  if (dangerousSchemes.test(cleaned)) {
    console.warn('Dangerous URL scheme detected');
    return '';
  }
  
  return cleaned;
}

/**
 * Декодирует HTML сущности обратно в символы для отображения
 */
export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}
