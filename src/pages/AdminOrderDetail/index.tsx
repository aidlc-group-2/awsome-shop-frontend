import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Theme colors
const COLORS = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  error: '#DC2626',
};

type OrderStatus = 'pending' | 'completed' | 'shipping' | 'cancelled';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  completed: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  shipping: { label: '配送中', color: '#2563EB', bg: '#DBEAFE' },
  cancelled: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
};

// Order data (hardcoded from design)
const ORDER = {
  id: 'EX20260208001',
  status: 'pending' as OrderStatus,
  product: {
    name: 'Sony WH-1000XM5 降噪耳机',
    spec: '规格：黑色 | 类目：数码电子 - 耳机音响',
    code: '商品编号：PRD20260101005',
    points: '2,580',
  },
  points: {
    product: '2,580',
    shipping: '0',
    total: '2,580 积分',
    balance: '5,420 积分',
  },
  employee: {
    name: '张三',
    empNo: 'EMP20230156',
    department: '技术研发部',
    contact: 'zhangsan@company.com',
  },
  orderInfo: [
    { label: '订单编号', value: 'EX20260208001' },
    { label: '下单时间', value: '2026-02-08 14:25:00' },
    { label: '订单来源', value: 'PC端' },
    { label: '备注', value: '无', muted: true },
  ],
  delivery: [
    { label: '收货人', value: '张三' },
    { label: '联系电话', value: '138****5678' },
    { label: '收货地址', value: '北京市海淀区中关村科技园 A座 12层' },
  ],
};

interface TimelineItem {
  title: string;
  desc: string;
  time: string;
  active?: boolean;
  badge?: string;
  last?: boolean;
}

const TIMELINE: TimelineItem[] = [
  {
    title: '待发货',
    desc: '订单已确认，等待仓库发货',
    time: '2026-02-08 14:30:00',
    active: true,
    badge: '当前',
  },
  {
    title: '订单确认',
    desc: '员工已确认兑换，积分已扣除',
    time: '2026-02-08 14:28:15',
  },
  {
    title: '提交兑换',
    desc: '员工提交兑换申请',
    time: '2026-02-08 14:25:00',
    last: true,
  },
];

// Reusable card wrapper - design: bg-white, radius 12, border border-light, padding 24
function SectionCard({ title, gap, children }: { title: string; gap: number; children: React.ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        p: '24px',
        borderRadius: 3,
        border: '1px solid',
        borderColor: COLORS.borderLight,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary }}>
        {title}
      </Typography>
      <Box sx={{ height: '1px', bgcolor: COLORS.borderLight, width: '100%' }} />
      {children}
    </Paper>
  );
}

// Label/value row - design: space_between
function InfoRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
      <Typography sx={{ fontSize: 13, color: COLORS.textSecondary, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: muted ? 400 : 500,
          color: muted ? COLORS.textDisabled : COLORS.textPrimary,
          textAlign: 'right',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function AdminOrderDetail() {
  const navigate = useNavigate();
  useParams();

  const statusCfg = STATUS_CONFIG[ORDER.status];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left: breadcrumb + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              component="button"
              underline="none"
              onClick={() => navigate('/admin/orders')}
              sx={{ fontSize: 13, color: COLORS.primary }}
            >
              兑换记录
            </Link>
            <Typography sx={{ fontSize: 13, color: COLORS.textDisabled }}>/</Typography>
            <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>记录详情</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary }}>
              {ORDER.id}
            </Typography>
            <Chip
              label={statusCfg.label}
              size="small"
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: statusCfg.color,
                bgcolor: statusCfg.bg,
                borderRadius: '12px',
                height: 24,
              }}
            />
          </Box>
        </Box>

        {/* Right: action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.error,
              borderColor: COLORS.error,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              '&:hover': { borderColor: COLORS.error, bgcolor: '#FEF2F2' },
            }}
          >
            取消订单
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.textPrimary,
              borderColor: COLORS.border,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              '&:hover': { borderColor: COLORS.border, bgcolor: COLORS.bgPage },
            }}
          >
            打印详情
          </Button>
          <Button
            variant="contained"
            startIcon={<LocalShippingIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: COLORS.primary,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              boxShadow: 'none',
              '&:hover': { bgcolor: COLORS.primaryHover, boxShadow: 'none' },
            }}
          >
            修改发货状态
          </Button>
        </Box>
      </Box>

      {/* Content row: left column (fill) + right column (380) */}
      <Box sx={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left column */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Product info */}
          <SectionCard title="商品信息" gap={20}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 3,
                  bgcolor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HeadphonesIcon sx={{ fontSize: 36, color: COLORS.primary }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
                  {ORDER.product.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                  {ORDER.product.spec}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textDisabled }}>
                  {ORDER.product.code}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>
                  {ORDER.product.points}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>积分</Typography>
              </Box>
            </Box>
          </SectionCard>

          {/* Points detail */}
          <SectionCard title="积分明细" gap={16}>
            <InfoRow label="商品积分" value={ORDER.points.product} />
            <InfoRow label="运费积分" value={ORDER.points.shipping} />
            <Box sx={{ height: '1px', bgcolor: COLORS.borderLight, width: '100%' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                合计消耗
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>
                {ORDER.points.total}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>兑换后余额</Typography>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                {ORDER.points.balance}
              </Typography>
            </Box>
          </SectionCard>

          {/* Employee info */}
          <SectionCard title="兑换员工" gap={16}>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <EmployeeField label="员工姓名" value={ORDER.employee.name} />
              <EmployeeField label="工号" value={ORDER.employee.empNo} />
            </Box>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <EmployeeField label="所属部门" value={ORDER.employee.department} />
              <EmployeeField label="联系方式" value={ORDER.employee.contact} />
            </Box>
          </SectionCard>
        </Box>

        {/* Right column */}
        <Box sx={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status timeline */}
          <SectionCard title="状态记录" gap={20}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {TIMELINE.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: '14px' }}>
                  {/* Marker column */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '6px',
                        bgcolor: item.active ? COLORS.primary : '#D1D5DB',
                        border: item.active ? '3px solid #DBEAFE' : 'none',
                        flexShrink: 0,
                      }}
                    />
                    {!item.last && <Box sx={{ width: 2, height: 40, bgcolor: '#E5E7EB' }} />}
                  </Box>
                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px', pb: item.last ? 0 : '4px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: item.active ? 600 : 500,
                          color: item.active ? COLORS.primary : COLORS.textPrimary,
                        }}
                      >
                        {item.title}
                      </Typography>
                      {item.badge && (
                        <Box sx={{ px: '8px', py: '2px', borderRadius: '4px', bgcolor: '#DBEAFE' }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 500, color: COLORS.primary }}>
                            {item.badge}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                      {item.desc}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: COLORS.textDisabled }}>
                      {item.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>

          {/* Order info */}
          <SectionCard title="订单信息" gap={14}>
            {ORDER.orderInfo.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} muted={row.muted} />
            ))}
          </SectionCard>

          {/* Delivery info */}
          <SectionCard title="收货信息" gap={14}>
            {ORDER.delivery.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </SectionCard>
        </Box>
      </Box>
    </Box>
  );
}

// Employee field - design: vertical, gap 6, fill_container
function EmployeeField({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary, wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Box>
  );
}
