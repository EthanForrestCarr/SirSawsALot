# SirSawsALot

Full-stack application (Vite + React client and Node/Express server) with PostgreSQL.

## Deploying to Render

This repo includes a `render.yaml` blueprint to deploy the stack to Render:

- Web Service: `sirsawsalot-server` (Node/Express API)
- Web Service: `sirsawsalot-client` (Vite React static site)
- Managed PostgreSQL: `sirsawsalot-db`

Steps:

1. Push your changes to the default branch.
2. In Render, create a new “Blueprint” and point it at this repository.
3. Provide a value for `JWT_SECRET` under the server service during deploy.
4. Deploy. Render will provision the Postgres DB and set `DATABASE_URL` on the server. The client builds with `VITE_API_BASE_URL` pointing to the server URL.

Environment variables:

- Server
	- `DATABASE_URL` (from Render Postgres)
	- `JWT_SECRET` (set a strong secret)
	- `CORS_ORIGINS` (optional, comma-separated allowlist; if omitted in production, all origins are allowed)
- Client
	- `VITE_API_BASE_URL` (automatically set to the server URL in Render)

Local env samples:

- Server: `server/.env.example`
- Client: `client/.env.example`

## Development

- API: `cd server && npm i && npm run dev`
- Client: `cd client && npm i && npm run dev`

Set `VITE_API_BASE_URL=http://localhost:3000` in `client/.env` for local dev.