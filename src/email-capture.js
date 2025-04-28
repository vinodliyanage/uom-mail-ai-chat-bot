import Imap from "imap";
import { simpleParser } from "mailparser";
import config from "./config.js";

export default class EmailCapture {
  constructor(emailAddress, password, imapServer = config.IMAP_SERVER, imapPort = config.IMAP_PORT) {
    this.emailAddress = emailAddress;
    this.password = password;
    this.imapServer = imapServer;
    this.imapPort = imapPort;
    this.authorizedEmails = config.AUTHORIZED_EMAILS;
  }

  createImapConnection() {
    return new Imap({
      user: this.emailAddress,
      password: this.password,
      host: this.imapServer,
      port: this.imapPort,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  captureEmails() {
    return new Promise((resolve, reject) => {
      const imap = this.createImapConnection();
      const parsedEmails = [];

      imap.once("ready", () => {
        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          let searchCriteria = ["UNSEEN"];

          if (this.authorizedEmails.length === 1) {
            searchCriteria.push(["FROM", this.authorizedEmails[0]]);
          } else if (this.authorizedEmails.length > 1) {
            const froms = this.authorizedEmails.map((email) => ["FROM", email]);
            const orQuery = froms.reduce((acc, curr) => ["OR", acc, curr]);
            searchCriteria.push(orQuery);
          }

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              imap.end();
              return reject(err);
            }

            if (results.length === 0) {
              imap.end();
              return resolve([]);
            }

            const fetch = imap.fetch(results, { bodies: "", markSeen: true });

            fetch.on("message", (msg) => {
              const emailInfo = {};

              msg.on("body", (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  if (err) {
                    throw err;
                  }

                  emailInfo.subject = parsed.subject;
                  emailInfo.from = parsed.from.text;
                  emailInfo.date = parsed.date;
                  emailInfo.description = parsed.text || "";
                  emailInfo.original_email = parsed;

                  // Extract sender email
                  const senderMatch = emailInfo.from.match(/<(.+?)>/);
                  const senderEmail = senderMatch ? senderMatch[1] : emailInfo.from;

                  // Check if email is from authorized sender
                  if (this.authorizedEmails.length === 0 || this.authorizedEmails.includes(senderEmail)) {
                    parsedEmails.push(emailInfo);
                  }
                });
              });
            });

            fetch.once("end", () => {
              imap.end();
              // Give a moment for all message parsing to complete
              setTimeout(() => resolve(parsedEmails), 1000);
            });
          });
        });
      });

      imap.once("error", (err) => {
        reject(err);
      });

      imap.connect();
    });
  }
}
