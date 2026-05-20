import type { ProjectAdmin } from '../types';
import UserAvatar from './UserAvatar';

interface AvatarStackProps {
  admins: ProjectAdmin[];
}

export default function AvatarStack({ admins }: AvatarStackProps) {
  return (
    <div className="rv-avatar-stack">
      {admins.map((admin, index) => (
        <UserAvatar
          key={`${admin.initials}-${index}`}
          initials={admin.initials}
          color={admin.color}
          size="sm"
        />
      ))}
    </div>
  );
}
