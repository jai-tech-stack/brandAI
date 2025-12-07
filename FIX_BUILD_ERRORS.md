# Fix Build Errors - Module Not Found

## 🔴 Error: Module Not Found

```
Module not found: Can't resolve '@supabase/supabase-js'
Module not found: Can't resolve 'zod'
```

## ✅ Solution

The dependencies are listed in `package.json` but not installed in `node_modules`. 

### **Quick Fix:**

Run this command in your terminal:

```bash
npm install --legacy-peer-deps
```

Or use the helper script:

```bash
npm run install-deps
```

### **If That Doesn't Work:**

1. **Clean install:**
   ```bash
   # Remove node_modules and package-lock.json
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   
   # Reinstall
   npm install --legacy-peer-deps
   ```

2. **Verify installation:**
   ```bash
   npm list @supabase/supabase-js zod
   ```

3. **Try building again:**
   ```bash
   npm run build
   ```

## 📋 Required Dependencies

Make sure these are installed:
- `@supabase/supabase-js@^2.38.4`
- `zod@^3.22.4`

They're already in `package.json`, just need to be installed.

## 🔍 Why This Happens

According to [Next.js documentation](https://nextjs.org/docs/messages/module-not-found), this error occurs when:
- The module you're trying to import is not installed in your dependencies
- `node_modules` is missing or incomplete
- Dependencies weren't installed after cloning/pulling

## ✅ After Installation

Once dependencies are installed, the build should succeed:

```bash
npm run build
```

---

**Need Help?** Check the Next.js docs: https://nextjs.org/docs/messages/module-not-found

