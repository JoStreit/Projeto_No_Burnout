#!/bin/bash
# Script de deploy — rode no servidor após cada atualização do GitHub
set -e

APP_DIR="/var/www/calmamentes"

echo "🔄 Atualizando código..."
cd "$APP_DIR"
git pull origin main

echo "📦 Instalando dependências..."
NODE_ENV=development npm ci

echo "🔨 Construindo aplicação..."
npm run build

echo "♻️  Reiniciando serviço..."
pm2 restart calmamentes

echo "✅ Deploy concluído!"
