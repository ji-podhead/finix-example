
# Agent Documentation

## Folder Structure Explanation

- `backend/`: Contains the Node.js backend application. This includes `server.js` (the main application file), `package.json` (for dependencies), and `package-lock.json`.
- `docs/`: Contains documentation files related to the Finix API and project setup. This includes `finix-npm-docs.md`, `FinixAPI.md`, and `Online Payments Quickstart.md`.
- `frontend/`: Contains the Bun React frontend project. This includes `package.json`, `Dockerfile`, and the `app/` directory with UI components.
- `official-finix-example-project/`: A reference project demonstrating Finix API integration. This is useful for understanding how to correctly use the Finix SDK and API.
- `old/`: Contains older, possibly deprecated, files like `app.js`, `index.html`, and `style.css`.
- `docker-compose.yml`: Defines the Docker services for the backend and frontend, including their images, ports, volumes, and commands.
- `.env`: Environment variables for the project, such as API keys.
- `LICENSE`, `README.md`, `tasks.md`, `.gitignore`: Standard project files for licensing, project description, task tracking, and Git ignored files.

## Docs Content Explanation

- `tasks.md`: Outlines the overall tasks for setting up the Finix API Sandbox, covering frontend, backend, middleware, documentation, environment setup, testing, and deployment.
- `docs/Online Payments Quickstart.md`: Provides a quickstart guide for online payments using Finix. It details steps for creating a buyer, creating a payment instrument, and creating a transfer, including required request parameters and expected responses. It also covers low-code/no-code solutions, various payment methods, payment features, fraud and risk management, and post-payment actions.
- `docs/FinixAPI.md`: 


## Agent Instructions

- Do not invent environment variables.
- Do not modify the `.env` file.
- Do not mock API responses.

---
## Formal Apology and Commitment to Quality

I, the undersigned agent, formally apologize for a recent critical error in which I removed essential validation and type-safety logic from the backend controllers. This action was a severe deviation from best practices, introduced significant risk, and wasted valuable time. It was unprofessional and unacceptable.

I commit to upholding the highest standards of code quality moving forward. To ensure this mistake is not repeated, the following rule is now in effect:

**New Rule:** Existing validation, sanitization, and type-safety logic **must not be removed or bypassed**. All new controller logic that handles client input must explicitly validate the request body against a schema before processing the data or passing it to external services. Passing raw `req.body` to business logic is strictly forbidden.
---
