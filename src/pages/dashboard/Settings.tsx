import { useState } from "react";
import { Shield, Key, Bell, User, Copy, RefreshCw } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API Keys", icon: Key },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className="space-y-6">
      <h1 className={`text-2xl font-medium text-gray-900 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className={`md:w-[200px] flex-shrink-0 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.id ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl font-medium text-blue-600">
                  JD
                </div>
                <button className="text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                  Change Avatar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">First Name</label>
                  <input type="text" defaultValue="John" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Last Name</label>
                  <input type="text" defaultValue="Doe" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                  <input type="email" defaultValue="john@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
              </div>
              <button className="text-sm font-medium bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              {["Email notifications", "Milestone updates", "Payment alerts", "Dispute notifications", "Weekly digest"].map((label) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{label}</span>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="text-xs font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                  Enable
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-400">Last changed 30 days ago</p>
                  </div>
                </div>
                <button className="text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                  Update
                </button>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-gray-700 font-mono bg-gray-100 rounded-lg px-3 py-2 truncate">
                    rbase_live_sk_1a2b3c4d5e6f7g8h9i0j...
                  </code>
                  <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <Copy size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                <RefreshCw size={12} /> Regenerate Key
              </button>
              <p className="text-xs text-red-400">Warning: Regenerating will invalidate the current key.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
