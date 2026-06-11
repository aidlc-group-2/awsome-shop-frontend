import { useState } from 'react';
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
import TextField from '@mui/material/TextField';
import type { SvgIconComponent } from '@mui/icons-material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import RedeemIcon from '@mui/icons-material/Redeem';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

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

type OrderStatus = 'pending' | 'completed' | 'shipping' | 'cancelled';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '待发货', color: '#D97706', bg: '#FFF7ED' },
  completed: { label: '已完成', color: '#166534', bg: '#DCFCE7' },
  shipping: { label: '配送中', color: '#2563EB', bg: '#DBEAFE' },
  cancelled: { label: '已取消', color: '#DC2626', bg: '#FEE2E2' },
};

interface StatCard {
  label: string;
  value: string;
  valueColor: string;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const STATS: StatCard[] = [
  { label: '总兑换数', value: '1,284', valueColor: COLORS.textPrimary, icon: ReceiptLongIcon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { label: '待发货', value: '23', valueColor: '#F59E0B', icon: LocalShippingIcon, iconColor: '#F59E0B', iconBg: '#FFF7ED' },
  { label: '已完成', value: '1,198', valueColor: '#10B981', icon: CheckCircleIcon, iconColor: '#10B981', iconBg: '#ECFDF5' },
  { label: '消耗积分', value: '586,400', valueColor: COLORS.textPrimary, icon: TollIcon, iconColor: '#7C3AED', iconBg: '#F5F3FF' },
];

interface ExchangeRecord {
  id: string;
  productName: string;
  productDesc: string;
  productIcon: SvgIconComponent;
  productIconColor: string;
  productIconBg: string;
  employee: string;
  points: string;
  date: string;
  status: OrderStatus;
}

const RECORDS: ExchangeRecord[] = [
  {
    id: 'EX20260208001',
    productName: 'Sony WH-1000XM5',
    productDesc: '降噪耳机 · 黑色',
    productIcon: HeadphonesIcon,
    productIconColor: '#2563EB',
    productIconBg: '#DBEAFE',
    employee: '张三',
    points: '2,580',
    date: '2026-02-08',
    status: 'pending',
  },
  {
    id: 'EX20260207015',
    productName: 'Apple Watch SE',
    productDesc: '智能手表 · 午夜色',
    productIcon: WatchIcon,
    productIconColor: '#8B5CF6',
    productIconBg: '#F5F3FF',
    employee: '李四',
    points: '1,980',
    date: '2026-02-07',
    status: 'completed',
  },
  {
    id: 'EX20260207012',
    productName: '星巴克礼品卡',
    productDesc: '200元面值',
    productIcon: RedeemIcon,
    productIconColor: '#F59E0B',
    productIconBg: '#FFF7ED',
    employee: '王五',
    points: '680',
    date: '2026-02-07',
    status: 'completed',
  },
  {
    id: 'EX20260206088',
    productName: 'Bose QC45',
    productDesc: '降噪耳机 · 白色',
    productIcon: LocalShippingIcon,
    productIconColor: '#D97706',
    productIconBg: '#FEF3C7',
    employee: '赵六',
    points: '2,280',
    date: '2026-02-06',
    status: 'shipping',
  },
  {
    id: 'EX20260205042',
    productName: '京东购物卡 500元',
    productDesc: '电子卡券 · 即时发放',
    productIcon: RedeemIcon,
    productIconColor: '#DC2626',
    productIconBg: '#FEE2E2',
    employee: '孙七',
    points: '1,500',
    date: '2026-02-05',
    status: 'cancelled',
  },
];

const PAGE_NUMBERS = ['1', '2', '3', '...', '257'];

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: '待发货' },
  { value: 'shipping', label: '配送中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const COURIER_OPTIONS = ['顺丰速运', '中通快递', '圆通速递', '京东物流', '韵达快递'];

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

export default function AdminOrders() {
  const navigate = useNavigate();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState<ExchangeRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('shipping');
  const [courier, setCourier] = useState('顺丰速运');
  const [trackingNo, setTrackingNo] = useState('SF1234567890123');
  const [note, setNote] = useState('商品已从仓库发出');

  const openStatusDialog = (record: ExchangeRecord) => {
    setActiveRecord(record);
    setTargetStatus('shipping');
    setCourier('顺丰速运');
    setTrackingNo('SF1234567890123');
    setNote('商品已从仓库发出');
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const currentStatusCfg = activeRecord ? STATUS_CONFIG[activeRecord.status] : STATUS_CONFIG.pending;

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

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STATS.map((stat) => {
          const IconComp = stat.icon;
          return (
            <Paper
              key={stat.label}
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
                {stat.value}
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
            sx={{ fontSize: 13, flex: 1, color: COLORS.textPrimary }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: 38,
            px: '14px',
            bgcolor: COLORS.white,
            border: '1px solid',
            borderColor: COLORS.border,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>全部状态</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: COLORS.textSecondary }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: 38,
            px: '14px',
            bgcolor: COLORS.white,
            border: '1px solid',
            borderColor: COLORS.border,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 16, color: COLORS.textSecondary }} />
          <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>最近30天</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: COLORS.textSecondary }} />
        </Box>
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
                <TableCell sx={{ ...headerCellSx, width: 130 }}>订单编号</TableCell>
                <TableCell sx={headerCellSx}>商品信息</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 100 }}>兑换员工</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 90 }}>消耗积分</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 110 }}>兑换时间</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 80 }}>状态</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 96 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {RECORDS.map((record) => {
                const statusCfg = STATUS_CONFIG[record.status];
                const ProductIcon = record.productIcon;
                return (
                  <TableRow key={record.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ ...bodyCellSx, fontSize: 12, fontWeight: 500, color: COLORS.primary }}>
                      {record.id}
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '6px',
                            bgcolor: record.productIconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ProductIcon sx={{ fontSize: 18, color: record.productIconColor }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
                            {record.productName}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: COLORS.textSecondary }}>
                            {record.productDesc}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, fontSize: 12, color: COLORS.textPrimary }}>
                      {record.employee}
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
                      {record.points}
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, fontSize: 12, color: COLORS.textSecondary }}>
                      {record.date}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Link
                          component="button"
                          underline="none"
                          onClick={() => navigate(`/admin/orders/${record.id}`)}
                          sx={{ fontSize: 12, fontWeight: 500, color: COLORS.primary }}
                        >
                          详情
                        </Link>
                        <IconButton
                          size="small"
                          aria-label="修改发货状态"
                          onClick={() => openStatusDialog(record)}
                          sx={{ color: COLORS.textSecondary }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
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
        <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
          显示 1-5 共 1,284 条记录
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <PageButton aria-label="上一页">
            <ChevronLeftIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          </PageButton>
          {PAGE_NUMBERS.map((num, idx) => {
            const isActive = num === '1';
            const isEllipsis = num === '...';
            return (
              <PageButton key={`${num}-${idx}`} active={isActive} disabled={isEllipsis}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? COLORS.white : COLORS.textPrimary,
                  }}
                >
                  {num}
                </Typography>
              </PageButton>
            );
          })}
          <PageButton aria-label="下一页">
            <ChevronRightIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          </PageButton>
        </Box>
      </Box>

      {/* Status-change Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        PaperProps={{
          sx: {
            width: 480,
            maxWidth: '90vw',
            borderRadius: '16px',
            m: 0,
          },
        }}
      >
        {/* Modal header */}
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
                修改发货状态
              </Typography>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                {activeRecord?.id ?? ''}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={closeDialog} sx={{ color: COLORS.textSecondary, borderRadius: 2 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Modal body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '20px 24px' }}>
          {/* Current status */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              p: '12px 16px',
              bgcolor: '#FFF7ED',
              borderRadius: '8px',
            }}
          >
            <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>当前状态</Typography>
            <Box
              sx={{
                px: '12px',
                py: '4px',
                borderRadius: '12px',
                bgcolor: COLORS.white,
                border: `1px solid ${currentStatusCfg.color}`,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: currentStatusCfg.color }}>
                {currentStatusCfg.label}
              </Typography>
            </Box>
            <ArrowForwardIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
          </Box>

          {/* Target status */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FieldLabel required>目标状态</FieldLabel>
            <Select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
              IconComponent={KeyboardArrowDownIcon}
              sx={selectSx}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Courier company */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FieldLabel required>快递公司</FieldLabel>
            <Select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              sx={selectSx}
            >
              {COURIER_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Tracking number */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FieldLabel required>快递单号</FieldLabel>
            <TextField
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              fullWidth
              size="small"
              sx={textFieldSx}
            />
          </Box>

          {/* Note */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FieldLabel>备注说明</FieldLabel>
            <TextField
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              sx={textFieldSx}
            />
          </Box>
        </Box>

        {/* Modal footer */}
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
            onClick={closeDialog}
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
            onClick={closeDialog}
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
            确认修改
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

const selectSx = {
  fontSize: 13,
  color: COLORS.textPrimary,
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.border },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  '& .MuiSelect-select': { py: '10px', px: '12px' },
} as const;

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: 13,
    borderRadius: '8px',
    '& fieldset': { borderColor: COLORS.border },
    '&:hover fieldset': { borderColor: COLORS.border },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 2 },
  },
} as const;

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Box sx={{ display: 'flex', gap: '2px' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.textPrimary }}>
        {children}
      </Typography>
      {required && (
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#DC2626' }}>*</Typography>
      )}
    </Box>
  );
}

function PageButton({
  children,
  active,
  disabled,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  return (
    <Box
      component="button"
      aria-label={ariaLabel}
      disabled={disabled}
      sx={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        cursor: disabled ? 'default' : 'pointer',
        bgcolor: active ? COLORS.primary : COLORS.white,
        border: active ? 'none' : `1px solid ${COLORS.border}`,
        p: 0,
        '&:hover': { bgcolor: active ? COLORS.primary : COLORS.bgPage },
      }}
    >
      {children}
    </Box>
  );
}
