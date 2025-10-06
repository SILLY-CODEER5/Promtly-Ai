# Promptly - AI Prompt Sharing Platform

Promptly is a full-stack web application built with the Next.js, React, and Tailwind CSS that allows users to discover, create, and share useful and creative prompts for AI models.

## Live Demo

**[Insert Your Live Demo Link Here]**

## Features

* **Discover Prompts:** A public feed where users can browse and search for prompts created by the community.
* **User Authentication:** Secure sign-up and login functionality using Google OAuth provided by NextAuth.js.
* **Create & Manage Prompts:** Authenticated users can create, edit, and delete their own prompts.
* **User Profiles:** View a specific user's profile and see all the prompts they have created.
* **Tag-Based Searching:** Click on a prompt's tag to see all related prompts.
* **Copy to Clipboard:** Easily copy any prompt with a single click.
* **Responsive Design:** A clean and modern UI that works seamlessly across all devices, built with Tailwind CSS.

## Technical Stack

* **Framework:** Next.js 13+ (App Router)
* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js (via Next.js API Routes)
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** NextAuth.js

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* Node.js (v18.x or later)
* npm / yarn / pnpm
* MongoDB instance (local or cloud-based via MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/SILLY-CODEER5/Promtly-Ai.git](https://github.com/SILLY-CODEER5/Promtly-Ai.git)
    cd Promtly-Ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the following variables. You will need to get the `GOOGLE_ID`, `GOOGLE_CLIENT_SECRET` from the Google Cloud Console and your `MONGODB_URI` from your MongoDB instance.

    ```
    GOOGLE_ID=
    GOOGLE_CLIENT_SECRET=
    MONGODB_URI=
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET= # Generate a secret: `openssl rand -base64 32`
    ```

### Running the Application

Start the development server:
```bash
npm run dev
