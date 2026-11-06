import { createClient } from "./supabase/server.js";

export async function getAdminDirectory(client) {
  const supabase = client || await createClient();
  if (!supabase) return [];

  // These tables both reference auth.users but not each other, so PostgREST
  // cannot embed roles in a profiles query. Load the admin-protected data
  // separately and join it here instead.
  const [profilesResult, rolesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, user_name")
      .order("user_name", { ascending: true }),
    supabase.from("user_roles").select("user_id, role"),
  ]);

  if (profilesResult.error || rolesResult.error) {
    console.error("Could not load the admin directory", profilesResult.error?.message || rolesResult.error?.message);
    return [];
  }

  const rolesByUser = new Map();
  rolesResult.data.forEach(({ user_id, role }) => {
    rolesByUser.set(user_id, [...(rolesByUser.get(user_id) || []), role]);
  });

  return profilesResult.data.map((profile) => ({
    ...profile,
    roles: rolesByUser.get(profile.id) || [],
  }));
}
