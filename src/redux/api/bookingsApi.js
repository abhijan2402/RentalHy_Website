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
    // Convention/Hall orders Section APi
    getBookings: builder.query({
      query: () => "vendor/payment_list",
      providesTags: ["bookings"],
    }),

    acceptBookings: builder.mutation({
      query: (id) => ({
        url: `payments/${id}/accept`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["bookings"],
    }),

    rejectBookings: builder.mutation({
      query: ({ formdata, id }) => ({
        url: `payments/${id}/reject`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["bookings"],
    }),

    // My Bookings Apis
    getMyBookings: builder.query({
      query: () => "payment_list",
      providesTags: ["bookings"],
    }),
    updateMyBookings: builder.mutation({
      query: ({ formdata, id }) => ({
        url: `book-property/update-order/${id}`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["bookings"],
    }),

    // Ticket Apis
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
  useUpdateMyBookingsMutation,
  useRejectBookingsMutation,
  useAcceptBookingsMutation,
} = bookingsApi;
