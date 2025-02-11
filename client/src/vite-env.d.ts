interface ImportMetaEnv {
  VITE_SERVER_URL: string;
  VITE_AUTH_BASE_PATH: string;
  VITE_CONTACT_BASE_PATH: string;
  VITE_MESSAGE_BASE_PATH: string;
  VITE_GROUP_BASE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
