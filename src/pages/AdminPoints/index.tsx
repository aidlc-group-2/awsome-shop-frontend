import { useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RuleIcon from '@mui/icons-material/Rule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CakeIcon from '@mui/icons-material/Cake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ---- Theme colors (design "light/blue" theme) ----
const COLORS = {
  primary: '#2563EB',
  pageBg: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#16A34A',
  amber: '#D97706',
  danger: '#DC2626',
  purple: '#7C3AED',
  chipGreenBg: '#DCFCE7',
  chipGreenText: '#166534',
  chipRedBg: '#FEE2E2',
  chipRedText: '#991B1B',
};

// ---- Stat cards ----
interface StatCard {
  label: string;
  value: string;
  valueColor: string;
  icon: ComponentType<SvgIconProps>;
  iconColor: string;
  iconBg: string;
}

const STAT_CARDS: StatCard[] = [
  { label: '规则总数', value: '6', valueColor: COLORS.textPrimary, icon: RuleIcon, iconColor: '#2563EB', iconBg: '#EFF6FF' },
  { label: '已启用', value: '5', valueColor: '#10B981', icon: CheckCircleIcon, iconColor: '#10B981', iconBg: '#ECFDF5' },
  { label: '本月发放', value: '128,500', valueColor: COLORS.textPrimary, icon: TollIcon, iconColor: '#F59E0B', iconBg: '#FFF7ED' },
  { label: '覆盖员工', value: '257', valueColor: COLORS.textPrimary, icon: GroupIcon, iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
];

// ---- Rules table ----
interface RuleRow {
  name: string;
  description: string;
  icon: ComponentType<SvgIconProps>;
  iconColor: string;
  iconBg: string;
  typeLabel: string;
  typeColor: string;
  typeBg: string;
  points: string;
  pointsColor: string;
  trigger: string;
  enabled: boolean;
}

const RULE_ROWS: RuleRow[] = [
  {
    name: '每月基础积分',
    description: '每月固定发放基础福利积分',
    icon: CalendarMonthIcon,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    typeLabel: '固定发放',
    typeColor: '#2563EB',
    typeBg: '#EFF6FF',
    points: '500',
    pointsColor: COLORS.textPrimary,
    trigger: '每月1日自动发放',
    enabled: true,
  },
  {
    name: '入职周年奖励',
    description: '入职满一年及每年周年日奖励',
    icon: WorkspacePremiumIcon,
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
    typeLabel: '事件触发',
    typeColor: '#8B5CF6',
    typeBg: '#F5F3FF',
    points: '200',
    pointsColor: COLORS.textPrimary,
    trigger: '员工入职周年日触发',
    enabled: true,
  },
  {
    name: '生日祝福积分',
    description: '员工生日当天发放祝福积分',
    icon: CakeIcon,
    iconColor: '#F59E0B',
    iconBg: '#FFF7ED',
    typeLabel: '事件触发',
    typeColor: '#D97706',
    typeBg: '#FFF7ED',
    points: '100',
    pointsColor: COLORS.textPrimary,
    trigger: '员工生日当天自动发放',
    enabled: true,
  },
  {
    name: '季度绩效奖励',
    description: '根据季度绩效评级发放奖励积分',
    icon: TrendingUpIcon,
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    typeLabel: '绩效关联',
    typeColor: '#059669',
    typeBg: '#ECFDF5',
    points: '300~800',
    pointsColor: COLORS.textPrimary,
    trigger: '季度绩效评估完成后',
    enabled: true,
  },
  {
    name: '推荐入职奖励',
    description: '推荐新员工通过试用期后奖励',
    icon: PersonAddIcon,
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    typeLabel: '事件触发',
    typeColor: '#DC2626',
    typeBg: '#FEF2F2',
    points: '500',
    pointsColor: COLORS.textPrimary,
    trigger: '被推荐人通过试用期',
    enabled: true,
  },
  {
    name: '节日特别福利',
    description: '法定节假日发放特别福利积分',
    icon: CelebrationIcon,
    iconColor: '#9CA3AF',
    iconBg: '#F3F4F6',
    typeLabel: '节日触发',
    typeColor: '#6B7280',
    typeBg: '#F3F4F6',
    points: '200',
    pointsColor: COLORS.textSecondary,
    trigger: '法定节假日前一天',
    enabled: false,
  },
];

// Column widths matching the design frame
const COL = {
  type: 100,
  points: 100,
  trigger: 180,
  status: 70,
  actions: 90,
};

// ---- Rule form dialog ----
interface RuleFormValues {
  name: string;
  type: string;
  points: string;
  trigger: string;
  scope: string;
  method: string;
  enabled: boolean;
  description: string;
}

const EMPTY_FORM: RuleFormValues = {
  name: '',
  type: '',
  points: '',
  trigger: '',
  scope: '全部员工',
  method: '自动发放',
  enabled: true,
  description: '',
};

const EDIT_FORM: RuleFormValues = {
  name: '每月基础积分',
  type: '固定发放',
  points: '500',
  trigger: '每月1日自动发放',
  scope: '全部员工',
  method: '自动发放',
  enabled: true,
  description: '每月固定发放基础福利积分',
};

const RULE_TYPES = ['固定发放', '事件触发', '绩效关联', '节日触发'];
const SCOPES = ['全部员工', '正式员工', '试用期员工', '管理层'];
const METHODS = ['自动发放', '手动发放'];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: 13,
    bgcolor: COLORS.white,
    '& fieldset': { borderColor: COLORS.border },
    '&:hover fieldset': { borderColor: COLORS.border },
    '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: '2px' },
  },
  '& .MuiInputBase-input::placeholder': { color: COLORS.textSecondary, opacity: 1 },
};

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', mb: '6px' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.textPrimary }}>
        {children}
      </Typography>
      {required && (
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.danger }}>*</Typography>
      )}
    </Box>
  );
}

interface RuleDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues: RuleFormValues;
  onClose: () => void;
}

function RuleDialog({ open, mode, initialValues, onClose }: RuleDialogProps) {
  const [values, setValues] = useState<RuleFormValues>(initialValues);

  // Re-sync form when the dialog is (re)opened with new initial values.
  const [lastInit, setLastInit] = useState(initialValues);
  if (open && lastInit !== initialValues) {
    setLastInit(initialValues);
    setValues(initialValues);
  }

  const set = <K extends keyof RuleFormValues>(key: K, value: RuleFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const title = mode === 'add' ? '新增积分规则' : '编辑积分规则';
  const submitLabel = mode === 'add' ? '创建规则' : '保存修改';
  const RuleFieldIcon = mode === 'edit' ? CalendarMonthIcon : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 560,
          maxWidth: '100%',
          borderRadius: '16px',
          m: 2,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '24px',
          py: '20px',
          borderBottom: `1px solid ${COLORS.borderLight}`,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.textSecondary }}>
          <CloseIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px', px: '24px', py: '20px' }}>
        {/* Row 1: name / type / points */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel required>规则名称</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="请输入规则名称"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FieldLabel required>规则类型</FieldLabel>
            <TextField
              select
              fullWidth
              size="small"
              value={values.type}
              onChange={(e) => set('type', e.target.value)}
              SelectProps={{ displayEmpty: true }}
              sx={fieldSx}
            >
              <MenuItem value="" disabled sx={{ fontSize: 13, color: COLORS.textSecondary }}>
                请选择规则类型
              </MenuItem>
              {RULE_TYPES.map((opt) => (
                <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FieldLabel required>积分值</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="请输入积分值"
              value={values.points}
              onChange={(e) => set('points', e.target.value)}
              sx={fieldSx}
            />
          </Box>
        </Box>

        {/* Trigger */}
        <Box>
          <FieldLabel required>触发条件</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="请输入触发条件描述"
            value={values.trigger}
            onChange={(e) => set('trigger', e.target.value)}
            sx={fieldSx}
          />
        </Box>

        {/* Row 2: scope / method */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>适用范围</FieldLabel>
            <TextField
              select
              fullWidth
              size="small"
              value={values.scope}
              onChange={(e) => set('scope', e.target.value)}
              sx={fieldSx}
            >
              {SCOPES.map((opt) => (
                <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>发放方式</FieldLabel>
            <TextField
              select
              fullWidth
              size="small"
              value={values.method}
              onChange={(e) => set('method', e.target.value)}
              sx={fieldSx}
            >
              {METHODS.map((opt) => (
                <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* Row 3: status / icon */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>状态</FieldLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', height: 40 }}>
              <Switch
                checked={values.enabled}
                onChange={(e) => set('enabled', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.white },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: COLORS.primary,
                    opacity: 1,
                  },
                }}
              />
              <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
                {values.enabled ? '启用' : '禁用'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>规则图标</FieldLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: mode === 'edit' ? '#EFF6FF' : COLORS.pageBg,
                  border: `1px solid ${mode === 'edit' ? COLORS.primary : COLORS.border}`,
                }}
              >
                {RuleFieldIcon && <RuleFieldIcon sx={{ fontSize: 20, color: COLORS.primary }} />}
              </Box>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>选择图标</Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Box>
          <FieldLabel>规则描述</FieldLabel>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="请输入规则描述（选填）"
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            sx={fieldSx}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          px: '24px',
          pt: '16px',
          pb: '20px',
          borderTop: `1px solid ${COLORS.borderLight}`,
        }}
      >
        <Button
          onClick={onClose}
          disableElevation
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textPrimary,
            bgcolor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            px: '24px',
            py: '10px',
            '&:hover': { bgcolor: COLORS.pageBg },
          }}
        >
          取消
        </Button>
        <Button
          onClick={onClose}
          disableElevation
          variant="contained"
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
            bgcolor: COLORS.primary,
            borderRadius: '8px',
            px: '24px',
            py: '10px',
            '&:hover': { bgcolor: '#1D4ED8' },
          }}
        >
          {submitLabel}
        </Button>
      </Box>
    </Dialog>
  );
}

export default function AdminPoints() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
            积分规则管理
          </Typography>
          <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
            配置员工积分发放规则，管理各类型积分策略
          </Typography>
        </Box>
        <Button
          onClick={() => setAddOpen(true)}
          disableElevation
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
            bgcolor: COLORS.primary,
            borderRadius: '8px',
            px: '20px',
            py: '10px',
            '&:hover': { bgcolor: '#1D4ED8' },
          }}
        >
          新增规则
        </Button>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STAT_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <Paper
              key={card.label}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                px: '20px',
                py: '18px',
                borderRadius: '12px',
                border: `1px solid ${COLORS.borderLight}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComp sx={{ fontSize: 18, color: card.iconColor }} />
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: COLORS.textSecondary }}>
                  {card.label}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: card.valueColor }}>
                {card.value}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Rules table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: `1px solid ${COLORS.borderLight}`,
          overflow: 'hidden',
        }}
      >
        {/* Table head */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: COLORS.pageBg,
            px: '20px',
            py: '14px',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <HeadCell>规则名称</HeadCell>
          </Box>
          <Box sx={{ width: COL.type }}>
            <HeadCell>规则类型</HeadCell>
          </Box>
          <Box sx={{ width: COL.points }}>
            <HeadCell>积分值</HeadCell>
          </Box>
          <Box sx={{ width: COL.trigger }}>
            <HeadCell>触发条件</HeadCell>
          </Box>
          <Box sx={{ width: COL.status }}>
            <HeadCell>状态</HeadCell>
          </Box>
          <Box sx={{ width: COL.actions }}>
            <HeadCell>操作</HeadCell>
          </Box>
        </Box>

        {/* Table rows */}
        {RULE_ROWS.map((row, idx) => {
          const RowIcon = row.icon;
          const isLast = idx === RULE_ROWS.length - 1;
          return (
            <Box
              key={row.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: '20px',
                py: '14px',
                opacity: row.enabled ? 1 : 0.6,
                borderBottom: isLast ? 'none' : `1px solid ${COLORS.borderLight}`,
              }}
            >
              {/* Name + description */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: row.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <RowIcon sx={{ fontSize: 16, color: row.iconColor }} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: row.enabled ? COLORS.textPrimary : COLORS.textSecondary,
                    }}
                  >
                    {row.name}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: COLORS.textSecondary }}>
                  {row.description}
                </Typography>
              </Box>

              {/* Type badge */}
              <Box sx={{ width: COL.type }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    borderRadius: '4px',
                    bgcolor: row.typeBg,
                    px: '8px',
                    py: '3px',
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 500, color: row.typeColor }}>
                    {row.typeLabel}
                  </Typography>
                </Box>
              </Box>

              {/* Points */}
              <Box sx={{ width: COL.points }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: row.pointsColor }}>
                  {row.points}
                </Typography>
              </Box>

              {/* Trigger */}
              <Box sx={{ width: COL.trigger }}>
                <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                  {row.trigger}
                </Typography>
              </Box>

              {/* Status chip */}
              <Box sx={{ width: COL.status }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    bgcolor: row.enabled ? COLORS.chipGreenBg : COLORS.chipRedBg,
                    px: '10px',
                    py: '4px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: row.enabled ? COLORS.chipGreenText : COLORS.chipRedText,
                    }}
                  >
                    {row.enabled ? '启用' : '禁用'}
                  </Typography>
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ width: COL.actions, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Typography
                  onClick={() => setEditOpen(true)}
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.primary,
                    cursor: 'pointer',
                  }}
                >
                  编辑
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: row.enabled ? COLORS.amber : '#10B981',
                    cursor: 'pointer',
                  }}
                >
                  {row.enabled ? '禁用' : '启用'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
          显示 1-6 共 12 条规则
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <PageButton>
            <ChevronLeftIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          </PageButton>
          <PageButton active>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>
            <ChevronRightIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          </PageButton>
        </Box>
      </Box>

      {/* Dialogs */}
      <RuleDialog open={addOpen} mode="add" initialValues={EMPTY_FORM} onClose={() => setAddOpen(false)} />
      <RuleDialog open={editOpen} mode="edit" initialValues={EDIT_FORM} onClose={() => setEditOpen(false)} />
    </Box>
  );
}

function HeadCell({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
      {children}
    </Typography>
  );
}

function PageButton({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        bgcolor: active ? COLORS.primary : COLORS.white,
        border: active ? 'none' : `1px solid ${COLORS.border}`,
      }}
    >
      {typeof children === 'string' ? (
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: active ? 600 : 400,
            color: active ? COLORS.white : COLORS.textPrimary,
          }}
        >
          {children}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
}
