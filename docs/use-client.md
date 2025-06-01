# What is `'use client';` in Next.js?

The `'use client';` directive is a special directive in Next.js used to mark a React component file as a **Client Component**. This tells Next.js that the component and all of its child components should be rendered and executed on the **client side (browser)** rather than on the server.

---

## Key Points

- **Server Components vs Client Components**  
  By default, components in Next.js App Router are **Server Components**, meaning they are rendered on the server and send only HTML and minimal JavaScript to the client for hydration.  
  Adding `'use client';` switches the component to a **Client Component**, enabling client-side interactivity like state management, event handling, and access to browser APIs.

- **How to Use**  
  Place `'use client';` at the very top of the component file, before any imports:

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
const [count, setCount] = useState(0);

text
return (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
);
}
```

- **Client-Server Boundary**  
  Once a file is marked with `'use client';`, **all its imports and child components are considered client components** and bundled accordingly for the browser.

- **Props Serialization**  
  Props passed to Client Components must be serializable (e.g., no functions), because data is sent from server to client.

- **Not Equivalent to Pure Client-Side Rendering**  
  Client Components still benefit from SSR/ISR/SSG. They are server-rendered initially and then hydrated on the client to become interactive.

- **Performance Considerations**  
  Using `'use client';` too high in the component tree (e.g., at the root page) can increase client bundle size and reduce performance, since all nested components become client components. It’s best to limit `'use client';` to components that actually need interactivity.

---

## Summary Table

| Aspect                   | Description                                                                                      |
|--------------------------|------------------------------------------------------------------------------------------------|
| Directive                | `'use client';`                                                                                 |
| Purpose                 | Marks a React component as a Client Component to enable client-side rendering and interactivity |
| Placement               | At the very top of the file, before imports                                                    |
| Effect                  | Component and all its descendants become client components, bundled for the browser            |
| Use Cases               | Components needing state, event handlers, browser APIs, or interactivity                        |
| Props                   | Must be serializable (no functions or non-serializable objects)                                |
| Performance Impact      | Larger client bundles if used too broadly; best to use only where necessary                     |
| Relation to SSR/SSG     | Client Components are still server-rendered and hydrated, not purely client-side rendered       |

---

## Additional Notes

- Without `'use client';`, components are Server Components by default, which do not include client-side JavaScript and are faster and smaller.
- `'use client';` helps define the boundary between server and client components in Next.js’s hybrid rendering model.
- It is a React feature adopted by Next.js to optimize rendering and interactivity.

---

**References:**
- Next.js Docs: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- Next.js Docs: [Directives: use client](https://nextjs.org/docs/app/api-reference/directives/use-client)
- Community explanations and best practices from Reddit and blog posts.
