import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PrintIcon from '@mui/icons-material/Print';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RedeemIcon from '@mui/icons-material/Redeem';
import {
  adminCompleteExchange,
  adminGetExchange,
  adminShipExchange,
  type ExchangeRecordDTO,
} from '../../services/order';

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_SHIPMENT: { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  SHIPPED: { label: '已发货', color: '#2563EB', bg: '#DBEAFE' },
  COMPLETED: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  CANCELLED: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
};

const FALLBACK_STATUS = { label: '未知', color: '#64748B', bg: '#F1F5F9' };

const PRODUCT_TYPE_LABEL: Record<'PHYSICAL' | 'VIRTUAL', string> = {
  PHYSICAL: '实物商品',
  VIRTUAL: '虚拟商品',
};

function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 19);
}

interface TimelineItem {
  title: string;
  desc: string;
  time: string;
  active?: boolean;
  badge?: string;
}

function buildTimeline(record: ExchangeRecordDTO): TimelineItem[] {
  if (record.status === 'CANCELLED') {
    return [
      {
        title: '已取消',
        desc: '订单已取消，积分已退回',
        time: formatDateTime(record.updatedAt),
        active: true,
        badge: '当前',
      },
      {
        title: '提交兑换',
        desc: '员工提交兑换申请',
        time: formatDateTime(record.exchangeTime),
      },
    ];
  }

  const stepIndex =
    record.status === 'COMPLETED' ? 3 : record.status === 'SHIPPED' ? 2 : 1;

  const steps: TimelineItem[] = [
    {
      title: '待发货',
      desc: '订单已确认，等待仓库发货',
      time: formatDateTime(record.exchangeTime),
    },
    {
      title: '已发货',
      desc: '商品已发出，等待签收',
      time: stepIndex >= 2 ? formatDateTime(record.updatedAt) : '',
    },
    {
      title: '已完成',
      desc: '订单已完成',
      time: stepIndex >= 3 ? formatDateTime(record.updatedAt) : '',
    },
  ];

  // 仅保留已到达的步骤，最新的在最上方
  const reached = steps.slice(0, stepIndex).reverse();
  if (reached.length > 0) {
    reached[0] = { ...reached[0], active: true, badge: '当前' };
  }
  reached.push({
    title: '提交兑换',
    desc: '员工提交兑换申请',
    time: formatDateTime(record.exchangeTime),
  });
  return reached;
}

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

type PendingAction = 'ship' | 'complete';

export default function AdminOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [record, setRecord] = useState<ExchangeRecordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 触发详情重新加载（在事件处理器中调用）
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const numericId = Number(id);
    if (!id || Number.isNaN(numericId)) {
      Promise.resolve().then(() => {
        if (cancelled) return;
        setError('无效的订单ID');
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }
    adminGetExchange(numericId)
      .then((data) => {
        if (cancelled) return;
        setRecord(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  const confirmAction = () => {
    if (!record || !pendingAction) return;
    setSubmitting(true);
    const action =
      pendingAction === 'ship'
        ? adminShipExchange(record.id)
        : adminCompleteExchange(record.id);
    action
      .then(() => {
        setPendingAction(null);
        setError(null);
        setRefreshKey((k) => k + 1);
      })
      .catch((err: Error) => {
        setPendingAction(null);
        setError(err.message);
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: '80px' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', p: '32px' }}>
        <Alert severity="error">{error ?? '未找到该订单'}</Alert>
        <Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/orders')}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              color: COLORS.textPrimary,
              borderColor: COLORS.border,
              borderRadius: '8px',
            }}
          >
            返回兑换记录
          </Button>
        </Box>
      </Box>
    );
  }

  const statusCfg = STATUS_CONFIG[record.status] ?? FALLBACK_STATUS;
  const timeline = buildTimeline(record);
  const ProductIcon = record.productType === 'VIRTUAL' ? RedeemIcon : Inventory2Icon;
  const totalPoints = record.pointsCost.toLocaleString();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
              {record.orderNo}
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
          {record.status === 'PENDING_SHIPMENT' && (
            <Button
              variant="contained"
              startIcon={<LocalShippingIcon sx={{ fontSize: 18 }} />}
              onClick={() => setPendingAction('ship')}
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
              发货
            </Button>
          )}
          {record.status === 'SHIPPED' && (
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
              onClick={() => setPendingAction('complete')}
              sx={{
                textTransform: 'none',
                fontSize: 13,
                fontWeight: 600,
                bgcolor: '#16A34A',
                borderRadius: '8px',
                px: '16px',
                py: '8px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#15803D', boxShadow: 'none' },
              }}
            >
              完成订单
            </Button>
          )}
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
                <ProductIcon sx={{ fontSize: 36, color: COLORS.primary }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
                  {record.productName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                  {record.productDesc ?? '-'}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textDisabled }}>
                  {`商品编号：${record.productId} | 类型：${PRODUCT_TYPE_LABEL[record.productType]} | 数量：${record.quantity}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 20, fontWeight: 700, color: COLORS.primary }}>
                  {totalPoints}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>积分</Typography>
              </Box>
            </Box>
          </SectionCard>

          {/* Points detail */}
          <SectionCard title="积分明细" gap={16}>
            <InfoRow label="商品积分" value={totalPoints} />
            <InfoRow label="兑换数量" value={String(record.quantity)} />
            <Box sx={{ height: '1px', bgcolor: COLORS.borderLight, width: '100%' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                合计消耗
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>
                {`${totalPoints} 积分`}
              </Typography>
            </Box>
          </SectionCard>

          {/* Employee info */}
          <SectionCard title="兑换员工" gap={16}>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <EmployeeField label="员工姓名" value={record.employeeName} />
              <EmployeeField label="用户ID" value={String(record.userId)} />
            </Box>
          </SectionCard>
        </Box>

        {/* Right column */}
        <Box sx={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status timeline */}
          <SectionCard title="状态记录" gap={20}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {timeline.map((item, idx) => {
                const isLast = idx === timeline.length - 1;
                return (
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
                      {!isLast && <Box sx={{ width: 2, height: 40, bgcolor: '#E5E7EB' }} />}
                    </Box>
                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px', pb: isLast ? 0 : '4px' }}>
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
                      {item.time && (
                        <Typography sx={{ fontSize: 11, color: COLORS.textDisabled }}>
                          {item.time}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </SectionCard>

          {/* Order info */}
          <SectionCard title="订单信息" gap={14}>
            <InfoRow label="订单编号" value={record.orderNo} />
            <InfoRow label="下单时间" value={formatDateTime(record.exchangeTime)} />
            <InfoRow label="商品类型" value={PRODUCT_TYPE_LABEL[record.productType]} />
            <InfoRow label="创建时间" value={formatDateTime(record.createdAt)} />
            <InfoRow label="更新时间" value={formatDateTime(record.updatedAt)} />
          </SectionCard>

          {/* Delivery info */}
          {record.shippingInfo && (
            <SectionCard title="收货信息" gap={14}>
              <InfoRow label="收货人" value={record.shippingInfo.recipient ?? '-'} />
              <InfoRow label="联系电话" value={record.shippingInfo.phone ?? '-'} />
              <InfoRow label="收货地址" value={record.shippingInfo.address ?? '-'} />
            </SectionCard>
          )}
        </Box>
      </Box>

      {/* Action confirm dialog */}
      <Dialog
        open={pendingAction !== null}
        onClose={() => {
          if (!submitting) setPendingAction(null);
        }}
        PaperProps={{ sx: { width: 400, maxWidth: '90vw', borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
          {pendingAction === 'ship' ? '确认发货' : '确认完成订单'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
            {pendingAction === 'ship'
              ? `确认将订单「${record.orderNo}」标记为已发货吗？`
              : `确认将订单「${record.orderNo}」标记为已完成吗？`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px 20px 24px' }}>
          <Button
            variant="outlined"
            onClick={() => setPendingAction(null)}
            disabled={submitting}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.textPrimary,
              borderColor: COLORS.border,
              borderRadius: '8px',
              px: '20px',
              '&:hover': { borderColor: COLORS.border, bgcolor: COLORS.bgPage },
            }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={confirmAction}
            disabled={submitting}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: COLORS.primary,
              borderRadius: '8px',
              px: '20px',
              boxShadow: 'none',
              '&:hover': { bgcolor: COLORS.primaryHover, boxShadow: 'none' },
            }}
          >
            {submitting ? '提交中...' : '确认'}
          </Button>
        </DialogActions>
      </Dialog>
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
