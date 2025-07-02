// src/components/NovuInApp.tsx
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';
import { useEffect, useState } from 'react';

const novuSubscriberId = localStorage.getItem('userEmail') || 'anon@example.com';

const NovuInApp = () => {
  const [subscriberId, setSubscriberId] = useState(novuSubscriberId);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setSubscriberId(storedEmail);
    }
  }, []);

  return (
    <NovuProvider
      subscriberId={subscriberId}
      applicationIdentifier="ljkEgDjAYzig" // <-- Reemplaza con tu App ID real
    >
      <PopoverNotificationCenter>
        {({ unseenCount }) => (
          <NotificationBell unseenCount={unseenCount} />
        )}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

export default NovuInApp;
