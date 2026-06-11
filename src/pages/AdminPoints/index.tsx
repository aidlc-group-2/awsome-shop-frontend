import { useCallback, useEffect, useState } from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RuleIcon from '@mui/icons-material/Rule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TollIcon from '@mui/icons-material/Toll';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CelebrationIcon from '@mui/icons-material/Celebration';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import { getPointsRule, updatePointsRule, type PointsRuleDTO } from '../../services/points';

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
};

// ---- Stat cards（后端暂无统计接口，保留静态展示） ----
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

const CYCLE_LABEL: Record<PointsRuleDTO['periodicCycle'], string> = {
  DAILY: '每日',
  WEEKLY: '每周',
  MONTHLY: '每月',
};

const CYCLE_OPTIONS: { value: PointsRuleDTO['periodicCycle']; label: string }[] = [
  { value: 'DAILY', label: '每日' },
  { value: 'WEEKLY', label: '每周' },
  { value: 'MONTHLY', label: '每月' },
];

// Column widths matching the design frame
const COL = {
  points: 140,
  trigger: 200,
  actions: 90,
};

interface RuleFormValues {
  onboardingBonus: string;
  periodicAmount: string;
  periodicCycle: PointsRuleDTO['periodicCycle'];
  validityDays: string;
}

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

export default function AdminPoints() {
  const [rule, setRule] = useState<PointsRuleDTO | null>(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<RuleFormValues>({
    onboardingBonus: '',
    periodicAmount: '',
    periodicCycle: 'MONTHLY',
    validityDays: '',
  });
  const [dialogError, setDialogError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRule = useCallback(() => {
    setError('');
    getPointsRule()
      .then(setRule)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    fetchRule();
  }, [fetchRule]);

  const openEdit = () => {
    if (!rule) return;
    setForm({
      onboardingBonus: String(rule.onboardingBonus),
      periodicAmount: String(rule.periodicAmount),
      periodicCycle: rule.periodicCycle,
      validityDays: String(rule.validityDays),
    });
    setDialogError('');
    setEditOpen(true);
  };

  const setField = <K extends keyof RuleFormValues>(key: K, value: RuleFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const onboardingBonus = Number(form.onboardingBonus);
    const periodicAmount = Number(form.periodicAmount);
    const validityDays = Number(form.validityDays);
    if (
      !form.onboardingBonus ||
      !form.periodicAmount ||
      !form.validityDays ||
      Number.isNaN(onboardingBonus) ||
      Number.isNaN(periodicAmount) ||
      Number.isNaN(validityDays)
    ) {
      setDialogError('请完整填写各项数值');
      return;
    }
    setSaving(true);
    setDialogError('');
    try {
      await updatePointsRule({
        onboardingBonus,
        periodicAmount,
        periodicCycle: form.periodicCycle,
        validityDays,
      });
      setEditOpen(false);
      setSnackbar('积分规则保存成功');
      fetchRule();
    } catch (e) {
      setDialogError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 规则展示行（由真实规则数据生成）
  const ruleRows = rule
    ? [
        {
          key: 'onboarding',
          name: '入职奖励积分',
          description: '新员工入职时一次性发放',
          icon: CelebrationIcon,
          iconColor: '#8B5CF6',
          iconBg: '#F5F3FF',
          points: rule.onboardingBonus.toLocaleString(),
          trigger: '员工入职时自动发放',
        },
        {
          key: 'periodic',
          name: '周期发放积分',
          description: `${CYCLE_LABEL[rule.periodicCycle]}固定发放基础福利积分`,
          icon: CalendarMonthIcon,
          iconColor: '#2563EB',
          iconBg: '#EFF6FF',
          points: rule.periodicAmount.toLocaleString(),
          trigger: `${CYCLE_LABEL[rule.periodicCycle]}自动发放`,
        },
        {
          key: 'cycle',
          name: '发放周期',
          description: '周期发放积分的发放频率',
          icon: EventRepeatIcon,
          iconColor: '#10B981',
          iconBg: '#ECFDF5',
          points: CYCLE_LABEL[rule.periodicCycle],
          trigger: '按周期自动触发',
        },
        {
          key: 'validity',
          name: '积分有效期',
          description: '积分发放后的有效天数',
          icon: HourglassBottomIcon,
          iconColor: '#F59E0B',
          iconBg: '#FFF7ED',
          points: `${rule.validityDays} 天`,
          trigger: '到期后自动过期清零',
        },
      ]
    : [];

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
          onClick={() => setSnackbar('后端暂未提供新增规则接口')}
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

      {/* Stat cards（静态展示） */}
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

      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

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
            <HeadCell>规则项</HeadCell>
          </Box>
          <Box sx={{ width: COL.points }}>
            <HeadCell>当前配置</HeadCell>
          </Box>
          <Box sx={{ width: COL.trigger }}>
            <HeadCell>触发说明</HeadCell>
          </Box>
          <Box sx={{ width: COL.actions }}>
            <HeadCell>操作</HeadCell>
          </Box>
        </Box>

        {/* Table rows */}
        {ruleRows.map((row, idx) => {
          const RowIcon = row.icon;
          const isLast = idx === ruleRows.length - 1;
          return (
            <Box
              key={row.key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: '20px',
                py: '14px',
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
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>
                    {row.name}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 11, color: COLORS.textSecondary }}>
                  {row.description}
                </Typography>
              </Box>

              {/* Value */}
              <Box sx={{ width: COL.points }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
                  {row.points}
                </Typography>
              </Box>

              {/* Trigger */}
              <Box sx={{ width: COL.trigger }}>
                <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                  {row.trigger}
                </Typography>
              </Box>

              {/* Actions */}
              <Box sx={{ width: COL.actions, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Typography
                  onClick={openEdit}
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.primary,
                    cursor: 'pointer',
                  }}
                >
                  编辑
                </Typography>
              </Box>
            </Box>
          );
        })}

        {!rule && !error && (
          <Box sx={{ px: '20px', py: '32px', textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>加载中...</Typography>
          </Box>
        )}
      </Paper>

      {/* Edit Rule Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
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
            编辑积分规则
          </Typography>
          <IconButton onClick={() => setEditOpen(false)} size="small" sx={{ color: COLORS.textSecondary }}>
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px', px: '24px', py: '20px' }}>
          {dialogError && (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              {dialogError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Box sx={{ flex: 1 }}>
              <FieldLabel required>入职奖励积分</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入入职奖励积分"
                value={form.onboardingBonus}
                onChange={(e) => setField('onboardingBonus', e.target.value.replace(/[^0-9]/g, ''))}
                sx={fieldSx}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FieldLabel required>周期发放积分</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入周期发放积分"
                value={form.periodicAmount}
                onChange={(e) => setField('periodicAmount', e.target.value.replace(/[^0-9]/g, ''))}
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Box sx={{ flex: 1 }}>
              <FieldLabel required>发放周期</FieldLabel>
              <TextField
                select
                fullWidth
                size="small"
                value={form.periodicCycle}
                onChange={(e) =>
                  setField('periodicCycle', e.target.value as PointsRuleDTO['periodicCycle'])
                }
                sx={fieldSx}
              >
                {CYCLE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FieldLabel required>积分有效期（天）</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入有效天数"
                value={form.validityDays}
                onChange={(e) => setField('validityDays', e.target.value.replace(/[^0-9]/g, ''))}
                sx={fieldSx}
              />
            </Box>
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
            onClick={() => setEditOpen(false)}
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
            onClick={handleSave}
            disabled={saving}
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
            保存修改
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

function HeadCell({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
      {children}
    </Typography>
  );
}
