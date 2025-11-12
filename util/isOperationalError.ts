import { FirebaseError } from "firebase/app";

export function isOperationalError(error: any): boolean {
  if (!(error instanceof FirebaseError)) return false;

  const opErrors = new Set<string>([
    // Email & Password
    "auth/invalid-email",
    "auth/email-already-in-use",
    "auth/user-not-found",
    "auth/wrong-password",
    "auth/weak-password",
    "auth/missing-password",
    "auth/missing-email",
    "auth/too-many-requests",

    // Login / Signup Operation
    "auth/operation-not-allowed",
    "auth/invalid-credential",
    "auth/credential-already-in-use",
    "auth/account-exists-with-different-credential",
    "auth/requires-recent-login",
    "auth/user-disabled",
    "auth/user-mismatch",

    // Token / Session
    "auth/user-token-expired",
    "auth/invalid-user-token",
    "auth/token-expired",
    "auth/user-signed-out",

    // Network / Client
    "auth/network-request-failed",
    "auth/timeout",

    // API / Config
    "auth/invalid-api-key",
    "auth/invalid-app-id",
    "auth/app-not-authorized",
    "auth/app-deleted",
    "auth/internal-error",

    // Phone / MFA
    "auth/missing-phone-number",
    "auth/missing-verification-id",
    "auth/invalid-verification-id",
    "auth/invalid-verification-code",
    "auth/code-expired",
  ]);

  return opErrors.has(error.code);
}
