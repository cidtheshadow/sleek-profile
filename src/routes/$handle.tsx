import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin,
  Mail,
  Globe,
  Music2,
  Twitch,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/$handle")({
  component: PublicProfile,
});

type LinkItem = {
  id: string;
  label: string;
  url: string;
  thumb?: string;
  visible: boolean;
  clicks?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};
type SocialKey =
  | "instagram"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "twitch"
  | "github"
  | "linkedin"
  | "email"
  | "website";
type Social = { key: SocialKey; value: string };

type ButtonStyle = "fill" | "outline" | "soft-shadow" | "hard-shadow";
type ButtonShape = "sharp" | "rounded" | "pill";
type FontKey = "sans" | "serif" | "mono" | "display";
type BgMode = "solid" | "gradient" | "image";

type Template = {
  id: string;
  name: string;
  vibe: string;
  bg: string;
  bg2: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  bgMode: BgMode;
  bgImage?: string;
  buttonStyle: ButtonStyle;
  buttonShape: ButtonShape;
  font: FontKey;
};

type Profile = {
  avatar: string;
  handle: string;
  displayName: string;
  bio: string;
  verified: boolean;
  templateId: string;
  buttonStyle: ButtonStyle;
  buttonShape: ButtonShape;
  font: FontKey;
  bgMode: BgMode;
  bgImage: string;
  socials: Social[];
  links: LinkItem[];
};

const TEMPLATES: Template[] = [
  {
    id: "sandstone",
    name: "Sandstone",
    vibe: "Warm luxe",
    bg: "#121214",
    bg2: "#1c1a17",
    card: "#1a1a1e",
    text: "#e4e4e7",
    muted: "#a1a1aa",
    accent: "#F1C261",
    bgMode: "gradient",
    buttonStyle: "fill",
    buttonShape: "rounded",
    font: "sans",
  },
  {
    id: "ivory",
    name: "Ivory",
    vibe: "Editorial",
    bg: "#f5f3ee",
    bg2: "#ece7dd",
    card: "#ffffff",
    text: "#121214",
    muted: "#6b6b6b",
    accent: "#121214",
    bgMode: "solid",
    buttonStyle: "outline",
    buttonShape: "sharp",
    font: "serif",
  },
  {
    id: "midnight",
    name: "Midnight",
    vibe: "Techy (Animated)",
    bg: "#0b0f1a",
    bg2: "#131a2d",
    card: "#141a2b",
    text: "#e6eaf2",
    muted: "#8a94ad",
    accent: "#7aa2ff",
    bgMode: "gradient",
    buttonStyle: "soft-shadow",
    buttonShape: "rounded",
    font: "sans",
  },
  {
    id: "moss",
    name: "Moss",
    vibe: "Organic",
    bg: "#101512",
    bg2: "#182019",
    card: "#182019",
    text: "#e8ece6",
    muted: "#98a498",
    accent: "#a3c9a0",
    bgMode: "gradient",
    buttonStyle: "fill",
    buttonShape: "pill",
    font: "sans",
  },
  {
    id: "noir",
    name: "Noir Gold",
    vibe: "Luxury (Animated)",
    bg: "#0a0a0a",
    bg2: "#111",
    card: "#151515",
    text: "#f5efe0",
    muted: "#8a8a8a",
    accent: "#c9a84c",
    bgMode: "solid",
    buttonStyle: "hard-shadow",
    buttonShape: "sharp",
    font: "display",
  },
  {
    id: "blush",
    name: "Blush",
    vibe: "Soft (Animated)",
    bg: "#f8e8ee",
    bg2: "#f0d5df",
    card: "#ffffff",
    text: "#3a1f2a",
    muted: "#8a5c6c",
    accent: "#c45c7c",
    bgMode: "gradient",
    buttonStyle: "soft-shadow",
    buttonShape: "pill",
    font: "serif",
  },
  {
    id: "ocean",
    name: "Ocean",
    vibe: "Calm",
    bg: "#0c2340",
    bg2: "#164062",
    card: "#153352",
    text: "#e6f0fa",
    muted: "#8fb0cf",
    accent: "#5cbdb9",
    bgMode: "gradient",
    buttonStyle: "fill",
    buttonShape: "rounded",
    font: "sans",
  },
  {
    id: "brutalist",
    name: "Brutal Pop",
    vibe: "Loud (Animated)",
    bg: "#ffffff",
    bg2: "#f4f4f4",
    card: "#ffffff",
    text: "#0a0a0a",
    muted: "#555",
    accent: "#ff5722",
    bgMode: "solid",
    buttonStyle: "hard-shadow",
    buttonShape: "sharp",
    font: "mono",
  },
];

const SOCIAL_META: Record<SocialKey, { label: string; icon: React.ElementType }> = {
  instagram: { label: "Instagram", icon: Instagram },
  twitter: { label: "X / Twitter", icon: Twitter },
  youtube: { label: "YouTube", icon: Youtube },
  tiktok: { label: "TikTok", icon: Music2 },
  twitch: { label: "Twitch", icon: Twitch },
  github: { label: "GitHub", icon: Github },
  linkedin: { label: "LinkedIn", icon: Linkedin },
  email: { label: "Email", icon: Mail },
  website: { label: "Website", icon: Globe },
};

const FONTS: Record<FontKey, { name: string; stack: string }> = {
  sans: { name: "Inter", stack: `"Inter", ui-sans-serif, system-ui, sans-serif` },
  serif: { name: "Serif", stack: `Georgia, "Playfair Display", ui-serif, serif` },
  mono: { name: "Mono", stack: `"JetBrains Mono", ui-monospace, monospace` },
  display: { name: "Display", stack: `"Inter", system-ui, sans-serif` },
};

function PublicProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Try to decode profile configuration from hash or URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const data = urlParams.get("d") || hashParams.get("d");

    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(data)));
        setProfile(decoded);
      } catch (e) {
        console.error("Failed to decode profile payload", e);
      }
    }
  }, []);

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">SleekBio</h1>
          <p className="text-sm text-zinc-500">Profile data missing or invalid share link.</p>
          <a href="/" className="inline-block text-xs text-primary underline">
            Create your own SleekBio profile
          </a>
        </div>
      </div>
    );
  }

  const template = TEMPLATES.find((t) => t.id === profile.templateId) ?? TEMPLATES[0];

  const bg =
    profile.bgMode === "image" && profile.bgImage
      ? `url(${profile.bgImage}) center/cover`
      : profile.bgMode === "gradient"
        ? `linear-gradient(160deg, ${template.bg}, ${template.bg2})`
        : template.bg;

  const font = FONTS[profile.font].stack;
  const radius =
    profile.buttonShape === "sharp" ? "6px" : profile.buttonShape === "pill" ? "999px" : "14px";

  let animatedClass = "";
  if (template.id === "midnight") animatedClass = "animate-midnight";
  else if (template.id === "noir") animatedClass = "animate-shimmer-gold";
  else if (template.id === "blush") animatedClass = "animate-blush-bg";
  else if (template.id === "brutalist") animatedClass = "animate-brutal-pop";

  // Check if premium logic: watermark shown unless the profile json specifies premium validation token
  const isPremiumLocal = localStorage.getItem("sleekbio.premium") === "true";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-8 ${animatedClass}`}
      style={{ background: bg, color: template.text, fontFamily: font }}
    >
      {profile.bgMode === "image" && profile.bgImage && (
        <div className="absolute inset-0 bg-black/45 pointer-events-none" aria-hidden />
      )}

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center py-10 px-4">
        {/* Avatar */}
        <div
          className="h-24 w-24 overflow-hidden rounded-full transition-transform hover:scale-105"
          style={{ boxShadow: `0 0 0 2px ${template.accent}, 0 0 0 6px ${template.card}` }}
        >
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-6 flex items-center gap-1.5 justify-center">
          <h1
            className="text-2xl font-black tracking-tight"
            style={{
              color: template.text,
              fontStyle: profile.font === "serif" ? "italic" : undefined,
            }}
          >
            {profile.displayName || profile.handle}
          </h1>
          {profile.verified && (
            <BadgeCheck className="h-5 w-5" style={{ color: template.accent }} />
          )}
        </div>
        <p className="text-sm mt-1 text-center opacity-80" style={{ color: template.text }}>
          {profile.handle}
        </p>

        <p
          className="mt-4 max-w-sm text-center text-sm leading-relaxed"
          style={{ color: template.text, opacity: 0.75 }}
        >
          {profile.bio}
        </p>

        {/* Social Icons */}
        {profile.socials.filter((s) => s.value.trim()).length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {profile.socials
              .filter((s) => s.value.trim())
              .map((s) => {
                const Icon = SOCIAL_META[s.key]?.icon;
                if (!Icon) return null;
                return (
                  <a
                    key={s.key}
                    href={s.key === "email" ? `mailto:${s.value}` : s.value}
                    target="_blank"
                    rel="noreferrer"
                    className="spring grid h-9 w-9 place-items-center rounded-full hover:scale-110 active:scale-95"
                    style={{
                      background: `${template.card}`,
                      color: template.text,
                      border: `1px solid ${template.accent}33`,
                    }}
                    aria-label={s.key}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </div>
        )}

        {/* Links */}
        <div className="mt-8 w-full space-y-4">
          {profile.links
            .filter((l) => l.visible)
            .map((link) => {
              const style: React.CSSProperties = { borderRadius: radius, color: template.text };
              const s = profile.buttonStyle;
              if (s === "fill") {
                style.background = template.card;
                style.border = `1px solid ${template.accent}30`;
              } else if (s === "outline") {
                style.background = "transparent";
                style.border = `1.5px solid ${template.text}`;
              } else if (s === "soft-shadow") {
                style.background = template.card;
                style.boxShadow = `0 10px 24px -12px ${template.accent}66`;
                style.border = `1px solid ${template.accent}22`;
              } else if (s === "hard-shadow") {
                style.background = template.card;
                style.border = `1.5px solid ${template.text}`;
                style.boxShadow = `4px 4px 0 0 ${template.accent}`;
              }

              let finalUrl = link.url;
              try {
                const urlObj = new URL(link.url);
                if (link.utmSource) urlObj.searchParams.set("utm_source", link.utmSource);
                if (link.utmMedium) urlObj.searchParams.set("utm_medium", link.utmMedium);
                if (link.utmCampaign) urlObj.searchParams.set("utm_campaign", link.utmCampaign);
                finalUrl = urlObj.toString();
              } catch {
                // relative link fallback
              }

              return (
                <a
                  key={link.id}
                  href={finalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="spring group flex w-full items-center gap-4 px-4 py-4 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98]"
                  style={style}
                >
                  {link.thumb ? (
                    <img
                      src={link.thumb}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="h-9 w-9 shrink-0" aria-hidden />
                  )}
                  <span
                    className="min-w-0 flex-1 truncate text-center"
                    style={{ color: template.text }}
                  >
                    {link.label || "Untitled"}
                  </span>
                  <span className="h-9 w-9 shrink-0" aria-hidden />
                </a>
              );
            })}
        </div>

        {/* Watermark */}
        {!isPremiumLocal && (
          <p
            className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] opacity-50"
            style={{ color: template.text }}
          >
            built with sleekbio
          </p>
        )}
      </div>
    </div>
  );
}
