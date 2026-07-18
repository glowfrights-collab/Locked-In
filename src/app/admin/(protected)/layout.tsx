import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-semibold text-ink">
          Admin
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-ink-soft">
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/activity">Activity</Link>
          <Link href="/" className="text-ink-faint">
            View site
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
