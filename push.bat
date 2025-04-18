@echo off
echo Starting GitHub push script...

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed or not in PATH
    exit /b 1
)

echo Adding all changes...
git add .

echo Enter commit message:
set /p commit_message=

echo Committing changes with message: "%commit_message%"
git commit -m "%commit_message%"

echo Pushing to remote repository...
git push

if %ERRORLEVEL% EQU 0 (
    echo Push completed successfully!
) else (
    echo Push failed. Please check your connection or repository status.
)

echo Done!