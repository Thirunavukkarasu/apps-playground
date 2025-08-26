// Shared types for the H5P Content Management API

export interface H5PContent {
    id: string;
    title: string;
    mainLibrary?: string;
    createdAt?: string;
    updatedAt?: string;
    parameters?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface ContentData {
    id: string;
    title: string;
    parameters: Record<string, unknown>;
    mainLibrary: string;
    metadata: any; // Allow any metadata type for H5P compatibility
    createdAt: string;
    updatedAt: string;
}

export interface IContentStorage {
    saveContent(contentId: string, content: ContentData): Promise<void>;
    getContent(contentId: string): Promise<ContentData | null>;
    listContent(): Promise<ContentData[]>;
    deleteContent(contentId: string): Promise<void>;
    contentExists(contentId: string): Promise<boolean>;
}

export interface StorageConfig {
    type: 'memory' | 'filesystem' | 'database' | 'cloud';
    options?: Record<string, unknown>;
}

export interface HealthStatus {
    status: 'ok' | 'error';
    timestamp: string;
    libraries?: Array<{
        machineName: string;
        majorVersion: number;
        minorVersion: number;
    }>;
    contentCount?: number;
    storageType?: string;
    error?: string;
}

export interface ApiResponse<T = unknown> {
    ok: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface H5PEditorResponse {
    mock?: boolean;
    message?: string;
    contentId: string;
    editor?: {
        title: string;
        library: string;
        params: Record<string, unknown>;
    };
}

export interface H5PPlayerResponse {
    mock?: boolean;
    message?: string;
    contentId: string;
    data?: ContentData;
    player?: {
        title: string;
        library: string;
        params: Record<string, unknown>;
    };
}
