cd admin
cp GlobalVariablesDebug.js app/GlobalVariables.js
sencha app build -te
cd ..

mkdir build
mkdir build/admin
cp -r admin/build/testing/Admin ./build/admin/Admin
cp admin/server.js ./build/admin
cp admin/serv-package.json ./build/admin/package.json
cp -r app ./build/app
cp lerna.json ./build
cp pm-stage.json ./build/pm.json
cp package.json ./build
cp -r packages ./build/packages
cd build
yarn && npx lerna bootstrap
yarn start