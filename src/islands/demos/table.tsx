import { useMemo, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: '已发货' | '待付款' | '已完成';
}

const ORDERS: Order[] = [
  { id: 'ORD-1042', customer: '林小满', amount: 268, status: '已发货' },
  { id: 'ORD-1043', customer: '赵之衡', amount: 1299, status: '待付款' },
  { id: 'ORD-1044', customer: 'Mao K.', amount: 89, status: '已完成' },
  { id: 'ORD-1045', customer: 'Rin S.', amount: 456, status: '已发货' },
  { id: 'ORD-1046', customer: '陈望舒', amount: 1780, status: '已完成' },
];

const STATUS_DOT: Record<Order['status'], string> = {
  已发货: 'bg-accent',
  待付款: 'bg-amber-500',
  已完成: 'bg-emerald-500',
};

type SortKey = 'id' | 'customer' | 'amount' | 'status';
type SortDir = 1 | -1;

function SortableTable({ striped = false }: { striped?: boolean }) {
  const [sortKey, setSortKey] = useState<SortKey>('amount');
  const [sortDir, setSortDir] = useState<SortDir>(-1);
  const [selected, setSelected] = useState<string>('ORD-1042');

  const sorted = useMemo(() => {
    return [...ORDERS].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'zh');
      return cmp * sortDir;
    });
  }, [sortKey, sortDir]);

  const toggle = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const arrow = (key: SortKey) => (key === sortKey ? (sortDir === 1 ? ' ↑' : ' ↓') : '');

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-paper">
      <table className="w-full min-w-[420px] text-left text-xs">
        <thead data-anatomy="1">
          <tr className="border-b border-line text-[11px] text-ink-3">
            <th className="px-3 py-2 font-medium">
              <button onClick={() => toggle('id')} aria-sort={sortKey === 'id' ? (sortDir === 1 ? 'ascending' : 'descending') : undefined} className="hover:text-accent">
                订单号{arrow('id')}
              </button>
            </th>
            <th className="px-3 py-2 font-medium">
              <button onClick={() => toggle('customer')} aria-sort={sortKey === 'customer' ? (sortDir === 1 ? 'ascending' : 'descending') : undefined} className="hover:text-accent">
                客户{arrow('customer')}
              </button>
            </th>
            <th className="px-3 py-2 text-right font-medium">
              <button onClick={() => toggle('amount')} aria-sort={sortKey === 'amount' ? (sortDir === 1 ? 'ascending' : 'descending') : undefined} className="hover:text-accent">
                金额{arrow('amount')}
              </button>
            </th>
            <th className="px-3 py-2 font-medium">
              <button onClick={() => toggle('status')} aria-sort={sortKey === 'status' ? (sortDir === 1 ? 'ascending' : 'descending') : undefined} className="hover:text-accent">
                状态{arrow('status')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody data-anatomy="2">
          {sorted.map((o) => (
            <tr
              key={o.id}
              data-anatomy="3"
              aria-selected={selected === o.id}
              onClick={() => setSelected(o.id)}
              className={`cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-code-bg ${
                striped ? 'odd:bg-code-bg/50' : ''
              } ${selected === o.id ? 'bg-accent-soft' : ''}`}
            >
              <td className="px-3 py-1.5 font-mono text-[11px]">{o.id}</td>
              <td className="px-3 py-1.5">{o.customer}</td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums">¥ {o.amount.toLocaleString()}</td>
              <td data-anatomy="4" className="px-3 py-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[o.status]}`} />
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TableDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto w-full max-w-md">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">斑马纹 Striped</p>
        <SortableTable striped />
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-1 text-[11px] text-ink-3">点击表头排序，点击行选中 / Click headers to sort, rows to select</p>
      <SortableTable />
    </div>
  );
};

export default TableDemo;
