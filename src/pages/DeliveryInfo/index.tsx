import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthStore } from '../../store/useAuthStore';
import type { ProductDTO } from '../../services/product';

interface DeliveryLocationState {
  product: ProductDTO;
  quantity: number;
}

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

const fieldLabelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: '#1E293B',
} as const;

const inputSx = {
  height: 40,
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
  px: '12px',
  fontSize: 14,
  color: '#1E293B',
  '& input::placeholder': { color: '#94A3B8', opacity: 1 },
} as const;

export default function DeliveryInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const state = location.state as DeliveryLocationState | null;

  const [recipient, setRecipient] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!state?.product) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.product) return null;

  const { product, quantity } = state;
  const canSubmit = recipient.trim() !== '' && phone.trim() !== '' && address.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    navigate('/redeem/confirm', {
      state: {
        product,
        quantity,
        recipient: recipient.trim(),
        address: address.trim(),
        phone: phone.trim(),
      },
    });
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
              {(user?.points ?? 0).toLocaleString()} 积分
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
              填写收货信息
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>
              兑换商品：{product.name} × {quantity}
            </Typography>
          </Box>

          {/* Address Form */}
          <Box sx={{ ...cardSx, gap: '20px' }}>
            <Typography sx={cardTitleSx}>收货地址</Typography>
            <Box sx={dividerSx} />

            {/* Row Name + Phone */}
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>*</Typography>
                  <Typography sx={fieldLabelSx}>收货人姓名</Typography>
                </Box>
                <InputBase
                  placeholder="请输入姓名"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  sx={inputSx}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>*</Typography>
                  <Typography sx={fieldLabelSx}>手机号码</Typography>
                </Box>
                <InputBase
                  placeholder="请输入手机号码"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={inputSx}
                />
              </Box>
            </Box>

            {/* Field Address */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>*</Typography>
                <Typography sx={fieldLabelSx}>详细地址</Typography>
              </Box>
              <InputBase
                placeholder="请输入详细地址，如街道、门牌号、楼层等"
                multiline
                minRows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  p: '10px 12px',
                  fontSize: 14,
                  color: '#1E293B',
                  '& textarea::placeholder': { color: '#94A3B8', opacity: 1 },
                }}
              />
            </Box>
          </Box>

          {/* Button Row */}
          <Box sx={{ display: 'flex', gap: '12px', pt: '8px', pb: '16px' }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon sx={{ fontSize: 20 }} />}
              disabled={!canSubmit}
              onClick={handleSubmit}
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
              保存并使用此地址
            </Button>
            <Button
              variant="outlined"
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
              返回
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
