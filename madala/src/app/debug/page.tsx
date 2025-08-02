'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch token info for debugging
    fetch('/api/debug/token')
      .then(res => res.json())
      .then(data => setTokenInfo(data))
      .catch(err => console.error('Error fetching token:', err));
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Session & Token</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Session Status:</h2>
          <p>{status}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
          <pre className="whitespace-pre-wrap bg-white p-2 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Token Info:</h2>
          <pre className="whitespace-pre-wrap bg-white p-2 rounded">
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>

        {session?.user && (
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">User Info:</h2>
            <p><strong>ID:</strong> {session.user.id}</p>
            <p><strong>Name:</strong> {session.user.name}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Roles:</strong> {(session.user as any)?.roles}</p>
            <p><strong>Image:</strong> {session.user.image}</p>
          </div>
        )}
      </div>
    </div>
  );
}
