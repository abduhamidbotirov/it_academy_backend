import mongoose, { Document, Schema, Model } from 'mongoose';
import { IVideo } from './video.interface';
// import { IVideo } from './video.interface';
// Video şeması
const videoSchema = new Schema<IVideo>(
    {
        video_link: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin', // Admin modeline referans
        },
        cat_id: {
            type: Schema.Types.ObjectId,
            ref: 'Category', // Category modeline referans
        },
        like: {
            type: Number,
            default: 0,
        },
        dislike: {
            type: Number,
            default: 0,
        },
        likedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User', // User modeline referans
            },
        ],
        dislikedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User', // User modeline referans
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment', // Comment modeline referans
            },
        ],
        search: {
            type: [String],
            index: 'text', // Metin araması için dizin oluşturur
        },
    },
    { timestamps: true }
);

// Video modelini oluşturma
const VideoModel = mongoose.model<IVideo>('Video', videoSchema);

export default VideoModel;
