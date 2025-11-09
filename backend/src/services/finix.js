import "dotenv/config";

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from(`${process.env.FINIX_API_USERNAME}:${process.env.FINIX_API_PASSWORD}`).toString('base64')}`
};

const finixApi = async (endpoint, options) => {
  const url = `${process.env.FINIX_API_URL}${endpoint}`;
  const response = await fetch(url, { headers, ...options });
  if (!response.ok) {
    const error = await response.json();
    console.error(`Finix API error on ${endpoint}:`, JSON.stringify(error));
    throw error;
  }
  return response.json();
};

export default finixApi;
