import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Express } from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import {
    missingFileUploadError,
    invalidUploadConfigError,
    fileUploadError,
} from './errors';

// This initializes the S3 constants and registers
// the /upload endpoint for images used with GPT-4V
export const registerUploadHandler = (app: Express) => {
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const s3EndpointUrl = process.env.S3_ENDPOINT_URL;
    const s3Region = process.env.S3_REGION;
    const s3AccessKey = process.env.S3_ACCESS_KEY;
    const s3SecretKey = process.env.S3_SECRET_KEY;

    const upload = multer({ storage: multer.memoryStorage() });

    function s3Enabled() {
        return !!s3BucketName && !!s3EndpointUrl && !!s3AccessKey && !!s3SecretKey;
    }

    function getS3Client(): S3Client | null {
        if (!s3Enabled()) return null;

        return new S3Client({
            region: s3Region ?? 'us-east-1',
            endpoint: s3EndpointUrl,
            credentials: {
                accessKeyId: s3AccessKey!,
                secretAccessKey: s3SecretKey!,
            },
        });
    }

    const client = getS3Client();

    app.get('/config/upload', async (req, res) => {
        res.json({
            enabled: s3Enabled(),
        });
    });
    
    app.post('/upload', upload.single('image'), async (req, res) => {
        if (!s3Enabled() || !client) {
            res.status(500).json({
                error: invalidUploadConfigError,
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                error: missingFileUploadError,
            });
            return;
        }

        const id = randomUUID();
        const ext = extname(req.file.originalname);
        const name = `${id}${ext}`;
        const key = `simplegpt/${name}`;
    
        try {
            const upload = new Upload({
                client,
                params: {
                    Bucket: s3BucketName,
                    Key: key,
                    Body: req.file.buffer,
                }
            });

		    const result = await upload.done();

            res.json({
                data: {
                    url: result.Location,
                    name,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: fileUploadError,
            });
        }
    });
};
