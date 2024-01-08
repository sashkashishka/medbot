/// <reference types="vite/client" />

// eslint-disable-next-line
interface ImportMetaEnv {
  readonly VITE_TG_BOT: string
  // more env variables...
}

// eslint-disable-next-line
interface ImportMeta {
  readonly env: ImportMetaEnv
}
