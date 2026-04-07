import { useState, useEffect } from "react";
import { Shield, Key, Bell, User, Copy, RefreshCw, Check, X, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useProfile, useUpdateProfile, useUpdateNotifications } from "@/hooks/api/useProfile";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "@/hooks/api/useApiKeys";
import type { NewApiKey, ApiKeyScope } from "@/types/api";
import { getStoredUser, setStoredUser } from "@/lib/auth";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API Keys", icon: Key, disabled: true },
];

const notificationKeys = [
  { key: "milestones", label: "Milestone updates" },
  { key: "payments", label: "Payment alerts" },
  { key: "disputes", label: "Dispute notifications" },
];

function getInitials(username: string | null | undefined, displayName: string | null | undefined): string {
  if (username) return username.slice(0, 2).toUpperCase();
  if (displayName) return displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return "??";
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { ref, isInView } = useInViewAnimation();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateNotifMutation = useUpdateNotifications();

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  const handleSaveProfile = () => {
    const trimmed = username.trim();
    updateProfileMutation.mutate(
      { username: trimmed || undefined },
      {
        onSuccess: () => {
          const storedUser = getStoredUser();
          if (storedUser) {
            setStoredUser({ ...storedUser, username: trimmed });
          }
        },
      },
    );
  };

  const handleSaveAvatar = (dataUrl: string) => {
    updateProfileMutation.mutate(
      { avatar_url: dataUrl || undefined },
      {
        onSuccess: () => {
          setAvatarUrl(dataUrl);
          setShowAvatarModal(false);
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
                onClick={() => !t.disabled && setActiveTab(t.id)}
                disabled={t.disabled}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  t.disabled
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : activeTab === t.id
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:bg-[hsl(230,25%,95%)]"
                }`}
              >
                <t.icon size={16} />
                {t.label}
                {t.disabled && <span className="text-[10px] bg-[hsl(230,20%,90%)] text-muted-foreground/60 px-1.5 py-0.5 rounded-full">Soon</span>}
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
                    {isLoading ? "..." : getInitials(profile?.username, profile?.display_name)}
                  </div>
                )}
                <button
                  onClick={() => setShowAvatarModal(true)}
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
                    <label className="text-xs text-muted-foreground mb-1.5 block">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-[hsl(230,20%,90%)] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
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
          onSave={handleSaveAvatar}
          onCancel={() => setShowAvatarModal(false)}
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
const SCOPE_OPTIONS: { value: ApiKeyScope; label: string; description: string; color: string }[] = [
  { value: "read", label: "Read", description: "View contracts, milestones, disputes, dashboard", color: "bg-blue-100 text-blue-700" },
  { value: "write", label: "Write", description: "Create and update contracts and milestones", color: "bg-amber-100 text-amber-700" },
  { value: "payments", label: "Payments", description: "Access wallet balances, transactions, escrow reports", color: "bg-emerald-100 text-emerald-700" },
  { value: "disputes", label: "Disputes", description: "Create and manage disputes", color: "bg-red-100 text-red-700" },
  { value: "admin", label: "Admin", description: "Full access to all API endpoints", color: "bg-purple-100 text-purple-700" },
];

const EXPIRY_OPTIONS = [
  { value: null, label: "Never expires" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "1 year" },
];

const ApiKeysTab = () => {
  const { data: keys, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();
  const [newKey, setNewKey] = useState<NewApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<ApiKeyScope[]>(["read"]);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);

  const toggleScope = (scope: ApiKeyScope) => {
    if (scope === "admin") {
      setSelectedScopes(selectedScopes.includes("admin") ? ["read"] : ["admin"]);
      return;
    }
    setSelectedScopes((prev) => {
      const filtered = prev.filter((s) => s !== "admin");
      return filtered.includes(scope)
        ? filtered.filter((s) => s !== scope).length === 0 ? ["read"] : filtered.filter((s) => s !== scope)
        : [...filtered, scope];
    });
  };

  const handleCreate = async () => {
    const key = await createMutation.mutateAsync({
      name: keyName || undefined,
      scopes: selectedScopes,
      expires_in_days: expiresInDays,
    });
    setNewKey(key);
    setKeyName("");
    setSelectedScopes(["read"]);
    setExpiresInDays(null);
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

  const getScopeColor = (scope: string) =>
    SCOPE_OPTIONS.find((s) => s.value === scope)?.color ?? "bg-gray-100 text-gray-700";

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

      <div className="bg-[hsl(230,25%,96%)] rounded-xl p-4 space-y-4">
        <p className="text-xs font-medium text-foreground">Create a new API key</p>

        <input
          type="text"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Key name (optional)"
          className="w-full border border-[hsl(230,20%,90%)] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white"
        />

        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Permissions</p>
          <div className="space-y-1.5">
            {SCOPE_OPTIONS.map((scope) => (
              <label
                key={scope.value}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedScopes.includes(scope.value) ? "bg-white shadow-sm" : "hover:bg-white/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedScopes.includes(scope.value)}
                  onChange={() => toggleScope(scope.value)}
                  className="accent-emerald-500 w-3.5 h-3.5"
                />
                <div className="flex-1">
                  <span className="text-xs font-medium text-foreground">{scope.label}</span>
                  <p className="text-[10px] text-muted-foreground">{scope.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Expiration</p>
          <div className="flex gap-2 flex-wrap">
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setExpiresInDays(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  expiresInDays === opt.value
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-muted-foreground hover:text-foreground border border-[hsl(230,20%,90%)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-600 hover:shadow-lg transition-all disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Generate Key
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading keys...</p>
      ) : !keys?.length ? (
        <p className="text-sm text-muted-foreground text-center py-4">No API keys yet</p>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => {
            const isExpired = k.expires_at && new Date(k.expires_at) < new Date();
            return (
              <div key={k.id} className={`bg-[hsl(230,25%,96%)] rounded-xl p-4 ${isExpired ? "opacity-50" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{k.name}</p>
                      {isExpired && (
                        <span className="text-[10px] font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Expired</span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground truncate">{k.key_prefix}...</p>
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
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {(k.scopes ?? []).map((s) => (
                    <span key={s} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getScopeColor(s)}`}>
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/60">
                  Created {new Date(k.created_at).toLocaleDateString()}
                  {k.last_used_at ? ` • Last used ${new Date(k.last_used_at).toLocaleDateString()}` : " • Never used"}
                  {k.expires_at && !isExpired ? ` • Expires ${new Date(k.expires_at).toLocaleDateString()}` : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---- Avatar Modal with Crop + NSFW check ----
const AvatarModal = ({ onSave, onCancel, saving }: {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_: unknown, croppedPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImage = async (): Promise<string> => {
    if (!imageSrc || !croppedAreaPixels) throw new Error("No image");
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => { image.onload = resolve; });
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      image,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      0, 0, 256, 256,
    );
    return canvas.toDataURL("image/jpeg", 0.85);
  };

  const checkNSFW = async (dataUrl: string): Promise<boolean> => {
    // Basic skin tone pixel analysis as a lightweight NSFW heuristic
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => { img.onload = resolve; });
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 64, 64);
    const data = ctx.getImageData(0, 0, 64, 64).data;
    let skinPixels = 0;
    const total = 64 * 64;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Skin tone detection in RGB
      if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && r - b > 15) {
        skinPixels++;
      }
    }
    // If >60% skin-colored pixels, flag as potentially NSFW
    return (skinPixels / total) > 0.60;
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setChecking(true);
    setError(null);
    try {
      const cropped = await getCroppedImage();
      const isNSFW = await checkNSFW(cropped);
      if (isNSFW) {
        setError("This image was flagged as potentially inappropriate. Please choose a different photo.");
        setChecking(false);
        return;
      }
      onSave(cropped);
    } catch {
      setError("Failed to process image");
    } finally {
      setChecking(false);
    }
  };

  // Dynamic import for Cropper to avoid SSR issues
  const [CropperComponent, setCropperComponent] = useState<React.ComponentType<any> | null>(null);
  useState(() => {
    import("react-easy-crop").then((mod) => setCropperComponent(() => mod.default));
  });

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
          {!imageSrc ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                <p className="text-sm text-muted-foreground">Click to upload an image</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">JPG, PNG, WebP — max 5MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>
          ) : (
            <>
              <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden">
                {CropperComponent && (
                  <CropperComponent
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                )}
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <button
                onClick={() => { setImageSrc(null); setError(null); }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Choose a different image
              </button>
            </>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            onClick={handleSave}
            disabled={saving || checking || !imageSrc}
            className="w-full text-sm font-medium bg-emerald-500 text-white px-4 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {checking ? "Checking image..." : saving ? "Saving..." : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
