
// Script simplifié pour éviter les erreurs d'installation
// Configuration Husky basique pour le développement local

import { execSync } from 'child_process';
import { existsSync } from 'fs';

try {
  // Vérifier si nous sommes dans un environnement CI
  if (process.env.CI || process.env.GITHUB_ACTIONS) {
    console.log('🔧 Environnement CI détecté - Husky ignoré');
    process.exit(0);
  }

  // Vérifier si .git existe
  if (!existsSync('.git')) {
    console.log('🔧 Pas de repository Git - Husky ignoré');
    process.exit(0);
  }

  console.log('🔧 Configuration Husky en cours...');
  
  // Configuration minimale
  execSync('npx husky install', { stdio: 'inherit' });
  
  console.log('✅ Husky configuré avec succès !');
  
} catch (error) {
  console.log('⚠️  Husky ignoré:', error.message);
  // Ne pas faire échouer l'installation si Husky ne peut pas être configuré
  process.exit(0);
}
