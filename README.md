# InternTrack

A full-stack internship application tracker built with React, Spring Boot, and PostgreSQL.

## Run locally

Start the Spring Boot API from the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

In another terminal, start the React frontend:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:5173`. The API is available at `http://localhost:8080/companies`. Local development uses a persistent H2 database under `data/`.

## Deploy

Deploy the frontend to Vercel and the Spring Boot API and PostgreSQL database to Railway. Vercel serves the React/Vite frontend; it does not run this Spring Boot backend.

### 1. Deploy the backend and database to Railway

1. Sign in at [Railway](https://railway.com/) and create a project.
2. Add a PostgreSQL database to the project.
3. Add a service from the GitHub repository `Kunkumallachandana/internship-tracker`. Railway detects the root `Dockerfile` and builds the Spring Boot API.
4. In the API service variables, set `SPRING_PROFILES_ACTIVE=postgres` and add these references to the PostgreSQL service's generated variables:

   ```text
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   ```

   Replace `Postgres` with the exact name of your Railway database service if it differs.
5. Deploy the API and enable public HTTP networking for it. Copy its public base URL (for example, `https://your-api.up.railway.app`), without a trailing slash or `/companies`.

### 2. Deploy the frontend to Vercel

1. Sign in at [Vercel](https://vercel.com/) and import `Kunkumallachandana/internship-tracker` from GitHub.
2. Set the **Root Directory** to `frontend`.
3. Use the Vite defaults: build command `npm run build` and output directory `dist`.
4. Add the environment variable `VITE_API_BASE_URL` with the Railway API base URL from step 1.
5. Deploy and copy the Vercel production URL.

### 3. Allow the Vercel site to call the API

In the Railway API service variables, set `FRONTEND_ORIGIN` to the exact Vercel production origin, for example `https://your-project.vercel.app` (no trailing slash), then redeploy the API.

Verify the deployment by opening the Vercel URL, saving a test company, refreshing the page, and confirming it remains listed. The API endpoint is `<Railway API URL>/companies`.

Review the current pricing and data-retention terms for both providers before creating resources. No hosted services or paid resources are created by this repository.
