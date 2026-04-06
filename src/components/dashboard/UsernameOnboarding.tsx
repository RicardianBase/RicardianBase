import { useState } from "react";
import { Loader2, User } from "lucide-react";
import { useUpdateProfile } from "@/hooks/api/useProfile";
import { checkProfanity } from "@/lib/profanity";

interface Props {
  onComplete: () => void;
}

const UsernameOnboarding = ({ onComplete }: Props) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateProfile = useUpdateProfile();

  const validate = (val: string): string | null => {
    if (val.length < 3) return "Username must be at least 3 characters";
    if (val.length > 30) return "Username cannot exceed 30 characters";
    if (!/^[a-zA-Z0-9_-]+$/.test(val)) return "Only letters, numbers, hyphens, and underscores";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    const profanityCheck = checkProfanity(trimmed);
    if (profanityCheck.isProfane) {
      setError("Username contains inappropriate language. Please choose another.");
      return;
    }

    setError(null);
    try {
      await updateProfile.mutateAsync({ username: trimmed });
      onComplete();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (typeof msg === "string" && msg.toLowerCase().includes("taken")) {
        setError("Username already taken — try another");
      } else if (typeof msg === "string") {
        setError(msg);
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-[hsl(230,25%,96%)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-white" />
          </div>
          <h1
            className="text-3xl font-normal text-foreground mb-2"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Welcome to Ricardian
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a username to get started. This is how others will identify you on the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="your_username"
                autoFocus
                className="w-full border border-[hsl(230,20%,90%)] rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
              />
            </div>
            {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
            <p className="text-[10px] text-muted-foreground/60 mt-1.5">3-30 characters. Letters, numbers, hyphens, underscores only.</p>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending || username.trim().length < 3}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium bg-emerald-500 text-white px-4 py-3 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Setting up...</>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameOnboarding;
