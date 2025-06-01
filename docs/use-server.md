# What is `'use server';` in Next.js?

`'use server';` is a directive in Next.js that indicates that the function it precedes is a server action.
Server actions are functions that run on the server side, allowing you to perform operations like database queries, file
system access, or other server-side logic.

### Key Points about use server

- Purpose: It ensures that the function or all functions in a file run exclusively on the server, not on the client.
  This is important for security (e.g., handling secrets or database operations) and performance (reducing client-side
  JavaScript).
- Usage:
    - At the top of a file: marks all exported functions in that file as server functions.
    - Inline at the top of a function: marks just that function as a server function.
- Example of marking a whole file:
```tsx
'use server'

import {db} from '@/lib/db'

export async function createUser(data) {
    const user = await db.user.create({data})
    return user
}
```
### Calling Server Functions from Client Components:
`calling Server Functions (Server Actions) from Client Components `: You can define asynchronous functions that run exclusively on the server but invoke them directly from client-side React components. 
This enables client components to trigger server-side logic such as database updates, API calls, or secure operations without exposing that logic or data to the client.

#### How It Works
- `Server Actions` are asynchronous functions marked with the `"use server"` directive. They run only on the server.
- These Server Actions are typically defined in separate files with `"use server"` at the top, marking all exported functions as server-only.
- Client Components (marked with `"use client"`) import these Server Actions and invoke them as if calling normal async functions.
- When a client component calls a Server Action, Next.js serializes the call (including arguments like form data) and sends it to the server.
- The server executes the Server Action, then serializes and sends back the result to the client.
- This process is transparent to the developer, who writes code as if calling a normal async function.
#### Example of Calling a Server Action from a Client Component
- Defining Server Actions in a separate file:
```tsx
// app/actions.js
'use server'

export async function createUser(data) {
    // server-side logic, e.g., database call
    return await db.user.create({data})
}
```
-  Calling Server Actions from a Client Component:
```tsx
// app/page.js
'use client'
import {createUser} from './actions'

export function UserForm() {
    return (
        <form action={createUser}>
            {/* form fields */}
            <button type="submit">Create User</button>
        </form>
    )
}
```
Here, the form's action prop is assigned the Server Action function. 
`When the form is submitted, the data is sent to the server`, createUser runs there, and the result is handled accordingly.
### When to Use use server
- When you want to run asynchronous functions that interact with databases, APIs, or perform sensitive operations.
- When you want to define server-only logic that can be safely invoked from client components.
- To separate server-side data fetching or mutations from client-side UI logic.

