import { Badge } from "./Badge";

interface SkillTagProps {
  name: string;
  category?: string;
}

export function SkillTag({ name, category }: SkillTagProps) {
  return <Badge tone="brand">{category ? `${name} · ${category}` : name}</Badge>;
}
