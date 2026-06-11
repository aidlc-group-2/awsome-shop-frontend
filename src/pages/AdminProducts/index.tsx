import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import ButtonBase from '@mui/material/ButtonBase';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BackpackIcon from '@mui/icons-material/Backpack';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeakerIcon from '@mui/icons-material/Speaker';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import type { SvgIconComponent } from '@mui/icons-material';

type ProductStatus = 'active' | 'inactive';

interface Product {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  status: ProductStatus;
  points: string;
  stock: number;
  icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: '全部分类' },
  { value: 'digital', label: '数码电子' },
  { value: 'life', label: '生活家居' },
  { value: 'gift', label: '礼品卡券' },
  { value: 'office', label: '办公用品' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: 'active', label: '已上架' },
  { value: 'inactive', label: '已下架' },
];

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  active: { label: '已上架', color: '#166534', bg: '#DCFCE7' },
  inactive: { label: '已下架', color: '#DC2626', bg: '#FEE2E2' },
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 降噪耳机',
    category: 'digital',
    categoryLabel: '数码电子',
    categoryColor: '#2563EB',
    categoryBg: '#EFF6FF',
    status: 'active',
    points: '2,580',
    stock: 45,
    icon: HeadphonesIcon,
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
  },
  {
    id: 2,
    name: 'Apple Watch Series 9',
    category: 'digital',
    categoryLabel: '数码电子',
    categoryColor: '#2563EB',
    categoryBg: '#EFF6FF',
    status: 'active',
    points: '3,200',
    stock: 28,
    icon: WatchIcon,
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
  },
  {
    id: 3,
    name: '星巴克 200元礼品卡',
    category: 'gift',
    categoryLabel: '礼品卡券',
    categoryColor: '#16A34A',
    categoryBg: '#F0FDF4',
    status: 'active',
    points: '680',
    stock: 200,
    icon: CardGiftcardIcon,
    iconColor: '#16A34A',
    iconBg: '#DCFCE7',
  },
  {
    id: 4,
    name: '小米城市通勤双肩包',
    category: 'life',
    categoryLabel: '生活家居',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    status: 'inactive',
    points: '450',
    stock: 0,
    icon: BackpackIcon,
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    id: 5,
    name: '罗技 MX Keys 无线键盘',
    category: 'office',
    categoryLabel: '办公用品',
    categoryColor: '#2563EB',
    categoryBg: '#EFF6FF',
    status: 'active',
    points: '890',
    stock: 62,
    icon: KeyboardIcon,
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
  },
  {
    id: 6,
    name: 'Bose SoundLink 蓝牙音箱',
    category: 'digital',
    categoryLabel: '数码电子',
    categoryColor: '#2563EB',
    categoryBg: '#EFF6FF',
    status: 'active',
    points: '1,200',
    stock: 35,
    icon: SpeakerIcon,
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
  },
  {
    id: 7,
    name: '京东 100元购物卡',
    category: 'gift',
    categoryLabel: '礼品卡券',
    categoryColor: '#16A34A',
    categoryBg: '#F0FDF4',
    status: 'active',
    points: '300',
    stock: 500,
    icon: LocalMallIcon,
    iconColor: '#16A34A',
    iconBg: '#DCFCE7',
  },
  {
    id: 8,
    name: '飞利浦电动牙刷 HX6856',
    category: 'life',
    categoryLabel: '生活家居',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    status: 'active',
    points: '520',
    stock: 78,
    icon: CleaningServicesIcon,
    iconColor: '#DB2777',
    iconBg: '#FCE7F3',
  },
];

const PAGES = [1, 2, 3];
const LAST_PAGE = 16;

export default function AdminProducts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory = category === 'all' || product.category === category;
        const matchesStatus = status === 'all' || product.status === status;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [search, category, status],
  );

  const handleAdd = () => navigate('/admin/products/new');
  const handleDetail = (id: number) => navigate(`/admin/products/${id}`);
  const handleEdit = (id: number) => navigate(`/admin/products/${id}/edit`);

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
          {CATEGORY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onChange={(e: SelectChangeEvent) => {
            setStatus(e.target.value);
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
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        {/* Count */}
        <Typography sx={{ flexGrow: 1, textAlign: 'right', fontSize: 13, color: '#64748B' }}>
          共 128 件产品
        </Typography>
      </Box>

      {/* Product Card Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {filteredProducts.map((product) => {
          const IconComp = product.icon;
          const statusCfg = STATUS_CONFIG[product.status];
          return (
            <Paper
              key={product.id}
              elevation={0}
              onClick={() => handleDetail(product.id)}
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
                  bgcolor: product.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComp sx={{ fontSize: 48, color: product.iconColor }} />
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
                      bgcolor: product.categoryBg,
                      fontSize: 11,
                      fontWeight: 500,
                      color: product.categoryColor,
                    }}
                  >
                    {product.categoryLabel}
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
                    {product.points} 积分
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
                    handleEdit(product.id);
                  }}
                  sx={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', px: '10px', py: '6px', '&:hover': { bgcolor: '#F1F5F9' } }}
                >
                  <EditIcon sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>编辑</Typography>
                </ButtonBase>
                <ButtonBase
                  onClick={(e) => e.stopPropagation()}
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

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '8px' }}>
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>显示 1-8 共 128 件产品</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ButtonBase
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            sx={{ width: 32, height: 32, borderRadius: '6px', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F8FAFC' } }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </ButtonBase>
          {PAGES.map((p) => {
            const isActive = p === page;
            return (
              <ButtonBase
                key={p}
                onClick={() => setPage(p)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '6px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : '#64748B',
                  bgcolor: isActive ? '#2563EB' : 'transparent',
                  border: isActive ? 'none' : '1px solid #E2E8F0',
                  '&:hover': { bgcolor: isActive ? '#2563EB' : '#F8FAFC' },
                }}
              >
                {p}
              </ButtonBase>
            );
          })}
          <Typography sx={{ fontSize: 13, color: '#64748B', px: '4px' }}>...</Typography>
          <ButtonBase
            onClick={() => setPage(LAST_PAGE)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '6px',
              fontSize: 13,
              color: page === LAST_PAGE ? '#FFFFFF' : '#64748B',
              bgcolor: page === LAST_PAGE ? '#2563EB' : 'transparent',
              border: page === LAST_PAGE ? 'none' : '1px solid #E2E8F0',
              '&:hover': { bgcolor: page === LAST_PAGE ? '#2563EB' : '#F8FAFC' },
            }}
          >
            {LAST_PAGE}
          </ButtonBase>
          <ButtonBase
            onClick={() => setPage((p) => Math.min(LAST_PAGE, p + 1))}
            sx={{ width: 32, height: 32, borderRadius: '6px', border: '1px solid #E2E8F0', '&:hover': { bgcolor: '#F8FAFC' } }}
          >
            <ChevronRightIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
}
