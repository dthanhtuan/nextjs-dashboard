# What is Middleware in Next.js?

Middleware in Next.js is a special server-side function that runs

**before a request is completed**

AND

**before your app renders a page or hits an API route**.

It acts as an intermediary to:

- Redirect or rewrite requests
- Modify request or response headers
- Perform lightweight authentication checks
- Log requests or implement rate limiting
- Set cookies or CORS headers dynamically

Middleware lives in a `middleware.js` or `middleware.ts` file at the root of your project (next to `/app` or `/pages`)
and runs on the edge, close to your users for fast execution.

---
# Matching Paths
Middleware will be invoked for every route in your project. 
Given this, it's crucial to use matchers to precisely target or exclude specific routes. 
The following is the execution order:

1. `headers` from `next.config.js`
2. `redirects` from `next.config.js`
3. Middleware (`rewrites`, `redirects`, etc.)
4. `beforeFiles` (`rewrites`) from `next.config.js`
5. Filesystem routes (`public/`, `_next/static/`, `pages/`, `app/`, etc.)
6. `afterFiles` (`rewrites`) from `next.config.js`
7. Dynamic Routes (`/blog/[slug]`)
8. fallback (`rewrites`) from `next.config.js`
There are two ways to define which paths Middleware will run on:
- Custom `matcher` config
- `Conditional statements`


---

# Example:

- This middleware redirects any request to `/about or its subpaths` to `/home`

```tsx
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/about/:path*',
}
```

# What is `matcher` in Next.js Middleware?

In Next.js, the `matcher` is a configuration option used to **specify which request paths the middleware should run on
**. By default, middleware runs on **all routes**, but often you want it to only run on certain URLs to optimize
performance and avoid unnecessary processing.

---

## How `matcher` Works

- The `matcher` is exported from your `middleware.js` or `middleware.ts` file as part of the middleware configuration.
- It accepts a **string, array of strings, or glob-like patterns** that define the URL paths where the middleware should
  be active.
- Only requests matching these patterns will trigger the middleware function.

---

## Syntax Examples

### Match a Single Path

```ts
export const config = {
    matcher: '/dashboard',
};
```

Middleware runs only on `/dashboard`.

### Match Multiple Paths

```ts
export const config = {
    matcher: ['/dashboard/:path*'],
};

```

Middleware runs on `/dashboard` and **all nested routes**, e.g., `/dashboard/profile`, `/dashboard/settings/account`.

### Match Multiple Nested Paths

```ts
export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

Middleware runs on all routes under `/dashboard` and `/api`.

---

## Pattern Syntax

- `:path*` — matches zero or more path segments (wildcard).
- `:param` — matches a single dynamic segment.
- You can combine static and dynamic segments.

---

## Why Use `matcher`?

- **Performance:** Limits middleware execution to relevant routes, reducing overhead.
- **Clarity:** Makes it explicit which routes require middleware logic.
- **Control:** Avoids unintended side effects on unrelated pages or API routes.

---

## Example: Middleware with Matcher
```tsx
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
// Example logic
    if (!request.cookies.get('auth-token')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

This middleware runs only on `/dashboard` and `/profile` routes (including nested paths), redirecting unauthenticated users to `/login`.

---

## What is `Conditional Statement` in Next.js Middleware?
In Next.js Middleware, a **conditional statement** is a way to control the execution of middleware logic 
based on specific conditions, such as request headers, cookies, or URL parameters. 
This allows you to apply different behaviors dynamically without needing to define multiple middleware files or complex routing logic.

```tsx
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }
 
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```
## Summary

| Aspect           | Description                              |
|------------------|------------------------------------------|
| What is it?      | Config option to specify middleware routes |
| Where defined?   | Exported from `middleware.ts` or `middleware.js` |
| Accepts          | String or array of path patterns         |
| Supports         | Wildcards (`:path*`), dynamic segments (`:param`) |
| Benefits         | Improves performance and control          |

---

## References
- [Next.js Middleware Routing](https://nextjs.org/docs/app/building-your-application/routing/middleware)
