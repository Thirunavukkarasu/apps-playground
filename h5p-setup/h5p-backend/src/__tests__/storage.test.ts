import { describe, it, expect, beforeEach } from "bun:test";
import { MemoryStorage } from "@/storage/memoryStorage";
import type { ContentData } from "@/types";

describe("MemoryStorage", () => {
    let storage: MemoryStorage;

    beforeEach(() => {
        storage = new MemoryStorage();
    });

    it("should save and retrieve content", async () => {
        const content: ContentData = {
            id: "test-1",
            title: "Test Content",
            parameters: { text: "Hello World" },
            mainLibrary: "H5P.Text 1.1",
            metadata: { title: "Test Content" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await storage.saveContent("test-1", content);
        const retrieved = await storage.getContent("test-1");

        expect(retrieved).toEqual(content);
    });

    it("should list all content", async () => {
        const content1: ContentData = {
            id: "test-1",
            title: "Test Content 1",
            parameters: {},
            mainLibrary: "H5P.Text 1.1",
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const content2: ContentData = {
            id: "test-2",
            title: "Test Content 2",
            parameters: {},
            mainLibrary: "H5P.Blanks 1.14",
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await storage.saveContent("test-1", content1);
        await storage.saveContent("test-2", content2);

        const list = await storage.listContent();
        expect(list).toHaveLength(2);
        expect(list.map(c => c.id)).toContain("test-1");
        expect(list.map(c => c.id)).toContain("test-2");
    });

    it("should check if content exists", async () => {
        const content: ContentData = {
            id: "test-1",
            title: "Test Content",
            parameters: {},
            mainLibrary: "H5P.Text 1.1",
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        expect(await storage.contentExists("test-1")).toBe(false);

        await storage.saveContent("test-1", content);
        expect(await storage.contentExists("test-1")).toBe(true);
    });

    it("should delete content", async () => {
        const content: ContentData = {
            id: "test-1",
            title: "Test Content",
            parameters: {},
            mainLibrary: "H5P.Text 1.1",
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await storage.saveContent("test-1", content);
        expect(await storage.contentExists("test-1")).toBe(true);

        await storage.deleteContent("test-1");
        expect(await storage.contentExists("test-1")).toBe(false);
        expect(await storage.getContent("test-1")).toBeNull();
    });
});
