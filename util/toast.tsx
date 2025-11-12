// App.tsx
import React from "react";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

/*
  1. Create the config (TypeScript-safe)
*/
const toastConfig: ToastConfig = {
  // Success toast
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#00b894" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1NumberOfLines={5}
      text1Style={{
        fontSize: 15,
        fontWeight: "500",
        color: "#2d3436",
      }}
      text2Style={{
        fontSize: 13,
        color: "#636e72",
      }}
    />
  ),

  // Error toast
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#d63031" }}
      text1NumberOfLines={5}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
        color: "#d63031",
      }}
      text2Style={{
        fontSize: 14,
        color: "#2d3436",
      }}
    />
  ),

  // You can add custom toasts here later (with typing)
};

export { toastConfig };
