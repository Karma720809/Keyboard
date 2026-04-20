---
name: keyboard-shop-expert
description: Specialized knowledge for maintaining and enhancing the Premium Keyboard Shop (Aura Pro) project.
---

# Premium Keyboard Shop (Aura Pro) Expert Skill

This skill provides comprehensive documentation and best practices for the Aura Pro project, a premium Next.js 16-based web application with high-impact cinematic visuals and robust admin management.

## 🚀 Tech Stack Overview
- **Framework**: Next.js 16.2.4 (Turbopack enabled)
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS 4.0
- **Database/Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Animations**: Framer Motion 12.0
- **Icons**: Lucide React
- **3D/Rendering**: Three.js, React Three Fiber (for future integrations/placeholder)

## 🎥 Key Visual Optimizations

### 1. Cinematic Hero Section (`HeroCanvasVideo.tsx`)
The project features a high-performance, scroll-synchronized video playback system using HTML5 Canvas.
- **Mechanism**: Pre-renders image sequences (150 frames) from the `/public/hero-sequence/` folder onto a `<canvas>`.
- **Optimization**: Uses `requestAnimationFrame` and `CanvasRenderingContext2D.drawImage()` to avoid the overhead of a standard `<video>` tag for scroll effects.
- **Scroll Sync**: Maps the window scroll position to specific frame indices, providing a buttery-smooth "Apple-style" product reveal.

### 2. Framer Motion Integration
Premium transitions and micro-animations are applied project-wide:
- **Auth UI (`AuthUI.tsx`)**: Sequential entrance animations for login forms using `initial`, `animate`, and `staggerChildren`.
- **Admin Dashboard**: Smooth layout shifts and page transitions (`animate-in fade-in slide-in-from-bottom-4`) for a professional management feel.
- **Interactive Modals**: User Detail and Post Edit modals use `framer-motion` for spring-based entrance and exit effects.

## 🔐 Authentication & Security Architecture

### 1. Hybrid Auth Flow
Uses `@supabase/ssr` to handle both server-side and client-side authentication.
- **Proxy/Middleware (`src/proxy.ts`)**: Implements the Next.js 16 `proxy` convention to refresh sessions on every request, ensuring cookies are kept in sync.
- **Server Actions**: All auth operations (login, signup, logout) are handled via Server Actions in `src/app/auth/actions.ts` to minimize client-side JS and improve security.

### 2. Password Privacy
- Passwords are encrypted by Supabase Auth (Bcrypt/Argon2) and are **never** manually stored in the `public.users` table. 
- Administrators can manage user roles but can **never** view or access user passwords.

## 🛠️ Admin Management System

### 1. 회원 관리 (User Management)
- **Route**: `/admin/users`
- **Features**: List all members, view detailed profiles via drawer-style modals, and toggle `is_admin` status.
- **Logic**: Uses Server actions in `admin/actions.ts` to ensure only Authorized admins can modify records.

### 2. 게시글 관리 (Post Management)
- **Route**: `/admin/posts`
- **Features**: Monitor community activity, edit post titles/content, and delete inappropriate content.
- **Data Migration**: Historical data was migrated from `posts.json` to Supabase using `scripts/migrate_posts.js`.

## 📂 Project Structure Highlights
- `/src/utils/supabase/`: Unified `server.ts` and `client.ts` for consistent Supabase instance creation.
- `/src/lib/store.ts`: Database abstraction layer for CRUD operations, handling type-casting for the current Supabase schema.
- `/src/components/admin/`: Atomic admin components focused on high responsiveness and glassmorphic design.

## 💡 Best Practices for Contributors
- **Always use Server Actions** for data mutations.
- **Maintain the Dark-Mode Cinematic Aesthetic**: Use HSL colors defined in `globals.css` and avoid standard utility colors.
- **Performance First**: Ensure any new image or video assets are optimized for WebP/AVIF or compressed MP4 formats.
- **Type Casting**: Until database types are fully generated and synced, use `(supabase as any)` for database operations to avoid `never` type conflicts.
