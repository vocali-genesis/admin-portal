import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const { query } = router;
    if (query.error) {
      console.error('OAuth error:', query.error);
    } else if (query.access_token) {
      setAuthenticated(true);
    }

    return () => {
      // Optional cleanup
    };
  }, [router]);

  useEffect(() => {
    if (authenticated) {
      router.push('/app/dashboard');
    }
  }, [authenticated, router]);

  return <div>Processing authentication...</div>;
}