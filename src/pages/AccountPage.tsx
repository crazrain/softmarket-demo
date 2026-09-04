import { useAuth } from '@/contexts/AuthContext';

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-surface-700">Please sign in to view account settings.</p>
      </div>
    );
  }

  return (
    <div className="container-narrow py-8">
      <h1 className="text-2xl font-bold text-surface-900">Account Settings</h1>
      <div className="mt-6 rounded-xl border border-surface-200 p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <span className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl">&#128100;</span>
          <div>
            <h2 className="text-lg font-semibold text-surface-900">{user.name}</h2>
            <p className="text-sm text-surface-500">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div><span className="text-sm text-surface-500">Role</span><p className="text-sm font-medium">{user.role}</p></div>
          <div><span className="text-sm text-surface-500">Member since</span><p className="text-sm font-medium">{user.joinDate}</p></div>
          <div><span className="text-sm text-surface-500">Email</span><p className="text-sm font-medium">{user.email}</p></div>
        </div>
      </div>
    </div>
  );
}
