export function Footer() {
  return (
    <footer className="admin-footer border-top bg-white py-3 px-4">
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted small">
          &copy; {new Date().getFullYear()} just-eat.ch &mdash; Admin Dashboard
        </span>
        <span className="text-muted small">v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
      </div>
    </footer>
  );
}
