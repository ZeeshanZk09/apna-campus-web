"use client";
import axios from "axios";
import { Check, Copy, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toastService from "@/lib/services/toastService";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const fetchKeys = async () => {
    try {
      const { data } = await axios.get("/api/user/keys");
      setKeys(data);
    } catch (_err) {
      toastService.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsCreating(true);
    try {
      const { data } = await axios.post("/api/user/keys", { name: newKeyName });
      setKeys([data, ...keys]);
      setNewKeyName("");
      toastService.success("API Key created successfully");
      // Show the key immediately
      toggleKeyVisibility(data.id);
    } catch (_err) {
      toastService.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key?")) return;
    try {
      await axios.delete(`/api/user/keys/${id}`);
      setKeys(keys.filter((k) => k.id !== id));
      toastService.success("API Key revoked");
    } catch (_err) {
      toastService.error("Failed to revoke API key");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toastService.success("Copied to clipboard");
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="p-4 text-center">Loading keys...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">API Keys</h3>
          <p className="text-sm text-gray-400">
            Manage keys for external integrations
          </p>
        </div>
      </div>

      <form onSubmit={createKey} className="flex gap-2">
        <input
          type="text"
          placeholder="New Key Name (e.g. Production API)"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
        <button
          type="submit"
          disabled={isCreating || !newKeyName.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={18} />
          {isCreating ? "Creating..." : "Create Key"}
        </button>
      </form>

      <div className="space-y-4">
        {keys.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
            <Key className="mx-auto text-gray-500 mb-2" size={32} />
            <p className="text-gray-500">No API keys found</p>
          </div>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{key.name}</h4>
                  <p className="text-xs text-gray-500">
                    Created on {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteKey(key.id)}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-black/20 rounded-lg p-2 font-mono text-sm overflow-hidden">
                <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {visibleKeys[key.id]
                    ? key.key
                    : "••••••••••••••••••••••••••••••••"}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="p-1 hover:bg-white/10 rounded text-gray-400"
                  >
                    {visibleKeys[key.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(key.key, key.id)}
                    className="p-1 hover:bg-white/10 rounded text-gray-400"
                  >
                    {copiedId === key.id ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
