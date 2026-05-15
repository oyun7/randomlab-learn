import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REGULAR_TASKS, type Task, type TaskLevel } from '../data/tasks';
import { LESSONS } from '../data/lessons';

const LEVEL_COLORS: Record<TaskLevel, string> = {
  'ОГЭ': '#4ade80',
  'ЕГЭ базовый': '#38bdf8',
  'ЕГЭ профильный': '#a78bfa',
  'ЕГЭ повышенный': '#f472b6',
  'Симулятор': '#fb923c',
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const color = LEVEL_COLORS[task.level];
  const lesson = LESSONS.find(l => l.slug === task.lessonSlug);

  return (
    <div className="task-item">
      <button className="task-item__header" onClick={() => setOpen(!open)}>
        <span className="task-item__badge" style={{ background: `${color}22`, color }}>
          {task.level}
        </span>
        <span className="task-item__num">Задание {task.id}</span>
        {lesson && (
          <span className="task-item__lesson-tag" style={{ color: lesson.color }}>
            {lesson.emoji} {lesson.title}
          </span>
        )}
        <span className="task-item__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="task-item__body">
          <p className="task-item__text">{task.text}</p>

          {!showSolution ? (
            <button
              className="task-item__solution-btn"
              onClick={() => setShowSolution(true)}
            >
              Показать решение
            </button>
          ) : (
            <div className="task-item__solution">
              <div className="task-item__solution-label">Решение</div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{task.solution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<TaskLevel | 'Все'>('Все');
  const [selectedLesson, setSelectedLesson] = useState<string>('Все');

  // Фильтрация задач
  const filteredTasks = REGULAR_TASKS.filter(task => {
    const levelMatch = selectedLevel === 'Все' || task.level === selectedLevel;
    const lessonMatch = selectedLesson === 'Все' || task.lessonSlug === selectedLesson;
    return levelMatch && lessonMatch;
  });

  // Уникальные уроки из задач
  const lessonsWithTasks = Array.from(new Set(REGULAR_TASKS.map(t => t.lessonSlug)))
    .map(slug => LESSONS.find(l => l.slug === slug))
    .filter(Boolean);

  // Группировка по уровням
  const tasksByLevel = {
    'ОГЭ': filteredTasks.filter(t => t.level === 'ОГЭ'),
    'ЕГЭ базовый': filteredTasks.filter(t => t.level === 'ЕГЭ базовый'),
    'ЕГЭ профильный': filteredTasks.filter(t => t.level === 'ЕГЭ профильный'),
    'ЕГЭ повышенный': filteredTasks.filter(t => t.level === 'ЕГЭ повышенный'),
  };

  return (
    <div className="tasks-page">
      <div className="tasks-page__container">
        {/* Хлебные крошки */}
        <div className="breadcrumb">
          <span className="breadcrumb__link" onClick={() => navigate('/')}>Главная</span>
          <span>›</span>
          <span style={{ color: '#fb923c' }}>Дополнительные задачи</span>
        </div>

        {/* Заголовок */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <div style={{
            width: '48px',
            height: '5px',
            borderRadius: '3px',
            background: '#fb923c',
            marginBottom: '20px',
          }} />
          <h1 style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            color: '#fff',
            margin: '0 0 16px',
            fontWeight: 800,
            lineHeight: 1.2,
          }}>
            Дополнительные задачи
          </h1>
          <p style={{
            fontFamily: 'Mulish, sans-serif',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.1rem',
            margin: 0,
            maxWidth: '700px',
          }}>
            Сборник задач для самостоятельной работы по всем темам курса.
            Всего {REGULAR_TASKS.length} задач разного уровня сложности.
          </p>
        </div>

        {/* Фильтры */}
        <div className="tasks-filters">
          <div className="tasks-filters__group">
            <label className="tasks-filters__label">Уровень сложности:</label>
            <div className="tasks-filters__buttons">
              <button
                className={`tasks-filters__btn ${selectedLevel === 'Все' ? 'is-active' : ''}`}
                onClick={() => setSelectedLevel('Все')}
              >
                Все ({REGULAR_TASKS.length})
              </button>
              {(['ОГЭ', 'ЕГЭ базовый', 'ЕГЭ профильный', 'ЕГЭ повышенный'] as TaskLevel[]).map(level => {
                const count = REGULAR_TASKS.filter(t => t.level === level).length;
                return (
                  <button
                    key={level}
                    className={`tasks-filters__btn ${selectedLevel === level ? 'is-active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                    style={{
                      borderColor: selectedLevel === level ? LEVEL_COLORS[level] : undefined,
                      background: selectedLevel === level ? `${LEVEL_COLORS[level]}22` : undefined,
                      color: selectedLevel === level ? LEVEL_COLORS[level] : undefined,
                    }}
                  >
                    {level} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tasks-filters__group">
            <label className="tasks-filters__label">Тема урока:</label>
            <div className="tasks-filters__buttons">
              <button
                className={`tasks-filters__btn ${selectedLesson === 'Все' ? 'is-active' : ''}`}
                onClick={() => setSelectedLesson('Все')}
              >
                Все темы
              </button>
              {lessonsWithTasks.map(lesson => {
                if (!lesson) return null;
                const count = REGULAR_TASKS.filter(t => t.lessonSlug === lesson.slug).length;
                return (
                  <button
                    key={lesson.slug}
                    className={`tasks-filters__btn ${selectedLesson === lesson.slug ? 'is-active' : ''}`}
                    onClick={() => setSelectedLesson(lesson.slug)}
                    style={{
                      borderColor: selectedLesson === lesson.slug ? lesson.color : undefined,
                      background: selectedLesson === lesson.slug ? `${lesson.color}22` : undefined,
                      color: selectedLesson === lesson.slug ? lesson.color : undefined,
                    }}
                  >
                    {lesson.emoji} {lesson.title} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="tasks-stats">
          <div className="tasks-stats__item">
            <div className="tasks-stats__number">{filteredTasks.length}</div>
            <div className="tasks-stats__label">
              {selectedLevel === 'Все' && selectedLesson === 'Все'
                ? 'Всего задач'
                : 'Найдено задач'}
            </div>
          </div>
          {Object.entries(tasksByLevel).map(([level, tasks]) => {
            if (tasks.length === 0) return null;
            return (
              <div key={level} className="tasks-stats__item">
                <div
                  className="tasks-stats__number"
                  style={{ color: LEVEL_COLORS[level as TaskLevel] }}
                >
                  {tasks.length}
                </div>
                <div className="tasks-stats__label">{level}</div>
              </div>
            );
          })}
        </div>

        {/* Список задач */}
        {filteredTasks.length === 0 ? (
          <div style={{
            padding: '64px 32px',
            background: '#1f293720',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#94a3b8',
            textAlign: 'center',
            fontSize: '1.1rem',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            Задачи с такими фильтрами не найдены
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Кнопка назад */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button
            className="lesson-nav__btn"
            onClick={() => navigate('/learn')}
            style={{ margin: '0 auto' }}
          >
            ← Вернуться к урокам
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
