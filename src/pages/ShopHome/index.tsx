import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import WatchIcon from '@mui/icons-material/Watch';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BackpackIcon from '@mui/icons-material/Backpack';
import TollIcon from '@mui/icons-material/Toll';
import {
  listCategories,
  listProducts,
  type CategoryDTO,
  type ProductDTO,
} from '../../services/product';

/** 无图商品的占位风格，按 id 取模轮换 */
const FALLBACK_STYLES = [
  { icon: HeadphonesIcon, bgColor: '#DBEAFE', iconColor: '#2563EB' },
  { icon: WatchIcon, bgColor: '#EDE9FE', iconColor: '#7C3AED' },
  { icon: CardGiftcardIcon, bgColor: '#DCFCE7', iconColor: '#16A34A' },
  { icon: BackpackIcon, bgColor: '#FEF3C7', iconColor: '#D97706' },
];

export default function ShopHome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loaded, setLoaded] = useState<{
    category: string;
    products: ProductDTO[];
  } | null>(null);

  const loading = loaded === null || loaded.category !== activeCategory;
  const products = loading ? [] : loaded.products;

  useEffect(() => {
    listCategories({ status: 1 })
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    listProducts({
      page: 1,
      size: 40,
      ...(activeCategory !== 'all' ? { category: activeCategory } : {}),
    })
      .then((res) => {
        if (!cancelled) setLoaded({ category: activeCategory, products: res.records });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ category: activeCategory, products: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const categoryChips = [
    { key: 'all', label: '全部' },
    ...categories.map((c) => ({ key: c.name, label: c.name })),
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '24px 32px' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 160,
          borderRadius: '12px',
          px: '40px',
          background: 'linear-gradient(90deg, #2563EB 0%, #60A5FA 100%)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {t('employee.heroTitle')}
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            {t('employee.heroSubtitle')}
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: '#fff',
              color: '#2563EB',
              borderRadius: '20px',
              px: '20px',
              py: '8px',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'none',
              alignSelf: 'flex-start',
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
          >
            {t('employee.heroBrowse')}
          </Button>
        </Box>
        <ShoppingBagIcon sx={{ fontSize: 100, color: 'rgba(255,255,255,0.2)' }} />
      </Box>

      {/* Category Filter */}
      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categoryChips.map((cat) => (
          <Chip
            key={cat.key}
            label={cat.label}
            onClick={() => setActiveCategory(cat.key)}
            sx={{
              borderRadius: '20px',
              fontSize: 13,
              fontWeight: activeCategory === cat.key ? 600 : 400,
              color: activeCategory === cat.key ? '#fff' : '#64748B',
              bgcolor: activeCategory === cat.key ? '#2563EB' : '#fff',
              border: activeCategory === cat.key ? 'none' : '1px solid #E2E8F0',
              height: 'auto',
              py: '8px',
              px: '18px',
              '& .MuiChip-label': { p: 0 },
              '&:hover': {
                bgcolor: activeCategory === cat.key ? '#2563EB' : '#F8FAFC',
              },
            }}
          />
        ))}
      </Box>

      {/* Product Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: '80px' }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: '80px' }}>
          <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>
            暂无商品，换个分类看看吧
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {products.map((product) => {
            const fallback = FALLBACK_STYLES[product.id % FALLBACK_STYLES.length];
            const IconComp = fallback.icon;
            return (
              <Card
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`, { state: { product } })}
                sx={{
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: '#F1F5F9',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': { boxShadow: 2 },
                }}
              >
                {/* Product Image Area */}
                <Box
                  sx={{
                    position: 'relative',
                    height: 200,
                    bgcolor: product.imageUrl ? '#F8FAFC' : fallback.bgColor,
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
                    <IconComp sx={{ fontSize: 64, color: fallback.iconColor }} />
                  )}
                </Box>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', p: '16px', '&:last-child': { pb: '16px' } }}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {product.category}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#CBD5E1' }}>
                    {t('employee.sold')} {product.soldCount} {t('employee.soldUnit')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TollIcon sx={{ fontSize: 18, color: '#D97706' }} />
                      <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#D97706' }}>
                        {product.pointsPrice.toLocaleString()}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}`, { state: { product } });
                      }}
                      sx={{
                        borderRadius: '8px',
                        px: '14px',
                        py: '6px',
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: 'none',
                        minWidth: 'auto',
                      }}
                    >
                      {t('employee.redeem')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
