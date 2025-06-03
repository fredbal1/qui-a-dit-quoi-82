
#!/usr/bin/env ts-node

/**
 * Script de réinitialisation de l'environnement de développement
 * Usage: npm run dev:reset
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetDevEnvironment() {
  console.log('🔄 Début de la réinitialisation de l\'environnement de dev...\n');

  try {
    // 1. Nettoyer les données de test
    console.log('🗑️  Suppression des données de test...');
    
    const tables = [
      'votes',
      'answers', 
      'rounds',
      'game_players',
      'games',
      'user_purchases',
      'game_history'
    ];

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy
      
      if (error && !error.message.includes('no rows')) {
        console.warn(`⚠️  Erreur lors du nettoyage de ${table}:`, error.message);
      } else {
        console.log(`   ✅ ${table} nettoyée`);
      }
    }

    // 2. Réinitialiser les stats utilisateur (sauf pour les admins)
    console.log('\n📊 Réinitialisation des stats utilisateur...');
    const { error: statsError } = await supabase
      .from('user_stats')
      .update({
        games_played: 0,
        games_won: 0,
        level: 1,
        total_xp: 0,
        coins: 100, // Donner quelques coins de départ
        best_streak: 0,
        bluffs_successful: 0,
        bluffs_detected: 0
      })
      .neq('user_id', '00000000-0000-0000-0000-000000000000');

    if (statsError) {
      console.warn('⚠️  Erreur lors de la réinitialisation des stats:', statsError.message);
    } else {
      console.log('   ✅ Stats utilisateur réinitialisées');
    }

    // 3. Créer des données de test utiles
    console.log('\n🎲 Création de données de test...');

    // Créer une partie de test
    const { data: testGame, error: gameError } = await supabase
      .from('games')
      .insert({
        code: 'TEST123',
        status: 'waiting',
        mode: 'classique',
        ambiance: 'safe',
        max_players: 6,
        rounds_total: 3,
        current_round: 0
      })
      .select()
      .single();

    if (gameError) {
      console.warn('⚠️  Erreur lors de la création de la partie de test:', gameError.message);
    } else {
      console.log('   ✅ Partie de test créée (code: TEST123)');
    }

    // 4. Vérifier la configuration
    console.log('\n🔍 Vérification de la configuration...');
    
    const checks = [
      { name: 'Tables games', query: supabase.from('games').select('count').limit(1) },
      { name: 'Tables profiles', query: supabase.from('profiles').select('count').limit(1) },
      { name: 'Tables questions', query: supabase.from('questions').select('count').limit(1) },
      { name: 'Tables shop_items', query: supabase.from('shop_items').select('count').limit(1) }
    ];

    for (const check of checks) {
      const { error } = await check.query;
      if (error) {
        console.log(`   ❌ ${check.name}: ${error.message}`);
      } else {
        console.log(`   ✅ ${check.name}: accessible`);
      }
    }

    console.log('\n🎉 Réinitialisation terminée avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('   1. npm run dev');
    console.log('   2. Créer un compte de test');
    console.log('   3. Rejoindre la partie TEST123');
    console.log('   4. Tester les fonctionnalités');

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  resetDevEnvironment()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default resetDevEnvironment;
