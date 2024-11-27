import Razorpay from "razorpay";
import { Course } from "../models/course.model";
import { CoursePurchase } from "../models/coursePurchase.model";

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.course.price,
      status: "pending",
    });
    //create razorpay checkout session
  } catch (error) {
    console.error(error);
  }
};

/* const options = { amount: amount, currency: 'INR', receipt: 'receipt#1' }; try { const order = await razorpay.orders.create(options); res.json(order); } catch (error) { res.status(500).send(error); }*/
