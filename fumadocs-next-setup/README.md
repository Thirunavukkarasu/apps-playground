# Fumadocs Next.js Setup

A modern documentation site built with **Next.js 15**, **Tailwind CSS 4**, **shadcn/ui**, and **Fumadocs**.

## 🚀 Features

- ⚡ **Next.js 15** with App Router and Turbopack
- 🎨 **Tailwind CSS 4** for modern styling
- 🧩 **shadcn/ui** components for consistent UI
- 📚 **Fumadocs** for documentation management
- 📝 **MDX** support for rich documentation
- 🌙 **Dark Mode** support
- 📱 **Responsive Design** for all devices
- 🔍 **TypeScript** for type safety

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.1
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Documentation**: Fumadocs
- **Language**: TypeScript
- **Build Tool**: Turbopack

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd fumadocs-next-setup
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
fumadocs-next-setup/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── docs/
│   │   │   ├── page.tsx        # Documentation landing page
│   │   │   ├── components/
│   │   │   │   └── page.tsx    # Components documentation
│   │   │   └── styling/
│   │   │       └── page.tsx    # Styling documentation
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       └── utils.ts            # Utility functions
├── package.json
├── tailwind.config.js
├── next.config.ts
└── components.json           # shadcn/ui config
```

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🧩 Adding Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
```

## 📚 Documentation

The documentation is located in the `/docs` route and includes:

- **Welcome Page** (`/docs`) - Overview and getting started
- **Components** (`/docs/components`) - shadcn/ui component examples with live demos
- **Styling** (`/docs/styling`) - Tailwind CSS 4 features and examples

## 🎨 Customization

### Tailwind CSS Configuration

Modify `tailwind.config.js` to customize:

- Colors and themes
- Typography
- Spacing and layout
- Custom utilities

### shadcn/ui Theming

Update `src/app/globals.css` to customize:

- CSS variables for colors
- Component styling
- Dark mode preferences

### Documentation Structure

The documentation is built using Next.js App Router with:

- **React Components**: Interactive documentation pages
- **Tailwind CSS**: Consistent styling across all pages
- **shadcn/ui**: Reusable UI components
- **TypeScript**: Type safety throughout

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm run start
   ```

3. Deploy the `.next` directory

## 🔧 Configuration Files

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
```

### Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./docs/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom theme configuration
    },
  },
  plugins: [],
};
```

### shadcn/ui Configuration (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🚀 Performance Features

- **Turbopack**: Faster development builds
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js Image component
- **Server Components**: Better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Fumadocs Documentation](https://fumadocs.vercel.app)

---

Built with ❤️ using modern web technologies
