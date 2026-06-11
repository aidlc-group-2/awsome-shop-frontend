import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import ButtonBase from '@mui/material/ButtonBase';
import TuneIcon from '@mui/icons-material/Tune';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Theme colors (from design tokens)
const C = {
  primary: '#2563EB',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#CBD5E1',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#16A34A',
  danger: '#DC2626',
  amber: '#D97706',
  purple: '#7C3AED',
};

// User summary (hardcoded from design)
const USER = {
  name: '张明辉',
  initial: '张',
  empId: 'EMP-2024001',
  dept: '技术研发部',
  balance: '3,680',
};

const STATS = [
  { label: '累计获得', value: '12,480', sub: '历史总获得积分', valueColor: C.success },
  { label: '累计消耗', value: '8,300', sub: '历史总消耗积分', valueColor: C.danger },
  { label: '手动调整', value: '+500', sub: '管理员手动增减', valueColor: C.primary },
  { label: '变动次数', value: '38', sub: '总积分变动记录', valueColor: C.textPrimary },
];

type TxType = 'manual' | 'redeem' | 'rule' | 'event' | 'expire';

interface PointsTx {
  time: string;
  type: TxType;
  amount: string;
  positive: boolean;
  balanceAfter: string;
  reason: string;
  operator: string;
}

const TYPE_CONFIG: Record<TxType, { label: string; color: string; bg: string }> = {
  manual: { label: '手动调整', color: C.primary, bg: '#DBEAFE' },
  redeem: { label: '商品兑换', color: C.danger, bg: '#FEE2E2' },
  rule: { label: '规则发放', color: C.success, bg: '#DCFCE7' },
  event: { label: '事件触发', color: C.purple, bg: '#F3E8FF' },
  expire: { label: '积分过期', color: C.danger, bg: '#FEE2E2' },
};

const TRANSACTIONS: PointsTx[] = [
  {
    time: '2026-02-08 15:20',
    type: 'manual',
    amount: '+500',
    positive: true,
    balanceAfter: '3,680',
    reason: '活动补发 - 2月团建活动参与奖励',
    operator: '管理员 李明',
  },
  {
    time: '2026-02-08 14:30',
    type: 'redeem',
    amount: '-2,580',
    positive: false,
    balanceAfter: '3,180',
    reason: '兑换 Sony WH-1000XM5 降噪耳机',
    operator: '系统',
  },
  {
    time: '2026-02-01 09:00',
    type: 'rule',
    amount: '+500',
    positive: true,
    balanceAfter: '5,760',
    reason: '每月基础积分发放',
    operator: '系统',
  },
  {
    time: '2026-01-28 11:45',
    type: 'redeem',
    amount: '-1,980',
    positive: false,
    balanceAfter: '5,260',
    reason: '兑换 Apple Watch SE 智能手表',
    operator: '系统',
  },
  {
    time: '2026-01-20 10:00',
    type: 'event',
    amount: '+200',
    positive: true,
    balanceAfter: '7,240',
    reason: '入职周年纪念奖励',
    operator: '系统',
  },
  {
    time: '2026-01-15 16:30',
    type: 'expire',
    amount: '-300',
    positive: false,
    balanceAfter: '7,040',
    reason: '2025年Q3未使用积分过期清零',
    operator: '系统',
  },
];

export default function AdminUserPoints() {
  const navigate = useNavigate();
  useParams<{ id: string }>();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: breadcrumb + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              component="button"
              underline="none"
              onClick={() => navigate('/admin/users')}
              sx={{ fontSize: 13, color: C.primary, '&:hover': { textDecoration: 'underline' } }}
            >
              用户管理
            </Link>
            <Typography sx={{ fontSize: 13, color: C.textDisabled }}>/</Typography>
            <Typography sx={{ fontSize: 13, color: C.textSecondary }}>积分变动记录</Typography>
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>
            {USER.name} 的积分变动记录
          </Typography>
        </Box>

        {/* Right: user badge + adjust button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              bgcolor: C.bgPage,
              border: `1px solid ${C.borderLight}`,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: C.primary, fontSize: 14, fontWeight: 600 }}>
              {USER.initial}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                {USER.empId} · {USER.dept}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography sx={{ fontSize: 11, color: C.textDisabled }}>当前余额</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.amber }}>
                  {USER.balance} 积分
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<TuneIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: C.primary,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            调整积分
          </Button>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STATS.map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${C.borderLight}`,
            }}
          >
            <Typography sx={{ fontSize: 12, color: C.textSecondary }}>{stat.label}</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: stat.valueColor }}>
              {stat.value}
            </Typography>
            <Typography sx={{ fontSize: 11, color: C.textDisabled }}>{stat.sub}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: 38,
            px: '14px',
            bgcolor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: 13, color: C.textPrimary }}>全部类型</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 18, color: C.textSecondary }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: 38,
            px: '14px',
            bgcolor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 16, color: C.textSecondary }} />
          <Typography sx={{ fontSize: 13, color: C.textPrimary }}>最近30天</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 18, color: C.textSecondary }} />
        </Box>

        <Typography sx={{ fontSize: 12, color: C.textSecondary, flexGrow: 1, textAlign: 'right' }}>
          共 38 条记录
        </Typography>
      </Box>

      {/* Transactions Table Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${C.borderLight}`,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: C.borderLight } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: C.bgPage }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 140, py: '12px', px: '20px' }}>
                  变动时间
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  变动类型
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  变动积分
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  变动后余额
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, py: '12px', px: '20px' }}>
                  变动原因
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  操作人
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TRANSACTIONS.map((tx, idx) => {
                const typeCfg = TYPE_CONFIG[tx.type];
                return (
                  <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 12, color: C.textSecondary, py: '12px', px: '20px' }}>
                      {tx.time}
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Chip
                        label={typeCfg.label}
                        size="small"
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: typeCfg.color,
                          bgcolor: typeCfg.bg,
                          borderRadius: '12px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: tx.positive ? C.success : C.danger,
                        }}
                      >
                        {tx.amount}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, py: '12px', px: '20px' }}>
                      {tx.balanceAfter}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: C.textPrimary, py: '12px', px: '20px' }}>
                      {tx.reason}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: C.textSecondary, py: '12px', px: '20px' }}>
                      {tx.operator}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: C.textSecondary }}>显示 1-6 共 38 条记录</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <PagerButton ariaLabel="上一页">
            <KeyboardArrowLeftIcon sx={{ fontSize: 18, color: C.textSecondary }} />
          </PagerButton>
          <PagerButton active>1</PagerButton>
          <PagerButton>2</PagerButton>
          <PagerButton>3</PagerButton>
          <PagerButton>...</PagerButton>
          <PagerButton>7</PagerButton>
          <PagerButton ariaLabel="下一页">
            <KeyboardArrowRightIcon sx={{ fontSize: 18, color: C.textSecondary }} />
          </PagerButton>
        </Box>
      </Box>
    </Box>
  );
}

// Square pagination button (32x32, radius 6)
function PagerButton({
  children,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  ariaLabel?: string;
}) {
  return (
    <ButtonBase
      aria-label={ariaLabel}
      sx={{
        width: 32,
        height: 32,
        borderRadius: '6px',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? C.white : C.textPrimary,
        bgcolor: active ? C.primary : C.white,
        border: active ? 'none' : `1px solid ${C.border}`,
        '&:hover': { bgcolor: active ? C.primary : C.bgPage },
      }}
    >
      {children}
    </ButtonBase>
  );
}
