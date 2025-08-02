#!/bin/bash
nest g module user
nest g controller auth user
nest g service auth user
npm i class-validator class-transformer
npm i @nestjs/passport passport passport-local
npm i @nestjs/jwt passport-jwt
npm i bcrypt
npm i @nestjs/config
npm i @nestjs/typeorm typeorm pg
nest g module prisma
nest g service prisma
npm install @prisma/client