import { useCallback, useEffect, useState, type FormEvent, type CSSProperties } from 'react';
import { erpApi } from '../api/erpApi';
import { ApiError } from '../api/apiError';
import type { Person, PersonType } from '../types/erp';

const TABS: { id: PersonType; label: string; description: string }[] = [
  { id: 'customer', label: 'Customers', description: 'Manage customer relationships' },
  { id: 'staff', label: 'Staff', description: 'Manage your team' },
  { id: 'supplier', label: 'Suppliers', description: 'Manage your suppliers' },
];

const EMPTY_FORM = { name: '', details: '', email: '', phone: '' };

const COLORS = {
  primary: '#5146e5',
  primaryDark: '#4035c8',
  primarySoft: '#f0efff',
  ink: '#201d35',
  muted: '#858098',
  border: '#ebe8f5',
  background: '#faf9ff',
  white: '#ffffff',
  danger: '#dc425c',
  dangerSoft: '#fff0f2',
  mint: '#e1f8ec',
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: 'clamp(18px, 4vw, 42px)',
    background: COLORS.background,
    color: COLORS.ink,
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: 'border-box' as const,
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '24px',
    color: COLORS.muted,
    fontSize: '12px',
    fontWeight: 600,
  },
  breadcrumbCurrent: { color: COLORS.primary, fontWeight: 800 },
  heading: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  title: {
    fontSize: 'clamp(27px, 4vw, 36px)',
    lineHeight: 1.2,
    letterSpacing: '-1.2px',
    fontWeight: 800,
    margin: '0 0 10px',
  },
  subtitle: {
    margin: 0,
    color: COLORS.muted,
    fontSize: '14px',
    lineHeight: 1.7,
  },
  primaryButton: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '9px',
    minHeight: '46px',
    padding: '0 19px',
    border: '1px solid transparent',
    borderRadius: '13px',
    background: COLORS.primary,
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(81, 70, 229, 0.19)',
    transition: 'background 160ms ease, transform 160ms ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
    gap: '15px',
    marginBottom: '28px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
    padding: '20px',
    background: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '19px',
    boxShadow: '0 4px 18px rgba(48, 39, 99, 0.025)',
  },
  statIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '45px',
    height: '45px',
    flexShrink: 0,
    borderRadius: '14px',
    background: COLORS.primarySoft,
    color: COLORS.primary,
  },
  statLabel: {
    margin: '0 0 6px',
    color: COLORS.muted,
    fontSize: '12px',
    fontWeight: 600,
  },
  statValue: {
    margin: 0,
    color: COLORS.ink,
    fontSize: '23px',
    lineHeight: 1.2,
    fontWeight: 800,
  },
  panel: {
    overflow: 'hidden',
    background: COLORS.white,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '22px',
    boxShadow: '0 7px 25px rgba(48, 39, 99, 0.035)',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    overflowX: 'auto' as const,
    borderBottom: `1px solid ${COLORS.border}`,
    background: '#fdfcff',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    flex: '1 0 auto',
    minHeight: '44px',
    padding: '0 17px',
    border: '1px solid transparent',
    borderRadius: '12px',
    background: 'transparent',
    color: COLORS.muted,
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 160ms ease',
  },
  tabActive: {
    background: COLORS.primarySoft,
    color: COLORS.primary,
    borderColor: '#e2ddff',
  },
  tabCount: {
    display: 'grid',
    placeItems: 'center',
    minWidth: '23px',
    height: '23px',
    padding: '0 5px',
    boxSizing: 'border-box' as const,
    borderRadius: '7px',
    background: '#ffffff',
    fontSize: '11px',
    fontWeight: 800,
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    padding: '22px 24px',
  },
  toolbarTitle: {
    margin: '0 0 5px',
    fontSize: '16px',
    fontWeight: 800,
    letterSpacing: '-0.3px',
  },
  toolbarSubtitle: {
    margin: 0,
    fontSize: '12px',
    lineHeight: 1.6,
    color: COLORS.muted,
  },
  searchWrap: {
    position: 'relative' as const,
    width: 'min(100%, 310px)',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '13px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9993ae',
    pointerEvents: 'none' as const,
  },
  search: {
    width: '100%',
    height: '43px',
    boxSizing: 'border-box' as const,
    padding: '0 14px 0 40px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    background: '#fdfcff',
    color: COLORS.ink,
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '13px',
  },
  tableWrap: {
    width: '100%',
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
  },
  th: {
    padding: '14px 22px',
    background: '#faf9fe',
    borderTop: `1px solid ${COLORS.border}`,
    borderBottom: `1px solid ${COLORS.border}`,
    color: '#8d87a3',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  td: {
    padding: '17px 22px',
    borderBottom: '1px solid #f2eff8',
    color: '#625d77',
    fontSize: '13px',
    verticalAlign: 'middle' as const,
  },
  personName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: COLORS.ink,
    fontWeight: 750,
  },
  avatar: {
    display: 'grid',
    placeItems: 'center',
    width: '38px',
    height: '38px',
    flexShrink: 0,
    borderRadius: '12px',
    background: COLORS.primarySoft,
    color: COLORS.primary,
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
  },
  personSubtext: {
    marginTop: '4px',
    color: '#a09ab3',
    fontSize: '11px',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    minHeight: '34px',
    padding: '0 11px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '9px',
    background: '#ffffff',
    color: '#615a7b',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 750,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  deleteButton: {
    color: COLORS.danger,
    borderColor: '#ffe0e5',
    background: '#fffafb',
  },
  empty: {
    padding: '65px 24px',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '62px',
    height: '62px',
    margin: '0 auto 17px',
    borderRadius: '20px',
    background: COLORS.primarySoft,
    color: COLORS.primary,
  },
  emptyTitle: {
    margin: '0 0 8px',
    fontSize: '17px',
    fontWeight: 800,
  },
  emptyText: {
    margin: '0 auto 20px',
    maxWidth: '380px',
    color: COLORS.muted,
    fontSize: '13px',
    lineHeight: 1.8,
  },
  alert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '11px',
    marginBottom: '20px',
    padding: '15px 17px',
    border: '1px solid #ffd6dd',
    borderRadius: '13px',
    background: COLORS.dangerSoft,
    color: '#b82f49',
    fontSize: '13px',
    lineHeight: 1.6,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    minHeight: '250px',
    color: COLORS.muted,
    fontSize: '13px',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    gap: '10px',
    padding: '20px 2px 4px',
    color: '#9993ad',
    fontSize: '11px',
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(30, 24, 60, 0.42)',
    backdropFilter: 'blur(7px)',
    WebkitBackdropFilter: 'blur(7px)',
  },
  modal: {
    width: '100%',
    maxWidth: '510px',
    maxHeight: 'min(90vh, 800px)',
    overflowY: 'auto' as const,
    background: '#ffffff',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '24px',
    boxShadow: '0 28px 90px rgba(28, 20, 71, 0.25)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '25px 27px',
    borderBottom: `1px solid ${COLORS.border}`,
    background: 'linear-gradient(120deg, #ffffff, #f8f6ff)',
  },
  modalTitle: {
    margin: '0 0 6px',
    fontSize: '21px',
    letterSpacing: '-0.6px',
    fontWeight: 800,
  },
  modalSubtitle: {
    margin: 0,
    color: COLORS.muted,
    fontSize: '12px',
    lineHeight: 1.7,
  },
  closeButton: {
    display: 'grid',
    placeItems: 'center',
    width: '36px',
    height: '36px',
    flexShrink: 0,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '11px',
    background: '#ffffff',
    color: '#77718d',
    fontSize: '22px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '19px',
    padding: '25px 27px 27px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    color: '#45405d',
    fontSize: '12px',
    fontWeight: 800,
  },
  input: {
    width: '100%',
    minHeight: '45px',
    boxSizing: 'border-box' as const,
    padding: '11px 13px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '11px',
    outline: 'none',
    background: '#fdfcff',
    color: COLORS.ink,
    fontFamily: 'inherit',
    fontSize: '13px',
    lineHeight: 1.5,
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  },
  textarea: {
    minHeight: '95px',
    resize: 'vertical' as const,
  },
  fieldHint: {
    color: '#a09ab3',
    fontSize: '11px',
    lineHeight: 1.6,
  },
  modalActions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '5px',
    paddingTop: '19px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  cancelButton: {
    minHeight: '44px',
    padding: '0 17px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '11px',
    background: '#ffffff',
    color: '#716b87',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 750,
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'users':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.45 2.74a2 2 0 0 1-.57 1.69L7.7 9.44a16 16 0 0 0 6 6l1.29-1.29a2 2 0 0 1 1.69-.57l2.74.45a2 2 0 0 1 1.58 2.89Z" />
        </svg>
      );
    case 'building':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
          <path d="M9 9v.01M9 13v.01M9 17v.01M16 13v.01M16 17v.01" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
      );
  }
}

function getPersonLabel(type: PersonType) {
  return TABS.find((tab) => tab.id === type)?.label ?? 'People';
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || '?';
}

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        <Icon name={icon} size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={styles.statLabel}>{label}</p>
        <p style={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

function PersonModal({
  personType,
  editing,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}: {
  personType: PersonType;
  editing: Person | null;
  form: typeof EMPTY_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const label = getPersonLabel(personType).replace(/s$/, '').toLowerCase();

  const updateField = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const fieldStyle = (multiline = false): CSSProperties => ({
    ...styles.input,
    ...(multiline ? styles.textarea : {}),
  });

  const focusInput = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.currentTarget.style.borderColor = COLORS.primary;
    event.currentTarget.style.boxShadow = '0 0 0 4px rgba(81, 70, 229, 0.10)';
    event.currentTarget.style.background = '#ffffff';
  };

  const blurInput = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.currentTarget.style.borderColor = COLORS.border;
    event.currentTarget.style.boxShadow = 'none';
    event.currentTarget.style.background = '#fdfcff';
  };

  return (
    <div
      style={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        style={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-modal-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !saving) onClose();
        }}
      >
        <header style={styles.modalHeader}>
          <div>
            <h2 id="person-modal-title" style={styles.modalTitle}>
              {editing ? `Edit ${label}` : `Add ${label}`}
            </h2>
            <p style={styles.modalSubtitle}>
              {editing
                ? 'Update the details for this record.'
                : `Enter the information to add a new ${label} to your company.`}
            </p>
          </div>
          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
          >
            <Icon name="close" size={19} />
          </button>
        </header>

        <form style={styles.form} onSubmit={onSubmit}>
          <div style={styles.field}>
            <label htmlFor="person-name" style={styles.label}>Full name *</label>
            <input
              id="person-name"
              style={fieldStyle()}
              required
              maxLength={150}
              autoFocus
              placeholder="Enter full name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="person-details" style={styles.label}>Details</label>
            <textarea
              id="person-details"
              style={fieldStyle(true)}
              maxLength={2000}
              rows={3}
              placeholder="Address, role, company notes, or other information"
              value={form.details}
              onChange={(event) => updateField('details', event.target.value)}
              onFocus={focusInput}
              onBlur={blurInput}
            />
            <span style={styles.fieldHint}>Optional information to help identify this record.</span>
          </div>

          <div style={styles.field}>
            <label htmlFor="person-email" style={styles.label}>Email address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '13px', left: '13px', color: '#9993ae', pointerEvents: 'none' }}>
                <Icon name="mail" size={17} />
              </span>
              <input
                id="person-email"
                style={{ ...fieldStyle(), paddingLeft: '40px' }}
                type="email"
                maxLength={254}
                placeholder="name@company.com"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label htmlFor="person-phone" style={styles.label}>Phone number</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '13px', left: '13px', color: '#9993ae', pointerEvents: 'none' }}>
                <Icon name="phone" size={17} />
              </span>
              <input
                id="person-phone"
                style={{ ...fieldStyle(), paddingLeft: '40px' }}
                type="tel"
                maxLength={40}
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>
          </div>

          <div style={styles.modalActions}>
            <button
              type="button"
              style={{
                ...styles.cancelButton,
                opacity: saving ? 0.6 : 1,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                minHeight: '44px',
                opacity: saving ? 0.7 : 1,
                cursor: saving ? 'wait' : 'pointer',
                boxShadow: 'none',
              }}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'peopleSpin 0.7s linear infinite',
                    }}
                  />
                  Saving…
                </>
              ) : (
                <>
                  <Icon name="plus" size={17} />
                  {editing ? 'Save changes' : 'Create record'}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function PeoplePage() {
  const [personType, setPersonType] = useState<PersonType>('customer');
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Person | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setPeople(await erpApi.listPeople(personType));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load people.'));
    } finally {
      setLoading(false);
    }
  }, [personType]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setIsCreating(true);
  };

  const openEdit = (person: Person) => {
    setIsCreating(false);
    setEditing(person);
    setError(null);
    setForm({
      name: person.name,
      details: person.details,
      email: person.email ?? '',
      phone: person.phone ?? '',
    });
  };

  const closeModal = () => {
    if (saving) return;
    setIsCreating(false);
    setEditing(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    const payload = {
      personType,
      name: form.name.trim(),
      details: form.details.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
    };

    try {
      if (editing) {
        await erpApi.updatePerson(editing.id, payload);
      } else {
        await erpApi.createPerson(payload);
      }

      setIsCreating(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save this record.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (person: Person) => {
    const confirmed = window.confirm(
      `Delete ${person.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError(null);

    try {
      await erpApi.deletePerson(person.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete this record.'));
    }
  };

  const visiblePeople = people.filter((person) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [
      person.name,
      person.details,
      person.email ?? '',
      person.phone ?? '',
    ].some((value) => value.toLowerCase().includes(query));
  });

  const modalOpen = isCreating || editing !== null;
  const currentLabel = getPersonLabel(personType);
  const singularLabel = currentLabel.replace(/s$/, '').toLowerCase();

  const focusSearch = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.style.borderColor = COLORS.primary;
    event.currentTarget.style.boxShadow = '0 0 0 4px rgba(81, 70, 229, 0.09)';
    event.currentTarget.style.background = '#ffffff';
  };

  const blurSearch = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.style.borderColor = COLORS.border;
    event.currentTarget.style.boxShadow = 'none';
    event.currentTarget.style.background = '#fdfcff';
  };

  return (
    <main style={styles.page}>
      <style>
        {`
          @keyframes peopleSpin {
            to { transform: rotate(360deg); }
          }
          .people-row:hover {
            background: #fcfbff;
          }
          .people-primary:hover:not(:disabled) {
            background: ${COLORS.primaryDark} !important;
            transform: translateY(-1px);
          }
          .people-secondary:hover:not(:disabled) {
            background: ${COLORS.primarySoft} !important;
            border-color: #d9d3ff !important;
            color: ${COLORS.primary} !important;
          }
          .people-delete:hover:not(:disabled) {
            background: ${COLORS.dangerSoft} !important;
            border-color: #ffcbd4 !important;
          }
          .people-tab:focus-visible,
          .people-primary:focus-visible,
          .people-secondary:focus-visible,
          .people-delete:focus-visible,
          .people-close:focus-visible,
          .people-cancel:focus-visible {
            outline: 3px solid rgba(81, 70, 229, 0.25);
            outline-offset: 3px;
          }
          @media (prefers-reduced-motion: reduce) {
            .people-primary, .people-secondary, .people-delete {
              transition: none !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Icon name="building" size={15} />
          <span>Workspace</span>
          <span aria-hidden="true">/</span>
          <span style={styles.breadcrumbCurrent}>People management</span>
        </div>

        <header style={styles.heading}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
              <span style={{ width: '8px', height: '8px', background: '#28b879', borderRadius: '50%' }} />
              <span style={{ color: COLORS.primary, fontSize: '11px', fontWeight: 800, letterSpacing: '1.4px' }}>
                PEOPLE & RELATIONSHIPS
              </span>
            </div>
            <h1 style={styles.title}>People management</h1>
            <p style={styles.subtitle}>
              Keep your customers, staff, and suppliers organized in one place.
            </p>
          </div>

          <button
            type="button"
            className="people-primary"
            style={styles.primaryButton}
            onClick={openCreate}
          >
            <Icon name="plus" size={19} />
            Add {singularLabel}
          </button>
        </header>

        <section style={styles.statsGrid} aria-label="People summary">
          <StatCard
            label="Current category"
            value={currentLabel}
            icon="users"
          />
          <StatCard
            label="Records in this category"
            value={loading ? '—' : String(people.length)}
            icon="building"
          />
          <StatCard
            label="Matching search"
            value={loading ? '—' : String(visiblePeople.length)}
            icon="search"
          />
        </section>

        {error && (
          <div style={styles.alert} role="alert">
            <Icon name="alert" size={19} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', marginBottom: '3px' }}>Something went wrong</strong>
              {error}
            </div>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError(null)}
              style={{
                border: 0,
                background: 'transparent',
                color: 'inherit',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0 3px',
              }}
            >
              ×
            </button>
          </div>
        )}

        <section style={styles.panel} aria-label={`${currentLabel} records`}>
          <div style={styles.tabs} role="tablist" aria-label="People categories">
            {TABS.map((tab) => {
              const active = personType === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="people-tab"
                  style={{
                    ...styles.tab,
                    ...(active ? styles.tabActive : {}),
                  }}
                  onClick={() => {
                    setPersonType(tab.id);
                    setSearch('');
                    setError(null);
                  }}
                >
                  {tab.label}
                  {active && <span style={styles.tabCount}>{loading ? '…' : people.length}</span>}
                </button>
              );
            })}
          </div>

          <div style={styles.toolbar}>
            <div>
              <h2 style={styles.toolbarTitle}>{currentLabel} directory</h2>
              <p style={styles.toolbarSubtitle}>
                {loading
                  ? 'Retrieving your company records…'
                  : `Showing ${visiblePeople.length} of ${people.length} ${people.length === 1 ? 'record' : 'records'}`}
              </p>
            </div>

            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>
                <Icon name="search" size={18} />
              </span>
              <input
                type="search"
                aria-label={`Search ${currentLabel.toLowerCase()}`}
                placeholder="Search names, email, phone…"
                style={styles.search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={focusSearch}
                onBlur={blurSearch}
              />
            </div>
          </div>

          {loading ? (
            <div style={styles.loading} role="status" aria-live="polite">
              <span
                aria-hidden="true"
                style={{
                  width: '29px',
                  height: '29px',
                  border: '3px solid #e8e4ff',
                  borderTopColor: COLORS.primary,
                  borderRadius: '50%',
                  animation: 'peopleSpin 0.8s linear infinite',
                }}
              />
              Loading your records…
            </div>
          ) : visiblePeople.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                <Icon name={search.trim() ? 'search' : 'users'} size={29} />
              </div>
              <h3 style={styles.emptyTitle}>
                {search.trim() ? 'No matching records' : `No ${currentLabel.toLowerCase()} yet`}
              </h3>
              <p style={styles.emptyText}>
                {search.trim()
                  ? 'Try a different name, email address, phone number, or keyword.'
                  : `Your ${currentLabel.toLowerCase()} directory is ready. Add your first record to get started.`}
              </p>
              {search.trim() ? (
                <button
                  type="button"
                  className="people-secondary"
                  style={styles.secondaryButton}
                  onClick={() => setSearch('')}
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  className="people-primary"
                  style={styles.primaryButton}
                  onClick={openCreate}
                >
                  <Icon name="plus" size={17} />
                  Add first {singularLabel}
                </button>
              )}
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Details</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePeople.map((person) => (
                    <tr key={person.id} className="people-row">
                      <td style={styles.td}>
                        <div style={styles.personName}>
                          <span style={styles.avatar}>{getInitials(person.name)}</span>
                          <span>
                            <span style={{ display: 'block' }}>{person.name}</span>
                            <span style={styles.personSubtext}>{singularLabel}</span>
                          </span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, whiteSpace: 'normal', minWidth: '160px', maxWidth: '260px', lineHeight: 1.7 }}>
                        {person.details || <span style={{ color: '#b0abc0' }}>Not provided</span>}
                      </td>
                      <td style={styles.td}>
                        {person.email ? (
                          <a
                            href={`mailto:${person.email}`}
                            style={{ color: COLORS.primary, textDecoration: 'none', fontWeight: 650 }}
                          >
                            {person.email}
                          </a>
                        ) : (
                          <span style={{ color: '#b0abc0' }}>—</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {person.phone ? (
                          <a
                            href={`tel:${person.phone}`}
                            style={{ color: '#625d77', textDecoration: 'none' }}
                          >
                            {person.phone}
                          </a>
                        ) : (
                          <span style={{ color: '#b0abc0' }}>—</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            type="button"
                            className="people-secondary"
                            style={styles.secondaryButton}
                            onClick={() => openEdit(person)}
                            aria-label={`Edit ${person.name}`}
                          >
                            <Icon name="edit" size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="people-secondary people-delete"
                            style={{ ...styles.secondaryButton, ...styles.deleteButton }}
                            onClick={() => void handleDelete(person)}
                            aria-label={`Delete ${person.name}`}
                          >
                            <Icon name="trash" size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && people.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '15px 22px',
                borderTop: `1px solid ${COLORS.border}`,
                color: '#9690a9',
                fontSize: '11px',
                background: '#fdfcff',
              }}
            >
              <span>Company records · {currentLabel}</span>
              <span>{visiblePeople.length} {visiblePeople.length === 1 ? 'result' : 'results'}</span>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          <span>UNIFLOW · PEOPLE MANAGEMENT</span>
          <span>Your workspace, your records.</span>
        </footer>
      </div>

      {modalOpen && (
        <PersonModal
          personType={personType}
          editing={editing}
          form={form}
          setForm={setForm}
          saving={saving}
          onClose={closeModal}
          onSubmit={(event) => void handleSubmit(event)}
        />
      )}
    </main>
  );
}
