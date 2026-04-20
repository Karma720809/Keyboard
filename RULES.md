# Aura Pro Project Rules

This document outlines the mandatory rules and standards for all development work on the Premium Keyboard Shop (Aura Pro) project.

## 🐙 Git & Collaboration Rules

### 1. Identity Verification
- All commits and git operations MUST be performed using the following identity:
    - **Email**: `ykwposcoenc@gmail.com`
    - **Name**: `Karma720809`
- Before any session, verify this configuration with:
  ```bash
  git config user.email "ykwposcoenc@gmail.com"
  git config user.name "Karma720809"
  ```

### 2. Push Policy
- **NO AUTOMATIC PUSHES**: Never push code to the remote repository (GitHub) without explicit user permission.
- Always perform a `git status` and `npm run dev` check before pushing to ensure zero regressions.

## 💻 Technical Standards

### 1. Framework & Architecture
- **Next.js 16 (App Router)**: Follow the latest directory patterns. Use `proxy.ts` (not `middleware.ts`) for intercepting requests.
- **Server Actions**: All DB mutations (Create, Update, Delete) must be implemented via Server Actions in `actions.ts`.
- **Database Access**: Use the centralized `lib/store.ts` for repeatable DB queries.

### 2. Authentication & Security
- **Supabase SSR**: Always use `@supabase/ssr` to ensure session consistency across server and client.
- **Admin Isolation**: Admin routes (`/admin/*`) must be strictly guarded by the `AdminLayout` authentication and role check.
- **Privacy**: User passwords must never be stored in plain text or in custom public tables. Use Supabase Auth's protected layer only.

### 3. Styling & Aesthetics
- **Visual Tone**: Maintain a "Cinematic Apple-style" aesthetic. This means:
    - High contrast (Black/White/Gray) with subtle neon accents.
    - Extensive use of `backdrop-blur` and `glassmorphism`.
    - Harmonious spacing (rounded-3xl, p-10/p-12).
- **Typography**: Priority for SF Pro / Inter or modern serif fonts where applicable.
- **Animations**: Every interactive element should have a subtle hover effect or transition via Framer Motion.

## 🚀 Performance Guidelines

- **Image Sequence Handling**: Any large image sequences for Hero animations must be thoroughly optimized (WebP 80% quality or AVIF).
- **Client vs Server**: Prioritize Server Components for SEO and initial load speed. Convert to `'use client'` only for interactive components.
- **Resource Cleanup**: Ensure any `setInterval` or `window` event listeners in client components are properly cleared in `useEffect` returns.

## 🛠️ Maintenance

- **Typescript Safety**: If database types are not automatically synced, use `(supabase as any)` with clear comments, but aim to eventually regenerate types for full safety.
- **Error Handling**: Every server action and API call must be wrapped in `try/catch` with user-friendly error messages (e.g., using `alert` or toast notifications).
