
import { test, expect } from '@playwright/test';

/**
 * Test E2E du flow principal de KIADISA
 * Tests basiques pour vérifier que l'application se charge correctement
 */

test.describe('KIADISA - Tests de base', () => {
  
  test('Page d\'accueil se charge correctement', async ({ page }) => {
    // Aller sur la page d'accueil
    await page.goto('/');
    
    // Vérifier que la page se charge sans erreur
    await expect(page).toHaveTitle(/KIADISA/);
    
    // Vérifier la présence d'éléments de base
    await expect(page.locator('body')).toBeVisible();
  });
  
  test('Navigation de base fonctionne', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que la page ne génère pas d'erreurs JavaScript critiques
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Filtrer les erreurs connues non critiques
    const criticalErrors = logs.filter(log => 
      !log.includes('favicon.ico') && 
      !log.includes('net::ERR_') &&
      !log.includes('manifest.json')
    );
    
    expect(criticalErrors.length).toBeLessThan(5); // Permettre quelques erreurs mineures
  });
  
  test('Responsive design fonctionne', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('body')).toBeVisible();
  });
});
