import nodemailer, { TransportOptions, SendMailOptions } from "nodemailer";

export const Mailer = (
  transportOptions: TransportOptions,
  logger = {
    info: (info: any) => console.info(info),
    error: (error: Error) => console.error(error),
  },
) => {
  const transporter = nodemailer.createTransport(transportOptions);
  return {
    sendMail: (sendMailOptions: SendMailOptions) =>
      transporter.sendMail(sendMailOptions, (error, info) => {
        if (error) logger.error(error);

        logger.info(JSON.stringify(info));
      }),
  };
};
