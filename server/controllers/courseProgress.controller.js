import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    //step-1 fetch the user course progress.
    const courseProgress = await CourseProgress.findByOne({
      courseId,
      userId,
    }).populate("courseId");
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({ message: "Course not found" });
    }
    //step-2 check if the no course progress found, return course details and empty progress
    if (!courseProgress) {
      return res
        .status(200)
        .json({ data: { courseDetails, progress: [], completed: false } });
    }
    //step-3 return the users course progress along with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      //if no progress exist , create a new record.
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    //find the lecture progress in the course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );
    if (lectureIndex !== -1) {
      // if l;ecture already exist , update the lecture progress
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      //add new lecture progress
      courseProgress.lectureProgress.push({ lectureId, viewed: true });
    }
    //if all lecture is complete
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;
    await courseProgress.save();
    return res
      .status(200)
      .json({ message: "Lecture Progress Updated Successfully." });
  } catch (error) {
    console.error(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({ message: "Course Progress not found." });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.error(error);
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({ message: "Course Progress not found." });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as incompleted." });
  } catch (error) {
    console.error(error);
  }
};
