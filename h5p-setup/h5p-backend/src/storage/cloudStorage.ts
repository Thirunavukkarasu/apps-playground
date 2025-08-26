import type { IContentStorage, ContentData } from '@/types';

interface CloudStorageConfig {
    provider: string;
    bucketName: string;
    projectId?: string;
    credentials?: string;
}

export class CloudStorage implements IContentStorage {
    private config: CloudStorageConfig;
    private storage: any; // Will be initialized based on cloud provider

    constructor(config: CloudStorageConfig) {
        this.config = config;
        this.initializeStorage();
    }

    private async initializeStorage(): Promise<void> {
        try {
            switch (this.config.provider.toLowerCase()) {
                case 'gcp':
                case 'google':
                    const { Storage } = await import('@google-cloud/storage');
                    this.storage = new Storage({
                        projectId: this.config.projectId,
                        keyFilename: this.config.credentials
                    });
                    break;

                // case 'aws':
                // case 's3':
                //     const AWS = await import('aws-sdk');
                //     this.storage = new AWS.S3({
                //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                //         region: process.env.AWS_REGION || 'us-east-1'
                //     });
                //     break;

                // case 'azure':
                //     const { BlobServiceClient } = await import('@azure/storage-blob');
                //     const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
                //     if (!connectionString) {
                //         throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required for Azure storage');
                //     }
                //     this.storage = BlobServiceClient.fromConnectionString(connectionString);
                //     break;

                default:
                    throw new Error(`Unsupported cloud provider: ${this.config.provider}`);
            }
        } catch (error) {
            console.error('Failed to initialize cloud storage:', error);
            throw error;
        }
    }

    async saveContent(contentId: string, contentData: ContentData): Promise<void> {
        const data = JSON.stringify(contentData, null, 2);
        const fileName = `${contentId}.json`;

        try {
            switch (this.config.provider.toLowerCase()) {
                case 'gcp':
                case 'google':
                    const bucket = this.storage.bucket(this.config.bucketName);
                    const file = bucket.file(fileName);
                    await file.save(data, {
                        metadata: {
                            contentType: 'application/json'
                        }
                    });
                    break;

                case 'aws':
                case 's3':
                    await this.storage.putObject({
                        Bucket: this.config.bucketName,
                        Key: fileName,
                        Body: data,
                        ContentType: 'application/json'
                    }).promise();
                    break;

                case 'azure':
                    const containerClient = this.storage.getContainerClient(this.config.bucketName);
                    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
                    await blockBlobClient.upload(data, data.length, {
                        blobHTTPHeaders: {
                            blobContentType: 'application/json'
                        }
                    });
                    break;
            }
        } catch (error) {
            console.error('Failed to save content to cloud storage:', error);
            throw error;
        }
    }

    async getContent(contentId: string): Promise<ContentData | null> {
        const fileName = `${contentId}.json`;

        try {
            let data: string;

            switch (this.config.provider.toLowerCase()) {
                case 'gcp':
                case 'google':
                    const bucket = this.storage.bucket(this.config.bucketName);
                    const file = bucket.file(fileName);
                    const [fileContent] = await file.download();
                    data = fileContent.toString('utf8');
                    break;

                case 'aws':
                case 's3':
                    const result = await this.storage.getObject({
                        Bucket: this.config.bucketName,
                        Key: fileName
                    }).promise();
                    data = result.Body.toString('utf8');
                    break;

                case 'azure':
                    const containerClient = this.storage.getContainerClient(this.config.bucketName);
                    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
                    const downloadResponse = await blockBlobClient.download();
                    data = await this.streamToString(downloadResponse.readableStreamBody);
                    break;

                default:
                    throw new Error(`Unsupported cloud provider: ${this.config.provider}`);
            }

            return JSON.parse(data);
        } catch (error: any) {
            if (error.code === 'ENOENT' || error.code === 'NoSuchKey' || error.statusCode === 404) {
                return null; // File doesn't exist
            }
            console.error('Failed to get content from cloud storage:', error);
            throw error;
        }
    }

    async listContent(): Promise<ContentData[]> {
        try {
            let files: string[] = [];

            switch (this.config.provider.toLowerCase()) {
                case 'gcp':
                case 'google':
                    const bucket = this.storage.bucket(this.config.bucketName);
                    const [fileList] = await bucket.getFiles();
                    files = fileList.map((file: any) => file.name);
                    break;

                case 'aws':
                case 's3':
                    const result = await this.storage.listObjectsV2({
                        Bucket: this.config.bucketName
                    }).promise();
                    files = result.Contents?.map((obj: any) => obj.Key) || [];
                    break;

                case 'azure':
                    const containerClient = this.storage.getContainerClient(this.config.bucketName);
                    const blobs = containerClient.listBlobsFlat();
                    for await (const blob of blobs) {
                        files.push(blob.name);
                    }
                    break;
            }

            const jsonFiles = files.filter(file => file.endsWith('.json'));
            const contentPromises = jsonFiles.map(file => {
                const contentId = file.replace('.json', '');
                return this.getContent(contentId);
            });

            const contents = await Promise.all(contentPromises);
            const validContents = contents.filter((content: ContentData | null) => content !== null) as ContentData[];
            // Sort by createdAt date, newest first
            return validContents.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
            });
        } catch (error) {
            console.error('Failed to list content from cloud storage:', error);
            throw error;
        }
    }

    async deleteContent(contentId: string): Promise<void> {
        const fileName = `${contentId}.json`;

        try {
            switch (this.config.provider.toLowerCase()) {
                case 'gcp':
                case 'google':
                    const bucket = this.storage.bucket(this.config.bucketName);
                    const file = bucket.file(fileName);
                    await file.delete();
                    break;

                case 'aws':
                case 's3':
                    await this.storage.deleteObject({
                        Bucket: this.config.bucketName,
                        Key: fileName
                    }).promise();
                    break;

                case 'azure':
                    const containerClient = this.storage.getContainerClient(this.config.bucketName);
                    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
                    await blockBlobClient.delete();
                    break;
            }
        } catch (error) {
            console.error('Failed to delete content from cloud storage:', error);
            throw error;
        }
    }

    async contentExists(contentId: string): Promise<boolean> {
        const content = await this.getContent(contentId);
        return content !== null;
    }

    private async streamToString(readableStream: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: any[] = [];
            readableStream.on('data', (data: any) => {
                chunks.push(data.toString());
            });
            readableStream.on('end', () => {
                resolve(chunks.join(''));
            });
            readableStream.on('error', reject);
        });
    }
}
