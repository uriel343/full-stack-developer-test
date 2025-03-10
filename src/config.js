"use strict";
const MONGO_DB_URL =
  process.env.MONGO_DB_URL || "mongodb://localhost:27017/parking";
const HOST_URL = process.env.HOST_URL || "http://localhost";
const PORT = process.env.PORT || 3000;
const SECRET_PASS = process.env.SECRET_PASS || 'SECRET_PASSWORD'

module.exports = {
  MONGO_DB_URL,
  HOST_URL,
  PORT,
  SECRET_PASS
};
