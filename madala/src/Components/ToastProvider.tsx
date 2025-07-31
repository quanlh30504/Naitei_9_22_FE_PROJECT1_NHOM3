"use client";

import { Toaster } from "react-hot-toast";
const ToastProvider = () => {
  return (
    <Toaster
      position="top-right" // vị trí hiển thị
      toastOptions={{
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3500,
          theme: {
            primary: "green",
            secondary: "black",
          },
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
};

export default ToastProvider;
