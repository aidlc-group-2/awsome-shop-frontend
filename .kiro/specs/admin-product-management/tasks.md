# Implementation Plan: Admin Product Management

## Overview

本實作計畫將設計文件中的管理端商品管理功能分解為可逐步執行的編碼任務。實作順序為：測試基礎設施 → 資料模型與服務層 → 狀態管理 → UI 元件 → 路由整合 → i18n → 屬性測試。每個任務建構在前一步的基礎上，確保無孤立程式碼。

## Tasks

- [ ] 1. 設定測試基礎設施與資料模型
  - [ ] 1.1 安裝測試依賴並設定 Vitest
    - 安裝 `vitest`、`@testing-library/react`、`@testing-library/jest-dom`、`jsdom`、`fast-check` 為 devDependencies
    - 建立 `vitest.config.ts`，設定 jsdom 環境與 React 插件
    - 建立 `src/test/setup.ts` 引入 `@testing-library/jest-dom`
    - 在 `package.json` 新增 `"test": "vitest --run"` 腳本
    - _Requirements: 8.4（TypeScript 介面）、設計文件 Testing Strategy_

  - [ ] 1.2 建立 TypeScript 介面與型別定義
    - 建立 `src/types/product.ts`，定義 `Product`、`ProductStatus`、`Category`、`ProductFormData`、`CreateProductDto`、`UpdateProductDto`、`GetProductsParams`、`PaginatedResponse<T>`、`ValidationResult` 介面
    - _Requirements: 8.4_

  - [ ] 1.3 實作商品驗證工具函式
    - 建立 `src/utils/productValidation.ts`
    - 實作 `validateProductForm(data: ProductFormData): ValidationResult`
    - 驗證規則：name trim 後不為空、pointsPrice 為正整數、category 不為空、stock 為非負整數
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ] 1.4 實作商品篩選工具函式
    - 建立 `src/utils/productFilters.ts`
    - 實作 `filterProducts(products: Product[], params: { search: string; category: string; status: string }): Product[]`
    - 搜尋為不區分大小寫的名稱包含匹配
    - 空字串篩選條件視為「全部」（不篩選）
    - _Requirements: 2.2, 2.4, 2.6, 2.7_

- [ ] 2. 實作服務層（Mock 資料）
  - [ ] 2.1 建立 Mock 資料與商品服務
    - 建立 `src/services/productService.ts`
    - 定義 `USE_MOCK = true` flag
    - 建立 20-30 筆 Mock 商品資料，覆蓋各分類（electronics、food、lifestyle、voucher）及狀態
    - 定義 `MOCK_CATEGORIES` 常數陣列
    - 實作 `getProducts(params)`：支援分頁、搜尋、分類與狀態篩選，回傳 `PaginatedResponse<Product>`
    - 實作 `createProduct(data)`：產生 UUID、timestamps，回傳新 Product
    - 實作 `updateProduct(id, data)`：合併更新欄位，回傳更新後 Product
    - 實作 `deleteProduct(id)`：從 Mock 資料移除
    - 實作 `toggleProductStatus(id)`：反轉商品狀態
    - 所有函式使用 async/await 模擬非同步行為（setTimeout 200ms）
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

  - [ ]* 2.2 撰寫服務層單元測試
    - 建立 `src/services/__tests__/productService.test.ts`
    - 測試 getProducts 分頁邏輯正確
    - 測試 createProduct 回傳完整 Product 物件
    - 測試 updateProduct 只更新指定欄位
    - 測試 deleteProduct 移除商品
    - 測試 toggleProductStatus 正確反轉狀態
    - _Requirements: 8.1, 8.3_

- [ ] 3. Checkpoint - 確認服務層與工具函式測試通過
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. 實作狀態管理 Store
  - [ ] 4.1 建立 useProductStore
    - 建立 `src/store/useProductStore.ts`
    - 遵循現有 `useAuthStore` 模式，使用 `create` + `persist` middleware
    - 實作 state：products、total、loading、error、page、pageSize、search、categoryFilter、statusFilter
    - 實作 actions：fetchProducts、createProduct、updateProduct、deleteProduct、toggleStatus、setPage、setPageSize、setSearch、setCategoryFilter、setStatusFilter
    - fetchProducts 使用 productService.getProducts 並組合所有 filter 參數
    - toggleStatus 實作樂觀更新：先更新 UI 再送 API，失敗時回滾
    - createProduct/updateProduct/deleteProduct 成功後呼叫 fetchProducts 重新整理
    - setSearch/setCategoryFilter/setStatusFilter 變更時重置 page 為 0
    - _Requirements: 1.5, 2.8, 6.3, 6.4, 6.6_

- [ ] 5. 實作 UI 元件
  - [ ] 5.1 建立 SearchAndFilter 元件
    - 建立 `src/pages/Products/components/SearchAndFilter.tsx`
    - 包含 TextField（搜尋）、兩個 Select（分類篩選、狀態篩選）
    - 使用 i18next `useTranslation` hook 翻譯所有標籤
    - Props 依照設計文件 `SearchAndFilterProps` 介面
    - _Requirements: 2.1, 2.3, 2.5, 7.1_

  - [ ] 5.2 建立 ProductTable 元件
    - 建立 `src/pages/Products/components/ProductTable.tsx`
    - 使用 MUI Table 渲染商品列表：名稱、分類、積分價格、庫存、狀態（Chip 標籤）、操作
    - 狀態 Chip：active 綠色、inactive 灰色
    - 操作列包含：編輯 IconButton、刪除 IconButton、狀態切換 IconButton
    - 使用 MUI TablePagination 元件，支援 5/10/25 筆選項
    - loading 時顯示 Skeleton 或 CircularProgress
    - 所有文字使用 i18n 翻譯鍵
    - Props 依照設計文件 `ProductTableProps` 介面
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 5.1, 6.1, 6.2, 7.1_

  - [ ] 5.3 建立 ProductFormDialog 元件
    - 建立 `src/pages/Products/components/ProductFormDialog.tsx`
    - MUI Dialog 包含表單欄位：name、category（Select）、description、pointsPrice、imageUrl、stock
    - product 為 null 時為新增模式（空白欄位），否則為編輯模式（預填資料）
    - 提交前呼叫 validateProductForm 驗證，顯示欄位級錯誤（helperText）
    - 底部按鈕：取消 + 提交（新增/儲存）
    - loading 時 disable 提交按鈕
    - 所有標籤與驗證訊息使用 i18n
    - Props 依照設計文件 `ProductFormDialogProps` 介面
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.9, 4.2, 4.3, 7.3_

  - [ ] 5.4 建立 ConfirmDialog 元件
    - 建立 `src/pages/Products/components/ConfirmDialog.tsx`
    - MUI Dialog 顯示 title、message（含商品名稱）
    - 底部按鈕：取消 + 確認（紅色警告）
    - loading 時 disable 確認按鈕
    - 所有文字使用 i18n
    - Props 依照設計文件 `ConfirmDialogProps` 介面
    - _Requirements: 5.2, 5.3, 5.7, 7.4_

  - [ ] 5.5 建立 ProductManagementPage 容器元件
    - 建立 `src/pages/Products/index.tsx`
    - 組裝 SearchAndFilter、ProductTable、ProductFormDialog、ConfirmDialog、Snackbar
    - 從 useProductStore 讀取狀態與 actions
    - 管理對話框開關狀態（新增/編輯/刪除確認）
    - 處理 Snackbar 通知邏輯（成功/失敗）
    - 頁面載入時呼叫 fetchProducts
    - 錯誤狀態顯示 Alert 元件與重試按鈕
    - _Requirements: 1.1, 1.5, 1.6, 3.6, 3.7, 3.8, 4.4, 4.5, 4.6, 5.4, 5.5, 5.6, 6.4, 6.5, 6.6_

- [ ] 6. 路由整合與 i18n 擴展
  - [ ] 6.1 註冊路由與擴展 i18n 翻譯
    - 在 `src/router/index.tsx` 的 admin children 中新增 `{ path: 'products', element: <ProductManagementPage /> }`
    - 在 `src/i18n/locales/zh.json` 新增 `admin.products` 命名空間翻譯鍵（頁面標題、表格欄位、按鈕、對話框、驗證訊息、通知訊息等）
    - 在 `src/i18n/locales/en.json` 新增對應英文翻譯
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7. Checkpoint - 確認整合功能正常
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. 屬性測試（Property-Based Tests）
  - [ ]* 8.1 撰寫篩選邏輯屬性測試
    - 建立 `src/utils/__tests__/productFilters.property.test.ts`
    - **Property 1: Combined filter correctness**
    - **Validates: Requirements 2.2, 2.4, 2.6, 2.7**
    - 使用 fast-check 產生隨機商品列表與篩選條件
    - 驗證結果集中所有商品皆滿足全部篩選條件
    - 驗證沒有遺漏符合條件的商品
    - 標注：Feature: admin-product-management, Property 1: Combined filter correctness

  - [ ]* 8.2 撰寫表單驗證屬性測試
    - 建立 `src/utils/__tests__/productValidation.property.test.ts`
    - **Property 2: Form validation rejects invalid inputs**
    - **Validates: Requirements 3.3, 3.4**
    - 使用 fast-check 產生隨機空白字串驗證 name 拒絕
    - 產生隨機非正整數驗證 pointsPrice 拒絕
    - 產生隨機有效 name 與正整數 price 驗證接受
    - 標注：Feature: admin-product-management, Property 2: Form validation rejects invalid inputs

  - [ ]* 8.3 撰寫編輯表單預填屬性測試
    - 在 `src/utils/__tests__/productValidation.property.test.ts` 或獨立檔案
    - **Property 3: Edit form data integrity**
    - **Validates: Requirements 4.2**
    - 使用 fast-check 產生隨機 Product，驗證編輯表單預填值與原始值完全一致
    - 標注：Feature: admin-product-management, Property 3: Edit form data integrity

  - [ ]* 8.4 撰寫刪除確認對話框屬性測試
    - **Property 4: Delete confirmation shows product identity**
    - **Validates: Requirements 5.3**
    - 使用 fast-check 產生隨機 Product，驗證確認訊息包含商品名稱
    - 標注：Feature: admin-product-management, Property 4: Delete confirmation shows product identity

  - [ ]* 8.5 撰寫刪除結果屬性測試
    - **Property 5: Deletion removes product from list**
    - **Validates: Requirements 5.4**
    - 使用 fast-check 產生隨機商品列表，隨機選取商品刪除後驗證列表長度減一且不含該商品 id
    - 標注：Feature: admin-product-management, Property 5: Deletion removes product from list

  - [ ]* 8.6 撰寫狀態切換屬性測試
    - **Property 6: Status toggle is an involution**
    - **Validates: Requirements 6.1, 6.3**
    - 使用 fast-check 產生隨機狀態，驗證切換後為相反值，切換兩次後恢復原值
    - 標注：Feature: admin-product-management, Property 6: Status toggle is an involution

  - [ ]* 8.7 撰寫 Mock 服務回應結構屬性測試
    - **Property 7: Mock service response structure conformance**
    - **Validates: Requirements 8.3**
    - 使用 fast-check 產生隨機 GetProductsParams，驗證回傳結構符合 PaginatedResponse 格式
    - 驗證 data 陣列中每個 Product 具備所有必要欄位
    - 驗證 page/pageSize 與請求參數一致
    - 標注：Feature: admin-product-management, Property 7: Mock service response structure conformance

- [ ] 9. Final Checkpoint - 確認所有測試通過
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- 標記 `*` 的任務為可選（optional），可跳過以加速 MVP 開發
- 每個任務引用具體需求以確保可追溯性
- Checkpoint 確保增量驗證
- 屬性測試驗證設計文件中定義的普遍正確性屬性
- 單元測試驗證具體範例與邊界條件
- 專案使用 TypeScript 5.9 + React 19 + Vite 7.3 + MUI 6.5 + Zustand 5 技術棧
- 樂觀更新模式用於狀態切換操作，失敗時回滾

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "4.1"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4"] },
    { "id": 5, "tasks": ["5.5"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7"] }
  ]
}
```
