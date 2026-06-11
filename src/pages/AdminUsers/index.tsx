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
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TollIcon from '@mui/icons-material/Toll';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckIcon from '@mui/icons-material/Check';

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
type Status = 'active' | 'disabled';

interface User {
  id: string;
  name: string;
  initial: string;
  empId: string;
  dept: string;
  points: number;
  orders: number;
  role: Role;
  status: Status;
  avatarColor: string;
}

const USERS: User[] = [
  {
    id: 'EMP-2024001',
    name: '张明辉',
    initial: '张',
    empId: 'EMP-2024001',
    dept: '技术研发部',
    points: 3680,
    orders: 12,
    role: 'employee',
    status: 'active',
    avatarColor: C.primary,
  },
  {
    id: 'EMP-2022118',
    name: '王建国',
    initial: '王',
    empId: 'EMP-2022118',
    dept: '市场营销部',
    points: 0,
    orders: 23,
    role: 'employee',
    status: 'disabled',
    avatarColor: C.danger,
  },
  {
    id: 'EMP-2023056',
    name: '李婷婷',
    initial: '李',
    empId: 'EMP-2023056',
    dept: '人力资源部',
    points: 5120,
    orders: 8,
    role: 'admin',
    status: 'active',
    avatarColor: C.purple,
  },
  {
    id: 'EMP-2024089',
    name: '陈思雨',
    initial: '陈',
    empId: 'EMP-2024089',
    dept: '财务部',
    points: 1450,
    orders: 5,
    role: 'employee',
    status: 'active',
    avatarColor: C.success,
  },
];

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string }> = {
  employee: { label: '员工', color: C.chipBlueText, bg: C.chipBlueBg },
  admin: { label: '管理员', color: C.chipOrangeText, bg: C.chipOrangeBg },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  active: { label: '正常', color: C.chipGreenText, bg: C.chipGreenBg },
  disabled: { label: '已禁用', color: C.chipRedText, bg: C.chipRedBg },
};

const REASONS = ['活动补发', '兑换扣减', '系统调整', '违规扣分', '其他'];

const formatPoints = (n: number) => n.toLocaleString('en-US');

export default function AdminUsers() {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'sub'>('add');
  const [amount, setAmount] = useState('500');
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState('2月团建活动参与奖励积分补发');

  const openAdjustDialog = (user: User) => {
    setSelectedUser(user);
    setAdjustType('add');
    setAmount('500');
    setReason(REASONS[0]);
    setNote('2月团建活动参与奖励积分补发');
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const goToPointsHistory = (id: string) => navigate(`/admin/users/${id}/points`);

  const numericAmount = Number(amount.replace(/[^0-9]/g, '')) || 0;
  const currentBalance = selectedUser?.points ?? 0;
  const resultingBalance =
    adjustType === 'add' ? currentBalance + numericAmount : currentBalance - numericAmount;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: C.textPrimary }}>
          用户管理
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: C.textSecondary,
            borderColor: C.border,
            borderRadius: '8px',
            px: '20px',
            py: '10px',
            '&:hover': { borderColor: C.textSecondary, bgcolor: 'transparent' },
          }}
        >
          导出数据
        </Button>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: '总用户数', value: '356', sub: '较上月 +12', valueColor: C.textPrimary, subColor: C.success },
          { label: '活跃用户', value: '218', sub: '占比 61.2%', valueColor: C.primary, subColor: C.textSecondary },
          { label: '本月新增', value: '12', sub: '较上月 +3', valueColor: C.success, subColor: C.success },
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
            <Typography sx={{ fontSize: 11, color: stat.subColor }}>{stat.sub}</Typography>
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
            placeholder="搜索用户名或工号..."
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
          共 356 位用户
        </Typography>
      </Box>

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
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 130, py: '14px', px: '20px' }}>
                  部门
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 100, py: '14px', px: '20px' }}>
                  积分余额
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 90, py: '14px', px: '20px' }}>
                  兑换次数
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 110, py: '14px', px: '20px' }}>
                  角色
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 80, py: '14px', px: '20px' }}>
                  状态
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, width: 140, py: '14px', px: '20px' }}>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {USERS.map((user) => {
                const roleCfg = ROLE_CONFIG[user.role];
                const statusCfg = STATUS_CONFIG[user.status];
                const isDisabled = user.status === 'disabled';
                return (
                  <TableRow key={user.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* User info */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: user.avatarColor,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {user.initial}
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>
                            {user.name}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: C.textDisabled }}>
                            工号: {user.empId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Dept */}
                    <TableCell sx={{ fontSize: 13, color: C.textPrimary, py: '14px', px: '20px' }}>
                      {user.dept}
                    </TableCell>

                    {/* Points */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: user.points > 0 ? C.amber : C.textDisabled,
                        }}
                      >
                        {formatPoints(user.points)}
                      </Typography>
                    </TableCell>

                    {/* Orders */}
                    <TableCell sx={{ fontSize: 13, color: C.textPrimary, py: '14px', px: '20px' }}>
                      {user.orders}
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

                    {/* Actions */}
                    <TableCell sx={{ py: '14px', px: '20px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tooltip title="调整积分">
                          <IconButton size="small" onClick={() => openAdjustDialog(user)} sx={{ color: C.amber }}>
                            <TollIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="积分明细">
                          <IconButton size="small" onClick={() => goToPointsHistory(user.id)} sx={{ color: C.textSecondary }}>
                            <HistoryIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑">
                          <IconButton size="small" sx={{ color: C.textSecondary }}>
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        {isDisabled ? (
                          <Tooltip title="启用">
                            <IconButton size="small" sx={{ color: C.success }}>
                              <LockOpenIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="禁用">
                            <IconButton size="small" sx={{ color: C.amber }}>
                              <BlockIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          <Typography sx={{ fontSize: 12, color: C.textSecondary }}>显示 1-10 共 356 条</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PagerButton ariaLabel="上一页">
              <KeyboardArrowLeftIcon sx={{ fontSize: 18, color: C.textSecondary }} />
            </PagerButton>
            <PagerButton active>1</PagerButton>
            <PagerButton>2</PagerButton>
            <PagerButton>3</PagerButton>
            <Typography sx={{ fontSize: 12, color: C.textSecondary, px: '4px' }}>...</Typography>
            <PagerButton>36</PagerButton>
            <PagerButton ariaLabel="下一页">
              <KeyboardArrowRightIcon sx={{ fontSize: 18, color: C.textSecondary }} />
            </PagerButton>
          </Box>
        </Box>
      </Paper>

      {/* Adjust Points Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        slotProps={{
          paper: {
            sx: { width: 500, maxWidth: 500, borderRadius: '16px', m: 2 },
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
                bgcolor: C.chipOrangeBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TollIcon sx={{ fontSize: 20, color: C.amber }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>
                调整用户积分
              </Typography>
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                手动增加或扣减用户积分余额
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={closeDialog} sx={{ color: C.textSecondary, borderRadius: '8px' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Dialog Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', px: '24px', py: '20px' }}>
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
              <Avatar
                sx={{ width: 40, height: 40, bgcolor: selectedUser?.avatarColor ?? C.primary, fontSize: 16, fontWeight: 600 }}
              >
                {selectedUser?.initial}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
                  {selectedUser?.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                  {selectedUser?.empId} · {selectedUser?.dept}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
              <Typography sx={{ fontSize: 11, color: C.textSecondary }}>当前积分余额</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: C.amber }}>
                {formatPoints(currentBalance)}
              </Typography>
            </Box>
          </Box>

          {/* Adjust type */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FieldLabel text="调整类型" required />
            <Box sx={{ display: 'flex', gap: '12px' }}>
              <TypeOption
                selected={adjustType === 'add'}
                onClick={() => setAdjustType('add')}
                icon={<AddCircleIcon sx={{ fontSize: 20, color: adjustType === 'add' ? C.primary : C.textSecondary }} />}
                label="增加积分"
              />
              <TypeOption
                selected={adjustType === 'sub'}
                onClick={() => setAdjustType('sub')}
                icon={<RemoveCircleOutlineIcon sx={{ fontSize: 20, color: adjustType === 'sub' ? C.primary : C.textSecondary }} />}
                label="扣减积分"
              />
            </Box>
          </Box>

          {/* Amount */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FieldLabel text="调整积分数" required />
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
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: adjustType === 'add' ? C.primary : C.danger }}>
                {adjustType === 'add' ? '+' : '−'}
              </Typography>
              <InputBase
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                inputProps={{ inputMode: 'numeric' }}
                sx={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, flexGrow: 1 }}
              />
            </Box>
            <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
              调整后余额：{formatPoints(resultingBalance)} 积分
            </Typography>
          </Box>

          {/* Reason */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FieldLabel text="调整原因" required />
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                fontSize: 13,
                color: C.textPrimary,
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
                '& .MuiSelect-select': { py: '10px', px: '12px' },
              }}
            >
              {REASONS.map((r) => (
                <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Note */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>备注说明</Typography>
            <InputBase
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              }}
            />
          </Box>
        </Box>

        {/* Dialog Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            px: '24px',
            pt: '16px',
            pb: '20px',
            borderTop: `1px solid ${C.borderLight}`,
          }}
        >
          <Button
            onClick={closeDialog}
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
            onClick={closeDialog}
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

// Required/optional field label
function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <Box sx={{ display: 'flex', gap: '2px' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>{text}</Typography>
      {required && <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.danger }}>*</Typography>}
    </Box>
  );
}

// Adjust-type selectable option (radio style)
function TypeOption({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '10px',
        borderRadius: '8px',
        px: '16px',
        py: '12px',
        bgcolor: selected ? C.primaryBg : 'transparent',
        border: selected ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${selected ? C.primary : C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: C.primary }} />}
      </Box>
      {icon}
      <Typography
        sx={{ fontSize: 13, fontWeight: selected ? 600 : 400, color: selected ? C.primary : C.textPrimary }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}
