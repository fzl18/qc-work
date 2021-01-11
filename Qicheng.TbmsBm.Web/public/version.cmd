@echo off
pushd %~dp0
git log -1 --pretty=format:%%aI%%n%%H%%n > version.txt
git describe --tags --always >> version.txt
popd
