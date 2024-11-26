import express from "express";
import upload from "../utils/multer";
import { uploadMedia } from "../utils/cloudinary";

const router = express.Router();

router.route("/upload-vedio").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res
      .status(200)
      .json({ message: "File uploaded successfully.", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading file" });
  }
});

export default router;
