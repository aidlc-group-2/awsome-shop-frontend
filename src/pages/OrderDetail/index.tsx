import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import HeadphonesIcon from '@mui/icons-material/Headphones';

// Theme colors (from awsome-shop.pen, modern theme values)
const COLORS = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  accent: '#D97706',
  accentBg: '#FFFBEB',
  success: '#16A34A',
  successBg: '#DCFCE7',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',
  chipBlueBg: '#DBEAFE',
};

// Order data (hardcoded from design)
const ORDER = {
  id: 'ORD-20260210-00158',
  statusLabel: '待发货',
  product: {
    name: 'Sony WH-1000XM5 降噪耳机',
    spec: '颜色：黑色 · 数量：1',
    points: '2,480 积分',
    originalPoints: '原价 2,580 积分',
  },
  points: {
    listPrice: '2,580 积分',
    discountLabel: '新人首兑优惠',
    discount: '- 100 积分',
    paid: '2,480 积分',
  },
  delivery: [
    { label: '收货人', value: '李明' },
    { label: '联系电话', value: '138****6789' },
    { label: '收货地址', value: '北京市海淀区中关村软件园 A 座 305' },
  ],
  orderInfo: [
    { label: '订单编号', value: 'ORD-20260210-00158' },
    { label: '下单时间', value: '2026-02-10 14:30:25' },
    { label: '支付方式', value: '积分支付' },
    { label: '订单来源', value: 'AWSome Shop 网页版' },
  ],
};

type StepState = 'done' | 'active' | 'pending';

interface TimelineStep {
  title: string;
  time: string;
  desc?: string;
  state: StepState;
  last?: boolean;
}

const TIMELINE: TimelineStep[] = [
  {
    title: '订单提交成功',
    time: '2026-02-10 14:30:25',
    desc: '已扣除 2,480 积分',
    state: 'done',
  },
  {
    title: '商家处理中',
    time: '2026-02-10 15:12:00',
    desc: '订单正在备货，预计明日发出',
    state: 'active',
  },
  {
    title: '已发货',
    time: '等待中',
    state: 'pending',
  },
  {
    title: '已完成',
    time: '等待中',
    state: 'pending',
    last: true,
  },
];

// Reusable card wrapper - design: bg-white, radius-lg, border border-light, padding 24
function SectionCard({
  title,
  gap,
  children,
}: {
  title: string;
  gap: number;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        p: '24px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: COLORS.borderLight,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary }}>
        {title}
      </Typography>
      <Box sx={{ height: '1px', bgcolor: COLORS.divider, width: '100%' }} />
      {children}
    </Paper>
  );
}

// Label/value row - design: space_between
function InfoRow({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <Typography sx={{ fontSize: 14, color: labelColor ?? COLORS.textSecondary, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color: valueColor ?? COLORS.textPrimary,
          textAlign: 'right',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function OrderDetail() {
  const navigate = useNavigate();
  useParams();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: COLORS.bgPage,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top nav (standalone page nav) */}
      <Box
        component="nav"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          px: '32px',
          bgcolor: COLORS.white,
          borderBottom: '1px solid',
          borderColor: COLORS.border,
        }}
      >
        {/* Left: logo + links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <RedeemIcon sx={{ fontSize: 28, color: COLORS.primary }} />
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>
              AWSome Shop
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box
              onClick={() => navigate('/')}
              sx={{
                px: '16px',
                py: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': { bgcolor: COLORS.bgPage },
              }}
            >
              <Typography sx={{ fontSize: 14, color: COLORS.textSecondary }}>首页</Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: points badge + avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              bgcolor: COLORS.accentBg,
              borderRadius: '20px',
              px: '14px',
              py: '6px',
            }}
          >
            <TollIcon sx={{ fontSize: 18, color: COLORS.accent }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.accent }}>
              2,580 积分
            </Typography>
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '20px',
              bgcolor: COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: COLORS.white }}>李</Typography>
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: '32px', px: '24px' }}>
        <Box
          sx={{
            width: 780,
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Page header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
                订单详情
              </Typography>
              <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                订单编号：{ORDER.id}
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: COLORS.successBg,
                borderRadius: '20px',
                px: '16px',
                py: '6px',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.success }}>
                {ORDER.statusLabel}
              </Typography>
            </Box>
          </Box>

          {/* Status card with timeline */}
          <SectionCard title="订单状态" gap={20}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {TIMELINE.map((step, idx) => {
                const dotFill =
                  step.state === 'done'
                    ? COLORS.success
                    : step.state === 'active'
                      ? COLORS.primary
                      : 'transparent';
                const lineFill = step.state === 'done' ? COLORS.success : COLORS.border;
                const titleColor =
                  step.state === 'active'
                    ? COLORS.primary
                    : step.state === 'pending'
                      ? COLORS.textDisabled
                      : COLORS.textPrimary;
                const timeColor = step.state === 'pending' ? COLORS.textDisabled : COLORS.textSecondary;
                return (
                  <Box key={idx} sx={{ display: 'flex', gap: '16px' }}>
                    {/* Marker column */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '6px',
                          bgcolor: dotFill,
                          border: step.state === 'pending' ? `2px solid ${COLORS.border}` : 'none',
                          flexShrink: 0,
                        }}
                      />
                      {!step.last && <Box sx={{ width: 2, height: 40, bgcolor: lineFill }} />}
                    </Box>
                    {/* Content */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        pb: step.last ? 0 : '16px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: step.state === 'pending' ? 500 : 600,
                          color: titleColor,
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: timeColor }}>{step.time}</Typography>
                      {step.desc && (
                        <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                          {step.desc}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </SectionCard>

          {/* Product card */}
          <SectionCard title="商品信息" gap={20}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '8px',
                  bgcolor: COLORS.chipBlueBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HeadphonesIcon sx={{ fontSize: 36, color: COLORS.primary }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
                  {ORDER.product.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                  {ORDER.product.spec}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '2px',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>
                  {ORDER.product.points}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textDisabled }}>
                  {ORDER.product.originalPoints}
                </Typography>
              </Box>
            </Box>
          </SectionCard>

          {/* Points detail card */}
          <SectionCard title="积分明细" gap={14}>
            <InfoRow label="商品积分价" value={ORDER.points.listPrice} />
            <InfoRow
              label={ORDER.points.discountLabel}
              value={ORDER.points.discount}
              labelColor={COLORS.accent}
              valueColor={COLORS.accent}
            />
            <Box sx={{ height: '1px', bgcolor: COLORS.divider, width: '100%' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary }}>
                实付积分
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>
                {ORDER.points.paid}
              </Typography>
            </Box>
          </SectionCard>

          {/* Delivery card */}
          <SectionCard title="收货信息" gap={14}>
            {ORDER.delivery.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </SectionCard>

          {/* Order info card */}
          <SectionCard title="订单信息" gap={14}>
            {ORDER.orderInfo.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </SectionCard>

          {/* Action buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: '8px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/orders')}
                sx={{
                  textTransform: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  bgcolor: COLORS.primary,
                  borderRadius: '8px',
                  px: '24px',
                  py: '10px',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: COLORS.primaryHover, boxShadow: 'none' },
                }}
              >
                返回订单列表
              </Button>
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: COLORS.textPrimary,
                  borderColor: COLORS.border,
                  bgcolor: COLORS.white,
                  borderRadius: '8px',
                  px: '24px',
                  py: '10px',
                  '&:hover': { borderColor: COLORS.border, bgcolor: COLORS.bgPage },
                }}
              >
                联系客服
              </Button>
            </Box>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 600,
                bgcolor: COLORS.success,
                borderRadius: '8px',
                px: '24px',
                py: '10px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#15803D', boxShadow: 'none' },
              }}
            >
              确认收货
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
