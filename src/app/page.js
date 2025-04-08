"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ImageUploadPage() {
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: Yup.object({
      image: Yup.mixed()
        .required("Image is required")
        .test(
          "fileType",
          "Unsupported file format",
          (value) =>
            value && ["image/jpeg", "image/png", "image/webp"].includes(value.type)
        ),
    }),
    onSubmit: (values) => {
      console.log("Image uploaded:", values.image);
      alert("Image uploaded successfully!");
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-[--background] text-[--foreground]">
      <h1 className="text-3xl font-bold mb-6">Upload Your Image</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-6 w-full max-w-md space-y-6 border border-neutral-200 dark:border-neutral-700"
      >
        <div className="space-y-2">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-[--foreground]"
          >
            Choose an image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {formik.errors.image && formik.touched.image && (
            <p className="text-sm text-red-500">{formik.errors.image}</p>
          )}
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="rounded-xl max-h-60 object-contain border border-neutral-300 dark:border-neutral-600"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all font-medium"
        >
          Upload Image
        </button>
      </form>
    </div>
  );
}
