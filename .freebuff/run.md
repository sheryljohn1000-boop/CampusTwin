# CampusTwin — how to run

## Reproduce the artifacts a fresh checkout needs

1. Copy env files from the main checkout (never symlink):
   - None required. This project has no `.env*` files; Vite config holds the port.
2. Install dependencies with the project's package manager (npm, per `package-lock.json`):
   ```
   npm ci
   ```
   (Use `npm install` if `npm ci` is unavailable.)

## Run the dev server

```
npm run dev
```

- Vite dev server, configured in `vite.config.ts`: **port 3000**, `host: true`.
- If port 3000 is taken, pass `--port <free-port>`: `npm run dev -- --port 3001`.
- Ready when the log prints `➜  Local: http://localhost:3000/` and `http://localhost:3000/` answers 200.

### Detached start (Windows, survives the conversation)

```
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

- stdout and stderr must be DIFFERENT files (PowerShell fails if both point to one path).
- Confirm survival: `powershell -NoProfile -Command "Get-Process -Id <pid>"`, then curl the URL.

## Verify

- Open `http://localhost:3000/` — should show "TP1 Smart Building Twin" with live simulated sensor data.
- Sidebar nav (Overview / Ground Floor / Cafeteria / Alerts / Insights) switches views without a reload.
- The header weather calls `https://api.open-meteo.com` — needs internet; app still runs without it.
