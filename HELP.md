# InternTrack setup

## Run locally

The backend uses a persistent H2 database by default, so MySQL is not required for local development.

From the project root, start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

In another terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5173`. The API is available at `http://localhost:8080/companies`. H2 data is stored under `data/`.

## Use MySQL locally

Set `SPRING_PROFILES_ACTIVE=mysql` and provide valid MySQL credentials with `DB_USERNAME` and `DB_PASSWORD`. `DB_URL` can override the default JDBC URL (`jdbc:mysql://127.0.0.1:3307/internship_tracker`). Create the database before starting the backend.

For example, in PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:DB_USERNAME = "tracker_user"
$env:DB_PASSWORD = "<your-mysql-password>"
.\mvnw.cmd spring-boot:run
```

To point the frontend at a different API host, set `VITE_API_BASE_URL` before starting Vite.

## Deploy to Render

The root `render.yaml` Blueprint configures the React static site, Spring Boot Docker service, and PostgreSQL database. Create a public GitHub repository containing this project, then in Render choose **New > Blueprint**, connect the repository, and apply the Blueprint.

This Blueprint uses Render's free plans for the API and database to avoid creating paid resources. Free API instances can sleep while idle; free PostgreSQL databases expire after 30 days and are deleted after the grace period unless upgraded. Upgrade the database in Render before expiry to retain company records. No paid resources are created automatically by this project.
