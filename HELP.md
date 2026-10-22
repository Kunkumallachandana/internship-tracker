# InternTrack setup

For local setup and deployment, see [README.md](./README.md).

## Local MySQL profile

The default local profile uses persistent H2, so MySQL is not required. To use MySQL instead, set `SPRING_PROFILES_ACTIVE=mysql` and provide valid credentials with `DB_USERNAME` and `DB_PASSWORD`. `DB_URL` can override `jdbc:mysql://127.0.0.1:3307/internship_tracker`. Create the database before starting the backend.

```powershell
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:DB_USERNAME = "tracker_user"
$env:DB_PASSWORD = "<your-mysql-password>"
.\mvnw.cmd spring-boot:run
```

The frontend uses `VITE_API_BASE_URL` to select the API base URL; it defaults to `http://localhost:8080`.
