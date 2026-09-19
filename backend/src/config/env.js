import "dotenv/config";

const requiredEnvironment = ["MONGODB_URI", "JWT_SECRET", "ML_SERVICE_URL"];

export function getEnvironment() {
  const missing = requiredEnvironment.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 5001),
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    mlServiceUrl: process.env.ML_SERVICE_URL,
    frontendOrigin: process.env.FRONTEND_ORIGIN
      ? (process.env.FRONTEND_ORIGIN.includes(",")
          ? process.env.FRONTEND_ORIGIN.split(",").map((s) => s.trim())
          : process.env.FRONTEND_ORIGIN)
      : ["http://localhost:5173", "http://127.0.0.1:5173"],
    awsRegion: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
    snsTopicArn: process.env.AWS_SNS_TOPIC_ARN,
    snsRiskThreshold: Number(process.env.SNS_RISK_THRESHOLD ?? 0.7),
  };
}
