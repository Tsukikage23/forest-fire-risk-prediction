import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export function createNotificationService({ region, topicArn, threshold }) {
  const client = region && topicArn ? new SNSClient({ region }) : null;

  return {
    isThresholdCrossed({ prediction, probability }) {
      return Number(probability) >= threshold;
    },

    async notifyRisk({ userEmail, prediction, probability, modelVersion }) {
      if (!client || !topicArn) return { sent: false, reason: "SNS is not configured" };

      const command = new PublishCommand({
        TopicArn: topicArn,
        Subject: "FireGuard model result",
        Message: JSON.stringify({
          message: "A FireGuard prediction crossed the configured notification threshold.",
          userEmail,
          prediction,
          probability,
          modelVersion,
          disclaimer: "This is a software prototype result, not a certified emergency warning.",
        }),
      });
      await client.send(command);
      return { sent: true };
    },
  };
}
