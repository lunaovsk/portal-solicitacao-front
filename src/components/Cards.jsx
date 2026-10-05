import '../theme/Cards.css';
import { cardDefinitions } from "../data/RequestTypes";


function Cards({ dashboard = {} }) {
    return (
        <section className="summary-cards" aria-label="Resumo das solicitações">
            {cardDefinitions.map((card) => (
                <article className={`summary-card summary-card-${card.id}`} key={card.id}>
                    <span className="summary-card-label">{card.title}</span>
                    <span className="summary-card-value" id={`card-${card.id}`}>
                        {dashboard?.[card.dataKey] ?? 0}
                    </span>
                </article>
            ))}
        </section>
    );
}

export default Cards;
