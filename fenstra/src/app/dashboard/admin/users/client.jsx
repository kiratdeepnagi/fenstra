"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header, Toast, useToast } from "@/components/ui";

export function AdminUsersClient({ initialUsers, currentUserId }) {
  const supabase = createClient();
  const { toast, show: showToast, clear } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState("");

  const filtered = users.filter(
    (u) =>
      (u.full_name || "").toLowerCase().includes(q.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(q.toLowerCase())
  );

  const changeRole = async (id, role) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) { showToast(error.message, "error"); return; }
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
    showToast("Role updated");
  };

  return (
    <div>
      <Toast {...toast} onDone={clear} />
      <Header title="Users" subtitle={`${users.length} accounts in total.`} />

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input placeholder="Search users" value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-300 rounded-xl focus:border-neutral-900 outline-none text-sm" />
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-mono uppercase tracking-wider text-neutral-500">User</th>
                <th className="text-left px-4 py-3 font-mono uppercase tracking-wider text-neutral-500">Role</th>
                <th className="text-left px-4 py-3 font-mono uppercase tracking-wider text-neutral-500">Company</th>
                <th className="text-left px-4 py-3 font-mono uppercase tracking-wider text-neutral-500">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.full_name || "—"}</div>
                    <div className="text-xs text-neutral-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={u.id === currentUserId}
                      className="px-2 py-1 bg-neutral-100 rounded-full text-xs capitalize disabled:opacity-60 disabled:cursor-not-allowed">
                      <option value="customer">customer</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </select>
                    {u.id === currentUserId && (
                      <span className="ml-2 text-[10px] text-neutral-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{u.company_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                    {new Date(u.created_at).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500 text-sm">
                    No users match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
        <strong>Tip:</strong> To fully disable an account or delete a user, use Supabase → Authentication → Users.
        Role changes made here sync immediately with the user's next request.
      </div>
    </div>
  );
}
