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
import './App.css'

const services = [
  {
    title: 'Natural Effect',
    duration: '60 min',
    price: 'From [price]',
    note: 'Gene fine, aerisite, pentru un rezultat discret si elegant.',
  },
  {
    title: 'Soft Effect',
    duration: '90 min',
    price: 'From [price]',
    note: 'Volum delicat, privire luminoasa si linie rafinata.',
  },
  {
    title: 'Intense Effect',
    duration: '120 min',
    price: 'From [price]',
    note: 'Efect vizibil, construit cu atentie pe fizionomia ochilor.',
  },
  {
    title: 'Lash / Brow Lamination',
    duration: '60 min',
    price: 'From [price]',
    note: 'Definire si aranjare pentru gene sau sprancene naturale.',
  },
]

const proof = [
  { icon: Award, value: '[Award]', label: 'Champion' },
  { icon: Sparkles, value: '3+', label: 'Years experience' },
  { icon: Heart, value: '1200+', label: 'Clients' },
  { icon: ShieldCheck, value: '[Cert.]', label: 'Certified' },
]

const faq = [
  'Cat rezista extensiile de gene?',
  'Doare aplicarea extensiilor?',
  'Pot afecta genele naturale?',
  'Cum ma pregatesc inainte de programare?',
  'La cat timp se face intretinerea?',
]

const gallery = [
  'Large gallery image',
  'Photo',
  'Photo',
  'Photo',
  'Photo',
]

const results = [
  { title: 'Natural lift', before: 'Before', after: 'After' },
  { title: 'Soft volume', before: 'Before', after: 'After' },
  { title: 'Intense set', before: 'Before', after: 'After' },
]

function Button({ children, href = '#booking', tone = 'dark' }) {
  return (
    <a className={`button button-${tone}`} href={href}>
      {children}
    </a>
  )
}

function ImageSlot({ label, tall = false }) {
  return (
    <div className={`image-slot ${tall ? 'image-slot-tall' : ''}`} aria-label={label}>
      <span>{label}</span>
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
    <article className="service-card" id={`service-${service.title.toLowerCase().replaceAll(' ', '-')}`}>
      <ImageSlot label="Service image" />
      <div className="service-body">
        <h3>{service.title}</h3>
        <p>{service.note}</p>
        <div className="service-meta">
          <span>{service.price}</span>
          <span><Clock size={15} /> {service.duration}</span>
        </div>
        <a className="learn-more" href="#booking" aria-label={`Learn more about ${service.title}`}>
          Learn more <ArrowRight size={15} />
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
        <div className="comparison-layer comparison-before">
        </div>
        <div className="comparison-layer comparison-after">
        </div>
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
          aria-label={`${item.title}: drag to compare before and after`}
          onInput={updateFromRange}
          onChange={updateFromRange}
        />
      </div>
      <div className="comparison-caption">
        <strong>{item.title}</strong>
        <span>Before / After</span>
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
        <a className="brand" href="#home">[LOGO]</a>
        <nav aria-label="Navigatie principala">
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#results">Results</a>
          <a href="#about">About</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
        <Button href="#booking" tone="outline">Book appointment</Button>
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
              Premium lash studio
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
              Un rezultat premium porneste de la consultatie, forma ochilor si ritmul tau de viata.
            </motion.p>
            <motion.p
              className="hero-note"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              Experienta este gandita pentru efecte personalizate, aplicare confortabila si rezultate care arata bine zi de zi.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
            >
              <Button>
                Book your appointment <ArrowRight size={16} />
              </Button>
              <Button href="#services" tone="light">View services</Button>
            </motion.div>
          </div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            <ImageSlot label="Hero image / close-up lash photo" tall />
            <div className="hero-badge">
              <p className="eyebrow">[Award placeholder]</p>
              <strong>National & International</strong>
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
              <small>[Text placeholder]</small>
            </div>
          )
        })}
      </section>

      <section className="section" id="services">
        <SectionIntro
          centered
          eyebrow="Section title"
          title="Our Services"
        >
          Servicii premium pentru efecte naturale, soft sau intense, adaptate la privirea ta.
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
          <p className="eyebrow">Special offer / promo</p>
          <h2>[Promo placeholder]</h2>
          <p>Loc pentru o reducere reala, pachet sau campanie cu termen clar.</p>
        </div>
        <Button tone="light">Claim offer <ArrowRight size={16} /></Button>
      </section>

      <section className="section muted" id="gallery">
        <SectionIntro
          eyebrow="Section title"
          title="Lash Gallery"
        >
          Galerie pentru lucrari reale, atmosfera de studio, portret si detalii.
        </SectionIntro>
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <ImageSlot key={`${item}-${index}`} label={item} tall={index === 0} />
          ))}
        </div>
      </section>

      <section className="section results" id="results">
        <SectionIntro
          eyebrow="Section title"
          title="Real Results"
        >
          Comparatii vizuale pentru a vedea diferenta dintre inainte si dupa.
        </SectionIntro>
        <div className="comparison-grid">
          {results.map((item) => (
            <BeforeAfterCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="section split" id="about">
        <ImageSlot label="Owner portrait" tall />
        <div>
          <p className="eyebrow">Section title</p>
          <h2>About Your Lash Artist</h2>
          <p>
            Loc pentru povestea Sorinei, experienta, premii, stil de lucru si atentia la detaliu.
            Pozitionarea ramane premium, personala si foarte exacta.
          </p>
          <ul className="check-list">
            <li><Sparkles size={18} /> Precision & artistry</li>
            <li><ShieldCheck size={18} /> Premium products</li>
            <li><Heart size={18} /> Customized looks</li>
            <li><Clock size={18} /> Comfort focused</li>
          </ul>
        </div>
      </section>

      <section className="section reviews-faq" id="reviews">
        <div>
          <p className="eyebrow">Section title</p>
          <h2>What Clients Say</h2>
          <div className="review-grid">
            {[1, 2, 3].map((item) => (
              <div className="review-card" key={item}>
                <div className="stars" aria-label="5 stele">
                  {[...Array(5)].map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                </div>
                <p>[Testimonial placeholder about experience, attention to detail, elegance and results.]</p>
                <strong>[Client name]</strong>
              </div>
            ))}
          </div>
        </div>
        <div id="faq">
          <p className="eyebrow">Section title</p>
          <h2>FAQ</h2>
          <div className="faq-list">
            {faq.map((item) => (
              <button key={item} type="button">
                {item}
                <ChevronDown size={18} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section booking" id="booking">
        <div>
          <p className="eyebrow">Section title</p>
          <h2>Book Your Appointment</h2>
          <div className="booking-points">
            <span><CalendarDays size={18} /> Easy online booking</span>
            <span><ShieldCheck size={18} /> Secure confirmation</span>
            <span><Heart size={18} /> Personalized experience</span>
          </div>
        </div>
        <form onSubmit={submitBooking}>
          <label>
            Full name
            <input name="full_name" autoComplete="name" required />
          </label>
          <label>
            Phone number
            <input name="phone" autoComplete="tel" required />
          </label>
          <label>
            Service
            <select name="service" defaultValue="" required>
              <option value="" disabled>Select service</option>
              {services.map((service) => <option key={service.title}>{service.title}</option>)}
            </select>
          </label>
          <label>
            Preferred date
            <input name="preferred_date" type="date" required />
          </label>
          <label>
            Preferred time
            <input name="preferred_time" type="time" />
          </label>
          <label>
            Email / optional
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label className="full">
            Additional notes
            <textarea name="message" rows="4" />
          </label>
          <label className="honeypot" aria-hidden="true">
            Company
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
            {bookingStatus.state === 'loading' ? 'Sending...' : 'Book appointment'} <ArrowRight size={16} />
          </button>
          {bookingStatus.message ? (
            <p className={`form-status form-status-${bookingStatus.state}`} role="status" aria-live="polite">
              {bookingStatus.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className="section contact" id="contact">
        <ImageSlot label="Map / area placeholder" />
        <div className="contact-card">
          <p className="eyebrow">Section title</p>
          <h2>Visit Us</h2>
          <p><MapPin size={18} /> [Zona: Metrou Izvor]</p>
          <p><Phone size={18} /> [Phone placeholder]</p>
          <p><AtSign size={18} /> [Instagram placeholder]</p>
          <p><Clock size={18} /> [Schedule placeholder]</p>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>[LOGO]</strong>
          <p>[Short footer text placeholder about beauty, confidence and premium lash experiences.]</p>
        </div>
        <nav aria-label="Footer services">
          {services.map((service) => <a key={service.title} href="#services">{service.title}</a>)}
        </nav>
      </footer>
    </main>
  )
}
