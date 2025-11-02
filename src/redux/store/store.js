import { configureStore } from "@reduxjs/toolkit";
import { ticketListApi } from "../api/ticketListApi";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";
import { propertyApi } from "../api/propertyApi";
import { conventionApi } from "../api/conventionApi";
import { hostelApi } from "../api/hostelApi";
import { paymentApi } from "../api/paymnetApi";
import { bookingsApi } from "../api/bookingsApi";
import { accountApi } from "../api/accountApi";
import { feedbackApi } from "../api/feedbackApi";
import { cmsApi } from "../api/cmsApi";
import { chatListApi } from "../api/chatApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [ticketListApi.reducerPath]: ticketListApi.reducer,
    [conventionApi.reducerPath]: conventionApi.reducer,
    [hostelApi.reducerPath]: hostelApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [chatListApi.reducerPath]: chatListApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ticketListApi.middleware)
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(propertyApi.middleware)
      .concat(conventionApi.middleware)
      .concat(hostelApi.middleware)
      .concat(paymentApi.middleware)
      .concat(bookingsApi.middleware)
      .concat(accountApi.middleware)
      .concat(cmsApi.middleware)
      .concat(feedbackApi.middleware)
      .concat(chatListApi.middleware),
});
