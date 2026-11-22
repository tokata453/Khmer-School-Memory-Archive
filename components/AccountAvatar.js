import { User } from "lucide-react";

export default function AccountAvatar({ url = "", label, size = 32 }) {
  if (!url)
    return <User size={size * 0.58} strokeWidth={2.2} aria-label={label} />;
  return (
    <img
      className="account-avatar"
      src={url}
      alt={label}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
