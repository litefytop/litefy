"use client";

import { Heart, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonIconDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>
        <Heart className="size-4" />
        Like
      </Button>
      <Button variant="outline">
        <Star className="size-4" />
        Favorite
      </Button>
      <Button variant="text">
        <Settings className="size-4" />
        Settings
      </Button>
      <Button>
        <Heart className="size-4" />
      </Button>
    </div>
  );
}
