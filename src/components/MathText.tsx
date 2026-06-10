import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

const KATEX_OPTS = {
  strict: false,
  throwOnError: false,
  output: 'html' as const,
};

function renderKatex(formula: string, displayMode: boolean): string {
  try {
    return katex.renderToString(formula, { ...KATEX_OPTS, displayMode });
  } catch {
    return formula;
  }
}

export const MathText: React.FC<MathTextProps> = ({ text, className }) => {
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (trimmed === '') {
          return <br key={lineIdx} />;
        }

        // Блочная формула $$...$$
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
          const formula = trimmed.slice(2, -2).trim();
          if (formula) {
            return (
              <div
                key={lineIdx}
                style={{ margin: '1em 0', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}
                dangerouslySetInnerHTML={{ __html: renderKatex(formula, true) }}
              />
            );
          }
        }

        // Строка с inline формулами
        return (
          <p key={lineIdx} className={className} style={{ margin: '0.5em 0' }}>
            {renderInlineFormulas(trimmed)}
          </p>
        );
      })}
    </>
  );
};

function renderInlineFormulas(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    const html = renderKatex(match[1], false);
    parts.push(
      <span key={`m-${match.index}`} dangerouslySetInnerHTML={{ __html: html }} />
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key="all">{text}</span>];
}

export default MathText;