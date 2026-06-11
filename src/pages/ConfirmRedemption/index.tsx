import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthStore } from '../../store/useAuthStore';
import { createExchange } from '../../services/order';
import type { ProductDTO } from '../../services/product';

interface ConfirmLocationState {
  product: ProductDTO;
  quantity: number;
  recipient: string;
  address: string;
  phone: string;
}

const NOTES = [
  '· 兑换成功后积分将立即扣除，不可撤销',
  '· 商品将在 3-5 个工作日内配送至收货地址',
  '· 如有问题请联系管理员处理',
];

const cardSx = {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  bgcolor: '#FFFFFF',
  border: '1px solid #F1F5F9',
  p: '24px',
} as const;

const cardTitleSx = {
  fontSize: 16,
  fontWeight: 600,
  color: '#1E293B',
} as const;

const dividerSx = {
  height: '1px',
  bgcolor: '#F1F5F9',
  width: '100%',
} as const;

export default function ConfirmRedemption() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const state = location.state as ConfirmLocationState | null;

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.product) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.product) return null;

  const { product, quantity, recipient, address, phone } = state;
  const totalPoints = product.pointsPrice * quantity;
  const balance = user?.points ?? 0;
  const remaining = balance - totalPoints;

  const handleConfirm = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const record = await createExchange({
        requestId: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        productDesc: product.description ?? undefined,
        quantity,
        productType: 'PHYSICAL',
        pointsCost: totalPoints,
        employeeName: user.displayName,
        recipient,
        address,
        phone,
      });
      await useAuthStore.getState().refreshPoints();
      navigate('/redeem/success', { state: { record } });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '兑换失败，请稍后重试');
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
      }}
    >
      {/* Top Nav */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
          px: '32px',
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <RedeemIcon sx={{ fontSize: 28, color: '#2563EB' }} />
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
              AWSome Shop
            </Typography>
          </Box>
          <Box
            onClick={() => navigate('/')}
            sx={{
              px: '16px',
              py: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#F8FAFC' },
            }}
          >
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>首页</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              bgcolor: '#FFFBEB',
              borderRadius: '20px',
              px: '14px',
              py: '6px',
            }}
          >
            <TollIcon sx={{ fontSize: 18, color: '#D97706' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#D97706' }}>
              {balance.toLocaleString()} 积分
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '20px',
              bgcolor: '#2563EB',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>
              {user?.displayName?.charAt(0) ?? ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: '32px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', width: 720 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Typography sx={{ fontSize: 13, color: '#2563EB' }}>首页</Typography>
              <Typography sx={{ fontSize: 13, color: '#CBD5E1' }}>/</Typography>
              <Typography sx={{ fontSize: 13, color: '#2563EB' }}>{product.name}</Typography>
              <Typography sx={{ fontSize: 13, color: '#CBD5E1' }}>/</Typography>
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>确认兑换</Typography>
            </Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
              确认兑换
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          )}

          {/* Product Card */}
          <Box sx={{ ...cardSx, gap: '20px' }}>
            <Typography sx={cardTitleSx}>商品信息</Typography>
            <Box sx={dividerSx} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '8px',
                  bgcolor: '#DBEAFE',
                  flexShrink: 0,
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
                  <HeadphonesIcon sx={{ fontSize: 40, color: '#2563EB' }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
                  {product.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                  {product.category}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: product.stock >= quantity ? '#16A34A' : '#DC2626',
                  }}
                >
                  {product.stock >= quantity ? '库存充足' : '库存不足'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px',
                }}
              >
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>数量</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                  × {quantity}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Points Card */}
          <Box sx={{ ...cardSx, gap: '16px' }}>
            <Typography sx={cardTitleSx}>积分明细</Typography>
            <Box sx={dividerSx} />
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>商品积分价</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {product.pointsPrice.toLocaleString()} 积分
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>数量</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                × {quantity}
              </Typography>
            </Box>
            <Box sx={dividerSx} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                应付积分
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
                {totalPoints.toLocaleString()} 积分
              </Typography>
            </Box>
          </Box>

          {/* Balance Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '8px',
              bgcolor: '#EFF6FF',
              px: '20px',
              py: '12px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 20, color: '#2563EB' }} />
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>当前积分余额</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                {balance.toLocaleString()} 积分
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#CBD5E1' }}>→</Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: remaining >= 0 ? '#16A34A' : '#DC2626',
                }}
              >
                兑换后剩余 {remaining.toLocaleString()} 积分
              </Typography>
            </Box>
          </Box>

          {/* Delivery Card */}
          <Box sx={{ ...cardSx, gap: '16px' }}>
            <Typography sx={cardTitleSx}>收货信息</Typography>
            <Box sx={dividerSx} />
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>收货人</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {recipient}  {phone}
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography sx={{ fontSize: 14, color: '#64748B' }}>收货地址</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                {address}
              </Typography>
            </Box>
          </Box>

          {/* Button Row */}
          <Box sx={{ display: 'flex', gap: '12px', pt: '8px' }}>
            <Button
              variant="contained"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={18} sx={{ color: '#94A3B8' }} />
                ) : (
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                )
              }
              onClick={handleConfirm}
              sx={{
                flex: 1,
                height: 48,
                borderRadius: '8px',
                bgcolor: '#2563EB',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
              }}
            >
              {submitting ? '提交中…' : '确认兑换'}
            </Button>
            <Button
              variant="outlined"
              disabled={submitting}
              onClick={() => navigate(-1)}
              sx={{
                flex: 1,
                height: 48,
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' },
              }}
            >
              返回商品
            </Button>
          </Box>

          {/* Note Row */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', pb: '16px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>
              温馨提示
            </Typography>
            {NOTES.map((note) => (
              <Typography key={note} sx={{ fontSize: 12, color: '#CBD5E1' }}>
                {note}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
