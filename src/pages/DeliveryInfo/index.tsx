import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import RedeemIcon from '@mui/icons-material/Redeem';
import TollIcon from '@mui/icons-material/Toll';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr1',
    name: '李明',
    phone: '138****6789',
    address: '北京市海淀区中关村软件园 A 座 305',
    isDefault: true,
  },
  {
    id: 'addr2',
    name: '李明',
    phone: '138****6789',
    address: '上海市浦东新区张江高科技园区碧波路 888 号',
  },
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

const selectSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
  px: '12px',
  cursor: 'pointer',
  flex: 1,
} as const;

export default function DeliveryInfo() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>('addr1');

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>
              填写收货信息
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#64748B' }}>
              请选择已有地址或填写新的收货信息
            </Typography>
          </Box>

          {/* Saved Addresses */}
          <Box sx={{ ...cardSx, gap: '16px' }}>
            <Typography sx={cardTitleSx}>已保存地址</Typography>
            <Box sx={dividerSx} />
            {SAVED_ADDRESSES.map((addr) => {
              const selected = selectedId === addr.id;
              return (
                <Box
                  key={addr.id}
                  onClick={() => setSelectedId(addr.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderRadius: '8px',
                    p: '12px 16px',
                    cursor: 'pointer',
                    border: selected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  }}
                >
                  {/* Radio */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '10px',
                      flexShrink: 0,
                      bgcolor: selected ? '#2563EB' : 'transparent',
                      border: selected ? 'none' : '2px solid #E2E8F0',
                    }}
                  >
                    {selected && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '4px',
                          bgcolor: '#FFFFFF',
                        }}
                      />
                    )}
                  </Box>
                  {/* Info */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                        {addr.name}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                        {addr.phone}
                      </Typography>
                      {addr.isDefault && (
                        <Box
                          sx={{
                            borderRadius: '4px',
                            bgcolor: '#EFF6FF',
                            px: '8px',
                            py: '2px',
                          }}
                        >
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#2563EB' }}>
                            默认
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 13, color: '#64748B' }}>
                      {addr.address}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* New Address Form */}
          <Box sx={{ ...cardSx, gap: '20px' }}>
            {/* Form Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={cardTitleSx}>新增收货地址</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <AddCircleIcon sx={{ fontSize: 18, color: '#2563EB' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#2563EB' }}>
                  展开填写
                </Typography>
              </Box>
            </Box>
            <Box sx={dividerSx} />

            {/* Row Name + Phone */}
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>*</Typography>
                  <Typography sx={fieldLabelSx}>收货人姓名</Typography>
                </Box>
                <InputBase placeholder="请输入姓名" sx={inputSx} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>*</Typography>
                  <Typography sx={fieldLabelSx}>手机号码</Typography>
                </Box>
                <InputBase placeholder="请输入手机号码" sx={inputSx} />
              </Box>
            </Box>

            {/* Row Region + Zip */}
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>*</Typography>
                  <Typography sx={fieldLabelSx}>所在地区</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  {['请选择省份', '请选择城市', '请选择区县'].map((ph) => (
                    <Box key={ph} sx={selectSx}>
                      <Typography sx={{ fontSize: 14, color: '#94A3B8' }}>{ph}</Typography>
                      <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', width: 160 }}>
                <Typography sx={fieldLabelSx}>邮政编码</Typography>
                <InputBase placeholder="选填" sx={inputSx} />
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

            {/* Check Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '4px',
                  border: '1.5px solid #E2E8F0',
                  cursor: 'pointer',
                }}
              />
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>设为默认收货地址</Typography>
            </Box>
          </Box>

          {/* Button Row */}
          <Box sx={{ display: 'flex', gap: '12px', pt: '8px', pb: '16px' }}>
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
