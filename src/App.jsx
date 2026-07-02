import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  AtSign,
  Award,
  CalendarDays,
  ChevronDown,
  Clock,
  Crop,
  Gift,
  Heart,
  LogOut,
  MapPin,
  Phone,
  Plus,
  RefreshCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react'
import heroImage from './assets/hero.png'
import './App.css'

const defaultServices = [
  {
    title: 'Efect natural',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Gene fine, aerisite, pentru un rezultat discret si elegant.',
    image_url: '',
  },
  {
    title: 'Volum delicat',
    duration: '90 min',
    price: 'Pret de completat',
    note: 'Volum fin, privire luminoasa si linie rafinata.',
    image_url: '',
  },
  {
    title: 'Efect intens',
    duration: '120 min',
    price: 'Pret de completat',
    note: 'Efect vizibil, construit cu atentie dupa forma ochilor.',
    image_url: '',
  },
  {
    title: 'Laminare gene / sprancene',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Definire si aranjare pentru gene sau sprancene naturale.',
    image_url: '',
  },
]

const proof = [
  { icon: Award, value: 'De completat', label: 'Premii', note: 'Se adauga doar dupa confirmare.' },
  { icon: Sparkles, value: 'De completat', label: 'Experienta', note: 'Anii reali vor fi completati de Sorina.' },
  { icon: Heart, value: 'De completat', label: 'Cliente', note: 'Numarul final trebuie verificat.' },
  { icon: ShieldCheck, value: 'De completat', label: 'Certificari', note: 'Fara afirmatii neverificate.' },
]

const defaultContact = {
  area: 'Zona Izvor, Bucuresti - de confirmat',
  phone: 'Telefon de completat',
  instagram: 'Instagram de completat',
  schedule: 'Program de completat',
  map_label: 'Harta sau zona de acces',
}

const defaultFaqs = [
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

const defaultGallery = [
  { title: 'Fotografie principala din galerie', image_url: '', alt_text: 'Fotografie principala din galerie' },
  { title: 'Detaliu lucrare', image_url: '', alt_text: 'Detaliu lucrare' },
  { title: 'Portret', image_url: '', alt_text: 'Portret' },
  { title: 'Atmosfera studio', image_url: '', alt_text: 'Atmosfera studio' },
  { title: 'Rezultat final', image_url: '', alt_text: 'Rezultat final' },
]

const defaultReviews = [
  {
    customer_name: 'Nume clienta de completat',
    review_text: 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.',
    rating: 5,
  },
  {
    customer_name: 'Nume clienta de completat',
    review_text: 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.',
    rating: 5,
  },
  {
    customer_name: 'Nume clienta de completat',
    review_text: 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.',
    rating: 5,
  },
]

const defaultPromotions = [
  {
    eyebrow: 'Oferta speciala',
    title: 'Promotie de completat',
    description: 'Loc rezervat pentru o reducere reala, un pachet sau o campanie cu termen clar.',
    cta_label: 'Cere detalii',
  },
]

const defaultResults = [
  { title: 'Ridicare naturala', before_image_url: '', after_image_url: '', before_alt_text: '', after_alt_text: '', caption: '', sort_order: 10, is_active: true },
  { title: 'Volum delicat', before_image_url: '', after_image_url: '', before_alt_text: '', after_alt_text: '', caption: '', sort_order: 20, is_active: true },
  { title: 'Set intens', before_image_url: '', after_image_url: '', before_alt_text: '', after_alt_text: '', caption: '', sort_order: 30, is_active: true },
]

const defaultNotificationSettings = {
  email: '',
  notify_new: true,
  notify_daily: true,
  notify_before: true,
}

const appointmentStatusOptions = [
  { value: 'new', label: 'Noua' },
  { value: 'contacted', label: 'Contactata' },
  { value: 'confirmed', label: 'Confirmata' },
  { value: 'cancelled', label: 'Anulata' },
]

function bucharestDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
  }).formatToParts(date)
  const part = (type) => parts.find((item) => item.type === type)?.value || ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readableImageAlt(prefix, title) {
  const cleanTitle = (title || '').trim()
  return cleanTitle ? `${prefix} - ${cleanTitle}` : prefix
}

function seoFileName(prefix, title, fallbackName) {
  const cleanTitle = slugify(title || fallbackName || prefix) || 'imagine'
  return `${prefix}-${cleanTitle}.jpg`
}

function normalizeService(service) {
  return {
    id: service.id || null,
    title: service.title || '',
    duration: service.duration || '',
    price: service.price || service.price_label || 'Pret de completat',
    note: service.note || '',
    image_url: service.image_url || '',
    image_alt_text: service.image_alt_text || '',
    sort_order: Number.isFinite(Number(service.sort_order)) ? Number(service.sort_order) : 0,
    is_active: service.is_active !== false && service.isActive !== false,
  }
}

function normalizeOrderedItem(item) {
  return {
    ...item,
    id: item.id || null,
    sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 0,
    is_active: item.is_active !== false && item.isActive !== false,
  }
}

function normalizeContent(data) {
  return {
    contact: {
      ...defaultContact,
      ...(data.settings?.contact || {}),
    },
    gallery: Array.isArray(data.gallery) && data.gallery.length ? data.gallery.map(normalizeOrderedItem) : defaultGallery,
    results: Array.isArray(data.results) && data.results.length ? data.results.map(normalizeOrderedItem) : defaultResults,
    reviews: Array.isArray(data.reviews) && data.reviews.length ? data.reviews.map(normalizeOrderedItem) : defaultReviews,
    promotions: Array.isArray(data.promotions) && data.promotions.length ? data.promotions.map(normalizeOrderedItem) : defaultPromotions,
    faqs: Array.isArray(data.faqs) && data.faqs.length ? data.faqs.map(normalizeOrderedItem) : defaultFaqs,
  }
}

function normalizeNotificationSettings(settings = {}) {
  return {
    ...defaultNotificationSettings,
    ...settings,
    email: settings.email || '',
    notify_new: settings.notify_new !== false,
    notify_daily: settings.notify_daily !== false,
    notify_before: settings.notify_before !== false,
  }
}

function normalizeAppointment(appointment = {}) {
  return {
    id: appointment.id || null,
    full_name: appointment.full_name || '',
    phone: appointment.phone || '',
    email: appointment.email || '',
    service: appointment.service || '',
    preferred_date: appointment.preferred_date || bucharestDateString(),
    preferred_time: appointment.preferred_time || '',
    message: appointment.message || '',
    status: appointment.status || 'new',
    source: appointment.source || 'admin',
    internal_notes: appointment.internal_notes || '',
    created_at: appointment.created_at || '',
    updated_at: appointment.updated_at || '',
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Imaginea nu a putut fi citita.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Imaginea nu a putut fi pregatita pentru crop.'))
    image.src = source
  })
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}

async function cropImageToSquare({ source, cropSize = 90, x = 50, y = 50, fileName = 'galerie.jpg' }) {
  const image = await loadImage(source)
  const size = 1200
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Browserul nu poate procesa crop-ul imaginii.')

  context.fillStyle = '#fbf8f4'
  context.fillRect(0, 0, size, size)

  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) * (clamp(cropSize, 35, 100) / 100)
  const maxSourceX = Math.max(0, image.naturalWidth - sourceSize)
  const maxSourceY = Math.max(0, image.naturalHeight - sourceSize)
  const sourceX = maxSourceX * (clamp(x, 0, 100) / 100)
  const sourceY = maxSourceY * (clamp(y, 0, 100) / 100)

  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size)

  const baseName = fileName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '-') || 'galerie'
  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.9),
    fileName: `${baseName}-crop.jpg`,
  }
}

function cropMetrics(item) {
  const width = Number(item.crop_width) || 1
  const height = Number(item.crop_height) || 1
  const cropSize = clamp(item.crop_size ?? 90, 35, 100)
  const shortSide = Math.min(width, height)
  const cropPixels = shortSide * (cropSize / 100)
  const boxWidth = (cropPixels / width) * 100
  const boxHeight = (cropPixels / height) * 100
  const maxLeft = Math.max(0, 100 - boxWidth)
  const maxTop = Math.max(0, 100 - boxHeight)
  const left = maxLeft * (clamp(item.crop_x ?? 50, 0, 100) / 100)
  const top = maxTop * (clamp(item.crop_y ?? 50, 0, 100) / 100)

  return {
    boxHeight,
    boxWidth,
    height,
    left,
    maxLeft,
    maxTop,
    top,
    width,
  }
}

function cropFrameStyle(item) {
  const metrics = cropMetrics(item)
  return { aspectRatio: `${metrics.width} / ${metrics.height}` }
}

function cropBoxStyle(item) {
  const metrics = cropMetrics(item)
  return {
    height: `${metrics.boxHeight}%`,
    left: `${metrics.left}%`,
    top: `${metrics.top}%`,
    width: `${metrics.boxWidth}%`,
  }
}

function prefixedCropItem(item, prefix) {
  return {
    crop_width: item[`${prefix}_crop_width`],
    crop_height: item[`${prefix}_crop_height`],
    crop_size: item[`${prefix}_crop_size`],
    crop_x: item[`${prefix}_crop_x`],
    crop_y: item[`${prefix}_crop_y`],
  }
}

function prefixedCropFrameStyle(item, prefix) {
  return cropFrameStyle(prefixedCropItem(item, prefix))
}

function prefixedCropBoxStyle(item, prefix) {
  return cropBoxStyle(prefixedCropItem(item, prefix))
}

function cropPixelMetrics(item, rect) {
  const metrics = cropMetrics(item)
  const boxWidth = (metrics.boxWidth / 100) * rect.width
  const boxHeight = (metrics.boxHeight / 100) * rect.height
  const maxLeft = Math.max(0, rect.width - boxWidth)
  const maxTop = Math.max(0, rect.height - boxHeight)
  const left = maxLeft * (clamp(item.crop_x ?? 50, 0, 100) / 100)
  const top = maxTop * (clamp(item.crop_y ?? 50, 0, 100) / 100)

  return {
    boxHeight,
    boxWidth,
    left,
    maxLeft,
    maxTop,
    top,
  }
}

function cropDragOffsetFromPointer(event, item) {
  const rect = event.currentTarget.getBoundingClientRect()
  const metrics = cropPixelMetrics(item, rect)
  const pointerLeft = event.clientX - rect.left
  const pointerTop = event.clientY - rect.top
  const isInsideBox = (
    pointerLeft >= metrics.left
    && pointerLeft <= metrics.left + metrics.boxWidth
    && pointerTop >= metrics.top
    && pointerTop <= metrics.top + metrics.boxHeight
  )

  return {
    x: isInsideBox ? pointerLeft - metrics.left : metrics.boxWidth / 2,
    y: isInsideBox ? pointerTop - metrics.top : metrics.boxHeight / 2,
  }
}

function cropDragOffsetFromTarget(target, item) {
  const rect = target.getBoundingClientRect()
  const metrics = cropPixelMetrics(item, rect)
  const x = Number(target.dataset.cropOffsetX)
  const y = Number(target.dataset.cropOffsetY)

  return {
    x: Number.isFinite(x) ? x : metrics.boxWidth / 2,
    y: Number.isFinite(y) ? y : metrics.boxHeight / 2,
  }
}

function storeCropDragOffset(target, offset) {
  target.dataset.cropOffsetX = String(offset.x)
  target.dataset.cropOffsetY = String(offset.y)
}

function cropPositionFromPointer(event, item, dragOffset = null) {
  const rect = event.currentTarget.getBoundingClientRect()
  const metrics = cropPixelMetrics(item, rect)
  const pointerLeft = event.clientX - rect.left
  const pointerTop = event.clientY - rect.top
  const offset = dragOffset || cropDragOffsetFromTarget(event.currentTarget, item)
  const boxLeft = clamp(pointerLeft - offset.x, 0, metrics.maxLeft)
  const boxTop = clamp(pointerTop - offset.y, 0, metrics.maxTop)

  return {
    x: metrics.maxLeft ? (boxLeft / metrics.maxLeft) * 100 : 50,
    y: metrics.maxTop ? (boxTop / metrics.maxTop) * 100 : 50,
  }
}

function hasPendingResultCrop(item) {
  return Boolean(item.before_crop_source || item.after_crop_source)
}

function adminApiPath(path) {
  const shareToken = new URLSearchParams(window.location.search).get('_vercel_share')
  if (!shareToken) return path

  const url = new URL(path, window.location.origin)
  url.searchParams.set('_vercel_share', shareToken)
  return `${url.pathname}${url.search}`
}

function cleanSchemaText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function absoluteUrl(value) {
  const cleanValue = cleanSchemaText(value)
  if (!cleanValue || cleanValue.startsWith('data:')) return ''

  try {
    return new URL(cleanValue, window.location.origin).toString()
  } catch {
    return ''
  }
}

function isPlaceholderText(value) {
  return /de completat|dupa confirmare|dupa acordul/i.test(cleanSchemaText(value))
}

function buildStructuredData(services, content) {
  const siteUrl = window.location.origin
  const contact = content.contact || {}
  const activeServices = services.filter((service) => cleanSchemaText(service.title))
  const serviceNodes = activeServices.map((service) => ({
    '@type': 'Service',
    '@id': `${siteUrl}/#service-${slugify(service.title)}`,
    name: service.title,
    description: service.note || undefined,
    image: absoluteUrl(service.image_url) || undefined,
    provider: { '@id': `${siteUrl}/#business` },
  }))
  const faqNodes = content.faqs
    .filter((item) => cleanSchemaText(item.question) && cleanSchemaText(item.answer))
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  const reviewNodes = content.reviews
    .filter((item) => (
      cleanSchemaText(item.customer_name)
      && cleanSchemaText(item.review_text)
      && !isPlaceholderText(item.customer_name)
      && !isPlaceholderText(item.review_text)
    ))
    .map((item) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: item.customer_name,
      },
      reviewBody: item.review_text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Math.min(5, Math.max(1, Number(item.rating) || 5)),
        bestRating: 5,
      },
    }))
  const imageUrls = [
    ...activeServices.map((service) => absoluteUrl(service.image_url)),
    ...content.gallery.map((item) => absoluteUrl(item.image_url)),
    ...content.results.flatMap((item) => [absoluteUrl(item.before_image_url), absoluteUrl(item.after_image_url)]),
  ].filter(Boolean)
  const imageNodes = content.results
    .flatMap((item) => [
      {
        url: absoluteUrl(item.before_image_url),
        caption: item.before_alt_text || readableImageAlt('Inainte', item.title),
      },
      {
        url: absoluteUrl(item.after_image_url),
        caption: item.after_alt_text || readableImageAlt('Dupa', item.title),
      },
    ])
    .filter((item) => item.url)
    .map((item) => ({
      '@type': 'ImageObject',
      contentUrl: item.url,
      caption: item.caption,
    }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BeautySalon',
        '@id': `${siteUrl}/#business`,
        name: 'Sorina - Studio de Gene',
        url: siteUrl,
        description: 'Studio de gene in Bucuresti pentru extensii de gene, laminare si rezultate personalizate.',
        image: imageUrls.slice(0, 8),
        areaServed: 'Bucuresti',
        address: {
          '@type': 'PostalAddress',
          addressLocality: cleanSchemaText(contact.area) && !isPlaceholderText(contact.area) ? contact.area : 'Bucuresti',
          addressCountry: 'RO',
        },
        makesOffer: serviceNodes.length ? serviceNodes.map((service) => ({ '@id': service['@id'] })) : undefined,
        review: reviewNodes.length ? reviewNodes : undefined,
        hasPart: imageNodes.length ? imageNodes : undefined,
      },
      ...serviceNodes,
      ...(faqNodes.length ? [{
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq-schema`,
        mainEntity: faqNodes,
      }] : []),
    ],
  }
}

function upsertStructuredData(services, content) {
  const scriptId = 'sorina-dynamic-jsonld'
  const existing = document.getElementById(scriptId)
  const script = existing || document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(buildStructuredData(services, content))
  if (!existing) document.head.appendChild(script)
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
      <ImageSlot
        label={`Imagine pentru ${service.title}`}
        src={service.image_url}
        alt={service.image_alt_text || readableImageAlt('Rezultat extensii de gene', service.title)}
      />
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
  const beforeLabel = item.before_label || 'Inainte'
  const afterLabel = item.after_label || 'Dupa'
  const beforeAlt = item.before_alt_text || `${beforeLabel}: ${item.title}`
  const afterAlt = item.after_alt_text || `${afterLabel}: ${item.title}`

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
          {item.before_image_url ? <img src={item.before_image_url} alt={beforeAlt} /> : null}
        </div>
        <div className="comparison-layer comparison-after">
          {item.after_image_url ? <img src={item.after_image_url} alt={afterAlt} /> : null}
        </div>
        <span className="comparison-label comparison-label-before">{beforeLabel}</span>
        <span className="comparison-label comparison-label-after">{afterLabel}</span>
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
        <span>{item.caption || 'Inainte / dupa'}</span>
      </div>
    </article>
  )
}

function AdminNewBadge() {
  return <span className="admin-new-badge">Nou, nesalvat</span>
}

const adminSections = [
  { id: 'admin-services', label: 'Servicii', shortLabel: 'Servicii', icon: Sparkles },
  { id: 'admin-contact', label: 'Contact/program', shortLabel: 'Contact', icon: Phone },
  { id: 'admin-gallery', label: 'Galerie foto', shortLabel: 'Galerie', icon: Heart },
  { id: 'admin-results', label: 'Before/After', shortLabel: 'Rezultate', icon: Crop },
  { id: 'admin-reviews', label: 'Recenzii', shortLabel: 'Recenzii', icon: Star },
  { id: 'admin-promotions', label: 'Promotii', shortLabel: 'Promotii', icon: Gift },
  { id: 'admin-faqs', label: 'FAQ', shortLabel: 'FAQ', icon: ShieldCheck },
]

function AdminSectionNavigator({ activeSection, onSectionSelect }) {
  const activeItem = adminSections.find((section) => section.id === activeSection) || adminSections[0]

  return (
    <nav className="admin-section-nav" aria-label="Navigare sectiuni admin">
      <p className="admin-section-nav-current">
        Editezi <strong>{activeItem.label}</strong>
      </p>
      <div className="admin-section-nav-list">
        {adminSections.map(({ id, label, shortLabel, icon: Icon }) => (
          <a
            aria-current={activeSection === id ? 'true' : undefined}
            className={`admin-section-link ${activeSection === id ? 'admin-section-link-active' : ''}`}
            href={`#${id}`}
            key={id}
            onClick={(event) => {
              event.preventDefault()
              onSectionSelect(id)
            }}
            title={`Mergi la ${label}`}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{shortLabel}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}

function AdminOrderControls({ index, total, onMoveUp, onMoveDown, disabled = false }) {
  return (
    <div className="admin-order-controls full" aria-label={`Pozitie ${index + 1} din ${total}`}>
      <span>Pozitia {index + 1} din {total}</span>
      <div>
        <button
          type="button"
          className="admin-order-button"
          onClick={onMoveUp}
          disabled={disabled || index === 0}
          title="Muta mai sus"
        >
          <ArrowUp size={15} /> Sus
        </button>
        <button
          type="button"
          className="admin-order-button"
          onClick={onMoveDown}
          disabled={disabled || index === total - 1}
          title="Muta mai jos"
        >
          <ArrowDown size={15} /> Jos
        </button>
      </div>
    </div>
  )
}

function AdminApp({ appointmentsOnly = false }) {
  const [password, setPassword] = useState(() => window.sessionStorage.getItem('sorina_admin_password') || '')
  const [draftPassword, setDraftPassword] = useState('')
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState([])
  const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings)
  const [adminSlots, setAdminSlots] = useState([])
  const [content, setContent] = useState(() => normalizeContent({}))
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [activeAdminSection, setActiveAdminSection] = useState(adminSections[0].id)
  const isLoggedIn = Boolean(password)
  const isBusy = status.state === 'loading'

  async function adminRequest(path, options = {}) {
    const response = await fetch(adminApiPath(path), {
      ...options,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
        ...options.headers,
      },
    })
    const contentType = response.headers.get('Content-Type') || ''
    const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {}

    if (!response.ok) {
      throw new Error(data.error || 'Actiunea nu a putut fi finalizata.')
    }

    return data
  }

  async function loadAdminData() {
    if (!password) return
    setStatus({ state: 'loading', message: 'Se incarca continutul...' })

    try {
      const [serviceData, contentData, appointmentData] = await Promise.all([
        adminRequest('/api/admin/services'),
        adminRequest('/api/admin/content'),
        adminRequest('/api/admin/appointments'),
      ])
      setServices(serviceData.services.map(normalizeService))
      setContent(normalizeContent(contentData))
      setAppointments((appointmentData.appointments || []).map(normalizeAppointment))
      setNotificationSettings(normalizeNotificationSettings(appointmentData.notifications))
      setAdminSlots(appointmentData.slots || [])
      setStatus({ state: 'success', message: 'Continutul este actualizat.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  useEffect(() => {
    if (!password) return undefined
    let isMounted = true

    async function loadInitialServices() {
      setStatus({ state: 'loading', message: 'Se incarca continutul...' })

      try {
        const [serviceResponse, contentResponse, appointmentResponse] = await Promise.all([
          fetch(adminApiPath('/api/admin/services'), {
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': password,
            },
          }),
          fetch(adminApiPath('/api/admin/content'), {
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': password,
            },
          }),
          fetch(adminApiPath('/api/admin/appointments'), {
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': password,
            },
          }),
        ])
        const serviceData = (serviceResponse.headers.get('Content-Type') || '').includes('application/json')
          ? await serviceResponse.json().catch(() => ({}))
          : {}
        const contentData = (contentResponse.headers.get('Content-Type') || '').includes('application/json')
          ? await contentResponse.json().catch(() => ({}))
          : {}
        const appointmentData = (appointmentResponse.headers.get('Content-Type') || '').includes('application/json')
          ? await appointmentResponse.json().catch(() => ({}))
          : {}

        if (!serviceResponse.ok) throw new Error(serviceData.error || 'Serviciile nu au putut fi incarcate.')
        if (!contentResponse.ok) throw new Error(contentData.error || 'Continutul nu a putut fi incarcat.')
        if (!appointmentResponse.ok) throw new Error(appointmentData.error || 'Programarile nu au putut fi incarcate.')

        if (isMounted) {
          setServices(serviceData.services.map(normalizeService))
          setContent(normalizeContent(contentData))
          setAppointments((appointmentData.appointments || []).map(normalizeAppointment))
          setNotificationSettings(normalizeNotificationSettings(appointmentData.notifications))
          setAdminSlots(appointmentData.slots || [])
          setStatus({ state: 'success', message: 'Continutul este actualizat.' })
        }
      } catch (error) {
        if (isMounted) setStatus({ state: 'error', message: error.message })
      }
    }

    loadInitialServices()
    return () => {
      isMounted = false
    }
  }, [password])

  useEffect(() => {
    if (!isLoggedIn) return undefined
    const visibleSections = new Map()
    const sectionElements = adminSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean)

    if (!sectionElements.length) return undefined

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry)
        } else {
          visibleSections.delete(entry.target.id)
        }
      })

      const nextSection = Array.from(visibleSections.values())
        .sort((first, second) => Math.abs(first.boundingClientRect.top - 120) - Math.abs(second.boundingClientRect.top - 120))[0]

      if (nextSection) setActiveAdminSection(nextSection.target.id)
    }, {
      root: null,
      rootMargin: '-96px 0px -58% 0px',
      threshold: [0, 0.12, 0.3, 0.6],
    })

    sectionElements.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [isLoggedIn])

  function selectAdminSection(sectionId) {
    setActiveAdminSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${sectionId}`)
  }

  function login(event) {
    event.preventDefault()
    const nextPassword = draftPassword.trim()
    window.sessionStorage.setItem('sorina_admin_password', nextPassword)
    setPassword(nextPassword)
    setDraftPassword('')
  }

  function logout() {
    window.sessionStorage.removeItem('sorina_admin_password')
    setPassword('')
    setServices([])
    setAppointments([])
    setNotificationSettings(defaultNotificationSettings)
    setAdminSlots([])
    setContent(normalizeContent({}))
    setStatus({ state: 'idle', message: '' })
  }

  function updateService(index, field, value) {
    setServices((current) => current.map((service, itemIndex) => (
      itemIndex === index ? { ...service, [field]: value } : service
    )))
  }

  function updateContact(field, value) {
    setContent((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }))
  }

  function updateNotificationSetting(field, value) {
    setNotificationSettings((current) => ({ ...current, [field]: value }))
  }

  function updateAppointment(index, field, value) {
    setAppointments((current) => current.map((appointment, itemIndex) => (
      itemIndex === index ? { ...appointment, [field]: value } : appointment
    )))
  }

  function addAppointment() {
    setAppointments((current) => [
      normalizeAppointment({
        full_name: 'Clienta noua',
        preferred_date: bucharestDateString(),
        preferred_time: adminSlots[0] || '10:00',
        status: 'new',
      }),
      ...current,
    ])
    setStatus({ state: 'success', message: 'Programare noua adaugata. Completeaza datele si apasa Salveaza.' })
  }

  function updateCollection(collection, index, field, value) {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }))
  }

  function reindexItems(items) {
    return items.map((item, index) => ({ ...item, sort_order: (index + 1) * 10 }))
  }

  function moveItem(items, index, direction) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return items

    const nextItems = [...items]
    const [item] = nextItems.splice(index, 1)
    nextItems.splice(nextIndex, 0, item)
    return reindexItems(nextItems)
  }

  function moveService(index, direction) {
    setServices((current) => moveItem(current, index, direction))
    setStatus({ state: 'success', message: 'Ordinea serviciilor a fost schimbata. Apasa Salveaza ordinea ca sa ajunga pe site.' })
  }

  function moveContentItem(collection, index, direction) {
    setContent((current) => ({
      ...current,
      [collection]: moveItem(current[collection], index, direction),
    }))
    setStatus({ state: 'success', message: 'Ordinea a fost schimbata. Apasa Salveaza ordinea ca sa ajunga pe site.' })
  }

  function nextSortOrder(items) {
    return items.length ? Math.max(...items.map((item) => Number(item.sort_order) || 0)) + 10 : 10
  }

  function addContentItem(collection) {
    const builders = {
      gallery: (items) => ({
        id: null,
        title: 'Imagine noua',
        image_url: '',
        alt_text: '',
        sort_order: nextSortOrder(items),
        is_active: true,
      }),
      results: (items) => ({
        id: null,
        title: 'Rezultat nou',
        before_image_url: '',
        after_image_url: '',
        before_alt_text: '',
        after_alt_text: '',
        caption: '',
        sort_order: nextSortOrder(items),
        is_active: true,
      }),
      reviews: (items) => ({
        id: null,
        customer_name: 'Nume clienta',
        review_text: 'Text recenzie de completat dupa acordul clientei.',
        rating: 5,
        sort_order: nextSortOrder(items),
        is_active: true,
      }),
      promotions: (items) => ({
        id: null,
        eyebrow: 'Oferta speciala',
        title: 'Promotie noua',
        description: 'Descriere promotie de completat cu termen si conditii clare.',
        cta_label: 'Cere detalii',
        sort_order: nextSortOrder(items),
        is_active: true,
      }),
      faqs: (items) => ({
        id: null,
        question: 'Intrebare noua?',
        answer: 'Raspuns de completat.',
        sort_order: nextSortOrder(items),
        is_active: true,
      }),
    }

    const newItem = builders[collection](content[collection])
    setContent((current) => ({
      ...current,
      [collection]: [newItem, ...current[collection]],
    }))
    setStatus({ state: 'success', message: 'Element nou adaugat. Completeaza campurile si apasa Salveaza.' })
  }

  async function saveContact() {
    setStatus({ state: 'loading', message: 'Se salveaza datele de contact...' })

    try {
      const data = await adminRequest('/api/admin/content', {
        method: 'PATCH',
        body: JSON.stringify({ settings: { contact: content.contact } }),
      })
      setContent((current) => normalizeContent({ ...current, settings: data.settings }))
      setStatus({ state: 'success', message: 'Datele de contact au fost salvate.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function saveNotificationSettings() {
    setStatus({ state: 'loading', message: 'Se salveaza notificarile...' })

    try {
      const data = await adminRequest('/api/admin/appointments', {
        method: 'PATCH',
        body: JSON.stringify({ notifications: notificationSettings }),
      })
      setNotificationSettings(normalizeNotificationSettings(data.notifications))
      setStatus({ state: 'success', message: 'Setarile de notificari au fost salvate.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function saveAppointment(index) {
    const appointment = appointments[index]
    setStatus({ state: 'loading', message: 'Se salveaza programarea...' })

    try {
      const data = await adminRequest(
        appointment.id
          ? `/api/admin/appointments?id=${encodeURIComponent(appointment.id)}`
          : '/api/admin/appointments',
        {
          method: appointment.id ? 'PATCH' : 'POST',
          body: JSON.stringify(appointment),
        },
      )

      if (!data.appointment) throw new Error('Serverul nu a returnat programarea salvata.')
      setAppointments((current) => current.map((currentAppointment, itemIndex) => (
        itemIndex === index ? normalizeAppointment(data.appointment) : currentAppointment
      )))
      setStatus({ state: 'success', message: 'Programarea a fost salvata.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function deleteAppointment(index) {
    const appointment = appointments[index]

    if (!appointment.id) {
      setAppointments((current) => current.filter((_, itemIndex) => itemIndex !== index))
      return
    }

    if (!window.confirm('Stergi definitiv aceasta programare?')) return

    setStatus({ state: 'loading', message: 'Se sterge programarea...' })

    try {
      await adminRequest(`/api/admin/appointments?id=${encodeURIComponent(appointment.id)}`, { method: 'DELETE' })
      setAppointments((current) => current.filter((_, itemIndex) => itemIndex !== index))
      setStatus({ state: 'success', message: 'Programarea a fost stearsa.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function saveContentItem(collection, index) {
    const item = content[collection][index]
    if (collection === 'gallery' && item.crop_source) {
      setStatus({ state: 'error', message: 'Confirma crop-ul imaginii inainte de salvare.' })
      return
    }
    if (collection === 'results' && hasPendingResultCrop(item)) {
      setStatus({ state: 'error', message: 'Confirma crop-ul pentru imaginile before/after inainte de salvare.' })
      return
    }

    setStatus({ state: 'loading', message: 'Se salveaza elementul...' })

    try {
      const data = await adminRequest(
        item.id
          ? `/api/admin/content?type=${collection}&id=${encodeURIComponent(item.id)}`
          : `/api/admin/content?type=${collection}`,
        {
          method: item.id ? 'PATCH' : 'POST',
          body: JSON.stringify(item),
        },
      )
      if (!data.item) throw new Error('Serverul nu a returnat elementul salvat.')
      setContent((current) => ({
        ...current,
        [collection]: current[collection].map((currentItem, itemIndex) => (
          itemIndex === index ? normalizeOrderedItem(data.item) : currentItem
        )),
      }))
      setStatus({ state: 'success', message: 'Elementul a fost salvat.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function hasPendingCollectionUpload(collection, item) {
    if (collection === 'gallery') return hasPendingGalleryUpload(item)
    if (collection === 'results') return hasPendingResultUpload(item)
    return false
  }

  async function saveContentOrder(collection) {
    const items = content[collection]
    if (items.some((item) => !item.id)) {
      setStatus({ state: 'error', message: 'Salveaza elementele noi inainte de a salva ordinea.' })
      return
    }
    if (items.some((item) => hasPendingCollectionUpload(collection, item))) {
      setStatus({ state: 'error', message: 'Salveaza imaginile selectate inainte de a salva ordinea.' })
      return
    }

    setStatus({ state: 'loading', message: 'Se salveaza ordinea...' })

    try {
      await Promise.all(items.map((item) => adminRequest(
        `/api/admin/content?type=${collection}&id=${encodeURIComponent(item.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify(item),
        },
      )))
      setStatus({ state: 'success', message: 'Ordinea a fost salvata pe site.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function deleteContentItem(collection, index) {
    const item = content[collection][index]

    if (!item.id) {
      setContent((current) => ({
        ...current,
        [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index),
      }))
      return
    }

    if (!window.confirm('Stergi acest element?')) return

    setStatus({ state: 'loading', message: 'Se sterge elementul...' })
    try {
      await adminRequest(`/api/admin/content?type=${collection}&id=${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      setContent((current) => ({
        ...current,
        [collection]: current[collection].filter((_, itemIndex) => itemIndex !== index),
      }))
      setStatus({ state: 'success', message: 'Elementul a fost sters.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function setGalleryFile(index, file) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ state: 'error', message: 'Imaginea trebuie sa fie sub 10 MB.' })
      return
    }

    try {
      const imageData = await readFileAsDataUrl(file)
      const image = await loadImage(imageData)
      setContent((current) => ({
        ...current,
        gallery: current.gallery.map((item, itemIndex) => (
          itemIndex === index
            ? {
                ...item,
                crop_source: imageData,
                crop_file_name: file.name,
                crop_width: image.naturalWidth,
                crop_height: image.naturalHeight,
                crop_size: 90,
                crop_x: 50,
                crop_y: 50,
                image_data: '',
                image_name: '',
                alt_text: item.alt_text || item.title,
              }
            : item
        )),
      }))
      setStatus({ state: 'success', message: 'Imaginea este pregatita pentru crop. Incadreaza patratul si confirma.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function updateGalleryCrop(index, field, value) {
    setContent((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: Number(value) } : item
      )),
    }))
  }

  function updateGalleryCropPosition(index, position) {
    setContent((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => (
        itemIndex === index ? { ...item, crop_x: position.x, crop_y: position.y } : item
      )),
    }))
  }

  async function confirmGalleryCrop(index) {
    const item = content.gallery[index]
    if (!item?.crop_source) return

    setStatus({ state: 'loading', message: 'Se pregateste imaginea incadrata...' })

    try {
      const cropped = await cropImageToSquare({
        source: item.crop_source,
        cropSize: item.crop_size,
        x: item.crop_x,
        y: item.crop_y,
        fileName: seoFileName('galerie', item.title, item.crop_file_name),
      })

      setContent((current) => ({
        ...current,
        gallery: current.gallery.map((currentItem, itemIndex) => (
          itemIndex === index
            ? {
                ...currentItem,
                crop_source: '',
                crop_file_name: '',
                crop_width: 0,
                crop_height: 0,
                crop_size: 90,
                crop_x: 50,
                crop_y: 50,
                image_data: cropped.dataUrl,
                image_name: cropped.fileName,
                image_url: cropped.dataUrl,
              }
            : currentItem
        )),
      }))
      setStatus({ state: 'success', message: 'Crop confirmat. Apasa Salveaza ca sa incarci imaginea.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function cancelGalleryCrop(index) {
    setContent((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => (
        itemIndex === index
          ? {
              ...item,
              crop_source: '',
              crop_file_name: '',
              crop_width: 0,
              crop_height: 0,
              crop_size: 90,
              crop_x: 50,
              crop_y: 50,
            }
          : item
      )),
    }))
    setStatus({ state: 'success', message: 'Crop-ul a fost anulat. Imaginea salvata ramane neschimbata.' })
  }

  function hasPendingGalleryUpload(item) {
    return Boolean(item.crop_source || item.image_data || item.image_url?.startsWith('data:'))
  }

  async function setResultFile(index, side, file) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ state: 'error', message: 'Imaginea trebuie sa fie sub 10 MB.' })
      return
    }

    try {
      const imageData = await readFileAsDataUrl(file)
      const image = await loadImage(imageData)
      setContent((current) => ({
        ...current,
        results: current.results.map((item, itemIndex) => (
          itemIndex === index
            ? {
                ...item,
                [`${side}_crop_source`]: imageData,
                [`${side}_crop_file_name`]: file.name,
                [`${side}_crop_width`]: image.naturalWidth,
                [`${side}_crop_height`]: image.naturalHeight,
                [`${side}_crop_size`]: 90,
                [`${side}_crop_x`]: 50,
                [`${side}_crop_y`]: 50,
                [`${side}_image_data`]: '',
                [`${side}_image_name`]: '',
              }
            : item
        )),
      }))
      setStatus({ state: 'success', message: `Imaginea ${side === 'before' ? 'Inainte' : 'Dupa'} este pregatita pentru crop.` })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function updateResultCrop(index, side, field, value) {
    setContent((current) => ({
      ...current,
      results: current.results.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [`${side}_${field}`]: Number(value) } : item
      )),
    }))
  }

  function updateResultCropPosition(index, side, position) {
    setContent((current) => ({
      ...current,
      results: current.results.map((item, itemIndex) => (
        itemIndex === index
          ? { ...item, [`${side}_crop_x`]: position.x, [`${side}_crop_y`]: position.y }
          : item
      )),
    }))
  }

  async function confirmResultCrop(index, side) {
    const item = content.results[index]
    const source = item?.[`${side}_crop_source`]
    if (!source) return

    setStatus({ state: 'loading', message: `Se pregateste imaginea ${side === 'before' ? 'Inainte' : 'Dupa'}...` })

    try {
      const cropped = await cropImageToSquare({
        source,
        cropSize: item[`${side}_crop_size`],
        x: item[`${side}_crop_x`],
        y: item[`${side}_crop_y`],
        fileName: seoFileName(side === 'before' ? 'inainte' : 'dupa', item.title, item[`${side}_crop_file_name`]),
      })

      setContent((current) => ({
        ...current,
        results: current.results.map((currentItem, itemIndex) => (
          itemIndex === index
            ? {
                ...currentItem,
                [`${side}_crop_source`]: '',
                [`${side}_crop_file_name`]: '',
                [`${side}_crop_width`]: 0,
                [`${side}_crop_height`]: 0,
                [`${side}_crop_size`]: 90,
                [`${side}_crop_x`]: 50,
                [`${side}_crop_y`]: 50,
                [`${side}_image_data`]: cropped.dataUrl,
                [`${side}_image_name`]: cropped.fileName,
                [`${side}_image_url`]: cropped.dataUrl,
              }
            : currentItem
        )),
      }))
      setStatus({ state: 'success', message: `Crop ${side === 'before' ? 'Inainte' : 'Dupa'} confirmat. Apasa Salveaza ca sa incarci rezultatul.` })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function cancelResultCrop(index, side) {
    setContent((current) => ({
      ...current,
      results: current.results.map((item, itemIndex) => (
        itemIndex === index
          ? {
              ...item,
              [`${side}_crop_source`]: '',
              [`${side}_crop_file_name`]: '',
              [`${side}_crop_width`]: 0,
              [`${side}_crop_height`]: 0,
              [`${side}_crop_size`]: 90,
              [`${side}_crop_x`]: 50,
              [`${side}_crop_y`]: 50,
            }
          : item
      )),
    }))
    setStatus({ state: 'success', message: 'Crop-ul a fost anulat. Imaginea rezultatului ramane neschimbata.' })
  }

  function hasPendingResultUpload(item) {
    return Boolean(
      hasPendingResultCrop(item)
      || item.before_image_data
      || item.after_image_data
      || item.before_image_url?.startsWith('data:')
      || item.after_image_url?.startsWith('data:'),
    )
  }

  async function setServiceFile(index, file) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ state: 'error', message: 'Imaginea trebuie sa fie sub 10 MB.' })
      return
    }

    try {
      const imageData = await readFileAsDataUrl(file)
      const image = await loadImage(imageData)
      setServices((current) => current.map((service, itemIndex) => (
        itemIndex === index
          ? {
              ...service,
              crop_source: imageData,
              crop_file_name: file.name,
              crop_width: image.naturalWidth,
              crop_height: image.naturalHeight,
              crop_size: 90,
              crop_x: 50,
              crop_y: 50,
              image_data: '',
              image_name: '',
            }
          : service
      )))
      setStatus({ state: 'success', message: 'Imaginea serviciului este pregatita pentru crop.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function updateServiceCrop(index, field, value) {
    setServices((current) => current.map((service, itemIndex) => (
      itemIndex === index ? { ...service, [field]: Number(value) } : service
    )))
  }

  function updateServiceCropPosition(index, position) {
    setServices((current) => current.map((service, itemIndex) => (
      itemIndex === index ? { ...service, crop_x: position.x, crop_y: position.y } : service
    )))
  }

  async function confirmServiceCrop(index) {
    const service = services[index]
    if (!service?.crop_source) return

    setStatus({ state: 'loading', message: 'Se pregateste imaginea serviciului...' })

    try {
      const cropped = await cropImageToSquare({
        source: service.crop_source,
        cropSize: service.crop_size,
        x: service.crop_x,
        y: service.crop_y,
        fileName: seoFileName('serviciu', service.title, service.crop_file_name),
      })

      setServices((current) => current.map((currentService, itemIndex) => (
        itemIndex === index
          ? {
              ...currentService,
              crop_source: '',
              crop_file_name: '',
              crop_width: 0,
              crop_height: 0,
              crop_size: 90,
              crop_x: 50,
              crop_y: 50,
              image_data: cropped.dataUrl,
              image_name: cropped.fileName,
              image_url: cropped.dataUrl,
            }
          : currentService
      )))
      setStatus({ state: 'success', message: 'Crop confirmat. Apasa Salveaza ca sa incarci imaginea serviciului.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function cancelServiceCrop(index) {
    setServices((current) => current.map((service, itemIndex) => (
      itemIndex === index
        ? {
            ...service,
            crop_source: '',
            crop_file_name: '',
            crop_width: 0,
            crop_height: 0,
            crop_size: 90,
            crop_x: 50,
            crop_y: 50,
          }
        : service
    )))
    setStatus({ state: 'success', message: 'Crop-ul a fost anulat. Imaginea serviciului ramane neschimbata.' })
  }

  function hasPendingServiceUpload(service) {
    return Boolean(service.crop_source || service.image_data || service.image_url?.startsWith('data:'))
  }

  function servicePayload(service) {
    return {
      title: service.title,
      duration: service.duration,
      price: service.price,
      note: service.note,
      image_url: service.image_url,
      image_alt_text: service.image_alt_text,
      image_data: service.image_data,
      image_name: service.image_name,
      sort_order: service.sort_order,
      is_active: service.is_active,
    }
  }

  function addService() {
    const nextService = {
      id: null,
      title: '',
      duration: '',
      price: 'Pret de completat',
      note: '',
      image_url: '',
      image_alt_text: '',
      sort_order: services.length ? Math.max(...services.map((service) => Number(service.sort_order) || 0)) + 10 : 10,
      is_active: true,
    }

    setServices((current) => [
      nextService,
      ...current,
    ])
    setStatus({ state: 'success', message: 'Serviciu nou adaugat. Completeaza campurile si apasa Salveaza.' })
  }

  async function saveServiceOrder() {
    if (services.some((service) => !service.id)) {
      setStatus({ state: 'error', message: 'Salveaza serviciile noi inainte de a salva ordinea.' })
      return
    }
    if (services.some(hasPendingServiceUpload)) {
      setStatus({ state: 'error', message: 'Salveaza imaginea selectata inainte de a salva ordinea.' })
      return
    }

    setStatus({ state: 'loading', message: 'Se salveaza ordinea serviciilor...' })

    try {
      await Promise.all(services.map((service) => adminRequest(
        `/api/admin/services?id=${encodeURIComponent(service.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify(servicePayload(service)),
        },
      )))
      setStatus({ state: 'success', message: 'Ordinea serviciilor a fost salvata pe site.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function saveService(index) {
    const service = services[index]
    if (service.crop_source) {
      setStatus({ state: 'error', message: 'Confirma crop-ul imaginii serviciului inainte de salvare.' })
      return
    }

    setStatus({ state: 'loading', message: 'Se salveaza serviciul...' })

    try {
      const data = await adminRequest(
        service.id ? `/api/admin/services?id=${encodeURIComponent(service.id)}` : '/api/admin/services',
        {
          method: service.id ? 'PATCH' : 'POST',
          body: JSON.stringify(servicePayload(service)),
        },
      )
      const saved = normalizeService(data.service)
      setServices((current) => current.map((item, itemIndex) => (itemIndex === index ? saved : item)))
      setStatus({ state: 'success', message: 'Serviciul a fost salvat.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  async function deleteService(index) {
    const service = services[index]

    if (!service.id) {
      setServices((current) => current.filter((_, itemIndex) => itemIndex !== index))
      return
    }

    if (!window.confirm(`Stergi serviciul "${service.title}"?`)) return

    setStatus({ state: 'loading', message: 'Se sterge serviciul...' })
    try {
      await adminRequest(`/api/admin/services?id=${encodeURIComponent(service.id)}`, { method: 'DELETE' })
      setServices((current) => current.filter((_, itemIndex) => itemIndex !== index))
      setStatus({ state: 'success', message: 'Serviciul a fost sters.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function renderResultImageEditor(item, index, side, label) {
    const imageUrl = item[`${side}_image_url`]
    const cropSource = item[`${side}_crop_source`]

    return (
      <div className="admin-result-image">
        <div className="admin-image-link">
          <span>Imagine {label}</span>
          {cropSource ? (
            <p>Imagine selectata. Ajusteaza incadrarea si confirma crop-ul.</p>
          ) : imageUrl?.startsWith('data:') ? (
            <p>Imagine selectata local. Se incarca dupa ce apesi Salveaza.</p>
          ) : imageUrl ? (
            <a href={imageUrl} target="_blank" rel="noreferrer">Deschide imaginea salvata</a>
          ) : (
            <p>Nicio imagine incarcata inca.</p>
          )}
        </div>
        <label>
          Upload {label}
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={isBusy} onChange={(event) => setResultFile(index, side, event.target.files?.[0])} />
        </label>
        {cropSource ? (
          <div className="admin-cropper admin-cropper-compact">
            <div
              className="admin-crop-frame"
              aria-label={`Preview crop patrat ${label}`}
              style={prefixedCropFrameStyle(item, side)}
              onDragStart={(event) => event.preventDefault()}
              onPointerDown={(event) => {
                event.preventDefault()
                const cropItem = prefixedCropItem(item, side)
                const dragOffset = cropDragOffsetFromPointer(event, cropItem)
                storeCropDragOffset(event.currentTarget, dragOffset)
                event.currentTarget.setPointerCapture(event.pointerId)
                updateResultCropPosition(index, side, cropPositionFromPointer(event, cropItem, dragOffset))
              }}
              onPointerMove={(event) => {
                if (event.buttons !== 1) return
                updateResultCropPosition(index, side, cropPositionFromPointer(event, prefixedCropItem(item, side)))
              }}
            >
              <img
                src={cropSource}
                alt={`${label} pentru ${item.title || 'rezultat'}`}
                draggable="false"
              />
              <span className="admin-crop-box" style={prefixedCropBoxStyle(item, side)} />
            </div>
            <div className="admin-crop-controls">
              <label>
                Marime crop
                <input
                  type="range"
                  min="35"
                  max="100"
                  value={item[`${side}_crop_size`] ?? 90}
                  disabled={isBusy}
                  onChange={(event) => updateResultCrop(index, side, 'crop_size', event.target.value)}
                />
              </label>
              <label>
                Orizontal
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item[`${side}_crop_x`] ?? 50}
                  disabled={isBusy}
                  onChange={(event) => updateResultCrop(index, side, 'crop_x', event.target.value)}
                />
              </label>
              <label>
                Vertical
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item[`${side}_crop_y`] ?? 50}
                  disabled={isBusy}
                  onChange={(event) => updateResultCrop(index, side, 'crop_y', event.target.value)}
                />
              </label>
            </div>
            <div className="admin-crop-actions">
              <button type="button" onClick={() => confirmResultCrop(index, side)} disabled={isBusy}>
                <Crop size={16} /> {isBusy ? 'Se pregateste...' : 'Confirma crop'}
              </button>
              <button type="button" className="admin-secondary" onClick={() => cancelResultCrop(index, side)} disabled={isBusy}>
                Renunta
              </button>
            </div>
          </div>
        ) : imageUrl ? (
          <div className="admin-preview">
            <img src={imageUrl} alt={item[`${side}_alt_text`] || `${label} pentru ${item.title || 'rezultat'}`} />
          </div>
        ) : null}
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="admin-shell">
        <section className="admin-login">
          <p className="eyebrow">Administrare</p>
          <h1>{appointmentsOnly ? 'Sorina - Programari' : 'Sorina - Panou continut'}</h1>
          <p>
            {appointmentsOnly
              ? 'Introdu parola de admin pentru a vedea si gestiona programarile.'
              : 'Introdu parola de admin pentru a modifica serviciile, contactul, galeria, recenziile, promotiile si FAQ-ul.'}
          </p>
          <form onSubmit={login}>
            <label className="full">
              Parola admin
              <input
                type="password"
                value={draftPassword}
                onChange={(event) => setDraftPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit">
              Intra in admin <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className={`admin-shell admin-shell-auth ${appointmentsOnly ? 'admin-appointments-only' : ''}`}>
      {!appointmentsOnly ? (
        <AdminSectionNavigator activeSection={activeAdminSection} onSectionSelect={selectAdminSection} />
      ) : null}

      <header className="admin-header">
        <div>
          <p className="eyebrow">Administrare</p>
          <h1>{appointmentsOnly ? 'Programari cliente' : 'Continut editabil'}</h1>
          <p>
            {appointmentsOnly
              ? 'Agenda separata pentru programari, mutari, statusuri, note interne si notificari.'
              : 'Modificarile salvate aici devin sursa pentru site si formularul de programare.'}
          </p>
        </div>
        <div className="admin-actions">
          <a className="admin-link-button" href={appointmentsOnly ? '/admin' : '/admin/programari'}>
            <CalendarDays size={16} /> {appointmentsOnly ? 'Continut site' : 'Programari'}
          </a>
          <button type="button" onClick={loadAdminData} disabled={isBusy}>
            <RefreshCcw size={16} /> Reincarca
          </button>
          <button type="button" onClick={logout}>
            <LogOut size={16} /> Iesi
          </button>
        </div>
      </header>

      {status.message ? (
        <p className={`form-status form-status-${status.state} admin-global-status`} role="status" aria-live="polite">
          {status.message}
        </p>
      ) : null}

      <section className="admin-panel" id="admin-services">
        <div className="admin-panel-header">
          <h2>Lista servicii</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={saveServiceOrder} disabled={isBusy || !services.length}>
              <Save size={16} /> Salveaza ordinea
            </button>
            <button type="button" onClick={addService} disabled={isBusy}>
              <Plus size={16} /> Adauga serviciu
            </button>
          </div>
        </div>

        <div className="admin-service-list">
          {services.map((service, index) => (
            <article className={`admin-service ${service.id ? '' : 'admin-service-new'}`} key={service.id || `new-${index}`}>
              {!service.id ? <AdminNewBadge /> : null}
              <AdminOrderControls
                index={index}
                total={services.length}
                onMoveUp={() => moveService(index, -1)}
                onMoveDown={() => moveService(index, 1)}
                disabled={isBusy}
              />
              <div className="admin-service-grid">
                <label>
                  Nume serviciu
                  <input value={service.title} onChange={(event) => updateService(index, 'title', event.target.value)} />
                </label>
                <label>
                  Durata
                  <input value={service.duration} onChange={(event) => updateService(index, 'duration', event.target.value)} />
                </label>
                <label>
                  Pret afisat
                  <input value={service.price} onChange={(event) => updateService(index, 'price', event.target.value)} />
                </label>
                <label className="full">
                  Descriere
                  <textarea value={service.note} rows="3" onChange={(event) => updateService(index, 'note', event.target.value)} />
                </label>
                <label className="full">
                  Text imagine pentru Google
                  <input
                    value={service.image_alt_text || ''}
                    placeholder={readableImageAlt('Rezultat extensii de gene', service.title)}
                    onChange={(event) => updateService(index, 'image_alt_text', event.target.value)}
                  />
                </label>
                <div className="admin-image-link full">
                  <span>Imagine serviciu</span>
                  {service.crop_source ? (
                    <p>Imagine selectata. Ajusteaza incadrarea si confirma crop-ul.</p>
                  ) : service.image_url?.startsWith('data:') ? (
                    <p>Imagine selectata local. Se incarca dupa ce apesi Salveaza.</p>
                  ) : service.image_url ? (
                    <a href={service.image_url} target="_blank" rel="noreferrer">Deschide imaginea salvata</a>
                  ) : (
                    <p>Nicio imagine incarcata inca.</p>
                  )}
                </div>
                <label className="full">
                  Upload imagine serviciu
                  <input type="file" accept="image/jpeg,image/png,image/webp" disabled={isBusy} onChange={(event) => setServiceFile(index, event.target.files?.[0])} />
                </label>
                {service.crop_source ? (
                  <div className="admin-cropper full">
                    <div
                      className="admin-crop-frame"
                      aria-label="Preview crop patrat pentru serviciu"
                      style={cropFrameStyle(service)}
                      onDragStart={(event) => event.preventDefault()}
                      onPointerDown={(event) => {
                        event.preventDefault()
                        const dragOffset = cropDragOffsetFromPointer(event, service)
                        storeCropDragOffset(event.currentTarget, dragOffset)
                        event.currentTarget.setPointerCapture(event.pointerId)
                        updateServiceCropPosition(index, cropPositionFromPointer(event, service, dragOffset))
                      }}
                      onPointerMove={(event) => {
                        if (event.buttons !== 1) return
                        updateServiceCropPosition(index, cropPositionFromPointer(event, service))
                      }}
                    >
                      <img
                        src={service.crop_source}
                        alt={service.title || 'Imagine serviciu pentru crop'}
                        draggable="false"
                      />
                      <span className="admin-crop-box" style={cropBoxStyle(service)} />
                    </div>
                    <div className="admin-crop-controls">
                      <label>
                        Marime crop
                        <input
                          type="range"
                          min="35"
                          max="100"
                          value={service.crop_size ?? 90}
                          disabled={isBusy}
                          onChange={(event) => updateServiceCrop(index, 'crop_size', event.target.value)}
                        />
                      </label>
                      <label>
                        Orizontal
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={service.crop_x ?? 50}
                          disabled={isBusy}
                          onChange={(event) => updateServiceCrop(index, 'crop_x', event.target.value)}
                        />
                      </label>
                      <label>
                        Vertical
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={service.crop_y ?? 50}
                          disabled={isBusy}
                          onChange={(event) => updateServiceCrop(index, 'crop_y', event.target.value)}
                        />
                      </label>
                    </div>
                    <div className="admin-crop-actions">
                      <button type="button" onClick={() => confirmServiceCrop(index)} disabled={isBusy}>
                        <Crop size={16} /> {isBusy ? 'Se pregateste...' : 'Confirma crop'}
                      </button>
                      <button type="button" className="admin-secondary" onClick={() => cancelServiceCrop(index)} disabled={isBusy}>
                        Renunta
                      </button>
                    </div>
                  </div>
                ) : service.image_url ? (
                  <div className="admin-preview full">
                    <img src={service.image_url} alt={service.title || 'Imagine serviciu'} />
                  </div>
                ) : null}
                <label className="admin-check full">
                  <input
                    type="checkbox"
                    checked={service.is_active}
                    onChange={(event) => updateService(index, 'is_active', event.target.checked)}
                  />
                  <span>Serviciu vizibil pe site</span>
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveService(index)} disabled={isBusy || Boolean(service.crop_source)}>
                  <Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}
                </button>
                <button type="button" className="admin-danger" onClick={() => deleteService(index)} disabled={isBusy}>
                  <Trash2 size={16} /> Sterge
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-contact">
        <div className="admin-panel-header">
          <h2>Date contact/program</h2>
          <button type="button" onClick={saveContact} disabled={isBusy}>
            <Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}
          </button>
        </div>
        <div className="admin-service-grid">
          <label>
            Zona/adresa afisata
            <input value={content.contact.area} onChange={(event) => updateContact('area', event.target.value)} />
          </label>
          <label>
            Telefon
            <input value={content.contact.phone} onChange={(event) => updateContact('phone', event.target.value)} />
          </label>
          <label>
            Instagram
            <input value={content.contact.instagram} onChange={(event) => updateContact('instagram', event.target.value)} />
          </label>
          <label>
            Program
            <input value={content.contact.schedule} onChange={(event) => updateContact('schedule', event.target.value)} />
          </label>
          <label className="full">
            Text harta/zona acces
            <input value={content.contact.map_label} onChange={(event) => updateContact('map_label', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="admin-panel" id="admin-appointments">
        <div className="admin-panel-header">
          <h2>Programari cliente</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={saveNotificationSettings} disabled={isBusy}>
              <AtSign size={16} /> Salveaza notificari
            </button>
            <button type="button" onClick={addAppointment} disabled={isBusy}>
              <Plus size={16} /> Adauga programare
            </button>
          </div>
        </div>

        <div className="admin-service admin-appointment-settings">
          <div className="admin-service-grid">
            <label className="full">
              Email pentru notificari
              <input
                type="email"
                value={notificationSettings.email}
                placeholder="email@sorina.ro"
                onChange={(event) => updateNotificationSetting('email', event.target.value)}
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={notificationSettings.notify_new}
                onChange={(event) => updateNotificationSetting('notify_new', event.target.checked)}
              />
              <span>Email la programare noua</span>
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={notificationSettings.notify_daily}
                onChange={(event) => updateNotificationSetting('notify_daily', event.target.checked)}
              />
              <span>Sumar zilnic pentru maine</span>
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={notificationSettings.notify_before}
                onChange={(event) => updateNotificationSetting('notify_before', event.target.checked)}
              />
              <span>Reminder cu o ora inainte</span>
            </label>
          </div>
        </div>

        <div className="admin-service-list">
          {appointments.map((appointment, index) => (
            <article className={`admin-service admin-appointment ${appointment.id ? '' : 'admin-service-new'}`} key={appointment.id || `appointment-${index}`}>
              {!appointment.id ? <AdminNewBadge /> : null}
              <div className="admin-appointment-meta">
                <strong>{appointment.preferred_date || 'Data lipsa'} · {appointment.preferred_time || 'Ora lipsa'}</strong>
                <span>{appointmentStatusOptions.find((option) => option.value === appointment.status)?.label || appointment.status}</span>
              </div>
              <div className="admin-service-grid">
                <label>
                  Nume clienta
                  <input value={appointment.full_name} onChange={(event) => updateAppointment(index, 'full_name', event.target.value)} />
                </label>
                <label>
                  Telefon
                  <input value={appointment.phone} onChange={(event) => updateAppointment(index, 'phone', event.target.value)} />
                </label>
                <label>
                  Email clienta
                  <input type="email" value={appointment.email} onChange={(event) => updateAppointment(index, 'email', event.target.value)} />
                </label>
                <label>
                  Status
                  <select value={appointment.status} onChange={(event) => updateAppointment(index, 'status', event.target.value)}>
                    {appointmentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Data
                  <input type="date" value={appointment.preferred_date} onChange={(event) => updateAppointment(index, 'preferred_date', event.target.value)} />
                </label>
                <label>
                  Ora
                  <select value={appointment.preferred_time} onChange={(event) => updateAppointment(index, 'preferred_time', event.target.value)}>
                    <option value="">Alege ora</option>
                    {adminSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  Serviciu
                  <select value={appointment.service} onChange={(event) => updateAppointment(index, 'service', event.target.value)}>
                    <option value="">Alege serviciu</option>
                    {appointment.service && !services.some((service) => service.title === appointment.service) ? (
                      <option value={appointment.service}>{appointment.service}</option>
                    ) : null}
                    {services.map((service) => (
                      <option key={service.id || service.title} value={service.title}>{service.title}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  Mesaj clienta
                  <textarea rows="3" value={appointment.message} onChange={(event) => updateAppointment(index, 'message', event.target.value)} />
                </label>
                <label className="full">
                  Note interne Sorina
                  <textarea rows="3" value={appointment.internal_notes} onChange={(event) => updateAppointment(index, 'internal_notes', event.target.value)} />
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveAppointment(index)} disabled={isBusy}>
                  <Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}
                </button>
                <button
                  type="button"
                  className="admin-secondary"
                  onClick={() => updateAppointment(index, 'status', 'cancelled')}
                  disabled={isBusy || appointment.status === 'cancelled'}
                >
                  Anuleaza
                </button>
                <button type="button" className="admin-danger" onClick={() => deleteAppointment(index)} disabled={isBusy}>
                  <Trash2 size={16} /> Sterge
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-gallery">
        <div className="admin-panel-header">
          <h2>Galerie foto</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={() => saveContentOrder('gallery')} disabled={isBusy || !content.gallery.length}>
              <Save size={16} /> Salveaza ordinea
            </button>
            <button type="button" onClick={() => addContentItem('gallery')} disabled={isBusy}>
              <Plus size={16} /> Adauga imagine
            </button>
          </div>
        </div>
        <div className="admin-service-list">
          {content.gallery.map((item, index) => (
            <article className={`admin-service ${item.id ? '' : 'admin-service-new'}`} key={item.id || `gallery-${index}`}>
              {!item.id ? <AdminNewBadge /> : null}
              <AdminOrderControls
                index={index}
                total={content.gallery.length}
                onMoveUp={() => moveContentItem('gallery', index, -1)}
                onMoveDown={() => moveContentItem('gallery', index, 1)}
                disabled={isBusy}
              />
              <div className="admin-service-grid">
                <label>
                  Titlu
                  <input value={item.title} onChange={(event) => updateCollection('gallery', index, 'title', event.target.value)} />
                </label>
                <label className="full">
                  Text alternativ
                  <input value={item.alt_text || ''} onChange={(event) => updateCollection('gallery', index, 'alt_text', event.target.value)} />
                </label>
                <div className="admin-image-link full">
                  <span>Imagine salvata</span>
                  {item.crop_source ? (
                    <p>Imagine selectata. Ajusteaza incadrarea si confirma crop-ul.</p>
                  ) : item.image_url?.startsWith('data:') ? (
                    <p>Imagine selectata local. Se incarca dupa ce apesi Salveaza.</p>
                  ) : item.image_url ? (
                    <a href={item.image_url} target="_blank" rel="noreferrer">Deschide imaginea salvata</a>
                  ) : (
                    <p>Nicio imagine incarcata inca.</p>
                  )}
                </div>
                <label className="full">
                  Upload imagine
                  <input type="file" accept="image/jpeg,image/png,image/webp" disabled={isBusy} onChange={(event) => setGalleryFile(index, event.target.files?.[0])} />
                </label>
                {item.crop_source ? (
                  <div className="admin-cropper full">
                    <div
                      className="admin-crop-frame"
                      aria-label="Preview crop patrat"
                      style={cropFrameStyle(item)}
                      onDragStart={(event) => event.preventDefault()}
                      onPointerDown={(event) => {
                        event.preventDefault()
                        const dragOffset = cropDragOffsetFromPointer(event, item)
                        storeCropDragOffset(event.currentTarget, dragOffset)
                        event.currentTarget.setPointerCapture(event.pointerId)
                        updateGalleryCropPosition(index, cropPositionFromPointer(event, item, dragOffset))
                      }}
                      onPointerMove={(event) => {
                        if (event.buttons !== 1) return
                        updateGalleryCropPosition(index, cropPositionFromPointer(event, item))
                      }}
                    >
                      <img
                        src={item.crop_source}
                        alt={item.alt_text || item.title || 'Imagine pentru crop'}
                        draggable="false"
                      />
                      <span className="admin-crop-box" style={cropBoxStyle(item)} />
                    </div>
                    <div className="admin-crop-controls">
                      <label>
                        Marime crop
                        <input
                          type="range"
                          min="35"
                          max="100"
                          value={item.crop_size ?? 90}
                          disabled={isBusy}
                          onChange={(event) => updateGalleryCrop(index, 'crop_size', event.target.value)}
                        />
                      </label>
                      <label>
                        Orizontal
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.crop_x ?? 50}
                          disabled={isBusy}
                          onChange={(event) => updateGalleryCrop(index, 'crop_x', event.target.value)}
                        />
                      </label>
                      <label>
                        Vertical
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.crop_y ?? 50}
                          disabled={isBusy}
                          onChange={(event) => updateGalleryCrop(index, 'crop_y', event.target.value)}
                        />
                      </label>
                    </div>
                    <div className="admin-crop-actions">
                      <button type="button" onClick={() => confirmGalleryCrop(index)} disabled={isBusy}>
                        <Crop size={16} /> {isBusy ? 'Se pregateste...' : 'Confirma crop'}
                      </button>
                      <button type="button" className="admin-secondary" onClick={() => cancelGalleryCrop(index)} disabled={isBusy}>
                        Renunta
                      </button>
                    </div>
                  </div>
                ) : item.image_url ? (
                  <div className="admin-preview full">
                    <img src={item.image_url} alt={item.alt_text || item.title} />
                  </div>
                ) : null}
                <label className="admin-check full">
                  <input type="checkbox" checked={item.is_active} onChange={(event) => updateCollection('gallery', index, 'is_active', event.target.checked)} />
                  <span>Imagine vizibila pe site</span>
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveContentItem('gallery', index)} disabled={isBusy || Boolean(item.crop_source)}><Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('gallery', index)} disabled={isBusy}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-results">
        <div className="admin-panel-header">
          <h2>Before/After</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={() => saveContentOrder('results')} disabled={isBusy || !content.results.length}>
              <Save size={16} /> Salveaza ordinea
            </button>
            <button type="button" onClick={() => addContentItem('results')} disabled={isBusy}>
              <Plus size={16} /> Adauga rezultat
            </button>
          </div>
        </div>
        <div className="admin-service-list">
          {content.results.map((item, index) => (
            <article className={`admin-service ${item.id ? '' : 'admin-service-new'}`} key={item.id || `result-${index}`}>
              {!item.id ? <AdminNewBadge /> : null}
              <AdminOrderControls
                index={index}
                total={content.results.length}
                onMoveUp={() => moveContentItem('results', index, -1)}
                onMoveDown={() => moveContentItem('results', index, 1)}
                disabled={isBusy}
              />
              <div className="admin-service-grid">
                <label>
                  Titlu rezultat
                  <input value={item.title} onChange={(event) => updateCollection('results', index, 'title', event.target.value)} />
                </label>
                <label className="full">
                  Descriere scurta rezultat
                  <input
                    value={item.caption || ''}
                    placeholder="Ex: Efect natural, linie mai definita si privire mai luminoasa"
                    onChange={(event) => updateCollection('results', index, 'caption', event.target.value)}
                  />
                </label>
                <label className="full">
                  Text Google pentru poza Inainte
                  <input
                    value={item.before_alt_text || ''}
                    placeholder={readableImageAlt('Inainte', item.title)}
                    onChange={(event) => updateCollection('results', index, 'before_alt_text', event.target.value)}
                  />
                </label>
                <label className="full">
                  Text Google pentru poza Dupa
                  <input
                    value={item.after_alt_text || ''}
                    placeholder={readableImageAlt('Dupa', item.title)}
                    onChange={(event) => updateCollection('results', index, 'after_alt_text', event.target.value)}
                  />
                </label>
                <div className="admin-result-grid full">
                  {renderResultImageEditor(item, index, 'before', 'Inainte')}
                  {renderResultImageEditor(item, index, 'after', 'Dupa')}
                </div>
                <label className="admin-check full">
                  <input type="checkbox" checked={item.is_active} onChange={(event) => updateCollection('results', index, 'is_active', event.target.checked)} />
                  <span>Rezultat vizibil pe site</span>
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveContentItem('results', index)} disabled={isBusy || hasPendingResultCrop(item)}><Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('results', index)} disabled={isBusy}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-reviews">
        <div className="admin-panel-header">
          <h2>Recenzii</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={() => saveContentOrder('reviews')} disabled={isBusy || !content.reviews.length}>
              <Save size={16} /> Salveaza ordinea
            </button>
            <button type="button" onClick={() => addContentItem('reviews')} disabled={isBusy}>
              <Plus size={16} /> Adauga recenzie
            </button>
          </div>
        </div>
        <div className="admin-service-list">
          {content.reviews.map((item, index) => (
            <article className={`admin-service ${item.id ? '' : 'admin-service-new'}`} key={item.id || `review-${index}`}>
              {!item.id ? <AdminNewBadge /> : null}
              <AdminOrderControls
                index={index}
                total={content.reviews.length}
                onMoveUp={() => moveContentItem('reviews', index, -1)}
                onMoveDown={() => moveContentItem('reviews', index, 1)}
                disabled={isBusy}
              />
              <div className="admin-service-grid">
                <label>
                  Nume clienta
                  <input value={item.customer_name} onChange={(event) => updateCollection('reviews', index, 'customer_name', event.target.value)} />
                </label>
                <label>
                  Rating
                  <input type="number" min="1" max="5" value={item.rating} onChange={(event) => updateCollection('reviews', index, 'rating', Number(event.target.value))} />
                </label>
                <label className="full">
                  Text recenzie
                  <textarea rows="4" value={item.review_text} onChange={(event) => updateCollection('reviews', index, 'review_text', event.target.value)} />
                </label>
                <label className="admin-check full">
                  <input type="checkbox" checked={item.is_active} onChange={(event) => updateCollection('reviews', index, 'is_active', event.target.checked)} />
                  <span>Recenzie vizibila pe site</span>
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveContentItem('reviews', index)} disabled={isBusy}><Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('reviews', index)} disabled={isBusy}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-promotions">
        <div className="admin-panel-header">
          <h2>Promotii</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={() => saveContentOrder('promotions')} disabled={isBusy || !content.promotions.length}>
              <Save size={16} /> Salveaza ordinea
            </button>
            <button type="button" onClick={() => addContentItem('promotions')} disabled={isBusy}>
              <Plus size={16} /> Adauga promotie
            </button>
          </div>
        </div>
        <div className="admin-service-list">
          {content.promotions.map((item, index) => (
            <article className={`admin-service ${item.id ? '' : 'admin-service-new'}`} key={item.id || `promotion-${index}`}>
              {!item.id ? <AdminNewBadge /> : null}
              <AdminOrderControls
                index={index}
                total={content.promotions.length}
                onMoveUp={() => moveContentItem('promotions', index, -1)}
                onMoveDown={() => moveContentItem('promotions', index, 1)}
                disabled={isBusy}
              />
              <div className="admin-service-grid">
                <label>
                  Eticheta
                  <input value={item.eyebrow} onChange={(event) => updateCollection('promotions', index, 'eyebrow', event.target.value)} />
                </label>
                <label>
                  Titlu
                  <input value={item.title} onChange={(event) => updateCollection('promotions', index, 'title', event.target.value)} />
                </label>
                <label>
                  Buton
                  <input value={item.cta_label} onChange={(event) => updateCollection('promotions', index, 'cta_label', event.target.value)} />
                </label>
                <label className="full">
                  Descriere
                  <textarea rows="4" value={item.description} onChange={(event) => updateCollection('promotions', index, 'description', event.target.value)} />
                </label>
                <label className="admin-check full">
                  <input type="checkbox" checked={item.is_active} onChange={(event) => updateCollection('promotions', index, 'is_active', event.target.checked)} />
                  <span>Promotie vizibila pe site</span>
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveContentItem('promotions', index)} disabled={isBusy}><Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('promotions', index)} disabled={isBusy}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-faqs">
        <div className="admin-panel-header">
          <h2>FAQ</h2>
          <div className="admin-panel-actions">
            <button type="button" className="admin-secondary" onClick={() => saveContentOrder('faqs')} disabled={isBusy || !content.faqs.length}>
              <Save size={16} /> Salveaza ordinea
            </button>
            <button type="button" onClick={() => addContentItem('faqs')} disabled={isBusy}>
              <Plus size={16} /> Adauga intrebare
            </button>
          </div>
        </div>
        <div className="admin-service-list">
          {content.faqs.map((item, index) => (
            <article className={`admin-service ${item.id ? '' : 'admin-service-new'}`} key={item.id || `faq-${index}`}>
              {!item.id ? <AdminNewBadge /> : null}
              <AdminOrderControls
                index={index}
                total={content.faqs.length}
                onMoveUp={() => moveContentItem('faqs', index, -1)}
                onMoveDown={() => moveContentItem('faqs', index, 1)}
                disabled={isBusy}
              />
              <div className="admin-service-grid">
                <label className="full">
                  Intrebare
                  <input value={item.question} onChange={(event) => updateCollection('faqs', index, 'question', event.target.value)} />
                </label>
                <label className="admin-check">
                  <input type="checkbox" checked={item.is_active} onChange={(event) => updateCollection('faqs', index, 'is_active', event.target.checked)} />
                  <span>Vizibila</span>
                </label>
                <label className="full">
                  Raspuns
                  <textarea rows="4" value={item.answer} onChange={(event) => updateCollection('faqs', index, 'answer', event.target.value)} />
                </label>
              </div>
              <div className="admin-row-actions">
                <button type="button" onClick={() => saveContentItem('faqs', index)} disabled={isBusy}><Save size={16} /> {isBusy ? 'Se salveaza...' : 'Salveaza'}</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('faqs', index)} disabled={isBusy}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function PublicApp() {
  const [serviceList, setServiceList] = useState(defaultServices)
  const [siteContent, setSiteContent] = useState(() => normalizeContent({}))
  const [bookingStatus, setBookingStatus] = useState({ state: 'idle', message: '' })
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availability, setAvailability] = useState({ state: 'idle', message: '', slots: [] })
  const minBookingDate = bucharestDateString()

  useEffect(() => {
    let isMounted = true

    async function loadContent() {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()

        if (isMounted) {
          if (Array.isArray(data.services) && data.services.length) {
            setServiceList(data.services.map(normalizeService))
          }
          setSiteContent(normalizeContent(data))
        }
      } catch {
        if (isMounted) setServiceList(defaultServices)
      }
    }

    loadContent()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedDate) {
      setAvailability({ state: 'idle', message: '', slots: [] })
      setSelectedTime('')
      return undefined
    }

    let isMounted = true
    const controller = new AbortController()
    setSelectedTime('')
    setAvailability({ state: 'loading', message: 'Se incarca orele disponibile...', slots: [] })

    async function loadAvailability() {
      try {
        const response = await fetch(`/api/appointments?date=${encodeURIComponent(selectedDate)}`, {
          signal: controller.signal,
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(data.error || 'Orele disponibile nu au putut fi incarcate.')

        if (isMounted) {
          setAvailability({
            state: 'success',
            message: data.slots?.some((slot) => slot.is_available)
              ? 'Alege una dintre orele disponibile.'
              : 'Nu mai sunt ore disponibile in aceasta zi.',
            slots: Array.isArray(data.slots) ? data.slots : [],
          })
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        if (isMounted) {
          setAvailability({ state: 'error', message: error.message, slots: [] })
        }
      }
    }

    loadAvailability()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [selectedDate])

  useEffect(() => {
    upsertStructuredData(serviceList, siteContent)
  }, [serviceList, siteContent])

  const activePromotion = siteContent.promotions[0] || defaultPromotions[0]
  const contact = siteContent.contact

  async function submitBooking(event) {
    event.preventDefault()
    if (!selectedTime) {
      setBookingStatus({ state: 'error', message: 'Alege o ora disponibila pentru programare.' })
      return
    }

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
      setSelectedDate('')
      setSelectedTime('')
      setAvailability({ state: 'idle', message: '', slots: [] })
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
          {serviceList.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <section className="promo">
        <div className="promo-icon"><Gift size={28} /></div>
        <div>
          <p className="eyebrow">{activePromotion.eyebrow}</p>
          <h2>{activePromotion.title}</h2>
          <p>{activePromotion.description}</p>
        </div>
        <Button tone="light">{activePromotion.cta_label} <ArrowRight size={16} /></Button>
      </section>

      <section className="section muted" id="gallery">
        <SectionIntro
          eyebrow="Galerie"
          title="Lucrari si atmosfera de studio"
        >
          Galerie pentru lucrari reale, portrete, detalii de aplicare si imagini din studio.
        </SectionIntro>
        <div className="gallery-grid">
          {siteContent.gallery.map((item, index) => (
            <ImageSlot
              key={item.id || `${item.title}-${index}`}
              label={item.title}
              src={item.image_url}
              alt={item.alt_text || item.title}
              tall={index === 0}
            />
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
          {siteContent.results.map((item, index) => (
            <BeforeAfterCard key={item.id || `${item.title}-${index}`} item={item} />
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
            {siteContent.reviews.map((item, itemIndex) => (
              <div className="review-card" key={item.id || `${item.customer_name}-${itemIndex}`}>
                <div className="stars" aria-label="Recenzie de 5 stele, de completat cu dovada reala">
                  {[...Array(Math.min(5, Math.max(1, Number(item.rating) || 5)))].map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>{item.review_text}</p>
                <strong>{item.customer_name}</strong>
              </div>
            ))}
          </div>
        </div>
        <div id="faq">
          <p className="eyebrow">Intrebari frecvente</p>
          <h2>Raspunsuri utile inainte de programare</h2>
          <div className="faq-list">
            {siteContent.faqs.map((item, index) => (
              <details key={item.id || `${item.question}-${index}`}>
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
              {serviceList.map((service) => <option key={service.title}>{service.title}</option>)}
            </select>
          </label>
          <label>
            Data preferata
            <input
              name="preferred_date"
              type="date"
              min={minBookingDate}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              required
            />
          </label>
          <div className="booking-slots full">
            <span>Ora disponibila</span>
            {availability.message ? (
              <p className={`slot-status slot-status-${availability.state}`} role="status" aria-live="polite">
                {availability.message}
              </p>
            ) : (
              <p className="slot-status">Alege intai data preferata.</p>
            )}
            <div className="booking-slot-grid" aria-label="Ore disponibile pentru programare">
              {availability.slots.map((slot) => (
                <button
                  type="button"
                  className={`booking-slot ${slot.is_booked ? 'booking-slot-booked' : ''} ${selectedTime === slot.time ? 'booking-slot-selected' : ''}`}
                  key={slot.time}
                  disabled={!slot.is_available || bookingStatus.state === 'loading'}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <strong>{slot.label}</strong>
                  <small>{slot.is_booked ? 'Blocat' : 'Disponibil'}</small>
                </button>
              ))}
            </div>
            <input name="preferred_time" type="hidden" value={selectedTime} />
          </div>
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
        <ImageSlot label={contact.map_label} />
        <div className="contact-card">
          <p className="eyebrow">Contact</p>
          <h2>Zona si detalii</h2>
          <p><MapPin size={18} /> {contact.area}</p>
          <p><Phone size={18} /> {contact.phone}</p>
          <p><AtSign size={18} /> {contact.instagram}</p>
          <p><Clock size={18} /> {contact.schedule}</p>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Sorina - Studio de Gene</strong>
          <p>Extensii de gene si laminare in Bucuresti, cu accent pe confort, forma potrivita si rezultat elegant.</p>
        </div>
        <nav aria-label="Servicii in subsol">
          {serviceList.map((service) => <a key={service.title} href="#services">{service.title}</a>)}
        </nav>
      </footer>
    </main>
  )
}

export default function App() {
  if (window.location.pathname === '/admin/programari') return <AdminApp appointmentsOnly />
  if (window.location.pathname === '/admin') return <AdminApp />
  return <PublicApp />
}
