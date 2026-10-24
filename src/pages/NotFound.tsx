import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page flex min-h-[50vh] flex-col items-start justify-center gap-4 py-16">
      <h1 className="text-5xl sm:text-6xl">We can’t find that page.</h1>
      <p className="text-lg text-mute">The link may be old, or the piece may be gone.</p>
      <Link to="/" className="btn-primary mt-2">Back to the shop</Link>
    </div>
  );
}
