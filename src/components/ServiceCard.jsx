function ServiceCard({ service, itemsLabel, index }) {
  return (
    <article className="scheda rivela" style={{ '--i': index }}>
      <div className="scheda__corpo">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <div className="scheda__voci">
          <span className="scheda__voci-titolo">{itemsLabel}</span>
          <ul>
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;
