# Future Book Upload & Storage Architecture

## Architectural Strategy
The frontend is currently a client-side single-page application utilizing local mock data. To prepare for future administrative and educator uploads without implementing a heavy backend now, a modular service layer and modal component have been established.

## Service Abstraction (`src/services/bookUploadService.ts`)
```typescript
interface BookUploadPayload {
  title: string;
  subtitle?: string;
  description: string;
  educationLevelId: string;
  subject: string;
  author: string;
  publisher?: string;
  language: 'ar' | 'fr' | 'en';
  posterFile: File | null;
  frontCoverFile: File | null;
  backCoverFile: File | null;
  pdfFile: File | null;
  metadata?: BookMetadata;
}
```

## Future API Integration Points
When a backend service and object storage (e.g., AWS S3, Cloudflare R2, or Supabase Storage) are introduced:
1. **Multipart Upload Endpoint**: Replace `URL.createObjectURL(file)` in `bookUploadService.uploadBook()` with an asynchronous multipart upload request (`POST /api/v1/books/upload`).
2. **CDN Asset Generation**: Automatically generate thumbnail variants on the server.
3. **Database Persistence**: Register the new record in PostgreSQL/MongoDB with schema parity to `Book`.
4. **Session Transparency**: Notice banners clearly inform users that uploads in the standalone frontend reside in local memory.
