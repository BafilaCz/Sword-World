@echo off
echo Switching package.json...
IF EXIST package.json (
    rename package.json package.default.json
    rename package.local.json package.json
    echo Switched to local version!
) ELSE (
    rename package.default.json package.json
    rename package.json package.local.json
    echo Switched to default version!
)
