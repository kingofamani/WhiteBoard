document.addEventListener('DOMContentLoaded', () => {
    const canvasModule = new CanvasModule('whiteboard');
    const canvas = canvasModule.getCanvasElement();
    const backgroundModule = new BackgroundModule(canvasModule); // 初始化 BackgroundModule
    const textToolModule = new TextToolModule(canvasModule, backgroundModule, this); // Pass backgroundModule
    const notesModule = new NotesModule(canvasModule, backgroundModule, this); // 初始化 NotesModule
    const qrCodeModule = new QRCodeModule(canvasModule, backgroundModule, this); // 初始化 QRCodeModule
    const timerModule = new TimerModule(canvasModule, backgroundModule, this); // 初始化 TimerModule

    const penTool = document.getElementById('penTool');
    const eraserTool = document.getElementById('eraserTool');
    const textToolBtn = document.getElementById('textTool'); // 獲取文字工具按鈕
    const notesToolBtn = document.getElementById('notesTool'); // 獲取便條紙工具按鈕
    const qrToolBtn = document.getElementById('qrTool'); // 獲取 QR code 工具按鈕
    const timerToolBtn = document.getElementById('timerTool'); // 獲取計時器按鈕
    const colorPicker = document.getElementById('colorPicker');
    const lineWidthSlider = document.getElementById('lineWidth');
    const lineWidthValue = document.getElementById('lineWidthValue');
    const clearCanvasBtn = document.getElementById('clearCanvas');
    const backgroundSelector = document.getElementById('backgroundSelector');
    const customBgColorPicker = document.getElementById('customBackgroundColorPicker');

    // 設定初始工具為畫筆
    canvasModule.setTool('pen');
    penTool.classList.add('ring-2', 'ring-offset-2', 'ring-blue-700'); // 初始高亮畫筆
    let activeToolButton = penTool; // 用於追蹤目前高亮的按鈕

    function setActiveToolButton(newToolButton) {
        if (activeToolButton) {
            activeToolButton.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-700', 'ring-gray-700', 'ring-yellow-700', 'ring-orange-700', 'ring-green-700', 'ring-purple-700');
        }
        let ringColorClass = '';
        if (newToolButton === penTool) ringColorClass = 'ring-blue-700';
        else if (newToolButton === eraserTool) ringColorClass = 'ring-gray-700';
        else if (newToolButton === textToolBtn) ringColorClass = 'ring-yellow-700';
        else if (newToolButton === notesToolBtn) ringColorClass = 'ring-orange-700';
        else if (newToolButton === qrToolBtn) ringColorClass = 'ring-green-700';
        else if (newToolButton === timerToolBtn) ringColorClass = 'ring-purple-700';

        newToolButton.classList.add('ring-2', 'ring-offset-2', ringColorClass);
        activeToolButton = newToolButton;
    }

    // 工具選擇
    penTool.addEventListener('click', () => {
        textToolModule.deactivate(); // 如果文字工具是 활성화 狀態，則停用它
        notesModule.deactivate(); // 停用便條紙工具
        qrCodeModule.deactivate(); // 停用 QR code 工具
        canvasModule.setTool('pen');
        setActiveToolButton(penTool);
        canvas.style.cursor = 'crosshair'; // 設定畫筆游標
    });

    eraserTool.addEventListener('click', () => {
        textToolModule.deactivate();
        notesModule.deactivate();
        qrCodeModule.deactivate();
        canvasModule.setTool('eraser');
        setActiveToolButton(eraserTool);
        canvas.style.cursor = 'crosshair'; // 橡皮擦也用 crosshair 或自訂圖示
    });

    textToolBtn.addEventListener('click', () => {
        notesModule.deactivate(); // 停用便條紙工具
        qrCodeModule.deactivate(); // 停用 QR code 工具
        canvasModule.setTool('text'); // 設定 canvasModule 的內部狀態，但不直接影響繪圖事件
        textToolModule.activate();
        setActiveToolButton(textToolBtn);
        // textToolModule.activate() 內部會設定游標為 text
    });

    notesToolBtn.addEventListener('click', () => {
        textToolModule.deactivate(); // 停用文字工具
        qrCodeModule.deactivate(); // 停用 QR code 工具
        canvasModule.setTool('notes'); // 設定 canvasModule 的內部狀態
        notesModule.activate();
        setActiveToolButton(notesToolBtn);
        // notesModule.activate() 內部會設定游標
    });

    qrToolBtn.addEventListener('click', () => {
        textToolModule.deactivate(); // 停用文字工具
        notesModule.deactivate(); // 停用便條紙工具
        canvasModule.setTool('qrcode'); // 設定 canvasModule 的內部狀態
        qrCodeModule.activate();
        setActiveToolButton(qrToolBtn);
        // qrCodeModule.activate() 內部會顯示 QR code 面板
    });

    timerToolBtn.addEventListener('click', () => {
        timerModule.toggle(); // 切換計時器面板顯示/隱藏
        // 計時器不需要改變畫布工具狀態，所以不調用 setActiveToolButton
    });

    // 顏色選擇
    colorPicker.addEventListener('input', (e) => { // 'input' 事件即時響應
        canvasModule.setColor(e.target.value);
    });

    // 線條粗細
    lineWidthSlider.addEventListener('input', (e) => { // 'input' 事件即時響應
        const width = e.target.value;
        canvasModule.setLineWidth(width);
        lineWidthValue.textContent = width;
    });

    // 清空畫布
    clearCanvasBtn.addEventListener('click', () => {
        canvasModule.clearCanvas(); // 這會清除畫布和 drawingHistory
        notesModule.notes = []; // 清空便條紙陣列
        qrCodeModule.qrCodes = []; // 清空 QR codes 陣列
        backgroundModule.drawBackground(); // 然後重繪背景
        // 此時前景是空的，不需要 redrawAllContent
    });

    // 背景選擇
    backgroundSelector.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        if (selectedType === 'customColor') {
            customBgColorPicker.classList.remove('hidden');
            customBgColorPicker.click(); // 模擬點擊以觸發顏色選擇器
            // 當 customBgColorPicker 值改變時，再設定背景
        } else {
            customBgColorPicker.classList.add('hidden');
            backgroundModule.setBackground(selectedType);
        }
    });

    customBgColorPicker.addEventListener('input', (e) => {
        if (backgroundSelector.value === 'customColor') {
            backgroundModule.setBackground('customColor', e.target.value);
            // backgroundModule.setBackground 內部會呼叫 drawBackground 和 canvasModule.redrawAllContent
        }
    });

    // 初始繪製背景
    backgroundModule.drawBackground();
    canvasModule.setDefaultStyles(); // 設定初始的畫筆樣式

    // 畫布事件監聽 (滑鼠)
    canvas.addEventListener('mousedown', (e) => {
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.startDrawing(e);
        }
        // 文字工具、便條紙工具和 QR code 工具的點擊由各自的模組內部處理
    });
    canvas.addEventListener('mousemove', (e) => {
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.draw(e);
        }
    });
    canvas.addEventListener('mouseup', () => {
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.stopDrawing();
        }
    });
    canvas.addEventListener('mouseleave', () => { // 當滑鼠移出畫布也停止繪圖
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.stopDrawing();
        }
    });

    // 畫布事件監聽 (觸控)
    canvas.addEventListener('touchstart', (e) => {
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.startDrawing(e);
        } else if (canvasModule.currentTool === 'text') {
            // 對於觸控設備，可能需要模擬點擊來觸發 TextToolModule 的邏輯
            // 或者 TextToolModule 內部也監聽 touchstart
            // 目前 TextToolModule.handleCanvasClick 應能處理觸控事件 (e.clientX/Y)
            // textToolModule.handleCanvasClick(e.touches[0]); // 傳遞 touch 事件
        }
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.draw(e);
        }
    }, { passive: false });
    canvas.addEventListener('touchend', () => {
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.stopDrawing();
        }
    });
    canvas.addEventListener('touchcancel', () => { // 觸控取消時也停止
        if (canvasModule.currentTool === 'pen' || canvasModule.currentTool === 'eraser') {
            canvasModule.stopDrawing();
        }
    });

    // 監聽 window resize 事件，以便在 CanvasModule 調整大小後重繪背景
    window.addEventListener('resize', () => {
        // 1. CanvasModule 更新內部畫布元素的寬高，但不做任何繪製
        canvasModule.resizeCanvas(); 
        // 2. BackgroundModule 根據新的畫布尺寸重繪背景
        backgroundModule.drawBackground();
        // 3. CanvasModule 根據新的畫布尺寸重繪前景內容
        canvasModule.redrawAllContent();
        // 4. 重新套用目前的工具樣式 (因為 redrawAllContent 可能會改變 context 的狀態)
        canvasModule.setDefaultStyles();
        // 確保橡皮擦模式在 resize 後仍然是橡皮擦模式
        if (canvasModule.currentTool === 'eraser') {
            canvasModule.setTool('eraser'); 
        }

    });

    console.log('App initialized, CanvasModule, BackgroundModule, TextToolModule, NotesModule, QRCodeModule, TimerModule loaded, and toolbar events are set up.');
});