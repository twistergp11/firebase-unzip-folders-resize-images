import * as functions from "firebase-functions";
import server from "./server";
import {Trigger} from './modules/attachments/storageTrigger'
import {resizeImage} from './modules/attachments/resizeImage'

const assetsApi = functions.region("europe-west1").https.onRequest(server);

const storageTrigger = functions
  .region("europe-west1")
  .storage.object()
  .onFinalize(Trigger);
  
  const resizeImages = functions
  .region("europe-west1")
  .storage.object().onFinalize(resizeImage)

export { assetsApi, resizeImages, storageTrigger  };
