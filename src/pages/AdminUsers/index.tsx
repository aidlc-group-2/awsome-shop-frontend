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
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TollIcon from '@mui/icons-material/Toll';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { listUsers, changeUserRole, type UserDTO } from '../../services/auth';

// Theme colors (from design tokens)
const C = {
  primary: '#2563EB',
  primaryBg: '#EFF6FF',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#CBD5E1',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#16A34A',
  amber: '#D97706',
  danger: '#DC2626',
  purple: '#7C3AED',
  chipBlueBg: '#DBEAFE',
  chipBlueText: '#1E40AF',
  chipGreenBg: '#DCFCE7',
  chipGreenText: '#166534',
  chipOrangeBg: '#FEF3C7',
  chipOrangeText: '#92400E',
  chipRedBg: '#FEE2E2',
  chipRedText: '#991B1B',
};

const PAGE_SIZE = 10;

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  EMPLOYEE: { label: '员工', color: C.chipBlueText, bg: C.chipBlueBg },
  ADMIN: { label: '管理员', color: C.chipOrangeText, bg: C.chipOrangeBg },
};

const statusConfig = (status: string): { label: string; color: string; bg: string } => {
  const s = status.toUpperCase();
  if (s === 'ACTIVE' || s === 'ENABLED' || s === 'NORMAL') {
    return { label: '正常', color: C.chipGreenText, bg: C.chipGreenBg };
  }
  if (s === 'DISABLED' || s === 'BANNED' || s === 'LOCKED') {
    return { label: '已禁用', color: C.chipRedText, bg: C.chipRedBg };
  }
  return { label: status, color: C.chipBlueText, bg: C.chipBlueBg };
};

const AVATAR_COLORS = [C.primary, C.purple, C.success, C.amber, C.danger];

const formatDateTime = (value: string | null): string => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AdminUsers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<UserDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  // 角色变更确认弹窗
  const [roleDialogUser, setRoleDialogUser] = useState<UserDTO | null>(null);
  const [roleDialogError, setRoleDialogError] = useState('');
  const [changingRole, setChangingRole] = useState(false);

  const fetchUsers = useCallback(() => {
    setError('');
    listUsers({
      page,
      size: PAGE_SIZE,
      username: search.trim() || undefined,
      role: roleFilter === 'all' ? undefined : roleFilter,
    })
      .then((res) => {
        setRecords(res.records);
        setTotal(res.total);
        setPages(Math.max(1, res.pages));
      })
      .catch((e: Error) => setError(e.message));
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openRoleDialog = (user: UserDTO) => {
    setRoleDialogError('');
    setRoleDialogUser(user);
  };

  const closeRoleDialog = () => setRoleDialogUser(null);

  const confirmRoleChange = async () => {
    if (!roleDialogUser) return;
    const targetRole = roleDialogUser.role === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN';
    setChangingRole(true);
    setRoleDialogError('');
    try {
      await changeUserRole(roleDialogUser.id, targetRole);
      setSnackbar('角色变更成功');
      setRoleDialogUser(null);
      fetchUsers();
    } catch (e) {
      setRoleDialogError(e instanceof Error ? e.message : '角色变更失败');
    } finally {
      setChangingRole(false);
    }
  };

  const goToPoints = (user: UserDTO) =>
    navigate(`/admin/users/${user.id}/points`, { state: { user } });

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + records.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
          用户管理
        </Typography>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 280,
            height: 40,
            px: '12px',
            bgcolor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: C.textSecondary }} />
          <InputBase
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="搜索用户名..."
            sx={{ fontSize: 13, flexGrow: 1, '& input::placeholder': { color: C.textDisabled, opacity: 1 } }}
          />
        </Box>

        <Select
          value={roleFilter}
          onChange={(e: SelectChangeEvent) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            height: 40,
            bgcolor: C.white,
            borderRadius: '8px',
            fontSize: 13,
            color: C.textSecondary,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
            '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: 13 }}>
            全部角色
          </MenuItem>
          <MenuItem value="EMPLOYEE" sx={{ fontSize: 13 }}>
            员工
          </MenuItem>
          <MenuItem value="ADMIN" sx={{ fontSize: 13 }}>
            管理员
          </MenuItem>
        </Select>

        <Typography sx={{ fontSize: 13, color: C.textSecondary, flexGrow: 1 }}>
          共 {total} 位用户
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Table Card */}
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
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, py: '14px', px: '20px' }}>
                  用户信息
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 200, py: '14px', px: '20px' }}>
                  邮箱
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 110, py: '14px', px: '20px' }}>
                  角色
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 90, py: '14px', px: '20px' }}>
                  状态
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 160, py: '14px', px: '20px' }}>
                  最后登录
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 120, py: '14px', px: '20px' }}>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((user, idx) => {
                const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.EMPLOYEE;
                const statusCfg = statusConfig(user.status);
                const displayName = user.nickname || user.username;
                return (
                  <TableRow key={user.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* User info */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>
                            {displayName}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: C.textDisabled }}>
                            用户名: {user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell sx={{ fontSize: 13, color: C.textPrimary, py: '14px', px: '20px' }}>
                      {user.email}
                    </TableCell>

                    {/* Role */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Chip
                        label={roleCfg.label}
                        size="small"
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: roleCfg.color,
                          bgcolor: roleCfg.bg,
                          borderRadius: '12px',
                          height: 24,
                        }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
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

                    {/* Last login */}
                    <TableCell sx={{ fontSize: 12, color: C.textSecondary, py: '14px', px: '20px' }}>
                      {formatDateTime(user.lastLoginAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tooltip title="积分">
                          <IconButton size="small" onClick={() => goToPoints(user)} sx={{ color: C.amber }}>
                            <TollIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.role === 'ADMIN' ? '降为员工' : '升为管理员'}>
                          <IconButton size="small" onClick={() => openRoleDialog(user)} sx={{ color: C.textSecondary }}>
                            <ManageAccountsIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {records.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: '40px', textAlign: 'center', borderBottom: 0 }}>
                    <Typography sx={{ fontSize: 13, color: C.textSecondary }}>暂无用户数据</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '20px',
            py: '12px',
            borderTop: `1px solid ${C.borderLight}`,
          }}
        >
          <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
            显示 {rangeStart}-{rangeEnd} 共 {total} 条
          </Typography>
          <Pagination
            count={pages}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': { fontSize: 12, color: C.textSecondary },
              '& .MuiPaginationItem-root.Mui-selected': {
                bgcolor: C.primary,
                color: C.white,
                '&:hover': { bgcolor: C.primary },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Role Change Confirm Dialog */}
      <Dialog
        open={!!roleDialogUser}
        onClose={closeRoleDialog}
        slotProps={{
          paper: {
            sx: { width: 440, maxWidth: 440, borderRadius: '16px', m: 2 },
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
                bgcolor: C.primaryBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ManageAccountsIcon sx={{ fontSize: 20, color: C.primary }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>
              变更用户角色
            </Typography>
          </Box>
          <IconButton onClick={closeRoleDialog} sx={{ color: C.textSecondary, borderRadius: '8px' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Dialog Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', px: '24px', py: '20px' }}>
          {roleDialogError && (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              {roleDialogError}
            </Alert>
          )}
          <Typography sx={{ fontSize: 14, color: C.textPrimary }}>
            确认将用户
            <Typography component="span" sx={{ fontSize: 14, fontWeight: 700, color: C.primary }}>
              {' '}{roleDialogUser ? roleDialogUser.nickname || roleDialogUser.username : ''}{' '}
            </Typography>
            的角色从
            <Typography component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
              {' '}{roleDialogUser?.role === 'ADMIN' ? '管理员' : '员工'}{' '}
            </Typography>
            变更为
            <Typography component="span" sx={{ fontSize: 14, fontWeight: 600, color: C.amber }}>
              {' '}{roleDialogUser?.role === 'ADMIN' ? '员工' : '管理员'}{' '}
            </Typography>
            吗？
          </Typography>
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
            onClick={closeRoleDialog}
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
            onClick={confirmRoleChange}
            disabled={changingRole}
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
            确认变更
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
