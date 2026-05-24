import { Badge } from "./Badge";

interface MissingSkillTagProps {
  name: string;
  priority?: string;
}

export function MissingSkillTag({ name, priority }: MissingSkillTagProps) {
  const tone = priority === "high" ? "danger" : priority === "medium" ? "warning" : "neutral";
  return <Badge tone={tone}>{priority ? `${name} · ${priority}` : name}</Badge>;
}
