export const metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-navy-50/50">{children}</div>;
}
