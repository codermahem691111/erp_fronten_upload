import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SERVICES = [
  {
    to: '/people',
    title: 'People management',
    text: 'Manage your customers, staff, and suppliers in one organized workspace.',
    icon: 'users',
    number: '01',
    color: '#5146e5',
    background: '#f0efff',
    tag: 'Relationships',
  },
  {
    to: '/products',
    title: 'Product management',
    text: 'Organize your catalogue, product photos, buying costs, and selling prices.',
    icon: 'box',
    number: '02',
    color: '#087f8c',
    background: '#e5faf6',
    tag: 'Inventory',
  },
  {
    to: '/finance',
    title: 'Finance management',
    text: 'Track sales income and expenses while keeping an eye on business growth.',
    icon: 'chart',
    number: '03',
    color: '#b66a14',
    background: '#fff4df',
    tag: 'Business finance',
  },
];

const styles = {
  page: {
    minHeight: '100vh',
    padding: 'clamp(20px, 4vw, 44px)',
    background: '#faf9ff',
    color: '#201d35',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: 'border-box' as const,
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#5146e5',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    marginBottom: '14px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    background: '#28b879',
    borderRadius: '50%',
    boxShadow: '0 0 0 4px #dff8ec',
  },
  hero: {
    position: 'relative' as const,
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '28px',
    padding: 'clamp(26px, 5vw, 48px)',
    background: 'linear-gradient(120deg, #ffffff 0%, #f4f1ff 65%, #e9fbf4 100%)',
    border: '1px solid #e9e5fa',
    borderRadius: '28px',
    boxShadow: '0 12px 40px rgba(56, 43, 113, 0.055)',
    marginBottom: '34px',
  },
  heroContent: {
    position: 'relative' as const,
    zIndex: 1,
    flex: '1 1 340px',
    minWidth: 0,
  },
  title: {
    fontSize: 'clamp(28px, 4vw, 43px)',
    lineHeight: 1.16,
    letterSpacing: '-1.7px',
    fontWeight: 800,
    margin: '0 0 14px',
    overflowWrap: 'anywhere' as const,
  },
  subtitle: {
    color: '#77728d',
    fontSize: '15px',
    lineHeight: 1.85,
    margin: 0,
    maxWidth: '590px',
  },
  heroBadge: {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 18px',
    border: '1px solid rgba(255,255,255,0.9)',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.82)',
    boxShadow: '0 8px 28px rgba(70, 57, 135, 0.07)',
  },
  heroBadgeIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '43px',
    height: '43px',
    borderRadius: '14px',
    background: '#e1f8eb',
    color: '#168754',
    flexShrink: 0,
  },
  sectionHeading: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '18px',
  },
  sectionTitle: {
    fontSize: '21px',
    letterSpacing: '-0.5px',
    fontWeight: 800,
    margin: '0 0 6px',
  },
  sectionSubtitle: {
    fontSize: '13px',
    lineHeight: 1.7,
    color: '#89849e',
    margin: 0,
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '18px',
    marginBottom: '36px',
  },
  serviceCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
    minHeight: '240px',
    padding: '25px',
    border: '1px solid #ebe8f6',
    borderRadius: '22px',
    background: '#ffffff',
    textDecoration: 'none',
    color: '#201d35',
    boxShadow: '0 5px 20px rgba(48, 39, 99, 0.025)',
    transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
    boxSizing: 'border-box' as const,
  },
  serviceCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '23px',
  },
  serviceIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '16px',
    flexShrink: 0,
  },
  serviceNumber: {
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '1px',
    color: '#b0abc2',
  },
  serviceTag: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '-0.35px',
    margin: '0 0 10px',
  },
  serviceText: {
    color: '#827d96',
    fontSize: '13px',
    lineHeight: 1.8,
    margin: 0,
  },
  serviceFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: 'auto',
    paddingTop: '23px',
    fontSize: '12px',
    fontWeight: 800,
  },
  detailsPanel: {
    padding: 'clamp(22px, 4vw, 34px)',
    border: '1px solid #ebe8f6',
    borderRadius: '24px',
    background: '#ffffff',
    boxShadow: '0 8px 28px rgba(48, 39, 99, 0.035)',
    marginBottom: '28px',
  },
  detailsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '28px',
    paddingBottom: '22px',
    borderBottom: '1px solid #f0edf8',
  },
  detailsIcon: {
    display: 'grid',
    placeItems: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '15px',
    background: '#f0efff',
    color: '#5146e5',
    flexShrink: 0,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
    gap: '22px',
  },
  detailItem: {
    minWidth: 0,
    padding: '16px',
    border: '1px solid #f0edf8',
    borderRadius: '15px',
    background: '#fdfcff',
  },
  detailLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: '#9892ad',
    marginBottom: '9px',
  },
  detailValue: {
    fontSize: '14px',
    lineHeight: 1.7,
    fontWeight: 700,
    color: '#302b49',
    margin: 0,
    overflowWrap: 'anywhere' as const,
  },
  descriptionItem: {
    gridColumn: '1 / -1',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '20px 2px 4px',
    color: '#9690a9',
    fontSize: '12px',
  },
};

function ServiceIcon({ type }: { type: string }) {
  const common = {
    width: 25,
    height: 25,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  if (type === 'users') {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (type === 'box') {
    return (
      <svg {...common}>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 8 9 5 9-5" />
        <path d="M12 13v9M3 8v10l9 4 9-4V8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-5 5" />
      <path d="M15 9h4v4" />
    </svg>
  );
}

export function DashboardPage() {
  const { company } = useAuth();

  if (!company) return null;

  const registeredOn = new Date(company.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.eyebrow}>
              <span style={styles.statusDot} />
              YOUR WORKSPACE
            </div>

            <h1 style={styles.title}>
              Welcome to your
              <br />
              <span style={{ color: '#5146e5' }}>business dashboard.</span>
            </h1>

            <p style={styles.subtitle}>
              Hello, {company.ownerName}. Manage your business operations, keep your records organized,
              and access your essential tools from one place.
            </p>
          </div>

          <div style={styles.heroBadge}>
            <div style={styles.heroBadgeIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#302b49' }}>
                Your workspace
              </div>
              <div style={{ fontSize: '11px', color: '#8a849d', marginTop: '5px' }}>
                Company-specific records
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="services-heading">
          <div style={styles.sectionHeading}>
            <div>
              <h2 id="services-heading" style={styles.sectionTitle}>Your business tools</h2>
              <p style={styles.sectionSubtitle}>
                Everything you need to manage your day-to-day operations.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8a849d' }}>
              03 MODULES
            </span>
          </div>

          <div style={styles.serviceGrid}>
            {SERVICES.map((service) => (
              <Link
                key={service.to}
                to={service.to}
                style={styles.serviceCard}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-4px)';
                  event.currentTarget.style.boxShadow = '0 16px 36px rgba(48, 39, 99, 0.09)';
                  event.currentTarget.style.borderColor = '#d8d1ff';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)';
                  event.currentTarget.style.boxShadow = '0 5px 20px rgba(48, 39, 99, 0.025)';
                  event.currentTarget.style.borderColor = '#ebe8f6';
                }}
                onFocus={(event) => {
                  event.currentTarget.style.outline = '3px solid #d8d1ff';
                  event.currentTarget.style.outlineOffset = '3px';
                }}
                onBlur={(event) => {
                  event.currentTarget.style.outline = 'none';
                  event.currentTarget.style.outlineOffset = '0';
                }}
              >
                <div style={styles.serviceCardTop}>
                  <div
                    style={{
                      ...styles.serviceIcon,
                      color: service.color,
                      background: service.background,
                    }}
                  >
                    <ServiceIcon type={service.icon} />
                  </div>
                  <span style={styles.serviceNumber}>{service.number} / 03</span>
                </div>

                <span
                  style={{
                    ...styles.serviceTag,
                    color: service.color,
                    background: service.background,
                  }}
                >
                  {service.tag}
                </span>

                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <p style={styles.serviceText}>{service.text}</p>

                <div style={{ ...styles.serviceFooter, color: service.color }}>
                  <span>Open module</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={styles.detailsPanel} aria-labelledby="company-details-heading">
          <div style={styles.detailsHeader}>
            <div style={styles.detailsIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                <path d="M9 9v.01M9 13v.01M9 17v.01M16 13v.01M16 17v.01" />
              </svg>
            </div>
            <div>
              <h2 id="company-details-heading" style={{ ...styles.sectionTitle, marginBottom: '5px' }}>
                Company profile
              </h2>
              <p style={styles.sectionSubtitle}>
                Your registration details and business information.
              </p>
            </div>
          </div>

          <dl style={{ ...styles.detailsGrid, margin: 0 }}>
            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Company name</dt>
              <dd style={styles.detailValue}>{company.companyName}</dd>
            </div>

            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Owner</dt>
              <dd style={styles.detailValue}>{company.ownerName}</dd>
            </div>

            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Email address</dt>
              <dd style={styles.detailValue}>{company.email}</dd>
            </div>

            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>License number</dt>
              <dd style={styles.detailValue}>{company.licenseNumber}</dd>
            </div>

            <div style={styles.detailItem}>
              <dt style={styles.detailLabel}>Registration date</dt>
              <dd style={styles.detailValue}>{registeredOn}</dd>
            </div>

            <div style={{ ...styles.detailItem, ...styles.descriptionItem }}>
              <dt style={styles.detailLabel}>Business description</dt>
              <dd style={{ ...styles.detailValue, fontWeight: 500 }}>
                {company.businessDescription || 'No business description has been added yet.'}
              </dd>
            </div>
          </dl>
        </section>

        <footer style={styles.footer}>
          <span>UNIFLOW · BUSINESS MANAGEMENT</span>
          <span>One workspace. Better organized.</span>
        </footer>
      </div>
    </main>
  );
}
