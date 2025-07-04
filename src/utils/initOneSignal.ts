// src/utils/initOneSignal.ts
export const initOneSignal = () => {
  if (typeof window === 'undefined') return;

  // Evita doble inicialización
  if ((window as any).OneSignal?.initialized) return;

  const OneSignal = (window as any).OneSignal || [];
  OneSignal.push(function () {
    OneSignal.init({
      appId: "4938c21a-41cf-484f-9a47-49a0baa3bd84",
      notifyButton: {
        enable: true,
      },
      allowLocalhostAsSecureOrigin: true, // necesario para localhost
    });

    (window as any).OneSignal.initialized = true;
  });

  (window as any).OneSignal = OneSignal;
};
