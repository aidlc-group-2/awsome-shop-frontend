import { post, type PageResult } from './request';

// 后端状态机（order 仓 ExchangeStatus）：实物 PENDING_SHIPMENT → SHIPPED → COMPLETED，
// 发货前可 CANCELLED；虚拟商品创建即 COMPLETED。
export type ExchangeStatus = 'PENDING_SHIPMENT' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export interface ShippingInfoDTO {
  recipient: string | null;
  address: string | null;
  phone: string | null;
}

export interface ExchangeRecordDTO {
  id: number;
  orderNo: string;
  userId: number;
  productId: number;
  productName: string;
  productDesc: string | null;
  quantity: number;
  productType: 'PHYSICAL' | 'VIRTUAL';
  employeeName: string;
  pointsCost: number;
  exchangeTime: string;
  status: ExchangeStatus;
  shippingInfo: ShippingInfoDTO | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeStatsDTO {
  totalCount: number;
  pendingDeliveryCount: number;
  completedCount: number;
  totalPointsConsumed: number;
}

export interface CreateExchangeInput {
  requestId?: string;
  productId: number;
  productName: string;
  productDesc?: string;
  quantity: number;
  productType: 'PHYSICAL' | 'VIRTUAL';
  pointsCost: number;
  employeeName: string;
  recipient?: string;
  address?: string;
  phone?: string;
}

export const createExchange = (input: CreateExchangeInput) =>
  post<ExchangeRecordDTO>('/v1/order/exchange/create', input);

export const getMyExchange = (id: number) =>
  post<ExchangeRecordDTO>('/v1/order/exchange/get', { id });

export const listMyExchanges = (params: { page?: number; size?: number } = {}) =>
  post<PageResult<ExchangeRecordDTO>>('/v1/order/exchange/list', params);

export const cancelExchange = (id: number) =>
  post<ExchangeRecordDTO>('/v1/order/exchange/cancel', { id });

// ---- 管理端（需要 ADMIN）----

export const adminGetExchange = (id: number) =>
  post<ExchangeRecordDTO>('/v1/order/admin/exchange/get', { id });

export const adminListExchanges = (params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}) => post<PageResult<ExchangeRecordDTO>>('/v1/order/admin/exchange/list', params);

export const adminExchangeStats = () =>
  post<ExchangeStatsDTO>('/v1/order/admin/exchange/stats');

export const adminShipExchange = (id: number) =>
  post<ExchangeRecordDTO>('/v1/order/admin/exchange/ship', { id });

export const adminCompleteExchange = (id: number) =>
  post<ExchangeRecordDTO>('/v1/order/admin/exchange/complete', { id });
