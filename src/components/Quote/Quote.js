import React from 'react';
import QuoteData from '../../assets/data/quote.json';
import './Quote.css';

const Quote = () => (
  <p className="Quote">
    <q className="Quote-text">{QuoteData.text}</q>
    {' '}
    -
    {' '}
    {QuoteData.author}
  </p>
);

export default Quote;
