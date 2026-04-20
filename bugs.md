# Project Troubleshooting & Common Build Errors (bugs.md)

This document tracks known build-time issues and environment-specific errors, particularly those encountered during server deployment (Netlify, Vercel, etc.).

## 🔴 Critical Build Blockers

### 1. Supabase TypeScript "never" Errors
- **Symptom**: `Type error: Argument of type '"posts"' is not assignable to parameter of type 'never'.`
- **Cause**: The `Database` interface in `@/types/supabase` is empty or out of sync with the actual DB schema.
- **Solution**: 
    - **Quick Fix**: Cast the supabase instance to `any` (e.g., `(supabase as any).from('table')`).
    - **Permanent Fix**: Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts`.

### 2. Next.js 16 Proxy Convention (Formerly Middleware)
- **Symptom**: `Proxy is missing expected function export name` or `The "middleware" file convention is deprecated`.
- **Cause**: Next.js 16+ requires renaming `middleware.ts` to `proxy.ts` and changing the exported function name from `middleware` to `proxy`.
- **Solution**:
    - Rename `src/middleware.ts` to `src/proxy.ts`.
    - Change `export async function middleware(...)` to `export async function proxy(...)`.

### 3. Async searchParams & params
- **Symptom**: `Property 'page' does not exist on type 'Promise<any>'` or runtime crash in Page components.
- **Cause**: In Next.js 15/16, `searchParams` and `params` are asynchronous.
- **Solution**: Always `await` them before access (e.g., `const { id } = await params;`).

## ☁️ Deployment Specific Errors (CI/CD)

### 1. Missing Environment Variables
- **Symptom**: `URL is undefined` during fetch or `Supabase client requires a valid URL`.
- **Cause**: CI/CD environments (Netlify/Vercel) do not have access to `.env.local` by default.
- **Solution**: Manually add `NEXT_PUBLIC_SUPABASE_DATABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the deployment dashboard's environment variables.

### 2. Case Sensitivity (Linux Build Workers)
- **Symptom**: `Module not found: Can't resolve './Component'` but works locally.
- **Cause**: Local OS (Mac/Windows) is case-insensitive, but Linux CI workers are case-sensitive.
- **Solution**: Ensure imports match the file name exactly (e.g., `import Navbar from '@/components/Navbar'` must match `Navbar.tsx` exactly).

### 3. Node.js Version Mismatch
- **Symptom**: Errors related to top-level `await` or modern JS features.
- **Cause**: CI environment defaults to an older Node.js version.
- **Solution**: Add an `.nvmrc` file or set the `NODE_VERSION` environment variable to `20.x` or higher.

## 🛠️ UI & Interaction Glitches

### 1. Framer Motion Hydration Mismatch
- **Symptom**: `Hydration failed because the initial UI does not match what was rendered on the server.`
- **Cause**: Animation states or random values calculated on the client during the first render.
- **Solution**: Wrap initial-state-dependent logic in a `useEffect` or ensure `initial={false}` where appropriate.

### 2. Canvas Hero Rendering
- **Symptom**: White screen or flickering during scroll on mobile browsers.
- **Cause**: Memory limits for large image sequences in canvas.
- **Solution**: Limit the number of frames or use compressed WebP sequences.
- **Tip**: Ensure all frames are loaded into the browser cache before starting the animation.
