import { Request, Response } from 'express';
import { uploaderVideo } from '../../utils/cloudinary.js';
import { UploadedFile } from 'express-fileupload';
import { JWT } from '../../utils/jwt.js';
import { IVideoBody } from './video.interface.js';
import { v4 as uuidv4 } from 'uuid';
import VideoModel from './video.model.js';
class PostController {
    async creatVideo(req: Request, res: Response) {
        try {
            // check file
            const UploadedFile = req.files?.file as UploadedFile
            if (!UploadedFile) {
                return res.status(400).json({ error: 'Fayl topilmadi' });
            }
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('multipart/form-data')) {
                return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
            }
            if (!UploadedFile.mimetype.startsWith('video/')) {
                return res.status(400).json({ error: 'Fayl tipi noto\'g\'ri' });
            }
            // check body
            const { title, description, search }: IVideoBody = req.body;
            // upload Video
            const unique_video_name = uuidv4();
            const video_link = await uploaderVideo(UploadedFile.data, title + unique_video_name);
            // createModel
            const video = new VideoModel({ video_link, title, description, search });
            // savedModel
            let savedVideo = await video.save();
            // response
            res.status(201).send({
                success: true,
                message: 'Success!',
                data: savedVideo
            });

        } catch (error) {
            if (error instanceof Error) {
                // Now 'error' is of type 'Error'
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            } else if (typeof error === 'string') {
                // Handle string errors
                console.error(error);
                return res.status(400).json({ message: error, status: 400 });
            } else {
                // Handle other types of errors if necessary
                console.error('Unknown error:', error);
                return res.status(500).json({ message: 'Unknown error', status: 500 });
            }
        }

    }
}
export default PostController;