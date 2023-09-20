import { JWT } from "./jwt.js";
import { Request, Response } from 'express';

export function getUserId(req: Request) {
    const token: string | undefined = req.headers.token as string | undefined;
    if (!token) throw new Error('Token not found');

    const userId: string | null = JWT.VERIFY(token).id;
    if (!userId) throw new Error('User not found');
    return userId
}