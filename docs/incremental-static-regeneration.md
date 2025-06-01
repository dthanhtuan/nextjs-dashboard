# Incremental Static Regeneration (ISR)
Incremental Static Regeneration (ISR) enables you to:
- Update static content without rebuilding the entire site
- Reduce server load by serving prerendered, static pages for most requests
- Ensure proper cache-control headers are automatically added to pages
- Handle large amounts of content pages without long next build times
## App Router
- Pages and layouts are `React Server Components` by default.
- Data fetching happens inside async Server Components using `fetch`.
- ISR is controlled via the `fetch` API’s `next` option, e.g., `{ next: { revalidate: 60 } }`.
- This controls how often the page or component is re-rendered and cached.
- On-demand revalidation is done via `revalidatePath()` or `revalidateTag()` inside `Route Handlers` or `Server Actions`.
### Example: ISR with `fetch` in Server Component
The page is cached and revalidated every 60 seconds automatically.
```tsx
// app/products/page.tsx

export default async function ProductsPage() {
    const res = await fetch('https://api.example.com/products', {next: {revalidate: 60}});
    const products = await res.json();

    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    );
}
````
### Example: On-Demand Revalidation in App Router (Route Handler)
```tsx
// app/api/revalidate/route.ts
import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const path = searchParams.get('path');
    const secret = searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({message: 'Invalid token'}, {status: 401});
    }

    if (!path) {
        return NextResponse.json({message: 'Missing path param'}, {status: 400});
    }

    revalidatePath(path);

    return NextResponse.json({revalidated: true});
}
```


## Page Routes
- ISR is implemented via `getStaticProps` returning a `revalidate` property.
- The page is statically generated at build time.
- After the specified `revalidate` interval (in seconds), Next.js regenerates the page `on-demand` when a request comes in.
- You can also `trigger on-demand revalidation` via API routes calling res.revalidate().
### Example: ISR with getStaticProps and getStaticPaths
**How getStaticPaths and getStaticProps work together**:
- `getStaticPaths` returns an object with a `paths` array, where each item contains `route parameters` (params) for a dynamic route.
- Next.js uses these params to call `getStaticProps` once per path, passing params inside the context argument.
- `getStaticProps` uses `context.params` to fetch data specific to that route and returns props for the page.
- This happens at build time, generating static HTML for each path.
```tsx
// pages/posts/[id].tsx

export async function getStaticPaths() {
    // Fetch list of posts
    const res = await fetch('https://api.example.com/posts');
    const posts = await res.json();

    // Return array of params for paths to pre-render
    const paths = posts.map(post => ({
        params: {id: post.id.toString()},
    }));

    return {
        paths,
        fallback: false, // or 'blocking' / true
    };
}

export async function getStaticProps({params}) {
    // params.id corresponds to each path's id
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    const post = await res.json();

    return {
        props: {post}, // Passed to the page component
    };
}

export default function PostPage({post}) {
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    );
}
```
### Example: On-Demand Revalidation API Route
```tsx
// pages/api/revalidate.js
export default async function handler(req, res) {
    if (req.query.secret !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({message: 'Invalid token'});
    }

    const path = req.query.path;
    if (!path) {
        return res.status(400).json({message: 'Missing path parameter'});
    }

    try {
        await res.revalidate(path);
        return res.json({revalidated: true});
    } catch (err) {
        return res.status(500).json({message: 'Error revalidating'});
    }
}

```
