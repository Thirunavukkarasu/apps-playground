import { MemoryStorage } from './memoryStorage';
import { FileSystemStorage } from './fileSystemStorage';
// import { DatabaseStorage } from './databaseStorage';
import { CloudStorage } from './cloudStorage';
import type { IContentStorage } from '@/types';

export class StorageFactory {
    static createStorage(): IContentStorage {
        const storageType = process.env.STORAGE_TYPE || 'memory';
        const storageConfig = {
            contentDir: process.env.CONTENT_DIR || './h5p/content',
            databaseUrl: process.env.DATABASE_URL,
            cloudProvider: process.env.CLOUD_PROVIDER || 'gcp',
            bucketName: process.env.BUCKET_NAME,
            projectId: process.env.PROJECT_ID,
            credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
        };

        switch (storageType.toLowerCase()) {
            case 'memory':
                return new MemoryStorage();

            case 'filesystem':
            case 'file':
                return new FileSystemStorage(storageConfig.contentDir);

            // case 'database':
            // case 'db':
            //     if (!storageConfig.databaseUrl) {
            //         throw new Error('DATABASE_URL environment variable is required for database storage');
            //     }
            //     return new DatabaseStorage(storageConfig.databaseUrl);

            case 'cloud':
            case 'gcp':
            case 'aws':
            case 'azure':
                if (!storageConfig.bucketName) {
                    throw new Error('BUCKET_NAME environment variable is required for cloud storage');
                }
                return new CloudStorage({
                    provider: storageConfig.cloudProvider,
                    bucketName: storageConfig.bucketName,
                    projectId: storageConfig.projectId,
                    credentials: storageConfig.credentials
                });

            default:
                throw new Error(`Unsupported storage type: ${storageType}. Supported types: memory, filesystem, database, cloud`);
        }
    }
}
