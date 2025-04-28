# UOM Mail AI Chat Bot

An automated email response system that uses Google's Gemini AI to answer questions about UOM (University of Moratuwa) course materials. The bot monitors a specified email inbox and automatically responds to incoming queries using Gemini AI.

## Features

- Automated email monitoring and response system
- Integration with Google's Gemini AI for intelligent responses
- Configurable authorized email addresses
- Support for CC recipients
- Automatic retry mechanism for failed AI responses
- Detailed logging system

## Prerequisites

- Node.js (v14 or higher)
- pnpm or npm package manager
- A Google Cloud account with Gemini API access
- A Gmail account with App Password enabled

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd uom-mail-ai-chat
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
EMAIL_ADDRESS=your-email@gmail.com
APP_PASSWORD=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro
EMAIL_POLLING_INTERVAL=5000
AUTHORIZED_EMAILS=email1@example.com,email2@example.com
CC_EMAILS=cc1@example.com,cc2@example.com
COURSE_MATERIAL=Your course material text here
```

**see the .env.example file for more details.**

## Configuration

The following environment variables can be configured:

- `EMAIL_ADDRESS`: The Gmail address to monitor
- `APP_PASSWORD`: Gmail App Password (required for IMAP access)
- `GEMINI_API_KEY`: Your Google Gemini API key
- `GEMINI_MODEL`: The Gemini model to use (default: gemini-pro)
- `EMAIL_POLLING_INTERVAL`: How often to check for new emails (in milliseconds)
- `AUTHORIZED_EMAILS`: Comma-separated list of authorized email addresses
- `CC_EMAILS`: Comma-separated list of CC recipients
- `COURSE_MATERIAL`: The course material text that Gemini will use as context

## Usage

Start the bot in development mode:

```bash
pnpm dev
# or
npm run dev
```

Start the bot in production mode:

```bash
pnpm start
# or
npm start
```

## Docker Support

The project includes Docker support. To build and run the container:

```bash
docker build -t uom-mail-ai-chat .
docker run -d --env-file .env uom-mail-ai-chat
```

## Cloud Deployment (Railway)

This application can be easily deployed to Railway, a modern cloud platform. Here's how to deploy it:

1. **Create a Railway Account**

   - Sign up at [Railway](https://railway.com/)
   - Install the Railway CLI (optional but recommended):
     ```bash
     npm i -g @railway/cli
     ```

2. **Deploy from GitHub**

   - Connect your GitHub repository to Railway
   - Railway will automatically detect the Node.js application
   - Configure the following environment variables in Railway's dashboard:
     - `EMAIL_ADDRESS`
     - `APP_PASSWORD`
     - `GEMINI_API_KEY`
     - `GEMINI_MODEL`
     - `EMAIL_POLLING_INTERVAL`
     - `AUTHORIZED_EMAILS`
     - `CC_EMAILS`
     - `COURSE_MATERIAL`

3. **Deploy using Railway CLI**

   ```bash
   # Login to Railway
   railway login

   # Initialize project
   railway init

   # Link to existing project or create new
   railway link

   # Deploy
   railway up
   ```

4. **Important Notes for Railway Deployment**

   - Railway provides a free tier with limited resources
   - The application will automatically restart if it crashes
   - Railway provides built-in logging and monitoring
   - You can set up automatic deployments from your GitHub repository
   - Railway will handle SSL/TLS certificates automatically

5. **Scaling on Railway**
   - The free tier includes 500 hours of usage per month
   - You can upgrade to paid plans for more resources
   - Railway automatically scales based on demand
   - You can set up custom domains for your deployment

## Project Structure

```
├── src/
│   ├── index.js           # Main application entry point
│   ├── config.js          # Configuration management
│   ├── email-capture.js   # Email monitoring logic
│   ├── email-reply-sender.js # Email response handling
│   └── logger.js          # Logging configuration
├── package.json
├── Dockerfile
└── README.md
```

## Dependencies

- `@google/genai`: Google's Gemini AI client
- `imap`: IMAP email protocol support
- `mailparser`: Email parsing utilities
- `nodemailer`: Email sending functionality
- `pino`: Logging library
- `axios`: HTTP client
- `uuid`: UUID generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Author

Vinod Liyanage <vinodsliyanage@gmail.com>
