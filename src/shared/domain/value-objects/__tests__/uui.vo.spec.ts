import { InvalidUuidError, Uuid } from '../uuid.vo';
import { validate as uuidValidate } from 'uuid';

const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

describe('Uuid Unit Tests', () => {
  test('should throw InvalidUuidError when uuid string is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalledTimes(1);

    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrow("ID must be a valid UUID");
  });

  test('should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should accept a valid uuid', () => {
    const uuid = new Uuid('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    expect(uuid.id).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
