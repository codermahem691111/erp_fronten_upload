import { formatMoney, formatMonth } from '../utils/money';
import type { MonthlyFinancePoint } from '../types/erp';

interface GrowthChartProps {
  points: MonthlyFinancePoint[];
}

export function GrowthChart({ points }: GrowthChartProps) {
  const width = 720;
  const height = 280;
  const padding = { top: 24, right: 16, bottom: 36, left: 56 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...points.flatMap((point) => [point.selling, point.buying]));

  const xFor = (index: number) =>
    padding.left + (points.length <= 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
  const yFor = (value: number) => padding.top + innerHeight - (value / maxValue) * innerHeight;

  const toPath = (key: 'selling' | 'buying') =>
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point[key])}`)
      .join(' ');

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Buying and selling growth">
        {[0, 0.5, 1].map((tick) => {
          const value = maxValue * tick;
          const y = yFor(value);
          return (
            <g key={tick}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart__grid" />
              <text x={padding.left - 8} y={y + 4} className="chart__axis">
                {formatMoney(value)}
              </text>
            </g>
          );
        })}
        <path d={toPath('selling')} className="chart__line chart__line--selling" />
        <path d={toPath('buying')} className="chart__line chart__line--buying" />
        {points.map((point, index) => (
          <g key={point.month}>
            <circle cx={xFor(index)} cy={yFor(point.selling)} r="4" className="chart__dot chart__dot--selling" />
            <circle cx={xFor(index)} cy={yFor(point.buying)} r="4" className="chart__dot chart__dot--buying" />
            <text x={xFor(index)} y={height - 10} textAnchor="middle" className="chart__axis">
              {formatMonth(point.month)}
            </text>
          </g>
        ))}
      </svg>
      <ul className="chart__legend">
        <li>
          <span className="chart__swatch chart__swatch--selling" /> Selling (income)
        </li>
        <li>
          <span className="chart__swatch chart__swatch--buying" /> Product buying
        </li>
      </ul>
    </div>
  );
}
