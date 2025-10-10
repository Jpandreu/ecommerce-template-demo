@echo off
echo ========================================
echo   EMERGENCY RESTORE SCRIPT
echo   Consolidation Rollback System
echo ========================================
echo.
echo This script will restore ALL files to their 
echo state before JavaScript consolidation.
echo.
echo WARNING: This will OVERWRITE current files!
echo.
pause

echo Restoring JavaScript files...
copy "assets\js\backup-consolidation-20251007-164239\*.js" "assets\js\" /Y

echo Restoring HTML files...  
copy "assets\js\backup-consolidation-20251007-164239\*.html" "." /Y

echo Cleaning up consolidated files...
if exist "assets\js\core-bundle.js" del "assets\js\core-bundle.js"
if exist "assets\js\features-bundle.js" del "assets\js\features-bundle.js"

echo.
echo ========================================
echo   RESTORATION COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo All files have been restored to their
echo original working state.
echo.
pause