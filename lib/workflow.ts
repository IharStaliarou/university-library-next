import { Client as Qstash } from '@upstash/qstash';
import { Client as WorkflowClient } from '@upstash/workflow';
import config from './config';

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

export const qstashClient = new Qstash({
  token: config.env.upstash.qstashToken!,
});

export const sendEmail = async ({
  email,
  subject,
  message,
  fullName,
  templateId,
}: {
  email: string;
  subject: string;
  message: string;
  fullName: string;
  templateId: string;
}) => {
  try {
    console.log('Publishing email to QStash:', { email, templateId });

    const result = await qstashClient.publishJSON({
      url: `${config.env.prodApiEndpoint}/api/emailjs-send`,
      body: {
        email,
        subject,
        message,
        fullName,
        templateId,
      },
      retries: 3,
    });

    console.log('Email published to QStash successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to publish email to QStash:', error);
    throw error;
  }
};
