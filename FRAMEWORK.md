# Web 教學白板 - 程式架構圖

## 整體架構概覽

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                          │
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │   Toolbar UI    │  │         Canvas Element          │   │
│  │                 │  │                                 │   │
│  │ [P][E][T][N]    │  │                                 │   │
│  │ [QR][⏱][Clear] │  │        #whiteboard              │   │
│  │ [Color][Width]  │  │                                 │   │
│  │ [Background]    │  │                                 │   │
│  └─────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         app.js                             │
│                    (應用程式進入點)                          │
│                                                             │
│  • 初始化所有模組                                            │
│  • 綁定工具列事件                                            │
│  • 協調模組間通訊                                            │
│  • 管理工具切換狀態                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      模組架構                               │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  CanvasModule   │  │ BackgroundModule│                  │
│  │   (核心畫布)     │  │   (背景管理)     │                  │
│  │                 │  │                 │                  │
│  │ • 畫布初始化     │  │ • 背景類型管理   │                  │
│  │ • 繪圖事件處理   │  │ • 格線圖案生成   │                  │
│  │ • RWD 響應調整   │  │ • 背景重繪      │                  │
│  │ • 繪圖歷史管理   │  │ • 自訂顏色支援   │                  │
│  │ • 內容重繪機制   │  │                 │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ TextToolModule  │  │  NotesModule    │                  │
│  │   (文字工具)     │  │   (便條紙)       │                  │
│  │                 │  │                 │                  │
│  │ • 文字輸入面板   │  │ • 便條紙新增     │                  │
│  │ • 畫布點擊處理   │  │ • 文字編輯功能   │                  │
│  │ • 文字樣式設定   │  │ • 拖拽移動系統   │                  │
│  │ • 文字重繪邏輯   │  │ • 便條紙重繪     │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ QRCodeModule    │  │  TimerModule    │                  │
│  │ (QR code產生器)  │  │   (計時器)       │                  │
│  │                 │  │                 │                  │
│  │ • QR輸入面板     │  │ • 倒數計時器     │                  │
│  │ • QR code生成    │  │ • 碼錶功能      │                  │
│  │ • 畫布放置功能   │  │ • 計時器面板UI   │                  │
│  │ • QR重繪機制     │  │ • 畫布顯示選項   │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 核心模組詳細說明

### 1. CanvasModule (畫布核心模組)
**職責**: 管理 HTML5 Canvas 的核心功能

**主要方法**:
- `init()`: 初始化畫布和 2D 繪圖上下文
- `resizeCanvas()`: 響應式調整畫布尺寸
- `startDrawing(e)`: 開始繪圖 (滑鼠/觸控)
- `draw(e)`: 繪圖過程處理
- `stopDrawing()`: 結束繪圖
- `setTool(tool)`: 設定目前工具 (pen/eraser/text/notes/qrcode)
- `setColor(color)`: 設定繪圖顏色
- `setLineWidth(width)`: 設定線條粗細
- `clearCanvas()`: 清空畫布和歷史記錄
- `redrawAllContent()`: 重繪所有歷史內容
- `addTextToHistory()`: 新增文字到歷史記錄

**資料結構**:
```javascript
drawingHistory = [
  {
    tool: 'pen|eraser|text|note|qrcode',
    points: [[x,y], ...],     // 畫筆/橡皮擦路徑
    color: '#000000',
    lineWidth: 5,
    text: 'content',          // 文字內容
    x: 100, y: 100,          // 位置
    font: '16px Arial',       // 文字樣式
    width: 200, height: 150,  // 便條紙/QR尺寸
    dataURL: 'data:image...' // QR code 圖片資料
  }
]
```

### 2. BackgroundModule (背景管理模組)
**職責**: 管理畫布背景樣式和繪製

**主要方法**:
- `setBackground(type, customColor)`: 設定背景類型
- `drawBackground()`: 繪製背景
- `createGridPattern()`: 建立格線 SVG 圖案

**支援背景類型**:
- `white`: 純白色背景
- `lightgray`: 淺灰色背景 (#f5f5f5)
- `grid`: 格線背景 (SVG pattern)
- `customColor`: 自訂顏色背景

### 3. TextToolModule (文字工具模組)
**職責**: 處理文字新增和編輯功能

**主要方法**:
- `activate()`: 啟用文字工具
- `deactivate()`: 停用文字工具
- `handleCanvasClick(e)`: 處理畫布點擊事件
- `createTextInput(x, y)`: 建立文字輸入框
- `addTextToCanvas(text, x, y)`: 新增文字到畫布

**功能特色**:
- 點擊畫布任意位置新增文字
- 動態建立文字輸入框
- 支援 Enter 鍵確認輸入
- 文字內容保存到繪圖歷史

### 4. NotesModule (便條紙模組)
**職責**: 管理便條紙的新增、編輯和移動

**主要方法**:
- `activate()`: 啟用便條紙工具
- `deactivate()`: 停用便條紙工具
- `handleCanvasMouseDown(e)`: 處理滑鼠按下事件
- `handleCanvasMouseMove(e)`: 處理滑鼠移動 (拖拽)
- `handleCanvasMouseUp(e)`: 處理滑鼠放開事件
- `addNote(x, y)`: 新增便條紙
- `editNote(note)`: 編輯便條紙內容

**資料結構**:
```javascript
notes = [
  {
    id: 1,
    x: 100, y: 100,
    width: 200, height: 150,
    text: '便條內容',
    color: '#ffeb3b',
    textColor: '#000000',
    fontSize: 14,
    fontFamily: 'Arial'
  }
]
```

### 5. QRCodeModule (QR Code 產生器模組)
**職責**: 處理 QR code 的生成和畫布放置

**主要方法**:
- `activate()`: 啟用 QR code 工具
- `deactivate()`: 停用 QR code 工具
- `createQRPanel()`: 建立 QR code 輸入面板
- `generateQRCode()`: 生成 QR code
- `handleCanvasClick(e)`: 處理畫布點擊放置
- `addQRCodeToCanvas(dataURL, x, y)`: 新增 QR code 到畫布

**功能特色**:
- 使用 qr-server.com API 生成 QR code
- 支援文字和網址輸入
- 可調整 QR code 大小
- QR code 內容保存到繪圖歷史

**資料結構**:
```javascript
qrCodes = [
  {
    id: 1,
    x: 100, y: 100,
    width: 100, height: 100,
    text: 'QR 內容',
    dataURL: 'data:image/png;base64,...'
  }
]
```

### 6. TimerModule (計時器模組)
**職責**: 提供倒數計時器和碼錶功能

**主要方法**:
- `toggle()`: 切換計時器面板顯示
- `createTimerPanel()`: 建立計時器 UI 面板
- `startCountdown()`: 開始倒數計時
- `startStopwatch()`: 開始碼錶計時
- `displayTimerOnCanvas()`: 在畫布上顯示計時器
- `formatTime(seconds)`: 格式化時間顯示

**功能特色**:
- 倒數計時器 (分鐘/秒數設定)
- 碼錶功能 (精確到百分秒)
- 畫布顯示選項
- 計時結束閃爍提醒

## 模組間通訊機制

### 事件協調 (app.js)
```javascript
// 工具切換時的模組協調
penTool.addEventListener('click', () => {
    textToolModule.deactivate();
    notesModule.deactivate();
    qrCodeModule.deactivate();
    canvasModule.setTool('pen');
});

// 清空畫布時的資料同步
clearCanvasBtn.addEventListener('click', () => {
    canvasModule.clearCanvas();
    notesModule.notes = [];
    qrCodeModule.qrCodes = [];
    backgroundModule.drawBackground();
});
```

### 重繪機制協調
```javascript
// RWD 調整時的重繪順序
window.addEventListener('resize', () => {
    canvasModule.resizeCanvas();      // 1. 調整畫布尺寸
    backgroundModule.drawBackground(); // 2. 重繪背景
    canvasModule.redrawAllContent();  // 3. 重繪前景內容
    canvasModule.setDefaultStyles();  // 4. 恢復工具樣式
});
```

## 資料流向

```
使用者操作 → app.js 事件處理 → 對應模組方法 → CanvasModule 繪圖 → 更新 drawingHistory
     ↑                                                                    ↓
RWD調整 ← BackgroundModule.drawBackground() ← CanvasModule.redrawAllContent()
```

## 技術特色

1. **模組化設計**: 每個功能獨立封裝，便於維護和擴展
2. **事件驅動**: 透過 app.js 統一管理事件和模組通訊
3. **資料持久化**: 所有繪圖內容保存在 drawingHistory 陣列
4. **響應式支援**: 自動調整畫布尺寸並保留內容
5. **工具狀態管理**: 統一的工具切換和狀態追蹤機制 