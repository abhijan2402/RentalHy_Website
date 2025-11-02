import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  endpoints: (builder) => ({
    // Step 1: Add email to get OTP
    signupEmail: builder.mutation({
      query: (email) => ({
        url: "signup/email",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("email", email);
          return formData;
        })(),
      }),
    }),

    // Step 2: Verify email with OTP
    verifyEmail: builder.mutation({
      query: ({ user_id, verification_code }) => ({
        url: "signup/verify-email",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("user_id", user_id);
          formData.append("verification_code", verification_code);
          return formData;
        })(),
      }),
    }),

    // Step 3: Complete registration
    completeSignup: builder.mutation({
      query: ({
        user_id,
        phone_number,
        password,
        password_confirmation,
        username,
      }) => ({
        url: "signup/complete",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("user_id", user_id);
          formData.append("phone_number", phone_number);
          formData.append("password", password);
          formData.append("password_confirmation", password_confirmation);
          formData.append("name", username);
          return formData;
        })(),
      }),
    }),

    // Login mutation (email + password using FormData)
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);
          return formData;
        })(),
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "forgot-password",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("email", email);
          return formData;
        })(),
      }),
    }),

    // Verify Password Email
    verifyForgotPassword: builder.mutation({
      query: ({ email, otp }) => ({
        url: "verify-reset-otp",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("otp", otp);
          return formData;
        })(),
      }),
    }),
    // Reset Password
    resetForgotPassword: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: "reset-password",
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("otp", otp);
          formData.append("new_password", newPassword);
          return formData;
        })(),
      }),
    }),
  }),
});

export const {
  useSignupEmailMutation,
  useVerifyEmailMutation,
  useCompleteSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordMutation,
  useResetForgotPasswordMutation,
} = authApi;
