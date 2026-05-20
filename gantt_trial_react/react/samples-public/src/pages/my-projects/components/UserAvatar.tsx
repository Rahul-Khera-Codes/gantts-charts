interface UserAvatarProps {
  initials: string;
  color: string;
  size?: 'sm' | 'md';
}

export default function UserAvatar({ initials, color, size = 'md' }: UserAvatarProps) {
  return (
    <span
      className={`rv-avatar rv-avatar--${size}`}
      style={{ backgroundColor: color }}
      title={initials}
    >
      {initials}
    </span>
  );
}
