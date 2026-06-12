import {
  Droplets,
  Feather,
  Flame,
  Gem,
  Leaf,
  PawPrint,
  ShieldCheck,
  Snowflake,
  Sofa,
  Sparkles,
  Sun,
  Waves,
} from "lucide-react";

const fabricTagIcons = {
  "paw-print": PawPrint,
  droplets: Droplets,
  gem: Gem,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  sofa: Sofa,
  feather: Feather,
  leaf: Leaf,
  waves: Waves,
  sun: Sun,
  snowflake: Snowflake,
  flame: Flame,
};

export function getFabricTagIcon(icon: string) {
  return fabricTagIcons[icon as keyof typeof fabricTagIcons] ?? Gem;
}
