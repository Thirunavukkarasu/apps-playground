import fs from 'fs';
import path from 'path';

export interface ContentData {
    id: string;
    title: string;
    parameters: any;
    mainLibrary: string;
    metadata: any;
    createdAt: string;
    updatedAt: string;
}

export class FileContentStorage {
    private contentDir: string;

    constructor(contentDir: string = './h5p/content') {
        this.contentDir = path.resolve(contentDir);
        this.ensureDirectoryExists();
    }

    private ensureDirectoryExists(): void {
        if (!fs.existsSync(this.contentDir)) {
            fs.mkdirSync(this.contentDir, { recursive: true });
        }
    }

    async saveContent(contentId: string, contentData: ContentData): Promise<void> {
        const filePath = path.join(this.contentDir, `${contentId}.json`);
        const data = JSON.stringify(contentData, null, 2);

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async getContent(contentId: string): Promise<ContentData | null> {
        const filePath = path.join(this.contentDir, `${contentId}.json`);

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve(null); // File doesn't exist
                    } else {
                        reject(err);
                    }
                } else {
                    try {
                        const content = JSON.parse(data);
                        resolve(content);
                    } catch (parseError) {
                        reject(parseError);
                    }
                }
            });
        });
    }

    async listContent(): Promise<ContentData[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(this.contentDir, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                const jsonFiles = files.filter(file => file.endsWith('.json'));
                const contentPromises = jsonFiles.map(file => {
                    const contentId = file.replace('.json', '');
                    return this.getContent(contentId);
                });

                Promise.all(contentPromises)
                    .then(contents => {
                        const validContents = contents.filter(content => content !== null) as ContentData[];
                        resolve(validContents);
                    })
                    .catch(reject);
            });
        });
    }

    async deleteContent(contentId: string): Promise<void> {
        const filePath = path.join(this.contentDir, `${contentId}.json`);

        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve(); // File doesn't exist, consider it deleted
                    } else {
                        reject(err);
                    }
                } else {
                    resolve();
                }
            });
        });
    }

    async contentExists(contentId: string): Promise<boolean> {
        const filePath = path.join(this.contentDir, `${contentId}.json`);
        return fs.promises.access(filePath).then(() => true).catch(() => false);
    }
}
