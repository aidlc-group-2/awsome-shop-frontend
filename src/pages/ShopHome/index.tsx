import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TollIcon from '@mui/icons-material/Toll';
import { productApi, categoryApi, type ApiProduct } from '../../services/api';

interface CategoryChip {
  key: string;
  label: string;
}

const FALLBACK_COLORS = [
  { bg: '#DBEAFE', fg: '#2563EB' },
  { bg: '#EDE9FE', fg: '#7C3AED' },
  { bg: '#DCFCE7', fg: '#16A34A' },
  { bg: '#FEF3C7', fg: '#D97706' },
];

export default function ShopHome() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<CategoryChip[]>([{ key: 'all', label: '全部' }]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryApi
      .list()
      .then((cats) => {
        setCategories([
          { key: 'all', label: '全部' },
          ...cats.map((c) => ({ key: c.name, label: c.name })),
        ]);
      })
      .catch(() => {});
  }, []);

  const loadProducts = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.list({
        page: 1,
        size: 50,
        category: category === 'all' ? undefined : category,
      });
      setProducts(res.records ?? []);
    } catch {
      setError(t('employee.loadFailed', '加载商品失败，请稍后重试'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: '24px 32px' }}>
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

      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
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

      {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 && !error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography sx={{ color: '#64748B', fontSize: 14 }}>
            {t('employee.noProducts', '暂无商品')}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {products.map((product, idx) => {
            const palette = FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
            return (
              <Card
                key={product.id}
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
                <Box
                  sx={{
                    position: 'relative',
                    height: 200,
                    bgcolor: palette.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    <Inventory2Icon sx={{ fontSize: 64, color: palette.fg }} />
                  )}
                  {product.promotion && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bgcolor: '#DC2626',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        px: '10px',
                        py: '4px',
                        borderRadius: '0 0 8px 0',
                      }}
                    >
                      {product.promotion}
                    </Box>
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
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.subtitle || product.category}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#CBD5E1' }}>
                    {t('employee.sold')} {product.soldCount ?? 0} {t('employee.soldUnit')}
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
                        {product.pointsPrice?.toLocaleString() ?? 0}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
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
