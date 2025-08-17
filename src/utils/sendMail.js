import nodemailer from 'nodemailer';

import getEnvVariables from './getEnvVariables.js';

const transporter = nodemailer.createTransport({
  host: getEnvVariables('SMTP_HOST'),
  port: Number(getEnvVariables('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnvVariables('SMTP_LOGIN'),
    pass: getEnvVariables('SMTP_PASSWORD'),
  },
});

export function sendMail(mail) {
  mail.from = getEnvVariables('SMTP_FROM');

  return transporter.sendMail(mail);
}