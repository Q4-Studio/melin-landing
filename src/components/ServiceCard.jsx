function ServiceCard({ service, itemsLabel, index }) {
  return (
    <article className="card rivela" style={{ '--i': index }}>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="card__voci">
        <span className="card__voci-titolo">{itemsLabel}</span>
        <ul>
          {service.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default ServiceCard;
