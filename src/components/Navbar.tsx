import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__logo">🎲 RandomLab</Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">Главная</Link>
          <Link to="/learn" className="navbar__link">Уроки</Link>
          <a
            href="https://your-randomlab-url.com"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__btn"
          >
            🎲 Эксперименты
          </a>
        </div>

        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Меню"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="navbar__burger-line"
              style={{
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                  : 'scaleX(0)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      <div className={`navbar__dropdown ${menuOpen ? 'is-open' : ''}`}>
        <Link to="/" className="navbar__dropdown-link" onClick={() => setMenuOpen(false)}>
          🏠 Главная
        </Link>
        <Link to="/learn" className="navbar__dropdown-link" onClick={() => setMenuOpen(false)}>
          📚 Уроки
        </Link>
        <a
          href="https://your-randomlab-url.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar__dropdown-btn"
          onClick={() => setMenuOpen(false)}
        >
          🎲 Перейти к экспериментам
        </a>
      </div>
    </>
  );
};

export default Navbar;