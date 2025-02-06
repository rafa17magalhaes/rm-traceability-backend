import * as crypto from 'crypto';

/**
 * Gera uma string hexadecimal aleatória.
 * @param size Número de bytes (padrão: 5)
 */
export function generateRandomHex(size: number = 5): string {
  return crypto.randomBytes(size).toString('hex');
}

/**
 * Formata uma data para o padrão ISO.
 * @param date A data a ser formatada.
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}
