import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidCNPJ(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          const cnpj = value.replace(/\D/g, '');
          
          // Verificar se tem 14 dígitos
          if (cnpj.length !== 14) return false;
          
          // Verificar se todos os dígitos são iguais
          if (/^(\d)\1+$/.test(cnpj)) return false;
          
          // Validar primeiro dígito verificador
          let soma = 0;
          let peso = 2;
          
          for (let i = 11; i >= 0; i--) {
            soma += parseInt(cnpj.charAt(i)) * peso;
            peso = peso === 9 ? 2 : peso + 1;
          }
          
          let resto = soma % 11;
          const digito1 = resto < 2 ? 0 : 11 - resto;
          
          if (digito1 !== parseInt(cnpj.charAt(12))) return false;
          
          // Validar segundo dígito verificador
          soma = 0;
          peso = 2;
          
          for (let i = 12; i >= 0; i--) {
            soma += parseInt(cnpj.charAt(i)) * peso;
            peso = peso === 9 ? 2 : peso + 1;
          }
          
          resto = soma % 11;
          const digito2 = resto < 2 ? 0 : 11 - resto;
          
          return digito2 === parseInt(cnpj.charAt(13));
        },
      },
    });
  };
}

