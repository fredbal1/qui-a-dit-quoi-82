
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Configuration de Husky...');

try {
  // Créer le dossier .husky s'il n'existe pas
  const huskyDir = path.join(process.cwd(), '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
    console.log('📁 Dossier .husky créé');
  }

  // Créer le dossier _
  const huskyUnderscoreDir = path.join(huskyDir, '_');
  if (!fs.existsSync(huskyUnderscoreDir)) {
    fs.mkdirSync(huskyUnderscoreDir, { recursive: true });
    console.log('📁 Dossier .husky/_ créé');
  }

  // Créer le fichier husky.sh
  const huskyShContent = `#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
fi
`;

  fs.writeFileSync(path.join(huskyUnderscoreDir, 'husky.sh'), huskyShContent);
  fs.chmodSync(path.join(huskyUnderscoreDir, 'husky.sh'), '755');
  console.log('📄 Fichier husky.sh créé');

  // Mettre à jour le pre-commit existant avec les bonnes commandes
  const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Exécution des vérifications pre-commit..."

echo "📝 Vérification du formatage..."
npx prettier --check .

echo "🔍 Linting du code..."
npx eslint . --ext .ts,.tsx

echo "🧪 Exécution des tests..."
npm run test

echo "✅ Toutes les vérifications sont passées !"
`;

  fs.writeFileSync(path.join(huskyDir, 'pre-commit'), preCommitContent);
  fs.chmodSync(path.join(huskyDir, 'pre-commit'), '755');
  console.log('🪝 Hook pre-commit configuré');

  console.log('✅ Husky configuré avec succès !');
  console.log('📋 Hooks configurés :');
  console.log('   - pre-commit : formatage, linting, tests');
  console.log('🚀 Prêt pour GitHub !');

} catch (error) {
  console.error('❌ Erreur lors de la configuration de Husky:', error.message);
  console.log('⚠️  Husky ignoré, la CI GitHub Actions assurera la qualité du code');
  process.exit(0);
}
