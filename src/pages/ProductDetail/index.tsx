import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { listProducts, type ProductDTO } from '../../services/product';

const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  pageBg: '#F8FAFC',
  white: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textDisabled: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  amber: '#D97706',
  amberDark: '#92400E',
  star: '#F59E0B',
  success: '#16A34A',
};

/** 把后端的逗号/顿号分隔字符串拆成数组 */
const splitList = (value: string | null): string[] =>
  value
    ? value
        .split(/[,，、|]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

/** 兼容 [{label,value}] 与 [{品牌:'Sony'}] 两种规格结构 */
const toSpecRows = (
  specs: Array<Record<string, string>> | null,
): { label: string; value: string }[] =>
  (specs ?? []).flatMap((rec) => {
    if (typeof rec.label === 'string' && typeof rec.value === 'string') {
      return [{ label: rec.label, value: rec.value }];
    }
    return Object.entries(rec).map(([label, value]) => ({ label, value }));
  });

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const stateProduct = (location.state as { product?: ProductDTO } | null)?.product;
  const [fetched, setFetched] = useState<{
    id: string | undefined;
    product: ProductDTO | null;
  } | null>(null);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const loading = !stateProduct && (fetched === null || fetched.id !== id);
  const product = stateProduct ?? (loading ? null : fetched?.product ?? null);

  useEffect(() => {
    if (stateProduct) return;
    let cancelled = false;
    listProducts({ page: 1, size: 100 })
      .then((res) => {
        if (cancelled) return;
        const found = res.records.find((p) => String(p.id) === id);
        setFetched({ id, product: found ?? null });
      })
      .catch(() => {
        if (!cancelled) setFetched({ id, product: null });
      });
    return () => {
      cancelled = true;
    };
  }, [stateProduct, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: '120px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          py: '120px',
        }}
      >
        <Typography sx={{ fontSize: 16, color: COLORS.textSecondary }}>商品不存在</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ textTransform: 'none', borderRadius: '8px' }}
        >
          返回首页
        </Button>
      </Box>
    );
  }

  const colorOptions = splitList(product.colors);
  const services = splitList(product.serviceGuarantee);
  const specRows = toSpecRows(product.specs);
  const inStock = product.stock > 0;

  return (
    <Box sx={{ display: 'flex', gap: '32px', p: '24px 48px' }}>
      {/* ===================== Left column: Product Image ===================== */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 480, flexShrink: 0 }}>
        {/* Main image */}
        <Box
          sx={{
            position: 'relative',
            height: 400,
            borderRadius: '12px',
            bgcolor: '#DBEAFE',
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
            <HeadphonesIcon sx={{ fontSize: 160, color: COLORS.primary }} />
          )}
        </Box>

        {/* Specs section */}
        {specRows.length > 0 && (
          <Box sx={{ pt: '20px', mt: '20px', borderTop: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '12px' }}>
              <SettingsIcon sx={{ fontSize: 18, color: COLORS.textPrimary }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                产品规格
              </Typography>
            </Box>
            <Box
              sx={{
                borderRadius: '8px',
                border: `1px solid ${COLORS.borderLight}`,
                overflow: 'hidden',
              }}
            >
              {specRows.map((spec, idx) => (
                <Box
                  key={spec.label}
                  sx={{
                    display: 'flex',
                    borderBottom:
                      idx < specRows.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                  }}
                >
                  <Box sx={{ width: 110, flexShrink: 0, bgcolor: COLORS.pageBg, p: '10px 14px' }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: COLORS.textSecondary }}>
                      {spec.label}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: '10px 14px' }}>
                    <Typography sx={{ fontSize: 12, color: COLORS.textPrimary }}>
                      {spec.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* ===================== Right column: Product Info ===================== */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', pb: '12px' }}>
          <Typography
            onClick={() => navigate('/')}
            sx={{
              fontSize: 12,
              color: COLORS.textSecondary,
              cursor: 'pointer',
              '&:hover': { color: COLORS.primary },
            }}
          >
            首页
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: COLORS.textDisabled }} />
          <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
            {product.category}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: COLORS.textDisabled }} />
          <Typography sx={{ fontSize: 12, color: COLORS.textDisabled }}>{product.name}</Typography>
        </Box>

        {/* Title */}
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary }}>
          {product.name}
        </Typography>

        {/* Subtitle */}
        {product.subtitle && (
          <Typography
            sx={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5, mt: '8px' }}
          >
            {product.subtitle}
          </Typography>
        )}

        {/* Sold count */}
        <Typography sx={{ fontSize: 12, color: COLORS.textSecondary, mt: '12px' }}>
          已兑换 {product.soldCount} 件
        </Typography>

        {/* Price strip */}
        <Box
          sx={{
            mt: '16px',
            borderRadius: '8px',
            p: '16px 20px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.amberDark }}>
              积分价
            </Typography>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: COLORS.amberDark }}>
              {product.pointsPrice.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: COLORS.amberDark }}>
              积分
            </Typography>
            {product.marketPrice != null && (
              <Typography sx={{ fontSize: 13, color: COLORS.amberDark }}>
                参考价 ¥{product.marketPrice.toLocaleString()}
              </Typography>
            )}
          </Box>
          {product.promotion && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '8px' }}>
              <Box
                sx={{
                  bgcolor: COLORS.amberDark,
                  color: COLORS.white,
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: '4px',
                  px: '8px',
                  py: '2px',
                }}
              >
                促销
              </Box>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: COLORS.amberDark }}>
                {product.promotion}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Info section: delivery, service, color, quantity */}
        <Box sx={{ pt: '16px' }}>
          {/* Delivery */}
          {product.deliveryMethod && (
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                p: '12px 0',
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <Typography
                sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}
              >
                配送
              </Typography>
              <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
                {product.deliveryMethod}
              </Typography>
            </Box>
          )}

          {/* Service */}
          {services.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                p: '12px 0',
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <Typography
                sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}
              >
                服务
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {services.map((svc) => (
                  <Box key={svc} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleIcon sx={{ fontSize: 14, color: COLORS.success }} />
                    <Typography sx={{ fontSize: 12, color: COLORS.textPrimary }}>{svc}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Color */}
          {colorOptions.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                p: '12px 0',
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <Typography
                sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}
              >
                颜色
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {colorOptions.map((color, idx) => {
                  const isActive = idx === activeColor;
                  return (
                    <Box
                      key={color}
                      onClick={() => setActiveColor(idx)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '8px',
                        p: '8px 16px',
                        cursor: 'pointer',
                        bgcolor: isActive ? '#DBEAFE' : 'transparent',
                        border: isActive
                          ? `2px solid ${COLORS.primary}`
                          : `1px solid ${COLORS.border}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: isActive ? 500 : 400,
                          color: isActive ? COLORS.primary : COLORS.textPrimary,
                        }}
                      >
                        {color}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Quantity + stock */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', p: '12px 0' }}>
            <Typography sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}>
              数量
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                sx={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px 0 0 4px',
                  cursor: 'pointer',
                  color: COLORS.textSecondary,
                  fontSize: 16,
                  userSelect: 'none',
                }}
              >
                −
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: `1px solid ${COLORS.border}`,
                  borderBottom: `1px solid ${COLORS.border}`,
                  fontSize: 14,
                  fontWeight: 500,
                  color: COLORS.textPrimary,
                }}
              >
                {quantity}
              </Box>
              <Box
                onClick={() =>
                  setQuantity((q) => (inStock ? Math.min(product.stock, q + 1) : q + 1))
                }
                sx={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '0 4px 4px 0',
                  cursor: 'pointer',
                  color: COLORS.textPrimary,
                  fontSize: 16,
                  userSelect: 'none',
                }}
              >
                +
              </Box>
            </Box>
            <Typography
              sx={{ fontSize: 12, color: inStock ? COLORS.textSecondary : '#DC2626' }}
            >
              {inStock ? `有货 (库存${product.stock}件)` : '暂时缺货'}
            </Typography>
          </Box>
        </Box>

        {/* Button area */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', pt: '20px' }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon sx={{ fontSize: 20 }} />}
            disabled={!inStock}
            onClick={() => navigate('/redeem/delivery', { state: { product, quantity } })}
            sx={{
              height: 48,
              borderRadius: '8px',
              px: '48px',
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
            }}
          >
            立即兑换
          </Button>
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon sx={{ fontSize: 20 }} />}
            sx={{
              height: 48,
              borderRadius: '8px',
              px: '32px',
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'none',
              borderColor: COLORS.primary,
              color: COLORS.primary,
              '&:hover': { borderColor: COLORS.primary, bgcolor: '#EFF6FF' },
            }}
          >
            加入心愿单
          </Button>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: `1px solid ${COLORS.border}`,
              cursor: 'pointer',
              '&:hover': { bgcolor: COLORS.pageBg },
            }}
          >
            <ShareIcon sx={{ fontSize: 20, color: COLORS.textSecondary }} />
          </Box>
        </Box>

        {/* Description section */}
        {product.description && (
          <Box sx={{ pt: '20px', mt: '20px', borderTop: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '10px' }}>
              <DescriptionIcon sx={{ fontSize: 18, color: COLORS.textPrimary }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                商品描述
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
              {product.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
