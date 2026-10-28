
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react';
import { erpApi } from '../api/erpApi';
import { ApiError } from '../api/apiError';
import type {
  ExpenseCategory,
  FinanceEntry,
  FinanceSummary,
  Product,
} from '../types/erp';
import { formatMoney } from '../utils/money';

const EXPENSE_OPTIONS: { id: ExpenseCategory; label: string }[] = [
  { id: 'staff_salary', label: 'Staff salary' },
  { id: 'product_buying', label: 'Product buying' },
  { id: 'store_maintenance', label: 'Store maintenance' },
];

const COLORS = {
  primary: '#5146e5',
  primaryLight: '#efedff',
  ink: '#222344',
  muted: '#8586a0',
  border: '#eeedf5',
  surface: '#ffffff',
  background: '#f8f8fc',
  green: '#159b75',
  greenLight: '#e7f8f1',
  red: '#df5268',
  redLight: '#fff0f2',
  purple: '#8b72e8',
  yellow: '#d99b2b',
};

const css: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    padding: '30px',
    background: COLORS.background,
    color: COLORS.ink,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    boxSizing: 'border-box',
  },
  container: { maxWidth: 1500, margin: '0 auto' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 26,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },
  title: {
    margin: 0,
    fontSize: 29,
    fontWeight: 800,
    letterSpacing: -1.1,
    lineHeight: 1.25,
  },
  subtitle: {
    margin: '9px 0 0',
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 1.7,
  },
  headerActions: { display: 'flex', alignItems: 'center', gap: 10 },
  button: {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    background: COLORS.surface,
    color: COLORS.ink,
    padding: '11px 15px',
    fontSize: 12,
    fontWeight: 750,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all .2s ease',
  },
  primaryButton: {
    background: COLORS.primary,
    border: `1px solid ${COLORS.primary}`,
    color: '#fff',
    boxShadow: '0 5px 14px rgba(81,70,229,.17)',
  },
  card: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 19,
    padding: 22,
    minWidth: 0,
    boxShadow: '0 4px 20px rgba(40,35,90,.025)',
  },
  sectionHeading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '-.3px',
  },
  sectionDescription: {
    margin: '5px 0 0',
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 1.6,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 18,
    padding: '21px 20px',
    minWidth: 0,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(40,35,90,.025)',
  },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  statLabel: {
    color: '#777891',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.5,
  },
  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontSize: 19,
    flexShrink: 0,
  },
  statValue: {
    margin: 0,
    fontSize: 25,
    lineHeight: 1.3,
    fontWeight: 850,
    letterSpacing: '-.8px',
    overflowWrap: 'anywhere',
  },
  statHint: {
    margin: '8px 0 0',
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 1.5,
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 18,
    marginBottom: 20,
    alignItems: 'start',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, fontWeight: 750, color: '#535471' },
  input: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '12px 13px',
    border: `1px solid #e7e6f1`,
    borderRadius: 11,
    background: '#fcfcff',
    color: COLORS.ink,
    outline: 'none',
    fontSize: 13,
    fontFamily: 'inherit',
    transition: 'border .2s, box-shadow .2s',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 15,
  },
  formStack: { display: 'flex', flexDirection: 'column', gap: 16 },
  formFooter: {
    paddingTop: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  hint: { fontSize: 11, color: COLORS.muted, lineHeight: 1.6 },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    padding: '6px 9px',
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  chartArea: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 12,
    height: 215,
    paddingTop: 14,
  },
  chartYAxis: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 26,
    color: '#9a9ab0',
    fontSize: 10,
    minWidth: 36,
  },
  chartPlot: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chartGrid: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: 10,
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundImage: 'linear-gradient(to bottom, #f0eff7 1px, transparent 1px)',
    backgroundSize: '100% 25%',
  },
  chartMonth: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: 10,
    paddingTop: 10,
    color: COLORS.muted,
    fontSize: 10,
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 18,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 11,
    color: '#72738e',
    fontWeight: 650,
  },
  legendDot: { width: 8, height: 8, borderRadius: 3 },
  tableWrap: { overflowX: 'auto', width: '100%' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 730,
    textAlign: 'left',
  },
  th: {
    padding: '13px 15px',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '.7px',
    textTransform: 'uppercase',
    color: '#8889a1',
    background: '#fafaff',
    borderTop: `1px solid ${COLORS.border}`,
    borderBottom: `1px solid ${COLORS.border}`,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '15px',
    fontSize: 12,
    color: '#555671',
    borderBottom: `1px solid #f0eff6`,
    verticalAlign: 'middle',
  },
  deleteButton: {
    border: '1px solid #ffe0e5',
    borderRadius: 9,
    background: '#fff7f8',
    color: COLORS.red,
    padding: '8px 10px',
    fontSize: 11,
    fontWeight: 750,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 15px',
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 1.7,
  },
  notice: {
    padding: '13px 15px',
    borderRadius: 12,
    border: '1px solid #ffd9df',
    background: '#fff3f5',
    color: '#bd354b',
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  loading: {
    textAlign: 'center',
    padding: '55px 20px',
    color: COLORS.muted,
    fontSize: 13,
  },
};

function categoryLabel(category: ExpenseCategory | null): string {
  return EXPENSE_OPTIONS.find((option) => option.id === category)?.label ?? 'Income';
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} style={css.field}>
      <span style={css.label}>{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  background,
  hint,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  background: string;
  hint: string;
}) {
  return (
    <article style={css.statCard}>
      <div style={css.statTop}>
        <span style={css.statLabel}>{label}</span>
        <span style={{ ...css.statIcon, color, background }}>{icon}</span>
      </div>
      <p style={css.statValue}>{value}</p>
      <p style={css.statHint}>{hint}</p>
    </article>
  );
}

function SectionHeading({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div style={css.sectionHeading}>
      <div>
        <h2 style={css.sectionTitle}>{title}</h2>
        {description && <p style={css.sectionDescription}>{description}</p>}
      </div>
      {right}
    </div>
  );
}

function MonthlyChart({ entries }: { entries: FinanceEntry[] }) {
  const months = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      const monthEntries = entries.filter((entry) => {
        const occurred = new Date(entry.occurredAt);
        return (
          !Number.isNaN(occurred.getTime()) &&
          occurred.getFullYear() === year &&
          occurred.getMonth() === month
        );
      });

      const income = monthEntries
        .filter((entry) => entry.entryType === 'income')
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

      const expenses = monthEntries
        .filter((entry) => entry.entryType !== 'income')
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

      return {
        label: date.toLocaleDateString(undefined, { month: 'short' }),
        income,
        expenses,
      };
    });
  }, [entries]);

  const maxValue = Math.max(
    1,
    ...months.flatMap((month) => [month.income, month.expenses]),
  );

  const hasEntries = months.some((month) => month.income > 0 || month.expenses > 0);

  return (
    <div>
      {!hasEntries ? (
        <div style={css.empty}>
          <div style={{ fontSize: 27, marginBottom: 8 }}>▥</div>
          No income or expense entries for the last six months yet.
          <div style={{ fontSize: 11, marginTop: 5 }}>
            Your monthly comparison will appear here when transactions are added.
          </div>
        </div>
      ) : (
        <div style={css.chartArea}>
          <div style={css.chartYAxis}>
            <span>{formatMoney(maxValue)}</span>
            <span>{formatMoney(maxValue * 0.5)}</span>
            <span>{formatMoney(0)}</span>
          </div>

          <div style={css.chartPlot}>
            <div style={css.chartGrid}>
              {months.map((month) => (
                <div
                  key={month.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 5,
                    height: '100%',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    title={`Income: ${formatMoney(month.income)}`}
                    style={{
                      width: 'min(25px, 40%)',
                      height: `${Math.max(0, (month.income / maxValue) * 100)}%`,
                      minHeight: month.income > 0 ? 3 : 0,
                      background: 'linear-gradient(180deg, #8176ff, #5146e5)',
                      borderRadius: '5px 5px 2px 2px',
                      transition: 'height .25s ease',
                    }}
                  />
                  <div
                    title={`Expenses: ${formatMoney(month.expenses)}`}
                    style={{
                      width: 'min(25px, 40%)',
                      height: `${Math.max(0, (month.expenses / maxValue) * 100)}%`,
                      minHeight: month.expenses > 0 ? 3 : 0,
                      background: 'linear-gradient(180deg, #83e0c2, #25ad87)',
                      borderRadius: '5px 5px 2px 2px',
                      transition: 'height .25s ease',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={css.chartMonth}>
              {months.map((month, index) => (
                <span key={`${month.label}-${index}`} style={{ flex: 1, textAlign: 'center' }}>
                  {month.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={css.legend}>
        <span style={css.legendItem}>
          <span style={{ ...css.legendDot, background: COLORS.primary }} />
          Selling income
        </span>
        <span style={css.legendItem}>
          <span style={{ ...css.legendDot, background: COLORS.green }} />
          Expenses
        </span>
      </div>
    </div>
  );
}

export function FinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingIncome, setSavingIncome] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [entryFilter, setEntryFilter] = useState('all');

  const [income, setIncome] = useState({
    amount: '',
    note: '',
    productId: '',
    occurredAt: '',
  });

  const [expense, setExpense] = useState({
    category: 'staff_salary' as ExpenseCategory,
    amount: '',
    note: '',
    productId: '',
    occurredAt: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [nextSummary, nextEntries, nextProducts] = await Promise.all([
        erpApi.financeSummary(),
        erpApi.listFinance(),
        erpApi.listProducts(),
      ]);

      setSummary(nextSummary);
      setEntries(nextEntries);
      setProducts(nextProducts);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load finance data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleIncome = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingIncome(true);
    setError(null);

    try {
      await erpApi.addIncome({
        amount: Number(income.amount),
        note: income.note.trim() || undefined,
        productId: income.productId || undefined,
        occurredAt: income.occurredAt || undefined,
      });

      setIncome({ amount: '', note: '', productId: '', occurredAt: '' });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add income.');
    } finally {
      setSavingIncome(false);
    }
  };

  const handleExpense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingExpense(true);
    setError(null);

    try {
      await erpApi.addExpense({
        category: expense.category,
        amount: Number(expense.amount),
        note: expense.note.trim() || undefined,
        productId:
          expense.category === 'product_buying'
            ? expense.productId || undefined
            : undefined,
        occurredAt: expense.occurredAt || undefined,
      });

      setExpense((current) => ({
        ...current,
        amount: '',
        note: '',
        productId: '',
        occurredAt: '',
      }));

      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add expense.');
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDelete = async (entry: FinanceEntry) => {
    if (!window.confirm('Are you sure you want to delete this finance entry?')) {
      return;
    }

    setDeletingId(entry.id);
    setError(null);

    try {
      await erpApi.deleteFinance(entry.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete this entry.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesFilter =
        entryFilter === 'all' ||
        (entryFilter === 'income' && entry.entryType === 'income') ||
        (entryFilter === 'expense' && entry.entryType !== 'income');

      const matchesSearch =
        !query ||
        (entry.note || '').toLowerCase().includes(query) ||
        categoryLabel(entry.expenseCategory).toLowerCase().includes(query) ||
        entry.entryType.toLowerCase().includes(query) ||
        new Date(entry.occurredAt).toLocaleDateString().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [entries, search, entryFilter]);

  const inputStyle = css.input;

  return (
    <main style={css.page}>
      <style>{`
        * { box-sizing: border-box; }
        .finance-input:focus {
          border-color: #8176ff !important;
          box-shadow: 0 0 0 3px rgba(81,70,229,.10);
          outline: none;
          background: #fff !important;
        }
        .finance-button:hover { filter: brightness(.97); transform: translateY(-1px); }
        .finance-delete:hover { background: #ffe9ed !important; }
        .finance-row:hover { background: #fbfaff; }
        .finance-bar { transition: opacity .2s, transform .2s; transform-origin: bottom; }
        .finance-bar:hover { opacity: .78; }
        @media (max-width: 1050px) {
          .finance-stats { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .finance-columns { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 650px) {
          .finance-page { padding: 18px 13px !important; }
          .finance-stats { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .finance-stat { padding: 15px 13px !important; }
          .finance-stat-value { font-size: 19px !important; }
          .finance-card { padding: 16px !important; border-radius: 15px !important; }
          .finance-form-grid { grid-template-columns: 1fr !important; }
          .finance-title { font-size: 24px !important; }
          .finance-chart { gap: 7px !important; }
        }
        @media (max-width: 380px) {
          .finance-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="finance-page" style={css.container}>
        <header style={css.header}>
          <div>
            <p style={css.eyebrow}>UNIFLOW / FINANCE</p>
            <h1 className="finance-title" style={css.title}>
              Finance overview
            </h1>
            <p style={css.subtitle}>
              Track your income, manage business expenses, and monitor your cash flow.
            </p>
          </div>

          <div style={css.headerActions}>
            <button
              type="button"
              className="finance-button"
              style={css.button}
              onClick={() => void load()}
              disabled={loading}
            >
              <span style={{ fontSize: 16 }}>↻</span>
              {loading ? 'Refreshing…' : 'Refresh data'}
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" style={css.notice}>
            <strong style={{ marginRight: 6 }}>Something went wrong.</strong>
            {error}
          </div>
        )}

        {loading && !summary ? (
          <div style={css.card}>
            <div style={css.loading}>
              <div style={{ fontSize: 25, marginBottom: 10 }}>◌</div>
              Loading your financial overview…
            </div>
          </div>
        ) : summary ? (
          <>
            <section className="finance-stats" style={css.stats}>
              <div className="finance-stat" style={{ ...css.statCard, borderTop: '3px solid #5146e5' }}>
                <StatCard
                  label="Selling income"
                  value={formatMoney(summary.totals.income)}
                  icon="↗"
                  color={COLORS.primary}
                  background={COLORS.primaryLight}
                  hint="Total recorded income"
                />
              </div>
              <div className="finance-stat" style={{ ...css.statCard, borderTop: '3px solid #df5268' }}>
                <StatCard
                  label="Total expenses"
                  value={formatMoney(summary.totals.expenses)}
                  icon="↙"
                  color={COLORS.red}
                  background={COLORS.redLight}
                  hint="All recorded expenses"
                />
              </div>
              <div
                className="finance-stat"
                style={{
                  ...css.statCard,
                  borderTop: `3px solid ${summary.totals.net >= 0 ? COLORS.green : COLORS.red}`,
                }}
              >
                <StatCard
                  label="Net balance"
                  value={formatMoney(summary.totals.net)}
                  icon="◈"
                  color={summary.totals.net >= 0 ? COLORS.green : COLORS.red}
                  background={summary.totals.net >= 0 ? COLORS.greenLight : COLORS.redLight}
                  hint="Income minus expenses"
                />
              </div>
              <div className="finance-stat" style={{ ...css.statCard, borderTop: '3px solid #8b72e8' }}>
                <StatCard
                  label="Staff salary"
                  value={formatMoney(summary.totals.staffSalary)}
                  icon="♙"
                  color={COLORS.purple}
                  background="#f1edff"
                  hint="Staff-related costs"
                />
              </div>
              <div className="finance-stat" style={{ ...css.statCard, borderTop: '3px solid #d99b2b' }}>
                <StatCard
                  label="Product buying"
                  value={formatMoney(summary.totals.productBuying)}
                  icon="▣"
                  color={COLORS.yellow}
                  background="#fff6df"
                  hint="Inventory purchasing costs"
                />
              </div>
              <div className="finance-stat" style={{ ...css.statCard, borderTop: '3px solid #25ad87' }}>
                <StatCard
                  label="Store maintenance"
                  value={formatMoney(summary.totals.storeMaintenance)}
                  icon="⌂"
                  color={COLORS.green}
                  background={COLORS.greenLight}
                  hint="Maintenance and upkeep"
                />
              </div>
            </section>

            <section className="finance-card" style={{ ...css.card, marginBottom: 20 }}>
              <SectionHeading
                title="Income & expense trends"
                description="A monthly comparison based on your recorded transactions."
                right={
                  <span style={{ ...css.badge, background: COLORS.primaryLight, color: COLORS.primary }}>
                    Last 6 months
                  </span>
                }
              />
              <MonthlyChart entries={entries} />
            </section>
          </>
        ) : (
          <section style={{ ...css.card, marginBottom: 20 }}>
            <p style={css.empty}>
              Your financial summary is not available right now. Try refreshing the data.
            </p>
          </section>
        )}

        <section className="finance-columns" style={css.twoColumns}>
          <form
            className="finance-card"
            style={css.card}
            onSubmit={(event) => void handleIncome(event)}
          >
            <SectionHeading
              title="Add selling income"
              description="Record money received by your business."
              right={
                <span style={{ ...css.statIcon, color: COLORS.green, background: COLORS.greenLight }}>
                  ↗
                </span>
              }
            />

            <div className="finance-form-grid" style={css.formGrid}>
              <Field label="Amount *" htmlFor="income-amount">
                <input
                  id="income-amount"
                  className="finance-input"
                  style={inputStyle}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  required
                  value={income.amount}
                  onChange={(event) =>
                    setIncome((current) => ({ ...current, amount: event.target.value }))
                  }
                />
              </Field>

              <Field label="Product (optional)" htmlFor="income-product">
                <select
                  id="income-product"
                  className="finance-input"
                  style={inputStyle}
                  value={income.productId}
                  onChange={(event) =>
                    setIncome((current) => ({ ...current, productId: event.target.value }))
                  }
                >
                  <option value="">No product selected</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Transaction date" htmlFor="income-date">
                <input
                  id="income-date"
                  className="finance-input"
                  style={inputStyle}
                  type="date"
                  value={income.occurredAt}
                  onChange={(event) =>
                    setIncome((current) => ({ ...current, occurredAt: event.target.value }))
                  }
                />
              </Field>

              <Field label="Note (optional)" htmlFor="income-note">
                <input
                  id="income-note"
                  className="finance-input"
                  style={inputStyle}
                  placeholder="e.g. Customer payment"
                  value={income.note}
                  onChange={(event) =>
                    setIncome((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </Field>
            </div>

            <div style={{ ...css.formFooter, marginTop: 19 }}>
              <span style={css.hint}>Fields marked * are required.</span>
              <button
                type="submit"
                className="finance-button"
                style={{ ...css.button, ...css.primaryButton }}
                disabled={savingIncome}
              >
                {savingIncome ? 'Saving…' : '+ Add income'}
              </button>
            </div>
          </form>

          <form
            className="finance-card"
            style={css.card}
            onSubmit={(event) => void handleExpense(event)}
          >
            <SectionHeading
              title="Add business expense"
              description="Keep your operating costs organized."
              right={
                <span style={{ ...css.statIcon, color: COLORS.red, background: COLORS.redLight }}>
                  ↙
                </span>
              }
            />

            <div className="finance-form-grid" style={css.formGrid}>
              <Field label="Expense category *" htmlFor="expense-category">
                <select
                  id="expense-category"
                  className="finance-input"
                  style={inputStyle}
                  value={expense.category}
                  onChange={(event) =>
                    setExpense((current) => ({
                      ...current,
                      category: event.target.value as ExpenseCategory,
                      productId: '',
                    }))
                  }
                >
                  {EXPENSE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Amount *" htmlFor="expense-amount">
                <input
                  id="expense-amount"
                  className="finance-input"
                  style={inputStyle}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  required
                  value={expense.amount}
                  onChange={(event) =>
                    setExpense((current) => ({ ...current, amount: event.target.value }))
                  }
                />
              </Field>

              {expense.category === 'product_buying' && (
                <Field label="Product (optional)" htmlFor="expense-product">
                  <select
                    id="expense-product"
                    className="finance-input"
                    style={inputStyle}
                    value={expense.productId}
                    onChange={(event) =>
                      setExpense((current) => ({ ...current, productId: event.target.value }))
                    }
                  >
                    <option value="">No product selected</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Transaction date" htmlFor="expense-date">
                <input
                  id="expense-date"
                  className="finance-input"
                  style={inputStyle}
                  type="date"
                  value={expense.occurredAt}
                  onChange={(event) =>
                    setExpense((current) => ({ ...current, occurredAt: event.target.value }))
                  }
                />
              </Field>

              <Field label="Note (optional)" htmlFor="expense-note">
                <input
                  id="expense-note"
                  className="finance-input"
                  style={inputStyle}
                  placeholder="e.g. Monthly office costs"
                  value={expense.note}
                  onChange={(event) =>
                    setExpense((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </Field>
            </div>

            <div style={{ ...css.formFooter, marginTop: 19 }}>
              <span style={css.hint}>Fields marked * are required.</span>
              <button
                type="submit"
                className="finance-button"
                style={{
                  ...css.button,
                  background: COLORS.red,
                  borderColor: COLORS.red,
                  color: '#fff',
                }}
                disabled={savingExpense}
              >
                {savingExpense ? 'Saving…' : '+ Add expense'}
              </button>
            </div>
          </form>
        </section>

        <section className="finance-card" style={css.card}>
          <SectionHeading
            title="Transaction history"
            description={`${filteredEntries.length} transaction${filteredEntries.length === 1 ? '' : 's'} shown`}
            right={
              <span style={{ ...css.badge, background: '#f1f0ff', color: COLORS.primary }}>
                {entries.length} total records
              </span>
            }
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 18,
            }}
          >
            <div style={{ flex: '1 1 220px', maxWidth: 390, position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 13,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: COLORS.muted,
                  fontSize: 17,
                  pointerEvents: 'none',
                }}
              >
                ⌕
              </span>
              <input
                className="finance-input"
                style={{ ...css.input, paddingLeft: 38, background: '#fff' }}
                placeholder="Search transactions…"
                aria-label="Search transactions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All entries' },
                { id: 'income', label: 'Income' },
                { id: 'expense', label: 'Expenses' },
              ].map((filter) => {
                const active = entryFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setEntryFilter(filter.id)}
                    style={{
                      ...css.button,
                      padding: '10px 13px',
                      background: active ? COLORS.primaryLight : '#fff',
                      color: active ? COLORS.primary : '#777891',
                      borderColor: active ? '#dcd8ff' : COLORS.border,
                    }}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading && entries.length === 0 ? (
            <div style={css.empty}>Loading transactions…</div>
          ) : filteredEntries.length === 0 ? (
            <div style={css.empty}>
              <div style={{ fontSize: 28, marginBottom: 9 }}>▤</div>
              <strong style={{ display: 'block', color: COLORS.ink, marginBottom: 5 }}>
                No transactions found
              </strong>
              {entries.length === 0
                ? 'Your income and expenses will appear here after you add them.'
                : 'Try a different search term or filter.'}
            </div>
          ) : (
            <div style={css.tableWrap}>
              <table style={css.table}>
                <thead>
                  <tr>
                    <th style={css.th}>Transaction</th>
                    <th style={css.th}>Date</th>
                    <th style={css.th}>Type</th>
                    <th style={css.th}>Category</th>
                    <th style={css.th}>Amount</th>
                    <th style={css.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => {
                    const isIncome = entry.entryType === 'income';

                    return (
                      <tr className="finance-row" key={entry.id}>
                        <td style={css.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 11,
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: 0,
                                background: isIncome ? COLORS.greenLight : COLORS.redLight,
                                color: isIncome ? COLORS.green : COLORS.red,
                                fontSize: 16,
                                fontWeight: 800,
                              }}
                            >
                              {isIncome ? '↗' : '↙'}
                            </span>
                            <div>
                              <div style={{ color: COLORS.ink, fontWeight: 750, fontSize: 12 }}>
                                {entry.note?.trim() || (isIncome ? 'Selling income' : 'Business expense')}
                              </div>
                              <div style={{ color: COLORS.muted, fontSize: 10, marginTop: 4 }}>
                                ID: {entry.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...css.td, whiteSpace: 'nowrap' }}>
                          {new Date(entry.occurredAt).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td style={css.td}>
                          <span
                            style={{
                              ...css.badge,
                              color: isIncome ? COLORS.green : COLORS.red,
                              background: isIncome ? COLORS.greenLight : COLORS.redLight,
                            }}
                          >
                            <span>{isIncome ? '+' : '−'}</span>
                            {isIncome ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td style={css.td}>{categoryLabel(entry.expenseCategory)}</td>
                        <td
                          style={{
                            ...css.td,
                            fontWeight: 850,
                            color: isIncome ? COLORS.green : COLORS.red,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isIncome ? '+' : '−'}{formatMoney(entry.amount)}
                        </td>
                        <td style={css.td}>
                          <button
                            type="button"
                            className="finance-delete"
                            style={css.deleteButton}
                            disabled={deletingId === entry.id}
                            onClick={() => void handleDelete(entry)}
                          >
                            {deletingId === entry.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: 'center',
            color: '#a0a0b4',
            fontSize: 10,
            padding: '24px 0 4px',
          }}
        >
          UNIFLOW FINANCE · Keep your business numbers organized.
        </footer>
      </div>
    </main>
  );
}
