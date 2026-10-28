import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';
import { erpApi } from '../api/erpApi';
import { ApiError } from '../api/apiError';
import type { Product } from '../types/erp';
import { formatMoney } from '../utils/money';

const EMPTY_FORM = {
  name: '',
  details: '',
  sellingPrice: '',
  buyingPrice: '',
  imageUrl: '',
};

const C = {
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
  green: '#168754',
  amber: '#b66a14',
};

const s = {
  page: {
    minHeight: '100vh',
    padding: 'clamp(18px, 4vw, 42px)',
    background: C.background,
    color: C.ink,
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '25px',
    color: C.muted,
    fontSize: '12px',
    fontWeight: 650,
  },
  heading: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '22px',
    marginBottom: '30px',
  },
  eyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    color: C.primary,
    fontSize: '11px',
    fontWeight: 850,
    letterSpacing: '1.4px',
    marginBottom: '12px',
  },
  title: {
    margin: '0 0 10px',
    fontSize: 'clamp(28px, 4vw, 38px)',
    fontWeight: 850,
    letterSpacing: '-1.4px',
    lineHeight: 1.2,
  },
  subtitle: {
    margin: 0,
    color: C.muted,
    fontSize: '14px',
    lineHeight: 1.8,
    maxWidth: '590px',
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
    background: C.primary,
    color: '#ffffff',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(81,70,229,0.18)',
    transition: 'background 160ms ease, transform 160ms ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
    gap: '15px',
    marginBottom: '29px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '20px',
    minWidth: 0,
    border: `1px solid ${C.border}`,
    borderRadius: '19px',
    background: C.white,
    boxShadow: '0 4px 18px rgba(48,39,99,0.025)',
  },
  statIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '46px',
    height: '46px',
    flexShrink: 0,
    borderRadius: '14px',
    background: C.primarySoft,
    color: C.primary,
  },
  statLabel: {
    margin: '0 0 6px',
    color: C.muted,
    fontSize: '12px',
    fontWeight: 650,
  },
  statValue: {
    margin: 0,
    color: C.ink,
    fontSize: '23px',
    fontWeight: 850,
    letterSpacing: '-0.5px',
    overflowWrap: 'anywhere',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '17px',
    padding: '23px 24px',
    borderBottom: `1px solid ${C.border}`,
  },
  toolbarTitle: {
    margin: '0 0 6px',
    fontSize: '17px',
    fontWeight: 850,
    letterSpacing: '-0.4px',
  },
  toolbarSubtitle: {
    margin: 0,
    color: C.muted,
    fontSize: '12px',
    lineHeight: 1.7,
  },
  searchWrap: {
    position: 'relative',
    width: 'min(100%, 310px)',
  },
  searchIcon: {
    position: 'absolute',
    left: '13px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9993ae',
    pointerEvents: 'none',
  },
  search: {
    width: '100%',
    height: '44px',
    boxSizing: 'border-box',
    padding: '0 14px 0 40px',
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    outline: 'none',
    background: '#fdfcff',
    color: C.ink,
    fontFamily: 'inherit',
    fontSize: '13px',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 265px), 1fr))',
    gap: '20px',
    padding: '23px',
  },
  productCard: {
    minWidth: 0,
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    borderRadius: '20px',
    background: '#ffffff',
    boxShadow: '0 4px 18px rgba(48,39,99,0.025)',
    transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
  },
  imageBox: {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    height: '210px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #f3f0ff 0%, #f9f8ff 55%, #e9faf3 100%)',
    borderBottom: `1px solid ${C.border}`,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    color: '#9c95bd',
    fontSize: '12px',
    fontWeight: 650,
  },
  imageBadge: {
    position: 'absolute',
    top: '13px',
    left: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 10px',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: '9px',
    background: 'rgba(255,255,255,0.91)',
    color: C.primary,
    fontSize: '10px',
    fontWeight: 850,
    backdropFilter: 'blur(8px)',
  },
  cardBody: {
    padding: '20px',
  },
  productName: {
    margin: '0 0 9px',
    fontSize: '17px',
    lineHeight: 1.45,
    fontWeight: 850,
    letterSpacing: '-0.4px',
    overflowWrap: 'anywhere',
  },
  productDetails: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '39px',
    margin: '0 0 19px',
    color: C.muted,
    fontSize: '12px',
    lineHeight: 1.7,
    overflowWrap: 'anywhere',
  },
  priceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
    marginBottom: '17px',
  },
  priceBox: {
    minWidth: 0,
    padding: '12px',
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    background: '#fdfcff',
  },
  priceLabel: {
    display: 'block',
    marginBottom: '7px',
    color: '#9690aa',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  priceValue: {
    display: 'block',
    color: C.ink,
    fontSize: '13px',
    fontWeight: 850,
    lineHeight: 1.5,
    overflowWrap: 'anywhere',
  },
  profitBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '12px 13px',
    marginBottom: '17px',
    borderRadius: '11px',
    background: C.mint,
    color: C.green,
    fontSize: '11px',
    fontWeight: 800,
  },
  cardActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '9px',
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    minHeight: '39px',
    padding: '0 10px',
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    background: '#ffffff',
    color: '#615a7b',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  deleteButton: {
    color: C.danger,
    borderColor: '#ffe0e5',
    background: '#fffafb',
  },
  panel: {
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    borderRadius: '22px',
    background: C.white,
    boxShadow: '0 7px 25px rgba(48,39,99,0.035)',
  },
  empty: {
    padding: '70px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '68px',
    height: '68px',
    margin: '0 auto 18px',
    borderRadius: '21px',
    background: C.primarySoft,
    color: C.primary,
  },
  emptyTitle: {
    margin: '0 0 9px',
    fontSize: '18px',
    fontWeight: 850,
  },
  emptyText: {
    maxWidth: '410px',
    margin: '0 auto 22px',
    color: C.muted,
    fontSize: '13px',
    lineHeight: 1.8,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    minHeight: '300px',
    color: C.muted,
    fontSize: '13px',
  },
  alert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '11px',
    padding: '15px 17px',
    marginBottom: '20px',
    border: '1px solid #ffd6dd',
    borderRadius: '13px',
    background: C.dangerSoft,
    color: '#b82f49',
    fontSize: '13px',
    lineHeight: 1.65,
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '20px 2px 4px',
    color: '#9993ad',
    fontSize: '11px',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(30,24,60,0.43)',
    backdropFilter: 'blur(7px)',
    WebkitBackdropFilter: 'blur(7px)',
  },
  modal: {
    width: '100%',
    maxWidth: '540px',
    maxHeight: 'min(90vh, 850px)',
    overflowY: 'auto',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '24px',
    background: '#ffffff',
    boxShadow: '0 28px 90px rgba(28,20,71,0.25)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '25px 27px',
    borderBottom: `1px solid ${C.border}`,
    background: 'linear-gradient(120deg, #ffffff, #f8f6ff)',
  },
  modalTitle: {
    margin: '0 0 7px',
    fontSize: '22px',
    fontWeight: 850,
    letterSpacing: '-0.7px',
  },
  modalSubtitle: {
    margin: 0,
    color: C.muted,
    fontSize: '12px',
    lineHeight: 1.7,
  },
  closeButton: {
    display: 'grid',
    placeItems: 'center',
    width: '36px',
    height: '36px',
    flexShrink: 0,
    border: `1px solid ${C.border}`,
    borderRadius: '11px',
    background: '#ffffff',
    color: '#77718d',
    fontSize: '22px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '19px',
    padding: '25px 27px 27px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
  },
  label: {
    color: '#45405d',
    fontSize: '12px',
    fontWeight: 800,
  },
  input: {
    width: '100%',
    minHeight: '45px',
    boxSizing: 'border-box',
    padding: '11px 13px',
    border: `1px solid ${C.border}`,
    borderRadius: '11px',
    outline: 'none',
    background: '#fdfcff',
    color: C.ink,
    fontFamily: 'inherit',
    fontSize: '13px',
    lineHeight: 1.5,
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  },
  textarea: {
    minHeight: '95px',
    resize: 'vertical',
  },
  hint: {
    color: '#9993ad',
    fontSize: '11px',
    lineHeight: 1.6,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
  },
  uploadBox: {
    padding: '14px',
    border: '1px dashed #d8d1f3',
    borderRadius: '12px',
    background: '#faf9ff',
  },
  modalActions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '4px',
    paddingTop: '19px',
    borderTop: `1px solid ${C.border}`,
  },
  cancelButton: {
    minHeight: '44px',
    padding: '0 17px',
    border: `1px solid ${C.border}`,
    borderRadius: '11px',
    background: '#ffffff',
    color: '#716b87',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 800,
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
    case 'box':
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 8 9 5 9-5M12 13v9M3 8v10l9 4 9-4V8" />
        </svg>
      );
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
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
    case 'image':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-5 5" />
        </svg>
      );
    case 'close':
      return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>;
    case 'alert':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
  }
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
    <div style={s.statCard}>
      <div style={s.statIcon}>
        <Icon name={icon} size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={s.statLabel}>{label}</p>
        <p style={s.statValue}>{value}</p>
      </div>
    </div>
  );
}

function ProductModal({
  editing,
  form,
  setForm,
  imageFile,
  setImageFile,
  saving,
  onClose,
  onSubmit,
}: {
  editing: Product | null;
  form: typeof EMPTY_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const focusInput = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.currentTarget.style.borderColor = C.primary;
    event.currentTarget.style.boxShadow = '0 0 0 4px rgba(81,70,229,0.10)';
    event.currentTarget.style.background = '#ffffff';
  };

  const blurInput = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.currentTarget.style.borderColor = C.border;
    event.currentTarget.style.boxShadow = 'none';
    event.currentTarget.style.background = '#fdfcff';
  };

  const updateField = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const inputStyle: CSSProperties = {
    ...s.input,
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageError(null);

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        setImageFile(null);
        event.target.value = '';
        setImageError('Choose a JPG, PNG, WebP, or GIF image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageFile(null);
        event.target.value = '';
        setImageError('The image must be 5 MB or smaller.');
        return;
      }
    }

    setImageFile(file);
  };

  const previewUrl = imagePreview || form.imageUrl.trim() || editing?.imageUrl || '';

  return (
    <div
      style={s.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        style={s.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !saving) onClose();
        }}
      >
        <header style={s.modalHeader}>
          <div>
            <h2 id="product-modal-title" style={s.modalTitle}>
              {editing ? 'Edit product' : 'Add a product'}
            </h2>
            <p style={s.modalSubtitle}>
              {editing
                ? 'Update the catalogue details and pricing.'
                : 'Add a new item to your company catalogue.'}
            </p>
          </div>
          <button
            type="button"
            className="products-close"
            style={s.closeButton}
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
          >
            <Icon name="close" size={19} />
          </button>
        </header>

        <form style={s.form} onSubmit={onSubmit}>
          <div style={s.field}>
            <label htmlFor="product-name" style={s.label}>Product name *</label>
            <input
              id="product-name"
              style={inputStyle}
              required
              maxLength={150}
              autoFocus
              placeholder="e.g. Premium cotton shirt"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div style={s.field}>
            <label htmlFor="product-details" style={s.label}>Product details</label>
            <textarea
              id="product-details"
              style={{ ...inputStyle, ...s.textarea }}
              maxLength={2000}
              rows={3}
              placeholder="Describe this product, its features, or specifications…"
              value={form.details}
              onChange={(event) => updateField('details', event.target.value)}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>

          <div style={s.formRow}>
            <div style={s.field}>
              <label htmlFor="selling-price" style={s.label}>Selling price *</label>
              <input
                id="selling-price"
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={form.sellingPrice}
                onChange={(event) => updateField('sellingPrice', event.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <span style={s.hint}>Price charged to customers</span>
            </div>

            <div style={s.field}>
              <label htmlFor="buying-price" style={s.label}>Buying price *</label>
              <input
                id="buying-price"
                style={inputStyle}
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={form.buyingPrice}
                onChange={(event) => updateField('buyingPrice', event.target.value)}
                onFocus={focusInput}
                onBlur={blurInput}
              />
              <span style={s.hint}>Cost to your business</span>
            </div>
          </div>

          <div style={s.field}>
            <label htmlFor="image-url" style={s.label}>Image URL</label>
            <input
              id="image-url"
              style={inputStyle}
              type="url"
              maxLength={2048}
              placeholder="https://example.com/product.jpg"
              value={form.imageUrl}
              onChange={(event) => updateField('imageUrl', event.target.value)}
              onFocus={focusInput}
              onBlur={blurInput}
            />
            <span style={s.hint}>Optional. Use a publicly accessible image URL.</span>
          </div>

          <div style={s.field}>
            <label htmlFor="image-file" style={s.label}>Or upload a product image</label>
            <div style={s.uploadBox}>
              <input
                id="image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: '#706a86',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                }}
              />
              <p style={{ ...s.hint, margin: '9px 0 0' }}>
                JPG, PNG, WebP, or GIF · Maximum 5 MB
              </p>
            </div>

            {imageError && (
              <p role="alert" style={{ margin: 0, color: C.danger, fontSize: '12px' }}>
                {imageError}
              </p>
            )}

            {previewUrl && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '13px',
                  padding: '12px',
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  background: '#fdfcff',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Product preview"
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '11px',
                    background: C.primarySoft,
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: '0 0 5px', fontSize: '12px', fontWeight: 800 }}>
                    Image preview
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: C.muted, overflowWrap: 'anywhere' }}>
                    {imageFile ? imageFile.name : 'Using the image URL'}
                  </p>
                </div>
                {imageFile && (
                  <button
                    type="button"
                    className="products-secondary"
                    style={s.secondaryButton}
                    onClick={() => {
                      setImageFile(null);
                      const input = document.getElementById('image-file') as HTMLInputElement | null;
                      if (input) input.value = '';
                    }}
                    disabled={saving}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={s.modalActions}>
            <button
              type="button"
              className="products-cancel"
              style={s.cancelButton}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="products-primary"
              style={{
                ...s.primaryButton,
                minHeight: '44px',
                boxShadow: 'none',
                opacity: saving ? 0.7 : 1,
                cursor: saving ? 'wait' : 'pointer',
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
                      animation: 'productsSpin 0.7s linear infinite',
                    }}
                  />
                  Saving…
                </>
              ) : (
                <>
                  <Icon name="plus" size={17} />
                  {editing ? 'Save changes' : 'Create product'}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setProducts(await erpApi.listProducts());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setError(null);
    setIsCreating(true);
  };

  const openEdit = (product: Product) => {
    setIsCreating(false);
    setEditing(product);
    setImageFile(null);
    setError(null);
    setForm({
      name: product.name,
      details: product.details,
      sellingPrice: String(product.sellingPrice),
      buyingPrice: String(product.buyingPrice),
      imageUrl: product.imageUrl ?? '',
    });
  };

  const closeModal = () => {
    if (saving) return;
    setIsCreating(false);
    setEditing(null);
    setImageFile(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const sellingPrice = Number(form.sellingPrice);
    const buyingPrice = Number(form.buyingPrice);

    if (
      !Number.isFinite(sellingPrice) ||
      !Number.isFinite(buyingPrice) ||
      sellingPrice < 0 ||
      buyingPrice < 0
    ) {
      setError('Enter valid, non-negative buying and selling prices.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      details: form.details.trim(),
      sellingPrice,
      buyingPrice,
      imageUrl: form.imageUrl.trim() || undefined,
    };

    try {
      const saved = editing
        ? await erpApi.updateProduct(editing.id, payload)
        : await erpApi.createProduct(payload);

      if (imageFile) {
        await erpApi.uploadProductImage(saved.id, imageFile);
      }

      setIsCreating(false);
      setEditing(null);
      setImageFile(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete ${product.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError(null);

    try {
      await erpApi.deleteProduct(product.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete this product.');
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.details,
        String(product.sellingPrice),
        String(product.buyingPrice),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, search]);

  const totalInventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.buyingPrice, 0),
    [products],
  );

  const totalPotentialProfit = useMemo(
    () => products.reduce(
      (sum, product) => sum + (product.sellingPrice - product.buyingPrice),
      0,
    ),
    [products],
  );

  const modalOpen = isCreating || editing !== null;

  const focusSearch = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.style.borderColor = C.primary;
    event.currentTarget.style.boxShadow = '0 0 0 4px rgba(81,70,229,0.09)';
    event.currentTarget.style.background = '#ffffff';
  };

  const blurSearch = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.style.borderColor = C.border;
    event.currentTarget.style.boxShadow = 'none';
    event.currentTarget.style.background = '#fdfcff';
  };

  return (
    <main style={s.page}>
      <style>
        {`
          @keyframes productsSpin {
            to { transform: rotate(360deg); }
          }
          .products-primary:hover:not(:disabled) {
            background: ${C.primaryDark} !important;
            transform: translateY(-1px);
          }
          .products-secondary:hover:not(:disabled) {
            background: ${C.primarySoft} !important;
            border-color: #d9d3ff !important;
            color: ${C.primary} !important;
          }
          .products-delete:hover:not(:disabled) {
            background: ${C.dangerSoft} !important;
            border-color: #ffcbd4 !important;
          }
          .products-close:focus-visible,
          .products-primary:focus-visible,
          .products-secondary:focus-visible,
          .products-cancel:focus-visible {
            outline: 3px solid rgba(81,70,229,0.25);
            outline-offset: 3px;
          }
          .products-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 35px rgba(48,39,99,0.09) !important;
            border-color: #d8d1ff !important;
          }
          .products-card-image {
            transition: transform 250ms ease;
          }
          .products-card:hover .products-card-image {
            transform: scale(1.035);
          }
          @media (max-width: 540px) {
            .products-form-row {
              grid-template-columns: minmax(0, 1fr) !important;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .products-primary,
            .products-secondary,
            .products-card,
            .products-card-image {
              transition: none !important;
            }
          }
        `}
      </style>

      <div style={s.container}>
        <div style={s.breadcrumb}>
          <Icon name="box" size={15} />
          <span>Workspace</span>
          <span aria-hidden="true">/</span>
          <span style={{ color: C.primary, fontWeight: 800 }}>Product management</span>
        </div>

        <header style={s.heading}>
          <div>
            <div style={s.eyebrow}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28b879' }} />
              CATALOGUE & INVENTORY
            </div>
            <h1 style={s.title}>Product management</h1>
            <p style={s.subtitle}>
              Manage your catalogue, monitor buying and selling prices, and keep product images organized.
            </p>
          </div>

          <button
            type="button"
            className="products-primary"
            style={s.primaryButton}
            onClick={openCreate}
          >
            <Icon name="plus" size={19} />
            Add product
          </button>
        </header>

        {error && (
          <div style={s.alert} role="alert">
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

        <section style={s.statsGrid} aria-label="Product summary">
          <StatCard
            label="Products in catalogue"
            value={loading ? '—' : String(products.length)}
            icon="box"
          />
          <StatCard
            label="Total buying cost"
            value={loading ? '—' : formatMoney(totalInventoryValue)}
            icon="chart"
          />
          <StatCard
            label="Potential profit per item"
            value={loading ? '—' : formatMoney(totalPotentialProfit)}
            icon="image"
          />
        </section>

        <section style={s.panel} aria-label="Product catalogue">
          <div style={s.toolbar}>
            <div>
              <h2 style={s.toolbarTitle}>Your product catalogue</h2>
              <p style={s.toolbarSubtitle}>
                {loading
                  ? 'Retrieving your company products…'
                  : `Showing ${filteredProducts.length} of ${products.length} ${products.length === 1 ? 'product' : 'products'}`}
              </p>
            </div>

            <div style={s.searchWrap}>
              <span style={s.searchIcon}>
                <Icon name="search" size={18} />
              </span>
              <input
                type="search"
                aria-label="Search products"
                placeholder="Search your products…"
                style={s.search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={focusSearch}
                onBlur={blurSearch}
              />
            </div>
          </div>

          {loading ? (
            <div style={s.loading} role="status" aria-live="polite">
              <span
                aria-hidden="true"
                style={{
                  width: '30px',
                  height: '30px',
                  border: '3px solid #e8e4ff',
                  borderTopColor: C.primary,
                  borderRadius: '50%',
                  animation: 'productsSpin 0.8s linear infinite',
                }}
              />
              Loading your products…
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>
                <Icon name={search.trim() ? 'search' : 'box'} size={30} />
              </div>
              <h3 style={s.emptyTitle}>
                {search.trim() ? 'No matching products' : 'Your catalogue is ready'}
              </h3>
              <p style={s.emptyText}>
                {search.trim()
                  ? 'Try searching with a different product name, detail, or price.'
                  : 'Add your first product to start organizing your catalogue and tracking buying and selling prices.'}
              </p>
              {search.trim() ? (
                <button
                  type="button"
                  className="products-secondary"
                  style={s.secondaryButton}
                  onClick={() => setSearch('')}
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  className="products-primary"
                  style={s.primaryButton}
                  onClick={openCreate}
                >
                  <Icon name="plus" size={17} />
                  Add first product
                </button>
              )}
            </div>
          ) : (
            <div style={s.productGrid}>
              {filteredProducts.map((product) => {
                const profit = product.sellingPrice - product.buyingPrice;

                return (
                  <article
                    key={product.id}
                    className="products-card"
                    style={s.productCard}
                  >
                    <div style={s.imageBox}>
                      {product.imageUrl ? (
                        <img
                          className="products-card-image"
                          src={product.imageUrl}
                          alt={product.name}
                          loading="lazy"
                          style={s.image}
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                            const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      <div
                        style={{
                          ...s.imagePlaceholder,
                          display: product.imageUrl ? 'none' : 'flex',
                        }}
                      >
                        <Icon name="image" size={34} />
                        <span>No product image</span>
                      </div>

                      <span style={s.imageBadge}>
                        <Icon name="box" size={13} />
                        PRODUCT
                      </span>
                    </div>

                    <div style={s.cardBody}>
                      <h2 style={s.productName}>{product.name}</h2>
                      <p style={s.productDetails}>
                        {product.details || 'No product details have been added yet.'}
                      </p>

                      <div style={s.priceGrid}>
                        <div style={s.priceBox}>
                          <span style={s.priceLabel}>Selling price</span>
                          <span style={{ ...s.priceValue, color: C.primary }}>
                            {formatMoney(product.sellingPrice)}
                          </span>
                        </div>
                        <div style={s.priceBox}>
                          <span style={s.priceLabel}>Buying price</span>
                          <span style={s.priceValue}>
                            {formatMoney(product.buyingPrice)}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          ...s.profitBox,
                          background: profit < 0 ? C.dangerSoft : C.mint,
                          color: profit < 0 ? C.danger : C.green,
                        }}
                      >
                        <span>{profit < 0 ? 'Loss per unit' : 'Margin per unit'}</span>
                        <span>{formatMoney(profit)}</span>
                      </div>

                      <div style={s.cardActions}>
                        <button
                          type="button"
                          className="products-secondary"
                          style={s.secondaryButton}
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Icon name="edit" size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="products-secondary products-delete"
                          style={{ ...s.secondaryButton, ...s.deleteButton }}
                          onClick={() => void handleDelete(product)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Icon name="trash" size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '15px 23px',
                borderTop: `1px solid ${C.border}`,
                background: '#fdfcff',
                color: '#9690a9',
                fontSize: '11px',
              }}
            >
              <span>UNIFLOW · PRODUCT CATALOGUE</span>
              <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}</span>
            </div>
          )}
        </section>

        <footer style={s.footer}>
          <span>UNIFLOW · INVENTORY MANAGEMENT</span>
          <span>Your catalogue, clearly organized.</span>
        </footer>
      </div>

      {modalOpen && (
        <ProductModal
          editing={editing}
          form={form}
          setForm={setForm}
          imageFile={imageFile}
          setImageFile={setImageFile}
          saving={saving}
          onClose={closeModal}
          onSubmit={(event) => void handleSubmit(event)}
        />
      )}
    </main>
  );
}
