import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hotpink-rook-901841.hostingersite.com/public/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "profile",
        method: "POST",
        body: formData,
      }),
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "profile/image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation, useUploadProfileImageMutation } =
  profileApi;
