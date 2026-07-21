import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '0 24px' }}>
      <div>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link href="/">Return home</Link>
      </div>
    </div>
  );
}
