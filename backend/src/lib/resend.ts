import { Resend } from "resend";
import { ENV } from "./env.js";

export const resendClient = new Resend(ENV.RESEND_API_KEY as string);

export const sender = {
  email: ENV.EMAIL_FROM as string,
  name: ENV.EMAIL_FROM_NAME as string,
};
