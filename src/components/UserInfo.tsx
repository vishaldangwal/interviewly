import { UserCircleIcon } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type User = Doc<"users">;

type UserInfoProps = {
  user: User;
  showRole?: boolean;
  avatarSize?: "sm" | "md" | "lg";
  className?: string;
};

function UserInfo({
  user,

  avatarSize = "sm",
  className,
}: UserInfoProps) {
  // Calculate avatar sizes based on the prop
  const avatarSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  // Calculate icon sizes based on avatar size
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className={cn(avatarSizes[avatarSize], "ring-2 ring-background")}>
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="bg-accent text-accent-foreground font-medium">
          {user.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            <UserCircleIcon className={iconSizes[avatarSize]} />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-sm font-medium leading-none">{user.name}</span>
      </div>
    </div>
  );
}

export default UserInfo;
