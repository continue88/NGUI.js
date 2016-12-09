@echo off
call:combine > ..\src\ngui.js
GOTO:EOF
:combine
echo // autogen by combine tools.
for /f "tokens=*" %%i in (files.txt) do call:print_file "%%i"
GOTO:EOF
:print_file
echo.
echo.
echo //
echo // %1
echo //
type %1
:EOF