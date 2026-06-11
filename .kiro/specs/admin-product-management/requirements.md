# Requirements Document

## Introduction

本文件定義了 AWSome Shop 前端管理端的商品管理功能需求。該功能為管理員提供位於 `/admin/products` 路由的完整 CRUD 介面，用於管理員工積分兌換商城中的商品。頁面包含分頁顯示的商品列表、搜尋、分類篩選、新增商品、編輯商品、刪除商品，以及商品上下架狀態管理。實作初期使用 Mock 資料，但服務層架構設計為可無縫切換至後端 API（經由 API Gateway 轉發至 product-service）。

## Glossary

- **商品管理頁面（Product_Management_Page）**：渲染於 `/admin/products` 路由的管理頁面，負責展示和管理商品目錄
- **商品表格（Product_Table）**：使用 MUI Table 元件渲染的分頁商品列表，包含可操作的欄位
- **商品表單（Product_Form）**：用於新增和編輯商品資訊的對話框表單
- **商品服務（Product_Service）**：封裝所有商品相關 API 呼叫的服務模組（初期使用 Mock 資料）
- **管理員（Admin）**：已認證且角色為 "admin" 的使用者，擁有商品管理功能的存取權限
- **商品（Product）**：商品目錄中的項目，包含 id、名稱、分類、積分價格、狀態、描述、圖片、庫存等屬性
- **商品狀態（Product_Status）**：商品的二元狀態，"上架（active）"表示對員工可見，"下架（inactive）"表示從商城隱藏
- **搜尋欄（Search_Bar）**：用於按名稱篩選商品的文字輸入欄位
- **分類篩選器（Category_Filter）**：用於按分類篩選商品的下拉選擇器
- **狀態篩選器（Status_Filter）**：用於按上架或下架狀態篩選商品的下拉選擇器
- **確認對話框（Confirmation_Dialog）**：要求管理員在執行破壞性操作前確認的模態對話框
- **分頁控制項（Pagination_Controls）**：使用 MUI TablePagination 元件實現的頁面導覽控制項

## Requirements

### Requirement 1: 商品列表顯示

**User Story:** 身為管理員，我希望能以分頁表格查看所有商品，以便高效瀏覽和管理商品目錄。

#### Acceptance Criteria

1. WHEN 管理員導覽至 `/admin/products` 時，THE Product_Management_Page SHALL 顯示包含商品記錄的 Product_Table，欄位包括名稱、分類、積分價格、庫存、狀態及操作
2. THE Product_Table SHALL 預設每頁顯示 10 筆商品
3. WHEN 商品列表超過當前頁面大小時，THE Pagination_Controls SHALL 允許管理員在頁面之間導覽
4. THE Pagination_Controls SHALL 允許管理員選擇每頁 5、10 或 25 筆的頁面大小
5. WHEN Product_Management_Page 載入時，THE Product_Service SHALL 取得商品資料並顯示載入指示器直到資料就緒
6. IF Product_Service 取得商品資料失敗，THEN THE Product_Management_Page SHALL 顯示描述失敗原因的錯誤訊息

### Requirement 2: 商品搜尋與篩選

**User Story:** 身為管理員，我希望能搜尋和篩選商品，以便快速找到需要管理的特定商品。

#### Acceptance Criteria

1. THE Product_Management_Page SHALL 在 Product_Table 上方顯示 Search_Bar
2. WHEN 管理員在 Search_Bar 輸入文字時，THE Product_Table SHALL 篩選顯示名稱包含輸入文字的商品（不區分大小寫）
3. THE Product_Management_Page SHALL 在 Product_Table 上方顯示 Category_Filter 下拉選單
4. WHEN 管理員從 Category_Filter 選擇一個分類時，THE Product_Table SHALL 篩選顯示屬於該分類的商品
5. THE Product_Management_Page SHALL 在 Product_Table 上方顯示 Status_Filter 下拉選單
6. WHEN 管理員從 Status_Filter 選擇一個狀態時，THE Product_Table SHALL 篩選顯示具有該狀態的商品
7. WHEN 多個篩選條件同時啟用時，THE Product_Table SHALL 僅顯示符合所有篩選條件的商品
8. WHEN 篩選條件改變結果集時，THE Pagination_Controls SHALL 重置至第一頁

### Requirement 3: 新增商品

**User Story:** 身為管理員，我希望能新增商品，以便擴充員工可兌換的商品目錄。

#### Acceptance Criteria

1. THE Product_Management_Page SHALL 在 Product_Table 上方顯示「新增商品」按鈕
2. WHEN 管理員點擊「新增商品」按鈕時，THE Product_Form SHALL 在對話框中開啟，包含名稱、分類、描述、積分價格、圖片、庫存等空白欄位
3. THE Product_Form SHALL 在提交前驗證名稱欄位不為空
4. THE Product_Form SHALL 在提交前驗證積分價格為正整數
5. THE Product_Form SHALL 在提交前驗證已選擇分類
6. WHEN 管理員提交有效的 Product_Form 時，THE Product_Service SHALL 建立新商品，且 THE Product_Table SHALL 重新整理以包含新商品
7. WHEN 商品建立成功時，THE Product_Management_Page SHALL 顯示成功通知
8. IF Product_Service 建立商品失敗，THEN THE Product_Management_Page SHALL 顯示描述失敗原因的錯誤通知
9. WHEN 管理員點擊 Product_Form 中的「取消」按鈕時，THE Product_Form SHALL 關閉且不儲存任何變更

### Requirement 4: 編輯商品

**User Story:** 身為管理員，我希望能編輯現有商品，以便在需要時更新商品資訊。

#### Acceptance Criteria

1. THE Product_Table SHALL 在每一商品列顯示編輯操作按鈕
2. WHEN 管理員點擊編輯操作按鈕時，THE Product_Form SHALL 在對話框中開啟，並預先填入所選商品的資料
3. THE Product_Form SHALL 對編輯操作套用與新增相同的驗證規則（名稱不為空、積分價格為正整數、已選擇分類）
4. WHEN 管理員提交有效的編輯 Product_Form 時，THE Product_Service SHALL 更新商品，且 THE Product_Table SHALL 重新整理以顯示更新後的資料
5. WHEN 商品更新成功時，THE Product_Management_Page SHALL 顯示成功通知
6. IF Product_Service 更新商品失敗，THEN THE Product_Management_Page SHALL 顯示描述失敗原因的錯誤通知

### Requirement 5: 刪除商品

**User Story:** 身為管理員，我希望能從目錄中刪除商品，以便移除已停售或錯誤的商品。

#### Acceptance Criteria

1. THE Product_Table SHALL 在每一商品列顯示刪除操作按鈕
2. WHEN 管理員點擊刪除操作按鈕時，THE Confirmation_Dialog SHALL 開啟並要求管理員確認刪除操作
3. THE Confirmation_Dialog SHALL 顯示正在刪除的商品名稱
4. WHEN 管理員確認刪除時，THE Product_Service SHALL 刪除該商品，且 THE Product_Table SHALL 重新整理且不再包含已刪除的商品
5. WHEN 商品刪除成功時，THE Product_Management_Page SHALL 顯示成功通知
6. IF Product_Service 刪除商品失敗，THEN THE Product_Management_Page SHALL 顯示描述失敗原因的錯誤通知
7. WHEN 管理員取消 Confirmation_Dialog 時，THE Product_Table SHALL 保持不變

### Requirement 6: 商品上下架管理

**User Story:** 身為管理員，我希望能切換商品的上下架狀態，以便控制哪些商品對員工可見。

#### Acceptance Criteria

1. THE Product_Table SHALL 以彩色標籤顯示每件商品的當前狀態（綠色代表上架、灰色代表下架）
2. THE Product_Table SHALL 在每一商品列顯示狀態切換操作按鈕
3. WHEN 管理員點擊狀態切換操作按鈕時，THE Product_Service SHALL 將商品狀態更新為相反值（上架變下架，或下架變上架）
4. WHEN 狀態切換成功時，THE Product_Table SHALL 立即反映新狀態
5. WHEN 狀態切換成功時，THE Product_Management_Page SHALL 顯示指示新狀態的成功通知
6. IF Product_Service 切換狀態失敗，THEN THE Product_Management_Page SHALL 顯示錯誤通知，且 THE Product_Table SHALL 恢復為先前的狀態

### Requirement 7: 國際化支援

**User Story:** 身為管理員，我希望商品管理頁面支援中文和英文，以便使用偏好的語言操作介面。

#### Acceptance Criteria

1. THE Product_Management_Page SHALL 使用 i18next 翻譯系統渲染所有靜態文字標籤
2. WHEN 管理員切換應用程式語言時，THE Product_Management_Page SHALL 立即以所選語言顯示所有標籤，無需頁面重新載入
3. THE Product_Form SHALL 使用 i18next 翻譯系統渲染所有欄位標籤和驗證訊息
4. THE Confirmation_Dialog SHALL 使用 i18next 翻譯系統渲染所有文字內容

### Requirement 8: 服務層架構

**User Story:** 身為開發人員，我希望商品服務的結構設計便於後端整合，以便從 Mock 資料切換至真實 API 呼叫時只需最少的程式碼修改。

#### Acceptance Criteria

1. THE Product_Service SHALL 暴露非同步函式用於列表查詢、新增、更新、刪除及切換狀態操作
2. THE Product_Service SHALL 使用 `src/services/request.ts` 中已有的 Axios 請求實例進行 API 呼叫
3. WHILE 後端服務不可用時，THE Product_Service SHALL 返回符合預期 API 回應結構的 Mock 資料
4. THE Product_Service SHALL 定義商品實體及所有請求/回應的 TypeScript 介面
5. THE Product_Service SHALL 以 API Gateway 上的 `/product-service` 端點路徑作為未來後端整合的目標
