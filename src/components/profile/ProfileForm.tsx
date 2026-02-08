"use client";

import { Camera, Loader2, Mail, User as UserIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "@/app/generated/prisma/browser";

export default function ProfileForm({ user }: { user: Partial<User> }) {
  const [username, setUsername] = useState(user.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profilePicRef.current?.files?.[0]) {
        formData.append("profilePic", profilePicRef.current.files[0]);
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (_err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-muted border-4 border-card overflow-hidden">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <UserIcon size={40} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => profilePicRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={profilePicRef}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div>
          <h4 className="font-black">{user.username}</h4>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">
            {user.role}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
            Username
          </label>
          <div className="relative">
            <UserIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
              placeholder="Enter username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-12 pr-4 cursor-not-allowed text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
