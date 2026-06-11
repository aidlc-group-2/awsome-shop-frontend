import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import WorkIcon from '@mui/icons-material/Work';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CelebrationIcon from '@mui/icons-material/Celebration';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HERO_STATS = [
  { value: '15,280', label: '累计获得' },
  { value: '2,700', label: '累计使用' },
  { value: '6', label: '兑换次数' },
];

const QUICK_ACTIONS = [
  { label: '积分商城', icon: ShoppingBagIcon, color: '#2563EB', bg: '#EFF6FF' },
  { label: '兑换记录', icon: ReceiptLongIcon, color: '#D97706', bg: '#FFFBEB' },
  { label: '积分规则', icon: InfoIcon, color: '#16A34A', bg: '#DCFCE7' },
  { label: '帮助中心', icon: HelpIcon, color: '#DC2626', bg: '#FEE2E2' },
];

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

const FILTERS = ['全部', '收入', '支出'];

interface TransactionRow {
  time: string;
  desc: string;
  typeLabel: string;
  typeColor: string;
  typeBg: string;
  amount: string;
  amountColor: string;
  balance: string;
}

const TRANSACTIONS: TransactionRow[] = [
  {
    time: '2026-02-10 14:30',
    desc: '兑换 Sony WH-1000XM5 降噪耳机',
    typeLabel: '兑换',
    typeColor: '#92400E',
    typeBg: '#FEF3C7',
    amount: '-2,480',
    amountColor: '#DC2626',
    balance: '12,580',
  },
  {
    time: '2026-02-01 09:00',
    desc: '2026年春节福利积分发放',
    typeLabel: '福利',
    typeColor: '#166534',
    typeBg: '#DCFCE7',
    amount: '+800',
    amountColor: '#16A34A',
    balance: '15,060',
  },
  {
    time: '2026-01-15 10:00',
    desc: 'Q4 绩效奖励（A级）',
    typeLabel: '绩效',
    typeColor: '#1E40AF',
    typeBg: '#DBEAFE',
    amount: '+1,500',
    amountColor: '#16A34A',
    balance: '14,260',
  },
  {
    time: '2026-01-10 08:00',
    desc: '兑换 Apple Watch Series 9 智能手表',
    typeLabel: '兑换',
    typeColor: '#92400E',
    typeBg: '#FEF3C7',
    amount: '-3,200',
    amountColor: '#DC2626',
    balance: '12,760',
  },
  {
    time: '2026-01-01 00:00',
    desc: '2026年度工龄积分发放（3年）',
    typeLabel: '工龄',
    typeColor: '#1D4ED8',
    typeBg: '#EFF6FF',
    amount: '+3,000',
    amountColor: '#16A34A',
    balance: '15,960',
  },
];

const TABLE_GRID = '160px 1fr 80px 100px 90px';

export default function PointsCenter() {
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
                12,580
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

          {/* Hero Stats */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {HERO_STATS.map((stat, idx) => (
              <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#BFDBFE' }}>{stat.label}</Typography>
                </Box>
                {idx < HERO_STATS.length - 1 && (
                  <Box sx={{ width: '1px', height: 36, bgcolor: '#3B82F6' }} />
                )}
              </Box>
            ))}
          </Box>
        </Box>

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
              {FILTERS.map((filter, idx) => (
                <Box
                  key={filter}
                  sx={{
                    px: '12px',
                    py: '4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    bgcolor: idx === 0 ? '#2563EB' : 'transparent',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: idx === 0 ? 600 : 500,
                      color: idx === 0 ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {filter}
                  </Typography>
                </Box>
              ))}
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

          {/* Table Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {TRANSACTIONS.map((row, idx) => (
              <Box
                key={`${row.time}-${idx}`}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: TABLE_GRID,
                  alignItems: 'center',
                  py: '10px',
                  borderBottom: idx < TRANSACTIONS.length - 1 ? '1px solid' : 'none',
                  borderColor: '#F1F5F9',
                }}
              >
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>{row.time}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
                  {row.desc}
                </Typography>
                <Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      px: '8px',
                      py: '2px',
                      borderRadius: '4px',
                      bgcolor: row.typeBg,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: row.typeColor }}>
                      {row.typeLabel}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: row.amountColor, textAlign: 'right' }}
                >
                  {row.amount}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B', textAlign: 'right' }}
                >
                  {row.balance}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* View More */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              py: '10px',
              cursor: 'pointer',
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#2563EB' }}>
              查看更多记录
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#2563EB' }} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
