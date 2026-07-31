export function AdminDataNotice({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <p
      className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      role="alert"
    >
      Content could not be loaded safely. Check the Supabase configuration and
      policies, then try again.
    </p>
  );
}
