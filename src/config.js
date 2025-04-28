const config = {
  IMAP_SERVER: process.env.IMAP_SERVER || "imap.gmail.com",
  IMAP_PORT: parseInt(process.env.IMAP_PORT || "993"),
  SMTP_SERVER: process.env.SMTP_SERVER || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  APP_PASSWORD: process.env.APP_PASSWORD,
  EMAIL_POLLING_INTERVAL: parseInt(process.env.EMAIL_POLLING_INTERVAL || "5000"),
  AUTHORIZED_EMAILS: (process.env.AUTHORIZED_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean),
  CC_EMAILS: (process.env.CC_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean),
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash-001",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  COURSE_MATERIAL: (process.env.COURSE_MATERIAL || "").trim(),
};

export default config;
