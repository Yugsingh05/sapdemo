"use client";

import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";

export default function ImageUploadPage() {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // ref for the file input

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
    onSubmit: async (values) => {
      console.log("Image file:", values.image);

      // Convert file to base64 Data URI
      const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file); // This gives full base64 Data URI
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      try {
        const base64Image = await getBase64(values.image);
        console.log("Base64 Data URI:", base64Image);

        // Prepare headers and payload
        const headers = {
          Authorization: `Bearer msy_dummy_api_key_for_test_mode_12345678`, // Replace or hardcode your token if needed
        };

        const payload = {
          image_url: base64Image, // Pass base64 Data URI here
          enable_pbr: true,
          should_remesh: true,
          should_texture: true,
        };

        const response = await axios.post(
          'https://api.meshy.ai/openapi/v1/image-to-3d',
          payload,
          { headers }
        );

        console.log("Meshy API response:", response);
        const taskId = response.data.result;

        try {
          const response = await axios.get(
            `https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`,
            { headers }
          );
          console.log("get response.data",response.data);
        } catch (error) {
          console.error(error);
        }
        // You can now use response.data.task_id to poll the status
      } catch (error) {
        console.error("Error uploading to Meshy:", error);
        alert("Image upload failed");
      }
    },

  });



  const handleImageChange = (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset the file input
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
            ref={fileInputRef}
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
          <div className="relative mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl max-h-60 object-contain border border-neutral-300 dark:border-neutral-600 w-full"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
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
