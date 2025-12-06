// Pre-install script to aggressively block canvas
const fs = require('fs');
const path = require('path');

// Remove canvas if it exists
const canvasPath = path.join(__dirname, '../node_modules/canvas');
if (fs.existsSync(canvasPath)) {
  try {
    fs.rmSync(canvasPath, { recursive: true, force: true });
    console.log('Removed canvas package');
  } catch (e) {
    // Ignore errors
  }
}

// Also remove from package-lock if it exists
const lockPath = path.join(__dirname, '../package-lock.json');
if (fs.existsSync(lockPath)) {
  try {
    const lockContent = fs.readFileSync(lockPath, 'utf8');
    const lockJson = JSON.parse(lockContent);
    
    // Remove canvas from dependencies
    if (lockJson.dependencies && lockJson.dependencies.canvas) {
      delete lockJson.dependencies.canvas;
    }
    if (lockJson.packages && lockJson.packages['node_modules/canvas']) {
      delete lockJson.packages['node_modules/canvas'];
    }
    
    fs.writeFileSync(lockPath, JSON.stringify(lockJson, null, 2));
    console.log('Removed canvas from package-lock.json');
  } catch (e) {
    // Ignore errors
  }
}

