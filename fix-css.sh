#!/bin/bash

echo "🔧 Fixing CSS issues..."
echo ""

echo "1. Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "2. Rebuilding..."
npm run build
echo "✅ Build complete"
echo ""

echo "3. Ready to start dev server!"
echo ""
echo "Run: npm run dev"
echo ""
echo "Then hard refresh your browser:"
echo "  - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "  - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo ""
echo "✨ CSS should be back!"
