import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.bergeres.traqueurlive',
  appName: 'Traqueur Live',
  webDir: 'www',
  android: {
    useLegacyBridge: true
  },
  plugins: {
    // Les envois vers Apps Script passent par le réseau natif : Android ne
    // bride pas les requêtes après 5 min d'arrière-plan.
    CapacitorHttp: { enabled: true }
  }
};

export default config;
