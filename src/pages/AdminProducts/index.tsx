import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { SelectChangeEvent } from '@mui/material/Select';
import ButtonBase from '@mui/material/ButtonBase';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import {
  listProducts,
  listCategories,
  type ProductDTO,
  type CategoryDTO,
} from '../../services/product';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: '1', label: '已上架' },
  { value: '0', label: '已下架' },
];

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: '已上架', color: '#166534', bg: '#DCFCE7' },
  0: { label: '已下架', color: '#DC2626', bg: '#FEE2E2' },
};

/** 把分类树打平成名称列表（一级 + 子级） */
const flattenCategoryNames = (cats: CategoryDTO[]): string[] => {
  const names: string[] = [];
  const walk = (list: CategoryDTO[]) => {
    list.forEach((c) => {
      names.push(c.name);
      if (c.children && c.children.length > 0) walk(c.children);
    });
  };
  walk(cats);
  return names;
};

export default function AdminProducts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState<ProductDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    listCategories({})
      .then((cats) => setCategoryNames(flattenCategoryNames(cats)))
      .catch(() => setCategoryNames([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    listProducts({
      page,
      size: PAGE_SIZE,
      name: search.trim() || undefined,
      category: category === 'all' ? undefined : category,
    })
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
  }, [page, search, category]);

  // 状态筛选：前端按当前页 status 0/1 过滤
  const filteredProducts = useMemo(
    () => records.filter((p) => status === 'all' || String(p.status) === status),
    [records, status],
  );

  const handleAdd = () => navigate('/admin/products/new');
  const handleDetail = (product: ProductDTO) =>
    navigate(`/admin/products/${product.id}`, { state: { product } });
  const handleEdit = (product: ProductDTO) =>
    navigate(`/admin/products/${product.id}/edit`, { state: { product } });
  const handleDelete = () => setSnackbar('后端暂未提供删除接口');

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = (page - 1) * PAGE_SIZE + records.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>产品管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAdd}
          sx={{
            bgcolor: '#2563EB',
            borderRadius: '8px',
            px: '20px',
            py: '10px',
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
          }}
        >
          新增产品
        </Button>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 280,
            height: 40,
            px: '12px',
            bgcolor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: '#64748B' }} />
          <InputBase
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="搜索产品名称..."
            sx={{ flexGrow: 1, fontSize: 13, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
          />
        </Box>

        {/* Category Filter */}
        <Select
          value={category}
          onChange={(e: SelectChangeEvent) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          sx={{
            height: 40,
            bgcolor: '#FFFFFF',
            borderRadius: '8px',
            fontSize: 13,
            color: '#64748B',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: 13 }}>
            全部分类
          </MenuItem>
          {categoryNames.map((name) => (
            <MenuItem key={name} value={name} sx={{ fontSize: 13 }}>
              {name}
            </MenuItem>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onChange={(e: SelectChangeEvent) => {
            setStatus(e.target.value);
          }}
          sx={{
            height: 40,
            bgcolor: '#FFFFFF',
            borderRadius: '8px',
            fontSize: 13,
            color: '#64748B',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        {/* Count */}
        <Typography sx={{ flexGrow: 1, textAlign: 'right', fontSize: 13, color: '#64748B' }}>
          共 {total} 件产品
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Product Card Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {filteredProducts.map((product) => {
          const statusCfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG[0];
          return (
            <Paper
              key={product.id}
              elevation={0}
              onClick={() => handleDetail(product)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                border: '1px solid #F1F5F9',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 2 },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  height: 140,
                  bgcolor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {product.imageUrl ? (
                  <Box
                    component="img"
                    src={product.imageUrl}
                    alt={product.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <LocalMallIcon sx={{ fontSize: 48, color: '#2563EB' }} />
                )}
              </Box>

              {/* Body */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', p: '16px 16px 12px 16px' }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1E293B',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box
                    sx={{
                      px: '8px',
                      py: '2px',
                      borderRadius: '10px',
                      bgcolor: '#EFF6FF',
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#2563EB',
                    }}
                  >
                    {product.category}
                  </Box>
                  <Box
                    sx={{
                      px: '8px',
                      py: '2px',
                      borderRadius: '10px',
                      bgcolor: statusCfg.bg,
                      fontSize: 11,
                      fontWeight: 500,
                      color: statusCfg.color,
                    }}
                  >
                    {statusCfg.label}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#D97706' }}>
                    {product.pointsPrice.toLocaleString()} 积分
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: product.stock === 0 ? 600 : 400,
                      color: product.stock === 0 ? '#DC2626' : '#64748B',
                    }}
                  >
                    库存 {product.stock}
                  </Typography>
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', p: '0 12px 12px 12px' }}>
                <ButtonBase
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(product);
                  }}
                  sx={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', px: '10px', py: '6px', '&:hover': { bgcolor: '#F1F5F9' } }}
                >
                  <EditIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>编辑</Typography>
                </ButtonBase>
                <ButtonBase
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  sx={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', px: '10px', py: '6px', '&:hover': { bgcolor: '#FEF2F2' } }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16, color: '#DC2626' }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#DC2626' }}>删除</Typography>
                </ButtonBase>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {filteredProducts.length === 0 && !error && (
        <Typography sx={{ fontSize: 13, color: '#64748B', textAlign: 'center', py: '24px' }}>
          暂无产品数据
        </Typography>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '8px' }}>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>
          显示 {rangeStart}-{rangeEnd} 共 {total} 件产品
        </Typography>
        <Pagination
          count={pages}
          page={page}
          onChange={(_, value) => setPage(value)}
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': { fontSize: 13, color: '#64748B' },
            '& .MuiPaginationItem-root.Mui-selected': {
              bgcolor: '#2563EB',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#2563EB' },
            },
          }}
        />
      </Box>

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
