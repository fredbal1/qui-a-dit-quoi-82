
import { test, expect } from '@playwright/test';

/**
 * Test E2E du flow principal de KIADISA
 * Simule le parcours complet d'un joueur
 */

test.describe('KIADISA - Flow principal', () => {
  
  test('Flow complet: connexion → créer partie → jouer', async ({ page }) => {
    // 1. Aller sur la page d'accueil
    await page.goto('/');
    
    // Vérifier que la page d'accueil se charge
    await expect(page).toHaveTitle(/KIADISA/);
    await expect(page.locator('h1')).toContainText('KIADISA');
    
    // 2. Navigation vers l'authentification
    await page.click('text=Se connecter');
    await expect(page).toHaveURL(/.*auth.*/);
    
    // 3. Inscription d'un nouvel utilisateur
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    await page.click('text=S\'inscrire');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Attendre la redirection vers le dashboard
    await expect(page).toHaveURL(/.*dashboard.*/);
    
    // 4. Créer une nouvelle partie
    await page.click('text=Créer une partie');
    await expect(page).toHaveURL(/.*create-game.*/);
    
    // Configurer la partie
    await page.selectOption('select[name="mode"]', 'classique');
    await page.selectOption('select[name="ambiance"]', 'safe');
    await page.fill('input[name="maxPlayers"]', '4');
    await page.fill('input[name="rounds"]', '3');
    
    await page.click('button[type="submit"]');
    
    // Vérifier qu'on arrive dans le lobby
    await expect(page).toHaveURL(/.*lobby.*/);
    await expect(page.locator('[data-testid="game-code"]')).toBeVisible();
    
    // 5. Démarrer la partie (en tant que host)
    await page.click('text=Démarrer la partie');
    
    // Vérifier qu'on arrive dans le jeu
    await expect(page).toHaveURL(/.*game.*/);
    await expect(page.locator('[data-testid="game-phase"]')).toBeVisible();
  });
  
  test('Rejoindre une partie existante', async ({ page }) => {
    // 1. Aller sur la page de connexion d'une partie
    await page.goto('/join-game');
    
    // 2. Entrer un code de partie
    await page.fill('input[name="gameCode"]', 'TEST123');
    await page.click('button[type="submit"]');
    
    // 3. Si la partie existe, on devrait être redirigé vers le lobby
    // Sinon, on devrait voir un message d'erreur
    await page.waitForTimeout(2000);
    
    const url = page.url();
    if (url.includes('lobby')) {
      // Partie trouvée - vérifier le lobby
      await expect(page.locator('[data-testid="game-code"]')).toContainText('TEST123');
    } else {
      // Partie non trouvée - vérifier le message d'erreur
      await expect(page.locator('text=Partie non trouvée')).toBeVisible();
    }
  });
  
  test('Navigation et accessibilité', async ({ page }) => {
    await page.goto('/');
    
    // 1. Vérifier la navigation au clavier
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // 2. Vérifier les liens principaux
    const links = [
      'Se connecter',
      'Créer une partie',
      'Rejoindre une partie'
    ];
    
    for (const linkText of links) {
      const link = page.locator(`text=${linkText}`);
      if (await link.isVisible()) {
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href');
      }
    }
    
    // 3. Vérifier les éléments d'accessibilité
    await expect(page.locator('h1')).toHaveAttribute('role');
    
    // 4. Vérifier le responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await expect(page.locator('h1')).toBeVisible();
    
    await page.setViewportSize({ width: 1200, height: 800 }); // Desktop
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('Gestion des erreurs', async ({ page }) => {
    // 1. Tester une route inexistante
    await page.goto('/route-qui-nexiste-pas');
    await expect(page.locator('text=404')).toBeVisible();
    
    // 2. Tester l'accès à une route protégée sans être connecté
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*auth.*/); // Redirection vers auth
    
    // 3. Tester un code de partie invalide
    await page.goto('/join-game');
    await page.fill('input[name="gameCode"]', 'INVALID');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Partie non trouvée')).toBeVisible();
  });
  
  test('Performance et chargement', async ({ page }) => {
    // Mesurer le temps de chargement de la page d'accueil
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    // Vérifier que la page se charge en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
    
    // Vérifier qu'il n'y a pas d'erreurs JavaScript
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Filtrer les erreurs connues (si nécessaire)
    const criticalErrors = logs.filter(log => 
      !log.includes('favicon.ico') && 
      !log.includes('net::ERR_')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
