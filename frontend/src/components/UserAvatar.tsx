import { useEffect, useState } from "react";

import type { User } from "../types/auth";
import { getInitials, getProfileImageUrl } from "../utils/profileImage";

interface UserAvatarProps {
  user: User | null | undefined;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-32 w-32 text-3xl",
};

export function UserAvatar({ user, size = "sm" }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getProfileImageUrl(user);
  const initials = getInitials(user?.name || user?.email);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  if (imageUrl && !imageFailed) {
    return <img alt={`${user?.name ?? "User"} profile`} className={`${sizes[size]} shrink-0 rounded-full border border-white object-cover shadow-sm ring-1 ring-slate-200`} onError={() => setImageFailed(true)} src={imageUrl} />;
  }

  return (
    <div className={`${sizes[size]} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink to-brand-700 font-bold text-white shadow-sm ring-1 ring-slate-200`} aria-label={`${initials} avatar`}>
      {initials}
    </div>
  );
}
