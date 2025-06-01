
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Créer le dossier .husky s'il n'existe pas
const huskyDir = path.join(process.cwd(), '.husky');
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true });
}

// Créer le dossier _
const huskyUnderscoreDir = path.join(huskyDir, '_');
if (!fs.existsSync(huskyUnderscoreDir)) {
  fs.mkdirSync(huskyUnderscoreDir, { recursive: true });
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

console.log('✅ Husky setup completed successfully!');
