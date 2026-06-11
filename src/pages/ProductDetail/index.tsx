import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import VideocamIcon from '@mui/icons-material/Videocam';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import RecommendIcon from '@mui/icons-material/Recommend';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import TollIcon from '@mui/icons-material/Toll';
import SpeakerIcon from '@mui/icons-material/Speaker';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

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

const THUMBNAILS = [
  { icon: HeadphonesIcon, active: true },
  { icon: HeadphonesIcon, active: false },
  { icon: HeadphonesIcon, active: false },
  { icon: HeadphonesIcon, active: false },
  { icon: VideocamIcon, active: false },
];

const SPECS: { label: string; value: string }[] = [
  { label: '品牌', value: 'Sony 索尼' },
  { label: '型号', value: 'WH-1000XM5' },
  { label: '降噪类型', value: '主动降噪（ANC）' },
  { label: '续航时间', value: '30 小时' },
  { label: '连接方式', value: '蓝牙 5.2 / 3.5mm 有线' },
  { label: '重量', value: '250g' },
  { label: '音频编码', value: 'LDAC / AAC / SBC' },
];

const SERVICES = ['正品保证', '7天无理由', '全国联保'];

const COLOR_OPTIONS = [
  { name: '黑色', dot: '#1E293B' },
  { name: '银色', dot: '#CBD5E1' },
  { name: '深蓝', dot: '#1D4ED8' },
];

const RECOMMENDATIONS = [
  { name: 'Bose QC45', points: '2,180', icon: SpeakerIcon, bg: '#DBEAFE', iconColor: '#3B82F6' },
  { name: 'AirPods Pro 2', points: '1,890', icon: HeadsetMicIcon, bg: '#F5F3FF', iconColor: '#8B5CF6' },
  { name: 'JBL Tune 770NC', points: '980', icon: HeadphonesIcon, bg: '#ECFDF5', iconColor: '#10B981' },
];

export default function ProductDetail() {
  const navigate = useNavigate();
  useParams();
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
          <HeadphonesIcon sx={{ fontSize: 160, color: COLORS.primary }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bgcolor: '#DC2626',
              color: COLORS.white,
              fontSize: 12,
              fontWeight: 600,
              px: '12px',
              py: '6px',
              borderRadius: '0 0 8px 0',
            }}
          >
            热销好物
          </Box>
        </Box>

        {/* Thumbnail row */}
        <Box sx={{ display: 'flex', gap: '8px', pt: '12px' }}>
          {THUMBNAILS.map((thumb, idx) => {
            const ThumbIcon = thumb.icon;
            const isActive = idx === activeThumb;
            return (
              <Box
                key={idx}
                onClick={() => setActiveThumb(idx)}
                sx={{
                  width: 76,
                  height: 76,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  bgcolor: isActive ? '#DBEAFE' : COLORS.pageBg,
                  border: isActive
                    ? `2px solid ${COLORS.primary}`
                    : `1px solid ${COLORS.borderLight}`,
                }}
              >
                <ThumbIcon
                  sx={{ fontSize: 32, color: isActive ? COLORS.primary : COLORS.textDisabled }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Specs section */}
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
            {SPECS.map((spec, idx) => (
              <Box
                key={spec.label}
                sx={{
                  display: 'flex',
                  borderBottom:
                    idx < SPECS.length - 1 ? `1px solid ${COLORS.border}` : 'none',
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
          <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>数码电子</Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: COLORS.textDisabled }} />
          <Typography sx={{ fontSize: 12, color: COLORS.textDisabled }}>降噪耳机</Typography>
        </Box>

        {/* Title */}
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary }}>
          Sony WH-1000XM5 降噪耳机
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5, mt: '8px' }}
        >
          业界领先主动降噪 | 30小时超长续航 | LDAC高解析度音频 | 舒适头戴设计
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '12px' }}>
          <Rating
            value={4.5}
            precision={0.5}
            size="small"
            readOnly
            sx={{
              fontSize: 16,
              '& .MuiRating-iconFilled': { color: COLORS.star },
              '& .MuiRating-iconEmpty': { color: COLORS.border },
            }}
          />
          <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
            4.5 分 · 128 条评价 · 已兑换 86 件
          </Typography>
        </Box>

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
              2,580
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: COLORS.amberDark }}>
              积分
            </Typography>
            <Typography sx={{ fontSize: 13, color: COLORS.amberDark }}>参考价 ¥2,999</Typography>
          </Box>
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
              限时
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: COLORS.amberDark }}>
              新人首兑立减 100 积分
            </Typography>
          </Box>
        </Box>

        {/* Info section: delivery, service, color, quantity */}
        <Box sx={{ pt: '16px' }}>
          {/* Delivery */}
          <Box sx={{ display: 'flex', gap: '16px', p: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}>
              配送
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Typography sx={{ fontSize: 13, color: COLORS.textPrimary }}>
                北京市朝阳区 · 公司地址配送
              </Typography>
              <Typography sx={{ fontSize: 12, color: COLORS.success }}>
                预计 1-3 个工作日送达
              </Typography>
            </Box>
          </Box>

          {/* Service */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              p: '12px 0',
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <Typography sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}>
              服务
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {SERVICES.map((svc) => (
                <Box key={svc} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircleIcon sx={{ fontSize: 14, color: COLORS.success }} />
                  <Typography sx={{ fontSize: 12, color: COLORS.textPrimary }}>{svc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Color */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              p: '12px 0',
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <Typography sx={{ fontSize: 13, color: COLORS.textDisabled, width: 48, flexShrink: 0 }}>
              颜色
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {COLOR_OPTIONS.map((color, idx) => {
                const isActive = idx === activeColor;
                return (
                  <Box
                    key={color.name}
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
                    <Box
                      sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: color.dot }}
                    />
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? COLORS.primary : COLORS.textPrimary,
                      }}
                    >
                      {color.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

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
                onClick={() => setQuantity((q) => q + 1)}
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
            <Typography sx={{ fontSize: 12, color: COLORS.textSecondary }}>
              有货 (库存56件)
            </Typography>
          </Box>
        </Box>

        {/* Button area */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', pt: '20px' }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon sx={{ fontSize: 20 }} />}
            onClick={() => navigate('/redeem/confirm')}
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
        <Box sx={{ pt: '20px', mt: '20px', borderTop: `1px solid ${COLORS.border}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '10px' }}>
            <DescriptionIcon sx={{ fontSize: 18, color: COLORS.textPrimary }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
              商品描述
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
            Sony WH-1000XM5 是索尼旗舰级无线降噪耳机，搭载全新集成处理器 V1 和 8 个麦克风，提供业界领先的降噪效果。30mm
            驱动单元带来卓越音质，支持 LDAC 高品质无线传输。轻量化设计仅重 250g，佩戴舒适。
          </Typography>
        </Box>

        {/* Recommendations section */}
        <Box sx={{ pt: '16px', mt: '16px', borderTop: `1px solid ${COLORS.border}` }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: '12px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RecommendIcon sx={{ fontSize: 18, color: COLORS.primary }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
                同类推荐
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: COLORS.primary, cursor: 'pointer' }}>
              查看更多 →
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {RECOMMENDATIONS.map((rec) => {
              const RecIcon = rec.icon;
              return (
                <Box
                  key={rec.name}
                  sx={{
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.borderLight}`,
                    bgcolor: COLORS.white,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 2 },
                  }}
                >
                  <Box
                    sx={{
                      height: 90,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: rec.bg,
                    }}
                  >
                    <RecIcon sx={{ fontSize: 36, color: rec.iconColor }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', p: '10px 12px' }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>
                      {rec.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TollIcon sx={{ fontSize: 14, color: COLORS.star }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: COLORS.amber }}>
                        {rec.points} 积分
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
