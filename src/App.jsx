import { useEffect, useState } from 'react'
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

function normalizeService(service) {
  return {
    id: service.id || null,
    title: service.title || '',
    duration: service.duration || '',
    price: service.price || service.price_label || 'Pret de completat',
    note: service.note || '',
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
    reviews: Array.isArray(data.reviews) && data.reviews.length ? data.reviews.map(normalizeOrderedItem) : defaultReviews,
    promotions: Array.isArray(data.promotions) && data.promotions.length ? data.promotions.map(normalizeOrderedItem) : defaultPromotions,
    faqs: Array.isArray(data.faqs) && data.faqs.length ? data.faqs.map(normalizeOrderedItem) : defaultFaqs,
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

function AdminApp() {
  const [password, setPassword] = useState(() => window.sessionStorage.getItem('sorina_admin_password') || '')
  const [draftPassword, setDraftPassword] = useState('')
  const [services, setServices] = useState([])
  const [content, setContent] = useState(() => normalizeContent({}))
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const isLoggedIn = Boolean(password)

  async function adminRequest(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
        ...options.headers,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error || 'Actiunea nu a putut fi finalizata.')
    }

    return data
  }

  async function loadAdminData() {
    if (!password) return
    setStatus({ state: 'loading', message: 'Se incarca continutul...' })

    try {
      const [serviceData, contentData] = await Promise.all([
        adminRequest('/api/admin/services'),
        adminRequest('/api/admin/content'),
      ])
      setServices(serviceData.services.map(normalizeService))
      setContent(normalizeContent(contentData))
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
        const [serviceResponse, contentResponse] = await Promise.all([
          fetch('/api/admin/services', {
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': password,
            },
          }),
          fetch('/api/admin/content', {
            headers: {
              'Content-Type': 'application/json',
              'x-admin-password': password,
            },
          }),
        ])
        const serviceData = await serviceResponse.json().catch(() => ({}))
        const contentData = await contentResponse.json().catch(() => ({}))

        if (!serviceResponse.ok) throw new Error(serviceData.error || 'Serviciile nu au putut fi incarcate.')
        if (!contentResponse.ok) throw new Error(contentData.error || 'Continutul nu a putut fi incarcat.')

        if (isMounted) {
          setServices(serviceData.services.map(normalizeService))
          setContent(normalizeContent(contentData))
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

  function updateCollection(collection, index, field, value) {
    setContent((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }))
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

    setContent((current) => ({
      ...current,
      [collection]: [...current[collection], builders[collection](current[collection])],
    }))
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

  async function saveContentItem(collection, index) {
    const item = content[collection][index]
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
    if (file.size > 4 * 1024 * 1024) {
      setStatus({ state: 'error', message: 'Imaginea trebuie sa fie sub 4 MB.' })
      return
    }

    try {
      const imageData = await readFileAsDataUrl(file)
      setContent((current) => ({
        ...current,
        gallery: current.gallery.map((item, itemIndex) => (
          itemIndex === index
            ? {
                ...item,
                image_data: imageData,
                image_name: file.name,
                image_url: imageData,
                alt_text: item.alt_text || item.title,
              }
            : item
        )),
      }))
      setStatus({ state: 'success', message: 'Imaginea este pregatita. Apasa Salveaza ca sa fie incarcata.' })
    } catch (error) {
      setStatus({ state: 'error', message: error.message })
    }
  }

  function addService() {
    setServices((current) => [
      ...current,
      {
        id: null,
        title: '',
        duration: '',
        price: 'Pret de completat',
        note: '',
        sort_order: current.length ? current.length * 10 + 10 : 10,
        is_active: true,
      },
    ])
  }

  async function saveService(index) {
    const service = services[index]
    setStatus({ state: 'loading', message: 'Se salveaza serviciul...' })

    try {
      const payload = {
        title: service.title,
        duration: service.duration,
        price: service.price,
        note: service.note,
        sort_order: service.sort_order,
        is_active: service.is_active,
      }
      const data = await adminRequest(
        service.id ? `/api/admin/services?id=${encodeURIComponent(service.id)}` : '/api/admin/services',
        {
          method: service.id ? 'PATCH' : 'POST',
          body: JSON.stringify(payload),
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

  if (!isLoggedIn) {
    return (
      <main className="admin-shell">
        <section className="admin-login">
          <p className="eyebrow">Administrare</p>
          <h1>Sorina - Panou continut</h1>
          <p>Introdu parola de admin pentru a modifica serviciile, contactul, galeria, recenziile, promotiile si FAQ-ul.</p>
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
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Administrare</p>
          <h1>Continut editabil</h1>
          <p>Modificarile salvate aici devin sursa pentru site si formularul de programare.</p>
          <nav className="admin-jump-nav" aria-label="Sectiuni admin">
            <a href="#admin-services">Servicii</a>
            <a href="#admin-contact">Contact/program</a>
            <a href="#admin-gallery">Galerie</a>
            <a href="#admin-reviews">Recenzii</a>
            <a href="#admin-promotions">Promotii</a>
            <a href="#admin-faqs">FAQ</a>
          </nav>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={loadAdminData}>
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
          <button type="button" onClick={addService}>
            <Plus size={16} /> Adauga serviciu
          </button>
        </div>

        <div className="admin-service-list">
          {services.map((service, index) => (
            <article className="admin-service" key={service.id || `new-${index}`}>
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
                <label>
                  Ordine
                  <input
                    type="number"
                    value={service.sort_order}
                    onChange={(event) => updateService(index, 'sort_order', Number(event.target.value))}
                  />
                </label>
                <label className="full">
                  Descriere
                  <textarea value={service.note} rows="3" onChange={(event) => updateService(index, 'note', event.target.value)} />
                </label>
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
                <button type="button" onClick={() => saveService(index)}>
                  <Save size={16} /> Salveaza
                </button>
                <button type="button" className="admin-danger" onClick={() => deleteService(index)}>
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
          <button type="button" onClick={saveContact}>
            <Save size={16} /> Salveaza
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

      <section className="admin-panel" id="admin-gallery">
        <div className="admin-panel-header">
          <h2>Galerie foto</h2>
          <button type="button" onClick={() => addContentItem('gallery')}>
            <Plus size={16} /> Adauga imagine
          </button>
        </div>
        <div className="admin-service-list">
          {content.gallery.map((item, index) => (
            <article className="admin-service" key={item.id || `gallery-${index}`}>
              <div className="admin-service-grid">
                <label>
                  Titlu
                  <input value={item.title} onChange={(event) => updateCollection('gallery', index, 'title', event.target.value)} />
                </label>
                <label>
                  Ordine
                  <input type="number" value={item.sort_order} onChange={(event) => updateCollection('gallery', index, 'sort_order', Number(event.target.value))} />
                </label>
                <label className="full">
                  Text alternativ
                  <input value={item.alt_text || ''} onChange={(event) => updateCollection('gallery', index, 'alt_text', event.target.value)} />
                </label>
                <label className="full">
                  URL imagine
                  <input value={item.image_url || ''} onChange={(event) => updateCollection('gallery', index, 'image_url', event.target.value)} />
                </label>
                <label className="full">
                  Upload imagine
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setGalleryFile(index, event.target.files?.[0])} />
                </label>
                {item.image_url ? (
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
                <button type="button" onClick={() => saveContentItem('gallery', index)}><Save size={16} /> Salveaza</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('gallery', index)}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-reviews">
        <div className="admin-panel-header">
          <h2>Recenzii</h2>
          <button type="button" onClick={() => addContentItem('reviews')}>
            <Plus size={16} /> Adauga recenzie
          </button>
        </div>
        <div className="admin-service-list">
          {content.reviews.map((item, index) => (
            <article className="admin-service" key={item.id || `review-${index}`}>
              <div className="admin-service-grid">
                <label>
                  Nume clienta
                  <input value={item.customer_name} onChange={(event) => updateCollection('reviews', index, 'customer_name', event.target.value)} />
                </label>
                <label>
                  Rating
                  <input type="number" min="1" max="5" value={item.rating} onChange={(event) => updateCollection('reviews', index, 'rating', Number(event.target.value))} />
                </label>
                <label>
                  Ordine
                  <input type="number" value={item.sort_order} onChange={(event) => updateCollection('reviews', index, 'sort_order', Number(event.target.value))} />
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
                <button type="button" onClick={() => saveContentItem('reviews', index)}><Save size={16} /> Salveaza</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('reviews', index)}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-promotions">
        <div className="admin-panel-header">
          <h2>Promotii</h2>
          <button type="button" onClick={() => addContentItem('promotions')}>
            <Plus size={16} /> Adauga promotie
          </button>
        </div>
        <div className="admin-service-list">
          {content.promotions.map((item, index) => (
            <article className="admin-service" key={item.id || `promotion-${index}`}>
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
                <label>
                  Ordine
                  <input type="number" value={item.sort_order} onChange={(event) => updateCollection('promotions', index, 'sort_order', Number(event.target.value))} />
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
                <button type="button" onClick={() => saveContentItem('promotions', index)}><Save size={16} /> Salveaza</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('promotions', index)}><Trash2 size={16} /> Sterge</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel" id="admin-faqs">
        <div className="admin-panel-header">
          <h2>FAQ</h2>
          <button type="button" onClick={() => addContentItem('faqs')}>
            <Plus size={16} /> Adauga intrebare
          </button>
        </div>
        <div className="admin-service-list">
          {content.faqs.map((item, index) => (
            <article className="admin-service" key={item.id || `faq-${index}`}>
              <div className="admin-service-grid">
                <label className="full">
                  Intrebare
                  <input value={item.question} onChange={(event) => updateCollection('faqs', index, 'question', event.target.value)} />
                </label>
                <label>
                  Ordine
                  <input type="number" value={item.sort_order} onChange={(event) => updateCollection('faqs', index, 'sort_order', Number(event.target.value))} />
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
                <button type="button" onClick={() => saveContentItem('faqs', index)}><Save size={16} /> Salveaza</button>
                <button type="button" className="admin-danger" onClick={() => deleteContentItem('faqs', index)}><Trash2 size={16} /> Sterge</button>
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

  const activePromotion = siteContent.promotions[0] || defaultPromotions[0]
  const contact = siteContent.contact

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
  return window.location.pathname === '/admin' ? <AdminApp /> : <PublicApp />
}
