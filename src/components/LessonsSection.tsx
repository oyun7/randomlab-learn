import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

const LESSONS = [
  {
    id: 1, emoji: '🪙', title: 'Монетка и орёл',
    desc: 'Почему орёл выпадает в половине случаев? Разбираемся с равновероятными событиями и законом больших чисел.',
    color: '#a78bfa', slug: 'coin',
  },
  {
    id: 2, emoji: '🎲', title: 'Кубик и шансы',
    desc: 'Какова вероятность выбросить шестёрку? Считаем исходы и строим первые формулы.',
    color: '#38bdf8', slug: 'dice',
  },
  {
    id: 3, emoji: '📊', title: 'Графики и статистика',
    desc: 'Как выглядит случайность на графике? Гистограммы, среднее, отклонение — всё по-человечески.',
    color: '#f472b6', slug: 'stats',
  },
  {
    id: 4, emoji: '🔢', title: 'Формула вероятности',
    desc: 'P = m/n — самая важная формула. Разбираем на задачах из жизни: лотерея, погода, игры.',
    color: '#34d399', slug: 'formula',
  },
];

const STATS = [
  { label: 'урока', end: 4 },
  { label: 'эксперимента', end: 12 },
  { label: 'задачи', end: 48 },
  { label: 'учеников', end: 320 },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const LessonCard: React.FC<{ lesson: typeof LESSONS[0]; index: number }> = ({ lesson, index }) => {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  return (
    <div
      ref={ref}
      className={`lesson-card ${inView ? 'in-view' : ''}`}
      onClick={() => navigate(`/learn/${lesson.slug}`)}
      style={{
        transitionDelay: `${index * 0.12}s`,
        '--card-color': lesson.color,
      } as React.CSSProperties}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = lesson.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${lesson.color}33`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      <div className="lesson-card__emoji">{lesson.emoji}</div>
      <div className="lesson-card__bar" style={{ background: lesson.color }} />
      <h3 className="lesson-card__title">{lesson.title}</h3>
      <p className="lesson-card__desc">{lesson.desc}</p>
      <div className="lesson-card__cta" style={{ color: lesson.color }}>
        Читать урок <span>→</span>
      </div>
    </div>
  );
};

const LessonsSection: React.FC = () => {
  const { ref: statsRef, inView: statsInView } = useInView(0.3);

  return (
    <section className="lessons">
      <div className="lessons__header">
        <h2 className="lessons__title">Чему ты научишься</h2>
        <p className="lessons__subtitle">4 урока с живыми экспериментами прямо в браузере</p>
      </div>

      <div className="lessons__grid">
        {LESSONS.map((lesson, i) => (
          <LessonCard key={lesson.id} lesson={lesson} index={i} />
        ))}
      </div>

      <div ref={statsRef} className="stats-row">
        {STATS.map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-item__number">
              {statsInView ? <CountUp end={stat.end} duration={2} /> : '0'}
              <span style={{ fontSize: '60%' }}>+</span>
            </div>
            <div className="stat-item__label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LessonsSection;