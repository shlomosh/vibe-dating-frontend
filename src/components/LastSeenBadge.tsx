import { Badge } from "@/components/ui/badge";

interface LastSeenBadgeProps {
  lastSeen: number;
  hideIfNotOnline?: boolean;
}

export const LastSeenBadge: React.FC<LastSeenBadgeProps> = ({ lastSeen, hideIfNotOnline = false }) => {
  return (lastSeen === 0) ? (
    <Badge variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
      Online
    </Badge>
  ) : (!hideIfNotOnline) && (
    <Badge variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
      {lastSeen >= 60 ? `${Math.floor(lastSeen/60)}h ago` : `${lastSeen}m ago`}
    </Badge>
  );
};
