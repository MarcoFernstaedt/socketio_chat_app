"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.resendClient = void 0;
const resend_1 = require("resend");
const env_1 = require("./env");
exports.resendClient = new resend_1.Resend(env_1.ENV.RESEND_API_KEY);
exports.sender = {
    email: env_1.ENV.EMAIL_FROM,
    name: env_1.ENV.EMAIL_FROM_NAME,
};
