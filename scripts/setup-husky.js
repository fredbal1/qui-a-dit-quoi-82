
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, chmodSync, existsSync } from 'node:fs';
import { join } from 'node:path';

console.log('🔧 Configuration Husky (ESM)...');

try {
  const huskyDir = join(process.cwd(), '.husky');
  const underscoreDir = join(huskyDir, '_');

  if (!existsSync(huskyDir)) {
    mkdirSync(huskyDir, { recursive: true });
    console.log('📁 Dossier .husky créé');
  }

  if (!existsSync(underscoreDir)) {
    mkdirSync(underscoreDir, { recursive: true });
    console.log('📁 Dossier .husky/_ créé');
  }

  const huskySh = `#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  readonly hook_name="$(basename -- "$0")"
  export husky_skip_init=1
  sh -e "$0" "$@"
fi
`;

  writeFileSync(join(underscoreDir, 'husky.sh'), huskySh);
  chmodSync(join(underscoreDir, 'husky.sh'), 0o755);
  console.log('📄 Fichier husky.sh créé');

  const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Vérifications pre-commit..."

npx prettier --check .
npx eslint . --ext .ts,.tsx
npm run test

echo "✅ Tout est OK !"
`;

  writeFileSync(join(huskyDir, 'pre-commit'), preCommit);
  chmodSync(join(huskyDir, 'pre-commit'), 0o755);
  console.log('🪝 Hook pre-commit configuré');

  console.log('✅ Husky configuré avec succès !');

} catch (err) {
  console.error('❌ Erreur Husky :', err.message);
  process.exit(1);
}
