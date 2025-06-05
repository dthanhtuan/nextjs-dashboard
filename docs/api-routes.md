# How to Define API Routes in Next.js App Router

In Next.js App Router (inside the `/app` directory), API routes are created using **Route Handlers**. Unlike the Pages
Router (`pages/api`), where you export a single default function, Route Handlers use the **Web standard Request and
Response APIs** and support multiple HTTP methods in one file.

---

## Basic Setup

1. **Create a folder representing your API route inside `/app/api`**  
   For example, to create an API endpoint at `/api/users`, create: `/app/api/users/route.ts`
2. **Define HTTP method handlers by exporting functions named after HTTP methods** (`GET`, `POST`, `PUT`, `DELETE`,
   etc.):

```tsx
//app/api/users/route.ts

export async function GET(request: Request) {
    const users = [
        {id: 1, name: 'Alice'},
        {id: 2, name: 'Bob'}
    ];
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const newUser = {id: Date.now(), name: body.name};
    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: {'Content-Type': 'application/json'},
    });
}
```

- Each exported function corresponds to an HTTP method.
- The function receives a standard `Request` object.
- You return a standard `Response` object.

---

## Features

- **Supports all standard HTTP methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.
- **Dynamic API routes:** Use folder names with square brackets to define dynamic segments,
  e.g., `/app/api/posts/[id]/route.ts`.
- **Query parameters:** Access via `request.nextUrl.searchParams`.
- **Headers and cookies:** Use `request.headers` or Next.js helpers like `cookies()` and `headers()`
  from `'next/headers'`.
- **TypeScript support:** You can type your handlers and use `NextRequest` and `NextResponse` for extended
  functionality.

---

## Examples: 
- Query Parameters
```tsx
import {NextRequest} from 'next/server';

export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query'); // e.g. /api/search?query=hello
    return new Response(
        JSON.stringify({result: You searched for: ${query}}),
        {headers: {'Content-Type': 'application/json'}}
    );
}
```
- App Router with dynamic segments
```tsx
// File path: app/api/posts/[id]/route.ts
import {NextRequest} from 'next/server';

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    const {id} = params;

    // Fetch post data based on the dynamic id
    const post = await getPostById(id); // Assume this is your data fetching function

    if (!post) {
        return new Response(JSON.stringify({error: 'Post not found'}), {status: 404});
    }

    return new Response(JSON.stringify(post), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
    });
}

```
---

## Summary

| Aspect          | Description                                        |
|-----------------|----------------------------------------------------|
| Location        | `app/api/<route>/route.ts`                         |
| HTTP Methods    | Export named async functions: `GET`, `POST`, etc.  |
| Request Object  | Standard Web `Request` or extended `NextRequest`   |
| Response Object | Standard Web `Response` or extended `NextResponse` |
| Dynamic Routes  | Use `[param]` folders inside `app/api`             |
| Data Parsing    | Use `await request.json()` for JSON bodies         |

---

## References

- [Next.js Docs: Route Handlers (App Router)](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Blog: Building APIs with Next.js](https://nextjs.org/blog/building-apis-with-nextjs)
- [Stack Overflow: API Routes in Next.js App Folder](https://stackoverflow.com/questions/75418329/how-do-you-put-api-routes-in-the-new-app-folder-of-next-js)
- [YouTube: API Routes with Next.js 14](https://www.youtube.com/watch?v=gEB3ckYeZF4)
