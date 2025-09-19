# @nx-monorepo/shared-ui

A shared UI component library for the Nx monorepo.

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@nx-monorepo/shared-ui';

// Basic usage
<Button onClick={() => console.log('clicked')}>
  Click me
</Button>

// With variants
<Button variant="primary" size="lg">
  Primary Button
</Button>

<Button variant="outline" size="sm">
  Outline Button
</Button>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean (default: false)
- `onClick`: () => void
- `className`: string

### Card

A flexible card component for displaying content.

```tsx
import { Card } from '@nx-monorepo/shared-ui';

// Basic usage
<Card title="Card Title">
  <p>Card content goes here</p>
</Card>

// With variants
<Card variant="elevated" title="Elevated Card">
  <p>This card has a shadow</p>
</Card>
```

**Props:**

- `variant`: 'default' | 'elevated' | 'outlined' (default: 'default')
- `title`: string (optional)
- `onClick`: () => void (optional)
- `className`: string

## Usage

1. Import components in your app:

```tsx
import { Button, Card } from '@nx-monorepo/shared-ui';
```

2. Use the components in your JSX:

```tsx
function MyComponent() {
  return (
    <Card title="Welcome">
      <Button variant="primary" onClick={() => alert('Hello!')}>
        Say Hello
      </Button>
    </Card>
  );
}
```

## Development

- Build: `nx build @nx-monorepo/shared-ui`
- Test: `nx test @nx-monorepo/shared-ui`
- Lint: `nx lint @nx-monorepo/shared-ui`

## Project Structure

```
packages/shared-ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.css
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   └── Card.css
│   │   └── index.ts
│   ├── styles/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── package.json
├── README.md
└── vite.config.ts
```
