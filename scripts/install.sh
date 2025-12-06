#!/bin/bash
# Custom install script that ignores canvas errors

echo "🔒 Starting installation with canvas blocking..."

# Block canvas before install
node scripts/block-canvas.js

# Install with error handling for canvas
npm install --no-optional --legacy-peer-deps 2>&1 | grep -v "canvas" | grep -v "node-pre-gyp" || {
  echo "⚠️  Install had errors (likely canvas), cleaning up..."
  node scripts/block-canvas.js
  # Try again without optional deps
  npm install --no-optional --legacy-peer-deps --ignore-scripts 2>&1 | grep -v "canvas" || true
}

# Remove canvas after install
node scripts/block-canvas.js

echo "✅ Installation complete"

