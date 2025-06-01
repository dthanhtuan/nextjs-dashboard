# How Does Next.js App Router Handle Dynamic Routes?

Next.js App Router uses **file-system based routing** with a special convention for dynamic route segments using *
*square brackets `[]`** in folder or file names inside the `/app` directory.

---

## Dynamic Route Segments

- To define a dynamic route segment, wrap the folder or file name in square brackets:
- Example: `/app/products/[slug]/page.tsx`
    - This matches URLs like `/products/lamp`, `/products/table`, where `slug` is a dynamic parameter.
    - The dynamic segment name (e.g., `slug`) becomes a key in the `params` object passed to the page or layout
      component.
      ```tsx
      type ProductPageProps = {
        params: { slug: string }
      }
        
      export default function ProductPage({ params }: ProductPageProps) {
      return <div>Product slug: {params.slug}</div>;
      }
      ```
    - When a user navigates to `/products/lamp`, `params.slug` will be `'lamp'`.

---

## Catch-All and Optional Catch-All Routes

- **Catch-All Routes:** Use `[...param]` syntax to capture `multiple path segments` as an array.
- Example: `/app/docs/[...slug]/page.tsx`
    - Matches `/docs/a/b/c` with `params.slug = ['a', 'b', 'c']`.

- **Optional Catch-All Routes:** Use `[[...param]]` to make the catch-all `segment optional`.

---

## Generating Static Params for Pre-rendering

You can statically generate dynamic routes at build time by exporting `generateStaticParams`:

```tsx
export async function generateStaticParams() {
    const products = await fetchProducts();
    return products.map(product => ({slug: product.slug}));
}

```

This tells Next.js which dynamic routes to pre-render.

---

## Nested Dynamic Routes

Dynamic routes can be nested by creating folders with dynamic segments inside other folders:
- `/app/blog/[category]/[post]/page.tsx`
- This matches URLs like `/blog/tech/nextjs-routing`.

---

## Summary Table

| Feature                  | Syntax Example                      | Description                                      |
|--------------------------|-----------------------------------|-------------------------------------------------|
| Dynamic Segment          | `/app/[id]/page.tsx`               | Matches `/123`, `id` accessible via `params.id` |
| Catch-All Segment        | `/app/[...slug]/page.tsx`          | Matches `/a/b/c`, `params.slug = ['a','b','c']` |
| Optional Catch-All       | `/app/[[...slug]]/page.tsx`        | Matches `/` or `/a/b/c`                          |
| Access Params            | `function Page({ params })`         | Access dynamic values from `params` prop        |
| Static Params Generation | `generateStaticParams()`            | Defines which routes to statically generate      |

---

## Additional Notes

- Dynamic routes in App Router replace the older Pages Router `[param].js` style but with better integration into nested layouts.
- All dynamic segments are strongly typed when using TypeScript.
- Server Components in App Router allow fetching data based on params directly inside the page component.
- Route groups `(group)` can be used to organize routes without affecting URL paths.

---
