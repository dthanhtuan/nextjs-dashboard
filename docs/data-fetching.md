# Data Fetching Methods
## App Router
### Fetching Data in Server Components (Default)

- All components in the app directory are `Server Components by default`.
  - You can fetch data directly inside these components by making them async and using await for fetch or database calls.
  - This runs only on the server, so you can safely access backend resources, secrets, or databases.
    - Example:
    ```tsx
    export default async function Page() {
      const res = await fetch("https://api.example.com/posts");
      const posts = await res.json();
  
      return (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      );
    }
    ```

- By default, fetch calls are cached and the page is statically rendered at build time or on first request.
- You can opt out of caching by passing { cache: 'no-store' } to fetch for dynamic data on every request.

### Client Components and Client-Side Fetching
- If you need to fetch data on the client side (e.g., for user interactions), you can use Client Components.
- Mark a component as a Client Component by adding `'use client';` at the top.
- Use React hooks like `useEffect` or libraries like SWR or React Query for client-side data fetching.
- Example:
  ```tsx
       'use client';
 
       import { useEffect, useState } from 'react';
 
       export default function ClientComponent() {
           const [data, setData] = useState(null);
 
           useEffect(() => {
               async function fetchData() {
                   const res = await fetch('https://api.example.com/data');
                   const json = await res.json();
                   setData(json);
               }
               fetchData();
           }, []);
 
           return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
     }
  ```
###  Using API Routes in App Router
- You can create API routes inside the app/api directory.
- Client Components can fetch data from these API routes using standard fetch.
- Remember to secure your API routes as they are publicly accessible.

## Page Router
- `getStaticPaths`: Used with `getStaticProps` to generate dynamic routes at build time.
- `getStaticProps`: Fetches data at build time for static generation.
- `getServerSideProps`: Fetches data on each request for server-side rendering.
- `getInitialProps`: Fetches data on the server or client, depending on the context, for both static and server-side
  rendering.

### getStaticProps
When a Next.js page exports a getStaticProps function, that page is pre-rendered at `build time`.
This means the HTML for the page is generated once during the build process (next build) using the props returned by
getStaticProps
```tsx
export async function getStaticProps() {
    const data = await fetch('https://api.example.com/data');
    const json = await data.json();

    return {
        props: {
            data: json,
        },
    };
}
```
#### [ISR with getStaticProps and getStaticPaths](incremental-static-regeneration.md)
When using dynamic routes, you need to pair `getStaticProps` with `getStaticPaths` to specify which paths should be
`getStaticPath`s is a Next.js data-fetching function used only with dynamic routes in the Pages Router (i.e., inside the pages directory). 
It works together with `getStaticProps` to enable Static Site Generation (SSG) for dynamic routes.
- Purpose of getStaticPaths:
  - It tells Next.js which dynamic route paths to pre-render at build time. 
  - Returns an object with a paths array, each item specifying the parameters (params) for a route. 
  - Controls which pages are generated during the build instead of generating them on-demand. 
  - Supports a fallback option to specify behavior for paths not returned by getStaticPaths.
    - Basic Syntax:
      - paths: Array of route parameters matching the dynamic segments of the page filename.
      - fallback:
        - false: Only paths returned in paths are generated; others show 404. 
        - true: Paths not returned will be generated on-demand at request time, showing a fallback UI meanwhile.
        - 'blocking': Paths not returned will be generated on-demand, but the user waits for the page to be generated (no fallback UI).
        ```tsx
          export async function getStaticPaths() {
              return {
                  paths: [
                      {params: {id: '1'}},
                      {params: {id: '2'}},
                  ],
                  fallback: false, // or true / 'blocking'
              };
          }
        ```
### getServerSideProps

When a Next.js page exports a getServerSideProps function, that page is pre-rendered on each request.

```tsx
export async function getServerSideProps(context) {
    const {params, req, res} = context;
    const data = await fetch(`https://api.example.com/data/${params.id}`);
    const json = await data.json();

    return {
        props: {
            data: json,
        },
    };
}
```

### getInitialProps

When a Next.js page exports a getInitialProps function, that page is pre-rendered on the server or client, depending on
the context.

- Example: getInitialProps running on the server
    - Happens on the initial page load (when the user first requests the page URL).
    - Runs on the server, so you can access server-only objects like req and res.
    - Data fetching here happens on the server, and the result is sent as HTML to the client.
    - When you first load this page in the browser, the console.log will appear in the server console, not in the
      browser console

```tsx
import React from 'react';

Page.getInitialProps = async (ctx) => {
    // ctx.req is available here (server-side)
    const res = await fetch('https://api.github.com/repos/vercel/next.js');
    const json = await res.json();

    console.log('Server-side getInitialProps:', json.stargazers_count);

    return {stars: json.stargazers_count};
};

function Page({stars}) {
    return <div>Next.js stars: {stars}</div>;
}

export default Page;

````

- Example: getInitialProps running on the client
    - Happens during client-side navigation (e.g., clicking a <Link> to navigate to this page without a full page
      reload).
    - Runs in the browser, so ctx.req and ctx.res are undefined.
    - Data fetching happens via client-side JavaScript (AJAX/fetch).
    - The console.log will appear in the browser console.

```tsx
import Link from 'next/link';

Page.getInitialProps = async (ctx) => {
    // ctx.req is undefined here (client-side navigation)
    const res = await fetch('https://api.github.com/repos/vercel/next.js');
    const json = await res.json();

    console.log('Client-side getInitialProps:', json.stargazers_count);

    return {stars: json.stargazers_count};
};

function Page({stars}) {
    return (
        <>
            <div>Next.js stars: {stars}</div>
            <Link href="/">Go home</Link>
        </>
    );
}

export default Page;
```
