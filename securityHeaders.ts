/**
 * Security Headers Configuration
 * Настройка заголовков безопасности для защиты от XSS и других атак
 */

/**
 * Content Security Policy (CSP)
 * Ограничивает источники загружаемого контента
 */
export const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:", "blob:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https://*.supabase.co"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"]
};

/**
 * Генерирует CSP заголовок
 */
export function generateCSP(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Рекомендуемые заголовки безопасности
 * Добавьте эти заголовки в конфигурацию вашего сервера
 */
export const SECURITY_HEADERS = {
  // Защита от XSS
  'X-XSS-Protection': '1; mode=block',
  
  // Запрет загрузки в iframe (защита от clickjacking)
  'X-Frame-Options': 'DENY',
  
  // Запрет MIME-sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Content Security Policy
  'Content-Security-Policy': generateCSP(),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Применяет заголовки безопасности к Response
 */
export function applySecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
