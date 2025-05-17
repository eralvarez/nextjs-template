'use client';

import dynamic from 'next/dynamic';

// 👇 we'll create this in step 4
const App = dynamic(() => import('spa-routes/app'), { ssr: false });

export default function Home() {
  return <App />;
}
