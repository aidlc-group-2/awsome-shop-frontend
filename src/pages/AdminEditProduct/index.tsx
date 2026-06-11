import { useEffect, useState } from 'react';
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
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {
  createProduct,
  listCategories,
  type CategoryDTO,
  type ProductDTO,
} from '../../services/product';

interface ProductForm {
  name: string;
  sku: string;
  category: string;
  points: string;
  stock: string;
  active: boolean;
  description: string;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  sku: '',
  category: '',
  points: '',
  stock: '',
  active: true,
  description: '',
};

/** 把分类树打平成名称列表（一级 + 子级） */
const flattenCategoryNames = (cats: CategoryDTO[]): string[] => {
  const names: string[] = [];
  const walk = (list: CategoryDTO[]) => {
    list.forEach((c) => {
      names.push(c.name);
      if (c.children && c.children.length > 0) walk(c.children);
    });
  };
  walk(cats);
  return names;
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
  const stateProduct = (location.state as { product?: ProductDTO } | null)?.product;

  const isCreate = !id || location.pathname.endsWith('/new');
  // 后端暂未提供商品更新接口，编辑模式下整体只读
  const readOnly = !isCreate;

  const [form, setForm] = useState<ProductForm>(() => {
    if (isCreate || !stateProduct) return EMPTY_FORM;
    return {
      name: stateProduct.name,
      sku: stateProduct.sku,
      category: stateProduct.category,
      points: String(stateProduct.pointsPrice),
      stock: String(stateProduct.stock),
      active: stateProduct.status === 1,
      description: stateProduct.description ?? '',
    };
  });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listCategories({})
      .then((cats) => setCategoryNames(flattenCategoryNames(cats)))
      .catch(() => setCategoryNames([]));
  }, []);

  const updateField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goBack = () => navigate('/admin/products');

  const handleSubmit = async () => {
    if (readOnly) return;
    if (!form.name.trim() || !form.sku.trim() || !form.category || !form.points) {
      setError('请填写商品名称、SKU、分类和积分价格');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        pointsPrice: Number(form.points),
        stock: form.stock ? Number(form.stock) : undefined,
        status: form.active ? 1 : 0,
        description: form.description.trim() || undefined,
      });
      setSnackbar('创建成功');
      window.setTimeout(() => navigate('/admin/products'), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 分类选项：编辑模式下若当前分类不在列表中也要可显示
  const categoryOptions =
    form.category && !categoryNames.includes(form.category)
      ? [form.category, ...categoryNames]
      : categoryNames;

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
            onClick={handleSubmit}
            disabled={readOnly || submitting}
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

      {readOnly && (
        <Alert severity="info" sx={{ borderRadius: '8px' }}>
          后端暂未提供商品更新接口，当前只读
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ borderRadius: '8px' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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

        {/* Row 1: name + sku */}
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
                disabled={readOnly}
                sx={{ flexGrow: 1, fontSize: 14, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>商品编号 (SKU)</Typography>
              <Typography sx={{ fontSize: 13, color: '#DC2626' }}>*</Typography>
            </Box>
            <Box sx={FIELD_INPUT_SX}>
              <InputBase
                value={form.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                placeholder="请输入商品编号"
                disabled={readOnly}
                sx={{ flexGrow: 1, fontSize: 14, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
              />
            </Box>
          </Box>
        </Box>

        {/* Row 2: category */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>商品分类</Typography>
              <Typography sx={{ fontSize: 13, color: '#DC2626' }}>*</Typography>
            </Box>
            <Select
              value={form.category}
              onChange={(e: SelectChangeEvent) => updateField('category', e.target.value)}
              displayEmpty
              disabled={readOnly}
              renderValue={(selected) =>
                selected ? (
                  selected
                ) : (
                  <Typography component="span" sx={{ fontSize: 14, color: '#94A3B8' }}>
                    请选择商品分类
                  </Typography>
                )
              }
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
              {categoryOptions.map((name) => (
                <MenuItem key={name} value={name} sx={{ fontSize: 14 }}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Row 3: points + stock */}
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
                disabled={readOnly}
                inputProps={{ inputMode: 'numeric' }}
                sx={{ flexGrow: 1, fontSize: 14, color: '#1E293B', '& input::placeholder': { color: '#94A3B8', opacity: 1 } }}
              />
              <Typography sx={{ fontSize: 13, color: '#64748B' }}>积分</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Box sx={{ display: 'flex', gap: '2px' }}>
              <Typography sx={FIELD_LABEL_SX}>库存数量</Typography>
            </Box>
            <Box sx={{ ...FIELD_INPUT_SX, justifyContent: 'space-between' }}>
              <InputBase
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
                disabled={readOnly}
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
              disabled={readOnly}
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
            disabled={readOnly}
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
          disabled={readOnly}
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

      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
