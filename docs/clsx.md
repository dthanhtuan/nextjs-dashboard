# What is `clsx`?

`clsx` is a tiny utility for constructing `className` strings conditionally in JavaScript and React projects. It helps
you easily combine multiple CSS classes based on dynamic conditions, making your code cleaner and more readable.

---

## Key Features

- **Conditional Class Names:** Apply classes only when certain conditions are true.
- **Multiple Argument Types:** Accepts strings, objects, arrays, and ignores falsy
  values (`false`, `null`, `undefined`, `''`, `0`).
- **Lightweight:** Small footprint and fast.
- **Popular in React and Tailwind CSS projects** for managing dynamic class names.

---

## Installation

```bash
npm install clsx
or
yarn add clsx
```

---

---

## Summary of Usage Patterns
| Pattern               | Description                                    | Example                                  |
|-----------------------|------------------------------------------------|------------------------------------------|
| String literals       | Always included                                | `'btn primary'`                          |
| Object keys with boolean values | Include key if value is true              | `{ 'active': isActive }`                 |
| Arrays                | Include all truthy elements recursively       | `['btn', isActive && 'active']`          |
| Mixed types           | Combine strings, objects, arrays               | `clsx('btn', { active: isActive }, ['extra'])` |
| Ternary expressions | Conditionally include string literals using ternary operator | `primary ? 'bg-blue-500 hover:bg-blue-600' : ''` |

---

## References

- [Conditional Class Rendering in React using CLSX](https://antondevtips.com/blog/conditional-class-rendering-in-react-using-clsx)
- [Use CLSX to Conditionally Apply Classes in React - Shiv Dev](https://shivananda.hashnode.dev/use-clsx-to-conditionally-apply-classes-in-react)
- [Stack Overflow: Clsx - What is and how to use it](https://stackoverflow.com/questions/57557271/clsx-what-is-and-how-to-use-it)
- [NPM clsx package](https://www.npmjs.com/package/clsx)

## Basic Usage Example

```javascript
import clsx from 'clsx';

function Button({isActive}) {
    return (
        <button className={clsx('btn', {'btn-active': isActive})}>
            Click me
        </button>
    );
}
```

- Here, the class `btn-active` is added only if `isActive` is `true`.

---

## Example with Multiple Classes and Tailwind CSS

```javascript
import clsx from 'clsx';

function Button({primary, disabled}) {
    const buttonClass = clsx(
        'px-4 py-2 rounded transition-colors',
        primary ? 'bg-blue-500 hover:bg-blue-600 text-white' : '',
        !primary && !disabled ? 'bg-gray-300 hover:bg-gray-400 text-gray-600' : '',
        disabled && 'bg-gray-200 text-gray-400 pointer-events-none'
    );

    return <button className={buttonClass} disabled={disabled}>Click me</button>;
}
```

---

## How It Works

- `clsx` concatenates all truthy class names into a single string.
- Objects: keys are class names, values are conditions.
- Arrays: each element is processed recursively.
- Falsy values are ignored.

---

## Why Use `clsx`?

- Cleaner and more maintainable code compared to manual string concatenation.
- Avoids bugs with conditional class names.
- Works seamlessly with CSS frameworks like Tailwind CSS.

---
