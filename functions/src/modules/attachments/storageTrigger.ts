import * as functions from "firebase-functions";
import { storage, firestore } from "../admin/admin.service";
import * as unzipper from "unzipper";
import { tmpdir } from "os";
import { join } from "path";
import { emptyDir, mkdir } from "fs-extra";
import * as fs from "fs";
import { nameFormat } from "../../utils/nameFormat";
import { nameFormatImage } from "../../utils/nameFormatImage";


type ObjectMetadata = functions.storage.ObjectMetadata;

const Trigger = (object: ObjectMetadata) => {
  return new Promise(async resolve => {
    const name = object.name;
    console.log(object);

    if (name && name.endsWith(".zip")) {
      const file = storage.bucket().file(name);

      const path = firestore.doc();

      await path.set({ startedAt: new Date().toISOString() }, { merge: true });

      const uploaddir = join(tmpdir(), `${name}-${Math.floor(Math.random() * 1000)}`);

      // Creating a directory that will contain the unzipped files to be uploaded
      await new Promise(resol => {
        mkdir(uploaddir, () => {
          resol();
        });
      });

      // Downloading the file from storage using its filename
      // then unzipping its contents into the upload directory
      try {
        await new Promise(resolv => {
          file
            .createReadStream()
            .pipe(unzipper.Extract({ path: uploaddir }))
            .on("close", () => {
              resolv();
            });
        });
      } catch (err) {
        console.error("Error at downloading and unzipping");
        console.error(err);
      }

      // Reading the upload directory to find the unzipped filenames
      fs.readdir(uploaddir, async (error, data) => {
        if (error) {
          console.error("Error at readdir");
          console.error(error);
          return;
        }

        console.log("data", data);
        console.log("data length", data.length);

        // Array to hold promises for each uploaded file
        const allFiles: Promise<any>[] = [];

        // Reading the filenames of the files to be uploaded
        data.forEach(async (uploadingFileName: any) => {
          const uploadingFilePath = join(uploaddir, uploadingFileName);
          console.log("uploadingFileName", uploadingFileName);

          // Creating a promise representing each file to be uploaded
          allFiles.push(
            new Promise(async res => {
              storage
                .bucket()
                .upload(uploadingFilePath, {
                  destination: `zipFile/${nameFormat(name)}/${uploadingFileName}`
                })
                .then(() => {
                  console.log(`file ${uploadingFileName} uploaded successfully`);
                  path
                    .collection("attachments")
                    .doc()
                    .set(
                      {
                        // filePath: uploadingFileName.name,
                        // size: uploadingFileName.size,
                        filename: uploadingFileName,
                        status: "finished",
                        started: new Date().toISOString()
                      },
                      { merge: true }
                    )
                    .then(() => {
                      console.log(uploadingFileName);
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => {
                  path
                    .collection("attachments")
                    .doc()
                    .set(
                      {
                        filename: uploadingFileName,
                        status: "failed",
                        started: new Date().toISOString(),
                        reason: err.message
                      },
                      { merge: true }
                    )
                    .catch(er => console.log(er));
                });
              res();
            }).catch(err => {
              console.error(`Error while uploading file ${uploadingFileName}`);
              console.error(err);
            })
          );
        });

        // Wait for all the files to finish uploading
        await Promise.all(allFiles);

        // Clean the entire temp directory
        try {
          await emptyDir(uploaddir);
        } catch (err) {
          console.error(`Error while cleaning the uploaddir: ${uploaddir}`);
          console.error(err);
        }

        // End the trigger's Promise
        resolve();
      });

      await path
        .set(
          {
            bucketName: object.bucket,
            size: object.size,
            contentType: object.contentType,
            fileName: nameFormatImage(name),
            finished: new Date().toISOString(),
            filePath: object.name,
            // contentType: object.metadata?.contentType,
            status: "finished"
          },
          { merge: true }
        )
        .catch((err2: { message: any }) => {
          path
            .set(
              {
                size: object.size,
                fileName: nameFormatImage(name),
                filePath: object.name,
                contentType: object.metadata?.contentType,
                status: "failed",
                reason: err2.message
              },
              { merge: true }
            )
            .then(() => console.log("error handled"))
            .catch((e: Error) => console.log(e));
        });
    } else {
      console.log("it is not a zip file");
    }
  });
};

export { Trigger };
