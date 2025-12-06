// Pre-install script to aggressively block canvas
const fs = require('fs');
const path = require('path');

console.log('🔒 Blocking canvas installation...');

// Remove canvas if it exists
const canvasPath = path.join(__dirname, '../node_modules/canvas');
if (fs.existsSync(canvasPath)) {
  try {
    fs.rmSync(canvasPath, { recursive: true, force: true });
    console.log('✓ Removed canvas package');
  } catch (e) {
    // Ignore errors
  }
}

// Clean package-lock.json if it exists
const lockPath = path.join(__dirname, '../package-lock.json');
if (fs.existsSync(lockPath)) {
  try {
    const lockContent = fs.readFileSync(lockPath, 'utf8');
    const lockJson = JSON.parse(lockContent);
    
    // Remove canvas from all possible locations
    if (lockJson.dependencies) {
      delete lockJson.dependencies.canvas;
      Object.keys(lockJson.dependencies).forEach(key => {
        if (lockJson.dependencies[key]?.dependencies?.canvas) {
          delete lockJson.dependencies[key].dependencies.canvas;
        }
      });
    }
    if (lockJson.packages) {
      Object.keys(lockJson.packages).forEach(pkg => {
        if (pkg.includes('canvas')) {
          delete lockJson.packages[pkg];
        }
        if (lockJson.packages[pkg]?.dependencies?.canvas) {
          delete lockJson.packages[pkg].dependencies.canvas;
        }
      });
    }
    
    fs.writeFileSync(lockPath, JSON.stringify(lockJson, null, 2));
    console.log('✓ Cleaned canvas from package-lock.json');
  } catch (e) {
    // Ignore errors
  }
}

console.log('✅ Canvas blocking complete');
