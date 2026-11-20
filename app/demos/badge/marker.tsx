import { Badge } from "@/ui/skins";
import { Bell, Mail, ShoppingCart } from "@/components/icons";

export default function BadgeMarkerDemo() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Badge label="New">
        <ShoppingCart />
      </Badge>

      <Badge label={12}>
        <Bell />
      </Badge>

      <Badge>
        <Mail />
      </Badge>
    </div>
  );
}
