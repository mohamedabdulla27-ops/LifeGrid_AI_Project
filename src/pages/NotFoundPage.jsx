import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';

export default function NotFoundPage() {
  return (
    <div className="grid-bg flex min-h-screen items-center justify-center bg-ink-950 p-6">
      <div className="panel max-w-md p-8 text-center">
        <Icon name="alertTriangle" className="mx-auto h-10 w-10 text-amber" />
        <h1 className="mt-4 font-display text-2xl font-semibold">Route not found</h1>
        <p className="mt-2 text-sm text-mint-muted">This view does not exist on the LifeGrid console.</p>
        <Link to="/dashboard" className="btn-signal mt-6">Back to Mission Control</Link>
      </div>
    </div>
  );
}
