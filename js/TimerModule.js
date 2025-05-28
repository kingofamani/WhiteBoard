class TimerModule {
    constructor(canvasModule, backgroundModule, appInstance) {
        this.canvasModule = canvasModule;
        this.backgroundModule = backgroundModule;
        this.app = appInstance;
        this.canvas = this.canvasModule.getCanvasElement();
        
        // 計時器狀態
        this.isVisible = false;
        this.timerPanel = null;
        
        // 倒數計時器
        this.countdownInterval = null;
        this.countdownTime = 0; // 秒數
        this.isCountdownRunning = false;
        
        // 碼錶
        this.stopwatchInterval = null;
        this.stopwatchTime = 0; // 毫秒
        this.isStopwatchRunning = false;
        this.stopwatchStartTime = 0;
        
        // 當前模式
        this.currentMode = 'countdown'; // 'countdown' 或 'stopwatch'
        
        this.createTimerPanel();
    }

    createTimerPanel() {
        // 建立計時器面板
        this.timerPanel = document.createElement('div');
        this.timerPanel.id = 'timerPanel';
        this.timerPanel.className = 'fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-20 border border-gray-300';
        this.timerPanel.style.display = 'none';
        this.timerPanel.style.minWidth = '250px';

        this.timerPanel.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-gray-800">計時器</h3>
                <button id="closeTimer" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>
            
            <!-- 模式切換 -->
            <div class="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button id="countdownModeBtn" class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors bg-blue-500 text-white">倒數計時</button>
                <button id="stopwatchModeBtn" class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-gray-900">碼錶</button>
            </div>
            
            <!-- 倒數計時器區域 -->
            <div id="countdownSection">
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">設定時間</label>
                    <div class="flex space-x-2">
                        <input type="number" id="countdownMinutes" placeholder="分" min="0" max="59" value="5" class="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm">
                        <span class="self-center text-gray-500">:</span>
                        <input type="number" id="countdownSeconds" placeholder="秒" min="0" max="59" value="0" class="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm">
                    </div>
                </div>
                
                <div class="text-center mb-3">
                    <div id="countdownDisplay" class="text-3xl font-mono font-bold text-gray-800 mb-2">05:00</div>
                    <div class="flex space-x-2 justify-center">
                        <button id="startCountdown" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">開始</button>
                        <button id="pauseCountdown" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm" disabled>暫停</button>
                        <button id="resetCountdown" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">重設</button>
                    </div>
                </div>
            </div>
            
            <!-- 碼錶區域 -->
            <div id="stopwatchSection" style="display: none;">
                <div class="text-center mb-3">
                    <div id="stopwatchDisplay" class="text-3xl font-mono font-bold text-gray-800 mb-2">00:00.00</div>
                    <div class="flex space-x-2 justify-center">
                        <button id="startStopwatch" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">開始</button>
                        <button id="pauseStopwatch" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm" disabled>暫停</button>
                        <button id="resetStopwatch" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">重設</button>
                    </div>
                </div>
            </div>
            
            <!-- 顯示選項 -->
            <div class="border-t pt-3 mt-3">
                <label class="flex items-center">
                    <input type="checkbox" id="showOnCanvas" class="mr-2">
                    <span class="text-sm text-gray-700">在畫布上顯示</span>
                </label>
            </div>
        `;

        document.body.appendChild(this.timerPanel);
        this.bindEvents();
    }

    bindEvents() {
        // 關閉按鈕
        document.getElementById('closeTimer').addEventListener('click', () => {
            this.hide();
        });

        // 模式切換
        document.getElementById('countdownModeBtn').addEventListener('click', () => {
            this.switchMode('countdown');
        });

        document.getElementById('stopwatchModeBtn').addEventListener('click', () => {
            this.switchMode('stopwatch');
        });

        // 倒數計時器控制
        document.getElementById('startCountdown').addEventListener('click', () => {
            this.startCountdown();
        });

        document.getElementById('pauseCountdown').addEventListener('click', () => {
            this.pauseCountdown();
        });

        document.getElementById('resetCountdown').addEventListener('click', () => {
            this.resetCountdown();
        });

        // 碼錶控制
        document.getElementById('startStopwatch').addEventListener('click', () => {
            this.startStopwatch();
        });

        document.getElementById('pauseStopwatch').addEventListener('click', () => {
            this.pauseStopwatch();
        });

        document.getElementById('resetStopwatch').addEventListener('click', () => {
            this.resetStopwatch();
        });

        // 時間輸入變更
        document.getElementById('countdownMinutes').addEventListener('input', () => {
            this.updateCountdownFromInputs();
        });

        document.getElementById('countdownSeconds').addEventListener('input', () => {
            this.updateCountdownFromInputs();
        });

        // 畫布顯示選項
        document.getElementById('showOnCanvas').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.showOnCanvas();
            } else {
                this.hideFromCanvas();
            }
        });
    }

    show() {
        this.isVisible = true;
        this.timerPanel.style.display = 'block';
    }

    hide() {
        this.isVisible = false;
        this.timerPanel.style.display = 'none';
        this.hideFromCanvas();
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        const countdownBtn = document.getElementById('countdownModeBtn');
        const stopwatchBtn = document.getElementById('stopwatchModeBtn');
        const countdownSection = document.getElementById('countdownSection');
        const stopwatchSection = document.getElementById('stopwatchSection');

        if (mode === 'countdown') {
            countdownBtn.className = 'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors bg-blue-500 text-white';
            stopwatchBtn.className = 'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-gray-900';
            countdownSection.style.display = 'block';
            stopwatchSection.style.display = 'none';
        } else {
            countdownBtn.className = 'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-gray-900';
            stopwatchBtn.className = 'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors bg-blue-500 text-white';
            countdownSection.style.display = 'none';
            stopwatchSection.style.display = 'block';
        }
    }

    // 倒數計時器功能
    updateCountdownFromInputs() {
        if (this.isCountdownRunning) return;
        
        const minutes = parseInt(document.getElementById('countdownMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('countdownSeconds').value) || 0;
        this.countdownTime = minutes * 60 + seconds;
        this.updateCountdownDisplay();
    }

    startCountdown() {
        if (this.countdownTime <= 0) {
            this.updateCountdownFromInputs();
        }
        
        if (this.countdownTime <= 0) return;

        this.isCountdownRunning = true;
        document.getElementById('startCountdown').disabled = true;
        document.getElementById('pauseCountdown').disabled = false;

        this.countdownInterval = setInterval(() => {
            this.countdownTime--;
            this.updateCountdownDisplay();

            if (this.countdownTime <= 0) {
                this.countdownFinished();
            }
        }, 1000);
    }

    pauseCountdown() {
        this.isCountdownRunning = false;
        clearInterval(this.countdownInterval);
        document.getElementById('startCountdown').disabled = false;
        document.getElementById('pauseCountdown').disabled = true;
    }

    resetCountdown() {
        this.pauseCountdown();
        this.updateCountdownFromInputs();
    }

    countdownFinished() {
        this.pauseCountdown();
        this.countdownTime = 0;
        this.updateCountdownDisplay();
        
        // 簡單的提示
        alert('倒數計時結束！');
        
        // 可以加入更多提示效果，如聲音、閃爍等
        this.flashCanvas();
    }

    updateCountdownDisplay() {
        const minutes = Math.floor(this.countdownTime / 60);
        const seconds = this.countdownTime % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('countdownDisplay').textContent = display;
        
        // 如果在畫布上顯示，也更新畫布
        if (document.getElementById('showOnCanvas').checked) {
            this.updateCanvasDisplay();
        }
    }

    // 碼錶功能
    startStopwatch() {
        this.isStopwatchRunning = true;
        this.stopwatchStartTime = Date.now() - this.stopwatchTime;
        
        document.getElementById('startStopwatch').disabled = true;
        document.getElementById('pauseStopwatch').disabled = false;

        this.stopwatchInterval = setInterval(() => {
            this.stopwatchTime = Date.now() - this.stopwatchStartTime;
            this.updateStopwatchDisplay();
        }, 10); // 每 10ms 更新一次，顯示百分秒
    }

    pauseStopwatch() {
        this.isStopwatchRunning = false;
        clearInterval(this.stopwatchInterval);
        document.getElementById('startStopwatch').disabled = false;
        document.getElementById('pauseStopwatch').disabled = true;
    }

    resetStopwatch() {
        this.pauseStopwatch();
        this.stopwatchTime = 0;
        this.updateStopwatchDisplay();
    }

    updateStopwatchDisplay() {
        const totalSeconds = Math.floor(this.stopwatchTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((this.stopwatchTime % 1000) / 10);
        
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
        document.getElementById('stopwatchDisplay').textContent = display;
        
        // 如果在畫布上顯示，也更新畫布
        if (document.getElementById('showOnCanvas').checked) {
            this.updateCanvasDisplay();
        }
    }

    // 畫布顯示功能
    showOnCanvas() {
        this.updateCanvasDisplay();
    }

    hideFromCanvas() {
        // 重繪畫布以移除計時器顯示
        this.backgroundModule.drawBackground();
        this.canvasModule.redrawAllContent();
    }

    updateCanvasDisplay() {
        // 重繪背景和內容
        this.backgroundModule.drawBackground();
        this.canvasModule.redrawAllContent();
        
        // 在畫布右上角顯示計時器
        const ctx = this.canvasModule.getContext();
        const canvas = this.canvasModule.getCanvasElement();
        
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width - 150, 10, 140, 50);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let displayText = '';
        if (this.currentMode === 'countdown') {
            const minutes = Math.floor(this.countdownTime / 60);
            const seconds = this.countdownTime % 60;
            displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            const totalSeconds = Math.floor(this.stopwatchTime / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const centiseconds = Math.floor((this.stopwatchTime % 1000) / 10);
            displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
        }
        
        ctx.fillText(displayText, canvas.width - 75, 35);
        ctx.restore();
    }

    flashCanvas() {
        // 簡單的閃爍效果
        const canvas = this.canvasModule.getCanvasElement();
        const originalStyle = canvas.style.filter;
        
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            canvas.style.filter = flashCount % 2 === 0 ? 'brightness(1.5)' : 'brightness(1)';
            flashCount++;
            
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                canvas.style.filter = originalStyle;
            }
        }, 200);
    }
} 