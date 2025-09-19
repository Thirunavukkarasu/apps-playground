// Common UI types
export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type Color = 'blue' | 'green' | 'red' | 'yellow' | 'gray';

// Base component props
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// Theme types
export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
}