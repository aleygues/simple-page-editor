# Images

Images are uploaded using `multer`, stored in memory, resized using `sharp`, and stored in a upload file (see `controllers/medias.ts`)

Images are requested with on the fly transformation parameters (see `controllers/medias.ts`), these parameters are used to generate a unique key for the image, and the image is stored in a cache (see `transformImage.ts`)

Cached images are stored in a cache folder (see `transformImage.ts`) for a certain amount of time and are automatically cleared by a cron job (see `CronManager.ts` and `clearImagesCache.ts`), based on their creation datetime and the `CACHE_DURATION` environment variable
