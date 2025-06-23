import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface LastSeenBadgeProps {
  lastSeen: number; // timestamp in milliseconds
  hideIfNotOnline?: boolean;
}

export const LastSeenBadge: React.FC<LastSeenBadgeProps> = ({ lastSeen, hideIfNotOnline = false }) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = Date.now();
      const diffMs = now - lastSeen;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) {
        setTimeAgo("Just now");
      } else if (diffMinutes < 60) {
        setTimeAgo(`${diffMinutes}m ago`);
      } else if (diffHours < 24) {
        setTimeAgo(`${diffHours}h ago`);
      } else if (diffDays < 7) {
        setTimeAgo(`${diffDays}d ago`);
      } else {
        setTimeAgo(`${Math.floor(diffDays / 7)}w ago`);
      }
    };

    calculateTimeAgo();

    // Update every minute
    const interval = setInterval(calculateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  // If lastSeen is 0 or very recent (within 5 minutes), show as online
  const isOnline = lastSeen === 0 || (Date.now() - lastSeen) < 5 * 60 * 1000;

  return isOnline ? (
    <Badge variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
      Online
    </Badge>
  ) : (!hideIfNotOnline) && (
    <Badge variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
      {timeAgo}
    </Badge>
  );
};
