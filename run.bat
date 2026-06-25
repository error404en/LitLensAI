@echo off
echo Starting LitLens AI Development Environment...

:: Start Next.js Development Server
start "Next.js Server" cmd /c "npm run dev"

:: Start Inngest CLI
start "Inngest Server" cmd /c "npx inngest-cli@latest dev"

echo Both Next.js and Inngest are starting in separate windows.
echo - Next.js will be available at http://localhost:3000
echo - Inngest UI will be available at http://127.0.0.1:8288
