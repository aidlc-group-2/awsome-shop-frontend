import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import WorkIcon from '@mui/icons-material/Work';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import {
  getBalance,
  getExpiringPoints,
  listTransactions,
  type ExpiringPointsDTO,
  type PointsTransactionDTO,
} from '../../services/points';
import { useAuthStore } from '../../store/useAuthStore';

const QUICK_ACTIONS = [
  { label: '积分商城', icon: ShoppingBagIcon, color: '#2563EB', bg: '#EFF6FF' },
  { label: '兑换记录', icon: ReceiptLongIcon, color: '#D97706', bg: '#FFFBEB' },
  { label: '积分规则', icon: InfoIcon, color: '#16A34A', bg: '#DCFCE7' },
  { label: '帮助中心', icon: HelpIcon, color: '#DC2626', bg: '#FEE2E2' },
];

// 静态说明文案：后端暂无对应接口，保留展示
const EARN_RULES = [
  {
    icon: WorkIcon,
    color: '#2563EB',
    bg: '#EFF6FF',
    name: '工龄积分',
    desc: '每满一年工龄自动发放 1,000 积分',
    value: '+1,000/年',
  },
  {
    icon: MilitaryTechIcon,
    color: '#D97706',
    bg: '#FFFBEB',
    name: '绩效奖励',
    desc: '季度绩效 A 级以上额外奖励积分',
    value: '+500~2,000',
  },
  {
    icon: CelebrationIcon,
    color: '#16A34A',
    bg: '#DCFCE7',
    name: '节日福利',
    desc: '春节、中秋等节日发放福利积分',
    value: '+200~800',
  },
  {
    icon: VolunteerActivismIcon,
    color: '#DC2626',
    bg: '#FEE2E2',
    name: '特别贡献',
    desc: '重大项目贡献、创新提案等专项奖励',
    value: '+500~5,000',
  },
];

type FilterKey = 'all' | 'income' | 'expense';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'income', label: '收入' },
  { key: 'expense', label: '支出' },
];

type TxType = PointsTransactionDTO['type'];

const TYPE_CONFIG: Record<TxType, { label: string; color: string; bg: string }> = {
  GRANT: { label: '发放', color: '#166534', bg: '#DCFCE7' },
  DEDUCT: { label: '扣减', color: '#92400E', bg: '#FEF3C7' },
  REFUND: { label: '退回', color: '#1E40AF', bg: '#DBEAFE' },
  EXPIRE: { label: '过期', color: '#991B1B', bg: '#FEE2E2' },
  ADJUST: { label: '调整', color: '#3730A3', bg: '#E0E7FF' },
};

const isIncome = (tx: PointsTransactionDTO): boolean => {
  if (tx.type === 'GRANT' || tx.type === 'REFUND') return true;
  if (tx.type === 'DEDUCT' || tx.type === 'EXPIRE') return false;
  return tx.amount >= 0;
};

const formatTime = (value: string) => value.replace('T', ' ').slice(0, 16);

const formatDate = (value: string) => value.replace('T', ' ').slice(0, 10);

const TABLE_GRID = '160px 1fr 80px 100px 90px';

const PAGE_SIZE = 10;

export default function PointsCenter() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId;

  const [balance, setBalance] = useState<number | null>(null);
  const [expiring, setExpiring] = useState<ExpiringPointsDTO | null>(null);
  const [transactions, setTransactions] = useState<PointsTransactionDTO[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // 余额 + 即将过期积分（挂载时拉一次）
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [balanceRes, expiringRes] = await Promise.all([
          getBalance(userId),
          getExpiringPoints(userId),
        ]);
        if (cancelled) return;
        setBalance(balanceRes.balance);
        setExpiring(expiringRes);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // 积分明细（分页）
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!userId) {
        setTxLoading(false);
        return;
      }
      setTxLoading(true);
      try {
        const res = await listTransactions({ operatorId: userId, page, size: PAGE_SIZE });
        if (cancelled) return;
        setTransactions(res.records);
        setPages(res.pages);
        setTotal(res.total);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        if (!cancelled) setTxLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId, page]);

  const filteredTransactions =
    activeFilter === 'all'
      ? transactions
      : transactions.filter((tx) => (activeFilter === 'income' ? isIncome(tx) : !isIncome(tx)));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: '32px 0',
      }}
    >
      <Box sx={{ width: 960, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Points Hero */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            p: '32px 36px',
            borderRadius: '16px',
            bgcolor: '#1D4ED8',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#BFDBFE' }}>
                我的可用积分
              </Typography>
              <Typography sx={{ fontSize: 48, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                {loading ? '—' : (balance ?? 0).toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#BFDBFE' }}>
                积分
              </Typography>
            </Box>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '32px',
                bgcolor: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddIcon sx={{ fontSize: 28, color: '#FFFFFF' }} />
            </Box>
          </Box>

          {/* Hero Stats: 即将过期积分 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>
                  {loading ? '—' : (expiring?.expiringAmount ?? 0).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#BFDBFE' }}>即将过期积分</Typography>
              </Box>
              <Box sx={{ width: '1px', height: 36, bgcolor: '#3B82F6' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>
                  {loading || !expiring?.earliestExpireAt
                    ? '—'
                    : formatDate(expiring.earliestExpireAt)}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#BFDBFE' }}>最早过期日期</Typography>
              </Box>
              <Box sx={{ width: '1px', height: 36, bgcolor: '#3B82F6' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>
                  {loading ? '—' : (expiring?.batchCount ?? 0).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#BFDBFE' }}>过期批次</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Paper
            elevation={0}
            sx={{
              p: '16px 24px',
              borderRadius: '12px',
              border: '1px solid #FECACA',
              bgcolor: '#FEF2F2',
            }}
          >
            <Typography sx={{ fontSize: 13, color: '#DC2626' }}>
              积分数据加载失败：{error}
            </Typography>
          </Paper>
        )}

        {/* Quick Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {QUICK_ACTIONS.map((action) => {
            const IconComp = action.icon;
            return (
              <Paper
                key={action.label}
                elevation={0}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  p: '20px 0',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: '#F1F5F9',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '22px',
                    bgcolor: action.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComp sx={{ fontSize: 22, color: action.color }} />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                  {action.label}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        {/* Earn Points Card */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            p: '24px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: '#F1F5F9',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
            积分获取途径
          </Typography>
          <Divider sx={{ borderColor: '#F1F5F9' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {EARN_RULES.map((rule) => {
              const IconComp = rule.icon;
              return (
                <Box key={rule.name} sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      bgcolor: rule.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp sx={{ fontSize: 20, color: rule.color }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                      {rule.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>{rule.desc}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#16A34A' }}>
                    {rule.value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Points Detail Card */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            p: '24px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: '#F1F5F9',
          }}
        >
          {/* Header with filter */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
              积分明细
            </Typography>
            <Box sx={{ display: 'flex', gap: '4px' }}>
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                  <Box
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    sx={{
                      px: '12px',
                      py: '4px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      bgcolor: isActive ? '#2563EB' : 'transparent',
                      '&:hover': { bgcolor: isActive ? '#2563EB' : '#F8FAFC' },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {filter.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Divider sx={{ borderColor: '#F1F5F9' }} />

          {/* Table Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: TABLE_GRID,
              alignItems: 'center',
              pb: '8px',
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>时间</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>描述</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>类型</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'right' }}>
              积分变动
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B', textAlign: 'right' }}>
              余额
            </Typography>
          </Box>

          {/* Loading */}
          {txLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: '32px' }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {/* Empty */}
          {!txLoading && filteredTransactions.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: '32px' }}>
              <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>暂无积分明细</Typography>
            </Box>
          )}

          {/* Table Rows */}
          {!txLoading && filteredTransactions.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {filteredTransactions.map((tx, idx) => {
                const typeCfg = TYPE_CONFIG[tx.type];
                const income = isIncome(tx);
                const amountText = `${income ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}`;
                return (
                  <Box
                    key={tx.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: TABLE_GRID,
                      alignItems: 'center',
                      py: '10px',
                      borderBottom: idx < filteredTransactions.length - 1 ? '1px solid' : 'none',
                      borderColor: '#F1F5F9',
                    }}
                  >
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                      {formatTime(tx.createdAt)}
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
                      {tx.reason || tx.orderRef || '-'}
                    </Typography>
                    <Box>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          px: '8px',
                          py: '2px',
                          borderRadius: '4px',
                          bgcolor: typeCfg.bg,
                        }}
                      >
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: typeCfg.color }}>
                          {typeCfg.label}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: income ? '#16A34A' : '#DC2626',
                        textAlign: 'right',
                      }}
                    >
                      {amountText}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B', textAlign: 'right' }}
                    >
                      {tx.balanceAfter.toLocaleString()}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Pagination */}
          {!txLoading && total > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: '4px',
              }}
            >
              <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                共 {total} 条记录
              </Typography>
              <Pagination
                count={Math.max(pages, 1)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
