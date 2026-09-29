@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

SET ERROR_CODE=0

@REM Set local scope for the variables with windows NT shell
IF "%OS%"=="Windows_NT" @SETLOCAL

@REM ==== START VALIDATION ====
IF NOT "%JAVA_HOME%" == "" GOTO OkJHome

@REM Fallback to 'where java'
FOR /F "tokens=*" %%I IN ('where java 2^>nul') DO (
    SET "JAVA_EXE=%%I"
    GOTO FoundJava
)

ECHO.
ECHO Error: JAVA_HOME is not defined and could not find java.exe in PATH. >&2
ECHO.
GOTO error

:OkJHome
SET "JAVA_EXE=%JAVA_HOME%\bin\java.exe"

IF EXIST "%JAVA_EXE%" GOTO FoundJava

ECHO.
ECHO Error: JAVA_HOME is set to an invalid directory. >&2
ECHO JAVA_HOME = "%JAVA_HOME%" >&2
ECHO Please set the JAVA_HOME variable in your environment to match the >&2
ECHO location of your Java installation. >&2
ECHO.
GOTO error

:FoundJava
SET "DIRNAME=%~dp0"
IF "%DIRNAME%" == "" SET "DIRNAME=.\;%CD%"
SET "BASE_DIR=%DIRNAME%"

@REM Execute Maven Wrapper using PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & '%DIRNAME%.mvn\wrapper\mvnw.ps1' %* }"
SET ERROR_CODE=%ERRORLEVEL%
GOTO end

:error
SET ERROR_CODE=1

:end
@REM End local scope for the variables with windows NT shell
IF "%OS%"=="Windows_NT" @ENDLOCAL

@REM Optional pause the batch file if MAVEN_BATCH_PAUSE is set to 'on'
IF "%MAVEN_BATCH_PAUSE%" == "on" PAUSE

EXIT /B %ERROR_CODE%
