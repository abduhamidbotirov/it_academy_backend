import express from 'express';
import VideoController from './video.contr.js';
const videoRouter = express.Router();
const controller = new VideoController();
videoRouter.post("/", controller.CreatVideo)
export default videoRouter;