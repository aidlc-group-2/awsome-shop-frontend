import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Link from '@mui/material/Link';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import AddIcon from '@mui/icons-material/Add';

interface InfoField {
  label: string;
  value: string;
  valueColor?: string;
  valueSize?: number;
  valueWeight?: number;
  unit?: string;
}

const INFO_ROWS: InfoField[][] = [
  [
    { label: '商品名称', value: 'Sony WH-1000XM5 降噪耳机' },
    { label: '商品编号 (SKU)', value: 'SKU-SONY-WH1000XM5-BLK' },
  ],
  [
    { label: '商品分类', value: '数码电子 / 耳机音响' },
    { label: '品牌', value: 'Sony' },
  ],
  [
    { label: '积分价格', value: '2,580 积分', valueColor: '#2563EB', valueSize: 18, valueWeight: 700 },
    { label: '市场参考价', value: '¥ 2,999.00' },
  ],
  [
    { label: '当前库存', value: '156', valueColor: '#16A34A', valueSize: 18, valueWeight: 700, unit: '件' },
    { label: '已兑换数量', value: '44 件' },
  ],
  [
    { label: '创建时间', value: '2026-01-15 10:30:00', valueWeight: 400 },
    { label: '最后更新', value: '2026-02-08 16:45:12', valueWeight: 400 },
  ],
  [
    { label: '配送方式', value: '公司地址配送（1-3 个工作日）' },
    { label: '服务保障', value: '正品保证 / 7天无理由 / 全国联保' },
  ],
  [
    { label: '促销活动', value: '新人首兑立减 100 积分', valueColor: '#2563EB' },
    { label: '可选颜色', value: '黑色 / 银白色 / 午夜蓝' },
  ],
];

const SPECS: { label: string; value: string }[] = [
  { label: '颜色', value: '黑色 / 银白色' },
  { label: '连接方式', value: '蓝牙 5.2 / 3.5mm 有线' },
  { label: '续航时间', value: '30 小时（降噪开启）' },
  { label: '重量', value: '250g' },
  { label: '驱动单元', value: '30mm' },
];

const DESCRIPTION =
  'Sony WH-1000XM5 是索尼旗舰级无线降噪耳机，搭载全新集成处理器 V1 和 8 个麦克风，提供业界领先的降噪效果。30mm 驱动单元带来卓越音质，支持 LDAC 高品质无线传输。轻量化设计仅重 250g，佩戴舒适。30 小时超长续航，支持快充（3 分钟充电可播放 3 小时）。支持多点连接，可同时连接两台设备。';

const CARD_SX = {
  borderRadius: '12px',
  border: '1px solid #F1F5F9',
  bgcolor: '#FFFFFF',
} as const;

export default function AdminProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleEdit = () => navigate(`/admin/products/${id}/edit`);

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
              Sony WH-1000XM5 降噪耳机
            </Typography>
            <Box
              sx={{
                px: '12px',
                py: '4px',
                borderRadius: '12px',
                bgcolor: '#DCFCE7',
                fontSize: 12,
                fontWeight: 600,
                color: '#166534',
              }}
            >
              已上架
            </Box>
          </Box>
        </Box>

        {/* Right: action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ButtonBase
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              border: '1px solid #D97706',
              '&:hover': { bgcolor: '#FFFBEB' },
            }}
          >
            <VisibilityOffIcon sx={{ fontSize: 18, color: '#D97706' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#D97706' }}>下架</Typography>
          </ButtonBase>

          <ButtonBase
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              border: '1px solid #E2E8F0',
              '&:hover': { bgcolor: '#F8FAFC' },
            }}
          >
            <Inventory2Icon sx={{ fontSize: 18, color: '#1E293B' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>调整库存</Typography>
          </ButtonBase>

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

          <ButtonBase
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              px: '16px',
              py: '8px',
              border: '1px solid #DC2626',
              '&:hover': { bgcolor: '#FEF2F2' },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18, color: '#DC2626' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#DC2626' }}>删除</Typography>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>商品图片</Typography>
            <ButtonBase
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '6px',
                px: '10px',
                py: '4px',
                border: '1px solid #2563EB',
                '&:hover': { bgcolor: '#EFF6FF' },
              }}
            >
              <FileUploadOutlinedIcon sx={{ fontSize: 16, color: '#2563EB' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#2563EB' }}>上传图片</Typography>
            </ButtonBase>
          </Box>

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
            }}
          >
            <HeadphonesIcon sx={{ fontSize: 80, color: '#2563EB' }} />
          </Box>

          {/* Thumbnails */}
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '6px',
                bgcolor: '#DBEAFE',
                border: '2px solid #2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeadphonesIcon sx={{ fontSize: 32, color: '#2563EB' }} />
            </Box>
            {[0, 1].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '6px',
                  bgcolor: '#EFF6FF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeadphonesIcon sx={{ fontSize: 32, color: '#93C5FD' }} />
              </Box>
            ))}
            <ButtonBase
              sx={{
                width: 80,
                height: 80,
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <AddIcon sx={{ fontSize: 24, color: '#94A3B8' }} />
            </ButtonBase>
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
            {INFO_ROWS.map((row, rowIdx) => (
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
      <Paper
        elevation={0}
        sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', gap: '16px', p: '24px' }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>商品描述</Typography>
        <Box sx={{ height: '1px', bgcolor: '#E2E8F0' }} />
        <Typography sx={{ fontSize: 14, color: '#64748B', lineHeight: 1.8 }}>{DESCRIPTION}</Typography>
      </Paper>

      {/* Specs Card */}
      <Paper
        elevation={0}
        sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', gap: '16px', p: '24px' }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>规格参数</Typography>
        <Box sx={{ height: '1px', bgcolor: '#E2E8F0' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {SPECS.map((spec, idx) => (
            <Box
              key={spec.label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: '10px',
                borderBottom: idx === SPECS.length - 1 ? 'none' : '1px solid #E2E8F0',
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
    </Box>
  );
}
