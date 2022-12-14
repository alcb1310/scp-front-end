import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./redux/token";

export default configureStore({
  reducer: {
    token: tokenReducer,
  },
});
