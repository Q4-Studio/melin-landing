import { useState } from 'react';
import ServiceCard from './components/ServiceCard';
import { siteContent } from './data/site';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
};

const navItems = [
  { label: 'Servizi', href: '#servizi' },
  { label: 'Chi siamo', href: '#chi-siamo' },
  { label: 'Contatti', href: '#contatti' },
];

function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = import.meta.env.BASE_URL;
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL?.trim() || '';
  const privacyHref = `${baseUrl}${siteContent.privacyPath}`;
  const heroImage = `${baseUrl}assets/6bdba92684f1fd7d1cedb80de52d1133.jpg`;

  const serviceCards = siteContent.services.map((service) => ({
    ...service,
    imageSrc: `${baseUrl}${service.image}`,
  }));

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

    if (!form.consent) {
      setStatus({ type: 'error', message: 'Devi accettare l’informativa privacy prima di inviare la richiesta.' });
      return;
    }

    if (!webhookUrl) {
      setStatus({ type: 'error', message: 'Webhook non configurato. Imposta VITE_WEBHOOK_URL per attivare il form.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          source: 'melin-landing',
          submittedAt: new Date().toISOString(),
          company: siteContent.companyName,
          payload: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            message: form.message.trim(),
            consent: form.consent,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Webhook response not ok');
      }

      setForm(initialForm);
      setStatus({ type: 'success', message: 'Richiesta inviata correttamente. Ti ricontatteremo al piu presto.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Invio non riuscito. Riprova tra poco oppure contattaci via email o telefono.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <a className="skip-link" href="#contenuto">
        Vai al contenuto
      </a>

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#top" aria-label="Melin Group">
            <img src={`${baseUrl}assets/melin-white.png`} alt="Melin Group" />
          </a>
          <nav className="nav" aria-label="Navigazione principale">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="#contatti">
            Parla con noi
          </a>
        </div>
      </header>

      <main id="contenuto">
        <section className="hero" id="top">
          <div className="container hero__grid">
            <div className="hero__content">
              <span className="eyebrow">{siteContent.eyebrow}</span>
              <h1>{siteContent.heroTitle}</h1>
              <p className="hero__lead">{siteContent.heroBody}</p>
              <div className="hero__actions">
                <a className="button button--primary" href={siteContent.heroPrimaryCta.href}>
                  {siteContent.heroPrimaryCta.label}
                </a>
                <a className="button button--secondary" href={siteContent.heroSecondaryCta.href}>
                  {siteContent.heroSecondaryCta.label}
                </a>
              </div>
              <div className="hero__meta" aria-label="Punti di forza">
                <span>Partner unico</span>
                <span>Approccio chiavi in mano</span>
                <span>Supporto tecnico e operativo</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual__frame">
                <img src={heroImage} alt="Melin Group per l'ambiente e la sostenibilita" />
              </div>
              <div className="hero-visual__card">
                <strong>Interventi coordinati</strong>
                <p>Edilizia, sicurezza, ambiente e manutenzioni con un’unica regia operativa.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--services" id="servizi">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Aree di intervento</span>
              <h2>{siteContent.servicesHeading}</h2>
              <p>{siteContent.servicesIntro}</p>
            </div>
            <div className="services-grid">
              {serviceCards.map((service) => (
                <ServiceCard key={service.title} service={service} imageSrc={service.imageSrc} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section--about" id="chi-siamo">
          <div className="container about-grid">
            <div className="about-panel">
              <span className="eyebrow">Approccio Melin</span>
              <h2>{siteContent.aboutTitle}</h2>
              <p>{siteContent.aboutBody}</p>
              <ul className="about-list">
                {siteContent.aboutHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <aside className="about-highlight">
              <p className="about-highlight__label">Un unico interlocutore</p>
              <p className="about-highlight__copy">
                Dalla fase iniziale alla gestione operativa, costruiamo un flusso di lavoro ordinato, leggibile e allineato con il cliente.
              </p>
              <div className="about-highlight__stats">
                <div>
                  <strong>6</strong>
                  <span>ambiti di servizio integrati</span>
                </div>
                <div>
                  <strong>1</strong>
                  <span>referente per progetto e attivita</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="section section--contact" id="contatti">
          <div className="container contact-grid">
            <div className="contact-copy">
              <span className="eyebrow">Melin Group S.r.l.</span>
              <h2>{siteContent.contactTitle}</h2>
              <p>{siteContent.contactIntro}</p>

              <div className="contact-details">
                <a className="contact-details__item" href={siteContent.contact.mapsUrl} target="_blank" rel="noreferrer">
                  <strong>Sede</strong>
                  <span>{siteContent.contact.address}</span>
                </a>
                <a className="contact-details__item" href={`mailto:${siteContent.contact.email}`}>
                  <strong>Email</strong>
                  <span>{siteContent.contact.email}</span>
                </a>
                <a className="contact-details__item" href={`tel:${siteContent.contact.phoneHref}`}>
                  <strong>Telefono</strong>
                  <span>{siteContent.contact.phoneDisplay}</span>
                </a>
                <div className="contact-details__item">
                  <strong>C.F. e P.I.</strong>
                  <span>{siteContent.contact.vat}</span>
                </div>
              </div>

              <div className="contact-links">
                <a className="button button--secondary" href={siteContent.contact.mapsUrl} target="_blank" rel="noreferrer">
                  Apri su Google Maps
                </a>
                <a className="button button--ghost" href={siteContent.contact.facebookUrl} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </div>

              <div className="map-card">
                <iframe
                  title="Mappa Melin Group"
                  loading="lazy"
                  src="https://www.google.com/maps?q=45.435452,11.959087&z=17&output=embed"
                />
              </div>
            </div>

            <div className="form-panel">
              <div className="form-panel__intro">
                <h3>Richiedi informazioni</h3>
                <p>Compila il form e invia la tua richiesta direttamente al team Melin.</p>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  Nome e cognome
                  <input
                    autoComplete="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Email
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
                <label>
                  Telefono
                  <input
                    autoComplete="tel"
                    inputMode="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Messaggio
                  <textarea
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="checkbox">
                  <input
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={handleChange}
                  />
                  <span>
                    Ho letto e accetto la <a href={privacyHref}>privacy policy</a>.
                  </span>
                </label>

                <button className="button button--primary button--block" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
                </button>
                <p className={`form-status form-status--${status.type}`} aria-live="polite">
                  {status.message}
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            © {new Date().getFullYear()} {siteContent.companyName}
          </p>
          <div className="site-footer__links">
            <a href={privacyHref}>Privacy Policy</a>
            <a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
