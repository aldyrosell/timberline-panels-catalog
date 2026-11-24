import {
  ArrowRight as PhArrowRight,
  CaretDown as PhCaretDown,
  Buildings,
  Diamond,
  Drop,
  Envelope,
  FacebookLogo,
  House,
  HouseLine,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Palette,
  Phone as PhPhone,
  ShieldCheck,
  Stack,
  Trophy,
  Truck,
  User,
  UsersThree,
  Van,
  YoutubeLogo,
  List as PhList,
  X as PhX,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react";
import type { SVGProps } from "react";
export type IconName =
  | "droplet"
  | "layers"
  | "palette"
  | "truck"
  | "users"
  | "gem"
  | "shield"
  | "person"
  | "trophy"
  | "building"
  | "home"
  | "house"
  | "office"
  | "van";

const registry: Record<IconName, React.ComponentType<PhosphorIconProps>> = {
  droplet: Drop,
  layers: Stack,
  palette: Palette,
  truck: Truck,
  users: UsersThree,
  gem: Diamond,
  shield: ShieldCheck,
  person: User,
  trophy: Trophy,
  building: Buildings,
  home: House,
  house: HouseLine,
  office: Buildings,
  van: Van,
};

type IconProps = PhosphorIconProps & { name: IconName };

export function Icon({ name, ...props }: IconProps) {
  const Component = registry[name];
  return <Component weight="light" aria-hidden {...props} />;
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 34 34" fill="none" aria-hidden {...props}>
      <path d="M17 16 31 23 17 30 3 23Z" fill="#8C6239" />
      <path d="M17 10 31 17 17 24 3 17Z" fill="#B07C3A" />
      <path d="M17 4 31 11 17 18 3 11Z" fill="#C99A55" />
    </svg>
  );
}

export function ArrowRight(props: PhosphorIconProps) {
  return <PhArrowRight weight="bold" aria-hidden {...props} />;
}

export function Phone(props: PhosphorIconProps) {
  return <PhPhone weight="light" aria-hidden {...props} />;
}

export function Mail(props: PhosphorIconProps) {
  return <Envelope weight="light" aria-hidden {...props} />;
}

export function Pin(props: PhosphorIconProps) {
  return <MapPin weight="light" aria-hidden {...props} />;
}

export function Facebook(props: PhosphorIconProps) {
  return <FacebookLogo weight="light" aria-hidden {...props} />;
}

export function Instagram(props: PhosphorIconProps) {
  return <InstagramLogo weight="light" aria-hidden {...props} />;
}

export function YouTube(props: PhosphorIconProps) {
  return <YoutubeLogo weight="light" aria-hidden {...props} />;
}

export function LinkedIn(props: PhosphorIconProps) {
  return <LinkedinLogo weight="light" aria-hidden {...props} />;
}

export function CaretDown(props: PhosphorIconProps) {
  return <PhCaretDown weight="bold" aria-hidden {...props} />;
}

export function MenuIcon(props: PhosphorIconProps) {
  return <PhList weight="light" aria-hidden {...props} />;
}

export function CloseIcon(props: PhosphorIconProps) {
  return <PhX weight="light" aria-hidden {...props} />;
}
