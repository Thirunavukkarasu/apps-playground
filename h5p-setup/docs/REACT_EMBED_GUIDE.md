# H5P React Embed Component Guide

This guide explains how to use the React-based H5P embed component, which is a much better approach than the HTML/JavaScript solution.

## 🎯 **Why React-Based Embedding is Better**

### ✅ **Advantages of React Approach**

1. **Code Reuse**: Leverages existing React components and logic
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Consistency**: Same styling and behavior as the main app
4. **Maintainability**: Single source of truth for component logic
5. **Performance**: React's efficient rendering and state management
6. **Testing**: Easy to test with React testing libraries
7. **Development Experience**: Better debugging and hot reloading

### 🔄 **Component Architecture**

```
H5PEmbed Component
├── MultipleChoiceViewer (existing)
├── FlashcardViewer (existing)
├── DragAndDropViewer (existing)
├── FillInBlanksViewer (existing)
└── TextViewer (existing)
```

## 🚀 **Quick Start**

### **1. Basic Usage**

```tsx
import { H5PEmbed } from './components/H5PEmbed';

function MyPage() {
  return (
    <div>
      <h1>My H5P Content</h1>
      <H5PEmbed contentId="mc-test-1" />
    </div>
  );
}
```

### **2. Customized Embed**

```tsx
<H5PEmbed 
  contentId="mc-test-1"
  showHeader={false}
  showFooter={false}
  className="my-custom-styles"
/>
```

### **3. Multiple Embeds**

```tsx
<div className="grid grid-cols-2 gap-4">
  <H5PEmbed contentId="mc-test-1" />
  <H5PEmbed contentId="flashcards-example-1" />
</div>
```

## 📋 **Component Props**

### **Required Props**

- `contentId` (string): The ID of the H5P content to embed

### **Optional Props**

- `showHeader` (boolean): Show/hide the content header (default: `true`)
- `showFooter` (boolean): Show/hide the footer (default: `true`)
- `className` (string): Additional CSS classes for styling

## 🎨 **Styling Options**

### **1. Custom CSS Classes**

```tsx
<H5PEmbed 
  contentId="mc-test-1"
  className="border-4 border-blue-200 rounded-xl shadow-lg"
/>
```

### **2. Responsive Design**

```tsx
<div className="max-w-4xl mx-auto">
  <H5PEmbed contentId="mc-test-1" />
</div>
```

### **3. Grid Layout**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <H5PEmbed contentId="mc-test-1" />
  <H5PEmbed contentId="flashcards-example-1" />
  <H5PEmbed contentId="blanks-example-1" />
</div>
```

## 🌐 **URL-Based Embedding**

### **Direct Embed URLs**

You can also embed content using direct URLs:

```
http://localhost:5173/embed/mc-test-1
http://localhost:5173/embed/flashcards-example-1
http://localhost:5173/embed/blanks-example-1
```

### **Iframe Usage**

```html
<iframe 
  src="http://localhost:5173/embed/mc-test-1"
  width="100%" 
  height="600" 
  title="H5P Content"
  allowfullscreen>
</iframe>
```

## 🔧 **Advanced Usage**

### **1. Dynamic Content Loading**

```tsx
import { useState } from 'react';

function DynamicEmbed() {
  const [contentId, setContentId] = useState('mc-test-1');
  
  return (
    <div>
      <select 
        value={contentId} 
        onChange={(e) => setContentId(e.target.value)}
      >
        <option value="mc-test-1">Multiple Choice</option>
        <option value="flashcards-example-1">Flashcards</option>
        <option value="blanks-example-1">Fill in Blanks</option>
      </select>
      
      <H5PEmbed contentId={contentId} />
    </div>
  );
}
```

### **2. Error Handling**

```tsx
function EmbedWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <H5PEmbed 
        contentId="mc-test-1"
        onError={(err) => setError(err.message)}
      />
    </div>
  );
}
```

### **3. Loading States**

```tsx
function EmbedWithLoading() {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading content...</span>
        </div>
      )}
      
      <H5PEmbed 
        contentId="mc-test-1"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
```

## 📱 **Responsive Design**

### **Mobile-First Approach**

```tsx
<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  <H5PEmbed 
    contentId="mc-test-1"
    className="w-full"
  />
</div>
```

### **Aspect Ratio Container**

```tsx
<div className="relative w-full" style={{ aspectRatio: '16/9' }}>
  <H5PEmbed 
    contentId="mc-test-1"
    className="absolute inset-0"
  />
</div>
```

## 🧪 **Testing**

### **1. Unit Testing**

```tsx
import { render, screen } from '@testing-library/react';
import { H5PEmbed } from './components/H5PEmbed';

test('renders H5P content', () => {
  render(<H5PEmbed contentId="mc-test-1" />);
  expect(screen.getByText('Loading H5P content...')).toBeInTheDocument();
});
```

### **2. Integration Testing**

```tsx
test('loads and displays content', async () => {
  render(<H5PEmbed contentId="mc-test-1" />);
  
  // Wait for content to load
  await screen.findByText('Multiple Choice Test');
  
  // Check for interactive elements
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});
```

## 🚀 **Production Deployment**

### **1. Environment Configuration**

```tsx
// Create a config file
const config = {
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  embedBaseUrl: process.env.REACT_APP_EMBED_URL || 'http://localhost:5173'
};

// Use in component
<H5PEmbed 
  contentId="mc-test-1"
  apiBaseUrl={config.apiBaseUrl}
/>
```

### **2. Build Optimization**

```bash
# Build for production
npm run build

# The embed component will be included in the bundle
# and can be used in any React application
```

### **3. CDN Deployment**

```html
<!-- Load React and your H5P embed component -->
<script src="https://your-cdn.com/h5p-embed.js"></script>

<!-- Use in any HTML page -->
<div id="h5p-container"></div>
<script>
  ReactDOM.render(
    React.createElement(H5PEmbed, { contentId: 'mc-test-1' }),
    document.getElementById('h5p-container')
  );
</script>
```

## 📊 **Performance Considerations**

### **1. Lazy Loading**

```tsx
import { lazy, Suspense } from 'react';

const H5PEmbed = lazy(() => import('./components/H5PEmbed'));

function LazyEmbed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <H5PEmbed contentId="mc-test-1" />
    </Suspense>
  );
}
```

### **2. Memoization**

```tsx
import { memo } from 'react';

const MemoizedH5PEmbed = memo(H5PEmbed);

function OptimizedEmbed() {
  return <MemoizedH5PEmbed contentId="mc-test-1" />;
}
```

### **3. Bundle Splitting**

```tsx
// The H5PEmbed component can be code-split
const H5PEmbed = React.lazy(() => 
  import('./components/H5PEmbed').then(module => ({
    default: module.H5PEmbed
  }))
);
```

## 🔍 **Debugging**

### **1. Development Tools**

```tsx
// Add debugging to the component
<H5PEmbed 
  contentId="mc-test-1"
  debug={true} // Enable debug logging
/>
```

### **2. Error Boundaries**

```tsx
class H5PErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('H5P Embed Error:', error, errorInfo);
  }
  
  render() {
    return this.props.children;
  }
}

// Usage
<H5PErrorBoundary>
  <H5PEmbed contentId="mc-test-1" />
</H5PErrorBoundary>
```

## 📚 **Examples**

### **View Examples**

Visit the examples page to see all the different usage patterns:

```
http://localhost:5173/embed-examples
```

### **Available Content IDs**

- `mc-test-1` - Multiple Choice Quiz
- `flashcards-example-1` - Flashcards
- `blanks-example-1` - Fill in the Blanks
- `drag-drop-example-1` - Drag and Drop
- `frontend-test-123` - Text Content

## 🎉 **Benefits Summary**

1. **Reuses existing components** - No duplicate code
2. **Type-safe** - Full TypeScript support
3. **Consistent styling** - Same design system
4. **Easy to maintain** - Single source of truth
5. **Better performance** - React optimization
6. **Flexible** - Multiple embedding options
7. **Production ready** - Built for scale

This React-based approach is much more maintainable and provides a better developer experience than the HTML/JavaScript solution! 🚀
