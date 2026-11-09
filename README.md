# Wanderlust

Wanderlust is a travel discovery and booking web application. Visitors can browse destinations, while registered users can manage bookings and access account features.

## Technology

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS 4
- Better Auth for email and password authentication
- MongoDB
- Express API hosted separately from this frontend

## Requirements

- Node.js compatible with the versions required by Next.js 16
- npm
- MongoDB connection string
- The Wanderlust API server, available in the sibling `wanderlust-server` repository

## Local development

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root and set the variables listed below.

3. Start the API server from the `wanderlust-server` directory:

   ```bash
   npm install
   node index.js
   ```

4. In a separate terminal, start the frontend:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The API is a separate process and is not started by the frontend scripts.

## Environment variables

Set these variables in the local `.env` file and in the deployment platform's environment settings:

| Variable | Description |
| --- | --- |
| `BACKEND_URL` | Base URL of the Express API, for example `http://localhost:5000` locally. Use the deployed API's public HTTPS URL in production. |
| `MONGODB_URL` | MongoDB connection string used by Better Auth. |
| `BETTER_AUTH_SECRET` | Private secret used by Better Auth. Use a long, unique value and keep it out of source control. |
| `BETTER_AUTH_URL` | Base URL of the frontend, such as `http://localhost:3000` locally or the production site URL. |

Do not add secrets to Git. Keep `.env` local and configure production values through the hosting provider.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create an optimized production build. |
| `npm start` | Serve the production build. Run `npm run build` first. |
| `npm run lint` | Run ESLint. |

## Application routes

- `/` — home page and featured destinations
- `/destinations` — destination catalog
- `/destinations/[id]` — destination details
- `/add_destination` — add a destination (requires sign-in)
- `/bookings` — the signed-in user's bookings
- `/profile` — user profile and travel statistics
- `/login` and `/sign-up` — authentication

## Deployment

The frontend and API are deployed separately. To deploy the frontend to Vercel:

1. Import this repository into Vercel and keep the detected Next.js framework settings.
2. Add `BACKEND_URL`, `MONGODB_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` to the Vercel project's environment variables.
3. Set `BACKEND_URL` to the public API origin; do not use `localhost` in production.
4. Deploy the API separately and make sure it can connect to MongoDB.
5. Deploy the frontend and verify sign-up, sign-in, destination reads, and booking flows.

### Deployment checks

- The API verifies Better Auth JWTs using a JWKS URL configured by the backend. Ensure the deployed API can reach the JWKS endpoint for the deployed frontend; a local-only URL such as `http://localhost:3000/api/auth/jwks` will not work from a production API host.
- `add_destination` submits directly from a client component. Next.js does not expose server-only environment variables such as `BACKEND_URL` to browser code. Verify this form in the production deployment; it may need a public client URL configuration or a server-side route.
- Destination read requests must use the authentication format expected by the API. A `401 Unauthorized` response indicates an authentication/configuration mismatch, not necessarily that the API is offline.

## Next.js resources

- [Next.js documentation](https://nextjs.org/docs)
- [Deploying Next.js](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel documentation](https://vercel.com/docs)
