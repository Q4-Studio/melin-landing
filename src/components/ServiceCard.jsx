const icons = {
  document: (
    <path d="M8 3h8l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 1.5V9h4.5" />
  ),
  shield: <path d="M14 3 6 6v5c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-3Zm0 5v8" />,
  tool: (
    <path d="m14 6 4 4m-9.5 9.5 6.2-6.2a2 2 0 1 0-2.8-2.8L5.7 16.7a2 2 0 1 0 2.8 2.8ZM18 5a3 3 0 0 0 3.8 3.8L18 13l-4-4 4-4Z" />
  ),
  grid: <path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z" />,
  leaf: <path d="M6 13c8.5 0 12-6 12-10 0 0-9.5-.5-12 10Zm0 0c0 4 2.5 8 7 8 5 0 7-5 7-9-3.5 3-7.5 4-14 1Z" />,
  flame: <path d="M14 3c1.5 3.5-1 5-1 7 0 1.7 1.3 2.8 3 2.8 2.5 0 4-2.1 4-4.6C22 11.6 20.2 16 14 21 7.8 16.1 6 11.8 6 8.6 6 6.1 7.6 4 10 4c1.4 0 2.3.7 4 2.6 0-1.1.2-2.2 0-3.6Z" />,
};

function ServiceCard({ service, imageSrc }) {
  return (
    <article className="service-card">
      <div className="service-card__media">
        <img src={imageSrc} alt={service.title} loading="lazy" />
      </div>
      <div className="service-card__body">
        <span className="service-card__icon" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {icons[service.icon]}
          </svg>
        </span>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
    </article>
  );
}

export default ServiceCard;

