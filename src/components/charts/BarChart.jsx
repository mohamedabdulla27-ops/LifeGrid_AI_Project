import { useState } from 'react';
import useElementSize from '../../hooks/useElementSize';
import { cx } from '../../utils/format';

/**
 * Vertical bar chart with rounded tops and hover tooltips.
 * data: [{ label, value }]. Bars with value 0 render as hairline stubs.
 */
export default function BarChart({ data, height = 260, color = '#FC3C18', yStep = 2, className, highlightMax = false }) {
  const [ref, { width }] = useElementSize();
  const [hover, setHover] = useState(null);

  const pad = { top: 12, right: 8, bottom: 30, left: 28 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const maxV = Math.max(yStep, Math.ceil(Math.max(...data.map((d) => d.value), 0) / yStep) * yStep);
  const slot = data.length ? innerW / data.length : 0;
  const barW = Math.min(64, slot * 0.46);
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const ticks = [];
  for (let v = 0; v <= maxV; v += yStep) ticks.push(v);

  return (
    <div ref={ref} className={cx('relative w-full', className)} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} className="block overflow-visible" role="img" aria-label="Bar chart">
          {ticks.map((t) => {
            const y = pad.top + innerH - (t / maxV) * innerH;
            return (
              <g key={t}>
                <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#111A17" />
                <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-mint-dim font-mono" fontSize="11">{t}</text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const cxPos = pad.left + slot * i + slot / 2;
            const h = (d.value / maxV) * innerH;
            const isMax = highlightMax && d.value === maxValue && d.value > 0;
            const fill = d.value > 0 ? color : '#1B2722';
            const isHover = hover === i;
            return (
              <g key={`${d.label}-${i}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                <rect x={pad.left + slot * i} y={pad.top} width={slot} height={innerH} fill="transparent" />
                <rect
                  x={cxPos - barW / 2}
                  y={pad.top + innerH - Math.max(h, 2)}
                  width={barW}
                  height={Math.max(h, 2)}
                  rx="4"
                  fill={fill}
                  opacity={hover == null || isHover ? 1 : 0.55}
                  style={{ transition: 'all 300ms ease', filter: isMax ? 'drop-shadow(0 0 10px rgba(252,60,24,0.6))' : undefined }}
                />
                <text x={cxPos} y={height - 8} textAnchor="middle" className="fill-mint-dim font-mono" fontSize="11">{d.label}</text>
              </g>
            );
          })}
        </svg>
      )}
      {hover != null && data[hover] && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-ink-500 bg-ink-900/95 px-3 py-1.5 text-xs shadow-card"
          style={{ left: pad.left + slot * hover + slot / 2, top: 0 }}
        >
          <span className="font-mono text-mint-muted">{data[hover].label}</span>
          <span className="ml-2 font-mono font-semibold text-mint">{data[hover].value} incidents</span>
        </div>
      )}
    </div>
  );
}
