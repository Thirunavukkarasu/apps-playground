import type { IContentStorage, ContentData } from './index';

export class MemoryStorage implements IContentStorage {
    private storage: Map<string, ContentData> = new Map();

    async saveContent(contentId: string, contentData: ContentData): Promise<void> {
        this.storage.set(contentId, contentData);
    }

    async getContent(contentId: string): Promise<ContentData | null> {
        return this.storage.get(contentId) || null;
    }

    async listContent(): Promise<ContentData[]> {
        return Array.from(this.storage.values());
    }

    async deleteContent(contentId: string): Promise<void> {
        this.storage.delete(contentId);
    }

    async contentExists(contentId: string): Promise<boolean> {
        return this.storage.has(contentId);
    }
}
