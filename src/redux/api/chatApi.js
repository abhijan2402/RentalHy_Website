import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatListApi = createApi({
  reducerPath: "chatListApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["chatList"],
  endpoints: (builder) => ({
    getchatAllList: builder.query({
      query: (id) => `chat-list`,
      providesTags: ["chatList"],
    }),
    getchatList: builder.query({
      query: (id) => `chat/conversation/${id}`,
      providesTags: ["chatList"],
    }),
    getchatUnreadList: builder.query({
      query: () => `chat/unread-count`,
      providesTags: ["chatList"],
    }),
    replyTochat: builder.mutation({
      query: (formdata) => ({
        url: `chat/send`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["chatList"],
    }),
    markAsReadToChat: builder.mutation({
      query: (formdata) => ({
        url: `chat/mark-as-read`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["chatList"],
    }),
  }),
});

export const {
  useGetchatAllListQuery,
  useGetchatListQuery,
  useGetchatUnreadListQuery,
  useReplyTochatMutation,
  useMarkAsReadToChatMutation,
} = chatListApi;
