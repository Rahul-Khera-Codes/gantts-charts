import { useEffect, useRef, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export const LEVELS = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;
export type Level = (typeof LEVELS)[number];

interface LevelSelectProps {
  value?: Level;
  onChange?: (level: Level) => void;
}

export default function LevelSelect({ value: externalValue, onChange: externalOnChange }: LevelSelectProps = {}) {
  const [open, setOpen] = useState(false);
  const [internalLevel, setInternalLevel] = useState<Level>('Daily');
  const ref = useRef<HTMLDivElement>(null);

  const level = externalValue ?? internalLevel;
  const setLevel = (l: Level) => {
    if (externalOnChange) externalOnChange(l);
    else setInternalLevel(l);
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className={`rv-level-select${open ? ' rv-level-select--open' : ''}`}
    >
      <span className="rv-level-label">Level</span>
      <button
        type="button"
        className="rv-level-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="rv-level-value">{level}</span>
        {open ? (
          <ArrowDropUpIcon className="rv-level-caret" fontSize="small" />
        ) : (
          <ArrowDropDownIcon className="rv-level-caret" fontSize="small" />
        )}
      </button>

      {open && (
        <ul role="listbox" className="rv-level-menu">
          {LEVELS.map((l) => (
            <li
              key={l}
              role="option"
              aria-selected={l === level}
              className={`rv-level-option${l === level ? ' rv-level-option--selected' : ''}`}
              onClick={() => {
                setLevel(l);
                setOpen(false);
              }}
            >
              {l}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
