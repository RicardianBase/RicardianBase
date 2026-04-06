import { useState, useEffect } from "react";
import { Shield, Key, Bell, User, Copy, RefreshCw, Check, X, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useProfile, useUpdateProfile, useUpdateNotifications } from "@/hooks/api/useProfile";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "@/hooks/api/useApiKeys";
import type { NewApiKey } from "@/types/api";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API Keys", icon: Key },
];

const notificationKeys = [
  { key: "email", label: "Email notifications" },
  { key: "milestones", label: "Milestone updates" },
  { key: "payments", label: "Payment alerts" },
  { key: "disputes", label: "Dispute notifications" },
  { key: "digest", label: "Weekly digest" },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { ref, isInView } = useInViewAnimation();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateNotifMutation = useUpdateNotifications();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setEmail(profile.email ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      display_name: displayName || undefined,
      email: email || undefined,
    });
  };

  const handleSaveAvatar = () => {
    updateProfileMutation.mutate(
      { avatar_url: newAvatarUrl || undefined },
      {
        onSuccess: () => {
          setAvatarUrl(newAvatarUrl);
          setShowAvatarModal(false);
          setNewAvatarUrl("");
        },
      },
    );
  };

  const handleToggleNotif = (key: string, checked: boolean) => {
    updateNotifMutation.mutate({ [key]: checked });
  };

  return (
    <div ref={ref} className="space-y-6">
      <h1 className={`text-2xl font-medium text-foreground ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`md:w-[200px] flex-shrink-0 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.id
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:bg-[hsl(230,25%,95%)]"
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex-1 bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl font-medium text-white">
                    {isLoading ? "..." : getInitials(profile?.display_name)}
                  </div>
                )}
                <button
                  onClick={() => { setNewAvatarUrl(avatarUrl); setShowAvatarModal(true); }}
                  className="text-xs font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors"
                >
                  Change Avatar
                </button>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 bg-muted animate-pulse rounded-xl" />
                  <div className="h-10 bg-muted animate-pulse rounded-xl" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full border border-[hsl(230,20%,90%)] rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="text-sm font-medium bg-emerald-500 text-white px-6 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                  {updateProfileMutation.isSuccess && (
                    <p className="text-xs text-emerald-600">Profile updated successfully!</p>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              {notificationKeys.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-[hsl(230,20%,94%)] last:border-0">
                  <span className="text-sm text-foreground">{label}</span>
                  <label className="relative inline-flex cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile?.notification_prefs?.[key] ?? true}
                      onChange={(e) => handleToggleNotif(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[hsl(230,20%,85%)] rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <SecurityTab wallets={profile?.wallets ?? []} />
          )}

          {activeTab === "api" && <ApiKeysTab />}
        </div>
      </div>

      {showAvatarModal && (
        <AvatarModal
          currentUrl={newAvatarUrl}
          onChange={setNewAvatarUrl}
          onSave={handleSaveAvatar}
          onCancel={() => { setShowAvatarModal(false); setNewAvatarUrl(""); }}
          saving={updateProfileMutation.isPending}
        />
      )}
    </div>
  );
};

// ---- Security Tab ----
const SecurityTab = ({ wallets }: { wallets: { address: string; provider: string; chain: string; is_primary: boolean }[] }) => {
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(addr);
    setTimeout(() => setCopiedAddr(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[hsl(230,25%,96%)] rounded-xl p-5 flex items-center justify-between opacity-60">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Coming soon — wallet signing provides base-level security</p>
          </div>
        </div>
        <button
          disabled
          className="text-xs font-medium bg-[hsl(230,20%,85%)] text-muted-foreground px-4 py-2 rounded-full cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>

      <div className="bg-[hsl(230,25%,96%)] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Key size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Connected Wallets</p>
            <p className="text-xs text-muted-foreground">
              {wallets.length} wallet{wallets.length !== 1 ? "s" : ""} connected
            </p>
          </div>
        </div>
        {wallets.length === 0 ? (
          <p className="text-xs text-muted-foreground">No wallets connected</p>
        ) : (
          <div className="space-y-2">
            {wallets.map((w) => (
              <div key={w.address} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground capitalize">{w.provider}</span>
                    {w.is_primary && (
                      <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Primary</span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground truncate">{w.address}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(w.address)}
                    className="w-7 h-7 rounded-full hover:bg-[hsl(230,25%,92%)] flex items-center justify-center"
                    title="Copy address"
                  >
                    {copiedAddr === w.address ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-muted-foreground" />}
                  </button>
                  <a
                    href={`https://basescan.org/address/${w.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full hover:bg-[hsl(230,25%,92%)] flex items-center justify-center"
                    title="View on Basescan"
                  >
                    <ExternalLink size={12} className="text-muted-foreground" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- API Keys Tab ----
const ApiKeysTab = () => {
  const { data: keys, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();
  const [newKey, setNewKey] = useState<NewApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyName, setKeyName] = useState("");

  const handleCreate = async () => {
    const key = await createMutation.mutateAsync(keyName || undefined);
    setNewKey(key);
    setKeyName("");
  };

  const handleCopy = () => {
    if (newKey?.key) {
      navigator.clipboard.writeText(newKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    await revokeMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-4">
      {newKey && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-emerald-700 mb-1">New key created — save it now!</p>
            <p className="text-[10px] text-emerald-600">You won't be able to see this key again.</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-foreground font-mono bg-white rounded-lg px-3 py-2 truncate border border-emerald-200">
              {newKey.key}
            </code>
            <button
              onClick={handleCopy}
              className="w-9 h-9 rounded-lg bg-white hover:bg-emerald-100 flex items-center justify-center transition-colors border border-emerald-200"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-emerald-700" />}
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
          >
            I've saved it
          </button>
        </div>
      )}

      <div className="bg-[hsl(230,25%,96%)] rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-3">Create a new API key</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Key name (optional)"
            className="flex-1 border border-[hsl(230,20%,90%)] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white"
          />
          <button
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {createMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Generate
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading keys...</p>
      ) : !keys?.length ? (
        <p className="text-sm text-muted-foreground text-center py-4">No API keys yet</p>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="bg-[hsl(230,25%,96%)] rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{k.name}</p>
                <p className="text-xs font-mono text-muted-foreground truncate">{k.key_prefix}...</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  Created {new Date(k.created_at).toLocaleDateString()}
                  {k.last_used_at ? ` • Last used ${new Date(k.last_used_at).toLocaleDateString()}` : " • Never used"}
                </p>
              </div>
              <button
                onClick={() => handleRevoke(k.id)}
                disabled={revokeMutation.isPending}
                className="w-8 h-8 rounded-full hover:bg-[hsl(340,40%,94%)] text-muted-foreground hover:text-[hsl(340,60%,50%)] flex items-center justify-center transition-colors disabled:opacity-50"
                title="Revoke key"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Avatar Modal ----
const AvatarModal = ({ currentUrl, onChange, onSave, onCancel, saving }: {
  currentUrl: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-medium text-foreground">Change Avatar</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          {currentUrl && (
            <div className="flex justify-center">
              <img src={currentUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Avatar URL</label>
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Paste a URL to an image. Leave empty to remove.</p>
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full text-sm font-medium bg-emerald-500 text-white px-4 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
