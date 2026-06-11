import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { listMyExchanges, type ExchangeRecordDTO } from '../../services/order';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_SHIPMENT: { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  SHIPPED: { label: '已发货', color: '#2563EB', bg: '#DBEAFE' },
  COMPLETED: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  CANCELLED: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? { label: status, color: '#64748B', bg: '#F1F5F9' };

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'PENDING_SHIPMENT', label: '待发货' },
  { key: 'SHIPPED', label: '已发货' },
  { key: 'COMPLETED', label: '已完成' },
  { key: 'CANCELLED', label: '已取消' },
];

const PAGE_SIZE = 10;

const formatTime = (value: string) => value.replace('T', ' ').slice(0, 16);

export default function RedemptionHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<ExchangeRecordDTO[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listMyExchanges({ page, size: PAGE_SIZE });
        if (cancelled) return;
        setOrders(res.records);
        setTotal(res.total);
        setPages(res.pages);
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
  }, [page]);

  const filteredOrders =
    activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);

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

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: '64px' }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: '48px',
              bgcolor: '#FFFFFF',
              border: '1px solid #F1F5F9',
              borderRadius: '12px',
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#DC2626' }}>
              加载兑换记录失败：{error}
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!loading && !error && filteredOrders.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: '64px',
              bgcolor: '#FFFFFF',
              border: '1px solid #F1F5F9',
              borderRadius: '12px',
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>暂无兑换记录</Typography>
          </Box>
        )}

        {/* Order List */}
        {!loading && !error && filteredOrders.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOrders.map((order) => {
              const statusCfg = getStatusConfig(order.status);
              const cancelled = order.status === 'CANCELLED';
              const IconComp = order.productType === 'VIRTUAL' ? CardGiftcardIcon : Inventory2Icon;
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
                        订单号：{order.orderNo}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#CBD5E1' }}>
                        {formatTime(order.exchangeTime)}
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
                      opacity: cancelled ? 0.5 : 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        flexShrink: 0,
                        borderRadius: '8px',
                        bgcolor: cancelled ? '#F1F5F9' : '#DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp
                        sx={{ fontSize: 28, color: cancelled ? '#94A3B8' : '#2563EB' }}
                      />
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
                        {order.productName}
                      </Typography>
                      {order.productDesc && (
                        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                          {order.productDesc}
                        </Typography>
                      )}
                      <Typography sx={{ fontSize: 12, color: '#CBD5E1' }}>
                        x{order.quantity}
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
                          color: cancelled ? '#CBD5E1' : '#2563EB',
                        }}
                      >
                        {order.pointsCost.toLocaleString()} 积分
                      </Typography>
                      {cancelled && (
                        <Typography sx={{ fontSize: 12, color: '#16A34A' }}>
                          积分已退还
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Card Footer */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '10px',
                      px: '20px',
                      py: '12px',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
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
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Pagination */}
        {!loading && !error && total > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: '8px',
            }}
          >
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>
              共 {total} 条记录，第 {page}/{Math.max(pages, 1)} 页
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
      </Box>
    </Box>
  );
}
