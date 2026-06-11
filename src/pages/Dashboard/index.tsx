import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import type { SvgIconComponent } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import { adminExchangeStats, type ExchangeStatsDTO } from '../../services/order';

interface MetricCardConfig {
  key: keyof ExchangeStatsDTO;
  label: string;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const METRIC_CARDS: MetricCardConfig[] = [
  {
    key: 'totalCount',
    label: '总订单数',
    icon: ShoppingCartIcon,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
  },
  {
    key: 'pendingDeliveryCount',
    label: '待发货',
    icon: LocalShippingIcon,
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    key: 'completedCount',
    label: '已完成',
    icon: CheckCircleIcon,
    iconColor: '#16A34A',
    iconBg: '#DCFCE7',
  },
  {
    key: 'totalPointsConsumed',
    label: '总积分消耗',
    icon: TollIcon,
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
  },
];

type OrderStatus = 'completed' | 'pending' | 'processing';

interface RecentOrder {
  user: string;
  product: string;
  points: string;
  status: OrderStatus;
  time: string;
}

const RECENT_ORDERS: RecentOrder[] = [
  { user: '王芳', product: '星巴克礼品卡 200元', points: '680', status: 'completed', time: '02-10 14:30' },
  { user: '李明', product: 'Sony WH-1000XM5 降噪耳机', points: '2,580', status: 'pending', time: '02-10 11:20' },
  { user: '赵敏', product: '小米双肩背包 都市休闲款', points: '450', status: 'processing', time: '02-09 16:45' },
  { user: '孙磊', product: 'Apple Watch Series 9', points: '3,200', status: 'completed', time: '02-09 09:15' },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  completed: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  pending: { label: '待发货', color: '#1E40AF', bg: '#DBEAFE' },
  processing: { label: '处理中', color: '#92400E', bg: '#FEF3C7' },
};

export default function Dashboard() {
  const { t } = useTranslation();

  const [stats, setStats] = useState<ExchangeStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    adminExchangeStats()
      .then((data) => {
        if (mounted) {
          setStats(data);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Dashboard Header */}
      <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
        {t('admin.dashboard')}
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Metric Cards - design: gap 20 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {METRIC_CARDS.map((metric) => {
          const IconComp = metric.icon;
          const value = stats ? stats[metric.key].toLocaleString() : loading ? '...' : '—';
          return (
            <Paper
              key={metric.key}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: '#F1F5F9',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {metric.label}
                </Typography>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: metric.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComp sx={{ fontSize: 20, color: metric.iconColor }} />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: 'text.primary' }}>
                {value}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Recent Orders Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: '#F1F5F9',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid',
            borderColor: '#F1F5F9',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
            {t('admin.recentOrders')}
          </Typography>
          <Link
            component="button"
            underline="none"
            sx={{ fontSize: 13, color: 'primary.main' }}
          >
            {t('admin.viewAll')} →
          </Link>
        </Box>

        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: '#F1F5F9' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', width: 120, py: '10px', px: '20px' }}>
                  {t('admin.table.user')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', py: '10px', px: '20px' }}>
                  {t('admin.table.product')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', width: 80, py: '10px', px: '20px' }}>
                  {t('admin.table.points')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', width: 90, py: '10px', px: '20px' }}>
                  {t('admin.table.status')}
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', width: 120, py: '10px', px: '20px' }}>
                  {t('admin.table.time')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {RECENT_ORDERS.map((order, idx) => {
                const statusCfg = STATUS_CONFIG[order.status];
                return (
                  <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.user}</TableCell>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.product}</TableCell>
                    <TableCell sx={{ fontSize: 13, py: '12px', px: '20px' }}>{order.points}</TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Chip
                        label={statusCfg.label}
                        size="small"
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: statusCfg.color,
                          bgcolor: statusCfg.bg,
                          borderRadius: '12px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: 'text.secondary', py: '12px', px: '20px' }}>
                      {order.time}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
