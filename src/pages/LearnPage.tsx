import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonsSection from '../components/LessonsSection';
import MathText from '../components/MathText';
import {
  LESSON_GROUPS,
  getLessonBySlug,
  getPrevLesson,
  getNextLesson,
} from '../data/lessons';
import {
  REGULAR_TASKS,
  getLessonSimTasks,
  type RegularTask,
  type LessonSimTask,
} from '../data/tasks';

// ─── Маппинг: категория задачи → slug урока ───────────────
// Задачи «Адаптировано под симулятор» показываются на уроке,
// соответствующем их категории.

const CATEGORY_TO_LESSON_SLUG: Record<string, string[]> = {
  'classical':              ['randomness-intro', 'sample-space', 'combinatorics', 'classical-probability'],
  'addition-multiplication': ['classical-probability', 'simulation'],
  'repeated-trials':        ['simulation'],
  'statistics':             ['data-processing'],
  'applied':                ['final-research'],
};

/** Симуляторные задачи из REGULAR_TASKS, привязанные к данному уроку */
function getAdaptedSimTasks(lessonSlug: string): RegularTask[] {
  const matchingCategories = Object.entries(CATEGORY_TO_LESSON_SLUG)
    .filter(([, slugs]) => slugs.includes(lessonSlug))
    .map(([cat]) => cat);

  return REGULAR_TASKS.filter(
    t => t.isSimulator && matchingCategories.includes(t.category)
  );
}

// ─── Компонент одной адаптированной задачи ────────────────

function formatTaskLabel(task: RegularTask): string {
  const levelMap: Record<string, string> = {
    'ОГЭ': 'ОГЭ',
    'ЕГЭ, базовый уровень': 'ЕГЭ базовый уровень',
    'ЕГЭ, профильный уровень': 'ЕГЭ профильный уровень',
    'ЕГЭ, повышенная сложность': 'ЕГЭ повышенная сложность',
    'Адаптировано под симулятор': 'адаптировано под симулятор',
  };
  return `Задача ${task.id} (${levelMap[task.level] ?? task.level})`;
}

const AdaptedSimTaskItem: React.FC<{ task: RegularTask }> = ({ task }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderRadius: '14px',
      border: '1px solid rgba(251,146,60,0.25)',
      background: 'rgba(251,146,60,0.05)',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 18px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🔬</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: 700,
            fontSize: '0.82rem',
            color: '#fb923c',
            marginBottom: '2px',
          }}>
            {formatTaskLabel(task)}
          </div>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
          flexShrink: 0,
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '0 18px 18px' }}>
          <p style={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.65,
            marginBottom: '14px',
            whiteSpace: 'pre-wrap',
          }}>
            {task.text}
          </p>

          {task.simulatorHint && (
            <div style={{
              background: 'rgba(251,146,60,0.1)',
              border: '1px solid rgba(251,146,60,0.3)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '14px',
            }}>
              <div style={{
                fontFamily: 'Mulish, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#fb923c',
                marginBottom: '6px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
              }}>
                💡 Подсказка для симулятора
              </div>
              <p style={{
                fontFamily: 'Mulish, sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.55,
                margin: 0,
              }}>
                {task.simulatorHint}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

// ─── Блок адаптированных задач (перед LESSON_SIM_TASKS) ───

const AdaptedSimTasksBlock: React.FC<{ slug: string; color: string }> = ({ slug, color }) => {
  const [expanded, setExpanded] = useState(true);
  const tasks = getAdaptedSimTasks(slug);

  if (tasks.length === 0) return null;

  return (
    <div style={{ margin: '40px 0 0' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          background: 'rgba(251,146,60,0.08)',
          border: '1px solid rgba(251,146,60,0.3)',
          borderRadius: '14px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: expanded ? '16px' : 0,
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🔬</span>
        <span style={{
          fontFamily: 'Unbounded, sans-serif',
          fontWeight: 700,
          fontSize: '0.88rem',
          color: '#fb923c',
        }}>
          Задачи, адаптированные под симулятор
        </span>
        <span style={{
          background: 'rgba(251,146,60,0.2)',
          color: '#fb923c',
          borderRadius: '8px',
          padding: '2px 10px',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'Mulish, sans-serif',
        }}>
          {tasks.length}
        </span>
        <span style={{
          marginLeft: 'auto',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▼</span>
      </button>

      {expanded && tasks.map(task => (
        <AdaptedSimTaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

// ─── Компонент одной задачи из LESSON_SIM_TASKS ──────────

const LessonSimTaskItem: React.FC<{ task: LessonSimTask; color: string }> = ({ task, color }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderRadius: '14px',
      border: '1px solid rgba(251,146,60,0.25)',
      background: 'rgba(251,146,60,0.05)',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 18px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🔬</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: 700,
            fontSize: '0.82rem',
            color: '#fb923c',
            marginBottom: '3px',
          }}>
            {task.title}
          </div>
          <div style={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {task.lessonLabel}
          </div>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
          flexShrink: 0,
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '0 18px 18px' }}>
          <p style={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.65,
            marginBottom: '14px',
            whiteSpace: 'pre-wrap',
          }}>
            {task.text}
          </p>

          <div style={{
            background: 'rgba(251,146,60,0.1)',
            border: '1px solid rgba(251,146,60,0.3)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '14px',
          }}>
            <div style={{
              fontFamily: 'Mulish, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#fb923c',
              marginBottom: '6px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
            }}>
              💡 Подсказка
            </div>
            <p style={{
              fontFamily: 'Mulish, sans-serif',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.55,
              margin: 0,
            }}>
              {task.hint}
            </p>
          </div>

          <a
            href={task.simulatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'rgba(251,146,60,0.15)',
              border: '1px solid rgba(251,146,60,0.4)',
              borderRadius: '10px',
              color: '#fb923c',
              fontFamily: 'Mulish, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              marginBottom: '14px',
            }}
          >
            🎲 Открыть симулятор
          </a>

        </div>
      )}
    </div>
  );
};

// ─── Блок LESSON_SIM_TASKS ────────────────────────────────

const LessonSimTasksBlock: React.FC<{ slug: string; color: string }> = ({ slug, color }) => {
  const [expanded, setExpanded] = useState(true);
  const tasks = getLessonSimTasks(slug);

  if (tasks.length === 0) return null;

  return (
    <div style={{ margin: '16px 0 0' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          background: 'rgba(251,146,60,0.08)',
          border: '1px solid rgba(251,146,60,0.3)',
          borderRadius: '14px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: expanded ? '16px' : 0,
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🎲</span>
        <span style={{
          fontFamily: 'Unbounded, sans-serif',
          fontWeight: 700,
          fontSize: '0.88rem',
          color: '#fb923c',
        }}>
          Задания для симулятора
        </span>
        <span style={{
          background: 'rgba(251,146,60,0.2)',
          color: '#fb923c',
          borderRadius: '8px',
          padding: '2px 10px',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'Mulish, sans-serif',
        }}>
          {tasks.length}
        </span>
        <span style={{
          marginLeft: 'auto',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.8rem',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▼</span>
      </button>

      {expanded && tasks.map(task => (
        <LessonSimTaskItem key={task.id} task={task} color={color} />
      ))}
    </div>
  );
};

// ─── LearnPage ────────────────────────────────────────────

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

            {/* 1. Секции урока */}
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
                <MathText text={section.body} className="lesson-section__text" />
              </div>
            ))}

            {/*
              2. Задачи «Адаптировано под симулятор» из REGULAR_TASKS
                 Привязка по категории → slug урока (CATEGORY_TO_LESSON_SLUG)
            */}
            

            {/*
              3. Симуляторные задачи из LESSON_SIM_TASKS
                 Привязка по lessonSlug
            */}
            <LessonSimTasksBlock slug={lesson.slug} color={lesson.color} />

            {/* 5. Навигация между уроками */}
            <div className="lesson-nav">
              {getPrevLesson(lesson) && (
                <button
                  className="lesson-nav__btn"
                  onClick={() => goToLesson(getPrevLesson(lesson)!.slug)}
                >
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