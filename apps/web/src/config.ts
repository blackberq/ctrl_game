const LOCAL_SERVER_URL = "http://localhost:3001";
const PUBLIC_SERVER_URL = "https://idealness-unknowing-ladder.ngrok-free.dev";

/** Server URL — override with VITE_SERVER_URL in an .env file or GitHub variable. */
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? LOCAL_SERVER_URL : PUBLIC_SERVER_URL);
