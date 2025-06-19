#!/bin/bash

echo "🌱 EXECUTANDO SEEDERS - Sistema de Kitnets"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# 2. Verificar se o banco está acessível
log_info "Verificando conexão com banco de dados..."
psql -U postgres -d kitnet_db -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    log_success "Conexão com banco OK"
else
    log_error "Erro de conexão com banco. Verifique se o PostgreSQL está rodando e o banco 'kitnet_db' existe."
    log_info "Para criar o banco: createdb -U postgres kitnet_db"
    exit 1
fi

# 3. Verificar se as migrations foram executadas
log_info "Verificando se as migrations foram executadas..."
TABLES_COUNT=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('plano_assinatura', 'empresa', 'user', 'kitnet', 'inquilino', 'contrato_locacao', 'fatura');" 2>/dev/null | tr -d ' ')

if [ "$TABLES_COUNT" -eq "7" ]; then
    log_success "Todas as tabelas necessárias encontradas"
else
    log_error "Nem todas as tabelas foram criadas. Execute as migrations primeiro:"
    log_info "npm run typeorm:run-migrations"
    exit 1
fi

# 4. Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    log_info "Instalando dependências..."
    npm install
fi

# 5. Verificar se bcrypt está instalado
log_info "Verificando dependências..."
npm list bcrypt > /dev/null 2>&1
if [ $? -ne 0 ]; then
    log_warning "Instalando bcrypt..."
    npm install bcrypt @types/bcrypt
fi

# 6. Compilar TypeScript se necessário
if [ ! -d "dist" ]; then
    log_info "Compilando TypeScript..."
    npx tsc run-seeders.ts --target es2020 --module commonjs --esModuleInterop --skipLibCheck
fi

# 7. Executar seeders
log_info "Executando seeders..."
ts-node run-seeders.ts

if [ $? -eq 0 ]; then
    log_success "🎉 Seeders executados com sucesso!"
    
    echo ""
    log_info "📊 Verificando dados criados:"
    
    # Contar registros em cada tabela
    PLANOS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM plano_assinatura;" | tr -d ' ')
    EMPRESAS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM empresa;" | tr -d ' ')
    USUARIOS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM \"user\";" | tr -d ' ')
    KITNETS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM kitnet;" | tr -d ' ')
    INQUILINOS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM inquilino;" | tr -d ' ')
    CONTRATOS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM contrato_locacao;" | tr -d ' ')
    FATURAS=$(psql -U postgres -d kitnet_db -t -c "SELECT COUNT(*) FROM fatura;" | tr -d ' ')
    
    echo "   - $PLANOS Planos de Assinatura"
    echo "   - $EMPRESAS Empresas"
    echo "   - $USUARIOS Usuários"
    echo "   - $KITNETS Kitnets"
    echo "   - $INQUILINOS Inquilinos"
    echo "   - $CONTRATOS Contratos"
    echo "   - $FATURAS Faturas"
    
    echo ""
    log_success "🎯 Banco de dados populado e pronto para uso!"
    echo ""
    log_info "👥 Usuários de teste criados:"
    echo "   - admin@sistema.com (SuperAdmin) - Senha: 123456"
    echo "   - admin@imoveissp.com.br (AdminEmpresa) - Senha: 123456"
    echo "   - admin@kitnetsrj.com.br (AdminEmpresa) - Senha: 123456"
    echo "   - admin@habitacaobh.com.br (AdminEmpresa) - Senha: 123456"
    echo ""
    log_info "🚀 Próximos passos:"
    echo "   1. Teste o login na aplicação"
    echo "   2. Verifique os dados no banco"
    echo "   3. Comece a desenvolver suas funcionalidades"
    
else
    log_error "Erro ao executar seeders. Verifique os logs acima."
    
    echo ""
    log_warning "💡 SOLUÇÕES ALTERNATIVAS:"
    echo "1. Verificar se todas as dependências estão instaladas: npm install"
    echo "2. Verificar se o arquivo .env está configurado corretamente"
    echo "3. Executar manualmente: ts-node run-seeders.ts"
    echo "4. Verificar logs de erro detalhados acima"
    
    exit 1
fi

