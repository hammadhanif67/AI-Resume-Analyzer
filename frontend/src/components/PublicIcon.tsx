import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Code2,
  Database,
  Download,
  FileText,
  Gauge,
  GitFork,
  Globe2,
  Headphones,
  KeyRound,
  Lock,
  Mail,
  Menu,
  MapPin,
  MessageCircle,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UploadCloud,
  Users,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type PublicIconName =
  | "activity"
  | "arrowRight"
  | "badgeCheck"
  | "barChart"
  | "bot"
  | "briefcase"
  | "checkCircle"
  | "clipboard"
  | "clock"
  | "code"
  | "database"
  | "download"
  | "fileText"
  | "gauge"
  | "github"
  | "globe"
  | "headphones"
  | "keyRound"
  | "linkedin"
  | "lock"
  | "mail"
  | "menu"
  | "mapPin"
  | "messageCircle"
  | "rocket"
  | "search"
  | "send"
  | "shield"
  | "sparkles"
  | "star"
  | "target"
  | "upload"
  | "users"
  | "x";

interface PublicIconProps extends LucideProps {
  name: PublicIconName;
}

const icons: Record<PublicIconName, LucideIcon> = {
  activity: Activity,
  arrowRight: ArrowRight,
  badgeCheck: BadgeCheck,
  barChart: BarChart3,
  bot: Bot,
  briefcase: BriefcaseBusiness,
  checkCircle: CheckCircle2,
  clipboard: ClipboardCheck,
  clock: Clock3,
  code: Code2,
  database: Database,
  download: Download,
  fileText: FileText,
  gauge: Gauge,
  github: GitFork,
  globe: Globe2,
  headphones: Headphones,
  keyRound: KeyRound,
  linkedin: BriefcaseBusiness,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  mapPin: MapPin,
  messageCircle: MessageCircle,
  rocket: Rocket,
  search: Search,
  send: Send,
  shield: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  upload: UploadCloud,
  users: Users,
  x: X,
};

export function PublicIcon({ name, className, strokeWidth = 2, ...props }: PublicIconProps) {
  const Icon = icons[name];

  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} {...props} />;
}
