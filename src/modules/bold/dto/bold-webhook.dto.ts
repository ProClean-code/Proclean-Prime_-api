export interface BoldWebhookDto {
  id: string;
  type: string;
  subject: string;

  data: {
    payment_id: string;

    metadata: {
      reference: string;
    };
  };
}
