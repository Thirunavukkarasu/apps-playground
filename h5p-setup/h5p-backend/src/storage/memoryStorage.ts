import type { IContentStorage, ContentData } from '@/types';

export class MemoryStorage implements IContentStorage {
    private storage: Map<string, ContentData> = new Map();

    async saveContent(contentId: string, contentData: ContentData): Promise<void> {
        this.storage.set(contentId, contentData);
    }

    async getContent(contentId: string): Promise<ContentData | null> {
        return this.storage.get(contentId) || null;
    }

    async listContent(): Promise<ContentData[]> {
        const contents = Array.from(this.storage.values());
        // Sort by createdAt date, newest first
        return contents.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
        });
    }

    async deleteContent(contentId: string): Promise<void> {
        this.storage.delete(contentId);
    }

    async contentExists(contentId: string): Promise<boolean> {
        return this.storage.has(contentId);
    }
}
