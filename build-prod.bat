@echo off
echo ========================================================
echo Building Frontend Production Assets...
echo ========================================================
cd frontend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Frontend build failed!
    exit /b %ERRORLEVEL%
)

echo ========================================================
echo Copying Frontend Assets to Spring Boot resources/static...
echo ========================================================
if exist "..\backend\src\main\resources\static" (
    rmdir /S /Q "..\backend\src\main\resources\static"
)
mkdir "..\backend\src\main\resources\static"
xcopy /E /Y /I dist "..\backend\src\main\resources\static"
if %ERRORLEVEL% neq 0 (
    echo Failed to copy frontend assets to backend!
    exit /b %ERRORLEVEL%
)
cd ..

echo ========================================================
echo Packaging Backend JAR...
echo ========================================================
cd backend
call mvn clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Backend packaging failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo ========================================================
echo Project Compiled Successfully!
echo Final JAR is at: backend\target\builder-0.0.1-SNAPSHOT.jar
echo ========================================================
