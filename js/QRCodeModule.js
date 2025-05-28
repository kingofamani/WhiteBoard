class QRCodeModule {
    constructor(canvasModule, backgroundModule, appInstance) {
        this.canvasModule = canvasModule;
        this.backgroundModule = backgroundModule;
        this.app = appInstance;
        this.canvas = this.canvasModule.getCanvasElement();
        this.active = false;
        this.qrCodes = []; // 儲存所有 QR codes
        this.nextId = 1; // QR code ID 計數器
        this.qrPanel = null;
        this.isVisible = false;

        // 綁定事件處理函數
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        
        this.createQRPanel();
    }

    createQRPanel() {
        // 建立 QR code 產生器面板
        this.qrPanel = document.createElement('div');
        this.qrPanel.id = 'qrPanel';
        this.qrPanel.className = 'fixed top-20 left-4 bg-white shadow-lg rounded-lg p-4 z-20 border border-gray-300';
        this.qrPanel.style.display = 'none';
        this.qrPanel.style.minWidth = '300px';

        this.qrPanel.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-gray-800">QR Code 產生器</h3>
                <button id="closeQR" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>
            
            <!-- 輸入區域 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">輸入內容</label>
                <textarea id="qrTextInput" placeholder="輸入文字、網址或其他內容..." 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none" 
                    rows="3"></textarea>
            </div>
            
            <!-- 設定選項 -->
            <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">QR Code 大小</label>
                    <span id="qrSizeValue" class="text-sm text-gray-600">150px</span>
                </div>
                <input type="range" id="qrSizeSlider" min="100" max="300" value="150" 
                    class="w-full cursor-pointer">
            </div>
            
            <!-- 預覽區域 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">預覽</label>
                <div id="qrPreview" class="border border-gray-300 rounded-md p-4 text-center bg-gray-50 min-h-[150px] flex items-center justify-center">
                    <span class="text-gray-500 text-sm">輸入內容後將顯示 QR Code 預覽</span>
                </div>
            </div>
            
            <!-- 操作按鈕 -->
            <div class="flex space-x-2">
                <button id="generateQR" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm" disabled>
                    產生 QR Code
                </button>
                <button id="clearQRInput" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
                    清空
                </button>
            </div>
            
            <!-- 說明 -->
            <div class="mt-3 text-xs text-gray-500">
                <p>• 輸入文字後點擊「產生 QR Code」</p>
                <p>• 然後在畫布上點擊要放置的位置</p>
                <p>• 支援文字、網址、電話號碼等內容</p>
            </div>
        `;

        document.body.appendChild(this.qrPanel);
        this.bindPanelEvents();
    }

    bindPanelEvents() {
        // 關閉按鈕
        document.getElementById('closeQR').addEventListener('click', () => {
            this.hide();
        });

        // 文字輸入
        const textInput = document.getElementById('qrTextInput');
        textInput.addEventListener('input', () => {
            this.updatePreview();
            this.updateGenerateButton();
        });

        // 大小滑桿
        const sizeSlider = document.getElementById('qrSizeSlider');
        sizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            document.getElementById('qrSizeValue').textContent = `${size}px`;
            this.updatePreview();
        });

        // 產生按鈕
        document.getElementById('generateQR').addEventListener('click', () => {
            this.prepareForPlacement();
        });

        // 清空按鈕
        document.getElementById('clearQRInput').addEventListener('click', () => {
            textInput.value = '';
            this.clearPreview();
            this.updateGenerateButton();
        });
    }

    activate() {
        this.active = true;
        this.show();
        console.log('QR Code tool activated');
    }

    deactivate() {
        this.active = false;
        this.hide();
        this.canvas.style.cursor = 'crosshair';
        this.canvas.removeEventListener('click', this.handleCanvasClick);
        console.log('QR Code tool deactivated');
    }

    show() {
        this.isVisible = true;
        this.qrPanel.style.display = 'block';
    }

    hide() {
        this.isVisible = false;
        this.qrPanel.style.display = 'none';
        this.canvas.removeEventListener('click', this.handleCanvasClick);
    }

    updatePreview() {
        const text = document.getElementById('qrTextInput').value.trim();
        const size = parseInt(document.getElementById('qrSizeSlider').value);
        const previewDiv = document.getElementById('qrPreview');

        if (!text) {
            this.clearPreview();
            return;
        }

        // 使用真正的 QR code API 生成預覽
        try {
            const qrImageUrl = this.generateQRCodeURL(text, size);
            previewDiv.innerHTML = `<img src="${qrImageUrl}" alt="QR Code Preview" style="max-width: 100%; max-height: 150px;" />`;
        } catch (error) {
            previewDiv.innerHTML = '<span class="text-red-500 text-sm">QR Code 生成失敗</span>';
            console.error('QR Code generation error:', error);
        }
    }

    clearPreview() {
        const previewDiv = document.getElementById('qrPreview');
        previewDiv.innerHTML = '<span class="text-gray-500 text-sm">輸入內容後將顯示 QR Code 預覽</span>';
    }

    updateGenerateButton() {
        const text = document.getElementById('qrTextInput').value.trim();
        const generateBtn = document.getElementById('generateQR');
        generateBtn.disabled = !text;
    }

    prepareForPlacement() {
        const text = document.getElementById('qrTextInput').value.trim();
        if (!text) return;

        // 準備在畫布上放置 QR code
        this.canvas.style.cursor = 'crosshair';
        this.canvas.addEventListener('click', this.handleCanvasClick);
        
        // 更新按鈕文字提示
        const generateBtn = document.getElementById('generateQR');
        const originalText = generateBtn.textContent;
        generateBtn.textContent = '點擊畫布放置 QR Code';
        generateBtn.disabled = true;

        // 3秒後恢復按鈕狀態
        setTimeout(() => {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }, 3000);
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const text = document.getElementById('qrTextInput').value.trim();
        const size = parseInt(document.getElementById('qrSizeSlider').value);

        if (text) {
            this.createQRCodeOnCanvas(x, y, text, size);
            // 移除點擊監聽器
            this.canvas.removeEventListener('click', this.handleCanvasClick);
            this.canvas.style.cursor = 'default';
        }
    }

    async createQRCodeOnCanvas(x, y, text, size) {
        const qrData = {
            id: this.nextId++,
            x: x - size / 2, // 置中
            y: y - size / 2, // 置中
            width: size,
            height: size,
            text: text,
            dataURL: null
        };

        try {
            // 顯示載入狀態
            this.showLoadingMessage('正在生成 QR Code...');
            
            // 使用真正的 QR code API 生成圖片
            const qrImageUrl = this.generateQRCodeURL(text, size);
            
            // 將圖片轉換為 dataURL
            const dataURL = await this.imageUrlToDataURL(qrImageUrl);
            qrData.dataURL = dataURL;
            
            this.qrCodes.push(qrData);
            this.addQRToHistory(qrData);
            this.redrawCanvas();
            
            this.hideLoadingMessage();
            console.log('QR Code created:', qrData);
        } catch (error) {
            this.hideLoadingMessage();
            console.error('Error creating QR Code on canvas:', error);
            
            // 即使失敗也創建一個備用的 QR code
            qrData.dataURL = this.createFallbackQRCode(text, size);
            this.qrCodes.push(qrData);
            this.addQRToHistory(qrData);
            this.redrawCanvas();
            
            // 顯示友善的錯誤訊息
            this.showErrorMessage('QR Code 生成失敗，已使用備用方案。請檢查網路連線。');
        }
    }

    showLoadingMessage(message) {
        // 在面板中顯示載入訊息
        const generateBtn = document.getElementById('generateQR');
        if (generateBtn) {
            generateBtn.textContent = message;
            generateBtn.disabled = true;
        }
    }

    hideLoadingMessage() {
        // 恢復按鈕狀態
        const generateBtn = document.getElementById('generateQR');
        if (generateBtn) {
            generateBtn.textContent = '產生 QR Code';
            generateBtn.disabled = false;
        }
    }

    showErrorMessage(message) {
        // 顯示錯誤訊息
        const previewDiv = document.getElementById('qrPreview');
        if (previewDiv) {
            previewDiv.innerHTML = `<span class="text-orange-500 text-sm">${message}</span>`;
        }
        
        // 3秒後清除錯誤訊息
        setTimeout(() => {
            this.clearPreview();
        }, 3000);
    }

    createFallbackQRCode(text, size) {
        // 建立一個更好看的備用 QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // 白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // 黑色邊框
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size - 2, size - 2);

        // 繪製簡單的 QR code 樣式圖案
        ctx.fillStyle = '#000000';
        const cellSize = Math.floor(size / 25);
        
        // 繪製定位標記（三個角落的方塊）
        this.drawPositionMarker(ctx, 5, 5, cellSize * 7);
        this.drawPositionMarker(ctx, size - cellSize * 7 - 5, 5, cellSize * 7);
        this.drawPositionMarker(ctx, 5, size - cellSize * 7 - 5, cellSize * 7);

        // 繪製一些隨機點陣（基於文字內容）
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 25; j++) {
                // 避開定位標記區域
                if ((i < 9 && j < 9) || (i > 15 && j < 9) || (i < 9 && j > 15)) {
                    continue;
                }
                
                // 使用文字內容生成偽隨機圖案
                const hash = this.simpleHash(text + i + j);
                if (hash % 3 === 0) {
                    ctx.fillRect(i * cellSize + 2, j * cellSize + 2, cellSize - 1, cellSize - 1);
                }
            }
        }

        // 添加文字標籤
        ctx.fillStyle = '#666666';
        ctx.font = `${Math.max(10, size / 12)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const shortText = text.length > 20 ? text.substring(0, 20) + '...' : text;
        ctx.fillText(shortText, size / 2, size - 15);

        return canvas.toDataURL();
    }

    drawPositionMarker(ctx, x, y, size) {
        // 外框
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, size, size);
        
        // 內部白色
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7);
        
        // 中心黑點
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + size * 0.35, y + size * 0.35, size * 0.3, size * 0.3);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    generateQRCodeURL(text, size) {
        // 使用 qr-server.com API 生成真正的 QR code
        const encodedText = encodeURIComponent(text);
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png&margin=10`;
    }

    async imageUrlToDataURL(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // 不設置 crossOrigin，因為 qr-server.com 支援跨域
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/png');
                    resolve(dataURL);
                } catch (error) {
                    console.error('Failed to convert image to dataURL:', error);
                    // 如果轉換失敗，直接使用原始 URL
                    resolve(imageUrl);
                }
            };
            
            img.onerror = (error) => {
                console.error('Failed to load QR code image:', error);
                // 如果載入失敗，返回一個備用的 dataURL
                resolve(this.createFallbackQRCode('載入失敗', 150));
            };
            
            img.src = imageUrl;
        });
    }

    addQRToHistory(qrData) {
        this.canvasModule.drawingHistory.push({
            tool: 'qrcode',
            id: qrData.id,
            x: qrData.x,
            y: qrData.y,
            width: qrData.width,
            height: qrData.height,
            text: qrData.text,
            dataURL: qrData.dataURL
        });
    }

    redrawCanvas() {
        this.backgroundModule.drawBackground();
        this.canvasModule.redrawAllContent();
    }

    // 在 CanvasModule 的 redrawAllContent 中會呼叫此方法
    drawQRCode(qrData) {
        const ctx = this.canvasModule.getContext();
        
        if (qrData.dataURL) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, qrData.x, qrData.y, qrData.width, qrData.height);
            };
            img.src = qrData.dataURL;
        } else {
            // 備用繪製方法 - 顯示載入中
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(qrData.x, qrData.y, qrData.width, qrData.height);
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(qrData.x, qrData.y, qrData.width, qrData.height);
            
            ctx.fillStyle = '#000000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('載入中...', qrData.x + qrData.width / 2, qrData.y + qrData.height / 2 - 10);
            
            const shortText = qrData.text.length > 10 ? qrData.text.substring(0, 10) + '...' : qrData.text;
            ctx.font = '10px Arial';
            ctx.fillText(shortText, qrData.x + qrData.width / 2, qrData.y + qrData.height / 2 + 10);
        }
    }
} 