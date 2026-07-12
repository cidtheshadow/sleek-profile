import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Check,
  Copy,
  QrCode,
  Share2,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Sparkles,
  X,
  BadgeCheck,
} from "lucide-react";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SleekBio — Premium Link-in-Bio Builder" },
      {
        name: "description",
        content:
          "SleekBio is a minimal, luxury-grade link-in-bio builder. Craft a beautiful profile with real-time preview, templates, and share-ready QR codes.",
      },
      { property: "og:title", content: "SleekBio — Premium Link-in-Bio Builder" },
      {
        property: "og:description",
        content: "Craft a beautiful link-in-bio profile with real-time preview.",
      },
    ],
  }),
});

/* ---------------- Types ---------------- */

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
  premium?: boolean;
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

/* ---------------- Templates ---------------- */

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
    premium: true,
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
    premium: true,
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
    premium: true,
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
    premium: true,
  },
];

const SOCIAL_META: Record<
  SocialKey,
  { label: string; icon: React.ElementType; placeholder: string }
> = {
  instagram: { label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/you" },
  twitter: { label: "X / Twitter", icon: Twitter, placeholder: "https://x.com/you" },
  youtube: { label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@you" },
  tiktok: { label: "TikTok", icon: Music2, placeholder: "https://tiktok.com/@you" },
  twitch: { label: "Twitch", icon: Twitch, placeholder: "https://twitch.tv/you" },
  github: { label: "GitHub", icon: Github, placeholder: "https://github.com/you" },
  linkedin: { label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/you" },
  email: { label: "Email", icon: Mail, placeholder: "you@domain.com" },
  website: { label: "Website", icon: Globe, placeholder: "https://yoursite.com" },
};

const FONTS: Record<FontKey, { name: string; stack: string }> = {
  sans: { name: "Inter", stack: `"Inter", ui-sans-serif, system-ui, sans-serif` },
  serif: { name: "Serif", stack: `Georgia, "Playfair Display", ui-serif, serif` },
  mono: { name: "Mono", stack: `"JetBrains Mono", ui-monospace, monospace` },
  display: { name: "Display", stack: `"Inter", system-ui, sans-serif` },
};

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_PROFILE: Profile = {
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
  handle: "@alex.morgan",
  displayName: "Alex Morgan",
  bio: "Designer & founder. Building calm software.",
  verified: true,
  templateId: "sandstone",
  buttonStyle: "fill",
  buttonShape: "rounded",
  font: "sans",
  bgMode: "gradient",
  bgImage: "",
  socials: [
    { key: "instagram", value: "https://instagram.com/alex" },
    { key: "twitter", value: "https://x.com/alex" },
    { key: "youtube", value: "" },
  ],
  links: [
    { id: uid(), label: "Portfolio", url: "https://example.com", visible: true },
    {
      id: uid(),
      label: "Latest Essay — On Restraint",
      url: "https://example.com/essay",
      visible: true,
      thumb: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=200&h=200&fit=crop",
    },
    { id: uid(), label: "Book a call", url: "https://example.com/call", visible: true },
    { id: uid(), label: "Newsletter", url: "https://example.com/news", visible: true },
  ],
};

/* ---------------- Component ---------------- */

const STORAGE_KEY = "sleekbio.profile.v1";

function Index() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    const isPremLocalStorage = localStorage.getItem("sleekbio.premium") === "true";
    setIsPremium(isPremLocalStorage);
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile, hydrated]);

  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === profile.templateId) ?? TEMPLATES[0],
    [profile.templateId],
  );

  const update = (patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch }));

  const updateLink = (id: string, patch: Partial<LinkItem>) =>
    setProfile((p) => ({
      ...p,
      links: p.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

  const removeLink = (id: string) =>
    setProfile((p) => ({ ...p, links: p.links.filter((l) => l.id !== id) }));

  const addLink = () =>
    setProfile((p) => ({
      ...p,
      links: [
        ...p.links,
        { id: uid(), label: "New Link", url: "https://", visible: true, clicks: 0 },
      ],
    }));

  const moveLink = (id: string, dir: -1 | 1) =>
    setProfile((p) => {
      const idx = p.links.findIndex((l) => l.id === id);
      if (idx < 0) return p;
      const target = idx + dir;
      if (target < 0 || target >= p.links.length) return p;
      const next = [...p.links];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...p, links: next };
    });

  const applyTemplate = (t: Template) => {
    if (t.premium && !isPremium) {
      setCheckoutOpen(true);
      toast.error(`"${t.name}" is a Premium animated theme! Upgrade to unlock.`);
      return;
    }
    update({
      templateId: t.id,
      buttonStyle: t.buttonStyle,
      buttonShape: t.buttonShape,
      font: t.font,
      bgMode: t.bgMode,
    });
  };

  const handleLinkClick = (id: string) => {
    setProfile((p) => ({
      ...p,
      links: p.links.map((l) => (l.id === id ? { ...l, clicks: (l.clicks ?? 0) + 1 } : l)),
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setProfile((p) => {
      const next = [...p.links];
      const draggedItem = next[draggedIndex];
      next.splice(draggedIndex, 1);
      next.splice(index, 0, draggedItem);
      return { ...p, links: next };
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleUpgrade = (tier: "creator" | "agency") => {
    setIsCheckingOut(true);
    toast.loading(
      `Redirecting to Stripe Checkout for ${tier === "creator" ? "$5 Pass" : "$19 Pass"}...`,
      { id: "stripe-checkout" },
    );
    setTimeout(() => {
      toast.dismiss("stripe-checkout");
      setIsCheckingOut(false);
      setCheckoutOpen(false);
      localStorage.setItem("sleekbio.premium", "true");
      setIsPremium(true);
      toast.success("Upgrade successful! Premium features unlocked.");
    }, 1500);
  };

  const handleDowngrade = () => {
    localStorage.removeItem("sleekbio.premium");
    setIsPremium(false);
    toast.info("Switched to free plan.");
  };

  const encodeProfile = (prof: Profile) => {
    try {
      const jsonStr = JSON.stringify(prof);
      return btoa(encodeURIComponent(jsonStr));
    } catch {
      return "";
    }
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const handleName = (profile.handle || "you").replace(/^@/, "");
    const base64Data = encodeProfile(profile);
    return `${origin}/${handleName}?d=${base64Data}`;
  };

  const publicUrl = `sleek.bio/${(profile.handle || "you").replace(/^@/, "")}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" richColors={false} />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ============ LEFT: EDITOR ============ */}
        <section className="border-b border-hairline lg:border-b-0 lg:border-r">
          {/* Top nav */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-background/85 px-6 py-4 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-[0.2em] text-primary">SLEEKBIO</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareOpen(true)}
                className="spring inline-flex items-center gap-1.5 rounded-full border border-hairline bg-panel px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary active:scale-[0.97]"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              {isPremium ? (
                <button
                  onClick={handleDowngrade}
                  className="spring inline-flex items-center gap-1.5 rounded-full border border-hairline/40 bg-panel px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-destructive active:scale-[0.97]"
                >
                  Premium Active
                </button>
              ) : (
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="spring group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-[1.03] hover:shadow-[0_0_0_4px_rgba(241,194,97,0.14)] active:scale-[0.98]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade
                </button>
              )}
            </div>
          </header>

          <div className="mx-auto max-w-xl space-y-10 px-6 py-10 sm:px-8">
            {/* PROFILE */}
            <Section index="01" title="Profile">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <AvatarPicker value={profile.avatar} onChange={(v) => update({ avatar: v })} />
                  <div className="flex-1 space-y-2">
                    <MiniField
                      label="Name"
                      value={profile.displayName}
                      onChange={(v) => update({ displayName: v })}
                    />
                    <MiniField
                      label="Handle"
                      value={profile.handle}
                      onChange={(v) => update({ handle: v })}
                    />
                  </div>
                </div>
                <Field
                  label="Bio"
                  value={profile.bio}
                  onChange={(v) => update({ bio: v })}
                  textarea
                  placeholder="Short and sharp."
                  hint={`${profile.bio.length}/80`}
                />
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-hairline bg-panel px-4 py-3">
                  <span className="flex items-center gap-2 text-sm">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    Verified badge
                  </span>
                  <Toggle checked={profile.verified} onChange={(v) => update({ verified: v })} />
                </label>
              </div>
            </Section>

            {/* SOCIALS */}
            <Section index="02" title="Social Icons">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(Object.keys(SOCIAL_META) as SocialKey[]).map((key) => {
                  const meta = SOCIAL_META[key];
                  const Icon = meta.icon;
                  const existing = profile.socials.find((s) => s.key === key);
                  return (
                    <div
                      key={key}
                      className="spring flex items-center gap-2 rounded-xl border border-hairline bg-panel px-3 py-2 focus-within:border-primary/50 hover:border-hairline/80"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <input
                        value={existing?.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfile((p) => {
                            const others = p.socials.filter((s) => s.key !== key);
                            return value
                              ? { ...p, socials: [...others, { key, value }] }
                              : { ...p, socials: others };
                          });
                        }}
                        placeholder={meta.placeholder}
                        className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* LINKS */}
            <Section index="03" title="Links">
              <div className="space-y-3">
                {profile.links.map((link, i) => (
                  <div
                    key={link.id}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <LinkCard
                      index={i}
                      total={profile.links.length}
                      link={link}
                      onChange={(patch) => updateLink(link.id, patch)}
                      onRemove={() => removeLink(link.id)}
                      onMove={(dir) => moveLink(link.id, dir)}
                      isPremium={isPremium}
                      onUpgradeClick={() => setCheckoutOpen(true)}
                    />
                  </div>
                ))}
                <button
                  onClick={addLink}
                  className="spring flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-transparent py-4 text-sm font-medium text-muted-foreground hover:border-primary/60 hover:bg-panel hover:text-foreground active:scale-[0.99]"
                >
                  <Plus className="h-4 w-4 text-primary" /> Add New Link
                </button>
              </div>
            </Section>

            {/* TEMPLATES */}
            <Section index="04" title="Templates">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TEMPLATES.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    active={profile.templateId === t.id}
                    onSelect={() => applyTemplate(t)}
                  />
                ))}
              </div>
            </Section>

            {/* APPEARANCE */}
            <Section index="05" title="Appearance">
              <div className="space-y-4">
                <ControlRow label="Buttons">
                  <SegGroup
                    value={profile.buttonStyle}
                    onChange={(v) => update({ buttonStyle: v as ButtonStyle })}
                    options={[
                      { value: "fill", label: "Fill" },
                      { value: "outline", label: "Outline" },
                      { value: "soft-shadow", label: "Soft" },
                      { value: "hard-shadow", label: "Hard" },
                    ]}
                  />
                </ControlRow>
                <ControlRow label="Corners">
                  <SegGroup
                    value={profile.buttonShape}
                    onChange={(v) => update({ buttonShape: v as ButtonShape })}
                    options={[
                      { value: "sharp", label: "Sharp" },
                      { value: "rounded", label: "Rounded" },
                      { value: "pill", label: "Pill" },
                    ]}
                  />
                </ControlRow>
                <ControlRow label="Font">
                  <SegGroup
                    value={profile.font}
                    onChange={(v) => update({ font: v as FontKey })}
                    options={[
                      { value: "sans", label: "Sans" },
                      { value: "serif", label: "Serif" },
                      { value: "mono", label: "Mono" },
                      { value: "display", label: "Display" },
                    ]}
                  />
                </ControlRow>
                <ControlRow label="Background">
                  <SegGroup
                    value={profile.bgMode}
                    onChange={(v) => update({ bgMode: v as BgMode })}
                    options={[
                      { value: "solid", label: "Solid" },
                      { value: "gradient", label: "Gradient" },
                      { value: "image", label: "Image" },
                    ]}
                  />
                </ControlRow>
                {profile.bgMode === "image" && (
                  <MiniField
                    label="URL"
                    value={profile.bgImage}
                    onChange={(v) => update({ bgImage: v })}
                  />
                )}
              </div>
            </Section>

            <p className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              Autosaved locally · v1.0
            </p>
          </div>
        </section>

        {/* ============ RIGHT: PREVIEW ============ */}
        <section className="relative flex items-center justify-center overflow-hidden bg-panel-2 px-6 py-16 sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
            style={{ background: `radial-gradient(circle, ${template.accent}, transparent 60%)` }}
          />

          <div className="flex flex-col items-center gap-6">
            <PhoneMockup
              profile={profile}
              template={template}
              isPremium={isPremium}
              onLinkClick={handleLinkClick}
            />
            <div className="flex items-center gap-2 rounded-full border border-hairline bg-panel px-4 py-2 text-xs font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {publicUrl}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(getShareUrl());
                  toast.success("Share link copied!");
                }}
                className="spring ml-1 rounded-full p-1 hover:bg-background hover:text-foreground"
                aria-label="Copy link"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {shareOpen && <ShareDialog url={getShareUrl()} onClose={() => setShareOpen(false)} />}
      {checkoutOpen && (
        <CheckoutDialog
          onClose={() => setCheckoutOpen(false)}
          onUpgrade={handleUpgrade}
          isCheckingOut={isCheckingOut}
        />
      )}
    </main>
  );
}

/* ---------------- Building blocks ---------------- */

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-widest text-primary">{index}</span>
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">
          {title}
        </h2>
        <span className="h-px flex-1 bg-hairline" />
      </div>
      {children}
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="justify-self-end">{children}</div>
    </div>
  );
}

function SegGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-hairline bg-background/40 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`spring rounded-md px-2.5 py-1.5 text-[11px] font-medium ${
            value === o.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  const shared =
    "spring w-full rounded-xl border border-hairline bg-panel px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {hint && <span className="font-mono text-[10px] text-muted-foreground/70">{hint}</span>}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 80))}
          placeholder={placeholder}
          rows={2}
          className={shared + " resize-none"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={shared}
        />
      )}
    </label>
  );
}

function MiniField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="spring flex items-center gap-3 rounded-lg border border-hairline bg-background/40 px-3 py-2 focus-within:border-primary/50">
      <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
      />
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={`spring relative h-5 w-9 rounded-full border ${
        checked ? "border-primary bg-primary/90" : "border-hairline bg-background"
      }`}
    >
      <span
        className={`spring absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${
          checked
            ? "left-[calc(100%-14px)] bg-primary-foreground"
            : "left-[3px] bg-muted-foreground"
        }`}
      />
    </button>
  );
}

function AvatarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <button
        onClick={() => fileRef.current?.click()}
        className="spring group relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-hairline bg-panel hover:border-primary/60"
        aria-label="Change avatar"
      >
        {value ? (
          <img src={value} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
          </div>
        )}
        <div className="absolute inset-0 grid place-items-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ImageIcon className="h-4 w-4 text-primary" />
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(f);
        }}
      />
    </div>
  );
}

function LinkCard({
  index,
  total,
  link,
  onChange,
  onRemove,
  onMove,
  isPremium,
  onUpgradeClick,
}: {
  index: number;
  total: number;
  link: LinkItem;
  onChange: (patch: Partial<LinkItem>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}) {
  const [expandThumb, setExpandThumb] = useState(!!link.thumb);
  const [expandAnalytics, setExpandAnalytics] = useState(false);

  return (
    <div className="spring group rounded-xl border border-hairline bg-panel p-4 hover:border-primary/40">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Link · {String(index + 1).padStart(2, "0")}
          </span>
          {isPremium ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
              {link.clicks ?? 0} clicks
            </span>
          ) : (
            <button
              onClick={onUpgradeClick}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-primary hover:bg-primary/20"
            >
              <Sparkles className="h-2 w-2" /> Track Clicks
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <IconBtn disabled={index === 0} onClick={() => onMove(-1)} label="Move up">
            <ArrowUp className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn disabled={index === total - 1} onClick={() => onMove(1)} label="Move down">
            <ArrowDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn
            onClick={() => setExpandThumb((v) => !v)}
            label="Thumbnail"
            active={expandThumb || !!link.thumb}
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </IconBtn>
          <button
            onClick={() => {
              if (!isPremium) {
                onUpgradeClick?.();
              } else {
                setExpandAnalytics((v) => !v);
              }
            }}
            className={`spring grid h-7 px-2 place-items-center rounded-md border text-[10px] font-mono uppercase tracking-wider ${
              expandAnalytics
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-transparent text-muted-foreground hover:border-hairline hover:bg-background hover:text-foreground"
            }`}
          >
            UTM {!isPremium && "🔒"}
          </button>
          <div className="mx-1 h-4 w-px bg-hairline" />
          <Toggle checked={link.visible} onChange={(v) => onChange({ visible: v })} />
          <IconBtn onClick={onRemove} label="Delete" danger>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
      <div className="space-y-2">
        <MiniField label="Label" value={link.label} onChange={(v) => onChange({ label: v })} />
        <MiniField label="URL" value={link.url} onChange={(v) => onChange({ url: v })} />
        {expandThumb && (
          <MiniField
            label="Thumb"
            value={link.thumb ?? ""}
            onChange={(v) => onChange({ thumb: v })}
            placeholder="Image URL (optional)"
          />
        )}
        {isPremium && expandAnalytics && (
          <div className="mt-3 space-y-2 border-t border-hairline/50 pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              UTM Parameters
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MiniField
                label="Source"
                value={link.utmSource ?? ""}
                onChange={(v) => onChange({ utmSource: v })}
                placeholder="bio"
              />
              <MiniField
                label="Medium"
                value={link.utmMedium ?? ""}
                onChange={(v) => onChange({ utmMedium: v })}
                placeholder="social"
              />
              <MiniField
                label="Campaign"
                value={link.utmCampaign ?? ""}
                onChange={(v) => onChange({ utmCampaign: v })}
                placeholder="launch"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  danger,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={`spring grid h-7 w-7 place-items-center rounded-md border border-transparent text-muted-foreground disabled:opacity-30 ${
        danger
          ? "hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          : active
            ? "border-primary/40 bg-primary/10 text-primary"
            : "hover:border-hairline hover:bg-background hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function TemplateCard({
  template,
  active,
  onSelect,
}: {
  template: Template;
  active: boolean;
  onSelect: () => void;
}) {
  const bg =
    template.bgMode === "gradient"
      ? `linear-gradient(160deg, ${template.bg}, ${template.bg2})`
      : template.bg;
  return (
    <button
      onClick={onSelect}
      className={`spring group relative flex flex-col overflow-hidden rounded-xl border p-2 text-left ${
        active ? "border-primary" : "border-hairline hover:border-muted-foreground"
      }`}
      style={{ background: template.card }}
    >
      <div
        className="mb-2 flex h-24 w-full items-center justify-center rounded-lg"
        style={{ background: bg }}
      >
        <div className="flex flex-col items-center gap-1">
          <div
            className="h-4 w-4 rounded-full"
            style={{ background: template.accent, boxShadow: `0 0 0 2px ${template.card}` }}
          />
          <div
            className="h-1.5 w-10 rounded-full"
            style={{
              background: template.buttonStyle === "outline" ? "transparent" : template.accent,
              border: template.buttonStyle === "outline" ? `1px solid ${template.accent}` : "none",
              opacity: 0.9,
            }}
          />
          <div
            className="h-1.5 w-10 rounded-full"
            style={{ background: template.text, opacity: 0.35 }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold" style={{ color: template.text }}>
          {template.name}
        </span>
        {active && <Check className="h-3.5 w-3.5 text-primary" />}
      </div>
      <span className="px-1 text-[10px]" style={{ color: template.muted }}>
        {template.vibe}
      </span>
    </button>
  );
}

/* ---------------- Phone Preview ---------------- */

function PhoneMockup({
  profile,
  template,
  isPremium,
  onLinkClick,
}: {
  profile: Profile;
  template: Template;
  isPremium?: boolean;
  onLinkClick?: (id: string) => void;
}) {
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

  return (
    <div className="relative">
      <div
        className="relative h-[640px] w-[310px] rounded-[52px] border border-hairline p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        style={{ background: "linear-gradient(180deg, #202024 0%, #0e0e10 100%)" }}
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[44px] ${animatedClass}`}
          style={{ background: bg, color: template.text, fontFamily: font }}
        >
          {/* dim overlay when bg image */}
          {profile.bgMode === "image" && profile.bgImage && (
            <div className="absolute inset-0 bg-black/40" aria-hidden />
          )}

          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black/90" />

          <div className="relative flex h-full flex-col px-6 pb-6 pt-14">
            {/* Header */}
            <div className="flex flex-col items-center">
              <div
                className="spring h-20 w-20 overflow-hidden rounded-full"
                style={{ boxShadow: `0 0 0 2px ${template.accent}, 0 0 0 6px ${template.card}` }}
              >
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt={profile.handle}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <h3
                  className="text-lg font-bold tracking-tight"
                  style={{
                    color: template.text,
                    fontStyle: profile.font === "serif" ? "italic" : undefined,
                  }}
                >
                  {profile.handle || "@yourname"}
                </h3>
                {profile.verified && (
                  <BadgeCheck className="h-4 w-4" style={{ color: template.accent }} />
                )}
              </div>
              <p
                className="mt-1 max-w-[220px] text-center text-xs leading-relaxed"
                style={{ color: template.text, opacity: 0.65 }}
              >
                {profile.bio || "Your bio goes here."}
              </p>

              {/* Socials */}
              {profile.socials.filter((s) => s.value.trim()).length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {profile.socials
                    .filter((s) => s.value.trim())
                    .map((s) => {
                      const Icon = SOCIAL_META[s.key].icon;
                      return (
                        <a
                          key={s.key}
                          href={s.key === "email" ? `mailto:${s.value}` : s.value}
                          target="_blank"
                          rel="noreferrer"
                          className="spring grid h-8 w-8 place-items-center rounded-full hover:scale-110"
                          style={{
                            background: `${template.card}`,
                            color: template.text,
                            border: `1px solid ${template.accent}22`,
                          }}
                          aria-label={s.key}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </a>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-1">
              {profile.links.filter((l) => l.visible).length === 0 && (
                <p
                  className="pt-8 text-center text-xs"
                  style={{ color: template.text, opacity: 0.4 }}
                >
                  Add a link to see it appear here.
                </p>
              )}
              {profile.links
                .filter((l) => l.visible)
                .map((l) => (
                  <PreviewLinkBtn
                    key={l.id}
                    link={l}
                    template={template}
                    profile={profile}
                    radius={radius}
                    onLinkClick={onLinkClick}
                  />
                ))}
            </div>

            {/* Watermark */}
            {!isPremium && (
              <p
                className="pt-4 text-center text-[9px] uppercase tracking-[0.3em]"
                style={{ color: template.text, opacity: 0.4 }}
              >
                built with sleekbio
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <span className="absolute -left-[2px] top-28 h-8 w-[3px] rounded-l bg-hairline" />
      <span className="absolute -left-[2px] top-40 h-14 w-[3px] rounded-l bg-hairline" />
      <span className="absolute -right-[2px] top-36 h-16 w-[3px] rounded-r bg-hairline" />
    </div>
  );
}

function PreviewLinkBtn({
  link,
  template,
  profile,
  radius,
  onLinkClick,
}: {
  link: LinkItem;
  template: Template;
  profile: Profile;
  radius: string;
  onLinkClick?: (id: string) => void;
}) {
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
    // use raw URL if invalid/relative
  }

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noreferrer"
      onClick={() => onLinkClick?.(link.id)}
      className="spring group flex w-full items-center gap-3 px-3 py-3.5 text-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
      style={style}
    >
      {link.thumb ? (
        <img
          src={link.thumb}
          alt=""
          className="h-8 w-8 shrink-0 rounded-md object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : (
        <span className="h-8 w-8 shrink-0" aria-hidden />
      )}
      <span className="min-w-0 flex-1 truncate text-center" style={{ color: template.text }}>
        {link.label || "Untitled"}
      </span>
      <span className="h-8 w-8 shrink-0" aria-hidden />
    </a>
  );
}

/* ---------------- Share Dialog ---------------- */

function ShareDialog({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const qr = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=280x280&margin=8&bgcolor=1a1a1e&color=F1C261&format=svg`;
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-scale-in rounded-2xl border border-hairline bg-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Share Profile
          </h3>
          <button
            onClick={onClose}
            className="spring grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto mb-5 grid h-56 w-56 place-items-center rounded-xl border border-hairline bg-background p-2">
          <img src={qr} alt="QR code" className="h-full w-full" />
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-xl border border-hairline bg-background/40 px-3 py-2">
          <QrCode className="h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate text-xs text-foreground">{url}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(url);
              setCopied(true);
              toast.success("Link copied to clipboard");
              setTimeout(() => setCopied(false), 1600);
            }}
            className="spring inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:scale-[1.03] active:scale-[0.97]"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Scan · Share · Grow
        </p>
      </div>
    </div>
  );
}

/* ---------------- Checkout Dialog ---------------- */

function CheckoutDialog({
  onClose,
  onUpgrade,
  isCheckingOut,
}: {
  onClose: () => void;
  onUpgrade: (tier: "creator" | "agency") => void;
  isCheckingOut: boolean;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg animate-scale-in rounded-3xl border border-hairline bg-panel p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Upgrade to Premium Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="spring grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Creator Pass */}
          <div className="relative flex flex-col rounded-2xl border border-primary/20 bg-background/50 p-5 hover:border-primary/50 transition-colors">
            <span className="absolute -top-2.5 right-4 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
              Popular
            </span>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Creator Pass
            </div>
            <div className="mb-4 flex items-baseline gap-1">
              <span className="text-3xl font-black text-foreground">$5</span>
              <span className="text-xs text-muted-foreground">/ one-time</span>
            </div>
            <ul className="mb-6 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Remove SleekBio watermark
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> 4 Premium Animated themes
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Real-time click analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Custom UTM parameters
              </li>
            </ul>
            <button
              disabled={isCheckingOut}
              onClick={() => onUpgrade("creator")}
              className="spring mt-auto w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Buy Creator Pass
            </button>
          </div>

          {/* Agency Pass */}
          <div className="relative flex flex-col rounded-2xl border border-hairline bg-background/30 p-5 hover:border-hairline/80 transition-colors">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Agency Pass
            </div>
            <div className="mb-4 flex items-baseline gap-1">
              <span className="text-3xl font-black text-foreground">$19</span>
              <span className="text-xs text-muted-foreground">/ one-time</span>
            </div>
            <ul className="mb-6 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Everything in Creator Pass
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Unlimited profiles & handles
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Custom domains mapping
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> Dedicated email support
              </li>
            </ul>
            <button
              disabled={isCheckingOut}
              onClick={() => onUpgrade("agency")}
              className="spring mt-auto w-full rounded-xl border border-hairline bg-panel py-2.5 text-xs font-bold text-foreground hover:bg-background hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              Buy Agency Pass
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          Payments are secured by Stripe. Access is delivered instantly to your device.
        </p>
      </div>
    </div>
  );
}
