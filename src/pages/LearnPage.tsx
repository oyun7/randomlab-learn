import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonsSection from '../components/LessonsSection';
import {  LESSON_GROUPS, getLessonBySlug, getPrevLesson, getNextLesson } from '../data/lessons';

const LearnPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState<string>(slug || '');

  useEffect(() => {
    setActiveLesson(slug || '');
  }, [slug]);

  const lesson = getLessonBySlug(slug || '');

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

        {LESSON_GROUPS.map(group => (
          <div key={group.tag}>
            <div className="learn-sidebar__group-label">{group.tag}</div>
            {group.lessons.map(l => (
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
          </div>
        ))}

        <div className="learn-sidebar__bottom">
          <a
            href="https://randlab1.vercel.app/"
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
            <div className="breadcrumb">
              <span className="breadcrumb__link" onClick={() => navigate('/')}>Главная</span>
              <span>›</span>
              <span className="breadcrumb__link" onClick={goToAll}>Уроки</span>
              <span>›</span>
              <span style={{ color: lesson.color }}>{lesson.title}</span>
            </div>

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

            // Компонент TasksBlock отображает задания, связанные с текущим уроком
                    
            
            <div className="lesson-nav">
              {getPrevLesson(lesson) && (
                <button className="lesson-nav__btn" onClick={() => goToLesson(getPrevLesson(lesson)!.slug)}>
                  ← Предыдущий урок
                </button>
              )}
              {getNextLesson(lesson) && (
                <button
                  className="lesson-nav__btn lesson-nav__btn--next"
                  onClick={() => goToLesson(getNextLesson(lesson)!.slug)}
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
