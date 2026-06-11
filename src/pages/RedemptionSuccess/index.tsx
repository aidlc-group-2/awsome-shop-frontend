import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const INFO_ROWS = [
  { label: '订单编号', value: 'ORD-20260210-00158', color: '#1E293B', weight: 600 },
  { label: '兑换商品', value: 'Sony WH-1000XM5 降噪耳机', color: '#1E293B', weight: 500 },
  { label: '扣除积分', value: '2,480 积分', color: '#D97706', weight: 600 },
  { label: '剩余积分', value: '100 积分', color: '#1E293B', weight: 600 },
  { label: '预计送达', value: '3-5 个工作日', color: '#1E293B', weight: 500 },
] as const;

const dividerSx = {
  height: '1px',
  bgcolor: '#F1F5F9',
  width: '100%',
} as const;

export default function RedemptionSuccess() {
  const navigate = useNavigate();

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
              2,580 积分
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
              李
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: '24px',
          py: '32px',
        }}
      >
        {/* Success Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            width: 520,
            maxWidth: '100%',
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #F1F5F9',
            px: '40px',
            py: '48px',
          }}
        >
          {/* Success Icon Circle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '40px',
              bgcolor: '#DCFCE7',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: '#16A34A' }} />
          </Box>

          {/* Title Group */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
              兑换成功！
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>
              您的订单已提交，积分已扣除
            </Typography>
          </Box>

          <Box sx={dividerSx} />

          {/* Order Info */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              width: '100%',
              borderRadius: '12px',
              bgcolor: '#F8FAFC',
              px: '24px',
              py: '20px',
            }}
          >
            {INFO_ROWS.map((row) => (
              <Box
                key={row.label}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>{row.label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: row.weight, color: row.color }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={dividerSx} />

          {/* Button Group */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Button
              variant="contained"
              startIcon={<ReceiptLongIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate('/orders')}
              sx={{
                height: 48,
                borderRadius: '12px',
                bgcolor: '#2563EB',
                fontSize: 15,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
              }}
            >
              查看订单详情
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShoppingBagIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate('/')}
              sx={{
                height: 48,
                borderRadius: '12px',
                border: '1px solid #2563EB',
                color: '#2563EB',
                fontSize: 15,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { border: '1px solid #2563EB', bgcolor: '#EFF6FF' },
              }}
            >
              继续兑换
            </Button>
            <Button
              onClick={() => navigate('/')}
              sx={{
                height: 40,
                color: '#64748B',
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: 'transparent' },
              }}
            >
              返回首页
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
