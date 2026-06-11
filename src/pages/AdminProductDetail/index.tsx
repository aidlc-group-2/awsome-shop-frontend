import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { listProducts, type ProductDTO } from '../../services/product';

interface InfoField {
  label: string;
  value: string;
  valueColor?: string;
  valueSize?: number;
  valueWeight?: number;
  unit?: string;
}

const CARD_SX = {
  borderRadius: '12px',
  border: '1px solid #F1F5F9',
  bgcolor: '#FFFFFF',
} as const;

export default function AdminProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const stateProduct = (location.state as { product?: ProductDTO } | null)?.product;

  const [product, setProduct] = useState<ProductDTO | null>(stateProduct ?? null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!stateProduct);

  useEffect(() => {
    if (stateProduct || !id) return;
    let cancelled = false;
    // 后端暂无按 id 查单个商品的接口，退化为拉取列表后前端按 id 查找
    listProducts({ page: 1, size: 100 })
      .then((res) => {
        if (cancelled) return;
        const found = res.records.find((p) => p.id === Number(id));
        if (found) setProduct(found);
        else setError('未找到该商品');
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, stateProduct]);

  const handleEdit = () =>
    navigate(`/admin/products/${id}/edit`, { state: product ? { product } : undefined });

  if (loading) {
    return (
      <Box sx={{ p: '32px' }}>
        <Typography sx={{ fontSize: 14, color: '#64748B' }}>加载中...</Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', p: '32px' }}>
        <Alert severity="error" sx={{ borderRadius: '8px' }}>
          {error || '未找到该商品'}
        </Alert>
        <Link
          component="button"
          underline="none"
          onClick={() => navigate('/admin/products')}
          sx={{ fontSize: 13, color: '#2563EB', alignSelf: 'flex-start' }}
        >
          返回产品管理
        </Link>
      </Box>
    );
  }

  const isActive = product.status === 1;

  const infoRows: InfoField[][] = [
    [
      { label: '商品名称', value: product.name },
      { label: '商品编号 (SKU)', value: product.sku },
    ],
    [
      { label: '商品分类', value: product.category },
      ...(product.brand ? [{ label: '品牌', value: product.brand }] : []),
    ],
    [
      {
        label: '积分价格',
        value: `${product.pointsPrice.toLocaleString()} 积分`,
        valueColor: '#2563EB',
        valueSize: 18,
        valueWeight: 700,
      },
      ...(product.marketPrice != null
        ? [{ label: '市场参考价', value: `¥ ${product.marketPrice.toLocaleString()}` }]
        : []),
    ],
    [
      {
        label: '当前库存',
        value: String(product.stock),
        valueColor: '#16A34A',
        valueSize: 18,
        valueWeight: 700,
        unit: '件',
      },
      { label: '已兑换数量', value: `${product.soldCount} 件` },
    ],
    [
      { label: '创建时间', value: product.createdAt, valueWeight: 400 },
      { label: '最后更新', value: product.updatedAt, valueWeight: 400 },
    ],
    [
      ...(product.deliveryMethod ? [{ label: '配送方式', value: product.deliveryMethod }] : []),
      ...(product.serviceGuarantee ? [{ label: '服务保障', value: product.serviceGuarantee }] : []),
    ],
    [
      ...(product.promotion
        ? [{ label: '促销活动', value: product.promotion, valueColor: '#2563EB' }]
        : []),
      ...(product.colors ? [{ label: '可选颜色', value: product.colors }] : []),
    ],
  ].filter((row) => row.length > 0);

  const specs: { label: string; value: string }[] = (product.specs ?? []).flatMap((spec) =>
    Object.entries(spec).map(([label, value]) => ({ label, value })),
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: breadcrumb + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              component="button"
              underline="none"
              onClick={() => navigate('/admin/products')}
              sx={{ fontSize: 13, color: '#2563EB' }}
            >
              产品管理
            </Link>
            <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>/</Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>商品详情</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
              {product.name}
            </Typography>
            <Box
              sx={{
                px: '12px',
                py: '4px',
                borderRadius: '12px',
                bgcolor: isActive ? '#DCFCE7' : '#FEE2E2',
                fontSize: 12,
                fontWeight: 600,
                color: isActive ? '#166534' : '#DC2626',
              }}
            >
              {isActive ? '已上架' : '已下架'}
            </Box>
          </Box>
          {product.subtitle && (
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>{product.subtitle}</Typography>
          )}
        </Box>

        {/* Right: action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ButtonBase
            onClick={handleEdit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              bgcolor: '#2563EB',
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            <EditIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>编辑商品</Typography>
          </ButtonBase>
        </Box>
      </Box>

      {/* Content Row: image + info */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        {/* Image Card */}
        <Paper
          elevation={0}
          sx={{
            ...CARD_SX,
            width: 480,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            p: '24px',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>商品图片</Typography>

          <Box sx={{ height: '1px', bgcolor: '#E2E8F0' }} />

          {/* Main image */}
          <Box
            sx={{
              height: 300,
              borderRadius: '8px',
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
              <LocalMallIcon sx={{ fontSize: 80, color: '#2563EB' }} />
            )}
          </Box>
        </Paper>

        {/* Info Card */}
        <Paper
          elevation={0}
          sx={{
            ...CARD_SX,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            p: '24px',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>基本信息</Typography>
          <Box sx={{ height: '1px', bgcolor: '#E2E8F0' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {infoRows.map((row, rowIdx) => (
              <Box key={rowIdx} sx={{ display: 'flex', gap: '24px' }}>
                {row.map((field) => (
                  <Box key={field.label} sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>
                      {field.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Typography
                        sx={{
                          fontSize: field.valueSize ?? 14,
                          fontWeight: field.valueWeight ?? 500,
                          color: field.valueColor ?? '#1E293B',
                        }}
                      >
                        {field.value}
                      </Typography>
                      {field.unit && (
                        <Typography sx={{ fontSize: 14, color: '#64748B' }}>{field.unit}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Description Card */}
      {product.description && (
        <Paper
          elevation={0}
          sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', gap: '16px', p: '24px' }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>商品描述</Typography>
          <Box sx={{ height: '1px', bgcolor: '#E2E8F0' }} />
          <Typography sx={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        </Paper>
      )}

      {/* Specs Card */}
      {specs.length > 0 && (
        <Paper
          elevation={0}
          sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', gap: '16px', p: '24px' }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>规格参数</Typography>
          <Box sx={{ height: '1px', bgcolor: '#E2E8F0' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {specs.map((spec, idx) => (
              <Box
                key={`${spec.label}-${idx}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: '10px',
                  borderBottom: idx === specs.length - 1 ? 'none' : '1px solid #E2E8F0',
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>
                  {spec.label}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
                  {spec.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
