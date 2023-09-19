import express from "express";
import videoRouter from "./videos/video.routes.js";
const router = express.Router();
router.use('/test', () => { });
router.use("/video", videoRouter)
export default router