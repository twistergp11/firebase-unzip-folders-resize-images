import { storage } from "../admin/admin.service";
import * as functions from "firebase-functions";
import { tmpdir } from "os";
import * as path from "path";
const spawn = require("child-process-promise").spawn;

type ObjectMetadata = functions.storage.ObjectMetadata;

const resizeImage = async (object: ObjectMetadata) => {
  const name = object.name;
  await new Promise(async resolve => {
    if (
      name &&
      (name.endsWith(".png") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".JPG") ||
        name.endsWith(".JPEG") ||
        name.endsWith(".PNG"))
    ) {
      const file = storage.bucket().file(name);
      const tempFilePath = path.join(tmpdir(), path.basename(name));
      const metadata = { contentType: object.contentType };

      if (path.basename(name).startsWith("resized")) {
        return;
      }

      await file.download({
        destination: tempFilePath
      });

      console.log("SPAWN STARTED");

      await spawn("convert", [tempFilePath, "-resize", "200x200", tempFilePath]);

      console.log("UPLOADING STARTED");
      await storage.bucket().upload(tempFilePath, {
        destination: `zipFile/resized/resized_${path.basename(name)}`,
        metadata: {
          metadata
        }
      });

      resolve();
    } else {
      console.log("it is not an image");
    }
  });
};

export { resizeImage };
