# Next.js & Vite React Frontend Engineering Standards

This document defines the frontend development standards, architecture patterns, coding practices, scalability rules, and production-ready guidelines for React applications. It explicitly covers two primary architectures: **Next.js (App Router)** and **Vite (Single Page Applications - SPA)**.

The goal of this guide is to ensure that our codebase is:
* **Performant:** Fully optimized for loading speeds, Core Web Vitals, and SEO.
* **Maintainable:** Clean, structured, and easy for any developer to navigate and scale.
* **Consistent:** Uniform in coding styles, naming conventions, components, and theming.

**Legend:**
* **`[Universal]`** - Applies to both Next.js and Vite React apps.
* **`[Next.js Only]`** - Applies strictly to the Next.js App Router environment.
* **`[Vite SPA]`** - Applies strictly to the Vite Client-Side rendering environment.

---

## 1. Recommended Tech Stack `[Universal]`
* **Language:** TypeScript (strict mode enabled)
* **State Management:** **React Context API (default for shared global/local state)**. External state libraries like Zustand or Redux Toolkit must **not** be used unless explicitly requested.
* **Data Fetching:** TanStack Query (React Query) + Axios (client-side)
* **Styling:** Tailwind CSS + `tailwind-merge` + `clsx` for dynamic styling
* **Forms & Validation:** React Hook Form + Zod schema validation
* **Formatting & Linting:** ESLint + Prettier

### Frame-Specific Additions
* **`[Next.js Only]`:** Native `fetch` (server-side caching), `next/image`, `next/font`, Next.js App Router.
* **`[Vite SPA]`:** `react-router-dom` (routing), standard HTML tags, `react-helmet` (SEO).

---

## 2. Project Folder Structure

We enforce a `src/` directory layout. The primary difference lies in the routing setup.

### 2.1 Next.js App Router Structure `[Next.js Only]`
```text
src/
├── app/                           # Next.js App Router Directory (Routing & Layouts)
│   ├── layout.tsx                 # Root layout (HTML, body, global providers)
│   ├── page.tsx                   # Main homepage route (/)
│   ├── error.tsx                  # Global error boundary for this segment
│   └── globals.css                # Global CSS stylesheet (Tailwind & variables)
├── components/                    # Reusable Presentation Components (ui, common, forms)
├── constants/                     # Centralized immutable values (routes, messages)
├── hooks/                         # Shared Custom React Client Hooks
├── providers/                     # React Context State Providers
├── theme/                         # Styling, fonts, and design system variables
├── types/                         # TypeScript interfaces and global declarations
└── utils/                         # Pure helper functions (storage, api-client)
```

### 2.2 Vite Single Page Application Structure `[Vite SPA]`
```text
src/
├── pages/                         # Vite Route Pages
│   ├── Home.tsx                   # Main homepage component
│   └── Dashboard.tsx              # Dashboard component
├── App.tsx                        # Main App entry (react-router-dom setup)
├── main.tsx                       # React DOM Root render
├── index.css                      # Global CSS stylesheet (Tailwind & variables)
├── components/                    # Reusable Presentation Components (ui, common, forms)
├── constants/                     # Centralized immutable values (routes, messages)
├── hooks/                         # Shared Custom React Client Hooks
├── providers/                     # React Context State Providers
├── theme/                         # Styling, fonts, and design system variables
├── types/                         # TypeScript interfaces and global declarations
└── utils/                         # Pure helper functions (storage, api-client)
```

---

## 3. Server vs. Client Components

### 3.1 React Server Components (RSC) `[Next.js Only]`
Next.js runs React Server Components by default. 
* Use for all page files, layouts, and data-heavy container components.
* Fetch data directly inside these components using async/await and Next.js native `fetch`.
* **Rules:** Keep them free of state, lifecycle hooks (`useEffect`), event handlers, or browser-only APIs (`window`, `localStorage`).

### 3.2 Client Components (`"use client"`) `[Next.js Only]`
Explicitly declare `"use client"` at the very top of files that require interaction, state, or React hooks (e.g., buttons, modals, inputs). Keep these at the leaves of the component tree.

### 3.3 100% Client Rendering `[Vite SPA]`
In Vite, the entire React tree renders on the client. You **do not** need the `"use client"` directive. You can freely use state, effects, and browser APIs everywhere, though maintaining clean separation of concerns is still required.

---

## 4. Centralized Theme & Styling Management `[Universal]`

To allow design adjustments, themes, and dark modes, **never hardcode HEX values or pixel units directly in Tailwind classes.** Manage them centrally using CSS custom properties mapped to Tailwind.

### 4.1 CSS Custom Properties (`src/globals.css` or `src/index.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --success: 142.1 76.2% 36.3%;
    --error: 346.8 77.2% 49.8%;

    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }
}
```

### 4.2 Tailwind Mapping (`tailwind.config.ts` or `.js`)
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        success: "hsl(var(--success))",
        error: "hsl(var(--error))",
        border: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 5. Asset Optimization Standards

### 5.1 Next.js Native Optimizations `[Next.js Only]`
Never use the standard HTML `<img>` or `<a>` tags.
* **`next/image`:** Use for images to prevent Layout Shifts (CLS) and ensure automatic WebP formatting. Add `priority` for above-the-fold content.
* **`next/font`:** Configure Google Fonts locally via `next/font/google` in the root layout to eliminate render-blocking fetches.
* **`next/link`:** Always navigate pages with `next/link` to automatically prefetch linked page contents.

### 5.2 Standard React Optimizations `[Vite SPA]`
Next.js native packages do not exist in Vite.
* **Images:** Use standard `<img>` tags. Optimize image sizes and types (use WebP/AVIF) manually or through Vite plugins. Include explicit `width` and `height` to prevent CLS.
* **Navigation:** Use `<Link>` from `react-router-dom` to handle client-side routing safely.
* **Fonts:** Use self-hosted `@font-face` rules or optimized `<link rel="preconnect">` setups in the `index.html` file.

---

## 6. Environment Variables Configuration

* **`[Next.js Only]`:** Enforce `NEXT_PUBLIC_` prefixes on variables exposed to the browser.
* **`[Vite SPA]`:** Enforce `VITE_` prefixes on variables exposed to the browser. Access them using `import.meta.env.VITE_VAR_NAME`.
* **Security:** Exclude prefixes for backend secrets, database connection URLs, and token keys, ensuring they never leak to the client bundle.

---

## 7. Unified API & Data Fetching Layer

### 7.1 Server-Side Data Fetching `[Next.js Only]`
Use the native async/await `fetch` directly in server components (`page.tsx`). It benefits from Next.js caching, stale-while-revalidate, and on-demand ISR configurations.

### 7.2 Client-Side Fetching & Silent Refresh Flow `[Universal]`
For client-side API orchestration across both frameworks, authorization is managed with an Access Token (short-lived) and a Refresh Token (long-lived). 

We handle access token expiration transparently using an **Axios Interceptor intercept queue**. If a request returns `401 Unauthorized`, we queue all subsequent outgoing requests, refresh the token, and replay the queued requests with the updated token.

#### Axios Instance & Refresh Handler (`src/utils/api-client.ts`)
```typescript
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { storage } from "./storage";

// Determine base URL depending on the framework running
const baseURL = process.env.NEXT_PUBLIC_API_URL || import.meta.env?.VITE_API_URL;

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) promise.resolve(token);
    else promise.reject(error);
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  const token = storage.get<string>("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 & Silent Refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.get<string>("refreshToken");
      if (!refreshToken) {
        storage.remove("accessToken");
        storage.remove("refreshToken");
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${baseURL}/auth/refresh`,
          { refreshToken }
        );

        storage.set("accessToken", data.accessToken);
        storage.set("refreshToken", data.refreshToken);

        processQueue(null, data.accessToken);
        if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        storage.remove("accessToken");
        storage.remove("refreshToken");
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 8. Context Providers Architecture (Default State Management) `[Universal]`

For shared client-side state, **always use the React Context API**. External libraries like Zustand or Redux must **not** be introduced unless explicitly mentioned in the project instructions.

To avoid performance regressions, always separate context state values and dispatch actions, or **memoize context objects** using `useMemo` to prevent unnecessary re-render propagation.

```tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ... implementation logic ...

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

## 9. Component Reusability & Dynamic Configuration (Props-driven) `[Universal]`

When two pages require the same component layout but have slight differences (e.g. a Card that displays 3 texts on page A but only 2 texts on page B), **never duplicate components**. 

Design components using optional TypeScript props and clean conditional rendering inside JSX using `clsx` and conditional block rendering.

```tsx
interface InfoCardProps {
  title: string;
  subtitle: string;
  description?: string; // Optional third text prop
}

export const InfoCard = ({ title, subtitle, description }: InfoCardProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{subtitle}</p>
      
      {/* Conditionally render third text only if passed */}
      {description && <p className="text-xs opacity-60 mt-2">{description}</p>}
    </div>
  );
};
```

---

## 10. SEO & Metadata API Standard

To maintain search engine crawlers compatibility and optimize social media share cards (Open Graph).

### 10.1 Next.js Native Metadata `[Next.js Only]`
Use Next.js's native `Metadata` API in Server Components (`layout.tsx` or `page.tsx`). Never write HTML `<head>` elements manually.
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Quick Basket",
  description: "Manage your shopping items.",
};
```

### 10.2 React Helmet `[Vite SPA]`
Use `react-helmet-async` to dynamically inject SEO tags per route.
```tsx
import { Helmet } from "react-helmet-async";

export const Dashboard = () => (
  <>
    <Helmet>
      <title>Dashboard | Quick Basket</title>
      <meta name="description" content="Manage your shopping items." />
    </Helmet>
    <main>Dashboard Content</main>
  </>
);
```

---

## 11. Dynamic Client Imports (Code Splitting)

Third-party frontend libraries (e.g., charts, maps) often reference the browser's `window` object immediately. 

### 11.1 Next.js SSR Disablement `[Next.js Only]`
Any component relying strictly on browser-only API elements must be imported dynamically with Server-Side Rendering (SSR) disabled to prevent build crashes.
```tsx
import dynamic from "next/dynamic";

const ClientOnlyChart = dynamic(() => import("@/components/ui/AnalyticsChart"), {
  ssr: false,
});
```

### 11.2 Vite Code Splitting `[Vite SPA]`
Vite doesn't have SSR crashes, but dynamic imports drastically reduce initial load time by code-splitting heavy libraries.
```tsx
import { lazy, Suspense } from "react";

const HeavyChart = lazy(() => import("@/components/ui/AnalyticsChart"));

export const AnalyticsDashboard = () => (
  <Suspense fallback={<div>Loading Chart...</div>}>
    <HeavyChart />
  </Suspense>
);
```

---

## 12. Client Hydration Mismatch Safety `[Next.js Only]`

Because Next.js renders page states on the server and then hydrates them in the client, differences in environment (e.g. reading from `localStorage`, formatting relative dates, or checking screen dimensions) will lead to **hydration errors**.

* **Standard:** Implement a mounting hook state inside client components to ensure browser-only values are loaded only *after* client hydration is successfully completed.
```tsx
const [isHydrated, setIsHydrated] = useState(false);
useEffect(() => setIsHydrated(true), []);

if (!isHydrated) return null; // Safe to use localStorage after this
```

---

## 13. Forms & Validation Architecture `[Universal]`

Always parse form actions, errors, and constraints on the client using **React Hook Form + Zod**.
* Create schemas inside `src/validations/`.
* Use `zodResolver` to bind the schema seamlessly into the `useForm` hook.
* Disable submit buttons safely using `isSubmitting` status.

---

## 14. Error & Loading State Management 

### 14.1 Next.js Boundaries `[Next.js Only]`
Utilize `loading.tsx` to automatically wrap components in React Suspense layouts, and `error.tsx` for route-level fallback errors.

### 14.2 React Router Boundaries `[Vite SPA]`
Utilize `<Suspense>` manually around route declarations, and declare `errorElement` properties in your `react-router-dom` route trees to catch render faults safely.

---

## 15. Custom Date & Storage Utilities `[Universal]`

* **Storage (`storage.ts`):** Provide a fail-safe storage layer that handles JSON parsing and stringifying automatically, while gracefully ignoring `window is not defined` errors.
* **Dates (`date.ts`):** Avoid printing UTC times to users directly. Parse strings natively into localized formats or utilize lightweight wrappers (like `dayjs`) in shared utility functions.

---

## 16. Accessibility (a11y) Rules `[Universal]`
1. **Semantic Structure:** Use appropriate HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`) instead of nested default `<div>` lists.
2. **Explicit Form Labels:** Every `<input>` or select interface must be explicitly associated with a `<label>` referencing its unique `id` using `htmlFor`.
3. **Alt Text Constraints:** All custom or static images must have functional, clear descriptive alt text in the `alt=""` parameter (no "image of", "photo of" prefixes).
4. **Keyboard Accessibility:** Interactive buttons and links must use natively key-navigable components (`button`, `a` tag navigation) or have an explicit `tabIndex`.

---

## 17. Git Branching & Commits Standard `[Universal]`

### 17.1 Branch Naming Pattern
* `feature/` - new layouts, features, page additions (e.g., `feature/user-dashboard`)
* `bugfix/` - solving user flows, style faults, layout failures (e.g., `bugfix/login-styles`)
* `refactor/` - optimizing code organization (e.g., `refactor/theme-variables`)

### 17.2 Commit Formats
Ensure clear descriptions matching general standards:
* `feat: added account overview dashboard layout`
* `fix: adjusted mobile spacing on navigation wrapper`
* `docs: updated production standard instructions`

---

## 18. Strict React Engineering Rules (Zero Compromise)

### 18.1 Core Principles
* **Follow DRY (Don't Repeat Yourself).**
* **Prefer reusable components over duplicated UI.**
* **Prefer configuration and constants over hardcoded values.**
* **Keep code scalable and maintainable.**
* **Avoid quick fixes and temporary workarounds.**
* **Write production-ready code, not demo code.**

### 18.2 Component Reusability
* Never create duplicate UI components.
* If a similar component already exists, reuse it.
* Extract common UI into reusable components.
* Shared UI elements must be centralized (e.g., `Button`, `SearchInput`, `Modal`, `DataTable`, `EmptyState`, `Pagination`).
* If Dashboard and Users pages use the same card design, they **must** use the same component.

### 18.3 Styling Standards
* **No Hardcoded Colors**: Avoid `text-blue-500`, `bg-green-600`, `#2563eb`. Use centralized tokens: `var(--primary)`, `bg-success/10`.
* **No Hardcoded Typography**: Absolutely **do not write text sizes using arbitrary px, rem, or em values** anywhere in the code (e.g., `text-[11px]`, `text-[18px]`). Use centralized typography tokens where possible (`text-h1`, `text-body`).
* **Bake-in Heading Weights**: Headings should define their font sizes, line heights, and font weights centrally in `index.css`. Normal text classes should not apply font weight globally. Do not scatter `font-bold` arbitrarily on headings if it's already part of the design system.
* **Theme Management**: Do not write dark/light mode styles repeatedly (e.g., avoiding `text-gray-800 dark:text-white` everywhere). Theme values must switch automatically via CSS variables (`--foreground`, `--background`).

### 18.4 Constants & Utilities Management
* **No Hardcoded Strings**: Use localization or constants files.
* **Never Duplicate Formatting Logic**: Create centralized utilities for dates (`formatDate`), numbers, currencies, and strings.

### 18.5 API Data Normalization
* **Normalize Early**: Do not create multiple fallbacks deep in the codebase (e.g., `user?.profileId || user?.id`). Normalize API data once at the service layer so components use consistent shapes (e.g., `user.id`).

### 18.6 Code Quality Rules
Every code change must satisfy `npm run build` with zero errors. Generated code should **never** introduce:
* Build errors, Type errors, or Lint errors
* Unused variables or unused imports
* Commented or dead code
* `console.log` statements

### 18.7 Pre-Execution Checklist
Always prioritize maintainability, consistency, scalability, and reusability over quick implementation. Before generating any code, always check:
1. Can an existing component be reused?
2. Can logic be extracted into a utility?
3. Can values be moved to constants?
4. Can styling be moved to design tokens?
5. Can the solution be simplified?
6. Will this scale if the application grows 10x?
