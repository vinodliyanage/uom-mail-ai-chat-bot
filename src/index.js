import EmailCapture from "./email-capture.js";
import config from "./config.js";
import EmailReplySender from "./email-reply-sender.js";
import { GoogleGenAI } from "@google/genai";
import logger from "./logger.js";

const {
  EMAIL_POLLING_INTERVAL,
  GEMINI_MODEL,
  GEMINI_API_KEY,
  EMAIL_ADDRESS,
  APP_PASSWORD,
  AUTHORIZED_EMAILS,
  CC_EMAILS,
  COURSE_MATERIAL,
} = config;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

async function sleep(ms) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, ms);
  });
}

async function askGemini(question) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          { role: "user", parts: [{ text: COURSE_MATERIAL }] },
          { role: "user", parts: [{ text: question }] },
        ],
      });

      if (response?.text?.length > 0) {
        return response.text;
      }

      logger.info(`Empty response received. Attempt ${attempt + 1} of ${maxRetries}`);
    } catch (error) {
      logger.error(`Error asking Gemini on attempt ${attempt + 1}:`, error?.message);
      if (attempt < maxRetries) {
        logger.info(`Retrying... Attempt ${attempt + 1} of ${maxRetries}`);
        await sleep(1000 * attempt);
      }
    } finally {
      attempt++;
    }
  }

  return "I'm sorry, I couldn't generate a response at this time. Please try again later.";
}

function extractEmail(emailInfo) {
  const subject = emailInfo.subject;
  const senderMatch = emailInfo.from.match(/<(.+?)>/);
  const senderEmail = senderMatch ? senderMatch[1] : emailInfo.from;
  const date = emailInfo.date;
  const description = emailInfo.description;
  const originalEmail = emailInfo.original_email;

  return {
    subject,
    senderEmail,
    date,
    description,
    originalEmail,
  };
}

function main() {
  logger.info("Starting UOM Mail AI Chat Bot");
  logger.info(`Monitoring inbox: ${EMAIL_ADDRESS}`);
  logger.info(`Authorized emails: ${AUTHORIZED_EMAILS.length ? AUTHORIZED_EMAILS.join(", ") : "All emails accepted"}`);
  logger.info(`CC Emails: ${CC_EMAILS.length ? CC_EMAILS.join(", ") : "None"}`);

  const emailCapture = new EmailCapture(EMAIL_ADDRESS, APP_PASSWORD);
  const replySender = new EmailReplySender(EMAIL_ADDRESS, APP_PASSWORD);

  setInterval(() => {
    emailCapture
      .captureEmails()
      .then((emails) => {
        if (emails.length === 0) {
          logger.info("No new emails to process.");
          return;
        }

        logger.info(`Found ${emails.length} new emails to process.`);

        for (const emailInfo of emails) {
          const { description, originalEmail } = extractEmail(emailInfo);

          logger.info("Asking Gemini...");

          askGemini(description)
            .then((geminiResponse) => {
              logger.info("Gemini answered and reply is being sent...");

              const reply = `Question:\n${description}\n\nResponse:\n${geminiResponse}`;

              replySender
                .sendReply(originalEmail, reply)
                .then((info) => {
                  logger.info("Email reply sent!");
                })
                .catch((error) => {
                  logger.error("Error sending reply:", error?.message);
                });
            })
            .catch((error) => {
              logger.error("Error asking Gemini:", error?.message);
            });
        }
      })
      .catch((error) => {
        logger.error("Error capturing emails:", error?.message);
      })
      .finally(() => {
        logger.info("Waiting 5 seconds before next check...");
      });
  }, EMAIL_POLLING_INTERVAL);
}

main();
