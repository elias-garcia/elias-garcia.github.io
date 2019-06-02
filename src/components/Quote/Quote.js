import React from 'react';
import QuoteData from '../../assets/data/quote.json';
import './Quote.css';

function Quote() {
  return (
    <p className="Quote">
      <q className="Quote-text">{QuoteData.text}</q>
      &nbsp;- {QuoteData.author}
    </p>
  );
}

export default Quote;