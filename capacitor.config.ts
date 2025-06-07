
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0a81ecdfe680466dbaed80c8fecdd156',
  appName: 'invoice-creator-pro-31',
  webDir: 'dist',
  server: {
    url: 'https://0a81ecdf-e680-466d-baed-80c8fecdd156.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#262626',
      showSpinner: false
    }
  }
};

export default config;
