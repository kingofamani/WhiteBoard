# Web 教學白板 - 程式架構圖

## 整體架構概覽

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                          │
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │   Toolbar UI    │  │         Canvas Element          │   │
│  │                 │  │                                 │   │
│  │ [🖱️][P][E][T]   │  │                                 │   │
│  │ [N][QR][📺][🖼️] │  │        #whiteboard              │   │
│  │ [⏰][⏱][Clear]  │  │                                 │   │
│  │ [Color][Width]  │  │                                 │   │
│  │ [Background]    │  │                                 │   │
│  │ [Volume][Mic]   │  │                                 │   │
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
│  • 專案管理整合 (新增中)                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      核心模組架構                           │
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
│  │ QRCodeModule    │  │ YouTubeModule   │                  │
│  │ (QR code產生器)  │  │ (YouTube嵌入)   │                  │
│  │                 │  │                 │                  │
│  │ • QR輸入面板     │  │ • 影片URL解析    │                  │
│  │ • QR code生成    │  │ • iframe嵌入     │                  │
│  │ • 畫布放置功能   │  │ • 拖拽縮放控制   │                  │
│  │ • QR重繪機制     │  │ • 影片管理      │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  ImageModule    │  │CountdownModule  │                  │
│  │   (圖片插入)     │  │ (倒數計時器)     │                  │
│  │                 │  │                 │                  │
│  │ • 圖片上傳處理   │  │ • DOM計時器元素  │                  │
│  │ • 圖片拖拽縮放   │  │ • 時間調整控制   │                  │
│  │ • 圖片管理系統   │  │ • 聲音警報系統   │                  │
│  │ • 多格式支援     │  │ • 視覺效果提醒   │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ StopwatchModule │  │VolumeDetection  │                  │
│  │    (碼錶)       │  │Module (音量偵測) │                  │
│  │                 │  │                 │                  │
│  │ • DOM碼錶元素    │  │ • 麥克風權限管理 │                  │
│  │ • 百分秒精度     │  │ • 即時音量分析   │                  │
│  │ • 播放控制介面   │  │ • 警告系統      │                  │
│  │ • 橫向佈局設計   │  │ • Toast通知     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    專案管理系統 (開發中)                      │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ ProjectManager  │  │ SaveLoadModule  │                  │
│  │  (專案管理)      │  │  (儲存載入)      │                  │
│  │                 │  │                 │                  │
│  │ • 專案CRUD操作   │  │ • 資料收集整合   │                  │
│  │ • localStorage   │  │ • 模組狀態還原   │                  │
│  │ • 專案列表管理   │  │ • 縮圖生成      │                  │
│  │ • 狀態追蹤      │  │ • 資料壓縮      │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐                                       │
│  │   ProjectUI     │                                       │
│  │  (專案介面)      │                                       │
│  │                 │                                       │
│  │ • 啟動畫面      │                                       │
│  │ • 專案選擇器     │                                       │
│  │ • 對話框管理     │                                       │
│  │ • 使用者互動     │                                       │
│  └─────────────────┘                                       │
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
- `setTool(tool)`: 設定目前工具 (pen/eraser/text/notes/qrcode/youtube/image/countdown/stopwatch)
- `setColor(color)`: 設定繪圖顏色
- `setLineWidth(width)`: 設定線條粗細
- `clearCanvas()`: 清空畫布和歷史記錄
- `redrawAllContent()`: 重繪所有歷史內容
- `addTextToHistory()`: 新增文字到歷史記錄

**資料結構**:
```javascript
drawingHistory = [
  {
    tool: 'pen|eraser|text',
    points: [[x,y], ...],     // 畫筆/橡皮擦路徑
    color: '#000000',
    lineWidth: 5,
    text: 'content',          // 文字內容
    x: 100, y: 100,          // 位置
    font: '16px Arial'        // 文字樣式
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
- `clearAllNotes()`: 清空所有便條紙
- `exportData()`: 匯出便條紙資料 (開發中)
- `importData(data)`: 匯入便條紙資料 (開發中)

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
- `clearAllQRCodes()`: 清空所有 QR codes
- `exportData()`: 匯出 QR code 資料 (開發中)
- `importData(data)`: 匯入 QR code 資料 (開發中)

**功能特色**:
- 使用 qr-server.com API 生成 QR code
- 支援文字和網址輸入
- 可調整 QR code 大小
- QR code 內容保存到繪圖歷史

### 6. YouTubeModule (YouTube 影片嵌入模組)
**職責**: 處理 YouTube 影片嵌入和管理

**主要方法**:
- `activate()`: 啟用 YouTube 工具
- `deactivate()`: 停用 YouTube 工具
- `createVideo(url, x, y)`: 建立影片元素
- `bindVideoEvents(videoContainer)`: 綁定影片控制事件
- `selectVideo(videoContainer)`: 選中影片
- `deleteVideo(videoContainer)`: 刪除影片
- `clearAllVideos()`: 清空所有影片
- `exportData()`: 匯出影片資料 (開發中)
- `importData(data)`: 匯入影片資料 (開發中)

**功能特色**:
- 支援多種 YouTube URL 格式
- 影片拖拽移動和縮放調整
- 影片選中狀態和控制項管理
- 與其他工具的整合切換

### 7. ImageModule (圖片插入模組)
**職責**: 處理圖片上傳、顯示和管理

**主要方法**:
- `activate()`: 啟用圖片工具
- `deactivate()`: 停用圖片工具
- `createImage(file, x, y)`: 建立圖片元素
- `bindImageEvents(imageContainer)`: 綁定圖片控制事件
- `selectImage(imageContainer)`: 選中圖片
- `deleteImage(imageContainer)`: 刪除圖片
- `clearAllImages()`: 清空所有圖片
- `exportData()`: 匯出圖片資料 (開發中)
- `importData(data)`: 匯入圖片資料 (開發中)

**功能特色**:
- 支援多種圖片格式 (JPG, PNG, GIF, WebP)
- 圖片拖拽移動和縮放調整
- 圖片選中狀態和控制項管理
- Base64 編碼儲存支援

### 8. CountdownModule (倒數計時器模組)
**職責**: 提供 DOM 基礎的倒數計時器功能

**主要方法**:
- `activate()`: 啟用倒數計時器工具
- `deactivate()`: 停用倒數計時器工具
- `createCountdown(x, y)`: 建立倒數計時器元素
- `startCountdown(countdownContainer)`: 開始倒數
- `pauseCountdown(countdownContainer)`: 暫停倒數
- `resetCountdown(countdownContainer)`: 重置倒數
- `clearAllCountdowns()`: 清空所有計時器
- `exportData()`: 匯出計時器資料 (開發中)
- `importData(data)`: 匯入計時器資料 (開發中)

**功能特色**:
- DOM 元素計時器（280x120px）
- 分鐘/秒數調整按鈕
- 聲音警報和 Toast 通知
- 視覺效果提醒（閃爍、變色）
- 可拖拽、縮放、刪除

### 9. StopwatchModule (碼錶模組)
**職責**: 提供 DOM 基礎的碼錶功能

**主要方法**:
- `activate()`: 啟用碼錶工具
- `deactivate()`: 停用碼錶工具
- `createStopwatch(x, y)`: 建立碼錶元素
- `startStopwatch(stopwatchContainer)`: 開始計時
- `pauseStopwatch(stopwatchContainer)`: 暫停計時
- `resetStopwatch(stopwatchContainer)`: 重置計時
- `clearAllStopwatches()`: 清空所有碼錶
- `exportData()`: 匯出碼錶資料 (開發中)
- `importData(data)`: 匯入碼錶資料 (開發中)

**功能特色**:
- DOM 元素碼錶（320x100px）
- 百分秒精度（10ms 更新）
- 橫向佈局設計
- 播放/暫停/重置控制
- 可拖拽、縮放、刪除

### 10. VolumeDetectionModule (音量偵測模組)
**職責**: 音量偵測和警告系統

**主要功能**:
- 麥克風權限管理和控制
- 即時音量分析（Web Audio API）
- 音量視覺化（動態音量條）
- 閾值設定和指示線
- 音量超標警告系統
- 警告計數器和動畫效果
- Toast 通知系統
- 音量平滑處理和冷卻機制

## 專案管理系統 (開發中)

### 11. ProjectManager (專案管理器)
**職責**: 統一管理專案的 CRUD 操作

**主要方法** (計畫中):
- `createProject(name, description)`: 新增專案
- `loadProject(projectId)`: 載入專案
- `saveCurrentProject()`: 儲存當前專案
- `deleteProject(projectId)`: 刪除專案
- `getProjectList()`: 取得專案列表
- `getCurrentProject()`: 取得當前專案
- `renameProject(projectId, newName)`: 重新命名
- `generateThumbnail()`: 產生縮圖

### 12. SaveLoadModule (儲存載入模組)
**職責**: 協調各模組進行資料匯出和匯入

**主要方法** (計畫中):
- `collectAllData()`: 收集所有模組資料
- `restoreAllData(projectData)`: 還原所有模組狀態
- `exportCanvasAsImage()`: 匯出畫布縮圖
- `compressData(data)`: 資料壓縮
- `validateData(data)`: 資料驗證

### 13. ProjectUI (專案介面模組)
**職責**: 管理專案相關的使用者介面

**主要方法** (計畫中):
- `showWelcomeScreen()`: 顯示歡迎畫面
- `showProjectSelector()`: 顯示專案選擇器
- `showCreateProjectDialog()`: 顯示新增專案對話框
- `updateProjectInfo()`: 更新專案資訊顯示
- `handleProjectInteractions()`: 處理專案互動

## 模組間通訊機制

### 事件協調 (app.js)
```javascript
// 工具切換時的模組協調
penTool.addEventListener('click', () => {
    textToolModule.deactivate();
    notesModule.deactivate();
    qrCodeModule.deactivate();
    youtubeModule.deactivate();
    imageModule.deactivate();
    countdownModule.deactivate();
    stopwatchModule.deactivate();
    canvasModule.setTool('pen');
});

// 清空畫布時的資料同步
clearCanvasBtn.addEventListener('click', () => {
    canvasModule.clearCanvas();
    notesModule.clearAllNotes();
    qrCodeModule.clearAllQRCodes();
    youtubeModule.clearAllVideos();
    imageModule.clearAllImages();
    countdownModule.clearAllCountdowns();
    stopwatchModule.clearAllStopwatches();
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

### 專案管理整合 (計畫中)
```javascript
// 專案儲存時的資料收集
saveBtn.addEventListener('click', () => {
    const projectData = saveLoadModule.collectAllData();
    projectManager.saveCurrentProject(projectData);
});

// 專案載入時的狀態還原
function loadProject(projectId) {
    const projectData = projectManager.loadProject(projectId);
    saveLoadModule.restoreAllData(projectData);
}
```

## 資料流向

```
使用者操作 → app.js 事件處理 → 對應模組方法 → CanvasModule/DOM 更新 → 更新資料結構
     ↑                                                                          ↓
專案管理 ← ProjectManager ← SaveLoadModule ← 各模組 exportData() ← 模組資料收集
     ↓                                                                          ↑
載入專案 → SaveLoadModule → 各模組 importData() → 還原模組狀態 → 重建使用者介面
```

## 技術特色

1. **模組化設計**: 每個功能獨立封裝，便於維護和擴展
2. **事件驅動**: 透過 app.js 統一管理事件和模組通訊  
3. **混合資料持久化**: 
   - Canvas 繪圖: drawingHistory 陣列
   - DOM 元素: 各模組獨立管理
   - 專案資料: localStorage 統一儲存
4. **響應式支援**: 自動調整畫布尺寸並保留內容
5. **工具狀態管理**: 統一的工具切換和狀態追蹤機制
6. **專案管理系統**: 支援多專案建立、儲存、載入 (開發中)
7. **資料匯出入架構**: 各模組提供標準化的資料處理介面 (開發中) 