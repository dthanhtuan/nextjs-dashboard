## Routes
### How routes work beyond the home page
- The root route / is defined by /app/page.tsx.
- For any other route, you create a folder inside app with the route name, and inside that folder, you add a `page.tsx` file.
- The filename for a route component is always `page.tsx`

| Route URL            | Folder Structure                      | Page File Path                          |
|----------------------|-------------------------------------|---------------------------------------|
| /                    | /app/                               | /app/page.tsx                         |
| /about               | /app/about/                         | /app/about/page.tsx                   |
| /profile             | /app/profile/                       | /app/profile/page.tsx                 |
| /dashboard/settings  | /app/dashboard/settings/            | /app/dashboard/settings/page.tsx     |

### Additional Organizational Features
- Route Groups: Folders wrapped in parentheses (groupName) are used for organizing routes without affecting the URL path. They are not routable themselves.
- Example:
```text
/app/(dashboard)/settings/page.js  // URL: /settings
/app/(dashboard)/profile/page.js   // URL: /profile
```
- This allows grouping related routes together internally without changing the URL structure
### Colocation and Private Folders
#### Colocation
- In the /app directory, each folder represents a route segment corresponding to a URL path segment.
- However, `a route is only publicly accessible if the folder contains a page.js (or page.tsx)` or route.js file. Without these files, the folder is not routable.
- This means you can s`afely colocate other project files — like components, styles, or utilities — inside route folders` without them becoming accessible as routes.
- For example:
```text
/app/dashboard/settings/
├── page.js          // route: /dashboard/settings
├── SettingsForm.js  // not a route, just a component
└── styles.module.css // not a route, just styles
```
- This colocation helps keep related files together, improving organization and maintainability
#### Private Folders
- You can create `private folders by prefixing the folder name with an underscore _`, e.g., `_utils` or `_components`.
- These folders and their contents are `excluded from the routing system entirely`, regardless of what files they contain.
- Private folders are ideal for placing `shared utilities, helper functions, or components` that should never be exposed as routes.
- Example:
```text
/app/_utils/helpers.js    // not routable
/app/_forms/LoginForm.js  // not routable
```
- This helps separate UI logic from routing logic and prevents naming conflicts with future Next.js routing conventions

| Concept        | Naming / Location           | Effect on Routing                         | Use Case                                  |
|----------------|----------------------------|------------------------------------------|-------------------------------------------|
| Colocation     | Any files inside route folder (e.g., `/app/dashboard/settings/`) except `page.js` or `route.js` | Not routable, safe to colocate components, styles, helpers | Keep related files together for maintainability |
| Private Folder | Folder prefixed with `_` (e.g., `/app/_utils/`) | Entire folder excluded from routing       | Store utilities, shared components, constants |
| Route Group    | Folder wrapped in `()` (e.g., `/app/(dashboard)/`) | Not routable, excluded from URL path     | Organize routes without affecting URLs    |
