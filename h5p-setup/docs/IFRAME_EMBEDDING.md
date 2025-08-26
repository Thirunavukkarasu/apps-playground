# H5P Content Iframe Embedding Guide

This guide explains how to embed H5P content from your H5P setup into any website using iframes.

## 🚀 Quick Start

### 1. Basic Iframe Embed

```html
<iframe
  src="http://localhost:5173/embed.html?contentId=mc-test-1"
  width="100%"
  height="600"
  title="H5P Content"
  allowfullscreen
>
</iframe>
```

### 2. Responsive Iframe Embed

```html
<div style="aspect-ratio: 16/9; width: 100%; max-width: 800px;">
  <iframe
    src="http://localhost:5173/embed.html?contentId=mc-test-1"
    title="H5P Content"
    allowfullscreen
    style="width: 100%; height: 100%; border: none;"
  >
  </iframe>
</div>
```

## 📋 Available Content IDs

Use these content IDs to embed different types of H5P content:

- `mc-test-1` - Multiple Choice Quiz
- `flashcards-example-1` - Flashcards
- `blanks-example-1` - Fill in the Blanks
- `drag-drop-example-1` - Drag and Drop
- `frontend-test-123` - Text Content

## 🎯 Features

### ✅ What's Included

- **Responsive Design**: Automatically adapts to different screen sizes
- **Error Handling**: Graceful error messages for invalid content IDs
- **Loading States**: Professional loading animations
- **Mock Content Support**: Shows demo content when H5P libraries aren't installed
- **Cross-Origin Support**: CORS configured for iframe embedding
- **Fullscreen Support**: `allowfullscreen` attribute enabled

### 🎨 Visual Features

- **Professional UI**: Modern design with gradients and shadows
- **Content Headers**: Shows title and content type
- **Status Indicators**: Clear indication of mock vs real content
- **Responsive Layout**: Works on desktop, tablet, and mobile

## 🔧 Advanced Usage

### Dynamic Iframe with JavaScript

```html
<div id="h5p-container"></div>

<script>
  function embedH5PContent(contentId, height = 600) {
    const container = document.getElementById("h5p-container");
    container.innerHTML = `
        <iframe 
            src="http://localhost:5173/embed.html?contentId=${contentId}"
            width="100%" 
            height="${height}" 
            title="H5P Content"
            allowfullscreen>
        </iframe>
    `;
  }

  // Usage
  embedH5PContent("mc-test-1", 500);
</script>
```

### Iframe Resize Communication

The embed page supports dynamic resizing through postMessage:

```html
<iframe
  id="h5p-iframe"
  src="http://localhost:5173/embed.html?contentId=mc-test-1"
  width="100%"
  height="600"
  title="H5P Content"
  allowfullscreen
>
</iframe>

<script>
  // Listen for resize messages from the iframe
  window.addEventListener("message", (event) => {
    if (event.data.type === "H5P_IFRAME_RESIZE") {
      const iframe = document.getElementById("h5p-iframe");
      iframe.style.height = `${event.data.height}px`;
    }
  });
</script>
```

### Lazy Loading

For better performance, consider lazy loading iframes:

```html
<div
  id="h5p-lazy-container"
  data-content-id="mc-test-1"
  data-height="600"
></div>

<script>
  function loadH5PIframe() {
    const container = document.getElementById("h5p-lazy-container");
    const contentId = container.dataset.contentId;
    const height = container.dataset.height;

    container.innerHTML = `
        <iframe 
            src="http://localhost:5173/embed.html?contentId=${contentId}"
            width="100%" 
            height="${height}" 
            title="H5P Content"
            allowfullscreen>
        </iframe>
    `;
  }

  // Load when container comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadH5PIframe();
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(document.getElementById("h5p-lazy-container"));
</script>
```

## 🌐 Production Deployment

### 1. Update Domain Configuration

Before deploying to production, update the API base URL in `embed.html`:

```javascript
// Change this line in embed.html
this.apiBaseUrl = "https://your-production-domain.com";
```

### 2. HTTPS Requirements

For production, ensure both the parent page and iframe use HTTPS:

```html
<!-- Production URL -->
<iframe
  src="https://your-domain.com/embed.html?contentId=mc-test-1"
  width="100%"
  height="600"
  title="H5P Content"
  allowfullscreen
>
</iframe>
```

### 3. Content Security Policy

Configure CSP headers to allow iframe embedding:

```http
Content-Security-Policy: frame-ancestors 'self' https://your-domain.com;
```

### 4. CORS Configuration

The backend is already configured to allow iframe embedding from any origin. For production, you may want to restrict this:

```typescript
// In h5p-backend/src/server.ts
app.use(
  "*",
  cors({
    origin: ["https://your-domain.com", "https://trusted-domain.com"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
```

## 🧪 Testing

### 1. Test the Embed Page

Visit the embed page directly to test:

```
http://localhost:5173/embed.html?contentId=mc-test-1
```

### 2. Test Iframe Examples

View the complete iframe examples:

```
http://localhost:5173/iframe-example.html
```

### 3. Test Different Content Types

Try embedding different content types:

```html
<!-- Multiple Choice -->
<iframe src="http://localhost:5173/embed.html?contentId=mc-test-1"></iframe>

<!-- Flashcards -->
<iframe
  src="http://localhost:5173/embed.html?contentId=flashcards-example-1"
></iframe>

<!-- Fill in Blanks -->
<iframe
  src="http://localhost:5173/embed.html?contentId=blanks-example-1"
></iframe>
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration allows your domain
2. **Content Not Loading**: Check that the content ID exists in your H5P backend
3. **Iframe Not Responsive**: Use the responsive iframe example with aspect ratio
4. **Mixed Content**: Ensure both parent and iframe use HTTPS in production

### Debug Mode

Add `?debug=true` to the embed URL for additional logging:

```html
<iframe
  src="http://localhost:5173/embed.html?contentId=mc-test-1&debug=true"
></iframe>
```

## 📚 API Reference

### URL Parameters

- `contentId` (required): The ID of the H5P content to embed
- `debug` (optional): Enable debug logging

### PostMessage Events

The embed page sends these events to the parent window:

```javascript
// Iframe resize request
{
    type: 'H5P_IFRAME_RESIZE',
    height: 800
}

// Content loaded
{
    type: 'H5P_CONTENT_LOADED',
    contentId: 'mc-test-1'
}

// Error occurred
{
    type: 'H5P_ERROR',
    message: 'Content not found'
}
```

## 🎨 Customization

### Styling the Iframe

```css
.h5p-iframe {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.h5p-iframe:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Custom Loading State

```html
<div id="h5p-wrapper">
  <div id="loading" class="loading-spinner">Loading...</div>
  <iframe id="h5p-iframe" style="display: none;"></iframe>
</div>

<script>
  const iframe = document.getElementById("h5p-iframe");
  const loading = document.getElementById("loading");

  iframe.onload = () => {
    loading.style.display = "none";
    iframe.style.display = "block";
  };

  iframe.src = "http://localhost:5173/embed.html?contentId=mc-test-1";
</script>
```

## 📞 Support

For issues or questions about iframe embedding:

1. Check the browser console for error messages
2. Verify the content ID exists in your H5P backend
3. Test the embed URL directly in a new tab
4. Ensure CORS is properly configured

---

**Happy Embedding! 🎉**
