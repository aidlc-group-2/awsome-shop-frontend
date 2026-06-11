import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { getMyExchange, cancelExchange, type ExchangeRecordDTO } from '../../services/order';
import { useAuthStore } from '../../store/useAuthStore';

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
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_SHIPMENT: { label: '待发货', color: COLORS.accent, bg: '#FFF7ED' },
  SHIPPED: { label: '已发货', color: COLORS.primary, bg: COLORS.chipBlueBg },
  COMPLETED: { label: '已完成', color: '#166534', bg: COLORS.successBg },
  CANCELLED: { label: '已取消', color: COLORS.danger, bg: COLORS.dangerBg },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? { label: status, color: COLORS.textSecondary, bg: COLORS.borderLight };

const formatTime = (value: string) => value.replace('T', ' ').slice(0, 19);

type StepState = 'done' | 'active' | 'pending';

interface TimelineStep {
  title: string;
  time: string;
  desc?: string;
  state: StepState;
}

function buildTimeline(order: ExchangeRecordDTO): TimelineStep[] {
  const submitted: TimelineStep = {
    title: '订单提交成功',
    time: formatTime(order.exchangeTime),
    desc: `已扣除 ${order.pointsCost.toLocaleString()} 积分`,
    state: 'done',
  };
  if (order.status === 'CANCELLED') {
    return [
      submitted,
      {
        title: '已取消',
        time: formatTime(order.updatedAt),
        desc: '积分已退还',
        state: 'done',
      },
    ];
  }
  if (order.productType === 'VIRTUAL') {
    return [
      submitted,
      { title: '已完成', time: formatTime(order.updatedAt), state: 'done' },
    ];
  }
  const shippedState: StepState =
    order.status === 'COMPLETED' ? 'done' : order.status === 'SHIPPED' ? 'active' : 'pending';
  return [
    submitted,
    {
      title: '待发货',
      time: order.status === 'PENDING_SHIPMENT' ? '商家备货中' : formatTime(order.exchangeTime),
      state: order.status === 'PENDING_SHIPMENT' ? 'active' : 'done',
    },
    {
      title: '已发货',
      time: shippedState === 'pending' ? '等待中' : formatTime(order.updatedAt),
      state: shippedState,
    },
    {
      title: '已完成',
      time: order.status === 'COMPLETED' ? formatTime(order.updatedAt) : '等待中',
      state: order.status === 'COMPLETED' ? 'done' : 'pending',
    },
  ];
}

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
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);

  const [order, setOrder] = useState<ExchangeRecordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!id) {
      setError('缺少订单 ID');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getMyExchange(Number(id));
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载订单失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleConfirmCancel = async () => {
    if (!order) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelExchange(order.id);
      setCancelDialogOpen(false);
      await loadOrder();
      useAuthStore.getState().refreshPoints();
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : '取消订单失败');
    } finally {
      setCancelling(false);
    }
  };

  const statusCfg = order ? getStatusConfig(order.status) : null;
  const ProductIcon = order?.productType === 'VIRTUAL' ? CardGiftcardIcon : Inventory2Icon;
  const timeline = order ? buildTimeline(order) : [];

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
              {(user?.points ?? 0).toLocaleString()} 积分
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
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: COLORS.white }}>
              {(user?.displayName ?? '?').charAt(0)}
            </Typography>
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
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: '80px' }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              加载订单详情失败：{error}
            </Alert>
          )}

          {!loading && !error && order && statusCfg && (
            <>
              {/* Page header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Typography sx={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
                    订单详情
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                    订单编号：{order.orderNo}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: statusCfg.bg,
                    borderRadius: '20px',
                    px: '16px',
                    py: '6px',
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: statusCfg.color }}>
                    {statusCfg.label}
                  </Typography>
                </Box>
              </Box>

              {/* Status card with timeline */}
              <SectionCard title="订单状态" gap={20}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {timeline.map((step, idx) => {
                    const last = idx === timeline.length - 1;
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
                    const timeColor =
                      step.state === 'pending' ? COLORS.textDisabled : COLORS.textSecondary;
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
                          {!last && <Box sx={{ width: 2, height: 40, bgcolor: lineFill }} />}
                        </Box>
                        {/* Content */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            pb: last ? 0 : '16px',
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
                    <ProductIcon sx={{ fontSize: 36, color: COLORS.primary }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
                      {order.productName}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                      {order.productDesc
                        ? `${order.productDesc} · 数量：${order.quantity}`
                        : `数量：${order.quantity}`}
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
                      {order.pointsCost.toLocaleString()} 积分
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: COLORS.textDisabled }}>
                      {order.productType === 'VIRTUAL' ? '虚拟商品' : '实物商品'}
                    </Typography>
                  </Box>
                </Box>
              </SectionCard>

              {/* Points detail card */}
              <SectionCard title="积分明细" gap={14}>
                <InfoRow
                  label="商品积分价"
                  value={`${order.pointsCost.toLocaleString()} 积分`}
                />
                <InfoRow label="兑换数量" value={`x${order.quantity}`} />
                <Box sx={{ height: '1px', bgcolor: COLORS.divider, width: '100%' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary }}>
                    实付积分
                  </Typography>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>
                    {order.pointsCost.toLocaleString()} 积分
                  </Typography>
                </Box>
              </SectionCard>

              {/* Delivery card */}
              {order.shippingInfo && (
                <SectionCard title="收货信息" gap={14}>
                  <InfoRow label="收货人" value={order.shippingInfo.recipient ?? '-'} />
                  <InfoRow label="联系电话" value={order.shippingInfo.phone ?? '-'} />
                  <InfoRow label="收货地址" value={order.shippingInfo.address ?? '-'} />
                </SectionCard>
              )}

              {/* Order info card */}
              <SectionCard title="订单信息" gap={14}>
                <InfoRow label="订单编号" value={order.orderNo} />
                <InfoRow label="下单时间" value={formatTime(order.exchangeTime)} />
                <InfoRow label="兑换人" value={order.employeeName} />
                <InfoRow label="支付方式" value="积分支付" />
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
                {order.status === 'PENDING_SHIPMENT' && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setCancelError(null);
                      setCancelDialogOpen(true);
                    }}
                    sx={{
                      textTransform: 'none',
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.danger,
                      borderColor: COLORS.danger,
                      borderRadius: '8px',
                      px: '24px',
                      py: '10px',
                      '&:hover': { borderColor: COLORS.danger, bgcolor: COLORS.dangerBg },
                    }}
                  >
                    取消订单
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Cancel confirm dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => {
          if (!cancelling) setCancelDialogOpen(false);
        }}
      >
        <DialogTitle>取消订单</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要取消该订单吗？取消后已扣除的积分将自动退还。
          </DialogContentText>
          {cancelError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cancelError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={cancelling}
            sx={{ textTransform: 'none' }}
          >
            再想想
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            disabled={cancelling}
            sx={{ textTransform: 'none', boxShadow: 'none' }}
          >
            {cancelling ? '取消中…' : '确认取消'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
