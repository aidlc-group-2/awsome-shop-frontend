import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const POINTS_ROWS = [
  { label: '商品积分价', value: '2,580 积分', accent: false },
  { label: '数量', value: '× 1', accent: false },
  { label: '新人首兑优惠', value: '- 100 积分', accent: true },
];

const DELIVERY_ROWS = [
  { label: '收货人', value: '李明  138****6789' },
  { label: '收货地址', value: '北京市海淀区中关村软件园 A 座 305' },
];

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
            onClick={() => navigate(-1)}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <RedeemIcon sx={{ fontSize: 28, color: '#2563EB' }} />
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
              AWSome Shop
            </Typography>
          </Box>
          <Box
            onClick={() => navigate(-1)}
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
              <Typography sx={{ fontSize: 13, color: '#2563EB' }}>
                Sony WH-1000XM5 降噪耳机
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#CBD5E1' }}>/</Typography>
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>确认兑换</Typography>
            </Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
              确认兑换
            </Typography>
          </Box>

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
                }}
              >
                <HeadphonesIcon sx={{ fontSize: 40, color: '#2563EB' }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
                  Sony WH-1000XM5 降噪耳机
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#64748B' }}>颜色：黑色</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#16A34A' }}>
                  库存充足
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>数量</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
                      −
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                    1
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
                      +
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Points Card */}
          <Box sx={{ ...cardSx, gap: '16px' }}>
            <Typography sx={cardTitleSx}>积分明细</Typography>
            <Box sx={dividerSx} />
            {POINTS_ROWS.map((row) => (
              <Box
                key={row.label}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography sx={{ fontSize: 14, color: row.accent ? '#D97706' : '#64748B' }}>
                  {row.label}
                </Typography>
                <Typography
                  sx={{ fontSize: 14, fontWeight: 500, color: row.accent ? '#D97706' : '#1E293B' }}
                >
                  {row.value}
                </Typography>
              </Box>
            ))}
            <Box sx={dividerSx} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>
                应付积分
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
                2,480 积分
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
                2,580 积分
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#CBD5E1' }}>→</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#16A34A' }}>
                兑换后剩余 100 积分
              </Typography>
            </Box>
          </Box>

          {/* Delivery Card */}
          <Box sx={{ ...cardSx, gap: '16px' }}>
            <Typography sx={cardTitleSx}>收货信息</Typography>
            <Box sx={dividerSx} />
            {DELIVERY_ROWS.map((row) => (
              <Box
                key={row.label}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography sx={{ fontSize: 14, color: '#64748B' }}>{row.label}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Button Row */}
          <Box sx={{ display: 'flex', gap: '12px', pt: '8px' }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate('/redeem/success')}
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
              确认兑换
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
