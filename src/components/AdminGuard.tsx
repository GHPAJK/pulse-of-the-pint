import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldX } from "lucide-react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    async function checkAdmin() {
      // Double gate: must be @goodhumanpartners.com AND in admin_users table
      const email = user!.email || "";
      if (!email.endsWith("@goodhumanpartners.com")) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user!.id)
        .single();

      setIsAdmin(!!data);
      setChecking(false);
    }

    checkAdmin();
  }, [user, authLoading, navigate]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">This area is restricted to GHP administrators.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
