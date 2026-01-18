import React from 'react';
import { useLocation } from 'react-router';
import './Hero.css';

const Hero: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const heroClass = isHome ? 'hero hero--home' : 'hero hero--other';

  return (
    <section className={heroClass}>
      <div className="hero__container container">
        {isHome ? (
          <h1 className="hero__title">Там, где мир начинается с&nbsp;путешествий</h1>
        ) : (
          <h1 className="hero__title hero__title--other">Истории ваших путешествий</h1>
        )}
      </div>
    </section>
  );
};

export default Hero;

