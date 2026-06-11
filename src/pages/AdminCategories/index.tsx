import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CategoryIcon from '@mui/icons-material/Category';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { listCategories, type CategoryDTO } from '../../services/product';

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
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    listCategories({})
      .then((cats) => {
        setCategories(cats);
        // 默认展开有子类的一级分类
        const initial: Record<number, boolean> = {};
        cats.forEach((c) => {
          if (c.children && c.children.length > 0) initial[c.id] = true;
        });
        setExpanded(initial);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const toggle = (id: number) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const notSupported = () => setSnackbar('后端暂未提供分类管理接口');

  const q = search.trim().toLowerCase();
  const filtered = q
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.children ?? []).some((s) => s.name.toLowerCase().includes(q)),
      )
    : categories;

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
          onClick={notSupported}
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>
            共 {filtered.length} 个类目
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

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
        {filtered.map((cat) => {
          const isExpanded = !!expanded[cat.id];
          const disabled = cat.status !== 1;
          const nameColor = disabled ? COLORS.textSecondary : COLORS.textPrimary;
          const children = cat.children ?? [];
          return (
            <Box key={cat.id} sx={{ opacity: disabled ? 0.6 : 1 }}>
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
                  <CategoryIcon sx={{ fontSize: 20, color: COLORS.primary }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: nameColor }}>
                      {cat.name}
                    </Typography>
                    {cat.description && (
                      <Typography sx={{ fontSize: 11, color: COLORS.textSecondary }}>
                        {cat.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Typography sx={{ width: COL.count, fontSize: 13, fontWeight: 600, color: nameColor }}>
                  {cat.productCount}
                </Typography>
                <Typography sx={{ width: COL.sort, fontSize: 13, color: nameColor }}>
                  {cat.sortOrder}
                </Typography>
                <Box sx={{ width: COL.status }}>
                  <StatusChip active={cat.status === 1} />
                </Box>
                <Box sx={{ width: COL.acts, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ActionLink label="编辑" color={COLORS.primary} onClick={notSupported} />
                  <ActionLink label="添加子类" color={COLORS.primary} onClick={notSupported} />
                  <ActionLink label="删除" color={COLORS.danger} onClick={notSupported} />
                </Box>
              </Box>

              {/* Sub rows */}
              {isExpanded &&
                children.map((sub) => (
                  <Box
                    key={sub.id}
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
                      <LabelOutlinedIcon sx={{ fontSize: 18, color: COLORS.textSecondary }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
                          {sub.name}
                        </Typography>
                        {sub.description && (
                          <Typography sx={{ fontSize: 11, color: COLORS.textSecondary }}>
                            {sub.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography sx={{ width: COL.count, fontSize: 13, color: COLORS.textPrimary }}>
                      {sub.productCount}
                    </Typography>
                    <Typography sx={{ width: COL.sort, fontSize: 13, color: COLORS.textPrimary }}>
                      {sub.sortOrder}
                    </Typography>
                    <Box sx={{ width: COL.status }}>
                      <StatusChip active={sub.status === 1} />
                    </Box>
                    <Box sx={{ width: COL.acts, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <ActionLink label="编辑" color={COLORS.primary} onClick={notSupported} />
                      <ActionLink label="删除" color={COLORS.danger} onClick={notSupported} />
                    </Box>
                  </Box>
                ))}
            </Box>
          );
        })}

        {filtered.length === 0 && !error && (
          <Box sx={{ px: '20px', py: '32px', textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: COLORS.textSecondary }}>暂无类目数据</Typography>
          </Box>
        )}
      </Paper>

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
