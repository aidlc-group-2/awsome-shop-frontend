import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import type { SvgIconComponent } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DevicesIcon from '@mui/icons-material/Devices';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import RedeemIcon from '@mui/icons-material/Redeem';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ErrorIcon from '@mui/icons-material/Error';

// Theme tokens
const COLORS = {
  primary: '#2563EB',
  bgPage: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',
  success: '#16A34A',
  amber: '#D97706',
  danger: '#DC2626',
};

interface SubCategory {
  name: string;
  icon: SvgIconComponent;
  count: string;
  sort: string;
  active: boolean;
}

interface ParentCategory {
  id: string;
  name: string;
  icon: SvgIconComponent;
  iconColor: string;
  count: string;
  sort: string;
  active: boolean;
  disabled?: boolean;
  children: SubCategory[];
}

const CATEGORIES: ParentCategory[] = [
  {
    id: 'digital',
    name: '数码电子',
    icon: DevicesIcon,
    iconColor: '#2563EB',
    count: '38',
    sort: '100',
    active: true,
    children: [
      { name: '耳机音响', icon: HeadphonesIcon, count: '12', sort: '100', active: true },
      { name: '智能手表', icon: WatchIcon, count: '8', sort: '90', active: true },
      { name: '键盘鼠标', icon: KeyboardIcon, count: '18', sort: '80', active: true },
    ],
  },
  {
    id: 'gift',
    name: '礼品卡券',
    icon: RedeemIcon,
    iconColor: '#F59E0B',
    count: '24',
    sort: '90',
    active: true,
    children: [
      { name: '购物卡', icon: ShoppingBagIcon, count: '15', sort: '100', active: true },
      { name: '餐饮卡券', icon: RestaurantIcon, count: '9', sort: '85', active: true },
    ],
  },
  {
    id: 'home',
    name: '生活家居',
    icon: HomeIcon,
    iconColor: '#10B981',
    count: '52',
    sort: '80',
    active: true,
    children: [],
  },
  {
    id: 'office',
    name: '办公用品',
    icon: BusinessCenterIcon,
    iconColor: '#6366F1',
    count: '31',
    sort: '70',
    active: true,
    children: [],
  },
  {
    id: 'sport',
    name: '运动健康',
    icon: FitnessCenterIcon,
    iconColor: '#9CA3AF',
    count: '16',
    sort: '60',
    active: false,
    disabled: true,
    children: [],
  },
];

const COL = { count: 100, sort: 100, status: 90, acts: 130 };

function StatusChip({ active }: { active: boolean }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: '10px',
        py: '4px',
        borderRadius: '12px',
        bgcolor: active ? '#DCFCE7' : '#FEE2E2',
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 500, color: active ? COLORS.success : COLORS.danger }}>
        {active ? '启用' : '禁用'}
      </Typography>
    </Box>
  );
}

function ActionLink({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <Typography
      component="span"
      onClick={onClick}
      sx={{ fontSize: 12, fontWeight: 500, color, cursor: 'pointer' }}
    >
      {label}
    </Typography>
  );
}

export default function AdminCategories() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ digital: true, gift: true });
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const openDelete = () => {
    setConfirmText('');
    setDeleteOpen(true);
  };

  const deleteTargetName = '耳机音响';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
          类目管理
        </Typography>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setAddOpen(true)}
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            bgcolor: COLORS.primary,
            borderRadius: '8px',
            px: '20px',
            py: '10px',
            '&:hover': { bgcolor: '#1D4ED8' },
          }}
        >
          新增类目
        </Button>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <TextField
          placeholder="搜索类目名称..."
          size="small"
          sx={{
            width: 280,
            '& .MuiOutlinedInput-root': {
              height: 40,
              fontSize: 13,
              bgcolor: COLORS.white,
              borderRadius: '8px',
              '& fieldset': { borderColor: COLORS.border },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon sx={{ fontSize: 18 }} />}
          endIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: 'none',
            height: 40,
            fontSize: 13,
            fontWeight: 400,
            color: COLORS.textSecondary,
            bgcolor: COLORS.white,
            borderColor: COLORS.border,
            borderRadius: '8px',
            px: '14px',
            '&:hover': { borderColor: COLORS.border, bgcolor: COLORS.white },
          }}
        >
          全部状态
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>共 12 个类目</Typography>
        </Box>
      </Box>

      {/* Table card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid',
          borderColor: COLORS.borderLight,
          overflow: 'hidden',
        }}
      >
        {/* Table head */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: COLORS.bgPage,
            px: '20px',
            py: '14px',
          }}
        >
          <Typography sx={{ flexGrow: 1, fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
            类目名称
          </Typography>
          <Typography sx={{ width: COL.count, fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
            商品数量
          </Typography>
          <Typography sx={{ width: COL.sort, fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
            排序权重
          </Typography>
          <Typography sx={{ width: COL.status, fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
            状态
          </Typography>
          <Typography sx={{ width: COL.acts, fontSize: 12, fontWeight: 600, color: COLORS.textSecondary }}>
            操作
          </Typography>
        </Box>

        {/* Rows */}
        {CATEGORIES.map((cat) => {
          const ParentIcon = cat.icon;
          const isExpanded = !!expanded[cat.id];
          const nameColor = cat.disabled ? COLORS.textSecondary : COLORS.textPrimary;
          return (
            <Box key={cat.id} sx={{ opacity: cat.disabled ? 0.6 : 1 }}>
              {/* Parent row */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#F8FAFC',
                  px: '20px',
                  py: '14px',
                  borderBottom: '1px solid',
                  borderColor: COLORS.divider,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => toggle(cat.id)}
                    sx={{ p: 0, color: COLORS.textSecondary }}
                  >
                    {isExpanded ? (
                      <ExpandMoreIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <ChevronRightIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                  <ParentIcon sx={{ fontSize: 20, color: cat.iconColor }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: nameColor }}>
                    {cat.name}
                  </Typography>
                </Box>
                <Typography sx={{ width: COL.count, fontSize: 13, fontWeight: 600, color: nameColor }}>
                  {cat.count}
                </Typography>
                <Typography sx={{ width: COL.sort, fontSize: 13, color: nameColor }}>
                  {cat.sort}
                </Typography>
                <Box sx={{ width: COL.status }}>
                  <StatusChip active={cat.active} />
                </Box>
                <Box sx={{ width: COL.acts, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ActionLink label="编辑" color={COLORS.primary} onClick={() => setEditOpen(true)} />
                  <ActionLink label="添加子类" color={COLORS.primary} onClick={() => setAddOpen(true)} />
                  {cat.active ? (
                    <ActionLink label="禁用" color={COLORS.amber} />
                  ) : (
                    <ActionLink label="启用" color="#10B981" />
                  )}
                </Box>
              </Box>

              {/* Sub rows */}
              {isExpanded &&
                cat.children.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <Box
                      key={sub.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        pl: '66px',
                        pr: '20px',
                        py: '12px',
                        borderBottom: '1px solid',
                        borderColor: COLORS.divider,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                        <SubIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
                        <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
                          {sub.name}
                        </Typography>
                      </Box>
                      <Typography sx={{ width: COL.count, fontSize: 13, color: COLORS.textPrimary }}>
                        {sub.count}
                      </Typography>
                      <Typography sx={{ width: COL.sort, fontSize: 13, color: COLORS.textPrimary }}>
                        {sub.sort}
                      </Typography>
                      <Box sx={{ width: COL.status }}>
                        <StatusChip active={sub.active} />
                      </Box>
                      <Box sx={{ width: COL.acts, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ActionLink label="编辑" color={COLORS.primary} onClick={() => setEditOpen(true)} />
                        <ActionLink label="删除" color={COLORS.danger} onClick={openDelete} />
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          );
        })}
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
          显示 1-5 共 5 个类目
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              bgcolor: COLORS.white,
              border: '1px solid',
              borderColor: COLORS.border,
              cursor: 'pointer',
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              bgcolor: COLORS.primary,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.white }}>1</Typography>
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              bgcolor: COLORS.white,
              border: '1px solid',
              borderColor: COLORS.border,
              cursor: 'pointer',
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
          </Box>
        </Box>
      </Box>

      {/* Add Category Dialog */}
      <CategoryFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增类目"
        nameValue=""
        descValue=""
        sortValue="100"
        submitLabel="创建类目"
        focusedName={false}
        hasIcon={false}
      />

      {/* Edit Category Dialog */}
      <CategoryFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑类目"
        nameValue="数码电子"
        descValue="包含各类数码电子产品，如耳机、手表、键盘等"
        sortValue="100"
        submitLabel="保存修改"
        focusedName
        hasIcon
      />

      {/* Delete Category Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        PaperProps={{
          sx: { width: 480, m: 0, borderRadius: '16px', boxShadow: '0 24px 64px -8px #00000040, 0 8px 24px -4px #00000020' },
        }}
      >
        {/* Top bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '24px', py: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '18px',
                bgcolor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: 20, color: COLORS.danger }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>
                删除类目
              </Typography>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                此操作不可撤销，请谨慎确认
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setDeleteOpen(false)} sx={{ color: COLORS.textSecondary }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Box sx={{ height: '1px', bgcolor: COLORS.divider }} />

        {/* Body */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', px: '24px', py: '20px' }}>
          {/* Warning box */}
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              p: '12px 14px',
              borderRadius: '8px',
              bgcolor: '#FEF2F2',
              border: '1px solid #FECACA',
            }}
          >
            <ErrorIcon sx={{ fontSize: 18, color: COLORS.danger, flexShrink: 0 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#991B1B' }}>
                删除后将产生以下影响：
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#B91C1C', whiteSpace: 'pre-line' }}>
                {'• 该类目下的所有子类目将一并删除\n• 已关联的 12 件商品将变为「未分类」状态'}
              </Typography>
            </Box>
          </Box>

          {/* Category info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              p: '14px 16px',
              borderRadius: '8px',
              bgcolor: COLORS.bgPage,
              border: '1px solid',
              borderColor: COLORS.borderLight,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                bgcolor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeadphonesIcon sx={{ fontSize: 24, color: '#2563EB' }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                耳机音响
              </Typography>
              <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
                上级类目：数码电子  ·  关联商品：12 件
              </Typography>
            </Box>
          </Box>

          {/* Confirm field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.textPrimary }}>
              请输入类目名称
              <Typography component="span" sx={{ fontSize: 13, fontWeight: 700, color: COLORS.danger }}>
                {' 耳机音响 '}
              </Typography>
              以确认删除：
            </Typography>
            <TextField
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="请输入 耳机音响"
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 42,
                  fontSize: 13,
                  bgcolor: COLORS.white,
                  borderRadius: '8px',
                  '& fieldset': { borderColor: COLORS.border },
                },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ height: '1px', bgcolor: COLORS.divider }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', px: '24px', pt: '16px', pb: '20px' }}>
          <Button
            fullWidth
            disabled={confirmText !== deleteTargetName}
            onClick={() => setDeleteOpen(false)}
            startIcon={<DeleteForeverIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: 'none',
              height: 42,
              fontSize: 14,
              fontWeight: 600,
              color: COLORS.danger,
              bgcolor: '#FEE2E2',
              borderRadius: '8px',
              '&:hover': { bgcolor: '#FECACA' },
              '&.Mui-disabled': { color: COLORS.danger, bgcolor: '#FEE2E2', opacity: 0.5 },
            }}
          >
            确认删除
          </Button>
          <Button
            fullWidth
            onClick={() => setDeleteOpen(false)}
            sx={{
              textTransform: 'none',
              height: 42,
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.textPrimary,
              bgcolor: COLORS.white,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: COLORS.border,
              '&:hover': { bgcolor: COLORS.bgPage, borderColor: COLORS.border },
            }}
          >
            取消
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  nameValue: string;
  descValue: string;
  sortValue: string;
  submitLabel: string;
  focusedName: boolean;
  hasIcon: boolean;
}

function fieldLabel(text: string, required = false) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.textPrimary }}>{text}</Typography>
      {required && (
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.danger }}>*</Typography>
      )}
    </Box>
  );
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: 40,
    fontSize: 13,
    bgcolor: COLORS.white,
    borderRadius: '8px',
    '& fieldset': { borderColor: COLORS.border },
  },
};

function CategoryFormDialog({
  open,
  onClose,
  title,
  nameValue,
  descValue,
  sortValue,
  submitLabel,
  focusedName,
  hasIcon,
}: CategoryFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 520, m: 0, borderRadius: '16px', boxShadow: '0 24px 64px -8px #00000040, 0 8px 24px -4px #00000020' },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '24px',
          py: '20px',
          borderBottom: '1px solid',
          borderColor: COLORS.divider,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>{title}</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.textSecondary }}>
          <CloseIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', px: '24px', pt: '24px', pb: 0 }}>
        {/* Name */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {fieldLabel('类目名称', true)}
          <TextField
            defaultValue={nameValue}
            placeholder="请输入类目名称"
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 40,
                fontSize: 13,
                bgcolor: COLORS.white,
                borderRadius: '8px',
                '& fieldset': { borderColor: focusedName ? COLORS.primary : COLORS.border, borderWidth: focusedName ? 2 : 1 },
              },
            }}
          />
        </Box>

        {/* Parent */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {fieldLabel('上级类目')}
          <Select
            defaultValue="none"
            size="small"
            fullWidth
            IconComponent={ExpandMoreIcon}
            sx={{
              height: 40,
              fontSize: 13,
              bgcolor: COLORS.white,
              borderRadius: '8px',
              '& fieldset': { borderColor: COLORS.border },
            }}
          >
            <MenuItem value="none" sx={{ fontSize: 13 }}>无（一级类目）</MenuItem>
            <MenuItem value="digital" sx={{ fontSize: 13 }}>数码电子</MenuItem>
            <MenuItem value="gift" sx={{ fontSize: 13 }}>礼品卡券</MenuItem>
          </Select>
        </Box>

        {/* Icon */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {fieldLabel('类目图标')}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                bgcolor: hasIcon ? '#EFF6FF' : COLORS.bgPage,
                border: '1px solid',
                borderColor: hasIcon ? COLORS.primary : COLORS.border,
              }}
            >
              {hasIcon ? (
                <DevicesIcon sx={{ fontSize: 24, color: COLORS.primary }} />
              ) : (
                <AddPhotoAlternateIcon sx={{ fontSize: 24, color: COLORS.textSecondary }} />
              )}
            </Box>
            <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>点击选择图标</Typography>
          </Box>
        </Box>

        {/* Sort + Status row */}
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            {fieldLabel('排序权重')}
            <TextField defaultValue={sortValue} size="small" fullWidth sx={inputSx} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            {fieldLabel('状态')}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', height: 40 }}>
              <Switch
                defaultChecked
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.white },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: COLORS.primary,
                    opacity: 1,
                  },
                }}
              />
              <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>启用</Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {fieldLabel('类目描述')}
          <TextField
            defaultValue={descValue}
            placeholder="请输入类目描述（选填）"
            size="small"
            fullWidth
            multiline
            minRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: 13,
                bgcolor: COLORS.white,
                borderRadius: '8px',
                '& fieldset': { borderColor: COLORS.border },
              },
            }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          px: '24px',
          pt: '16px',
          pb: '20px',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textPrimary,
            bgcolor: COLORS.white,
            borderRadius: '8px',
            px: '24px',
            py: '10px',
            border: '1px solid',
            borderColor: COLORS.border,
            '&:hover': { bgcolor: COLORS.bgPage, borderColor: COLORS.border },
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={onClose}
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
