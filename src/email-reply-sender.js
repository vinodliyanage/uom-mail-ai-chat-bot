import nodemailer from "nodemailer";
import config from "./config.js";

export default class EmailReplySender {
  constructor(emailAddress, password, smtpServer = config.SMTP_SERVER, smtpPort = config.SMTP_PORT) {
    this.emailAddress = emailAddress;
    this.password = password;
    this.smtpServer = smtpServer;
    this.smtpPort = smtpPort;

    this.ccEmails = config.CC_EMAILS;

    this.transporter = nodemailer.createTransport({
      host: this.smtpServer,
      port: this.smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.emailAddress,
        pass: this.password,
      },
    });
  }

  async sendReply(originalEmail, body) {
    // Extract recipient from original email's "from" field
    let recipient;
    if (typeof originalEmail.from === "object" && originalEmail.from.value) {
      recipient = originalEmail.from.value[0].address;
    } else {
      const fromMatch = originalEmail.from?.text?.match(/<(.+?)>/);
      recipient = fromMatch ? fromMatch[1] : originalEmail.from?.text;
    }

    if (!recipient) {
      throw new Error("Unable to determine recipient email address");
    }

    const mailOptions = {
      from: this.emailAddress,
      to: recipient,
      cc: this.ccEmails,
      subject: `Answer: ${originalEmail.subject || ""}`,
      text: body,
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}
