import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonsSection from '../components/LessonsSection';

const LESSONS = [
  {
    slug: 'coin',
    emoji: '🪙',
    color: '#a78bfa',
    title: 'Монетка и орёл',
    sections: [
      {
        heading: 'Что такое случайное событие?',
        body: `Когда ты бросаешь монетку, заранее нельзя сказать — выпадет орёл или решка. Это и есть случайное событие: оно может произойти, а может нет.\n\nНо если бросить монетку 1000 раз — орёл выпадет примерно в половине случаев. Это закон больших чисел: чем больше опытов, тем ближе результат к теоретической вероятности.`,
        isCallout: false,
      },
      {
        heading: 'Как считать вероятность?',
        body: `Вероятность — это число от 0 до 1.\n\n• 0 — событие невозможно\n• 1 — событие точно произойдёт\n• 0.5 — шанс 50 на 50\n\nФормула: P = (число благоприятных исходов) / (число всех исходов)\n\nДля монетки: P(орёл) = 1/2 = 0.5 = 50%`,
        isCallout: false,
      },
      {
        heading: 'Попробуй сам 🎯',
        body: `Перейди в раздел "Эксперименты" и подбрось монетку 10, 100 и 1000 раз. Посмотри, как частота выпадения орла приближается к 0.5 с ростом числа бросков.\n\nЭто и есть теория вероятностей в действии!`,
        isCallout: true,
      },
    ],
  },
  {
    slug: 'dice',
    emoji: '🎲',
    color: '#38bdf8',
    title: 'Кубик и шансы',
    sections: [
      {
        heading: 'Сколько исходов у кубика?',
        body: `Обычный кубик имеет 6 граней: 1, 2, 3, 4, 5, 6. Все они равновероятны — нет причины, по которой одна грань выпадала бы чаще другой (если кубик честный).\n\nВероятность каждого числа: P = 1/6 ≈ 0.167 ≈ 16.7%`,
        isCallout: false,
      },
      {
        heading: 'Сложные события',
        body: `Что если нас интересует "выпадет чётное число"?\nЧётные числа: 2, 4, 6 — три исхода.\n\nP(чётное) = 3/6 = 1/2 = 50%\n\nА "выпадет больше 4"? Это 5 и 6 — два исхода.\nP(>4) = 2/6 = 1/3 ≈ 33%`,
        isCallout: false,
      },
      {
        heading: 'χ²-тест — как проверить честность кубика? 🔬',
        body: `В RandomLab есть автоматический χ² (хи-квадрат) тест. Он сравнивает твои броски с тем, что должно быть теоретически.\n\nЕсли кубик честный — тест покажет "распределение нормальное". Попробуй подбросить 600 раз и посмотри результат!`,
        isCallout: true,
      },
    ],
  },
  {
    slug: 'stats',
    emoji: '📊',
    color: '#f472b6',
    title: 'Графики и статистика',
    sections: [
      {
        heading: 'Что показывает гистограмма?',
        body: `Гистограмма — это столбчатый график, который показывает, как часто встречается каждый результат.\n\nЕсли бросить кубик 600 раз, каждое число должно выпасть ~100 раз. Гистограмма покажет 6 примерно одинаковых столбиков — это равномерное распределение.`,
        isCallout: false,
      },
      {
        heading: 'Среднее и отклонение',
        body: `Среднее (математическое ожидание) — это "центр" всех результатов.\nДля кубика: M = (1+2+3+4+5+6)/6 = 3.5\n\nСтандартное отклонение показывает, насколько результаты разбросаны. Маленькое отклонение = результаты кучкуются близко к среднему.`,
        isCallout: false,
      },
      {
        heading: 'Закон больших чисел на графике 📈',
        body: `Запусти эксперимент с монеткой в RandomLab и включи отображение графика. Ты увидишь, как кривая частоты постепенно "успокаивается" и выходит на линию 0.5.\n\nЧем больше бросков — тем стабильнее линия. Именно так работает теория вероятностей в реальной жизни!`,
        isCallout: true,
      },
    ],
  },
  {
    slug: 'formula',
    emoji: '🔢',
    color: '#34d399',
    title: 'Формула вероятности',
    sections: [
      {
        heading: 'Главная формула',
        body: `P = m / n\n\n• P — вероятность события\n• m — число благоприятных исходов\n• n — общее число всех равновозможных исходов\n\nЭто классическое определение вероятности, введённое математиком Лапласом.`,
        isCallout: false,
      },
      {
        heading: 'Примеры из жизни',
        body: `🎰 Лотерея: 1 билет из 1000 — P = 1/1000 = 0.1%\n\n🌧 Погода: из 30 дней апреля дождь был 12 раз — P(дождь) = 12/30 = 40%\n\n🃏 Карты: вероятность вытащить туза из 52 карт — P = 4/52 = 1/13 ≈ 7.7%`,
        isCallout: false,
      },
      {
        heading: 'Сложение вероятностей 🧮',
        body: `Если два события не могут произойти одновременно (несовместные), их вероятности складываются:\n\nP(A или B) = P(A) + P(B)\n\nПример: P(1 или 2 на кубике) = 1/6 + 1/6 = 2/6 = 1/3\n\nПроверь это в RandomLab — запусти эксперимент и посчитай!`,
        isCallout: true,
      },
    ],
  },
];

const LearnPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState<string>(slug || '');

  const lesson = LESSONS.find(l => l.slug === activeLesson);

  const goToLesson = (s: string) => {
    setActiveLesson(s);
    navigate(`/learn/${s}`);
  };

  const goToAll = () => {
    setActiveLesson('');
    navigate('/learn');
  };

  return (
    <div className="learn-page">

      {/* Сайдбар */}
      <aside className="learn-sidebar">
        <div className="learn-sidebar__label">Уроки</div>

        {LESSONS.map(l => (
          <button
            key={l.slug}
            className={`learn-sidebar__btn ${activeLesson === l.slug ? 'is-active' : ''}`}
            onClick={() => goToLesson(l.slug)}
            style={{
              borderLeftColor: activeLesson === l.slug ? l.color : 'transparent',
              background: activeLesson === l.slug ? `${l.color}18` : 'transparent',
              color: activeLesson === l.slug ? '#fff' : undefined,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{l.emoji}</span>
            <span>{l.title}</span>
          </button>
        ))}

        <div className="learn-sidebar__bottom">
          <a
            href="https://your-randomlab-url.com"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-sidebar__experiments-btn"
          >
            🎲 Открыть эксперименты
          </a>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="learn-main">
        {!lesson ? (

          /* ===== Список всех уроков ===== */
          <div>
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: '#fff',
                margin: '0 0 12px',
                fontWeight: 800,
              }}>
                Все уроки 📚
              </h1>
              <p style={{
                fontFamily: 'Mulish, sans-serif',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '1rem',
                margin: 0,
              }}>
                Выбери урок и начни учиться
              </p>
            </div>
            <LessonsSection />
          </div>

        ) : (

          /* ===== Контент урока ===== */
          <>
            {/* Хлебные крошки */}
            <div className="breadcrumb">
              <span className="breadcrumb__link" onClick={() => navigate('/')}>Главная</span>
              <span>›</span>
              <span className="breadcrumb__link" onClick={goToAll}>Уроки</span>
              <span>›</span>
              <span style={{ color: lesson.color }}>{lesson.title}</span>
            </div>

            {/* Заголовок урока */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{lesson.emoji}</div>
              <div style={{
                width: '48px', height: '5px',
                borderRadius: '3px',
                background: lesson.color,
                marginBottom: '20px',
              }} />
              <h1 style={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                color: '#fff',
                margin: 0,
                fontWeight: 800,
                lineHeight: 1.2,
              }}>
                {lesson.title}
              </h1>
            </div>

            {/* Секции урока */}
            {lesson.sections.map((section, i) => (
              <div
                key={i}
                className={section.isCallout ? 'lesson-callout' : 'lesson-section'}
                style={section.isCallout ? {
                  borderColor: lesson.color,
                  background: `${lesson.color}0d`,
                } : undefined}
              >
                <h2
                  className="lesson-section__heading"
                  style={{ color: section.isCallout ? lesson.color : '#fff' }}
                >
                  {section.heading}
                </h2>
                {section.body.split('\n').map((line, j) =>
                  line.trim() === '' ? (
                    <br key={j} />
                  ) : (
                    <p key={j} className="lesson-section__text">{line}</p>
                  )
                )}
              </div>
            ))}

            {/* Навигация между уроками */}
            <div className="lesson-nav">
              {LESSONS.indexOf(lesson) > 0 && (
                <button
                  className="lesson-nav__btn"
                  onClick={() => goToLesson(LESSONS[LESSONS.indexOf(lesson) - 1].slug)}
                >
                  ← Предыдущий урок
                </button>
              )}
              {LESSONS.indexOf(lesson) < LESSONS.length - 1 && (
                <button
                  className="lesson-nav__btn lesson-nav__btn--next"
                  onClick={() => goToLesson(LESSONS[LESSONS.indexOf(lesson) + 1].slug)}
                  style={{ background: lesson.color }}
                >
                  Следующий урок →
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LearnPage;