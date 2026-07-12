import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SleekBio — Premium Link-in-Bio Builder" },
      { name: "description", content: "SleekBio is a minimal, luxury-grade link-in-bio builder. Craft a beautiful profile with real-time preview." },
      { property: "og:title", content: "SleekBio — Premium Link-in-Bio Builder" },
      { property: "og:description", content: "Craft a beautiful link-in-bio profile with real-time preview." },
    ],
  }),
});

type LinkItem = { id: string; label: string; url: string; visible: boolean };

const THEMES = [
  { id: "sand", name: "Sandstone", bg: "#121214", card: "#1a1a1e", text: "#e4e4e7", accent: "#F1C261" },
  { id: "ivory", name: "Ivory", bg: "#f5f3ee", card: "#ffffff", text: "#121214", accent: "#121214" },
  { id: "midnight", name: "Midnight", bg: "#0b0f1a", card: "#141a2b", text: "#e6eaf2", accent: "#7aa2ff" },
  { id: "moss", name: "Moss", bg: "#101512", card: "#182019", text: "#e8ece6", accent: "#a3c9a0" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function Index() {
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces");
  const [handle, setHandle] = useState("@alex.morgan");
  const [bio, setBio] = useState("Designer & founder. Building calm software.");
  const [themeId, setThemeId] = useState("sand");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: uid(), label: "Portfolio", url: "https://example.com", visible: true },
    { id: uid(), label: "Latest Essay — On Restraint", url: "https://example.com/essay", visible: true },
    { id: uid(), label: "Book a call", url: "https://example.com/call", visible: true },
  ]);

  const theme = useMemo(() => THEMES.find((t) => t.id === themeId)!, [themeId]);

  const updateLink = (id: string, patch: Partial<LinkItem>) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const addLink = () =>
    setLinks((prev) => [...prev, { id: uid(), label: "New Link", url: "https://", visible: true }]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT: EDITOR */}
        <section className="border-b border-hairline lg:border-b-0 lg:border-r">
          {/* Top nav */}
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-background/80 px-6 py-4 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-[0.2em] text-primary">SLEEKBIO</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            </div>
            <button className="spring group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:scale-[1.03] hover:shadow-[0_0_0_4px_rgba(241,194,97,0.12)] active:scale-[0.98]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70 transition-all group-hover:bg-primary-foreground" />
              Upgrade for $5
            </button>
          </header>

          <div className="mx-auto max-w-xl space-y-10 px-6 py-10 sm:px-8">
            {/* Profile */}
            <div>
              <SectionLabel index="01" title="Your Profile Elements" />
              <div className="space-y-3">
                <Field label="Profile Picture URL" value={avatar} onChange={setAvatar} placeholder="https://..." />
                <Field label="Name / Handle" value={handle} onChange={setHandle} placeholder="@username" />
                <Field label="Bio Description" value={bio} onChange={setBio} textarea placeholder="Short and sharp." />
              </div>
            </div>

            {/* Links */}
            <div>
              <SectionLabel index="02" title="Links" />
              <div className="space-y-3">
                {links.map((link, i) => (
                  <div
                    key={link.id}
                    className="spring group rounded-xl border border-hairline bg-panel p-4 hover:border-primary/40"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Link · {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-3">
                        <Toggle checked={link.visible} onChange={(v) => updateLink(link.id, { visible: v })} />
                        <button
                          onClick={() => removeLink(link.id)}
                          className="spring text-xs text-muted-foreground hover:text-destructive"
                          aria-label="Remove link"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <MiniField
                        label="Label"
                        value={link.label}
                        onChange={(v) => updateLink(link.id, { label: v })}
                      />
                      <MiniField
                        label="URL"
                        value={link.url}
                        onChange={(v) => updateLink(link.id, { url: v })}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addLink}
                  className="spring flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-transparent py-4 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:bg-panel hover:text-foreground active:scale-[0.99]"
                >
                  <span className="text-primary">+</span> Add New Link
                </button>
              </div>
            </div>

            {/* Theme */}
            <div>
              <SectionLabel index="03" title="Theme" />
              <div className="flex items-center gap-4">
                {THEMES.map((t) => {
                  const active = themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`spring group relative flex flex-col items-center gap-2 ${
                        active ? "" : "opacity-80 hover:opacity-100"
                      }`}
                      aria-label={t.name}
                    >
                      <span
                        className={`spring block h-11 w-11 rounded-full border-2 ${
                          active ? "border-primary" : "border-hairline group-hover:border-muted-foreground"
                        }`}
                        style={{
                          background: `conic-gradient(from 210deg, ${t.bg} 0 40%, ${t.card} 40% 75%, ${t.accent} 75% 100%)`,
                        }}
                      />
                      <span className={`text-[10px] uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="pt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
              Autosaved · v1.0
            </p>
          </div>
        </section>

        {/* RIGHT: PREVIEW */}
        <section className="relative flex items-center justify-center overflow-hidden bg-panel-2 px-6 py-16 sm:px-10">
          {/* subtle grid */}
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
            style={{ background: "radial-gradient(circle, var(--color-primary), transparent 60%)" }}
          />

          <PhoneMockup theme={theme} avatar={avatar} handle={handle} bio={bio} links={links.filter((l) => l.visible)} />
        </section>
      </div>
    </main>
  );
}

/* ---------- Sub-components ---------- */

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="font-mono text-[10px] tracking-widest text-primary">{index}</span>
      <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">{title}</h2>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const shared =
    "spring w-full rounded-xl border border-hairline bg-panel px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={shared + " resize-none"}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={shared} />
      )}
    </label>
  );
}

function MiniField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="spring flex items-center gap-3 rounded-lg border border-transparent bg-background/40 px-3 py-2 focus-within:border-primary/40">
      <span className="w-10 shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          checked ? "left-[calc(100%-14px)] bg-primary-foreground" : "left-[3px] bg-muted-foreground"
        }`}
      />
    </button>
  );
}

function PhoneMockup({
  theme,
  avatar,
  handle,
  bio,
  links,
}: {
  theme: (typeof THEMES)[number];
  avatar: string;
  handle: string;
  bio: string;
  links: LinkItem[];
}) {
  return (
    <div className="relative">
      {/* Device frame */}
      <div
        className="relative h-[640px] w-[310px] rounded-[52px] border border-hairline p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        style={{ background: "linear-gradient(180deg, #202024 0%, #0e0e10 100%)" }}
      >
        {/* Inner bezel */}
        <div
          className="relative h-full w-full overflow-hidden rounded-[44px]"
          style={{ background: theme.bg, color: theme.text }}
        >
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black/90" />

          {/* Content scroll */}
          <div className="flex h-full flex-col px-6 pb-6 pt-14">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div
                className="spring h-20 w-20 overflow-hidden rounded-full ring-2 ring-offset-4"
                style={{ boxShadow: `0 0 0 2px ${theme.accent}`, background: theme.card }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={handle}
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight" style={{ color: theme.text }}>
                {handle || "@yourname"}
              </h3>
              <p
                className="mt-1 max-w-[220px] text-center text-xs leading-relaxed"
                style={{ color: theme.text, opacity: 0.65 }}
              >
                {bio || "Your bio goes here."}
              </p>
            </div>

            {/* Links */}
            <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
              {links.length === 0 && (
                <p className="pt-8 text-center text-xs" style={{ color: theme.text, opacity: 0.4 }}>
                  Add a link to see it appear here.
                </p>
              )}
              {links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="spring block w-full rounded-2xl px-4 py-3.5 text-center text-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: theme.card,
                    color: theme.text,
                    border: `1px solid ${theme.accent}22`,
                  }}
                >
                  {l.label || "Untitled"}
                </a>
              ))}
            </div>

            {/* Watermark */}
            <p
              className="pt-4 text-center text-[9px] uppercase tracking-[0.3em]"
              style={{ color: theme.text, opacity: 0.35 }}
            >
              built with sleekbio
            </p>
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
