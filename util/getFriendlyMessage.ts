import { FirebaseError } from "firebase/app";

export function getFriendlyAuthMessage(error: FirebaseError): string {
  if (!(error instanceof FirebaseError)) {
    return "An unexpected error occurred. Please try again.";
  }

  const code = error.code;

  const messages: Record<string, string> = {
    // Email & Password
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "This email address is already registered.",
    "auth/wrong-password": "Incorrect password.",
    "auth/user-not-found": "No user found with this email.",
    "auth/weak-password": "Your password is too weak.",
    "auth/missing-password": "Password cannot be empty.",
    "auth/missing-email": "Email cannot be empty.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",

    // Operation / Credentials
    "auth/invalid-credential": "Invalid credentials.",
    "auth/credential-already-in-use":
      "This credential is already linked to another user.",
    "auth/account-exists-with-different-credential":
      "This email is linked to a different login provider.",
    "auth/operation-not-allowed": "This sign-in method is currently disabled.",
    "auth/requires-recent-login":
      "Please log in again to complete this action.",
    "auth/user-disabled": "This user account has been disabled.",
    "auth/user-mismatch": "User information does not match.",

    // Token / Session
    "auth/user-token-expired": "Your session has expired. Please log in again.",
    "auth/invalid-user-token": "Invalid session token.",
    "auth/user-signed-out": "You have been signed out. Please log in again.",

    // Network
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
    "auth/timeout": "The request timed out. Please try again.",

    // API / Config
    "auth/invalid-api-key": "Invalid API configuration.",
    "auth/invalid-app-id": "Invalid app ID.",
    "auth/app-not-authorized": "This app is not authorized to use Firebase.",
    "auth/app-deleted": "Firebase app configuration has been deleted.",
    "auth/internal-error": "Server error. Please try again later.",

    // Phone / MFA
    "auth/missing-phone-number": "Phone number is required.",
    "auth/missing-verification-id": "Verification ID is missing.",
    "auth/invalid-verification-id": "Invalid verification ID.",
    "auth/invalid-verification-code": "Invalid verification code.",
    "auth/code-expired":
      "This verification code has expired. Please request a new one.",
  };

  return messages[code] || "An unexpected error occurred. Please try again.";
}
