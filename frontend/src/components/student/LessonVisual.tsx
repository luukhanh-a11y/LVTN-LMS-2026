const COLORS = {
  primary: '#4B9EFF',
  accent: '#818CF8',
  success: '#58CC02',
  warning: '#FFC800',
};

interface DemSoData { type: 'dem_so'; count: number; icon?: string }
interface SoSanhData { type: 'so_sanh'; leftCount: number; rightCount: number; leftLabel?: string; rightLabel?: string; icon?: string }
interface HinhData { type: 'hinh'; shapes: ('vuong' | 'tron' | 'tam_giac' | 'chu_nhat')[] }
interface PhanSoData { type: 'phan_so'; tu: number; mau: number }
interface NumberLineData { type: 'number_line'; min: number; max: number; highlight: number[] }
interface TuVungData { type: 'tu_vung'; items: { word: string; emoji: string }[] }

export type TrucQuanData = DemSoData | SoSanhData | HinhData | PhanSoData | NumberLineData | TuVungData;

function Shape({ shape, size = 56 }: { shape: string; size?: number }) {
  const common = { width: size, height: size };
  if (shape === 'vuong') {
    return (
      <svg {...common} viewBox="0 0 56 56">
        <rect x="6" y="6" width="44" height="44" rx="4" fill={COLORS.primary} opacity={0.85} />
      </svg>
    );
  }
  if (shape === 'tron') {
    return (
      <svg {...common} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill={COLORS.accent} opacity={0.85} />
      </svg>
    );
  }
  if (shape === 'tam_giac') {
    return (
      <svg {...common} viewBox="0 0 56 56">
        <polygon points="28,6 50,50 6,50" fill={COLORS.warning} opacity={0.9} />
      </svg>
    );
  }
  // chu_nhat
  return (
    <svg width={size * 1.3} height={size * 0.75} viewBox="0 0 72 42">
      <rect x="4" y="4" width="64" height="34" rx="4" fill={COLORS.success} opacity={0.85} />
    </svg>
  );
}

const SHAPE_LABEL: Record<string, string> = {
  vuong: 'Hình vuông',
  tron: 'Hình tròn',
  tam_giac: 'Hình tam giác',
  chu_nhat: 'Hình chữ nhật',
};

export default function LessonVisual({ data }: { data: TrucQuanData | null | undefined }) {
  if (!data) return null;

  if (data.type === 'dem_so') {
    const icon = data.icon || '🍎';
    return (
      <div className="flex flex-wrap gap-2 justify-center py-2">
        {Array.from({ length: data.count }).map((_, i) => (
          <span key={i} className="text-3xl leading-none">{icon}</span>
        ))}
      </div>
    );
  }

  if (data.type === 'so_sanh') {
    const icon = data.icon || '🍎';
    const sym = data.leftCount > data.rightCount ? '>' : data.leftCount < data.rightCount ? '<' : '=';
    return (
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex flex-wrap gap-1 justify-center max-w-[140px]">
            {Array.from({ length: data.leftCount }).map((_, i) => (
              <span key={i} className="text-2xl leading-none">{icon}</span>
            ))}
          </div>
          {data.leftLabel && <span className="text-xs font-semibold text-slate-500">{data.leftLabel}</span>}
        </div>
        <span className="text-3xl font-black text-student-primary">{sym}</span>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex flex-wrap gap-1 justify-center max-w-[140px]">
            {Array.from({ length: data.rightCount }).map((_, i) => (
              <span key={i} className="text-2xl leading-none">{icon}</span>
            ))}
          </div>
          {data.rightLabel && <span className="text-xs font-semibold text-slate-500">{data.rightLabel}</span>}
        </div>
      </div>
    );
  }

  if (data.type === 'hinh') {
    return (
      <div className="flex flex-wrap gap-6 justify-center py-2">
        {data.shapes.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Shape shape={s} />
            <span className="text-xs font-semibold text-slate-500">{SHAPE_LABEL[s]}</span>
          </div>
        ))}
      </div>
    );
  }

  if (data.type === 'phan_so') {
    const { tu, mau } = data;
    const radius = 40;
    const cx = 44;
    const cy = 44;
    const slices = Array.from({ length: mau }).map((_, i) => {
      const startAngle = (i / mau) * 2 * Math.PI - Math.PI / 2;
      const endAngle = ((i + 1) / mau) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const filled = i < tu;
      return (
        <path
          key={i}
          d={`M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
          fill={filled ? COLORS.primary : '#F0F7FF'}
          stroke="#DCEBFF"
          strokeWidth={1.5}
        />
      );
    });
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <svg width={88} height={88} viewBox="0 0 88 88">{slices}</svg>
        <span className="text-lg font-bold text-slate-700">{tu}/{mau}</span>
      </div>
    );
  }

  if (data.type === 'number_line') {
    const { min, max, highlight } = data;
    const width = 320;
    const margin = 20;
    const step = (width - margin * 2) / (max - min);
    const points = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    return (
      <div className="flex justify-center py-3 overflow-x-auto">
        <svg width={width} height={60} viewBox={`0 0 ${width} 60`}>
          <line x1={margin} y1={30} x2={width - margin} y2={30} stroke="#CBD5E1" strokeWidth={2} />
          {points.map((p) => {
            const x = margin + (p - min) * step;
            const isHighlight = highlight.includes(p);
            return (
              <g key={p}>
                <circle cx={x} cy={30} r={isHighlight ? 7 : 3} fill={isHighlight ? COLORS.primary : '#94A3B8'} />
                <text x={x} y={50} fontSize={12} textAnchor="middle" fill={isHighlight ? COLORS.primary : '#64748B'} fontWeight={isHighlight ? 700 : 400}>
                  {p}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (data.type === 'tu_vung') {
    return (
      <div className="flex flex-wrap gap-4 justify-center py-2">
        {data.items.map((it, i) => (
          <div key={i} className="flex flex-col items-center gap-1 bg-student-bg rounded-xl px-4 py-3 border border-student-border">
            <span className="text-3xl leading-none">{it.emoji}</span>
            <span className="text-sm font-bold text-slate-700">{it.word}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
