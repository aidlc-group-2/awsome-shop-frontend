import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const CATEGORY_OPTIONS = [
  { value: 'digital', label: '数码电子' },
  { value: 'life', label: '生活家居' },
  { value: 'gift', label: '礼品卡券' },
  { value: 'office', label: '办公用品' },
];

interface ProductForm {
  name: string;
  category: string;
  points: string;
  stock: string;
  active: boolean;
  description: string;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  category: 'digital',
  points: '',
  stock: '',
  active: true,
  description: '',
};

const SAMPLE_FORM: ProductForm = {
  name: 'Sony WH-1000XM5 降噪耳机',
  category: 'digital',
  points: '2580',
  stock: '45',
  active: true,
  description:
    'Sony WH-1000XM5 是索尼旗舰级无线降噪耳机，搭载全新集成处理器 V1 和 8 个麦克风，提供业界领先的降噪效果。30mm 驱动单元带来卓越音质，支持 LDAC 高品质无线传输。',
};

const FIELD_INPUT_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: 40,
  px: '12px',
  bgcolor: '#FFFFFF',
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
};

const FIELD_LABEL_SX = { fontSize: 13, fontWeight: 500, color: '#1E293B' };

export default function AdminEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isCreate = !id || location.pathname.endsWith('/new');

  const [form, setForm] = useState<ProductForm>(isCreate ? EMPTY_FORM : SAMPLE_FORM);
  const [uploadOpen, setUploadOpen] = useState(false);

  const updateField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goBack = () => navigate('/admin/products');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', p: '32px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 13 }}>
            <Link
              component="button"
              underline="none"
              onClick={goBack}
              sx={{ fontSize: 13, color: '#2563EB' }}
            >
              产品管理
            </Link>
            <Typography sx={{ fontSize: 13, color: '#94A3B8' }}>/</Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>
              {isCreate ? '新增产品' : '编辑产品'}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
            {isCreate ? '新增产品' : '编辑产品'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="outlined"
            onClick={goBack}
            sx={{
              borderColor: '#E2E8F0',
              color: '#1E293B',
              borderRadius: '8px',
              px: '20px',
              py: '8px',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
            }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
            onClick={goBack}
            sx={{
              bgcolor: '#2563EB',
              borderRadius: '8px',
              px: '20px',
              py: '8px',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            {isCreate ? '创建产品' : '保存修改'}
          </Button>
        </Box>
      </Box>

      {/* Back link */}
      <Link
        component="button"
        underline="none"
        onClick={goBack}
        sx={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', color: '#64748B' }}
      >
        <ArrowBackIcon sx={{ fontSize: 16 }} />
        <Typography sx={{ fontSize: 13, color: '#64748B' }}>返回产品列表</Typography>
      </Link>

      {/* Basic Info Card */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          p: '24px',
          borderRadius: '12px',
          border: '1px solid #F1F5F9',
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>基本信息</Typography>
        <Box sx={{ height: '1px', bgcolor: '#F1F5F9' }} />

        {/* Row 1: name + category */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>商品名称</Typography>
              <Typography sx={{ fontSize: 13, color: '#DC2626' }}>*</Typography>
            </Box>
            <Box sx={FIELD_INPUT_SX}>
              <InputBase
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="请输入商品名称"
                sx={{ flexGrow: 1, fontSize: 14, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>商品分类</Typography>
              <Typography sx={{ fontSize: 13, color: '#DC2626' }}>*</Typography>
            </Box>
            <Select
              value={form.category}
              onChange={(e: SelectChangeEvent) => updateField('category', e.target.value)}
              sx={{
                height: 40,
                bgcolor: '#FFFFFF',
                borderRadius: '8px',
                fontSize: 14,
                color: '#1E293B',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                '& .MuiSelect-select': { py: 0, display: 'flex', alignItems: 'center' },
              }}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 14 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Row 2: points + stock */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>积分价格</Typography>
              <Typography sx={{ fontSize: 13, color: '#DC2626' }}>*</Typography>
            </Box>
            <Box sx={{ ...FIELD_INPUT_SX, justifyContent: 'space-between' }}>
              <InputBase
                value={form.points}
                onChange={(e) => updateField('points', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                inputProps={{ inputMode: 'numeric' }}
                sx={{ flexGrow: 1, fontSize: 14, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
              />
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>积分</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>库存数量</Typography>
              <Typography sx={{ fontSize: 13, color: '#DC2626' }}>*</Typography>
            </Box>
            <Box sx={{ ...FIELD_INPUT_SX, justifyContent: 'space-between' }}>
              <InputBase
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                inputProps={{ inputMode: 'numeric' }}
                sx={{ flexGrow: 1, fontSize: 14, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
              />
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>件</Typography>
            </Box>
          </Box>
        </Box>

        {/* Status toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '16px',
            py: '12px',
            borderRadius: '8px',
            bgcolor: '#F8FAFC',
            border: '1px solid #F1F5F9',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>商品状态</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>
              {form.active ? '商品已上架，用户可见并可兑换' : '商品已下架，对用户不可见'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: form.active ? '#16A34A' : '#64748B' }}
            >
              {form.active ? '已上架' : '已下架'}
            </Typography>
            <Switch
              checked={form.active}
              onChange={(e) => updateField('active', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#FFFFFF' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  bgcolor: '#16A34A',
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Description Card */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          p: '24px',
          borderRadius: '12px',
          border: '1px solid #F1F5F9',
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>商品描述</Typography>
        <Box sx={{ height: '1px', bgcolor: '#F1F5F9' }} />
        <Box
          sx={{
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            p: '12px',
          }}
        >
          <InputBase
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="请输入商品描述..."
            multiline
            minRows={5}
            sx={{
              width: '100%',
              fontSize: 14,
              color: '#1E293B',
              alignItems: 'flex-start',
              '& textarea::placeholder': { color: '#94A3B8', opacity: 1 },
            }}
          />
        </Box>
      </Paper>

      {/* Image Upload Card */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          p: '24px',
          borderRadius: '12px',
          border: '1px solid #F1F5F9',
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>商品图片</Typography>
        <Box sx={{ height: '1px', bgcolor: '#F1F5F9' }} />
        <ButtonBase
          onClick={() => setUploadOpen(true)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            height: 160,
            borderRadius: '12px',
            bgcolor: '#EFF6FF',
            border: '2px dashed #2563EB',
            width: '100%',
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 36, color: '#2563EB' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#2563EB' }}>
            点击上传商品图片
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#64748B' }}>
            支持 JPG、PNG 格式，建议尺寸 800 x 800
          </Typography>
        </ButtonBase>
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        PaperProps={{ sx: { width: 560, maxWidth: '90vw', borderRadius: '16px' } }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '24px',
            py: '20px',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>上传商品图片</Typography>
          <IconButton size="small" onClick={() => setUploadOpen(false)}>
            <CloseIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '24px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              height: 160,
              borderRadius: '12px',
              bgcolor: '#EFF6FF',
              border: '2px dashed #2563EB',
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 36, color: '#2563EB' }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#2563EB' }}>
              拖拽图片到此处或点击上传
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>
              支持 JPG、PNG 格式，单张不超过 5MB
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>已上传图片</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748B' }}>0 / 6</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '12px' }}>
            {[0, 1, 2].map((idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 96,
                  height: 96,
                  borderRadius: '8px',
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 28, color: '#CBD5E1' }} />
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            px: '24px',
            py: '16px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setUploadOpen(false)}
            sx={{
              borderColor: '#E2E8F0',
              color: '#1E293B',
              borderRadius: '8px',
              px: '20px',
              py: '10px',
              fontSize: 13,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
            }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={() => setUploadOpen(false)}
            sx={{
              bgcolor: '#2563EB',
              borderRadius: '8px',
              px: '20px',
              py: '10px',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            确认上传
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
