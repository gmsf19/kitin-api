import { Expose, Transform } from 'class-transformer';
import { StatusKitnet } from '../../../entities/kitnet.entity';

export class KitnetResponseDto {
  @Expose()
  id: string;

  @Expose()
  nome_identificador: string;

  @Expose()
  endereco_completo: string;

  @Expose()
  area_m2: number;

  @Expose()
  valor_aluguel_base: number;

  @Expose()
  descricao: string;

  @Expose()
  caracteristicas: string;

  @Expose()
  status: StatusKitnet;

  @Expose()
  data_aquisicao: Date;

  @Expose()
  nota_media_kitnet: number;

  @Expose()
  selo_melhor_imovel: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Campos calculados
  @Expose()
  @Transform(({ obj }) => {
    try {
      return obj.fotos_urls ? JSON.parse(obj.fotos_urls) : [];
    } catch {
      return [];
    }
  })
  fotos: string[];

  @Expose()
  @Transform(({ obj }) => {
    return obj.caracteristicas 
      ? obj.caracteristicas.split(',').map(c => c.trim()).filter(c => c)
      : [];
  })
  caracteristicas_lista: string[];

  @Expose()
  @Transform(({ obj }) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(obj.valor_aluguel_base);
  })
  valor_formatado: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.area_m2 ? `${obj.area_m2} m²` : 'Não informado';
  })
  area_formatada: string;

  @Expose()
  @Transform(({ obj }) => {
    const partes = obj.endereco_completo.split(' - ');
    return partes.length >= 3 ? partes[partes.length - 3] : '';
  })
  bairro: string;

  @Expose()
  @Transform(({ obj }) => {
    const partes = obj.endereco_completo.split(' - ');
    return partes.length >= 2 ? partes[partes.length - 2] : '';
  })
  cidade: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.status === StatusKitnet.DISPONIVEL;
  })
  disponivel: boolean;

  @Expose()
  @Transform(({ obj }) => {
    return obj.nota_media_kitnet ? obj.nota_media_kitnet.toFixed(1) : '0.0';
  })
  nota_formatada: string;

  @Expose()
  @Transform(({ obj }) => {
    const estrelas = Math.round(obj.nota_media_kitnet || 0);
    return '★'.repeat(estrelas) + '☆'.repeat(5 - estrelas);
  })
  nota_estrelas: string;
}

