# DocTemplate

## Install on local host

Install Redis

```
sudo apt install redis

```

Clone mono repo

```
git clone git@gitlab.com:enovate/tadbox/backend/DocTemplate.git
```

or

```
git clone https://gitlab.com/enovate/tadbox/backend/DocTemplate.git
```

Install yarn

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

```
npm install -g verdaccio
nohup verdaccio &

npm set registry http://localhost:4873/
npm adduser --registry http://localhost:4873
Username: test
Password: test
Email: test@test
```

Install node modules

```
yarn
npx lerna bootstrap
```

Create directories

```
mkdir docs/json
mkdir upload
```

### Requirements

- Node 16.18.0
- Java JDK 8
- Sencha CMD 7
- make, g++
- Docker Minio
- Postgres 11
- Redis

## DB

```
sudo -u postgres psql

create database dtdb;

GRANT ALL PRIVILEGES ON DATABASE "dtdb" to hse;

\c dtdb

CREATE SCHEMA jasper;
```

### Adding a new model

```
npx sequelize-cli model:generate --name <model_name> --attributes id:uuid,lastName:string,email:string
```

then edit model and migration file

Run migration

```
cd packages/db
npx sequelize-cli db:migrate
```

### Adding a seed

```
npx sequelize-cli seed:generate --name demo-user
```

This command will create a seed file in seeders folder. File name will look something like XXXXXXXXXXXXXX-demo-user.js. It follows the same up / down semantics as the migration files.

Now we should edit this file to insert demo user to User table.

```javascript
"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "demo@demo.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
```

Run seeds

```
cd packages/db
npx sequelize-cli db:seed:all
```

## If you have errors when building the admin panel, run these commands

```
wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/openssl_1.1.1f-1ubuntu2.16_amd64.deb
wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl-dev_1.1.1f-1ubuntu2.16_amd64.deb
wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb

sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
sudo dpkg -i libssl-dev_1.1.1f-1ubuntu2.16_amd64.deb
sudo dpkg -i openssl_1.1.1f-1ubuntu2.16_amd64.deb
```
