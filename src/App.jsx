import { useEffect, useRef, useState } from 'react';
import ServiceCard from './components/ServiceCard';
import { siteContent } from './data/site';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
  // Campo esca: invisibile agli utenti, i bot lo compilano. Se arriva pieno,
  // la richiesta viene scartata senza avvisare il mittente.
  azienda: '',
};

/** GoHighLevel mappa meglio i campi in cima all'oggetto, non annidati. */
function buildPayload(form) {
  const fullName = form.name.trim().replace(/\s+/g, ' ');
  const parts = fullName.split(' ');

  return {
    first_name: parts[0] || '',
    last_name: parts.slice(1).join(' '),
    full_name: fullName,
    email: form.email.trim(),
    phone: form.phone.trim(),
    message: form.message.trim(),
    consent: form.consent,
    source: 'melin-landing',
    page: typeof window === 'undefined' ? '' : window.location.href,
    submitted_at: new Date().toISOString(),
  };
}

const navItems = [
  { label: 'Servizi', href: '#servizi' },
  { label: 'Chi siamo', href: '#chi-siamo' },
  { label: 'Contatti', href: '#contatti' },
];

/** Tre quadrati arrotondati: la geometria del marchio, usata come segno. */
function Quadrati() {
  return (
    <span className="quadrati" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

/** Rivela i blocchi una volta sola, quando entrano nel campo di lettura. */
function useReveal(root) {
  useEffect(() => {
    const nodes = root.current?.querySelectorAll('.rivela');
    if (!nodes?.length) return;

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [root]);
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shell = useRef(null);

  useReveal(shell);

  const baseUrl = import.meta.env.BASE_URL;
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL?.trim() || '';
  const privacyHref = `${baseUrl}${siteContent.privacyPath}`;

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (form.azienda) {
      // Compilato solo da un bot: fingiamo l'invio e non recapitiamo nulla.
      setForm(initialForm);
      setStatus({
        type: 'success',
        message: 'Richiesta inviata. Vi rispondiamo entro un giorno lavorativo.',
      });
      return;
    }

    if (!form.consent) {
      setStatus({
        type: 'error',
        message: 'Manca il consenso al trattamento dei dati. Spuntate la casella per inviare.',
      });
      return;
    }

    if (!webhookUrl) {
      setStatus({
        type: 'error',
        message:
          'Il modulo non è ancora collegato. Nel frattempo scrivete a ' +
          `${siteContent.contact.email} o chiamate lo ${siteContent.contact.phoneDisplay}.`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Content-Type text/plain e nessun header aggiuntivo: cosi la richiesta
      // resta "semplice" e non scatta il preflight CORS, che l'endpoint GHL
      // potrebbe non gestire. mode no-cors perche la risposta non ci serve:
      // un secondo tentativo creerebbe un lead duplicato su GoHighLevel.
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(buildPayload(form)),
      });

      setForm(initialForm);
      setStatus({
        type: 'success',
        message: 'Richiesta inviata. Vi rispondiamo entro un giorno lavorativo.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          'Invio non riuscito: la richiesta non è partita. Riprovate, oppure scrivete a ' +
          `${siteContent.contact.email}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell" ref={shell}>
      <a className="skip-link" href="#contenuto">
        Vai al contenuto
      </a>

      <header className="testata">
        <div className="container testata__inner">
          <a className="marchio" href="#top" aria-label="Melin Group, torna in cima">
            <img src={`${baseUrl}assets/melin-white.png`} alt="Melin Group" />
          </a>
          <nav className="navigazione" aria-label="Navigazione principale">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="bottone bottone--pieno testata__cta" href="#contatti">
            Richiedi un sopralluogo
          </a>
        </div>
      </header>

      <main id="contenuto">
        {/* ---------------------------------------------------- Apertura */}
        <section className="hero" id="top">
          <div className="container hero__grid">
            <div className="hero__testo">
              <div className="hero__impronta">
                <Quadrati />
                <span>{siteContent.heroClassification}</span>
              </div>
              <h1>{siteContent.heroTitle}</h1>
              <p className="hero__lead">{siteContent.heroBody}</p>
              <div className="hero__azioni">
                <a className="bottone bottone--pieno" href={siteContent.heroPrimaryCta.href}>
                  {siteContent.heroPrimaryCta.label}
                </a>
                <a className="bottone bottone--contorno" href={siteContent.heroSecondaryCta.href}>
                  {siteContent.heroSecondaryCta.label}
                </a>
              </div>
            </div>

            <div className="hero__media">
              <img
                src={`${baseUrl}${siteContent.heroImage.src}`}
                alt={siteContent.heroImage.alt}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Servizi */}
        <section className="sezione sezione--grigia" id="servizi">
          <div className="container">
            <div className="intestazione rivela">
              <span className="etichetta">{siteContent.servicesEyebrow}</span>
              <h2>{siteContent.servicesHeading}</h2>
              <p>{siteContent.servicesIntro}</p>
            </div>

            <div className="griglia-servizi">
              {siteContent.services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  itemsLabel={siteContent.servicesItemsLabel}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Chi siamo */}
        <section className="sezione" id="chi-siamo">
          <div className="container">
            <div className="intestazione rivela">
              <span className="etichetta">{siteContent.aboutEyebrow}</span>
              <h2>{siteContent.aboutTitle}</h2>
            </div>

            <div className="chi-siamo__grid">
              <div className="chi-siamo__testo rivela">
                <p>{siteContent.aboutBody}</p>
                <p>{siteContent.aboutBodySecondary}</p>
              </div>

              <div className="chi-siamo__lato rivela">
                <span className="etichetta">{siteContent.aboutHighlightsLabel}</span>
                <ul className="competenze">
                  {siteContent.aboutHighlights.map((item) => (
                    <li key={item}>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="galleria rivela">
              {siteContent.gallery.map((shot) => (
                <img key={shot.src} src={`${baseUrl}${shot.src}`} alt={shot.alt} loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Contatti */}
        <section className="sezione sezione--velo" id="contatti">
          <div className="container">
            <div className="intestazione rivela">
              <span className="etichetta">{siteContent.contactEyebrow}</span>
              <h2>{siteContent.contactTitle}</h2>
            </div>

            <div className="contatti">
              <div className="contatti__copy rivela">
                <p>{siteContent.contactIntro}</p>

                <ul className="recapiti">
                  <li>
                    <a href={siteContent.contact.mapsUrl} target="_blank" rel="noreferrer">
                      <strong>Sede</strong>
                      <span>{siteContent.contact.address}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${siteContent.contact.email}`}>
                      <strong>Email</strong>
                      <span>{siteContent.contact.email}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${siteContent.contact.phoneHref}`}>
                      <strong>Telefono</strong>
                      <span>{siteContent.contact.phoneDisplay}</span>
                    </a>
                  </li>
                  <li>
                    <div>
                      <strong>C.F. e P.I.</strong>
                      <span>{siteContent.contact.vat}</span>
                    </div>
                  </li>
                </ul>

                <div className="contatti__azioni">
                  <a
                    className="bottone bottone--contorno"
                    href={siteContent.contact.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Apri la mappa
                  </a>
                  <a
                    className="bottone bottone--contorno"
                    href={siteContent.contact.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>

              <div className="form-card rivela">
                <div className="form-card__testata">
                  <h3>{siteContent.formTitle}</h3>
                </div>

                <form onSubmit={handleSubmit}>
                  <label className="campo">
                    <span>Nome e cognome</span>
                    <input
                      autoComplete="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="campo">
                    <span>Email</span>
                    <input
                      autoComplete="email"
                      inputMode="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="campo">
                    <span>Telefono</span>
                    <input
                      autoComplete="tel"
                      inputMode="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="campo">
                    <span>Immobile e intervento</span>
                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Tipo di edificio, comune, natura dell’intervento."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <div className="esca" aria-hidden="true">
                    <label htmlFor="azienda">Azienda</label>
                    <input
                      id="azienda"
                      name="azienda"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.azienda}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="consenso">
                    <input
                      name="consent"
                      type="checkbox"
                      checked={form.consent}
                      onChange={handleChange}
                    />
                    <span>
                      Ho letto la <a href={privacyHref}>privacy policy</a> e acconsento al
                      trattamento dei dati per essere ricontattato.
                    </span>
                  </label>

                  <button
                    className="bottone bottone--pieno bottone--blocco"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Invio in corso…' : 'Invia la richiesta'}
                  </button>

                  <p className={`esito esito--${status.type}`} role="status" aria-live="polite">
                    {status.message}
                  </p>
                </form>
              </div>
            </div>

            <div className="mappa rivela">
              <iframe
                title="Mappa della sede Melin Group"
                loading="lazy"
                src="https://www.google.com/maps?q=45.435452,11.959087&z=17&output=embed"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="piede">
        <div className="container piede__inner">
          <div>
            <p>
              © {new Date().getFullYear()} {siteContent.companyName}
            </p>
            <p className="piede__credito">
              Realizzato da{' '}
              <a href="https://q4.studio" target="_blank" rel="noreferrer">
                Q4 Studio
              </a>
            </p>
          </div>
          <div className="piede__link">
            <a href={privacyHref}>Privacy policy</a>
            <a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a>
            <a href={`tel:${siteContent.contact.phoneHref}`}>{siteContent.contact.phoneDisplay}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
