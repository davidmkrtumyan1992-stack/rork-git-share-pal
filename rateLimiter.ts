/**
 * Rate Limiter Utility
 * Защита от спама и чрезмерного количества запросов
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private records: Map<string, RequestRecord> = new Map();

  /**
   * Проверяет, можно ли выполнить действие
   * @param key - уникальный ключ для действия (например, 'login:user@email.com' или 'api:endpoint')
   * @param config - конфигурация ограничения
   * @returns true если запрос разрешен, false если превышен лимит
   */
  check(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const record = this.records.get(key);

    // Если нет записи или время окна истекло, создаем новую запись
    if (!record || now > record.resetTime) {
      this.records.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    // Если превышен лимит
    if (record.count >= config.maxRequests) {
      return false;
    }

    // Увеличиваем счетчик
    record.count++;
    return true;
  }

  /**
   * Получает информацию о текущем состоянии лимита
   */
  getStatus(key: string): { remaining: number; resetTime: number } | null {
    const record = this.records.get(key);
    if (!record || Date.now() > record.resetTime) {
      return null;
    }
    return {
      remaining: Math.max(0, record.count),
      resetTime: record.resetTime
    };
  }

  /**
   * Сбрасывает лимит для конкретного ключа
   */
  reset(key: string): void {
    this.records.delete(key);
  }

  /**
   * Очищает все записи
   */
  clear(): void {
    this.records.clear();
  }

  /**
   * Очищает устаревшие записи (автоматическая очистка памяти)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetTime) {
        this.records.delete(key);
      }
    }
  }
}

// Глобальный экземпляр rate limiter
export const rateLimiter = new RateLimiter();

// Автоматическая очистка каждые 5 минут
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

/**
 * Предустановленные конфигурации для разных типов действий
 */
export const rateLimitConfigs = {
  // Аутентификация: максимум 5 попыток в 15 минут
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Слишком много попыток входа. Попробуйте позже.'
  },
  
  // API запросы: максимум 30 запросов в минуту
  api: {
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: 'Слишком много запросов. Пожалуйста, подождите.'
  },
  
  // Операции с данными (создание/обновление): максимум 10 в минуту
  dataOperation: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: 'Слишком быстрые изменения. Пожалуйста, подождите.'
  },
  
  // Отправка уведомлений: максимум 5 в час
  notifications: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
    message: 'Достигнут лимит уведомлений. Попробуйте позже.'
  }
};

/**
 * Декоратор функции с rate limiting
 */
export function withRateLimit<T extends (...args: any[]) => any>(
  fn: T,
  key: string,
  config: RateLimitConfig
): T {
  return ((...args: Parameters<T>) => {
    if (!rateLimiter.check(key, config)) {
      throw new Error(config.message || 'Rate limit exceeded');
    }
    return fn(...args);
  }) as T;
}
