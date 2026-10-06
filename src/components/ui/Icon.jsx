import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  CircleArrowOutUpRight,
  Download,
  MapPin,
  Mail,
  Phone,
  Quote,
  Facebook,
  Instagram,
  Linkedin,
  Pin,
  Twitter,
  Youtube,
  CircleCheck,
  MessageCircle,
  Award,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  LoaderCircle,
  CalendarDays,
  Plus,
  Minus,
  ShieldCheck,
  Play,
  Pause,
} from "lucide-react";

const icons = {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  CircleArrowOutUpRight,
  Download,
  MapPin,
  Mail,
  Phone,
  Quote,
  Facebook,
  Instagram,
  Linkedin,
  Pin,
  Twitter,
  Youtube,
  CircleCheck,
  MessageCircle,
  Award,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  LoaderCircle,
  CalendarDays,
  Plus,
  Minus,
  ShieldCheck,
  Play,
  Pause,
};

export default function Icon({ name, size = 24, className = "", ...props }) {
  const Component = icons[name] || ArrowUpRight;
  return (
    <Component
      size={size}
      strokeWidth={1.6}
      className={`site-icon ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
