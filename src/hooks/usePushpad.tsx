import { useEffect } from "react";
import axios from "axios";

declare global {
  interface Window {
    pushpad?: ((...args: any[]) => void) & { q?: any[] };
  }
}

const usePushpad = () => {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const script = document.createElement("script");
    script.src = "https://pushpad.xyz/pushpad.js";
    script.async = true;

    script.onload = () => {
      console.log("📦 Script pushpad.js cargado");

      // Esperar a que Pushpad esté listo
      const waitForRealPushpad = () => {
        if (typeof window.pushpad !== "function" || window.pushpad.q) {
          setTimeout(waitForRealPushpad, 100);
          return;
        }

        console.log("✅ Pushpad está listo");

        axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/auth/pushpad-signature`, {
            params: { userId },
          })
          .then(async ({ data }) => {
            const { uid, uid_signature } = data.data?.records || {};
            if (!uid || !uid_signature) {
              console.error("❌ UID o firma faltante");
              return;
            }

            console.log("📩 UID recibido:", uid);

            window.pushpad?.("init", 8992);
            window.pushpad?.("user", { uid, uid_signature });
            window.pushpad?.("widget");

            if (window.sessionStorage.getItem("notification-status") !== "subscribed") {
              window.pushpad?.("subscribe", async (isSubscribed: boolean) => {
                if (isSubscribed) {
                  console.log("🎉 Suscripción exitosa");

                  try {
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/pushpad-confirm`, { userId });
                    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/fcm`, { userId, uid });
                    window.sessionStorage.setItem("notification-status", "subscribed");
                  } catch (error) {
                    console.error("❌ Error al confirmar en backend:", error);
                  }
                } else {
                  console.warn("🚫 El usuario rechazó la suscripción");
                }
              });
            }
          })
          .catch((err) => {
            console.error("❌ Error al obtener firma de Pushpad:", err);
          });
      };

      waitForRealPushpad();
    };

    script.onerror = () => {
      console.error("❌ Error cargando pushpad.js");
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};

export default usePushpad;
