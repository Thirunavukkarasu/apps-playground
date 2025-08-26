# H5P Content Storage System

This storage system provides a flexible, environment-driven approach to storing H5P content across different backends.

## Supported Storage Types

### 1. Memory Storage (Default)

- **Type**: `memory`
- **Use Case**: Development, testing, temporary storage
- **Data Persistence**: No - data is lost on server restart
- **Configuration**: None required

```bash
STORAGE_TYPE=memory
```

### 2. File System Storage

- **Type**: `filesystem` or `file`
- **Use Case**: Simple deployments, single-server setups
- **Data Persistence**: Yes - stored as JSON files
- **Configuration**: Content directory path

```bash
STORAGE_TYPE=filesystem
CONTENT_DIR=./h5p/content
```

### 3. Database Storage

- **Type**: `database` or `db`
- **Use Case**: Multi-server deployments, production environments
- **Data Persistence**: Yes - stored in database
- **Supported Databases**: SQLite, PostgreSQL, MySQL

```bash
STORAGE_TYPE=database
DATABASE_URL=sqlite://./h5p/content.db
# or
DATABASE_URL=postgresql://user:password@localhost:5432/h5p_db
# or
DATABASE_URL=mysql://user:password@localhost:3306/h5p_db
```

### 4. Cloud Storage

- **Type**: `cloud`, `gcp`, `aws`, or `azure`
- **Use Case**: Scalable deployments, cloud-native applications
- **Data Persistence**: Yes - stored in cloud storage
- **Supported Providers**: Google Cloud Storage, AWS S3, Azure Blob Storage

#### Google Cloud Storage

```bash
STORAGE_TYPE=gcp
BUCKET_NAME=your-h5p-content-bucket
PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json
```

#### AWS S3

```bash
STORAGE_TYPE=aws
BUCKET_NAME=your-h5p-content-bucket
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

#### Azure Blob Storage

```bash
STORAGE_TYPE=azure
BUCKET_NAME=your-h5p-content-bucket
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
```

## Usage Examples

### Development (Memory Storage)

```bash
# No configuration needed - uses memory by default
bun run server.ts
```

### Production with File System

```bash
STORAGE_TYPE=filesystem CONTENT_DIR=/var/h5p/content bun run server.ts
```

### Production with Database

```bash
STORAGE_TYPE=database DATABASE_URL=postgresql://user:pass@localhost:5432/h5p bun run server.ts
```

### Production with Cloud Storage

```bash
STORAGE_TYPE=gcp BUCKET_NAME=my-h5p-bucket PROJECT_ID=my-project bun run server.ts
```

## API Endpoints

All storage backends provide the same API interface:

- `POST /h5p/editor/:contentId` - Save content
- `GET /h5p/player/:contentId` - Retrieve content
- `GET /h5p/content` - List all content
- `GET /h5p/health` - Health check with storage info

## Migration Between Storage Types

You can easily migrate between storage types by changing the `STORAGE_TYPE` environment variable. The system will automatically use the new storage backend for all new operations.

## Error Handling

The storage system includes comprehensive error handling:

- Invalid storage type configuration
- Missing required environment variables
- Connection failures
- File/database access errors

All errors are logged and appropriate HTTP status codes are returned.
