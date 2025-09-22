// Profile.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, Upload, Save, Lock, Trash2, User, Bell, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/* ------- Simple Accessible Toggle (peer-based) ------- */
function Toggle({
  id,
  checked,
  onChange,
}: {
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-checked={checked}
      />
      <div className="w-11 h-6 bg-slate-200 peer-checked:bg-indigo-600 rounded-full transition-colors" />
      <span className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 flex items-center justify-center shadow">
        {checked ? <Check className="w-3 h-3 text-indigo-600" /> : null}
      </span>
    </label>
  );
}

/* ------- Profile type ------- */
type ProfileShape = {
  id: string | null;
  username: string;
  phone?: string | null;
  hobbies?: string | null;
  profile_pic?: string | null;
  email_visible: boolean;
  phone_visible: boolean;
  all_notifications: boolean;
  mood_reminders: boolean;
  community_updates: boolean;
  updated_at?: string | null;
};

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileShape>({
    id: userId,
    username: user?.email?.split("@")[0] ?? "User",
    phone: null,
    hobbies: null,
    profile_pic: null,
    email_visible: true,
    phone_visible: false,
    all_notifications: true,
    mood_reminders: true,
    community_updates: false,
    updated_at: new Date().toISOString(),
  });
  const [status, setStatus] = useState<string | null>(null);

  /* -------- Load or create profile row -------- */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (error) {
          // no row found -> create default row
          // (if RLS denies insert, make sure policy allows auth.uid() = id)
          const defaultRow = {
            id: userId,
            username: user?.email?.split("@")[0] ?? "User",
            email_visible: true,
            phone_visible: false,
            all_notifications: true,
            mood_reminders: true,
            community_updates: false,
            profile_pic: null,
            updated_at: new Date().toISOString(),
          };
          const { error: upsertErr, data: upsertData } = await supabase
            .from("profiles")
            .upsert(defaultRow)
            .select()
            .single();
          if (upsertErr) {
            console.error("Failed to upsert default profile:", upsertErr);
          } else if (mounted && upsertData) {
            setProfile((p) => ({ ...p, ...upsertData }));
          }
        } else {
          if (mounted && data) setProfile((p) => ({ ...p, ...data }));
        }
      } catch (err) {
        console.error("Load profile error", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId, user]);

  /* -------- Generic update: optimistic + full upsert --------
     We update local state first, then upsert the ENTIRE profile snapshot to avoid
     partially overwriting other fields. If the upsert fails we revert by refetching.
  -------- */
  const upsertProfileSnapshot = async (nextSnapshot: Partial<ProfileShape>) => {
    if (!userId) return;
    // build newest snapshot from current profile state
    setProfile((prev) => {
      const merged = { ...prev, ...nextSnapshot, updated_at: new Date().toISOString() };
      // fire-and-forget upsert (we handle error below)
      (async () => {
        try {
          const { data, error } = await supabase.from("profiles").upsert(merged).select().single();
          if (error) {
            console.error("Upsert error:", error);
            // revert by refetching
            const { data: fresh, error: fetchErr } = await supabase.from("profiles").select("*").eq("id", userId).single();
            if (!fetchErr && fresh) setProfile(fresh);
            setStatus("Failed to save changes");
            setTimeout(()=>setStatus(null), 3000);
          } else if (data) {
            setProfile(data);
            setStatus("Saved");
            setTimeout(()=>setStatus(null), 1500);
          }
        } catch (err) {
          console.error("Upsert exception:", err);
          setStatus("Save error");
          setTimeout(()=>setStatus(null), 3000);
        }
      })();
      return merged;
    });
  };

  /* -------- field-specific wrapper for easier callbacks -------- */
  const updateField = async <K extends keyof ProfileShape>(field: K, value: ProfileShape[K]) => {
    await upsertProfileSnapshot({ [field]: value } as Partial<ProfileShape>);
  };

  /* -------- Save account info (username / phone / hobbies) in one shot -------- */
  const saveAccountInfo = async () => {
    if (!userId) return;
    setSaving(true);
    await upsertProfileSnapshot({
      username: profile.username,
      phone: profile.phone ?? null,
      hobbies: profile.hobbies ?? null,
    });
    setSaving(false);
  };

  /* -------- Profile pic upload to Supabase Storage --------
     - Requires a storage bucket called 'avatars' (public or use signed urls).
  -------- */
  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    try {
      // build unique path
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      // upload
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadErr) {
        console.error("Upload to storage failed:", uploadErr);
        setStatus("Image upload failed");
        setTimeout(()=>setStatus(null), 3000);
        return;
      }
      // get public url
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = (publicData as any)?.publicUrl || null;
      if (!publicUrl) {
        console.warn("No public URL returned. You may need a public bucket or use signed URLs.");
      }
      // persist URL to profile
      await updateField("profile_pic", publicUrl);
    } catch (err) {
      console.error("Profile pic error:", err);
      setStatus("Image upload error");
      setTimeout(()=>setStatus(null), 3000);
    }
  };

  /* -------- Delete account (client-only button; server handling required) -------- */
  const handleDeleteAccountClick = async () => {
    // show confirm dialog (simple)
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      // Option A: delete profile row (the auth user deletion must be done securely server-side or via Supabase admin)
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      if (error) {
        console.error("Failed to delete profile row:", error);
        setStatus("Failed to delete account");
      } else {
        setStatus("Profile row deleted (auth deletion still required)");
      }
    } catch (err) {
      console.error(err);
      setStatus("Deletion error");
    }
    setTimeout(()=>setStatus(null), 3000);
  };

  if (loading) {
    return <div className="p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">{t('profile.title') || 'Profile Settings'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {/* Profile Pic */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t('profile.picture') || 'Profile Picture'}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                {profile.profile_pic ? (
                  <AvatarImage src={profile.profile_pic} alt={profile.username ?? "avatar"} />
                ) : (
                  <AvatarFallback>{profile.username?.charAt(0)?.toUpperCase() ?? <User />}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-col items-center gap-2">
                <input id="avatarUpload" type="file" accept="image/*" onChange={handleProfilePicUpload} className="hidden" />
                <label htmlFor="avatarUpload" className="text-indigo-600 cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {t('profile.uploadPhoto') || 'Upload photo'}
                </label>
                <p className="text-xs text-slate-500">{t('profile.uploadHint') || 'Recommended: square image, under 2MB'}</p>

              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="rounded-2xl col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('profile.accountInfo') || 'Account Info'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('profile.displayName') || 'Display Name'}</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    value={profile.username}
                    onChange={(e) => setProfile(p => ({ ...p, username: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") saveAccountInfo(); }}
                  />
                  <Button onClick={saveAccountInfo} size="sm" disabled={saving} className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? t('common.loading') : t('common.save')}
                  </Button>
                </div>
              </div>

              <div>
                <Label>{t('profile.phone') || 'Phone (optional)'}</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    value={profile.phone ?? ""}
                    placeholder="+91 9876543210"
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") saveAccountInfo(); }}
                  />
                  <Button onClick={saveAccountInfo} size="sm" className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> {t('common.save')}
                  </Button>
                </div>
              </div>

              <div>
                <Label>{t('profile.hobbies') || 'Hobbies / Interests'}</Label>
                <Input
                  value={profile.hobbies ?? ""}
                  onChange={(e) => setProfile(p => ({ ...p, hobbies: e.target.value }))}
                  placeholder="Reading, Coding, Music"
                />
                <p className="text-xs text-slate-500 mt-1">{t('profile.hobbiesHint') || 'Comma separated'}</p>
              </div>

              <div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {t('profile.changePassword') || 'Change password'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t('profile.notifications') || 'Notifications'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="font-medium">{t('profile.allNotifications') || 'All notifications'}</div>
                    <div className="text-sm text-slate-500">{t('profile.masterSwitch') || 'Master switch'}</div>
                  </div>
                </div>
                <Toggle checked={!!profile.all_notifications} onChange={(v) => updateField("all_notifications", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="font-medium">{t('profile.moodReminders') || 'Mood check-in reminders'}</div>
                    <div className="text-sm text-slate-500">{t('profile.periodicPrompts') || 'Periodic prompts'}</div>
                  </div>
                </div>
                <Toggle checked={!!profile.mood_reminders} onChange={(v) => updateField("mood_reminders", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="font-medium">{t('profile.communityUpdates') || 'Community updates'}</div>
                    <div className="text-sm text-slate-500">{t('profile.groupActivity') || 'Group activity'}</div>
                  </div>
                </div>
                <Toggle checked={!!profile.community_updates} onChange={(v) => updateField("community_updates", v)} />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t('profile.privacy') || 'Privacy & Security'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('profile.emailVisibility') || 'Email visibility'}</div>
                  <div className="text-sm text-slate-500">{t('profile.emailVisibilityHint') || 'Show email on profile'}</div>
                </div>
                <Toggle checked={!!profile.email_visible} onChange={(v) => updateField("email_visible", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('profile.phoneVisibility') || 'Phone visibility'}</div>
                  <div className="text-sm text-slate-500">{t('profile.phoneVisibilityHint') || 'Show phone on profile'}</div>
                </div>
                <Toggle checked={!!profile.phone_visible} onChange={(v) => updateField("phone_visible", v)} />
              </div>

              <div>
                <Button variant="destructive" onClick={handleDeleteAccountClick} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> {t('profile.deleteAccount') || 'Delete Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {status && <div className="mt-4 text-sm text-slate-700">{status}</div>}
      </div>
    </div>
  );
}
