import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

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

export const getCreatorCourses = async (req, res) => {
  try {
    const userid = req.id;
    const courses = await Course.find({ creator: userid });
    if (!courses) {
      return res.status(404).json({ msg: "No courses found.", course: [] });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return;
    res.status(500).json({ msg: "Failed to create course." });
  }
};

export const editCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found." });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); //delete old image..
      }
      //upload thumbnail n cloudinary
      courseThumbnail = await uploadMediaToCloudinary(thumbnail.path);
    }
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      course,
      msg: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return;
    res.status(500).json({ msg: "Failed to create course." });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found." });
    }
    return res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    return;
    res.status(500).json({ msg: "Failed to get course by id." });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;
    if (!lectureTitle || courseId) {
      return res
        .status(400)
        .json({ msg: "Please provide lecture title and course id." });
    }
    const lecture = new Lecture.create({
      lectureTitle,
    });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({ msg: "Lecture created successfully." });
  } catch (error) {
    console.log(error);
    return;
    res.status(500).json({ msg: "Failed to get course by id." });
  }
};
