import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          const cpf = value.replace(/\D/g, '');
          
          // Verificar se tem 11 dígitos
          if (cpf.length !== 11) return false;
          
          // Verificar se todos os dígitos são iguais
          if (/^(\d)\1+$/.test(cpf)) return false;
          
          // Validar primeiro dígito verificador
          let soma = 0;
          for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
          }
          
          let resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(9))) return false;
          
          // Validar segundo dígito verificador
          soma = 0;
          for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
          }
          
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          
          return resto === parseInt(cpf.charAt(10));
        },
      },
    });
  };
}

