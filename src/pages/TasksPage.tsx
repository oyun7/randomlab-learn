import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  REGULAR_TASKS,
  TASK_CATEGORIES,
  type RegularTask,
  type TaskLevel,
  type TaskCategoryKey,
  type TaskCategory,
} from '../data/tasks';

// ─── Уровни и цвета ───────────────────────────────────────

const ALL_LEVELS: TaskLevel[] = [
  'ОГЭ',
  'ЕГЭ, базовый уровень',
  'ЕГЭ, профильный уровень',
  'ЕГЭ, повышенная сложность',
  'Адаптировано под симулятор',
];

const LEVEL_COLORS: Record<TaskLevel, string> = {
  'ОГЭ': '#4ade80',
  'ЕГЭ, базовый уровень': '#38bdf8',
  'ЕГЭ, профильный уровень': '#a78bfa',
  'ЕГЭ, повышенная сложность': '#f472b6',
  'Адаптировано под симулятор': '#fb923c',
};

const LEVEL_SHORT: Record<TaskLevel, string> = {
  'ОГЭ': 'ОГЭ',
  'ЕГЭ, базовый уровень': 'ЕГЭ базовый',
  'ЕГЭ, профильный уровень': 'ЕГЭ профильный',
  'ЕГЭ, повышенная сложность': 'ЕГЭ повышенный',
  'Адаптировано под симулятор': 'Симулятор',
};

// ─── Метка задачи ─────────────────────────────────────────

function formatTaskLabel(task: RegularTask): string {
  const levelMap: Record<TaskLevel, string> = {
    'ОГЭ': 'ОГЭ',
    'ЕГЭ, базовый уровень': 'ЕГЭ базовый уровень',
    'ЕГЭ, профильный уровень': 'ЕГЭ профильный уровень',
    'ЕГЭ, повышенная сложность': 'ЕГЭ повышенная сложность',
    'Адаптировано под симулятор': 'адаптировано под симулятор',
  };
  return `Задание ${task.id} (${levelMap[task.level]})`;
}

// ─── TaskItem ─────────────────────────────────────────────

const TaskItem: React.FC<{ task: RegularTask }> = ({ task }) => {
  const [open, setOpen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const color = LEVEL_COLORS[task.level];
  const category = TASK_CATEGORIES.find(c => c.key === task.category);

  return (
    <div className="task-item">
      <button className="task-item__header" onClick={() => setOpen(!open)}>
        <span
          className="task-item__badge"
          style={{ background: `${color}22`, color, flexShrink: 0 }}
        >
          {LEVEL_SHORT[task.level]}
        </span>
        <span className="task-item__num" style={{ flex: 1, textAlign: 'left' }}>
          {formatTaskLabel(task)}
        </span>
        {category && (
          <span style={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '0.72rem',
            color: `${category.color}cc`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {category.emoji} {category.shortLabel}
          </span>
        )}
        {task.isSimulator && (
          <span className="task-item__sim-badge" style={{ flexShrink: 0 }}>🔬</span>
        )}
        <span className="task-item__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="task-item__body">
          <p className="task-item__text">{task.text}</p>

          {task.isSimulator && task.simulatorHint && (
            <div className="task-item__sim-hint">🔬 {task.simulatorHint}</div>
          )}

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

// ─── CategorySection — задачи одной категории ─────────────

const CategorySection: React.FC<{
  category: TaskCategory;
  tasks: RegularTask[];
}> = ({ category, tasks }) => {
  const [expanded, setExpanded] = useState(true);

  const regularTasks = tasks.filter(t => !t.isSimulator);
  const simTasks = tasks.filter(t => t.isSimulator);

  return (
    <div style={{
      marginBottom: '16px',
      borderRadius: '16px',
      border: `1px solid ${expanded ? category.color + '44' : 'rgba(255,255,255,0.08)'}`,
      background: expanded ? `${category.color}06` : 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Заголовок категории */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '18px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>
          {category.emoji}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: 700,
            fontSize: '0.88rem',
            color: expanded ? category.color : '#fff',
            marginBottom: '3px',
            transition: 'color 0.2s',
          }}>
            {category.label}
          </div>
          <div style={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '0.76rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.4,
          }}>
            {category.description}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{
            background: `${category.color}22`,
            color: category.color,
            borderRadius: '8px',
            padding: '2px 10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            fontFamily: 'Mulish, sans-serif',
          }}>
            {tasks.length}
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem',
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(180deg)' : 'none',
          }}>▼</span>
        </div>
      </button>

      {/* Задачи */}
      {expanded && (
        <div style={{ padding: '0 16px 16px' }}>
          {regularTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}

          {simTasks.length > 0 && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '12px 0 8px',
                padding: '8px 12px',
                background: 'rgba(251,146,60,0.08)',
                border: '1px solid rgba(251,146,60,0.2)',
                borderRadius: '10px',
              }}>
                <span>🔬</span>
                <span style={{
                  fontFamily: 'Mulish, sans-serif',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#fb923c',
                }}>
                  Адаптировано под симулятор
                </span>
                <span style={{
                  background: 'rgba(251,146,60,0.2)',
                  color: '#fb923c',
                  borderRadius: '6px',
                  padding: '1px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>
                  {simTasks.length}
                </span>
              </div>
              {simTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TasksPage ────────────────────────────────────────────

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<TaskLevel | 'Все'>('Все');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategoryKey | 'Все'>('Все');

  // Фильтрация
  const filteredTasks = REGULAR_TASKS.filter(task => {
    const levelOk = selectedLevel === 'Все' || task.level === selectedLevel;
    const catOk = selectedCategory === 'Все' || task.category === selectedCategory;
    return levelOk && catOk;
  });

  // Категории с задачами после фильтрации
  const categoriesToShow = TASK_CATEGORIES.filter(cat =>
    filteredTasks.some(t => t.category === cat.key)
  );

  // Статистика по уровням (из отфильтрованных)
  const statsByLevel = ALL_LEVELS.map(level => ({
    level,
    count: filteredTasks.filter(t => t.level === level).length,
  })).filter(s => s.count > 0);

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
            fontSize: '1.05rem',
            margin: 0,
            maxWidth: '700px',
            lineHeight: 1.6,
          }}>
            Сборник задач для самостоятельной работы по всем темам курса.
            Всего {REGULAR_TASKS.length} задач разного уровня сложности.
          </p>
        </div>

        {/* Фильтры */}
        <div className="tasks-filters">

          {/* Уровень сложности */}
          <div className="tasks-filters__group">
            <label className="tasks-filters__label">Уровень сложности:</label>
            <div className="tasks-filters__buttons">
              <button
                className={`tasks-filters__btn ${selectedLevel === 'Все' ? 'is-active' : ''}`}
                onClick={() => setSelectedLevel('Все')}
              >
                Все ({REGULAR_TASKS.length})
              </button>
              {ALL_LEVELS.map(level => {
                const count = REGULAR_TASKS.filter(t => t.level === level).length;
                const color = LEVEL_COLORS[level];
                const active = selectedLevel === level;
                return (
                  <button
                    key={level}
                    className={`tasks-filters__btn ${active ? 'is-active' : ''}`}
                    onClick={() => setSelectedLevel(active ? 'Все' : level)}
                    style={{
                      borderColor: active ? color : undefined,
                      background: active ? `${color}22` : undefined,
                      color: active ? color : undefined,
                    }}
                  >
                    {LEVEL_SHORT[level]} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Тема / категория */}
          <div className="tasks-filters__group">
            <label className="tasks-filters__label">Тема:</label>
            <div className="tasks-filters__buttons">
              <button
                className={`tasks-filters__btn ${selectedCategory === 'Все' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('Все')}
              >
                Все темы
              </button>
              {TASK_CATEGORIES.map(cat => {
                const count = REGULAR_TASKS.filter(t => t.category === cat.key).length;
                const active = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    className={`tasks-filters__btn ${active ? 'is-active' : ''}`}
                    onClick={() => setSelectedCategory(active ? 'Все' : cat.key)}
                    style={{
                      borderColor: active ? cat.color : undefined,
                      background: active ? `${cat.color}22` : undefined,
                      color: active ? cat.color : undefined,
                    }}
                  >
                    {cat.emoji} {cat.shortLabel} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="tasks-stats">
          <div className="tasks-stats__item">
            <div className="tasks-stats__number" style={{ color: '#fb923c' }}>
              {filteredTasks.length}
            </div>
            <div className="tasks-stats__label">
              {selectedLevel === 'Все' && selectedCategory === 'Все'
                ? 'Всего задач'
                : 'Найдено'}
            </div>
          </div>
          {statsByLevel.map(({ level, count }) => (
            <div key={level} className="tasks-stats__item">
              <div
                className="tasks-stats__number"
                style={{ color: LEVEL_COLORS[level] }}
              >
                {count}
              </div>
              <div className="tasks-stats__label">{LEVEL_SHORT[level]}</div>
            </div>
          ))}
        </div>

        {/* Список задач по категориям */}
        {filteredTasks.length === 0 ? (
          <div style={{
            padding: '64px 32px',
            background: 'rgba(255,255,255,0.03)',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#94a3b8',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontFamily: 'Mulish, sans-serif', fontSize: '1.05rem' }}>
              Задачи с такими фильтрами не найдены
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '8px' }}>
            {/* Если фильтр по уровню активен — плоский список без категорий */}
            {selectedLevel !== 'Все' ? (
              <div className="tasks-list">
                {filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
              /* Иначе — по категориям */
              categoriesToShow.map(category => (
                <CategorySection
                  key={category.key}
                  category={category}
                  tasks={filteredTasks.filter(t => t.category === category.key)}
                />
              ))
            )}
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