import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BackpackIcon from '@mui/icons-material/Backpack';
import type { SvgIconComponent } from '@mui/icons-material';

type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  shipped: { label: '配送中', color: '#2563EB', bg: '#DBEAFE' },
  completed: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  cancelled: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
};

const TABS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待发货' },
  { key: 'shipped', label: '配送中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

interface RedemptionOrder {
  id: string;
  time: string;
  status: OrderStatus;
  name: string;
  spec: string;
  qty: string;
  points: string;
  originalPoints?: string;
  refundNote?: string;
  trackingNo?: string;
  primaryAction: string;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
  dimmed?: boolean;
}

const ORDERS: RedemptionOrder[] = [
  {
    id: 'ORD-20260210-00158',
    time: '2026-02-10 14:30',
    status: 'pending',
    name: 'Sony WH-1000XM5 降噪耳机',
    spec: '颜色：黑色 · 包装：标准版',
    qty: 'x1',
    points: '2,480 积分',
    originalPoints: '原价 2,580',
    primaryAction: '确认收货',
    icon: HeadphonesIcon,
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
  },
  {
    id: 'ORD-20260208-00142',
    time: '2026-02-08 09:15',
    status: 'shipped',
    name: 'Apple Watch Series 9 智能手表',
    spec: '颜色：星光色 · 尺寸：45mm',
    qty: 'x1',
    points: '3,200 积分',
    trackingNo: '物流单号：SF1234567890',
    primaryAction: '确认收货',
    icon: WatchIcon,
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    id: 'ORD-20260201-00098',
    time: '2026-02-01 16:45',
    status: 'completed',
    name: '戴森 V15 无绳吸尘器',
    spec: '型号：V15 Detect · 配色：金色',
    qty: 'x1',
    points: '5,800 积分',
    primaryAction: '再次兑换',
    icon: CleaningServicesIcon,
    iconColor: '#16A34A',
    iconBg: '#DCFCE7',
  },
  {
    id: 'ORD-20260125-00071',
    time: '2026-01-25 11:20',
    status: 'cancelled',
    name: '小米旅行双肩包 Pro',
    spec: '颜色：深空灰 · 容量：26L',
    qty: 'x1',
    points: '680 积分',
    refundNote: '积分已退还',
    primaryAction: '再次兑换',
    icon: BackpackIcon,
    iconColor: '#94A3B8',
    iconBg: '#F1F5F9',
    dimmed: true,
  },
];

export default function RedemptionHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');

  const filteredOrders =
    activeTab === 'all' ? ORDERS : ORDERS.filter((o) => o.status === activeTab);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: '32px',
        px: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: 960,
          maxWidth: '100%',
          px: 2,
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
              兑换记录
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>
              查看您的所有积分兑换订单
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 280,
              height: 40,
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              px: '12px',
              gap: '8px',
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: '#CBD5E1' }} />
            <InputBase
              placeholder="搜索订单编号或商品名称"
              sx={{
                flex: 1,
                fontSize: 13,
                color: '#1E293B',
                '& ::placeholder': { color: '#CBD5E1', opacity: 1 },
              }}
            />
          </Box>
        </Box>

        {/* Filter Tabs */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            bgcolor: '#FFFFFF',
            border: '1px solid #F1F5F9',
            borderRadius: '12px',
            p: '4px',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Box
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  px: '20px',
                  py: '8px',
                  bgcolor: isActive ? '#2563EB' : 'transparent',
                  '&:hover': { bgcolor: isActive ? '#2563EB' : '#F8FAFC' },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#FFFFFF' : '#64748B',
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Order List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            const IconComp = order.icon;
            return (
              <Box
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #F1F5F9',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: '20px',
                    py: '16px',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>
                      订单号：{order.id}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#CBD5E1' }}>
                      {order.time}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: statusCfg.bg,
                      borderRadius: '12px',
                      px: '12px',
                      py: '4px',
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: statusCfg.color }}>
                      {statusCfg.label}
                    </Typography>
                  </Box>
                </Box>

                {/* Card Body */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    px: '20px',
                    py: '16px',
                    opacity: order.dimmed ? 0.5 : 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      flexShrink: 0,
                      borderRadius: '8px',
                      bgcolor: order.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp sx={{ fontSize: 28, color: order.iconColor }} />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
                      {order.name}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                      {order.spec}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#CBD5E1' }}>
                      {order.qty}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '4px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: order.dimmed ? '#CBD5E1' : '#2563EB',
                      }}
                    >
                      {order.points}
                    </Typography>
                    {order.originalPoints && (
                      <Typography sx={{ fontSize: 12, color: '#CBD5E1' }}>
                        {order.originalPoints}
                      </Typography>
                    )}
                    {order.refundNote && (
                      <Typography sx={{ fontSize: 12, color: '#16A34A' }}>
                        {order.refundNote}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Card Footer */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: order.trackingNo ? 'space-between' : 'flex-end',
                    gap: '10px',
                    px: '20px',
                    py: '12px',
                    borderTop: '1px solid #F1F5F9',
                  }}
                >
                  {order.trackingNo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LocalShippingIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                      <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                        {order.trackingNo}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                      sx={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        px: '16px',
                        py: '6px',
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#1E293B',
                        textTransform: 'none',
                        minWidth: 'auto',
                        '&:hover': { bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' },
                      }}
                    >
                      查看详情
                    </Button>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      variant="contained"
                      sx={{
                        borderRadius: '8px',
                        px: '16px',
                        py: '6px',
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'none',
                        minWidth: 'auto',
                        boxShadow: 'none',
                        bgcolor: order.status === 'shipped' ? '#16A34A' : '#2563EB',
                        '&:hover': {
                          boxShadow: 'none',
                          bgcolor: order.status === 'shipped' ? '#15803D' : '#1D4ED8',
                        },
                      }}
                    >
                      {order.primaryAction}
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: '8px',
          }}
        >
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            共 12 条记录，第 1/3 页
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18, color: '#CBD5E1' }} />
            </Box>
            {[1, 2, 3].map((page) => {
              const isActive = page === 1;
              return (
                <Box
                  key={page}
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: isActive ? '#2563EB' : 'transparent',
                    '&:hover': { bgcolor: isActive ? '#2563EB' : '#F8FAFC' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {page}
                  </Typography>
                </Box>
              );
            })}
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18, color: '#1E293B' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
