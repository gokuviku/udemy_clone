import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch-Creator-Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch-Creator-Course"],
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch-Creator-Course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch-Creator-Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    createLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        lectureId,
        courseId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),

    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        lectureId,
        courseId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),

    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),

    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
} = courseApi;

// WEBHOOK_ENDPOINT_SECRET=
// API_KEY=451755216331547
// API_SECRET=9mOAjmNmw_14ClmmQSVQCnPSx3s
// CLOUD_NAME=dgolytiri
// CLOUDINARY_URL=cloudinary://451755216331547:9mOAjmNmw_14ClmmQSVQCnPSx3s@dgolytiri
// MONGO_URI=mongodb://localhost:27017/Threads
// JWT_SECRET=fiywer87rc32rf382
// PORT=8000
