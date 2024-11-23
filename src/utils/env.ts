import dotenv from "dotenv";

dotenv.config();

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || "258867996273739";
export const CLOUDINARY_API_SECRET: string =
  process.env.CLOUDINARY_API_SECRET || "xA9B5OGl_T5D_XfgXqG9GSuHIU8";
export const CLOUDINARY_CLOUD_NAME: string =
  process.env.CLOUDINARY_CLOUD_NAME || "dfbyugdhl";
export const DATABASE_URL: string = process.env.DATABASE_URL || "mongodb+srv://LooSry:VJX99SIIsuviFwXl@cluster-wpu-course.bdnqo.mongodb.net/?retryWrites=true&w=majority&appName=cluster-wpu-course";
export const SECRET: string = process.env.SECRET || "secret";