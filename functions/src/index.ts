import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/https";
import { getFirestore } from "firebase-admin/firestore";
import { CreatePatientDto } from "../../shared/model/dto/CreatePatientDto";
import {  } from "../../shared/model/entity/PatientEntity";

admin.initializeApp();

exports.addmessage = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const createPationtInput = req.body as CreatePatientDto;

  const patient : 


  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("patients")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});
