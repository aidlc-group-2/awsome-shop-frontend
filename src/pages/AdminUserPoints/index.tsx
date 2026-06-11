import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
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
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { type UserDTO } from '../../services/auth';
import {
  adjustPoints,
  adminListTransactions,
  getBalance,
  type PointsTransactionDTO,
} from '../../services/points';

// Theme colors (from design tokens)
const C = {
  primary: '#2563EB',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#CBD5E1',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#16A34A',
  danger: '#DC2626',
  amber: '#D97706',
  purple: '#7C3AED',
};

const PAGE_SIZE = 10;

const TYPE_CONFIG: Record<PointsTransactionDTO['type'], { label: string; color: string; bg: string }> = {
  GRANT: { label: '积分发放', color: C.success, bg: '#DCFCE7' },
  DEDUCT: { label: '积分扣减', color: C.danger, bg: '#FEE2E2' },
  REFUND: { label: '积分退还', color: C.primary, bg: '#DBEAFE' },
  EXPIRE: { label: '积分过期', color: C.danger, bg: '#FEE2E2' },
  ADJUST: { label: '手动调整', color: C.purple, bg: '#F3E8FF' },
};

const formatDateTime = (value: string): string => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatAmount = (n: number) => `${n > 0 ? '+' : ''}${n.toLocaleString()}`;

export default function AdminUserPoints() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateUser = (location.state as { user?: UserDTO } | null)?.user;

  const userId = Number(id);
  const displayName = stateUser ? stateUser.nickname || stateUser.username : `用户 #${id}`;

  const [balance, setBalance] = useState<number | null>(null);
  const [records, setRecords] = useState<PointsTransactionDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  // 调整积分弹窗
  const [dialogOpen, setDialogOpen] = useState(false);
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBalance = useCallback(() => {
    if (!userId) return;
    getBalance(userId)
      .then((res) => setBalance(res.balance))
      .catch(() => setBalance(null));
  }, [userId]);

  const fetchTransactions = useCallback(() => {
    if (!userId) return;
    setError('');
    adminListTransactions({ userId, page, size: PAGE_SIZE })
      .then((res) => {
        setRecords(res.records);
        setTotal(res.total);
        setPages(Math.max(1, res.pages));
      })
      .catch((e: Error) => setError(e.message));
  }, [userId, page]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const openDialog = () => {
    setDelta('');
    setReason('');
    setDialogError('');
    setDialogOpen(true);
  };

  const handleAdjust = async () => {
    const deltaNum = Number(delta);
    if (!delta || Number.isNaN(deltaNum) || deltaNum === 0) {
      setDialogError('请输入非 0 的调整数值（正数加、负数减）');
      return;
    }
    if (!reason.trim()) {
      setDialogError('请填写调整原因');
      return;
    }
    setSubmitting(true);
    setDialogError('');
    try {
      // ⚠️ 已知网关问题：经认证路由后 body 中的 userId 可能被网关覆盖为当前管理员 id，
      // 导致调整落到管理员自己头上；待网关字段对齐后修复，这里按目标用户 id 正常传参。
      await adjustPoints({ userId, delta: deltaNum, reason: reason.trim() });
      setDialogOpen(false);
      setSnackbar('积分调整成功');
      fetchBalance();
      fetchTransactions();
    } catch (e) {
      setDialogError(e instanceof Error ? e.message : '积分调整失败');
    } finally {
      setSubmitting(false);
    }
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + records.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: breadcrumb + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              component="button"
              underline="none"
              onClick={() => navigate('/admin/users')}
              sx={{ fontSize: 13, color: C.primary, '&:hover': { textDecoration: 'underline' } }}
            >
              用户管理
            </Link>
            <Typography sx={{ fontSize: 13, color: C.textDisabled }}>/</Typography>
            <Typography sx={{ fontSize: 13, color: C.textSecondary }}>积分变动记录</Typography>
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>
            {displayName} 的积分变动记录
          </Typography>
        </Box>

        {/* Right: user badge + adjust button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              bgcolor: C.bgPage,
              border: `1px solid ${C.borderLight}`,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: C.primary, fontSize: 14, fontWeight: 600 }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                {stateUser ? stateUser.username : `ID: ${id}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography sx={{ fontSize: 11, color: C.textDisabled }}>当前余额</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.amber }}>
                  {balance != null ? balance.toLocaleString() : '—'} 积分
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<TuneIcon sx={{ fontSize: 18 }} />}
            onClick={openDialog}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: C.primary,
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            调整积分
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Typography sx={{ fontSize: 12, color: C.textSecondary, flexGrow: 1, textAlign: 'right' }}>
          共 {total} 条记录
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Transactions Table Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${C.borderLight}`,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: C.borderLight } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: C.bgPage }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 140, py: '12px', px: '20px' }}>
                  变动时间
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  变动类型
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  变动积分
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  变动后余额
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, py: '12px', px: '20px' }}>
                  变动原因
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '12px', px: '20px' }}>
                  操作人
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((tx) => {
                const typeCfg = TYPE_CONFIG[tx.type] ?? TYPE_CONFIG.ADJUST;
                return (
                  <TableRow key={tx.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 12, color: C.textSecondary, py: '12px', px: '20px' }}>
                      {formatDateTime(tx.createdAt)}
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Chip
                        label={typeCfg.label}
                        size="small"
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: typeCfg.color,
                          bgcolor: typeCfg.bg,
                          borderRadius: '12px',
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: '12px', px: '20px' }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: tx.amount > 0 ? C.success : C.danger,
                        }}
                      >
                        {formatAmount(tx.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, py: '12px', px: '20px' }}>
                      {tx.balanceAfter.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: C.textPrimary, py: '12px', px: '20px' }}>
                      {tx.reason || tx.orderRef || '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: C.textSecondary, py: '12px', px: '20px' }}>
                      {tx.operatorId != null ? `#${tx.operatorId}` : '系统'}
                    </TableCell>
                  </TableRow>
                );
              })}
              {records.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: '40px', textAlign: 'center', borderBottom: 0 }}>
                    <Typography sx={{ fontSize: 13, color: C.textSecondary }}>暂无积分变动记录</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: C.textSecondary }}>
          显示 {rangeStart}-{rangeEnd} 共 {total} 条记录
        </Typography>
        <Pagination
          count={pages}
          page={page}
          onChange={(_, value) => setPage(value)}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': { fontSize: 13, color: C.textPrimary },
            '& .MuiPaginationItem-root.Mui-selected': {
              bgcolor: C.primary,
              color: C.white,
              '&:hover': { bgcolor: C.primary },
            },
          }}
        />
      </Box>

      {/* Adjust Points Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 480, maxWidth: 480, borderRadius: '16px', m: 2 },
          },
        }}
      >
        {/* Dialog Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '24px',
            py: '20px',
            borderBottom: `1px solid ${C.borderLight}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                bgcolor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TuneIcon sx={{ fontSize: 20, color: C.amber }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>
                调整用户积分
              </Typography>
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                输入正数增加、负数扣减积分
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} sx={{ color: C.textSecondary, borderRadius: '8px' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Dialog Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', px: '24px', py: '20px' }}>
          {dialogError && (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              {dialogError}
            </Alert>
          )}

          {/* User info card */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: C.bgPage,
              borderRadius: '8px',
              border: `1px solid ${C.borderLight}`,
              px: '16px',
              py: '14px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: C.primary, fontSize: 16, fontWeight: 600 }}>
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
                {displayName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
              <Typography sx={{ fontSize: 11, color: C.textSecondary }}>当前积分余额</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: C.amber }}>
                {balance != null ? balance.toLocaleString() : '—'}
              </Typography>
            </Box>
          </Box>

          {/* Delta */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>调整积分数</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.danger }}>*</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: `2px solid ${C.primary}`,
                borderRadius: '8px',
                px: '12px',
                py: '10px',
              }}
            >
              <InputBase
                value={delta}
                onChange={(e) => setDelta(e.target.value.replace(/[^0-9-]/g, ''))}
                placeholder="正数增加，负数扣减，如 500 或 -200"
                inputProps={{ inputMode: 'numeric' }}
                sx={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, flexGrow: 1, '& input::placeholder': { color: C.textDisabled, opacity: 1, fontWeight: 400 } }}
              />
            </Box>
          </Box>

          {/* Reason */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>调整原因</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.danger }}>*</Typography>
            </Box>
            <InputBase
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入调整原因"
              multiline
              minRows={3}
              sx={{
                fontSize: 13,
                color: C.textPrimary,
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                px: '12px',
                py: '10px',
                alignItems: 'flex-start',
                '& textarea::placeholder': { color: C.textDisabled, opacity: 1 },
              }}
            />
          </Box>
        </Box>

        {/* Dialog Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            px: '24px',
            pt: '16px',
            pb: '20px',
            borderTop: `1px solid ${C.borderLight}`,
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: C.textPrimary,
              borderColor: C.border,
              borderRadius: '8px',
              px: '24px',
              py: '10px',
              '&:hover': { borderColor: C.textSecondary, bgcolor: 'transparent' },
            }}
          >
            取消
          </Button>
          <Button
            onClick={handleAdjust}
            disabled={submitting}
            variant="contained"
            startIcon={<CheckIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 600,
              bgcolor: C.primary,
              borderRadius: '8px',
              px: '24px',
              py: '10px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            确认调整
          </Button>
        </Box>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
