import { useEffect, useState } from 'react';
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
import InputBase from '@mui/material/InputBase';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import { listUsers, type UserDTO } from '../../services/auth';

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

const PAGE_SIZE = 20;

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  EMPLOYEE: { label: '员工', color: C.chipBlueText, bg: C.chipBlueBg },
  ADMIN: { label: '管理员', color: C.chipOrangeText, bg: C.chipOrangeBg },
};

const statusConfig = (status: string): { label: string; color: string; bg: string } => {
  const s = status.toUpperCase();
  if (s === 'ACTIVE' || s === 'ENABLED' || s === 'NORMAL') {
    return { label: '在职', color: C.chipGreenText, bg: C.chipGreenBg };
  }
  if (s === 'DISABLED' || s === 'BANNED' || s === 'LOCKED') {
    return { label: '已禁用', color: C.chipRedText, bg: C.chipRedBg };
  }
  return { label: status, color: C.chipOrangeText, bg: C.chipOrangeBg };
};

const AVATAR_COLORS = [C.primary, C.purple, C.success, C.amber, C.danger];

const formatDate = (value: string | null): string => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function AdminTeam() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<UserDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    listUsers({ page, size: PAGE_SIZE, username: search.trim() || undefined })
      .then((res) => {
        if (cancelled) return;
        setError('');
        setRecords(res.records);
        setTotal(res.total);
        setPages(Math.max(1, res.pages));
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search]);

  const adminCount = records.filter((m) => m.role === 'ADMIN').length;
  const employeeCount = records.filter((m) => m.role === 'EMPLOYEE').length;

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + records.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
          团队成员
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: '团队总人数', value: String(total), valueColor: C.textPrimary },
          { label: '管理员（本页）', value: String(adminCount), valueColor: C.primary },
          { label: '普通员工（本页）', value: String(employeeCount), valueColor: C.success },
        ].map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${C.borderLight}`,
            }}
          >
            <Typography sx={{ fontSize: 12, color: C.textSecondary }}>{stat.label}</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: stat.valueColor }}>
              {stat.value}
            </Typography>
          </Paper>
        ))}
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
            placeholder="搜索成员用户名..."
            sx={{ fontSize: 13, flexGrow: 1, '& input::placeholder': { color: C.textDisabled, opacity: 1 } }}
          />
        </Box>

        <Typography sx={{ fontSize: 13, color: C.textSecondary, flexGrow: 1 }}>
          共 {total} 位成员
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
        sx={{ borderRadius: '12px', border: `1px solid ${C.borderLight}`, overflow: 'hidden' }}
      >
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: C.borderLight } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: C.bgPage }}>
                {['成员信息', '邮箱', '角色', '加入时间', '状态'].map((h, i) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.textSecondary,
                      py: '14px',
                      px: '20px',
                      width: i === 0 ? undefined : [undefined, 220, 110, 120, 110][i],
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((member, idx) => {
                const roleCfg = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.EMPLOYEE;
                const statusCfg = statusConfig(member.status);
                const displayName = member.nickname || member.username;
                return (
                  <TableRow key={member.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* Member info */}
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
                            {member.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Email */}
                    <TableCell sx={{ fontSize: 13, color: C.textPrimary, py: '14px', px: '20px' }}>
                      {member.email}
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

                    {/* Joined */}
                    <TableCell sx={{ fontSize: 13, color: C.textPrimary, py: '14px', px: '20px' }}>
                      {formatDate(member.createdAt)}
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
                  </TableRow>
                );
              })}
              {records.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: '40px', textAlign: 'center', borderBottom: 0 }}>
                    <Typography sx={{ fontSize: 13, color: C.textSecondary }}>未找到匹配的成员</Typography>
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
    </Box>
  );
}
