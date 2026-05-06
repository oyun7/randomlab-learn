import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBg from '../components/ParticlesBg';
const MemoParticles = React.memo(ParticlesBg);


const TYPING_PHRASES = [
  'Почему выпадает орёл?',
  'Можно ли предсказать кубик?',
  'Что такое случайность?',
];

const EMOJIS = ['🎲', '🪙', '📊', '🎯', '🔢'];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= phrase.length) {
      timeout = setTimeout(() => {
        setDisplayed(phrase.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, 60);
    } else if (!deleting && charIdx > phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(phrase.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, 30);
    } else {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % TYPING_PHRASES.length);
      setCharIdx(0);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <div className="home">
      <MemoParticles />
  

      {EMOJIS.map((emoji, i) => (
        <span key={i} className="home__emoji">{emoji}</span>
      ))}

      <section className="hero">
        <h1 className="hero__title">
          {'Теория вероятностей и математическая статистика'
          .split(' ')
          .map((word, i) => (
            <span key={i} style={{ marginRight: '0.5em', whiteSpace: 'nowrap' }}>
              {word.split('').map((char, j) => (
                <span
                  key={j}
                  className="hero__title-char"
                  style={{ animationDelay: `${(i * 10 + j) * 0.05}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className="hero__subtitle">Для учеников 9-11 класса 🎓</p>

        <div className="hero__typing-box">
          <span className="hero__typing-text">{displayed}</span>
          <span className="hero__cursor">|</span>
        </div>

        <div className="hero__btns">
          <button className="hero__btn-primary" onClick={() => navigate('/learn')}>
            📚 Начать учиться
          </button>
          <a
            href="https://randlab1.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero__btn-secondary"
          >
            🎲 Перейти к экспериментам
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;