
import { useState } from 'react';
import { CheckEmailPanel } from '../components/CheckEmailPanel';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { APP_NAME } from '../config/env';
import '../styles/auth.css';

type AuthMode = 'login' | 'register';

const COPY: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: 'Welcome back.',
    subtitle: 'Your business, right where you left it.',
  },
  register: {
    title: 'Build your workspace.',
    subtitle: 'Create your company account and bring your operations together.',
  },
};

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const handleBackToSignIn = () => {
    setPendingEmail(null);
    setMode('login');
  };

  return (
    <div className="uf-auth">
      <section className="uf-showcase">
        <div className="uf-orb uf-orb--one" />
        <div className="uf-orb uf-orb--two" />

        <header className="uf-brand">
          <div className="uf-brand__symbol" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M10 12V23C10 29 14 32 20 32C26 32 30 29 30 23V12"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M10 12H17M23 12H30"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="20" cy="7" r="3" fill="#D8FF72" />
            </svg>
          </div>

          <span className="uf-brand__name">{APP_NAME}</span>
          <span className="uf-brand__edition">WORKSPACE</span>
        </header>

        <div className="uf-hero">
          <div className="uf-eyebrow">
            <span className="uf-status-dot" />
            YOUR BUSINESS, IN SYNC
          </div>

          <h1>
            Less chaos.
            <br />
            More <span>flow.</span>
          </h1>

          <p className="uf-hero__description">
            One workspace for your people, finances, inventory, and
            everything that keeps your business moving.
          </p>

          <div className="uf-benefits">
            <div className="uf-benefit">
              <span className="uf-benefit__icon">↗</span>
              <div>
                <strong>Everything connected</strong>
                <p>Your operations, working as one.</p>
              </div>
            </div>

            <div className="uf-benefit">
              <span className="uf-benefit__icon">◇</span>
              <div>
                <strong>Your own workspace</strong>
                <p>One dedicated space for every company.</p>
              </div>
            </div>

            <div className="uf-benefit">
              <span className="uf-benefit__icon">✳</span>
              <div>
                <strong>Built to grow</strong>
                <p>Ready for your next business milestone.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="uf-preview">
          <div className="uf-preview__top">
            <div>
              <span className="uf-preview__caption">WORKSPACE OVERVIEW</span>
              <h3>Your business at a glance</h3>
            </div>
            <span className="uf-preview__live">
              <span /> LIVE
            </span>
          </div>

          <div className="uf-preview__metrics">
            <div className="uf-metric">
              <span>Operations</span>
              <strong>Connected</strong>
              <div className="uf-progress">
                <span style={{ width: '84%' }} />
              </div>
            </div>

            <div className="uf-metric">
              <span>Team workspace</span>
              <strong>Organized</strong>
              <div className="uf-progress">
                <span style={{ width: '68%' }} />
              </div>
            </div>
          </div>

          <div className="uf-preview__bottom">
            <span className="uf-preview__sparkle">✳</span>
            <span>One platform. Every workflow.</span>
            <span className="uf-preview__arrow">↗</span>
          </div>
        </div>

        <footer className="uf-showcase__footer">
          <span>BUILT FOR BETTER BUSINESS</span>
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
        </footer>
      </section>

      <main className="uf-auth-main">
        <div className="uf-auth-topbar">
          <span className="uf-mobile-brand">
            <span className="uf-mobile-brand__dot" />
            {APP_NAME}
          </span>
          <span className="uf-topbar-note">
            {mode === 'login'
              ? 'NEW TO UNIFLOW?'
              : 'ALREADY HAVE AN ACCOUNT?'}
          </span>
          {!pendingEmail && (
            <button
              type="button"
              className="uf-topbar-link"
              onClick={() =>
                setMode((current) =>
                  current === 'login' ? 'register' : 'login',
                )
              }
            >
              {mode === 'login' ? 'Create account ↗' : 'Sign in ↗'}
            </button>
          )}
        </div>

        <div className="uf-auth-content">
          <div className="uf-auth-heading">
            <span className="uf-auth-kicker">
              {pendingEmail
                ? 'ONE LAST STEP'
                : mode === 'login'
                  ? 'YOUR WORKSPACE AWAITS'
                  : 'START SOMETHING GREAT'}
            </span>

            {!pendingEmail && (
              <>
                <h2>{COPY[mode].title}</h2>
                <p>{COPY[mode].subtitle}</p>
              </>
            )}
          </div>

          <div className="uf-auth-card">
            {pendingEmail ? (
              <CheckEmailPanel
                email={pendingEmail}
                onBackToSignIn={handleBackToSignIn}
              />
            ) : (
              <>
                <div
                  className="uf-tabs"
                  role="tablist"
                  aria-label="Authentication options"
                >
                  {(['login', 'register'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      id={`tab-${tab}`}
                      aria-selected={mode === tab}
                      aria-controls="auth-panel"
                      className={`uf-tabs__tab ${
                        mode === tab ? 'is-active' : ''
                      }`}
                      onClick={() => setMode(tab)}
                    >
                      {tab === 'login' ? 'Sign in' : 'Create workspace'}
                    </button>
                  ))}
                </div>

                <div
                  id="auth-panel"
                  role="tabpanel"
                  aria-labelledby={`tab-${mode}`}
                  className="uf-form-panel"
                >
                  {mode === 'login' ? (
                    <LoginForm />
                  ) : (
                    <RegisterForm onRegistered={setPendingEmail} />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="uf-security-note">
            <span className="uf-security-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3L20 6V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V6L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <strong>Your workspace, protected.</strong>
              <small>Secure access with email verification.</small>
            </span>
          </div>
        </div>

        <footer className="uf-auth-footer">
          <span>DESIGNED FOR THE WAY YOU WORK.</span>
          <span>UNIFLOW · BUSINESS MANAGEMENT</span>
        </footer>
      </main>
    </div>
  );
}
