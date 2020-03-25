// import { Request, Response } from 'express';
import * as admin from "firebase-admin";
// import * as jwt from 'jsonwebtoken';
import * as serviceAccount from "../../config/firebase-adminsdk.json";
// import * as uuid from 'uuid/v4'

// Initialize Firebase app
const serviceAccountParams = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
};

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountParams),
  storageBucket: "gs://.........."
});

// Initialize firestore




const storage = admin.storage();
const messaging = admin.messaging();

const firestoreSettings = { timestampsInSnapshots: true };
admin.firestore().settings(firestoreSettings);

export {
  app,
  storage,
  messaging
};
