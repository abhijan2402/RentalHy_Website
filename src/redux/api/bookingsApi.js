import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
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
  tagTypes: ["bookings"],
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "vendor/payment_list",
      providesTags: ["bookings"],
    }),
    getMyBookings: builder.query({
      query: () => "payment_list",
      providesTags: ["bookings"],
    }),
    replyToTicket: builder.mutation({
      query: ({ formdata }) => ({
        url: `support/issues`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["bookings"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetMyBookingsQuery,
  useReplyToTicketMutation,
} = bookingsApi;
