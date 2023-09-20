import { Document } from "mongoose";
import { IComment } from './comment'; // Comment modelinin arayüzüne atıfta bulunulmalıdır
import { ICategory } from './category'; // Category modelinin arayüzüne atıfta bulunulmalıdır
import { IUser } from './user'; // User modelinin arayüzüne atıfta bulunulmalıdır
import { IAdmin } from './admin'; // Admin modelinin arayüzüne atıfta bulunulmalıdır
export interface IVideo extends Document {
    video_link: string;
    title: string;
    description: string;
    admin: IUser; // Admin belgesine referans
    cat_id: ICategory; // Category belgesine referans
    like: number;
    dislike: number;
    likedBy: IUser[]; // User belgesine referans
    dislikedBy: IUser[]; // User belgesine referans
    comments: IComment[]; // Comment belgesine referans
    search: string[];
}
export interface IVideoBody extends Document {
    video_link?: string;
    title: string;
    description: string;
    search: string[];
}