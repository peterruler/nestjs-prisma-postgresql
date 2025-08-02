#!/bin/bash
npm i prisma
npx prisma studio
npx prisma db push
npm i @prisma/client
npx prisma generate
npx prisma db push --force-reset
npm i bcryptjs
npm i @types/bcryptjs
npm i jsonwebtoken @types/jsonwebtoken
openssl rand -hex 32

nest g module home
nest g controller home
nest g service home