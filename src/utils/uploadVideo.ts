import { Request, Response } from 'express';
import { uploaderVideo } from './cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
export async function uploadVideo(req: Request, res: Response, title: string) {
    const UploadedFile = req.files?.file as UploadedFile;
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
    }
    if (!UploadedFile.mimetype.startsWith('video/')) {
        return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
    }
    // upload Video
    const unique_video_name = uuidv4();
    const video_link = await uploaderVideo(UploadedFile.data, title + unique_video_name) as string;
    return video_link
}