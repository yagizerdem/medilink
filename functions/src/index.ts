import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/https";
import {app} from "./app";

admin.initializeApp();

export const api = onRequest(app);
