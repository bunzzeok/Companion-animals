import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.companionanimals.app',
  appName: 'Companion Animals',
  webDir: 'out', // Next.js static export directory
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Camera plugin for pet photo uploads
    Camera: {
      permissions: ['camera', 'photos']
    },
    // Geolocation for location-based features
    Geolocation: {
      permissions: ['location']
    },
    // Push notifications for adoption updates
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    // Local notifications for reminders
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#FF6B35'
    },
    // File sharing for pet images
    Share: {},
    // Device info for analytics
    Device: {},
    // Network status for offline support
    Network: {},
    // Status bar styling
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FF6B35'
    },
    // Splash screen configuration
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  ios: {
    // iOS specific configurations
    scheme: 'Companion Animals',
    contentInset: 'automatic',
    allowsLinkPreview: false,
    handleApplicationNotifications: true
  },
  android: {
    // Android specific configurations
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'CompanionAnimals/1.0',
    overrideUserAgent: undefined,
    backgroundColor: '#FFFFFF',
    // Enable hardware acceleration
    useLegacyBridge: false
  }
};

export default config;
