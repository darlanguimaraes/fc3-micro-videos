import { Entity } from '../entity';
import { ValueObject } from '../value-object'; // Importar ValueObject

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    let idsMessage: string;
    if (Array.isArray(id)) {
      // Garante que cada item do array seja convertido para string
      idsMessage = id.map((item) => item.toString()).join(', ');
    } else if (
      id instanceof ValueObject ||
      (typeof id === 'object' &&
        id !== null &&
        typeof id.toString === 'function' &&
        id.toString !== Object.prototype.toString)
    ) {
      // Usa toString() se for ValueObject ou um objeto com toString() customizado
      idsMessage = id.toString();
    } else {
      // Caso contrário, converte diretamente para string (para primitivos ou objetos sem toString)
      idsMessage = String(id);
    }
    super(`${entityClass.name} Not Found using ID ${idsMessage}`);
    this.name = 'NotFoundError';
  }
}
