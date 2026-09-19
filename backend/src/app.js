import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { createAuthController } from "./controllers/authController.js";
import { createPredictionController } from "./controllers/predictionController.js";
import { createFileController } from "./controllers/fileController.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createAuthRoutes } from "./routes/authRoutes.js";
import { createPredictionRoutes } from "./routes/predictionRoutes.js";
import { createFileRoutes } from "./routes/fileRoutes.js";
import { createEnvironmentRoutes } from "./routes/environmentRoutes.js";
import { createMlService } from "./services/mlService.js";
import { createS3Service } from "./services/s3Service.js";
import { createNotificationService } from "./services/notificationService.js";

export function createApp(environment) {
  const app = express();
  const authMiddleware = requireAuth(environment.jwtSecret);
  const mlService = createMlService(environment.mlServiceUrl);
  const s3Service = createS3Service({ region: environment.awsRegion, bucket: environment.s3Bucket });
  const notificationService = createNotificationService({ region: environment.awsRegion, topicArn: environment.snsTopicArn, threshold: environment.snsRiskThreshold });
  const authController = createAuthController(environment);
  const predictionController = createPredictionController({ mlService, notificationService });
  const fileController = createFileController({ s3Service });

  if (environment.nodeEnv === "production") {
    app.set("trust proxy", 1);
  }

  app.use(helmet());
  app.use(cors({ origin: environment.frontendOrigin, credentials: true }));
  app.use(express.json({ limit: "20kb" }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

  const healthHandler = (_request, response) => {
    response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
  };
  app.get("/health", healthHandler);
  app.get("/api/health", healthHandler);
  app.use("/api/auth", createAuthRoutes(authController, authMiddleware));
  app.use("/api/environment", createEnvironmentRoutes(authMiddleware));
  app.use("/api/files", createFileRoutes(fileController, authMiddleware));
  app.use("/api/predictions", createPredictionRoutes(predictionController, authMiddleware));
  app.use(errorHandler);

  return app;
}
