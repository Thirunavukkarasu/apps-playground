// Global CSS variables and theme
export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontSize: {
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
  },
} as const;

// CSS reset and base styles
export const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: ${theme.typography.fontFamily};
    line-height: 1.5;
    color: #111827;
    background-color: #ffffff;
  }
  
  button {
    font-family: inherit;
  }
`;