:-------------------------------------
REM  --> Check for permissions
 >nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
 if '%errorlevel%' NEQ '0' (
     echo Requesting administrative privileges...
     goto UACPrompt
 ) else ( goto gotAdmin )

:UACPrompt
     echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
     echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
     exit /B

:gotAdmin
     if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
     pushd "%CD%"
     CD /D "%~dp0"
 :--------------------------------------

W32tm /config /manualpeerlist:time.windows.com /syncfromflags:manual /reliable:yes /update
W32tm /resync /rediscover
Net stop w32time && net start w32time

@echo off
:repeat
Timeout 30 > NUL
W32tm /config /manualpeerlist:time.windows.com /syncfromflags:manual /reliable:yes /update
W32tm /resync /rediscover
Net stop w32time && net start w32time
