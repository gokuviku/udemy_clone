import {Course} from "../models/course.model.js"
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const course = await Course.create({
      courseTitle,
      category,
      createor: req.id,
    });
    return res.status(201).json({ course, msg: "Course created." });
  } catch (error) {
    console.log(error);
    return;
    res.status(500).json({ msg: "Failed to create course." });
  }
};
