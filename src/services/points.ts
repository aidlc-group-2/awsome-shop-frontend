import { post, type PageResult } from './request';

// ⚠️ 契约现状（2026-06）：points 服务从 body 读 operatorId 标识"当前用户"，而网关
// OperatorIdInjectionFilter 注入的字段名是 userId，两者未对齐 —— 因此 public 积分
// 接口必须由前端显式传 operatorId（值为当前登录用户 id）。

export interface PointsBalanceDTO {
  userId: number;
  balance: number;
}

export interface PointsTransactionDTO {
  id: number;
  userId: number;
  type: 'GRANT' | 'DEDUCT' | 'REFUND' | 'EXPIRE' | 'ADJUST';
  amount: number;
  balanceAfter: number;
  orderRef: string | null;
  reason: string | null;
  operatorId: number | null;
  createdAt: string;
}

export interface ExpiringPointsDTO {
  expiringAmount: number;
  earliestExpireAt: string | null;
  batchCount: number;
}

export interface PointsRuleDTO {
  id: number;
  onboardingBonus: number;
  periodicAmount: number;
  periodicCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  validityDays: number;
}

export const getBalance = (operatorId: string | number) =>
  post<PointsBalanceDTO>('/v1/public/point/balance/get', { operatorId: String(operatorId) });

export const listTransactions = (params: {
  operatorId: string | number;
  userId?: number;
  page?: number;
  size?: number;
}) =>
  post<PageResult<PointsTransactionDTO>>('/v1/public/point/transaction/list', {
    ...params,
    operatorId: String(params.operatorId),
  });

export const getExpiringPoints = (operatorId: string | number) =>
  post<ExpiringPointsDTO>('/v1/public/point/expiring/get', { operatorId: String(operatorId) });

// ---- 管理端（需要 ADMIN）----
// ⚠️ 已知网关问题：认证路由上网关会把 body 的 userId 覆盖为当前登录者 id，
//    因此"指定目标用户"的 userId 参数经网关后会失真，等网关/积分服务字段对齐后才能修复。

export const adjustPoints = (params: { userId: number; delta: number; reason: string }) =>
  post<void>('/v1/point/adjust', params);

export const getPointsRule = () => post<PointsRuleDTO>('/v1/point/rule/get');

export const updatePointsRule = (params: {
  onboardingBonus: number;
  periodicAmount: number;
  periodicCycle: string;
  validityDays: number;
}) => post<void>('/v1/point/rule/update', params);

export const adminListTransactions = (params: { userId?: number; page?: number; size?: number }) =>
  post<PageResult<PointsTransactionDTO>>('/v1/point/transaction/list', params);
