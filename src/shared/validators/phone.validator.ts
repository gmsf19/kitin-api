import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          const phone = value.replace(/\D/g, '');
          
          // Verificar se tem 10 ou 11 dígitos (com DDD)
          if (phone.length !== 10 && phone.length !== 11) return false;
          
          // Verificar se o DDD é válido (11 a 99)
          const ddd = parseInt(phone.substring(0, 2));
          if (ddd < 11 || ddd > 99) return false;
          
          // Para celular (11 dígitos), o terceiro dígito deve ser 9
          if (phone.length === 11) {
            const terceiroDigito = parseInt(phone.charAt(2));
            if (terceiroDigito !== 9) return false;
          }
          
          // Verificar se não são todos os dígitos iguais
          if (/^(\d)\1+$/.test(phone)) return false;
          
          return true;
        },
      },
    });
  };
}

