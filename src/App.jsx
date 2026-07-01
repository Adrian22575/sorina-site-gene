import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  AtSign,
  Award,
  CalendarDays,
  ChevronDown,
  Clock,
  Gift,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import heroImage from './assets/hero.png'
import './App.css'

const services = [
  {
    title: 'Efect natural',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Gene fine, aerisite, pentru un rezultat discret si elegant.',
  },
  {
    title: 'Volum delicat',
    duration: '90 min',
    price: 'Pret de completat',
    note: 'Volum fin, privire luminoasa si linie rafinata.',
  },
  {
    title: 'Efect intens',
    duration: '120 min',
    price: 'Pret de completat',
    note: 'Efect vizibil, construit cu atentie dupa forma ochilor.',
  },
  {
    title: 'Laminare gene / sprancene',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Definire si aranjare pentru gene sau sprancene naturale.',
  },
]

const proof = [
  { icon: Award, value: 'De completat', label: 'Premii', note: 'Se adauga doar dupa confirmare.' },
  { icon: Sparkles, value: 'De completat', label: 'Experienta', note: 'Anii reali vor fi completati de Sorina.' },
  { icon: Heart, value: 'De completat', label: 'Cliente', note: 'Numarul final trebuie verificat.' },
  { icon: ShieldCheck, value: 'De completat', label: 'Certificari', note: 'Fara afirmatii neverificate.' },
]

const faq = [
  {
    question: 'Cat rezista extensiile de gene?',
    answer: 'Rezistenta depinde de ritmul natural de crestere, tipul genelor si ingrijirea de acasa. Intervalul potrivit pentru intretinere se stabileste la consultatie.',
  },
  {
    question: 'Doare aplicarea extensiilor?',
    answer: 'Aplicarea trebuie sa fie confortabila. Daca apare sensibilitate, se ajusteaza pozitia sau tehnica pentru ca programarea sa ramana calma.',
  },
  {
    question: 'Pot afecta genele naturale?',
    answer: 'Extensiile sunt gandite sa respecte genele naturale atunci cand lungimea, grosimea si densitatea sunt alese corect.',
  },
  {
    question: 'Cum ma pregatesc inainte de programare?',
    answer: 'Vino fara machiaj in zona ochilor si evita produsele uleioase inainte de aplicare. Confirmarea finala se face inainte de programare.',
  },
  {
    question: 'La cat timp se face intretinerea?',
    answer: 'Ritmul de intretinere se recomanda individual, dupa stilul de viata si felul in care se pastreaza extensiile.',
  },
]

const gallery = [
  'Fotografie principala din galerie',
  'Detaliu lucrare',
  'Portret',
  'Atmosfera studio',
  'Rezultat final',
]

const results = [
  { title: 'Ridicare naturala', before: 'Inainte', after: 'Dupa' },
  { title: 'Volum delicat', before: 'Inainte', after: 'Dupa' },
  { title: 'Set intens', before: 'Inainte', after: 'Dupa' },
]

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function Button({ children, href = '#booking', tone = 'dark' }) {
  return (
    <a className={`button button-${tone}`} href={href}>
      {children}
    </a>
  )
}

function ImageSlot({ label, tall = false, src, alt }) {
  return (
    <div className={`image-slot ${tall ? 'image-slot-tall' : ''}`} aria-label={src ? undefined : label}>
      {src ? <img src={src} alt={alt || label} /> : <span>{label}</span>}
    </div>
  )
}

function SectionIntro({ eyebrow, title, children, centered = false }) {
  return (
    <div className={`section-intro ${centered ? 'section-intro-centered' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  )
}

function ServiceCard({ service }) {
  return (
    <article className="service-card" id={`service-${slugify(service.title)}`}>
      <ImageSlot label={`Imagine pentru ${service.title}`} />
      <div className="service-body">
        <h3>{service.title}</h3>
        <p>{service.note}</p>
        <div className="service-meta">
          <span>{service.price}</span>
          <span><Clock size={15} /> {service.duration}</span>
        </div>
        <a className="learn-more" href="#booking" aria-label={`Cere detalii pentru ${service.title}`}>
          Cere detalii <ArrowRight size={15} />
        </a>
      </div>
    </article>
  )
}

function BeforeAfterCard({ item }) {
  const [position, setPosition] = useState(50)

  function updateFromRange(event) {
    setPosition(Number(event.target.value))
  }

  function updateFromPointer(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const next = ((event.clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(92, Math.max(8, next)))
  }

  return (
    <article className="comparison-card">
      <div
        className="comparison-stage"
        style={{ '--position': `${position}%` }}
        onPointerMove={updateFromPointer}
        onPointerDown={updateFromPointer}
      >
        <div className="comparison-layer comparison-before" />
        <div className="comparison-layer comparison-after" />
        <span className="comparison-label comparison-label-before">{item.before}</span>
        <span className="comparison-label comparison-label-after">{item.after}</span>
        <div className="comparison-divider" />
        <div className="comparison-handle" aria-hidden="true">&lt;&gt;</div>
        <input
          className="comparison-range"
          type="range"
          min="8"
          max="92"
          value={position}
          aria-label={`${item.title}: gliseaza pentru comparatia inainte si dupa`}
          onInput={updateFromRange}
          onChange={updateFromRange}
        />
      </div>
      <div className="comparison-caption">
        <strong>{item.title}</strong>
        <span>Inainte / dupa</span>
      </div>
    </article>
  )
}

export default function App() {
  const [bookingStatus, setBookingStatus] = useState({ state: 'idle', message: '' })

  async function submitBooking(event) {
    event.preventDefault()
    setBookingStatus({ state: 'loading', message: 'Se trimite cererea...' })

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Cererea nu a putut fi trimisa.')
      }

      event.currentTarget.reset()
      setBookingStatus({
        state: 'success',
        message: 'Cererea a fost trimisa. Sorina te va contacta pentru confirmare.',
      })
    } catch (error) {
      setBookingStatus({
        state: 'error',
        message: error.message || 'A aparut o eroare. Incearca din nou.',
      })
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home">Sorina - Studio de Gene</a>
        <nav aria-label="Navigatie principala">
          <a href="#services">Servicii</a>
          <a href="#gallery">Galerie</a>
          <a href="#results">Rezultate</a>
          <a href="#about">Despre</a>
          <a href="#reviews">Recenzii</a>
          <a href="#faq">Intrebari</a>
          <a href="#contact">Contact</a>
        </nav>
        <Button href="#booking" tone="outline">Programeaza-te</Button>
      </header>

      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div className="hero-copy">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              Studio premium de gene in Bucuresti
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
            >
              Extensii de gene create cu precizie, calm si gust.
            </motion.h1>
            <motion.p
              className="hero-lede"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
            >
              Sorina construieste fiecare set dupa forma ochilor, stilul tau si confortul genelor naturale.
            </motion.p>
            <motion.p
              className="hero-note"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              Alege un efect natural, delicat sau intens si trimite o cerere de programare pentru confirmare.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
            >
              <Button>
                Cere programare <ArrowRight size={16} />
              </Button>
              <Button href="#services" tone="light">Vezi serviciile</Button>
            </motion.div>
          </div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            <ImageSlot
              src={heroImage}
              label="Detaliu premium pentru extensii de gene"
              alt="Prim-plan editorial cu gene stilizate pentru Sorina - Studio de Gene"
              tall
            />
            <div className="hero-badge">
              <p className="eyebrow">Detalii verificate in curand</p>
              <strong>Premii si certificari dupa confirmare</strong>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Dovezi si repere">
        {proof.map((item) => {
          const Icon = item.icon
          return (
            <div className="proof-item" key={item.label}>
              <Icon size={28} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.note}</small>
            </div>
          )
        })}
      </section>

      <section className="section" id="services">
        <SectionIntro
          centered
          eyebrow="Servicii"
          title="Extensii de gene si laminare"
        >
          Servicii premium pentru efecte naturale, delicate sau intense, adaptate la privirea ta.
        </SectionIntro>
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <section className="promo">
        <div className="promo-icon"><Gift size={28} /></div>
        <div>
          <p className="eyebrow">Oferta speciala</p>
          <h2>Promotie de completat</h2>
          <p>Loc rezervat pentru o reducere reala, un pachet sau o campanie cu termen clar.</p>
        </div>
        <Button tone="light">Cere detalii <ArrowRight size={16} /></Button>
      </section>

      <section className="section muted" id="gallery">
        <SectionIntro
          eyebrow="Galerie"
          title="Lucrari si atmosfera de studio"
        >
          Galerie pentru lucrari reale, portrete, detalii de aplicare si imagini din studio.
        </SectionIntro>
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <ImageSlot key={`${item}-${index}`} label={item} tall={index === 0} />
          ))}
        </div>
      </section>

      <section className="section results" id="results">
        <SectionIntro
          eyebrow="Rezultate"
          title="Comparatii inainte si dupa"
        >
          Spatiu pentru fotografii reale, ca vizitatoarele sa inteleaga diferenta dintre efecte.
        </SectionIntro>
        <div className="comparison-grid">
          {results.map((item) => (
            <BeforeAfterCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="section split" id="about">
        <ImageSlot label="Portret Sorina" tall />
        <div>
          <p className="eyebrow">Despre Sorina</p>
          <h2>Un stil de lucru atent, curat si personalizat</h2>
          <p>
            Loc pentru povestea Sorinei, experienta reala, pregatire, premii si felul in care alege
            lungimea, curbura si densitatea potrivita pentru fiecare clienta.
          </p>
          <ul className="check-list">
            <li><Sparkles size={18} /> Precizie si simt estetic</li>
            <li><ShieldCheck size={18} /> Produse de completat dupa confirmare</li>
            <li><Heart size={18} /> Efecte personalizate</li>
            <li><Clock size={18} /> Programare gandita pentru confort</li>
          </ul>
        </div>
      </section>

      <section className="section reviews-faq" id="reviews">
        <div>
          <p className="eyebrow">Recenzii</p>
          <h2>Ce spun clientele</h2>
          <div className="review-grid">
            {[1, 2, 3].map((item) => (
              <div className="review-card" key={item}>
                <div className="stars" aria-label="Recenzie de 5 stele, de completat cu dovada reala">
                  {[...Array(5)].map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                </div>
                <p>Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.</p>
                <strong>Nume clienta de completat</strong>
              </div>
            ))}
          </div>
        </div>
        <div id="faq">
          <p className="eyebrow">Intrebari frecvente</p>
          <h2>Raspunsuri utile inainte de programare</h2>
          <div className="faq-list">
            {faq.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <ChevronDown size={18} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section booking" id="booking">
        <div>
          <p className="eyebrow">Programare</p>
          <h2>Trimite o cerere de programare</h2>
          <div className="booking-points">
            <span><CalendarDays size={18} /> Cerere rapida online</span>
            <span><ShieldCheck size={18} /> Confirmare manuala</span>
            <span><Heart size={18} /> Recomandare personalizata</span>
          </div>
        </div>
        <form onSubmit={submitBooking}>
          <label>
            Nume complet
            <input name="full_name" autoComplete="name" required />
          </label>
          <label>
            Numar de telefon
            <input name="phone" autoComplete="tel" required />
          </label>
          <label>
            Serviciu
            <select name="service" defaultValue="" required>
              <option value="" disabled>Alege serviciul</option>
              {services.map((service) => <option key={service.title}>{service.title}</option>)}
            </select>
          </label>
          <label>
            Data preferata
            <input name="preferred_date" type="date" required />
          </label>
          <label>
            Ora preferata
            <input name="preferred_time" type="time" />
          </label>
          <label>
            Adresa de email optionala
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label className="full">
            Detalii suplimentare
            <textarea name="message" rows="4" />
          </label>
          <label className="honeypot" aria-hidden="true">
            Firma
            <input name="company" tabIndex="-1" autoComplete="off" />
          </label>
          <label className="consent-field full">
            <input name="privacy_consent" type="checkbox" value="yes" required />
            <span>
              Sunt de acord ca datele trimise sa fie folosite pentru contactarea mea si confirmarea programarii.
            </span>
          </label>
          <p className="privacy-note full">
            Datele sunt folosite doar pentru programare. Politica de confidentialitate va fi completata inainte de lansarea publica.
          </p>
          <button type="submit" disabled={bookingStatus.state === 'loading'}>
            {bookingStatus.state === 'loading' ? 'Se trimite...' : 'Trimite cererea'} <ArrowRight size={16} />
          </button>
          {bookingStatus.message ? (
            <p className={`form-status form-status-${bookingStatus.state}`} role="status" aria-live="polite">
              {bookingStatus.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className="section contact" id="contact">
        <ImageSlot label="Harta sau zona de acces" />
        <div className="contact-card">
          <p className="eyebrow">Contact</p>
          <h2>Zona si detalii</h2>
          <p><MapPin size={18} /> Zona Izvor, Bucuresti - de confirmat</p>
          <p><Phone size={18} /> Telefon de completat</p>
          <p><AtSign size={18} /> Instagram de completat</p>
          <p><Clock size={18} /> Program de completat</p>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Sorina - Studio de Gene</strong>
          <p>Extensii de gene si laminare in Bucuresti, cu accent pe confort, forma potrivita si rezultat elegant.</p>
        </div>
        <nav aria-label="Servicii in subsol">
          {services.map((service) => <a key={service.title} href="#services">{service.title}</a>)}
        </nav>
      </footer>
    </main>
  )
}
