import React from 'react';
import './globals.css';

export default function HomeOwnersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '250px', background: '#f4f4f4', padding: '1rem' }}>
        <h2>Sidebar</h2>
        <ul>
          <li>Link 1</li>
          <li>Link 2</li>
          <li>Link 3</li>
        </ul>
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}
