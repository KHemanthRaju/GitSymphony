// Demo video recording script for GitSymphony
// Run with: node record-demo.js

const { chromium } = require('playwright');

async function recordDemo() {
  console.log('🎬 Starting demo recording...');
  
  const browser = await chromium.launch({
    headless: false, // Show browser for recording
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: './screenshots',
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the app
    console.log('📍 Navigating to app...');
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);
    
    // Show landing page
    console.log('📸 Showing landing page...');
    await page.waitForTimeout(3000);
    
    // Click Analyze button
    console.log('🔍 Clicking Analyze...');
    await page.click('button:has-text("Analyze")');
    await page.waitForTimeout(3000);
    
    // Wait for commits to load
    console.log('⏳ Waiting for commits...');
    await page.waitForTimeout(2000);
    
    // Scroll to show the solar system
    console.log('🪐 Showing solar system...');
    await page.evaluate(() => {
      document.querySelector('.solar-system-container')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    });
    await page.waitForTimeout(3000);
    
    // Click Play button
    console.log('▶️ Playing symphony...');
    await page.click('button:has-text("Play")');
    await page.waitForTimeout(5000);
    
    // Scroll through commits while playing
    console.log('📜 Scrolling through commits...');
    const commitList = await page.locator('.commit-list');
    if (await commitList.count() > 0) {
      await commitList.first().evaluate(el => {
        el.scrollBy({ top: 200, behavior: 'smooth' });
      });
    }
    await page.waitForTimeout(5000);
    
    // Toggle to light mode
    console.log('☀️ Switching to light mode...');
    await page.click('button:has-text("Dark")');
    await page.waitForTimeout(3000);
    
    // Toggle back to dark mode
    console.log('🌙 Switching back to dark mode...');
    await page.click('button:has-text("Light")');
    await page.waitForTimeout(3000);
    
    // Final view
    console.log('✨ Final view...');
    await page.waitForTimeout(2000);
    
    console.log('✅ Demo recording complete!');
    
  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    // Close and save video
    await context.close();
    await browser.close();
    console.log('💾 Video saved to screenshots/ directory');
  }
}

recordDemo().catch(console.error);
