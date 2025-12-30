import { useCallback, useRef } from 'react';
import { rateLimiter, rateLimitConfigs } from '@/utils/rateLimiter';
import { toast } from '@/hooks/use-toast';

interface UseRateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message?: string;
  onLimitExceeded?: () => void;
}

type RateLimitPreset = keyof typeof rateLimitConfigs;

/**
 * Хук для защиты функций от спама с использованием rate limiting
 * 
 * @example
 * // С пресетом
 * const { execute } = useRateLimit('auth');
 * const handleLogin = execute(async () => {
 *   await signIn(email, password);
 * }, 'login');
 * 
 * @example
 * // С кастомной конфигурацией
 * const { execute } = useRateLimit({
 *   maxRequests: 10,
 *   windowMs: 60000,
 *   message: 'Слишком много попыток'
 * });
 */
export function useRateLimit(
  configOrPreset: UseRateLimitOptions | RateLimitPreset
) {
  const config = typeof configOrPreset === 'string' 
    ? rateLimitConfigs[configOrPreset]
    : configOrPreset;

  const executeCount = useRef(0);

  /**
   * Оборачивает функцию с rate limiting
   */
  const execute = useCallback(
    <T extends (...args: any[]) => any>(
      fn: T,
      identifier: string
    ): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
      return (...args: Parameters<T>) => {
        const key = `${identifier}:${executeCount.current}`;
        
        if (!rateLimiter.check(key, config)) {
          const message = config.message || 'Слишком много запросов. Попробуйте позже.';
          
          toast({
            title: 'Превышен лимит',
            description: message,
            variant: 'destructive'
          });

          if ('onLimitExceeded' in config && config.onLimitExceeded) {
            config.onLimitExceeded();
          }

          return undefined;
        }

        executeCount.current++;
        return fn(...args);
      };
    },
    [config]
  );

  /**
   * Асинхронная версия execute с обработкой ошибок
   */
  const executeAsync = useCallback(
    <T extends (...args: any[]) => Promise<any>>(
      fn: T,
      identifier: string
    ): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined>) => {
      return async (...args: Parameters<T>) => {
        const key = `${identifier}:${executeCount.current}`;
        
        if (!rateLimiter.check(key, config)) {
          const message = config.message || 'Слишком много запросов. Попробуйте позже.';
          
          toast({
            title: 'Превышен лимит',
            description: message,
            variant: 'destructive'
          });

          if ('onLimitExceeded' in config && config.onLimitExceeded) {
            config.onLimitExceeded();
          }

          return undefined;
        }

        executeCount.current++;
        
        try {
          return await fn(...args);
        } catch (error) {
          console.error('Error in rate-limited function:', error);
          throw error;
        }
      };
    },
    [config]
  );

  return {
    execute,
    executeAsync
  };
}
