
const { execSync } = require('child_process');
const { mkdirSync, existsSync, writeFileSync, chmodSync } = require('fs');
const { join } = require('path');
const { cwd } = require('process');

console.log('🔧 Configuration de Husky...');

try {
  const huskyDir = join(cwd(), '.husky');
  const huskyUnderscoreDir = join(huskyDir, '_');

  if (!existsSync(huskyDir)) {
    mkdirSync(huskyDir, { recursive: true });
    console.log('📁 Dossier .husky créé');
  }

  if (!existsSync(huskyUnderscoreDir)) {
    mkdirSync(huskyUnderscoreDir, { recursive: true });
    console.log('📁 Dossier .husky/_ créé');
  }

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

  writeFileSync(join(huskyUnderscoreDir, 'husky.sh'), huskyShContent);
  chmodSync(join(huskyUnderscoreDir, 'husky.sh'), 0o755);
  console.log('📄 Fichier husky.sh créé');

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

  writeFileSync(join(huskyDir, 'pre-commit'), preCommitContent);
  chmodSync(join(huskyDir, 'pre-commit'), 0o755);
  console.log('🪝 Hook pre-commit configuré');

  console.log('✅ Husky configuré avec succès !');
  console.log('📋 Hooks configurés :');
  console.log('   - pre-commit : formatage, linting, tests');
  console.log('🚀 Prêt pour GitHub !');

} catch (error) {
  console.error('❌ Erreur lors de la configuration de Husky :', error.message);
  console.log('⚠️  Husky ignoré, la CI GitHub Actions assurera la qualité du code');
  process.exit(0);
}
