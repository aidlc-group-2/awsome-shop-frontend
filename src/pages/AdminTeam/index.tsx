import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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

type Role = 'employee' | 'admin';
type Status = 'active' | 'invited';

interface Member {
  id: string;
  name: string;
  initial: string;
  email: string;
  dept: string;
  title: string;
  role: Role;
  status: Status;
  joinedAt: string;
  avatarColor: string;
}

const MEMBERS: Member[] = [
  {
    id: 'EMP-2023056',
    name: '李婷婷',
    initial: '李',
    email: 'litingting@awsome.com',
    dept: '人力资源部',
    title: 'HR 经理',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-03-12',
    avatarColor: C.purple,
  },
  {
    id: 'EMP-2024001',
    name: '张明辉',
    initial: '张',
    email: 'zhangminghui@awsome.com',
    dept: '技术研发部',
    title: '高级工程师',
    role: 'employee',
    status: 'active',
    joinedAt: '2024-01-08',
    avatarColor: C.primary,
  },
  {
    id: 'EMP-2024089',
    name: '陈思雨',
    initial: '陈',
    email: 'chensiyu@awsome.com',
    dept: '财务部',
    title: '财务专员',
    role: 'employee',
    status: 'active',
    joinedAt: '2024-06-20',
    avatarColor: C.success,
  },
  {
    id: 'EMP-2025012',
    name: '王浩然',
    initial: '王',
    email: 'wanghaoran@awsome.com',
    dept: '市场营销部',
    title: '市场专员',
    role: 'employee',
    status: 'invited',
    joinedAt: '—',
    avatarColor: C.amber,
  },
];

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string }> = {
  employee: { label: '员工', color: C.chipBlueText, bg: C.chipBlueBg },
  admin: { label: '管理员', color: C.chipOrangeText, bg: C.chipOrangeBg },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  active: { label: '在职', color: C.chipGreenText, bg: C.chipGreenBg },
  invited: { label: '待接受邀请', color: C.chipOrangeText, bg: C.chipOrangeBg },
};

export default function AdminTeam() {
  const [search, setSearch] = useState('');

  const filtered = MEMBERS.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    );
  });

  const total = MEMBERS.length;
  const adminCount = MEMBERS.filter((m) => m.role === 'admin').length;
  const employeeCount = MEMBERS.filter((m) => m.role === 'employee').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
          团队成员
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: C.white,
            bgcolor: C.primary,
            borderRadius: '8px',
            px: '16px',
            py: '8px',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
          }}
        >
          添加成员
        </Button>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: '团队总人数', value: String(total), valueColor: C.textPrimary },
          { label: '管理员', value: String(adminCount), valueColor: C.primary },
          { label: '普通员工', value: String(employeeCount), valueColor: C.success },
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索成员姓名或邮箱..."
            sx={{ fontSize: 13, flexGrow: 1, '& input::placeholder': { color: C.textDisabled, opacity: 1 } }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: 40,
            px: '14px',
            bgcolor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          <FilterListIcon sx={{ fontSize: 18, color: C.textSecondary }} />
          <Typography sx={{ fontSize: 13, color: C.textSecondary }}>全部角色</Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: C.textSecondary }} />
        </Box>

        <Typography sx={{ fontSize: 13, color: C.textSecondary, flexGrow: 1 }}>
          共 {total} 位成员
        </Typography>
      </Box>

      {/* Table Card */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '12px', border: `1px solid ${C.borderLight}`, overflow: 'hidden' }}
      >
        <TableContainer>
          <Table sx={{ '& .MuiTableCell-root': { borderColor: C.borderLight } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: C.bgPage }}>
                {['成员信息', '部门 / 职位', '角色', '加入时间', '状态', '操作'].map((h, i) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.textSecondary,
                      py: '14px',
                      px: '20px',
                      width: i === 0 ? undefined : [undefined, 160, 110, 120, 110, 100][i],
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((member) => {
                const roleCfg = ROLE_CONFIG[member.role];
                const statusCfg = STATUS_CONFIG[member.status];
                return (
                  <TableRow key={member.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* Member info */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar
                          sx={{ width: 36, height: 36, bgcolor: member.avatarColor, fontSize: 14, fontWeight: 600 }}
                        >
                          {member.initial}
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>
                            {member.name}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: C.textDisabled }}>
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Dept / Title */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Typography sx={{ fontSize: 13, color: C.textPrimary }}>{member.dept}</Typography>
                        <Typography sx={{ fontSize: 11, color: C.textSecondary }}>{member.title}</Typography>
                      </Box>
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
                      {member.joinedAt}
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

                    {/* Actions */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tooltip title="编辑">
                          <IconButton size="small" sx={{ color: C.textSecondary }}>
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="移除">
                          <IconButton size="small" sx={{ color: C.danger }}>
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: '40px', textAlign: 'center', borderBottom: 0 }}>
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
            显示 1-{filtered.length} 共 {total} 条
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PagerButton ariaLabel="上一页">
              <KeyboardArrowLeftIcon sx={{ fontSize: 18, color: C.textSecondary }} />
            </PagerButton>
            <PagerButton active>1</PagerButton>
            <PagerButton ariaLabel="下一页">
              <KeyboardArrowRightIcon sx={{ fontSize: 18, color: C.textSecondary }} />
            </PagerButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// Square pagination button (32x32, radius 4)
function PagerButton({
  children,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  ariaLabel?: string;
}) {
  return (
    <ButtonBase
      aria-label={ariaLabel}
      sx={{
        width: 32,
        height: 32,
        borderRadius: '4px',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        color: active ? C.white : C.textSecondary,
        bgcolor: active ? C.primary : 'transparent',
        border: active ? 'none' : `1px solid ${C.border}`,
        '&:hover': { bgcolor: active ? C.primary : C.bgPage },
      }}
    >
      {children}
    </ButtonBase>
  );
}
