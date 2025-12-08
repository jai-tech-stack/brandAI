# Fix: Dev Server 404 Errors

## 🔴 Problem
The dev server shows 404 errors for static files because the `.next` folder is incomplete.

## ✅ Solution

**Option 1 - Use the batch file:**
```cmd
START_DEV.bat
```

**Option 2 - Manual fix:**
1. Stop dev server: Press `Ctrl+C` in the terminal running `npm run dev`
2. Delete `.next` folder manually or run:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
3. Start dev server:
   ```powershell
   npm run dev
   ```

The dev server will automatically rebuild the `.next` folder when it starts.

## Why This Happens
- The `.next` folder got corrupted or incomplete
- Dev server started before build completed
- Files were locked during a previous build

## ✅ After Fix
Once you restart the dev server, it will:
1. Rebuild the `.next` folder automatically
2. Generate all static files
3. Serve pages without 404 errors

---

**Note:** The dev server (`npm run dev`) automatically builds files, so you don't need to run `npm run build` first. Just make sure `.next` is deleted and restart the dev server.

