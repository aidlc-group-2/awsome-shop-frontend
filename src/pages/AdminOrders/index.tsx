import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import type { SvgIconComponent } from '@mui/icons-material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RedeemIcon from '@mui/icons-material/Redeem';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
  adminExchangeStats,
  adminListExchanges,
  adminShipExchange,
  type ExchangeRecordDTO,
  type ExchangeStatsDTO,
} from '../../services/order';

// Theme colors
const COLORS = {
  primary: '#2563EB',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_SHIPMENT: { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  SHIPPED: { label: '已发货', color: '#2563EB', bg: '#DBEAFE' },
  COMPLETED: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  CANCELLED: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
};

const FALLBACK_STATUS = { label: '未知', color: '#64748B', bg: '#F1F5F9' };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '全部状态' },
  { value: 'PENDING_SHIPMENT', label: '待发货' },
  { value: 'SHIPPED', label: '已发货' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
];

interface StatCardConfig {
  key: keyof ExchangeStatsDTO;
  label: string;
  valueColor: string;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const STAT_CARDS: StatCardConfig[] = [
  { key: 'totalCount', label: '总兑换数', valueColor: COLORS.textPrimary, icon: ReceiptLongIcon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { key: 'pendingDeliveryCount', label: '待发货', valueColor: '#F59E0B', icon: LocalShippingIcon, iconColor: '#F59E0B', iconBg: '#FFF7ED' },
  { key: 'completedCount', label: '已完成', valueColor: '#10B981', icon: CheckCircleIcon, iconColor: '#10B981', iconBg: '#ECFDF5' },
  { key: 'totalPointsConsumed', label: '消耗积分', valueColor: COLORS.textPrimary, icon: TollIcon, iconColor: '#7C3AED', iconBg: '#F5F3FF' },
];

const PAGE_SIZE = 10;

const headerCellSx = {
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.textSecondary,
  py: '12px',
  px: '20px',
  borderBottom: 'none',
};

const bodyCellSx = {
  py: '12px',
  px: '20px',
  borderColor: COLORS.borderLight,
};

function formatDate(value: string): string {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 10);
}

export default function AdminOrders() {
  const navigate = useNavigate();

  // List state
  const [records, setRecords] = useState<ExchangeRecordDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');

  // Stats
  const [stats, setStats] = useState<ExchangeStatsDTO | null>(null);

  // Ship confirm dialog
  const [shipTarget, setShipTarget] = useState<ExchangeRecordDTO | null>(null);
  const [shipping, setShipping] = useState(false);

  // 触发列表重新加载（在事件处理器中调用）
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = useCallback(() => {
    adminExchangeStats()
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    let cancelled = false;
    adminListExchanges({
      page,
      size: PAGE_SIZE,
      keyword: keyword || undefined,
      status: status || undefined,
    })
      .then((result) => {
        if (cancelled) return;
        setRecords(result.records);
        setTotal(result.total);
        setPages(result.pages);
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
  }, [page, keyword, status, refreshKey]);

  const refreshList = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const triggerSearch = () => {
    setPage(1);
    setKeyword(searchInput.trim());
    refreshList();
  };

  const handleStatusChange = (value: string) => {
    setPage(1);
    setStatus(value);
    refreshList();
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    refreshList();
  };

  const confirmShip = () => {
    if (!shipTarget) return;
    setShipping(true);
    adminShipExchange(shipTarget.id)
      .then(() => {
        setShipTarget(null);
        setError(null);
        refreshList();
        loadStats();
      })
      .catch((err: Error) => {
        setShipTarget(null);
        setError(err.message);
      })
      .finally(() => setShipping(false));
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
            兑换记录管理
          </Typography>
          <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
            查看和管理员工积分兑换订单
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textPrimary,
            bgcolor: COLORS.white,
            borderColor: COLORS.border,
            borderRadius: '8px',
            px: '20px',
            py: '10px',
            '&:hover': { borderColor: COLORS.border, bgcolor: COLORS.bgPage },
          }}
        >
          导出记录
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STAT_CARDS.map((stat) => {
          const IconComp = stat.icon;
          return (
            <Paper
              key={stat.key}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: '18px 20px',
                borderRadius: 3,
                border: '1px solid',
                borderColor: COLORS.borderLight,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    bgcolor: stat.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComp sx={{ fontSize: 18, color: stat.iconColor }} />
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: COLORS.textSecondary }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: stat.valueColor }}>
                {stats ? stats[stat.key].toLocaleString() : '...'}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Toolbar: search + filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: 260,
            height: 38,
            px: '12px',
            bgcolor: COLORS.white,
            border: '1px solid',
            borderColor: COLORS.border,
            borderRadius: '8px',
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          <InputBase
            placeholder="搜索订单号 / 员工姓名"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') triggerSearch();
            }}
            sx={{ fontSize: 13, flex: 1, color: COLORS.textPrimary }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={triggerSearch}
          sx={{
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            height: 38,
            bgcolor: COLORS.primary,
            borderRadius: '8px',
            px: '16px',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
          }}
        >
          搜索
        </Button>

        <Select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            height: 38,
            fontSize: 13,
            color: COLORS.textPrimary,
            bgcolor: COLORS.white,
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: COLORS.primary,
              borderWidth: 2,
            },
            '& .MuiSelect-select': { py: '8px', px: '14px' },
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Records Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: COLORS.borderLight,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.bgPage }}>
                <TableCell sx={{ ...headerCellSx, width: 150 }}>订单编号</TableCell>
                <TableCell sx={headerCellSx}>商品信息</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 100 }}>兑换员工</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 90 }}>消耗积分</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 110 }}>兑换时间</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 80 }}>状态</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 110 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ borderBottom: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: '40px' }}>
                      <CircularProgress size={28} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ borderBottom: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: '40px' }}>
                      <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                        暂无兑换记录
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  const statusCfg = STATUS_CONFIG[record.status] ?? FALLBACK_STATUS;
                  const ProductIcon = record.productType === 'VIRTUAL' ? RedeemIcon : Inventory2Icon;
                  const productIconColor = record.productType === 'VIRTUAL' ? '#F59E0B' : '#2563EB';
                  const productIconBg = record.productType === 'VIRTUAL' ? '#FFF7ED' : '#DBEAFE';
                  return (
                    <TableRow
                      key={record.id}
                      hover
                      onClick={() => navigate(`/admin/orders/${record.id}`)}
                      sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ ...bodyCellSx, fontSize: 12, fontWeight: 500, color: COLORS.primary }}>
                        {record.orderNo}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '6px',
                              bgcolor: productIconBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <ProductIcon sx={{ fontSize: 18, color: productIconColor }} />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
                              {record.productName}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: COLORS.textSecondary }}>
                              {record.productDesc ?? ''}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, fontSize: 12, color: COLORS.textPrimary }}>
                        {record.employeeName}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
                        {record.pointsCost.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, fontSize: 12, color: COLORS.textSecondary }}>
                        {formatDate(record.exchangeTime)}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Chip
                          label={statusCfg.label}
                          size="small"
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: statusCfg.color,
                            bgcolor: statusCfg.bg,
                            borderRadius: '12px',
                            height: 22,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            component="button"
                            underline="none"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/orders/${record.id}`);
                            }}
                            sx={{ fontSize: 12, fontWeight: 500, color: COLORS.primary }}
                          >
                            详情
                          </Link>
                          {record.status === 'PENDING_SHIPMENT' && (
                            <Link
                              component="button"
                              underline="none"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShipTarget(record);
                              }}
                              sx={{ fontSize: 12, fontWeight: 500, color: '#D97706' }}
                            >
                              发货
                            </Link>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
          {total > 0 ? `显示 ${rangeStart}-${rangeEnd} 共 ${total.toLocaleString()} 条记录` : '共 0 条记录'}
        </Typography>
        <Pagination
          count={Math.max(pages, 1)}
          page={page}
          onChange={(_e, value) => handlePageChange(value)}
          shape="rounded"
          color="primary"
        />
      </Box>

      {/* Ship confirm dialog */}
      <Dialog
        open={shipTarget !== null}
        onClose={() => {
          if (!shipping) setShipTarget(null);
        }}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: '90vw',
            borderRadius: '16px',
            m: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: '20px 24px',
            borderBottom: '1px solid',
            borderColor: COLORS.borderLight,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 20, color: COLORS.primary }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
                确认发货
              </Typography>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                {shipTarget?.orderNo ?? ''}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setShipTarget(null)}
            disabled={shipping}
            sx={{ color: COLORS.textSecondary, borderRadius: 2 }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box sx={{ p: '20px 24px' }}>
          <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
            确认将订单「{shipTarget?.productName ?? ''}」标记为已发货吗？
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '12px',
            p: '16px 24px 20px 24px',
            borderTop: '1px solid',
            borderColor: COLORS.borderLight,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setShipTarget(null)}
            disabled={shipping}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.textPrimary,
              borderColor: COLORS.border,
              borderRadius: '8px',
              px: '24px',
              py: '10px',
              '&:hover': { borderColor: COLORS.border, bgcolor: COLORS.bgPage },
            }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckIcon sx={{ fontSize: 18 }} />}
            onClick={confirmShip}
            disabled={shipping}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: COLORS.primary,
              borderRadius: '8px',
              px: '24px',
              py: '10px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            {shipping ? '提交中...' : '确认发货'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
