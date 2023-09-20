import { Request, Response } from 'express';
import VideoModel from './video.model.js';
import { IVideoBody } from './video.interface';
import handleError from '../../utils/catchError.js';
import { uploadVideo } from '../../utils/uploadVideo.js';
import { getUserId } from '../../utils/userId.js';
import { ObjectId } from 'mongoose';
import { logger } from '../../utils/winston.js';
class PostController {
    // admin
    async creatVideo(req: Request, res: Response) {
        try {
            const userId: string | ObjectId = getUserId(req);
            // check body
            const { title, description, search }: IVideoBody = req.body;
            // upload Video
            const video_link = await uploadVideo(req, res, title) as string;
            // createModel
            const video = new VideoModel({ video_link, title, description, search, admin: userId });
            // savedModel
            let savedVideo = await video.save();
            logger.log({
                level: 'info',
                message: 'Yangi video saqlandi',
                savedVideo: JSON.stringify(savedVideo)
            });
            // response
            res.status(201).send({
                success: true,
                message: 'Success!',
                data: savedVideo
            });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    // user
    async getVideos(req: Request, res: Response) {
        try {
            const videos = await VideoModel.find({}, { admin: 0 }).populate('cat_id').exec();
            res.status(200).json({ success: true, data: videos });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    // admin
    async getVideosByAdmin(req: Request, res: Response) {
        try {
            const videos = await VideoModel.find({})
                .populate('admin', 'cat_id') // Replace with the fields you want to populate
                .exec();
            res.status(200).json({ success: true, data: videos });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    async getByIdVideo(req: Request, res: Response) {
        const videoId = req.params.id;
        try {
            const video = await VideoModel.findById(videoId)
                .populate('comments', 'cat_id') // Assuming 'comments' is the field holding comment IDs
                .exec();
            if (!video) {
                return res.status(404).json({ success: false, message: 'Video not found' });
            }
            res.status(200).json({ success: true, data: video });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    // admin
    async getByIdVideoByAdmin(req: Request, res: Response) {
        const videoId = req.params.id;
        try {
            const video = await VideoModel.findById(videoId)
                .populate('admin', 'cat_id likedBy dislikedBy comments') // Assuming 'comments' is the field holding comment IDs
                .exec();
            if (!video) {
                return res.status(404).json({ success: false, message: 'Video not found' });
            }
            res.status(200).json({ success: true, data: video });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    async getLikesVideo(req: Request, res: Response) {
        try {
            const videos = await VideoModel.find({}).sort({ like: -1 }).exec();
            res.status(200).json({ success: true, data: videos });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    async getSearchVideo(req: Request, res: Response) {
        const searchQuery = req.query.search as string;
        try {
            const videos = await VideoModel.find({ search: { $in: searchQuery } }).exec();
            res.status(200).json({ success: true, data: videos });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    async likePatchVideo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const video = await VideoModel.findById(id);
            if (!video) {
                return res.status(404).json({ error: 'video topilmadi' });
            }
            const userId: string | ObjectId = getUserId(req);
            // Agar user videoni avval like qilmagan bo'lsa, yangi like qo'shamiz
            if (!video.likedBy.includes(userId)) {
                video.likedBy.push(userId);
                video.like += 1;
                logger.log({
                    level: 'info',
                    message: userId + " like bosti",
                });
                if (video.dislikedBy.includes(userId)) {
                    const indexOfDislike = video.dislikedBy.indexOf(userId);
                    video.dislikedBy.splice(indexOfDislike, 1);
                    video.dislike -= 1;
                    logger.log({
                        level: 'info',
                        message: userId + " bosgan likeni qaytarib oldi ",
                    });
                }
            } else {
                // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                const indexOfLike = video.likedBy.indexOf(userId);
                video.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                video.like -= 1; // Like sonini kamaytiramiz
                logger.log({
                    level: 'info',
                    message: userId + "  likeni kamayishiga sabab bo'lgan userId",
                });
            }

            let savedVideo = await video.save();

            res.status(201).send({
                success: true,
                data: savedVideo
            });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    async dislikePatchVideo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const video = await VideoModel.findById(id);
            if (!video) {
                return res.status(404).json({ error: ' video topilmadi' });
            }
            const userId: string | ObjectId = getUserId(req);
            // Agar user videoni avval dislike qilmagan bo'lsa, yangi dislike qo'shamiz
            if (!video.dislikedBy.includes(userId)) {
                video.dislikedBy.push(userId);
                video.dislike += 1; // Dislike sonini oshiramiz
                logger.log({
                    level: 'info',
                    message: userId + " Liken bosti",
                });
                // Agar user avval like qilgan bo'lsa, like ni o'chiramiz
                if (video.likedBy.includes(userId)) {
                    const indexOfLike = video.likedBy.indexOf(userId);
                    video.likedBy.splice(indexOfLike, 1); // Like ni o'chiramiz
                    video.like -= 1; // Like sonini kamaytiramiz
                    logger.log({
                        level: 'info',
                        message: userId + "bosgan disLikeni qaytarib oldi",
                    });
                }
            } else {
                // Agar user avval dislike qilgan bo'lsa, dislike ni o'chiramiz
                const indexOfDislike = video.dislikedBy.indexOf(userId);
                video.dislikedBy.splice(indexOfDislike, 1); // Dislike ni o'chiramiz
                video.dislike -= 1; // Dislike sonini kamaytiramiz
                logger.log({
                    level: 'info',
                    message: userId + " disLikeni kamayishiga sabab bo'lgan UserId",
                });
            }

            let savedvideo = await video.save();
            res.status(201).send({
                success: true,
                data: savedvideo
            });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
    // admin
    async updateVideo(req: Request, res: Response) {
        try {
            // Verify user token
            const token: string | undefined = req.headers.token as string | undefined;
            if (!token) throw new Error('Token not found');

            const userId: string | ObjectId = getUserId(req);
            // Extract video ID from request parameters
            const videoId = req.params.id;

            // Check if the video exists
            const existingVideo = await VideoModel.findById(videoId).exec();
            if (!existingVideo) {
                return res.status(404).json({ success: false, message: 'Video not found' });
            }
            // Check if the user is the admin of the video
            if (existingVideo.admin.toString() !== userId) {
                return res.status(403).json({ success: false, message: 'Unauthorized access' });
            }
            // Extract updated video data from request body
            const { title, description, search }: IVideoBody = req.body;
            // Check if a file is uploaded
            const videoLink = await uploadVideo(req, res, title || existingVideo.title) as string;
            // Update the video properties
            existingVideo.title = title || existingVideo.title;
            existingVideo.description = description || existingVideo.description;
            existingVideo.search = search || existingVideo.search;
            existingVideo.video_link = videoLink || existingVideo.video_link;
            // Save the updated video
            const updatedVideo = await existingVideo.save();
            logger.log({
                level: 'info',
                message: 'video update qilinda va saqlandi',
                savedVideo: JSON.stringify(updatedVideo)
            });
            // Send a success response
            res.status(200).json({
                success: true,
                message: 'Video updated successfully',
                data: updatedVideo,
            });
        } catch (error: any) {
            return handleError(res, error);
        }
    }
    // admin
    async deleteVideo(req: Request, res: Response) {
        try {
            // Verify user token
            const userId: string | ObjectId = getUserId(req);
            // Extract video ID from request parameters
            const videoId = req.params.id;
            // Check if the video exists
            const existingVideo = await VideoModel.findById(videoId).exec();
            if (!existingVideo) {
                return res.status(404).json({ success: false, message: 'Video not found' });
            }
            // Check if the user is the admin of the video
            if (existingVideo.admin.toString() !== userId) {
                return res.status(403).json({ success: false, message: 'Unauthorized access' });
            }
            // Delete the video
            let deleteVideo = await existingVideo.deleteOne();
            logger.log({
                level: 'info',
                message: 'video o\'chirilid va saqlandi',
                savedVideo: JSON.stringify(deleteVideo)
            });
            // Send a success response
            res.status(200).json({
                success: true,
                message: 'Video deleted successfully',
            });
        } catch (error: any) {
            return handleError(res, error)
        }
    }
}
export default PostController;