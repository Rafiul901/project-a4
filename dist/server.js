
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    

// src/server.ts
import dotenv from "dotenv";

// src/app.ts
import express2 from "express";
import cors from "cors";

// src/routes/index.ts
import { Router as Router8 } from "express";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/modules/auth/auth.validation.ts
import { z } from "zod";
var registerSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["TENANT", "LANDLORD"])
  })
});
var loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const data = req.method === "GET" ? { query: req.query } : { body: req.body };
      schema.parse(data);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors?.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
    }
  };
};
var validateRequest_default = validateRequest;

// src/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
var catchAsync_default = catchAsync;

// src/config/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Category {\n  id   String @id @default(cuid())\n  name String @unique\n\n  properties Property[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name])\n}\n\nenum Role {\n  TENANT\n  LANDLORD\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum RentalStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  ACTIVE\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\nmodel Payment {\n  id String @id @default(cuid())\n\n  rentalRequestId String        @unique\n  rentalRequest   RentalRequest @relation(fields: [rentalRequestId], references: [id], onDelete: Cascade)\n\n  amount        Float\n  provider      PaymentProvider\n  transactionId String          @unique\n  status        PaymentStatus   @default(PENDING)\n  paidAt        DateTime?\n\n  createdAt DateTime @default(now())\n\n  @@index([rentalRequestId])\n  @@index([transactionId])\n  @@index([status])\n  @@index([provider])\n}\n\nmodel Property {\n  id          String   @id @default(cuid())\n  title       String\n  description String\n  price       Float\n  location    String\n  amenities   String[]\n  available   Boolean  @default(true)\n\n  landlordId String\n  landlord   User   @relation(fields: [landlordId], references: [id], onDelete: Cascade)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  rentals RentalRequest[]\n  reviews Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([landlordId])\n  @@index([categoryId])\n  @@index([available])\n  @@index([price])\n  @@index([location])\n}\n\nmodel RentalRequest {\n  id String @id @default(cuid())\n\n  tenantId String\n  tenant   User   @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  propertyId String\n  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n\n  status     RentalStatus @default(PENDING)\n  moveInDate DateTime\n\n  payment Payment?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([tenantId])\n  @@index([propertyId])\n  @@index([status])\n  @@index([moveInDate])\n}\n\n// ============================================\n// REVIEW MODEL\n// ============================================\n\nmodel Review {\n  id      String @id @default(cuid())\n  rating  Int\n  comment String\n\n  tenantId String\n  tenant   User   @relation(fields: [tenantId], references: [id], onDelete: Cascade)\n\n  propertyId String\n  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@unique([tenantId, propertyId])\n  @@index([tenantId])\n  @@index([propertyId])\n  @@index([rating])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id       String @id @default(cuid())\n  name     String\n  email    String @unique\n  password String\n\n  role   Role\n  status UserStatus @default(ACTIVE)\n\n  properties Property[]\n  rentals    RentalRequest[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([email])\n  @@index([role])\n  @@index([status])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"properties","kind":"object","type":"Property","relationName":"CategoryToProperty"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rentalRequestId","kind":"scalar","type":"String"},{"name":"rentalRequest","kind":"object","type":"RentalRequest","relationName":"PaymentToRentalRequest"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Property":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"location","kind":"scalar","type":"String"},{"name":"amenities","kind":"scalar","type":"String"},{"name":"available","kind":"scalar","type":"Boolean"},{"name":"landlordId","kind":"scalar","type":"String"},{"name":"landlord","kind":"object","type":"User","relationName":"PropertyToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProperty"},{"name":"rentals","kind":"object","type":"RentalRequest","relationName":"PropertyToRentalRequest"},{"name":"reviews","kind":"object","type":"Review","relationName":"PropertyToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"RentalRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"tenant","kind":"object","type":"User","relationName":"RentalRequestToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToRentalRequest"},{"name":"status","kind":"enum","type":"RentalStatus"},{"name":"moveInDate","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToRentalRequest"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"tenantId","kind":"scalar","type":"String"},{"name":"tenant","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"propertyId","kind":"scalar","type":"String"},{"name":"property","kind":"object","type":"Property","relationName":"PropertyToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"properties","kind":"object","type":"Property","relationName":"PropertyToUser"},{"name":"rentals","kind":"object","type":"RentalRequest","relationName":"RentalRequestToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","properties","tenant","property","rentalRequest","payment","rentals","reviews","_count","landlord","category","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","data","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","create","update","Category.upsertOne","Category.deleteOne","Category.deleteMany","having","_min","_max","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","Property.findUnique","Property.findUniqueOrThrow","Property.findFirst","Property.findFirstOrThrow","Property.findMany","Property.createOne","Property.createMany","Property.createManyAndReturn","Property.updateOne","Property.updateMany","Property.updateManyAndReturn","Property.upsertOne","Property.deleteOne","Property.deleteMany","Property.groupBy","Property.aggregate","RentalRequest.findUnique","RentalRequest.findUniqueOrThrow","RentalRequest.findFirst","RentalRequest.findFirstOrThrow","RentalRequest.findMany","RentalRequest.createOne","RentalRequest.createMany","RentalRequest.createManyAndReturn","RentalRequest.updateOne","RentalRequest.updateMany","RentalRequest.updateManyAndReturn","RentalRequest.upsertOne","RentalRequest.deleteOne","RentalRequest.deleteMany","RentalRequest.groupBy","RentalRequest.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","Role","role","UserStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","rating","comment","tenantId","propertyId","RentalStatus","moveInDate","title","description","price","location","amenities","available","landlordId","categoryId","has","hasEvery","hasSome","rentalRequestId","amount","PaymentProvider","provider","transactionId","PaymentStatus","paidAt","tenantId_propertyId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "nQM6YAgDAAC3AQAgdQAA2wEAMHYAABsAEHcAANsBADB4AQAAAAF5AQAAAAGAAUAAtgEAIYEBQAC2AQAhAQAAAAEAIBIIAAC4AQAgCQAAuQEAIAsAAN8BACAMAADmAQAgdQAA5AEAMHYAAAMAEHcAAOQBADB4AQCzAQAhgAFAALYBACGBAUAAtgEAIZYBAQCzAQAhlwEBALMBACGYAQgA1QEAIZkBAQCzAQAhmgEAAMQBACCbASAA5QEAIZwBAQCzAQAhnQEBALMBACEECAAAyQIAIAkAAMoCACALAADxAgAgDAAA9AIAIBIIAAC4AQAgCQAAuQEAIAsAAN8BACAMAADmAQAgdQAA5AEAMHYAAAMAEHcAAOQBADB4AQAAAAGAAUAAtgEAIYEBQAC2AQAhlgEBALMBACGXAQEAswEAIZgBCADVAQAhmQEBALMBACGaAQAAxAEAIJsBIADlAQAhnAEBALMBACGdAQEAswEAIQMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgDQQAAN8BACAFAADgAQAgBwAA4wEAIHUAAOEBADB2AAAIABB3AADhAQAweAEAswEAIX8AAOIBlQEigAFAALYBACGBAUAAtgEAIZIBAQCzAQAhkwEBALMBACGVAUAAtgEAIQMEAADxAgAgBQAA8gIAIAcAAPMCACANBAAA3wEAIAUAAOABACAHAADjAQAgdQAA4QEAMHYAAAgAEHcAAOEBADB4AQAAAAF_AADiAZUBIoABQAC2AQAhgQFAALYBACGSAQEAswEAIZMBAQCzAQAhlQFAALYBACEDAAAACAAgAQAACQAwAgAACgAgDAYAANkBACB1AADUAQAwdgAADAAQdwAA1AEAMHgBALMBACF_AADXAacBIoABQAC2AQAhoQEBALMBACGiAQgA1QEAIaQBAADWAaQBIqUBAQCzAQAhpwFAANgBACEBAAAADAAgCwQAAN8BACAFAADgAQAgdQAA3QEAMHYAAA4AEHcAAN0BADB4AQCzAQAhgAFAALYBACGQAQIA3gEAIZEBAQCzAQAhkgEBALMBACGTAQEAswEAIQIEAADxAgAgBQAA8gIAIAwEAADfAQAgBQAA4AEAIHUAAN0BADB2AAAOABB3AADdAQAweAEAAAABgAFAALYBACGQAQIA3gEAIZEBAQCzAQAhkgEBALMBACGTAQEAswEAIagBAADcAQAgAwAAAA4AIAEAAA8AMAIAABAAIAEAAAADACABAAAACAAgAQAAAA4AIAMAAAAIACABAAAJADACAAAKACADAAAADgAgAQAADwAwAgAAEAAgAQAAAAgAIAEAAAAOACABAAAAAwAgAQAAAAEAIAgDAAC3AQAgdQAA2wEAMHYAABsAEHcAANsBADB4AQCzAQAheQEAswEAIYABQAC2AQAhgQFAALYBACEBAwAAyAIAIAMAAAAbACABAAAcADACAAABACADAAAAGwAgAQAAHAAwAgAAAQAgAwAAABsAIAEAABwAMAIAAAEAIAUDAADwAgAgeAEAAAABeQEAAAABgAFAAAAAAYEBQAAAAAEBEgAAIAAgBHgBAAAAAXkBAAAAAYABQAAAAAGBAUAAAAABARIAACIAMAESAAAiADAFAwAA5gIAIHgBAOoBACF5AQDqAQAhgAFAAO0BACGBAUAA7QEAIQIAAAABACASAAAlACAEeAEA6gEAIXkBAOoBACGAAUAA7QEAIYEBQADtAQAhAgAAABsAIBIAACcAIAIAAAAbACASAAAnACADAAAAAQAgGQAAIAAgGgAAJQAgAQAAAAEAIAEAAAAbACADCgAA4wIAIB8AAOUCACAgAADkAgAgB3UAANoBADB2AAAuABB3AADaAQAweAEApQEAIXkBAKUBACGAAUAAqAEAIYEBQACoAQAhAwAAABsAIAEAAC0AMB4AAC4AIAMAAAAbACABAAAcADACAAABACAMBgAA2QEAIHUAANQBADB2AAAMABB3AADUAQAweAEAAAABfwAA1wGnASKAAUAAtgEAIaEBAQAAAAGiAQgA1QEAIaQBAADWAaQBIqUBAQAAAAGnAUAA2AEAIQEAAAAxACABAAAAMQAgAgYAAOICACCnAQAA2gIAIAMAAAAMACABAAA0ADACAAAxACADAAAADAAgAQAANAAwAgAAMQAgAwAAAAwAIAEAADQAMAIAADEAIAkGAADhAgAgeAEAAAABfwAAAKcBAoABQAAAAAGhAQEAAAABogEIAAAAAaQBAAAApAECpQEBAAAAAacBQAAAAAEBEgAAOAAgCHgBAAAAAX8AAACnAQKAAUAAAAABoQEBAAAAAaIBCAAAAAGkAQAAAKQBAqUBAQAAAAGnAUAAAAABARIAADoAMAESAAA6ADAJBgAA4AIAIHgBAOoBACF_AACVAqcBIoABQADtAQAhoQEBAOoBACGiAQgAkwIAIaQBAACUAqQBIqUBAQDqAQAhpwFAAJYCACECAAAAMQAgEgAAPQAgCHgBAOoBACF_AACVAqcBIoABQADtAQAhoQEBAOoBACGiAQgAkwIAIaQBAACUAqQBIqUBAQDqAQAhpwFAAJYCACECAAAADAAgEgAAPwAgAgAAAAwAIBIAAD8AIAMAAAAxACAZAAA4ACAaAAA9ACABAAAAMQAgAQAAAAwAIAYKAADbAgAgHwAA3gIAICAAAN0CACAxAADcAgAgMgAA3wIAIKcBAADaAgAgC3UAAMkBADB2AABGABB3AADJAQAweAEApQEAIX8AAMsBpwEigAFAAKgBACGhAQEApQEAIaIBCADDAQAhpAEAAMoBpAEipQEBAKUBACGnAUAAzAEAIQMAAAAMACABAABFADAeAABGACADAAAADAAgAQAANAAwAgAAMQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAPCAAAwwIAIAkAAMQCACALAADZAgAgDAAAwgIAIHgBAAAAAYABQAAAAAGBAUAAAAABlgEBAAAAAZcBAQAAAAGYAQgAAAABmQEBAAAAAZoBAADBAgAgmwEgAAAAAZwBAQAAAAGdAQEAAAABARIAAE4AIAt4AQAAAAGAAUAAAAABgQFAAAAAAZYBAQAAAAGXAQEAAAABmAEIAAAAAZkBAQAAAAGaAQAAwQIAIJsBIAAAAAGcAQEAAAABnQEBAAAAAQESAABQADABEgAAUAAwDwgAAKgCACAJAACpAgAgCwAA2AIAIAwAAKcCACB4AQDqAQAhgAFAAO0BACGBAUAA7QEAIZYBAQDqAQAhlwEBAOoBACGYAQgAkwIAIZkBAQDqAQAhmgEAAKQCACCbASAApQIAIZwBAQDqAQAhnQEBAOoBACECAAAABQAgEgAAUwAgC3gBAOoBACGAAUAA7QEAIYEBQADtAQAhlgEBAOoBACGXAQEA6gEAIZgBCACTAgAhmQEBAOoBACGaAQAApAIAIJsBIAClAgAhnAEBAOoBACGdAQEA6gEAIQIAAAADACASAABVACACAAAAAwAgEgAAVQAgAwAAAAUAIBkAAE4AIBoAAFMAIAEAAAAFACABAAAAAwAgBQoAANMCACAfAADWAgAgIAAA1QIAIDEAANQCACAyAADXAgAgDnUAAMIBADB2AABcABB3AADCAQAweAEApQEAIYABQACoAQAhgQFAAKgBACGWAQEApQEAIZcBAQClAQAhmAEIAMMBACGZAQEApQEAIZoBAADEAQAgmwEgAMUBACGcAQEApQEAIZ0BAQClAQAhAwAAAAMAIAEAAFsAMB4AAFwAIAMAAAADACABAAAEADACAAAFACABAAAACgAgAQAAAAoAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAoEAAC_AgAgBQAAmAIAIAcAAJkCACB4AQAAAAF_AAAAlQECgAFAAAAAAYEBQAAAAAGSAQEAAAABkwEBAAAAAZUBQAAAAAEBEgAAZAAgB3gBAAAAAX8AAACVAQKAAUAAAAABgQFAAAAAAZIBAQAAAAGTAQEAAAABlQFAAAAAAQESAABmADABEgAAZgAwCgQAAL0CACAFAACMAgAgBwAAjQIAIHgBAOoBACF_AACKApUBIoABQADtAQAhgQFAAO0BACGSAQEA6gEAIZMBAQDqAQAhlQFAAO0BACECAAAACgAgEgAAaQAgB3gBAOoBACF_AACKApUBIoABQADtAQAhgQFAAO0BACGSAQEA6gEAIZMBAQDqAQAhlQFAAO0BACECAAAACAAgEgAAawAgAgAAAAgAIBIAAGsAIAMAAAAKACAZAABkACAaAABpACABAAAACgAgAQAAAAgAIAMKAADQAgAgHwAA0gIAICAAANECACAKdQAAvgEAMHYAAHIAEHcAAL4BADB4AQClAQAhfwAAvwGVASKAAUAAqAEAIYEBQACoAQAhkgEBAKUBACGTAQEApQEAIZUBQACoAQAhAwAAAAgAIAEAAHEAMB4AAHIAIAMAAAAIACABAAAJADACAAAKACABAAAAEAAgAQAAABAAIAMAAAAOACABAAAPADACAAAQACADAAAADgAgAQAADwAwAgAAEAAgAwAAAA4AIAEAAA8AMAIAABAAIAgEAAC0AgAgBQAA_wEAIHgBAAAAAYABQAAAAAGQAQIAAAABkQEBAAAAAZIBAQAAAAGTAQEAAAABARIAAHoAIAZ4AQAAAAGAAUAAAAABkAECAAAAAZEBAQAAAAGSAQEAAAABkwEBAAAAAQESAAB8ADABEgAAfAAwCAQAALICACAFAAD9AQAgeAEA6gEAIYABQADtAQAhkAECAPsBACGRAQEA6gEAIZIBAQDqAQAhkwEBAOoBACECAAAAEAAgEgAAfwAgBngBAOoBACGAAUAA7QEAIZABAgD7AQAhkQEBAOoBACGSAQEA6gEAIZMBAQDqAQAhAgAAAA4AIBIAAIEBACACAAAADgAgEgAAgQEAIAMAAAAQACAZAAB6ACAaAAB_ACABAAAAEAAgAQAAAA4AIAUKAADLAgAgHwAAzgIAICAAAM0CACAxAADMAgAgMgAAzwIAIAl1AAC6AQAwdgAAiAEAEHcAALoBADB4AQClAQAhgAFAAKgBACGQAQIAuwEAIZEBAQClAQAhkgEBAKUBACGTAQEApQEAIQMAAAAOACABAACHAQAwHgAAiAEAIAMAAAAOACABAAAPADACAAAQACAOAwAAtwEAIAgAALgBACAJAAC5AQAgdQAAsgEAMHYAAI4BABB3AACyAQAweAEAAAABeQEAswEAIXoBAAAAAXsBALMBACF9AAC0AX0ifwAAtQF_IoABQAC2AQAhgQFAALYBACEBAAAAiwEAIAEAAACLAQAgDgMAALcBACAIAAC4AQAgCQAAuQEAIHUAALIBADB2AACOAQAQdwAAsgEAMHgBALMBACF5AQCzAQAhegEAswEAIXsBALMBACF9AAC0AX0ifwAAtQF_IoABQAC2AQAhgQFAALYBACEDAwAAyAIAIAgAAMkCACAJAADKAgAgAwAAAI4BACABAACPAQAwAgAAiwEAIAMAAACOAQAgAQAAjwEAMAIAAIsBACADAAAAjgEAIAEAAI8BADACAACLAQAgCwMAAMUCACAIAADGAgAgCQAAxwIAIHgBAAAAAXkBAAAAAXoBAAAAAXsBAAAAAX0AAAB9An8AAAB_AoABQAAAAAGBAUAAAAABARIAAJMBACAIeAEAAAABeQEAAAABegEAAAABewEAAAABfQAAAH0CfwAAAH8CgAFAAAAAAYEBQAAAAAEBEgAAlQEAMAESAACVAQAwCwMAAO4BACAIAADvAQAgCQAA8AEAIHgBAOoBACF5AQDqAQAhegEA6gEAIXsBAOoBACF9AADrAX0ifwAA7AF_IoABQADtAQAhgQFAAO0BACECAAAAiwEAIBIAAJgBACAIeAEA6gEAIXkBAOoBACF6AQDqAQAhewEA6gEAIX0AAOsBfSJ_AADsAX8igAFAAO0BACGBAUAA7QEAIQIAAACOAQAgEgAAmgEAIAIAAACOAQAgEgAAmgEAIAMAAACLAQAgGQAAkwEAIBoAAJgBACABAAAAiwEAIAEAAACOAQAgAwoAAOcBACAfAADpAQAgIAAA6AEAIAt1AACkAQAwdgAAoQEAEHcAAKQBADB4AQClAQAheQEApQEAIXoBAKUBACF7AQClAQAhfQAApgF9In8AAKcBfyKAAUAAqAEAIYEBQACoAQAhAwAAAI4BACABAACgAQAwHgAAoQEAIAMAAACOAQAgAQAAjwEAMAIAAIsBACALdQAApAEAMHYAAKEBABB3AACkAQAweAEApQEAIXkBAKUBACF6AQClAQAhewEApQEAIX0AAKYBfSJ_AACnAX8igAFAAKgBACGBAUAAqAEAIQ4KAACqAQAgHwAAsQEAICAAALEBACCCAQEAAAABgwEBAAAABIQBAQAAAASFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAAAABiQEBALABACGKAQEAAAABiwEBAAAAAYwBAQAAAAEHCgAAqgEAIB8AAK8BACAgAACvAQAgggEAAAB9AoMBAAAAfQiEAQAAAH0IiQEAAK4BfSIHCgAAqgEAIB8AAK0BACAgAACtAQAgggEAAAB_AoMBAAAAfwiEAQAAAH8IiQEAAKwBfyILCgAAqgEAIB8AAKsBACAgAACrAQAgggFAAAAAAYMBQAAAAASEAUAAAAAEhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAAAAAYkBQACpAQAhCwoAAKoBACAfAACrAQAgIAAAqwEAIIIBQAAAAAGDAUAAAAAEhAFAAAAABIUBQAAAAAGGAUAAAAABhwFAAAAAAYgBQAAAAAGJAUAAqQEAIQiCAQIAAAABgwECAAAABIQBAgAAAASFAQIAAAABhgECAAAAAYcBAgAAAAGIAQIAAAABiQECAKoBACEIggFAAAAAAYMBQAAAAASEAUAAAAAEhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAAAAAYkBQACrAQAhBwoAAKoBACAfAACtAQAgIAAArQEAIIIBAAAAfwKDAQAAAH8IhAEAAAB_CIkBAACsAX8iBIIBAAAAfwKDAQAAAH8IhAEAAAB_CIkBAACtAX8iBwoAAKoBACAfAACvAQAgIAAArwEAIIIBAAAAfQKDAQAAAH0IhAEAAAB9CIkBAACuAX0iBIIBAAAAfQKDAQAAAH0IhAEAAAB9CIkBAACvAX0iDgoAAKoBACAfAACxAQAgIAAAsQEAIIIBAQAAAAGDAQEAAAAEhAEBAAAABIUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAGJAQEAsAEAIYoBAQAAAAGLAQEAAAABjAEBAAAAAQuCAQEAAAABgwEBAAAABIQBAQAAAASFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAAAABiQEBALEBACGKAQEAAAABiwEBAAAAAYwBAQAAAAEOAwAAtwEAIAgAALgBACAJAAC5AQAgdQAAsgEAMHYAAI4BABB3AACyAQAweAEAswEAIXkBALMBACF6AQCzAQAhewEAswEAIX0AALQBfSJ_AAC1AX8igAFAALYBACGBAUAAtgEAIQuCAQEAAAABgwEBAAAABIQBAQAAAASFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAAAABiQEBALEBACGKAQEAAAABiwEBAAAAAYwBAQAAAAEEggEAAAB9AoMBAAAAfQiEAQAAAH0IiQEAAK8BfSIEggEAAAB_AoMBAAAAfwiEAQAAAH8IiQEAAK0BfyIIggFAAAAAAYMBQAAAAASEAUAAAAAEhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAAAAAYkBQACrAQAhA40BAAADACCOAQAAAwAgjwEAAAMAIAONAQAACAAgjgEAAAgAII8BAAAIACADjQEAAA4AII4BAAAOACCPAQAADgAgCXUAALoBADB2AACIAQAQdwAAugEAMHgBAKUBACGAAUAAqAEAIZABAgC7AQAhkQEBAKUBACGSAQEApQEAIZMBAQClAQAhDQoAAKoBACAfAACqAQAgIAAAqgEAIDEAAL0BACAyAACqAQAgggECAAAAAYMBAgAAAASEAQIAAAAEhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAAAAAYkBAgC8AQAhDQoAAKoBACAfAACqAQAgIAAAqgEAIDEAAL0BACAyAACqAQAgggECAAAAAYMBAgAAAASEAQIAAAAEhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAAAAAYkBAgC8AQAhCIIBCAAAAAGDAQgAAAAEhAEIAAAABIUBCAAAAAGGAQgAAAABhwEIAAAAAYgBCAAAAAGJAQgAvQEAIQp1AAC-AQAwdgAAcgAQdwAAvgEAMHgBAKUBACF_AAC_AZUBIoABQACoAQAhgQFAAKgBACGSAQEApQEAIZMBAQClAQAhlQFAAKgBACEHCgAAqgEAIB8AAMEBACAgAADBAQAgggEAAACVAQKDAQAAAJUBCIQBAAAAlQEIiQEAAMABlQEiBwoAAKoBACAfAADBAQAgIAAAwQEAIIIBAAAAlQECgwEAAACVAQiEAQAAAJUBCIkBAADAAZUBIgSCAQAAAJUBAoMBAAAAlQEIhAEAAACVAQiJAQAAwQGVASIOdQAAwgEAMHYAAFwAEHcAAMIBADB4AQClAQAhgAFAAKgBACGBAUAAqAEAIZYBAQClAQAhlwEBAKUBACGYAQgAwwEAIZkBAQClAQAhmgEAAMQBACCbASAAxQEAIZwBAQClAQAhnQEBAKUBACENCgAAqgEAIB8AAL0BACAgAAC9AQAgMQAAvQEAIDIAAL0BACCCAQgAAAABgwEIAAAABIQBCAAAAASFAQgAAAABhgEIAAAAAYcBCAAAAAGIAQgAAAABiQEIAMgBACEEggEBAAAABZ4BAQAAAAGfAQEAAAAEoAEBAAAABAUKAACqAQAgHwAAxwEAICAAAMcBACCCASAAAAABiQEgAMYBACEFCgAAqgEAIB8AAMcBACAgAADHAQAgggEgAAAAAYkBIADGAQAhAoIBIAAAAAGJASAAxwEAIQ0KAACqAQAgHwAAvQEAICAAAL0BACAxAAC9AQAgMgAAvQEAIIIBCAAAAAGDAQgAAAAEhAEIAAAABIUBCAAAAAGGAQgAAAABhwEIAAAAAYgBCAAAAAGJAQgAyAEAIQt1AADJAQAwdgAARgAQdwAAyQEAMHgBAKUBACF_AADLAacBIoABQACoAQAhoQEBAKUBACGiAQgAwwEAIaQBAADKAaQBIqUBAQClAQAhpwFAAMwBACEHCgAAqgEAIB8AANMBACAgAADTAQAgggEAAACkAQKDAQAAAKQBCIQBAAAApAEIiQEAANIBpAEiBwoAAKoBACAfAADRAQAgIAAA0QEAIIIBAAAApwECgwEAAACnAQiEAQAAAKcBCIkBAADQAacBIgsKAADOAQAgHwAAzwEAICAAAM8BACCCAUAAAAABgwFAAAAABYQBQAAAAAWFAUAAAAABhgFAAAAAAYcBQAAAAAGIAUAAAAABiQFAAM0BACELCgAAzgEAIB8AAM8BACAgAADPAQAgggFAAAAAAYMBQAAAAAWEAUAAAAAFhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAAAAAYkBQADNAQAhCIIBAgAAAAGDAQIAAAAFhAECAAAABYUBAgAAAAGGAQIAAAABhwECAAAAAYgBAgAAAAGJAQIAzgEAIQiCAUAAAAABgwFAAAAABYQBQAAAAAWFAUAAAAABhgFAAAAAAYcBQAAAAAGIAUAAAAABiQFAAM8BACEHCgAAqgEAIB8AANEBACAgAADRAQAgggEAAACnAQKDAQAAAKcBCIQBAAAApwEIiQEAANABpwEiBIIBAAAApwECgwEAAACnAQiEAQAAAKcBCIkBAADRAacBIgcKAACqAQAgHwAA0wEAICAAANMBACCCAQAAAKQBAoMBAAAApAEIhAEAAACkAQiJAQAA0gGkASIEggEAAACkAQKDAQAAAKQBCIQBAAAApAEIiQEAANMBpAEiDAYAANkBACB1AADUAQAwdgAADAAQdwAA1AEAMHgBALMBACF_AADXAacBIoABQAC2AQAhoQEBALMBACGiAQgA1QEAIaQBAADWAaQBIqUBAQCzAQAhpwFAANgBACEIggEIAAAAAYMBCAAAAASEAQgAAAAEhQEIAAAAAYYBCAAAAAGHAQgAAAABiAEIAAAAAYkBCAC9AQAhBIIBAAAApAECgwEAAACkAQiEAQAAAKQBCIkBAADTAaQBIgSCAQAAAKcBAoMBAAAApwEIhAEAAACnAQiJAQAA0QGnASIIggFAAAAAAYMBQAAAAAWEAUAAAAAFhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAAAAAYkBQADPAQAhDwQAAN8BACAFAADgAQAgBwAA4wEAIHUAAOEBADB2AAAIABB3AADhAQAweAEAswEAIX8AAOIBlQEigAFAALYBACGBAUAAtgEAIZIBAQCzAQAhkwEBALMBACGVAUAAtgEAIakBAAAIACCqAQAACAAgB3UAANoBADB2AAAuABB3AADaAQAweAEApQEAIXkBAKUBACGAAUAAqAEAIYEBQACoAQAhCAMAALcBACB1AADbAQAwdgAAGwAQdwAA2wEAMHgBALMBACF5AQCzAQAhgAFAALYBACGBAUAAtgEAIQKSAQEAAAABkwEBAAAAAQsEAADfAQAgBQAA4AEAIHUAAN0BADB2AAAOABB3AADdAQAweAEAswEAIYABQAC2AQAhkAECAN4BACGRAQEAswEAIZIBAQCzAQAhkwEBALMBACEIggECAAAAAYMBAgAAAASEAQIAAAAEhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAAAAAYkBAgCqAQAhEAMAALcBACAIAAC4AQAgCQAAuQEAIHUAALIBADB2AACOAQAQdwAAsgEAMHgBALMBACF5AQCzAQAhegEAswEAIXsBALMBACF9AAC0AX0ifwAAtQF_IoABQAC2AQAhgQFAALYBACGpAQAAjgEAIKoBAACOAQAgFAgAALgBACAJAAC5AQAgCwAA3wEAIAwAAOYBACB1AADkAQAwdgAAAwAQdwAA5AEAMHgBALMBACGAAUAAtgEAIYEBQAC2AQAhlgEBALMBACGXAQEAswEAIZgBCADVAQAhmQEBALMBACGaAQAAxAEAIJsBIADlAQAhnAEBALMBACGdAQEAswEAIakBAAADACCqAQAAAwAgDQQAAN8BACAFAADgAQAgBwAA4wEAIHUAAOEBADB2AAAIABB3AADhAQAweAEAswEAIX8AAOIBlQEigAFAALYBACGBAUAAtgEAIZIBAQCzAQAhkwEBALMBACGVAUAAtgEAIQSCAQAAAJUBAoMBAAAAlQEIhAEAAACVAQiJAQAAwQGVASIOBgAA2QEAIHUAANQBADB2AAAMABB3AADUAQAweAEAswEAIX8AANcBpwEigAFAALYBACGhAQEAswEAIaIBCADVAQAhpAEAANYBpAEipQEBALMBACGnAUAA2AEAIakBAAAMACCqAQAADAAgEggAALgBACAJAAC5AQAgCwAA3wEAIAwAAOYBACB1AADkAQAwdgAAAwAQdwAA5AEAMHgBALMBACGAAUAAtgEAIYEBQAC2AQAhlgEBALMBACGXAQEAswEAIZgBCADVAQAhmQEBALMBACGaAQAAxAEAIJsBIADlAQAhnAEBALMBACGdAQEAswEAIQKCASAAAAABiQEgAMcBACEKAwAAtwEAIHUAANsBADB2AAAbABB3AADbAQAweAEAswEAIXkBALMBACGAAUAAtgEAIYEBQAC2AQAhqQEAABsAIKoBAAAbACAAAAABrgEBAAAAAQGuAQAAAH0CAa4BAAAAfwIBrgFAAAAAAQsZAACaAgAwGgAAnwIAMKsBAACbAgAwrAEAAJwCADCtAQAAnQIAIK4BAACeAgAwrwEAAJ4CADCwAQAAngIAMLEBAACeAgAwsgEAAKACADCzAQAAoQIAMAsZAACAAgAwGgAAhQIAMKsBAACBAgAwrAEAAIICADCtAQAAgwIAIK4BAACEAgAwrwEAAIQCADCwAQAAhAIAMLEBAACEAgAwsgEAAIYCADCzAQAAhwIAMAsZAADxAQAwGgAA9gEAMKsBAADyAQAwrAEAAPMBADCtAQAA9AEAIK4BAAD1AQAwrwEAAPUBADCwAQAA9QEAMLEBAAD1AQAwsgEAAPcBADCzAQAA-AEAMAYFAAD_AQAgeAEAAAABgAFAAAAAAZABAgAAAAGRAQEAAAABkwEBAAAAAQIAAAAQACAZAAD-AQAgAwAAABAAIBkAAP4BACAaAAD8AQAgARIAAJ0DADAMBAAA3wEAIAUAAOABACB1AADdAQAwdgAADgAQdwAA3QEAMHgBAAAAAYABQAC2AQAhkAECAN4BACGRAQEAswEAIZIBAQCzAQAhkwEBALMBACGoAQAA3AEAIAIAAAAQACASAAD8AQAgAgAAAPkBACASAAD6AQAgCXUAAPgBADB2AAD5AQAQdwAA-AEAMHgBALMBACGAAUAAtgEAIZABAgDeAQAhkQEBALMBACGSAQEAswEAIZMBAQCzAQAhCXUAAPgBADB2AAD5AQAQdwAA-AEAMHgBALMBACGAAUAAtgEAIZABAgDeAQAhkQEBALMBACGSAQEAswEAIZMBAQCzAQAhBXgBAOoBACGAAUAA7QEAIZABAgD7AQAhkQEBAOoBACGTAQEA6gEAIQWuAQIAAAABtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAAAAAQYFAAD9AQAgeAEA6gEAIYABQADtAQAhkAECAPsBACGRAQEA6gEAIZMBAQDqAQAhBRkAAJgDACAaAACbAwAgqwEAAJkDACCsAQAAmgMAILEBAAAFACAGBQAA_wEAIHgBAAAAAYABQAAAAAGQAQIAAAABkQEBAAAAAZMBAQAAAAEDGQAAmAMAIKsBAACZAwAgsQEAAAUAIAgFAACYAgAgBwAAmQIAIHgBAAAAAX8AAACVAQKAAUAAAAABgQFAAAAAAZMBAQAAAAGVAUAAAAABAgAAAAoAIBkAAJcCACADAAAACgAgGQAAlwIAIBoAAIsCACABEgAAlwMAMA0EAADfAQAgBQAA4AEAIAcAAOMBACB1AADhAQAwdgAACAAQdwAA4QEAMHgBAAAAAX8AAOIBlQEigAFAALYBACGBAUAAtgEAIZIBAQCzAQAhkwEBALMBACGVAUAAtgEAIQIAAAAKACASAACLAgAgAgAAAIgCACASAACJAgAgCnUAAIcCADB2AACIAgAQdwAAhwIAMHgBALMBACF_AADiAZUBIoABQAC2AQAhgQFAALYBACGSAQEAswEAIZMBAQCzAQAhlQFAALYBACEKdQAAhwIAMHYAAIgCABB3AACHAgAweAEAswEAIX8AAOIBlQEigAFAALYBACGBAUAAtgEAIZIBAQCzAQAhkwEBALMBACGVAUAAtgEAIQZ4AQDqAQAhfwAAigKVASKAAUAA7QEAIYEBQADtAQAhkwEBAOoBACGVAUAA7QEAIQGuAQAAAJUBAggFAACMAgAgBwAAjQIAIHgBAOoBACF_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_AgAgBwAAmQIAIHgBAAAAAX8AAACVAQKAAUAAAAABgQFAAAAAAZIBAQAAAAGVAUAAAAABAgAAAAoAIBkAAL4CACADAAAACgAgGQAAvgIAIBoAALwCACABEgAAhwMAMAIAAAAKACASAAC8AgAgAgAAAIgCACASAAC7AgAgBngBAOoBACF_AACKApUBIoABQADtAQAhgQFAAO0BACGSAQEA6gEAIZUBQADtAQAhCAQAAL0CACAHAACNAgAgeAEA6gEAIX8AAIoClQEigAFAAO0BACGBAUAA7QEAIZIBAQDqAQAhlQFAAO0BACEFGQAAggMAIBoAAIUDACCrAQAAgwMAIKwBAACEAwAgsQEAAIsBACAIBAAAvwIAIAcAAJkCACB4AQAAAAF_AAAAlQECgAFAAAAAAYEBQAAAAAGSAQEAAAABlQFAAAAAAQMZAACCAwAgqwEAAIMDACCxAQAAiwEAIA0IAADDAgAgCQAAxAIAIAwAAMICACB4AQAAAAGAAUAAAAABgQFAAAAAAZYBAQAAAAGXAQEAAAABmAEIAAAAAZkBAQAAAAGaAQAAwQIAIJsBIAAAAAGdAQEAAAABAa4BAQAAAAQDGQAAgAMAIKsBAACBAwAgsQEAAAEAIAQZAAC1AgAwqwEAALYCADCtAQAAuAIAILEBAACEAgAwBBkAAKoCADCrAQAAqwIAMK0BAACtAgAgsQEAAPUBADAEGQAAmgIAMKsBAACbAgAwrQEAAJ0CACCxAQAAngIAMAQZAACAAgAwqwEAAIECADCtAQAAgwIAILEBAACEAgAwBBkAAPEBADCrAQAA8gEAMK0BAAD0AQAgsQEAAPUBADAAAAAAAAAAAAAAAAAAAAAABRkAAPsCACAaAAD-AgAgqwEAAPwCACCsAQAA_QIAILEBAACLAQAgAxkAAPsCACCrAQAA_AIAILEBAACLAQAgAAAAAAAABRkAAPYCACAaAAD5AgAgqwEAAPcCACCsAQAA-AIAILEBAAAKACADGQAA9gIAIKsBAAD3AgAgsQEAAAoAIAMEAADxAgAgBQAA8gIAIAcAAPMCACAAAAALGQAA5wIAMBoAAOsCADCrAQAA6AIAMKwBAADpAgAwrQEAAOoCACCuAQAAngIAMK8BAACeAgAwsAEAAJ4CADCxAQAAngIAMLIBAADsAgAwswEAAKECADANCAAAwwIAIAkAAMQCACALAADZAgAgeAEAAAABgAFAAAAAAYEBQAAAAAGWAQEAAAABlwEBAAAAAZgBCAAAAAGZAQEAAAABmgEAAMECACCbASAAAAABnAEBAAAAAQIAAAAFACAZAADvAgAgAwAAAAUAIBkAAO8CACAaAADuAgAgARIAAPUCADACAAAABQAgEgAA7gIAIAIAAACiAgAgEgAA7QIAIAp4AQDqAQAhgAFAAO0BACGBAUAA7QEAIZYBAQDqAQAhlwEBAOoBACGYAQgAkwIAIZkBAQDqAQAhmgEAAKQCACCbASAApQIAIZwBAQDqAQAhDQgAAKgCACAJAACpAgAgCwAA2AIAIHgBAOoBACGAAUAA7QEAIYEBQADtAQAhlgEBAOoBACGXAQEA6gEAIZgBCACTAgAhmQEBAOoBACGaAQAApAIAIJsBIAClAgAhnAEBAOoBACENCAAAwwIAIAkAAMQCACALAADZAgAgeAEAAAABgAFAAAAAAYEBQAAAAAGWAQEAAAABlwEBAAAAAZgBCAAAAAGZAQEAAAABmgEAAMECACCbASAAAAABnAEBAAAAAQQZAADnAgAwqwEAAOgCADCtAQAA6gIAILEBAACeAgAwAwMAAMgCACAIAADJAgAgCQAAygIAIAQIAADJAgAgCQAAygIAIAsAAPECACAMAAD0AgAgAgYAAOICACCnAQAA2gIAIAEDAADIAgAgCngBAAAAAYABQAAAAAGBAUAAAAABlgEBAAAAAZcBAQAAAAGYAQgAAAABmQEBAAAAAZoBAADBAgAgmwEgAAAAAZwBAQAAAAEJBAAAvwIAIAUAAJgCACB4AQAAAAF_AAAAlQECgAFAAAAAAYEBQAAAAAGSAQEAAAABkwEBAAAAAZUBQAAAAAECAAAACgAgGQAA9gIAIAMAAAAIACAZAAD2AgAgGgAA-gIAIAsAAAAIACAEAAC9AgAgBQAAjAIAIBIAAPoCACB4AQDqAQAhfwAAigKVASKAAUAA7QEAIYEBQADtAQAhkgEBAOoBACGTAQEA6gEAIZUBQADtAQAhCQQAAL0CACAFAACMAgAgeAEA6gEAIX8AAIoClQEigAFAAO0BACGBAUAA7QEAIZIBAQDqAQAhkwEBAOoBACGVAUAA7QEAIQoIAADGAgAgCQAAxwIAIHgBAAAAAXkBAAAAAXoBAAAAAXsBAAAAAX0AAAB9An8AAAB_AoABQAAAAAGBAUAAAAABAgAAAIsBACAZAAD7AgAgAwAAAI4BACAZAAD7AgAgGgAA_wIAIAwAAACOAQAgCAAA7wEAIAkAAPABACASAAD_AgAgeAEA6gEAIXkBAOoBACF6AQDqAQAhewEA6gEAIX0AAOsBfSJ_AADsAX8igAFAAO0BACGBAUAA7QEAIQoIAADvAQAgCQAA8AEAIHgBAOoBACF5AQDqAQAhegEA6gEAIXsBAOoBACF9AADrAX0ifwAA7AF_IoABQADtAQAhgQFAAO0BACEEeAEAAAABeQEAAAABgAFAAAAAAYEBQAAAAAECAAAAAQAgGQAAgAMAIAoDAADFAgAgCQAAxwIAIHgBAAAAAXkBAAAAAXoBAAAAAXsBAAAAAX0AAAB9An8AAAB_AoABQAAAAAGBAUAAAAABAgAAAIsBACAZAACCAwAgAwAAAI4BACAZAACCAwAgGgAAhgMAIAwAAACOAQAgAwAA7gEAIAkAAPABACASAACGAwAgeAEA6gEAIXkBAOoBACF6AQDqAQAhewEA6gEAIX0AAOsBfSJ_AADsAX8igAFAAO0BACGBAUAA7QEAIQoDAADuAQAgCQAA8AEAIHgBAOoBACF5AQDqAQAhegEA6gEAIXsBAOoBACF9AADrAX0ifwAA7AF_IoABQADtAQAhgQFAAO0BACEGeAEAAAABfwAAAJUBAoABQAAAAAGBAUAAAAABkgEBAAAAAZUBQAAAAAEKAwAAxQIAIAgAAMYCACB4AQAAAAF5AQAAAAF6AQAAAAF7AQAAAAF9AAAAfQJ_AAAAfwKAAUAAAAABgQFAAAAAAQIAAACLAQAgGQAAiAMAIAMAAACOAQAgGQAAiAMAIBoAAIwDACAMAAAAjgEAIAMAAO4BACAIAADvAQAgEgAAjAMAIHgBAOoBACF5AQDqAQAhegEA6gEAIXsBAOoBACF9AADrAX0ifwAA7AF_IoABQADtAQAhgQFAAO0BACEKAwAA7gEAIAgAAO8BACB4AQDqAQAheQEA6gEAIXoBAOoBACF7AQDqAQAhfQAA6wF9In8AAOwBfyKAAUAA7QEAIYEBQADtAQAhBXgBAAAAAYABQAAAAAGQAQIAAAABkQEBAAAAAZIBAQAAAAEDAAAAGwAgGQAAgAMAIBoAAJADACAGAAAAGwAgEgAAkAMAIHgBAOoBACF5AQDqAQAhgAFAAO0BACGBAUAA7QEAIQR4AQDqAQAheQEA6gEAIYABQADtAQAhgQFAAO0BACEKeAEAAAABgAFAAAAAAYEBQAAAAAGWAQEAAAABlwEBAAAAAZgBCAAAAAGZAQEAAAABmgEAAMECACCbASAAAAABnQEBAAAAAQ4JAADEAgAgCwAA2QIAIAwAAMICACB4AQAAAAGAAUAAAAABgQFAAAAAAZYBAQAAAAGXAQEAAAABmAEIAAAAAZkBAQAAAAGaAQAAwQIAIJsBIAAAAAGcAQEAAAABnQEBAAAAAQIAAAAFACAZAACSAwAgAwAAAAMAIBkAAJIDACAaAACWAwAgEAAAAAMAIAkAAKkCACALAADYAgAgDAAApwIAIBIAAJYDACB4AQDqAQAhgAFAAO0BACGBAUAA7QEAIZYBAQDqAQAhlwEBAOoBACGYAQgAkwIAIZkBAQDqAQAhmgEAAKQCACCbASAApQIAIZwBAQDqAQAhnQEBAOoBACEOCQAAqQIAIAsAANgCACAMAACnAgAgeAEA6gEAIYABQADtAQAhgQFAAO0BACGWAQEA6gEAIZcBAQDqAQAhmAEIAJMCACGZAQEA6gEAIZoBAACkAgAgmwEgAKUCACGcAQEA6gEAIZ0BAQDqAQAhBngBAAAAAX8AAACVAQKAAUAAAAABgQFAAAAAAZMBAQAAAAGVAUAAAAABDggAAMMCACALAADZAgAgDAAAwgIAIHgBAAAAAYABQAAAAAGBAUAAAAABlgEBAAAAAZcBAQAAAAGYAQgAAAABmQEBAAAAAZoBAADBAgAgmwEgAAAAAZwBAQAAAAGdAQEAAAABAgAAAAUAIBkAAJgDACADAAAAAwAgGQAAmAMAIBoAAJwDACAQAAAAAwAgCAAAqAIAIAsAANgCACAMAACnAgAgEgAAnAMAIHgBAOoBACGAAUAA7QEAIYEBQADtAQAhlgEBAOoBACGXAQEA6gEAIZgBCACTAgAhmQEBAOoBACGaAQAApAIAIJsBIAClAgAhnAEBAOoBACGdAQEA6gEAIQ4IAACoAgAgCwAA2AIAIAwAAKcCACB4AQDqAQAhgAFAAO0BACGBAUAA7QEAIZYBAQDqAQAhlwEBAOoBACGYAQgAkwIAIZkBAQDqAQAhmgEAAKQCACCbASAApQIAIZwBAQDqAQAhnQEBAOoBACEFeAEAAAABgAFAAAAAAZABAgAAAAGRAQEAAAABkwEBAAAAAQIDBgIKAAkFCBUECRYGCgAICwADDAABBAMHAggLBAkRBgoABwMEAAMFAAIHDQUBBgAEAgQAAwUAAgMDEgAIEwAJFAACCBcACRgAAQMZAAAAAAMKAA4fAA8gABAAAAADCgAOHwAPIAAQAQYABAEGAAQFCgAVHwAYIAAZMQAWMgAXAAAAAAAFCgAVHwAYIAAZMQAWMgAXAgsAAwwAAQILAAMMAAEFCgAeHwAhIAAiMQAfMgAgAAAAAAAFCgAeHwAhIAAiMQAfMgAgAgQAAwUAAgIEAAMFAAIDCgAnHwAoIAApAAAAAwoAJx8AKCAAKQIEAAMFAAICBAADBQACBQoALh8AMSAAMjEALzIAMAAAAAAABQoALh8AMSAAMjEALzIAMAAAAwoANx8AOCAAOQAAAAMKADcfADggADkNAgEOGgEPHQEQHgERHwETIQEUIwoVJAsWJgEXKAoYKQwbKgEcKwEdLAohLw0iMBEjMgUkMwUlNQUmNgUnNwUoOQUpOwoqPBIrPgUsQAotQRMuQgUvQwUwRAozRxQ0SBo1SQI2SgI3SwI4TAI5TQI6TwI7UQo8Uhs9VAI-Vgo_VxxAWAJBWQJCWgpDXR1EXiNFXwRGYARHYQRIYgRJYwRKZQRLZwpMaCRNagRObApPbSVQbgRRbwRScApTcyZUdCpVdQZWdgZXdwZYeAZZeQZaewZbfQpcfitdgAEGXoIBCl-DASxghAEGYYUBBmKGAQpjiQEtZIoBM2WMAQNmjQEDZ5ABA2iRAQNpkgEDapQBA2uWAQpslwE0bZkBA26bAQpvnAE1cJ0BA3GeAQNynwEKc6IBNnSjATo"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED"
};
var RentalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ACTIVE: "ACTIVE"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/prisma.ts
var connectionString = process.env.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};
var AppError_default = AppError;

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "5d"
  });
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
var register = async (payload) => {
  const existUser = await prisma.user.findUnique({
    where: {
      email: payload.email
    }
  });
  if (existUser) {
    throw new AppError_default(409, "User already exists");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword
    }
  });
  const { password, ...result } = user;
  return result;
};
var login = async (payload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email
    }
  });
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  const isMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isMatched) {
    throw new AppError_default(401, "Invalid credentials");
  }
  const token = generateToken({
    id: user.id,
    role: user.role
  });
  const { password, ...userInfo } = user;
  return {
    token,
    user: userInfo
  };
};
var me = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true
    }
  });
  return user;
};
var AuthService = {
  register,
  login,
  me
};

// src/utils/sendResponse.ts
var sendResponse = (res, payload) => {
  res.status(payload.statusCode).json(payload);
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.controller.ts
var register2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.register(req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "User registered!",
    data: result
  });
});
var login2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.login(req.body);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result
  });
});
var me2 = catchAsync_default(async (req, res) => {
  const result = await AuthService.me(req.user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Profile Retrieved",
    data: result
  });
});
var AuthController = {
  register: register2,
  login: login2,
  me: me2
};

// src/middlewares/auth.ts
import jwt2 from "jsonwebtoken";
var auth = catchAsync_default(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new AppError_default(401, "Unauthorized");
  }
  const decoded = jwt2.verify(token, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      role: true
    }
  });
  if (!user) {
    throw new AppError_default(401, "User not found");
  }
  req.user = user;
  next();
});
var auth_default = auth;

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest_default(registerSchema), AuthController.register);
router.post("/login", validateRequest_default(loginSchema), AuthController.login);
router.get(
  "/me",
  auth_default,
  AuthController.me
);
var auth_route_default = router;

// src/modules/category/category.route.ts
import { Router as Router2 } from "express";

// src/middlewares/authorize.ts
var authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new AppError_default(401, "Unauthorized");
  }
  if (!roles.includes(req.user.role)) {
    throw new AppError_default(403, "Forbidden");
  }
  next();
};
var authorize_default = authorize;

// src/modules/category/category.validation.ts
import { z as z2 } from "zod";
var createCategorySchema = z2.object({
  body: z2.object({
    name: z2.string().min(2)
  })
});

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  const exists = await prisma.category.findUnique({
    where: {
      name: payload.name
    }
  });
  if (exists) {
    throw new AppError_default(409, "Category already exists");
  }
  return await prisma.category.create({
    data: payload
  });
};
var getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
};
var CategoryService = {
  createCategory,
  getCategories
};

// src/modules/category/category.controller.ts
var createCategory2 = catchAsync_default(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getCategories2 = catchAsync_default(async (_req, res) => {
  const result = await CategoryService.getCategories();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Categories retrieved successfully",
    data: result
  });
});
var CategoryController = {
  createCategory: createCategory2,
  getCategories: getCategories2
};

// src/modules/category/category.route.ts
var router2 = Router2();
router2.get("/", CategoryController.getCategories);
router2.post("/", auth_default, authorize_default("ADMIN"), validateRequest_default(createCategorySchema), CategoryController.createCategory);
var category_route_default = router2;

// src/modules/property/property.route.ts
import { Router as Router3 } from "express";

// src/modules/property/property.service.ts
var propertyInclude = {
  landlord: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  category: true
};
var createProperty = async (payload, landlordId) => {
  const { categoryId, ...propertyData } = payload;
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    throw new AppError_default(404, "Category not found");
  }
  return await prisma.property.create({
    data: {
      ...propertyData,
      categoryId,
      landlordId
    },
    include: propertyInclude
  });
};
var getAllProperties = async (filters) => {
  const {
    location,
    minPrice,
    maxPrice,
    category,
    available,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {};
  if (location) {
    where.location = {
      mode: "insensitive",
      contains: location
    };
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    where.price = {};
    if (minPrice !== void 0) where.price.gte = minPrice;
    if (maxPrice !== void 0) where.price.lte = maxPrice;
  }
  if (category) {
    where.categoryId = category;
  }
  if (available !== void 0) {
    where.available = available;
  }
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: propertyInclude
    }),
    prisma.property.count({ where })
  ]);
  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSingleProperty = async (id) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: propertyInclude
  });
  if (!property) {
    throw new AppError_default(404, "No Property found");
  }
  return property;
};
var updateProperty = async (id, payload, userId, userRole) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
    select: { landlordId: true }
  });
  if (!existingProperty) {
    throw new AppError_default(404, "No Property found");
  }
  if (userRole !== "ADMIN" && existingProperty.landlordId !== userId) {
    throw new AppError_default(403, "You can only update your own properties");
  }
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId }
    });
    if (!category) {
      throw new AppError_default(404, "Category not found");
    }
  }
  return await prisma.property.update({
    where: { id },
    data: payload,
    include: propertyInclude
  });
};
var deleteProperty = async (id, userId, userRole) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
    select: { landlordId: true }
  });
  if (!existingProperty) {
    throw new AppError_default(404, "No Property found");
  }
  if (userRole !== "ADMIN" && existingProperty.landlordId !== userId) {
    throw new AppError_default(403, "You can only delete your own properties");
  }
  await prisma.property.delete({
    where: { id }
  });
  return { message: "Property deleted!!" };
};
var PropertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty
};

// src/modules/property/property.controller.ts
var createProperty2 = catchAsync_default(async (req, res) => {
  const userId = req.user.id;
  const result = await PropertyService.createProperty(req.body, userId);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Property created successfully",
    data: result
  });
});
var getAllProperties2 = catchAsync_default(async (req, res) => {
  const result = await PropertyService.getAllProperties(req.query);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getSingleProperty2 = catchAsync_default(async (req, res) => {
  const id = String(req.params.id);
  const result = await PropertyService.getSingleProperty(id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Property retrieved successfully",
    data: result
  });
});
var updateProperty2 = catchAsync_default(async (req, res) => {
  const id = String(req.params.id);
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await PropertyService.updateProperty(id, req.body, userId, userRole);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Property updated successfully",
    data: result
  });
});
var deleteProperty2 = catchAsync_default(async (req, res) => {
  const id = String(req.params.id);
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await PropertyService.deleteProperty(id, userId, userRole);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Property deleted successfully",
    data: result
  });
});
var PropertyController = {
  createProperty: createProperty2,
  getAllProperties: getAllProperties2,
  getSingleProperty: getSingleProperty2,
  updateProperty: updateProperty2,
  deleteProperty: deleteProperty2
};

// src/modules/property/property.validation.ts
import { z as z3 } from "zod";
var createPropertySchema = z3.object({
  body: z3.object({
    title: z3.string().min(3, "Title must be at least 3 characters"),
    description: z3.string().min(10, "Description must be at least 10 characters"),
    price: z3.number().positive("Price must be greater than 0"),
    location: z3.string().min(2, "Location is required"),
    amenities: z3.array(z3.string()).min(1, "At least 1 amenity required"),
    available: z3.boolean().optional(),
    // Inside createPropertySchema -> body:
    categoryId: z3.string({ message: "Category ID is required" })
    // Changed 'required_error' to 'message' // Changed from .cuid() to standard string
  })
});
var updatePropertySchema = z3.object({
  body: z3.object({
    title: z3.string().min(3).optional(),
    description: z3.string().min(10).optional(),
    price: z3.number().positive().optional(),
    location: z3.string().min(2).optional(),
    amenities: z3.array(z3.string()).min(1).optional(),
    available: z3.boolean().optional(),
    categoryId: z3.string().optional()
    // Changed from .cuid() to standard string
  })
});
var propertyFiltersSchema = z3.object({
  query: z3.object({
    location: z3.string().optional(),
    minPrice: z3.coerce.number().positive().optional(),
    maxPrice: z3.coerce.number().positive().optional(),
    category: z3.string().optional(),
    // Changed from .cuid() to standard string
    available: z3.string().optional().transform((val) => val === "true" ? true : val === "false" ? false : void 0),
    page: z3.coerce.number().int().positive().default(1),
    limit: z3.coerce.number().int().positive().max(100).default(10),
    sortBy: z3.string().default("createdAt"),
    sortOrder: z3.enum(["asc", "desc"]).default("desc")
  })
});

// src/modules/property/property.route.ts
var router3 = Router3();
router3.post(
  "/",
  auth_default,
  authorize_default("LANDLORD", "ADMIN"),
  validateRequest_default(createPropertySchema),
  PropertyController.createProperty
);
router3.get(
  "/",
  validateRequest_default(propertyFiltersSchema),
  PropertyController.getAllProperties
);
router3.get("/:id", PropertyController.getSingleProperty);
router3.patch(
  "/:id",
  auth_default,
  authorize_default("LANDLORD", "ADMIN"),
  validateRequest_default(updatePropertySchema),
  PropertyController.updateProperty
);
router3.delete(
  "/:id",
  auth_default,
  authorize_default("LANDLORD", "ADMIN"),
  PropertyController.deleteProperty
);
var property_route_default = router3;

// src/modules/rental/rental.route.ts
import { Router as Router4 } from "express";

// src/modules/rental/rental.sevice.ts
var rentalInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  },
  property: {
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  }
};
var createRental = async (payload, tenantId) => {
  const { propertyId, moveInDate } = payload;
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      available: true,
      landlordId: true
    }
  });
  if (!property) {
    throw new AppError_default(404, "Property not found");
  }
  if (!property.available) {
    throw new AppError_default(400, "Property is not available for rent");
  }
  if (property.landlordId === tenantId) {
    throw new AppError_default(400, "You cannot request to rent your own property");
  }
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: "PENDING"
    }
  });
  if (existingRequest) {
    throw new AppError_default(409, "You already have a pending request for this property");
  }
  const createData = {
    tenantId,
    propertyId,
    status: "PENDING",
    moveInDate: moveInDate ? new Date(moveInDate) : /* @__PURE__ */ new Date()
  };
  return await prisma.rentalRequest.create({
    data: createData,
    include: rentalInclude
  });
};
var getTenantRentals = async (tenantId, filters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {
    tenantId
  };
  if (status) {
    where.status = status;
  }
  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: rentalInclude
    }),
    prisma.rentalRequest.count({ where })
  ]);
  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getRentalById = async (id, userId, userRole) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: rentalInclude
  });
  if (!rental) {
    throw new AppError_default(404, "Rental request not found");
  }
  const isTenant = rental.tenantId === userId;
  const isLandlord = rental.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";
  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError_default(403, "You are not authorized to view this rental request");
  }
  return rental;
};
var getLandlordRequests = async (landlordId, filters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {
    property: {
      landlordId
    }
  };
  if (status) {
    where.status = status;
  }
  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: rentalInclude
    }),
    prisma.rentalRequest.count({ where })
  ]);
  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var updateRentalStatus = async (id, payload, landlordId) => {
  const { status } = payload;
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          landlordId: true,
          available: true
        }
      }
    }
  });
  if (!rental) {
    throw new AppError_default(404, "Rental request not found");
  }
  if (rental.property.landlordId !== landlordId) {
    throw new AppError_default(403, "You are not authorized to manage this rental request");
  }
  if (rental.status !== "PENDING") {
    throw new AppError_default(400, `This request has already been ${rental.status.toLowerCase()}`);
  }
  if (status === "APPROVED" && !rental.property.available) {
    throw new AppError_default(400, "Property is no longer available");
  }
  const updatedRental = await prisma.$transaction(async (tx) => {
    const updated = await tx.rentalRequest.update({
      where: { id },
      data: { status },
      include: rentalInclude
    });
    if (status === "APPROVED") {
      await tx.property.update({
        where: { id: rental.propertyId },
        data: { available: false }
      });
      await tx.rentalRequest.updateMany({
        where: {
          propertyId: rental.propertyId,
          status: "PENDING",
          NOT: {
            id
          }
        },
        data: {
          status: "REJECTED"
        }
      });
    }
    return updated;
  });
  return updatedRental;
};
var cancelRentalRequest = async (id, tenantId) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true,
      status: true
    }
  });
  if (!rental) {
    throw new AppError_default(404, "Rental request not found");
  }
  if (rental.tenantId !== tenantId) {
    throw new AppError_default(403, "You can only cancel your own rental requests");
  }
  if (rental.status !== "PENDING") {
    throw new AppError_default(400, `Cannot cancel a request that is ${rental.status.toLowerCase()}`);
  }
  return await prisma.rentalRequest.update({
    where: { id },
    data: {
      status: "REJECTED"
    },
    include: rentalInclude
  });
};
var RentalService = {
  createRental,
  getTenantRentals,
  getRentalById,
  getLandlordRequests,
  updateRentalStatus,
  cancelRentalRequest
};

// src/modules/rental/rental.controller.ts
var createRental2 = catchAsync_default(async (req, res) => {
  const tenantId = req.user.id;
  const result = await RentalService.createRental(req.body, tenantId);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Rental request created successfully",
    data: result
  });
});
var getTenantRentals2 = catchAsync_default(async (req, res) => {
  const tenantId = req.user.id;
  const queryStatus = req.query.status;
  const targetStatus = queryStatus === "CANCELLED" ? "REJECTED" : queryStatus;
  const filters = {
    status: targetStatus,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await RentalService.getTenantRentals(tenantId, filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Rental history retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getRentalById2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await RentalService.getRentalById(id, userId, userRole);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Rental request retrieved successfully",
    data: result
  });
});
var getLandlordRequests2 = catchAsync_default(async (req, res) => {
  const landlordId = req.user.id;
  const queryStatus = req.query.status;
  const targetStatus = queryStatus === "CANCELLED" ? "REJECTED" : queryStatus;
  const filters = {
    status: targetStatus,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await RentalService.getLandlordRequests(landlordId, filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Landlord rental requests retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var updateRentalStatus2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const landlordId = req.user.id;
  const result = await RentalService.updateRentalStatus(id, req.body, landlordId);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: `Rental request ${req.body.status.toLowerCase()} successfully`,
    data: result
  });
});
var cancelRentalRequest2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const tenantId = req.user.id;
  const result = await RentalService.cancelRentalRequest(id, tenantId);
  const clientResponseData = {
    ...result,
    status: "CANCELLED"
  };
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Rental request cancelled successfully",
    data: clientResponseData
  });
});
var RentalController = {
  createRental: createRental2,
  getTenantRentals: getTenantRentals2,
  getRentalById: getRentalById2,
  getLandlordRequests: getLandlordRequests2,
  updateRentalStatus: updateRentalStatus2,
  cancelRentalRequest: cancelRentalRequest2
};

// src/modules/rental/rental.validation.ts
import { z as z4 } from "zod";
var createRentalSchema = z4.object({
  body: z4.object({
    propertyId: z4.string().min(1, "Property ID is required"),
    moveInDate: z4.string().datetime({ message: "Invalid date format" }).optional(),
    message: z4.string().optional()
  })
});
var updateRentalStatusSchema = z4.object({
  body: z4.object({
    status: z4.enum(["APPROVED", "REJECTED"], {
      message: "Status must be either APPROVED or REJECTED"
    })
  })
});
var rentalFiltersSchema = z4.object({
  query: z4.object({
    status: z4.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
    page: z4.coerce.number().int().positive().default(1).optional(),
    limit: z4.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z4.string().default("createdAt").optional(),
    sortOrder: z4.enum(["asc", "desc"]).default("desc").optional()
  }).default({})
});

// src/modules/rental/rental.route.ts
var router4 = Router4();
router4.post(
  "/",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(createRentalSchema),
  RentalController.createRental
);
router4.get(
  "/",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(rentalFiltersSchema),
  RentalController.getTenantRentals
);
router4.get(
  "/:id",
  auth_default,
  RentalController.getRentalById
);
router4.patch(
  "/:id/cancel",
  auth_default,
  authorize_default("TENANT"),
  RentalController.cancelRentalRequest
);
router4.get(
  "/landlord/requests",
  auth_default,
  authorize_default("LANDLORD", "ADMIN"),
  validateRequest_default(rentalFiltersSchema),
  RentalController.getLandlordRequests
);
router4.patch(
  "/landlord/requests/:id",
  auth_default,
  authorize_default("LANDLORD", "ADMIN"),
  validateRequest_default(updateRentalStatusSchema),
  RentalController.updateRentalStatus
);
var rental_route_default = router4;

// src/modules/payment/payment.route.ts
import { Router as Router5 } from "express";
import express from "express";

// src/modules/payment/payment.service.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia"
});
var paymentInclude = {
  rentalRequest: {
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  }
};
var createPayment = async (payload, tenantId) => {
  const { rentalRequestId, provider } = payload;
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: {
      property: true,
      tenant: true
    }
  });
  if (!rental) {
    throw new AppError_default(404, "not found");
  }
  if (rental.tenantId !== tenantId) {
    throw new AppError_default(403, "You are not authorized to pay for this rental");
  }
  if (rental.status !== "APPROVED") {
    throw new AppError_default(400, "Rental request must be approved before payment");
  }
  const existingPayment = await prisma.payment.findUnique({
    where: { rentalRequestId }
  });
  if (existingPayment) {
    throw new AppError_default(409, "Payment already exists for this rental");
  }
  const amount = rental.property.price;
  const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rent Payment - ${rental.property.title}`,
            description: `Payment for ${rental.property.title} - ${rental.property.location}`
          },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${frontendBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendBaseUrl}/payment/cancel`,
    metadata: {
      rentalRequestId: rental.id,
      tenantId: rental.tenantId,
      propertyId: rental.propertyId
    }
  });
  const payment = await prisma.payment.create({
    data: {
      rentalRequest: {
        connect: { id: rental.id }
      },
      amount,
      provider,
      status: "PENDING",
      transactionId: session.payment_intent || session.id
    },
    include: paymentInclude
  });
  return {
    payment,
    stripeSession: {
      id: session.id,
      url: session.url,
      paymentIntent: session.payment_intent
    }
  };
};
var confirmPayment = async (payload) => {
  const { paymentId, transactionId } = payload;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError_default(404, "Payment not found");
  }
  if (payment.status === "COMPLETED") {
    throw new AppError_default(400, "Payment already completed");
  }
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
    if (paymentIntent.status !== "succeeded") {
      throw new AppError_default(400, "Payment not completed in Stripe");
    }
  } catch (error) {
    throw new AppError_default(400, "Failed to verify payment: " + error.message);
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        paidAt: /* @__PURE__ */ new Date(),
        transactionId
      },
      include: paymentInclude
    });
    await tx.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: "ACTIVE" }
    });
    await tx.property.update({
      where: { id: payment.rentalRequest.propertyId },
      data: { available: false }
    });
    await tx.rentalRequest.updateMany({
      where: {
        propertyId: payment.rentalRequest.propertyId,
        status: "PENDING",
        NOT: {
          id: payment.rentalRequestId
        }
      },
      data: {
        status: "REJECTED"
      }
    });
    return updatedPayment;
  });
  return result;
};
var getPaymentHistory = async (tenantId, filters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {
    rentalRequest: {
      tenantId
    }
  };
  if (status) {
    where.status = status;
  }
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: paymentInclude
    }),
    prisma.payment.count({ where })
  ]);
  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getPaymentById = async (id, userId, userRole) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: paymentInclude
  });
  if (!payment) {
    throw new AppError_default(404, "Payment not found");
  }
  const isTenant = payment.rentalRequest.tenantId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";
  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError_default(403, "You are not authorized to view this payment");
  }
  return payment;
};
var handleStripeWebhook = async (event) => {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const rentalRequestId = paymentIntent.metadata?.rentalRequestId;
      if (!rentalRequestId) {
        console.log("No rentalRequestId found in metadata");
        break;
      }
      const payment = await prisma.payment.findFirst({
        where: {
          transactionId: paymentIntent.id,
          rentalRequestId
        }
      });
      if (payment && payment.status !== "COMPLETED") {
        await confirmPayment({
          paymentId: payment.id,
          transactionId: paymentIntent.id
        });
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      await prisma.payment.updateMany({
        where: {
          transactionId: paymentIntent.id,
          status: "PENDING"
        },
        data: {
          status: "FAILED"
        }
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
var PaymentService = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
  handleStripeWebhook
};

// src/modules/payment/payment.controller.ts
import Stripe2 from "stripe";
var stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia"
});
var createPayment2 = catchAsync_default(async (req, res) => {
  const tenantId = req.user.id;
  const result = await PaymentService.createPayment(req.body, tenantId);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result
  });
});
var confirmPayment2 = catchAsync_default(async (req, res) => {
  const result = await PaymentService.confirmPayment(req.body);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed successfully",
    data: result
  });
});
var getPaymentHistory2 = catchAsync_default(async (req, res) => {
  const tenantId = req.user.id;
  const filters = {
    status: req.query.status,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await PaymentService.getPaymentHistory(tenantId, filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payment history retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getPaymentById2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await PaymentService.getPaymentById(id, userId, userRole);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result
  });
});
var stripeWebhook = catchAsync_default(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    throw new AppError_default(400, "Missing or invalid Stripe signature header");
  }
  let event;
  try {
    event = stripe2.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError_default(400, `Webhook Error: ${err.message}`);
  }
  await PaymentService.handleStripeWebhook(event);
  res.status(200).json({ received: true });
});
var PaymentController = {
  createPayment: createPayment2,
  confirmPayment: confirmPayment2,
  getPaymentHistory: getPaymentHistory2,
  getPaymentById: getPaymentById2,
  stripeWebhook
};

// src/modules/payment/payment.validation.ts
import { z as z5 } from "zod";
var createPaymentSchema = z5.object({
  body: z5.object({
    rentalRequestId: z5.string().min(1, "Rental request ID is required"),
    provider: z5.enum(["STRIPE"], {
      message: "Provider must be STRIPE"
    })
  })
});
var confirmPaymentSchema = z5.object({
  body: z5.object({
    paymentId: z5.string().min(1, "Payment ID is required"),
    transactionId: z5.string().min(1, "Transaction ID is required")
  })
});
var paymentFiltersSchema = z5.object({
  query: z5.object({
    status: z5.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
    page: z5.coerce.number().int().positive().default(1).optional(),
    limit: z5.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z5.string().default("createdAt").optional(),
    sortOrder: z5.enum(["asc", "desc"]).default("desc").optional()
  }).default({})
});

// src/modules/payment/payment.route.ts
var router5 = Router5();
router5.post(
  "/create",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(createPaymentSchema),
  PaymentController.createPayment
);
router5.post(
  "/confirm",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(confirmPaymentSchema),
  PaymentController.confirmPayment
);
router5.get(
  "/",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(paymentFiltersSchema),
  PaymentController.getPaymentHistory
);
router5.get(
  "/:id",
  auth_default,
  PaymentController.getPaymentById
);
router5.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook
);
var payment_route_default = router5;

// src/modules/review/review.route.ts
import { Router as Router6 } from "express";

// src/modules/review/review.service.ts
var reviewInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  property: {
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  }
};
var createReview = async (payload, tenantId) => {
  const { rating, comment, propertyId } = payload;
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  if (!property) {
    throw new AppError_default(404, "Property not found");
  }
  const rental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: {
        in: ["ACTIVE", "APPROVED"]
      }
    }
  });
  if (!rental) {
    throw new AppError_default(
      403,
      "You can only review properties you have rented or are currently renting"
    );
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId
      }
    }
  });
  if (existingReview) {
    throw new AppError_default(409, "You have already reviewed this property");
  }
  return await prisma.review.create({
    data: {
      rating,
      comment,
      tenantId,
      propertyId
    },
    include: reviewInclude
  });
};
var getPropertyReviews = async (propertyId, filters) => {
  const {
    rating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  if (!property) {
    throw new AppError_default(404, "Property not found");
  }
  const where = {
    propertyId
  };
  if (rating) {
    where.rating = rating;
  }
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }),
    prisma.review.count({ where })
  ]);
  const avgRating = await prisma.review.aggregate({
    where: { propertyId },
    _avg: {
      rating: true
    }
  });
  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      averageRating: avgRating._avg.rating || 0,
      totalReviews: total
    }
  };
};
var getTenantReviews = async (tenantId, filters) => {
  const {
    rating,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {
    tenantId
  };
  if (rating) {
    where.rating = rating;
  }
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        property: {
          include: {
            category: true,
            landlord: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    }),
    prisma.review.count({ where })
  ]);
  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getReviewById = async (id, userId, userRole) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: reviewInclude
  });
  if (!review) {
    throw new AppError_default(404, "Review not found");
  }
  const isTenant = review.tenantId === userId;
  const isLandlord = review.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";
  if (!isTenant && !isLandlord && !isAdmin) {
    throw new AppError_default(403, "You are not authorized to view this review");
  }
  return review;
};
var updateReview = async (id, payload, tenantId) => {
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "Review not found");
  }
  if (review.tenantId !== tenantId) {
    throw new AppError_default(403, "You can only update your own reviews");
  }
  return await prisma.review.update({
    where: { id },
    data: payload,
    include: reviewInclude
  });
};
var deleteReview = async (id, userId, userRole) => {
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      tenantId: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "Review not found");
  }
  if (userRole !== "ADMIN" && review.tenantId !== userId) {
    throw new AppError_default(403, "You can only delete your own reviews");
  }
  await prisma.review.delete({
    where: { id }
  });
  return { message: "Review deleted successfully" };
};
var ReviewService = {
  createReview,
  getPropertyReviews,
  getTenantReviews,
  getReviewById,
  updateReview,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = catchAsync_default(async (req, res) => {
  const tenantId = req.user.id;
  const result = await ReviewService.createReview(req.body, tenantId);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getPropertyReviews2 = catchAsync_default(async (req, res) => {
  const propertyId = req.params.propertyId;
  const filters = {
    rating: req.query.rating ? Number(req.query.rating) : void 0,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await ReviewService.getPropertyReviews(propertyId, filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Property reviews retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getTenantReviews2 = catchAsync_default(async (req, res) => {
  const tenantId = req.user.id;
  const filters = {
    rating: req.query.rating ? Number(req.query.rating) : void 0,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder
  };
  const result = await ReviewService.getTenantReviews(tenantId, filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Your reviews retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getReviewById2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await ReviewService.getReviewById(id, userId, userRole);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Review retrieved successfully",
    data: result
  });
});
var updateReview2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const tenantId = req.user.id;
  const result = await ReviewService.updateReview(id, req.body, tenantId);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await ReviewService.deleteReview(id, userId, userRole);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var ReviewController = {
  createReview: createReview2,
  getPropertyReviews: getPropertyReviews2,
  getTenantReviews: getTenantReviews2,
  getReviewById: getReviewById2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/modules/review/review.validation.ts
import { z as z6 } from "zod";
var createReviewSchema = z6.object({
  body: z6.object({
    rating: z6.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z6.string().min(3, "Comment must be at least 3 characters").max(500, "Comment must be at most 500 characters"),
    propertyId: z6.string().min(1, "Property ID is required")
  })
});
var reviewFiltersSchema = z6.object({
  query: z6.object({
    rating: z6.coerce.number().int().min(1).max(5).optional(),
    page: z6.coerce.number().int().positive().default(1).optional(),
    limit: z6.coerce.number().int().positive().max(100).default(10).optional(),
    sortBy: z6.string().default("createdAt").optional(),
    sortOrder: z6.enum(["asc", "desc"]).default("desc").optional()
  }).default({})
});

// src/modules/review/review.route.ts
var router6 = Router6();
router6.post(
  "/",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(createReviewSchema),
  ReviewController.createReview
);
router6.get(
  "/my-reviews",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(reviewFiltersSchema),
  ReviewController.getTenantReviews
);
router6.get(
  "/property/:propertyId",
  validateRequest_default(reviewFiltersSchema),
  ReviewController.getPropertyReviews
);
router6.get(
  "/:id",
  auth_default,
  ReviewController.getReviewById
);
router6.patch(
  "/:id",
  auth_default,
  authorize_default("TENANT"),
  validateRequest_default(createReviewSchema),
  ReviewController.updateReview
);
router6.delete(
  "/:id",
  auth_default,
  authorize_default("TENANT", "ADMIN"),
  ReviewController.deleteReview
);
var review_route_default = router6;

// src/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async (filters) => {
  const {
    role,
    status,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {};
  if (role) {
    where.role = role;
  }
  if (status) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      properties: {
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          available: true,
          createdAt: true
        },
        take: 5,
        orderBy: { createdAt: "desc" }
      },
      rentalRequests: {
        select: {
          id: true,
          status: true,
          property: {
            select: {
              id: true,
              title: true
            }
          },
          createdAt: true
        },
        take: 5,
        orderBy: { createdAt: "desc" }
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          property: {
            select: {
              id: true,
              title: true
            }
          },
          createdAt: true
        },
        take: 5,
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  return user;
};
var updateUser = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  if (payload.status === UserStatus.BANNED && user.role === Role.ADMIN) {
    throw new AppError_default(403, "Cannot ban an admin user");
  }
  if (payload.role && user.role === Role.ADMIN) {
    throw new AppError_default(403, "Cannot change admin role");
  }
  const { name, email, role, status } = payload;
  const updateData = {};
  if (name !== void 0) updateData.name = name;
  if (email !== void 0) updateData.email = email;
  if (role !== void 0) updateData.role = role;
  if (status !== void 0) updateData.status = status;
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(404, "User not found");
  }
  if (user.role === Role.ADMIN) {
    throw new AppError_default(403, "Cannot delete an admin user");
  }
  await prisma.user.delete({
    where: { id }
  });
  return { message: "User deleted successfully" };
};
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalProperties,
    totalRentals,
    totalPayments,
    totalReviews,
    recentProperties,
    recentRentals,
    revenueData
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.rentalRequest.count(),
    prisma.payment.count(),
    prisma.review.count(),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    }),
    prisma.rentalRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      }
    }),
    prisma.payment.aggregate({
      where: {
        status: PaymentStatus.COMPLETED
      },
      _sum: {
        amount: true
      },
      _count: true
    })
  ]);
  const userDistribution = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true
    }
  });
  const propertyDistribution = await prisma.property.groupBy({
    by: ["available"],
    _count: {
      available: true
    }
  });
  const rentalDistribution = await prisma.rentalRequest.groupBy({
    by: ["status"],
    _count: {
      status: true
    }
  });
  return {
    stats: {
      totalUsers,
      totalProperties,
      totalRentals,
      totalPayments,
      totalReviews,
      totalRevenue: revenueData._sum.amount || 0,
      completedPayments: revenueData._count
    },
    distribution: {
      users: userDistribution,
      properties: propertyDistribution,
      rentals: rentalDistribution
    },
    recent: {
      properties: recentProperties,
      rentals: recentRentals
    }
  };
};
var getAllProperties3 = async (filters) => {
  const {
    available,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {};
  if (available !== void 0) {
    where.available = available;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true,
        _count: {
          select: {
            rentalRequests: true,
            reviews: true
          }
        }
      }
    }),
    prisma.property.count({ where })
  ]);
  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAllRentals = async (filters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {};
  if (status) {
    where.status = status;
  }
  const [rentals, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        property: {
          include: {
            category: true,
            landlord: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        payment: true
      }
    }),
    prisma.rentalRequest.count({ where })
  ]);
  return {
    data: rentals,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAllPayments = async (filters) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = filters;
  const skip = (page - 1) * limit;
  const where = {};
  if (status) {
    where.status = status;
  }
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        rentalRequest: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            property: {
              select: {
                id: true,
                title: true,
                price: true,
                location: true
              }
            }
          }
        }
      }
    }),
    prisma.payment.count({ where })
  ]);
  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var AdminService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  getAllProperties: getAllProperties3,
  getAllRentals,
  getAllPayments
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = catchAsync_default(async (req, res) => {
  let role;
  if (req.query.role) {
    const roleValue = req.query.role;
    if (Object.values(Role).includes(roleValue)) {
      role = roleValue;
    }
  }
  let status;
  if (req.query.status) {
    const statusValue = req.query.status;
    if (Object.values(UserStatus).includes(statusValue)) {
      status = statusValue;
    }
  }
  const filters = {
    role,
    status,
    search: req.query.search,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc"
  };
  const result = await AdminService.getAllUsers(filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getUserById2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.getUserById(id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result
  });
});
var updateUser2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const payload = {};
  if (req.body.name) payload.name = req.body.name;
  if (req.body.email) payload.email = req.body.email;
  if (req.body.phone) payload.phone = req.body.phone;
  if (req.body.role) {
    if (Object.values(Role).includes(req.body.role)) {
      payload.role = req.body.role;
    } else {
      throw new AppError_default(400, `Invalid role. Must be one of: ${Object.values(Role).join(", ")}`);
    }
  }
  if (req.body.status) {
    if (Object.values(UserStatus).includes(req.body.status)) {
      payload.status = req.body.status;
    } else {
      throw new AppError_default(400, `Invalid status. Must be one of: ${Object.values(UserStatus).join(", ")}`);
    }
  }
  const result = await AdminService.updateUser(id, payload);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsync_default(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.deleteUser(id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var getDashboardStats2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getDashboardStats();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: result
  });
});
var getAllProperties4 = catchAsync_default(async (req, res) => {
  const filters = {
    available: req.query.available === "true" ? true : req.query.available === "false" ? false : void 0,
    search: req.query.search,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc"
  };
  const result = await AdminService.getAllProperties(filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getAllRentals2 = catchAsync_default(async (req, res) => {
  let status;
  if (req.query.status) {
    const statusValue = req.query.status;
    if (Object.values(RentalStatus).includes(statusValue)) {
      status = statusValue;
    }
  }
  const filters = {
    status,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc"
  };
  const result = await AdminService.getAllRentals(filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Rentals retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getAllPayments2 = catchAsync_default(async (req, res) => {
  let status;
  if (req.query.status) {
    const statusValue = req.query.status;
    if (Object.values(PaymentStatus).includes(statusValue)) {
      status = statusValue;
    }
  }
  const filters = {
    status,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc"
  };
  const result = await AdminService.getAllPayments(filters);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var AdminController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  deleteUser: deleteUser2,
  getDashboardStats: getDashboardStats2,
  getAllProperties: getAllProperties4,
  getAllRentals: getAllRentals2,
  getAllPayments: getAllPayments2
};

// src/modules/admin/admin.route.ts
var router7 = Router7();
router7.use(auth_default, authorize_default("ADMIN"));
router7.get("/users", AdminController.getAllUsers);
router7.get("/users/:id", AdminController.getUserById);
router7.patch("/users/:id", AdminController.updateUser);
router7.delete("/users/:id", AdminController.deleteUser);
router7.get("/dashboard", AdminController.getDashboardStats);
router7.get("/properties", AdminController.getAllProperties);
router7.get("/rentals", AdminController.getAllRentals);
router7.get("/payments", AdminController.getAllPayments);
var admin_route_default = router7;

// src/routes/index.ts
var router8 = Router8();
router8.use("/auth", auth_route_default);
router8.use("/categories", category_route_default);
router8.use("/properties", property_route_default);
router8.use("/rentals", rental_route_default);
router8.use("/payments", payment_route_default);
router8.use("/reviews", review_route_default);
router8.use("/admin", admin_route_default);
var routes_default = router8;

// src/app.ts
var app = express2();
app.use(cors());
app.use(express2.json());
app.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/api", routes_default);
var app_default = app;

// src/server.ts
dotenv.config();
var PORT = process.env.PORT || 5e3;
app_default.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map