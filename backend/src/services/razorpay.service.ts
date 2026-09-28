import crypto from 'node:crypto';

const razorpayBaseUrl = 'https://api.razorpay.com/v1';

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay credentials are not configured');
  return { keyId, keySecret };
};

export const createRazorpayOrder = async (amountInRupees: number, receipt: string) => {
  const { keyId, keySecret } = getCredentials();
  const response = await fetch(`${razorpayBaseUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: Math.round(amountInRupees * 100), currency: 'INR', receipt }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Razorpay order creation failed: ${body}`);
  }
  return response.json();
};

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
  const { keySecret } = getCredentials();
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const actualBuffer = Buffer.from(String(signature), 'utf8');
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};
