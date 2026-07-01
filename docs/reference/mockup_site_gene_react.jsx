import React from "react";

const SERVICES = [
  { title: "[Natural Effect]", time: "60 min" },
  { title: "[Soft Effect]", time: "90 min" },
  { title: "[Intense Effect]", time: "120 min" },
  { title: "[Lash/Brow Lamination]", time: "60 min" },
];

const FAQ_ITEMS = [
  "[How long do lash extensions last?]",
  "[Does the application hurt?]",
  "[Can extensions damage natural lashes?]",
  "[How should I prepare before appointment?]",
  "[How often do I need maintenance?]",
];

const BOOKING_FIELDS = [
  "Full name",
  "Phone number",
  "Service",
  "Preferred date",
  "Preferred time",
  "Email / optional",
];

export function validateMockupData() {
  return {
    hasFourServices: SERVICES.length === 4,
    hasFiveFaqItems: FAQ_ITEMS.length === 5,
    hasSixBookingFields: BOOKING_FIELDS.length === 6,
    hasRequiredServiceFields: SERVICES.every((service) => Boolean(service.title && service.time)),
  };
}

if (typeof console !== "undefined") {
  const testResults = validateMockupData();
  console.assert(testResults.hasFourServices, "Expected 4 service cards");
  console.assert(testResults.hasFiveFaqItems, "Expected 5 FAQ items");
  console.assert(testResults.hasSixBookingFields, "Expected 6 booking fields");
  console.assert(testResults.hasRequiredServiceFields, "Each service should have title and time");
}

function Icon({ name, className = "", size = 20 }) {
  const icons = {
    calendar: "M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM9 14l-2 7 5-3 5 3-2-7",
    sparkles: "M12 2l1.7 5.2L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.8L12 2ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-5",
    star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1L12 2Z",
    mapPin: "M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2",
    chevronDown: "M6 9l6 6 6-6",
    arrowRight: "M5 12h14M13 5l7 7-7 7",
    heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 6l-10 7L2 6",
    menu: "M3 6h18M3 12h18M3 18h18",
    gift: "M20 12v10H4V12M2 7h20v5H2V7ZM12 22V7M12 7H7.5a2.5 2.5 0 1 1 2.5-2.5C10 7 12 7 12 7ZM12 7h4.5A2.5 2.5 0 1 0 14 4.5C14 7 12 7 12 7Z",
    image: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M21 17l-5.5-5.5L5 22",
    instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M17.5 6.5h.01",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={icons[name] || icons.sparkles} />
    </svg>
  );
}

function PlaceholderImage({ label = "IMAGE PLACEHOLDER", className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#eadfd7] bg-[linear-gradient(135deg,#f7f0ea,#efe0d6,#fbf8f5)] ${className}`}>
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,#fff_0,#fff_18%,transparent_35%),radial-gradient(circle_at_70%_70%,#d9b8a9_0,transparent_30%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#7d6b60]">
        <Icon name="image" size={28} />
        <span className="px-4 text-center text-[11px] uppercase tracking-[0.28em]">{label}</span>
      </div>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-[#8b1c2b]">{children}</p>;
}

function Button({ children, variant = "dark" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition";
  if (variant === "light") {
    return <button className={`${base} bg-white text-[#5b0715] shadow-sm hover:bg-[#fff8f5]`}>{children}</button>;
  }
  return <button className={`${base} bg-[#5b0715] text-white shadow-[0_18px_40px_rgba(91,7,21,0.22)] hover:bg-[#3f0610]`}>{children}</button>;
}

function StatCard({ iconName, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center border-r border-[#e9ded5] px-5 py-8 text-center last:border-r-0">
      <div className="mb-3 text-[#8b6f5c]"><Icon name={iconName} size={30} /></div>
      <div className="font-serif text-4xl text-[#1b1716]">{value}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7d6b60]">{label}</div>
      <div className="mt-2 text-xs text-[#9a8a80]">[Text placeholder]</div>
    </div>
  );
}

function ServiceCard({ title, time }) {
  return (
    <div className="group overflow-hidden rounded-[28px] border border-[#eadfd7] bg-white shadow-[0_18px_50px_rgba(45,28,18,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(45,28,18,0.10)]">
      <PlaceholderImage label="SERVICE IMAGE" className="h-48 rounded-none border-0" />
      <div className="p-6">
        <h3 className="font-serif text-2xl text-[#1b1716]">{title}</h3>
        <div className="mt-4 flex items-center justify-between text-sm text-[#7d6b60]">
          <span>From [price]</span>
          <span className="inline-flex items-center gap-1"><Icon name="clock" size={15} /> {time}</span>
        </div>
        <button className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5b0715]">
          Learn more <Icon name="arrowRight" size={15} />
        </button>
      </div>
    </div>
  );
}

function TestimonialCard() {
  return (
    <div className="rounded-[26px] border border-[#eadfd7] bg-white p-6 shadow-[0_18px_45px_rgba(45,28,18,0.05)]">
      <div className="mb-4 flex gap-1 text-[#b88a35]">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={16} />)}
      </div>
      <p className="text-sm leading-7 text-[#5e514b]">[Testimonial placeholder about experience, attention to detail, elegance and results.]</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b1c2b]">[Client name]</p>
    </div>
  );
}

function FAQItem({ text }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#eadfd7] bg-white px-5 py-4 text-sm text-[#4f4540]">
      <span>{text}</span>
      <Icon name="chevronDown" size={18} className="text-[#8b1c2b]" />
    </div>
  );
}

export default function LashStudioMockup() {
  return (
    <main className="min-h-screen bg-[#fbf8f4] text-[#1b1716]">
      <header className="sticky top-0 z-50 border-b border-[#eadfd7] bg-[#fbf8f4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="font-serif text-2xl tracking-[0.26em]">[LOGO]</div>
          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4f4540] lg:flex">
            <a className="text-[#5b0715]" href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#about">About</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="hidden md:block"><Button>Book appointment</Button></div>
          <button className="lg:hidden" aria-label="Open navigation"><Icon name="menu" /></button>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden border-b border-[#eadfd7]">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[#f0dfd5] opacity-60" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
          <div className="relative z-10">
            <SectionEyebrow>Premium lash studio</SectionEyebrow>
            <h1 className="max-w-xl font-serif text-6xl leading-[0.95] tracking-[-0.04em] text-[#161211] md:text-7xl">
              [Headline Placeholder]
            </h1>
            <div className="mt-7 h-px w-24 bg-[#b89262]" />
            <p className="mt-8 max-w-lg text-xl leading-8 text-[#4f4540]">[Subheadline placeholder text]</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#7d6b60]">[Short descriptive text placeholder conveying premium experience, precision, elegance and beautiful results.]</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button>Book your appointment <Icon name="arrowRight" size={15} /></Button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[#d9c7bc] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#5b0715] hover:bg-white">
                View services
              </button>
            </div>
          </div>
          <div className="relative z-10">
            <PlaceholderImage label="HERO IMAGE / CLOSE-UP LASH PHOTO" className="h-[560px] rounded-[44px]" />
            <div className="absolute -bottom-7 -left-7 hidden rounded-[32px] border border-[#eadfd7] bg-white/90 p-6 shadow-[0_18px_60px_rgba(45,28,18,0.12)] backdrop-blur md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b1c2b]">[Award placeholder]</p>
              <p className="mt-2 font-serif text-2xl">National & International</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdfb]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 md:grid-cols-4">
          <StatCard iconName="award" value="[Award]" label="Champion" />
          <StatCard iconName="sparkles" value="3+" label="Years experience" />
          <StatCard iconName="heart" value="1200+" label="Clients" />
          <StatCard iconName="shield" value="[Cert.]" label="Certified" />
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionEyebrow>Section title</SectionEyebrow>
          <h2 className="font-serif text-5xl tracking-[-0.03em]">Our Services</h2>
          <p className="mt-5 text-[#7d6b60]">[Short text placeholder introducing the service categories and premium personalization.]</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} title={service.title} time={service.time} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[34px] bg-[#5b0715] p-8 text-white shadow-[0_24px_70px_rgba(91,7,21,0.20)] md:p-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_45%,rgba(255,255,255,0.20),transparent_35%)]" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12"><Icon name="gift" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e8c9c2]">Special offer / promo</p>
                <h3 className="mt-2 font-serif text-3xl">[Promo placeholder]</h3>
                <p className="mt-2 max-w-2xl text-sm text-white/75">[Short promotional placeholder. Example: discount for lash extensions combined with selected brow services.]</p>
              </div>
            </div>
            <Button variant="light">Claim offer <Icon name="arrowRight" size={15} /></Button>
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-[#f3ece6] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionEyebrow>Section title</SectionEyebrow>
              <h2 className="font-serif text-5xl tracking-[-0.03em]">Lash Gallery</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#7d6b60]">[Gallery intro placeholder. This section can show real work, salon atmosphere, owner portrait and details.]</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:grid-rows-2">
            <PlaceholderImage label="LARGE GALLERY IMAGE" className="h-72 md:col-span-2 md:row-span-2 md:h-full" />
            <PlaceholderImage label="PHOTO" className="h-44" />
            <PlaceholderImage label="PHOTO" className="h-44" />
            <PlaceholderImage label="PHOTO" className="h-44" />
            <PlaceholderImage label="PHOTO" className="h-44" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>Section title</SectionEyebrow>
            <h2 className="font-serif text-5xl tracking-[-0.03em]">Real Results</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#7d6b60]">[Before and after placeholder. Later this can become a hover or slider comparison component.]</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="relative overflow-hidden rounded-[30px] border border-[#eadfd7] bg-white p-3 shadow-[0_18px_50px_rgba(45,28,18,0.06)]">
              <PlaceholderImage label="BEFORE / AFTER IMAGE" className="h-64 rounded-[22px]" />
              <div className="absolute bottom-3 top-3 left-1/2 w-px bg-white/90" />
              <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#5b0715] shadow-lg">↔</div>
              <div className="absolute bottom-7 left-7 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">Before</div>
              <div className="absolute bottom-7 right-7 rounded-full bg-[#5b0715] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">After</div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#fffdfb] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <PlaceholderImage label="OWNER PORTRAIT" className="h-[520px]" />
          <div>
            <SectionEyebrow>Section title</SectionEyebrow>
            <h2 className="font-serif text-5xl leading-tight tracking-[-0.03em]">About Your Lash Artist</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5e514b]">[Short bio placeholder about experience, awards, passion and attention to detail.]</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7d6b60]">[Additional text placeholder. Later we can add the personal story and position her as a premium lash artist specialized in special effects.]</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Precision & artistry", "Premium products", "Customized looks", "Comfort focused"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#eadfd7] bg-[#fbf8f4] p-4">
                  <Icon name="sparkles" size={18} className="text-[#8b1c2b]" />
                  <span className="text-sm font-medium text-[#4f4540]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionEyebrow>Section title</SectionEyebrow>
            <h2 className="font-serif text-5xl tracking-[-0.03em]">What Clients Say</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-3">
              <TestimonialCard />
              <TestimonialCard />
              <TestimonialCard />
            </div>
          </div>
          <div id="faq">
            <SectionEyebrow>Section title</SectionEyebrow>
            <h2 className="font-serif text-5xl tracking-[-0.03em]">FAQ</h2>
            <div className="mt-10 space-y-3">
              {FAQ_ITEMS.map((item) => <FAQItem key={item} text={item} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3ece6] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <SectionEyebrow>Section title</SectionEyebrow>
            <h2 className="font-serif text-5xl leading-tight tracking-[-0.03em]">Book Your Appointment</h2>
            <div className="mt-8 space-y-4 text-sm text-[#5e514b]">
              <div className="flex items-center gap-3"><Icon name="calendar" size={18} className="text-[#8b1c2b]" /> Easy online booking</div>
              <div className="flex items-center gap-3"><Icon name="shield" size={18} className="text-[#8b1c2b]" /> Secure confirmation</div>
              <div className="flex items-center gap-3"><Icon name="heart" size={18} className="text-[#8b1c2b]" /> Personalized experience</div>
            </div>
          </div>
          <div className="rounded-[34px] border border-[#eadfd7] bg-white p-6 shadow-[0_24px_70px_rgba(45,28,18,0.08)] md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              {BOOKING_FIELDS.map((field) => (
                <div key={field} className="rounded-2xl border border-[#eadfd7] bg-[#fbf8f4] px-4 py-4 text-sm text-[#9a8a80]">[{field}]</div>
              ))}
              <div className="rounded-2xl border border-[#eadfd7] bg-[#fbf8f4] px-4 py-10 text-sm text-[#9a8a80] md:col-span-2">[Additional notes]</div>
            </div>
            <div className="mt-6 flex justify-end"><Button>Book appointment <Icon name="arrowRight" size={15} /></Button></div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <PlaceholderImage label="MAP / AREA PLACEHOLDER" className="h-96" />
        <div className="rounded-[34px] border border-[#eadfd7] bg-white p-8 shadow-[0_24px_70px_rgba(45,28,18,0.07)]">
          <SectionEyebrow>Section title</SectionEyebrow>
          <h2 className="font-serif text-5xl tracking-[-0.03em]">Visit Us</h2>
          <div className="mt-8 space-y-5 text-sm text-[#5e514b]">
            <div className="flex items-center gap-3"><Icon name="mapPin" size={18} className="text-[#8b1c2b]" /> [Zona: Metrou Izvor]</div>
            <div className="flex items-center gap-3"><Icon name="phone" size={18} className="text-[#8b1c2b]" /> [Phone placeholder]</div>
            <div className="flex items-center gap-3"><Icon name="mail" size={18} className="text-[#8b1c2b]" /> [Email placeholder]</div>
            <div className="flex items-center gap-3"><Icon name="instagram" size={18} className="text-[#8b1c2b]" /> [Instagram placeholder]</div>
            <div className="flex items-center gap-3"><Icon name="clock" size={18} className="text-[#8b1c2b]" /> [Schedule placeholder]</div>
          </div>
        </div>
      </section>

      <footer className="bg-[#14100f] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="font-serif text-2xl tracking-[0.26em]">[LOGO]</div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">[Short footer text placeholder about beauty, confidence and premium lash experiences.]</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Quick links</h4>
            <div className="mt-5 space-y-3 text-sm text-white/55"><p>Home</p><p>Services</p><p>Gallery</p><p>Reviews</p><p>Contact</p></div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Services</h4>
            <div className="mt-5 space-y-3 text-sm text-white/55"><p>[Service 1]</p><p>[Service 2]</p><p>[Service 3]</p><p>[Service 4]</p></div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Newsletter</h4>
            <p className="mt-5 text-sm text-white/55">[Short placeholder]</p>
            <div className="mt-4 flex gap-2 rounded-full bg-white p-1">
              <input className="min-w-0 flex-1 bg-transparent px-4 text-sm text-black outline-none" placeholder="Email address" />
              <button className="rounded-full bg-[#5b0715] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em]">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">© [YEAR] [BUSINESS NAME]. All rights reserved.</div>
      </footer>
    </main>
  );
}
