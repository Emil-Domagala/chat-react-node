interface ImportMetaEnv {
  VITE_SERVER_URL: string;
  VITE_AUTH_BASE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
