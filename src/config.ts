// URL of the phone-catalog-backend service (separate repo/deploy). Falls
// back to localhost for local development against `npm run dev` there.
// The trailing slash is stripped so callers can safely append paths like
// `/api/products` without producing a double slash.
export const API_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:4000'
).replace(/\/+$/, '');
