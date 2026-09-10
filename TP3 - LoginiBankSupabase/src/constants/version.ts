/**
 * Metadatos y constantes de versión de la aplicación iBank.
 * Sincronizados con app.json y package.json.
 */
export const APP_METADATA = {
  name: 'iBank',
  slug: 'ibank',
  version: '1.0.0',
  scheme: 'ibanktp',
} as const;

export const APP_VERSION = APP_METADATA.version;
export const APP_SCHEME = APP_METADATA.scheme;
export const APP_NAME = APP_METADATA.name;
