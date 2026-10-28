
import { type ChangeEvent, useState } from 'react';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  autoComplete: 'current-password' | 'new-password';
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function PasswordInput({
  id,
  name,
  value,
  autoComplete,
  onChange,
  error,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="password-input">
      <input
        id={id}
        name={name}
        type={isVisible ? 'text' : 'password'}
        className={`input${error ? ' input--invalid' : ''}`}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
        title={isVisible ? 'Hide password' : 'Show password'}
      >
        {isVisible ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3L21 21"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M10.6 10.6a2 2 0 002.8 2.8"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M9.9 5.2A11 11 0 0112 5c5 0 8.5 4.5 9.5 7a12 12 0 01-2.3 3.3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.2 6.2C3.9 7.7 2.7 10 2.5 12c.6 1.5 3.8 7 9.5 7 1.3 0 2.5-.3 3.5-.8"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
