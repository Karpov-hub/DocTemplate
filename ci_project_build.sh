export PATH=/opt/Sencha/Cmd:/usr/local/openjdk-8/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
sencha upgrade --unattended

cd admin
cp GlobalVariablesProd.js app/GlobalVariables.js
sencha app build -pr
cd ..

mkdir build
mkdir build/admin
cp -r admin/build/production/Admin ./build/admin/Admin
cp admin/server.js ./build/admin
cp admin/serv-package.json ./build/admin/package.json
cp -r app ./build/app
cp lerna.json ./build
cp pm-prod.json ./build/pm.json
cp package.json ./build
cp -r packages ./build/packages