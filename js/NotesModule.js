class NotesModule {
    constructor(canvasModule, backgroundModule, appInstance) {
        this.canvasModule = canvasModule;
        this.backgroundModule = backgroundModule;
        this.app = appInstance;
        this.canvas = this.canvasModule.getCanvasElement();
        this.active = false;
        this.notes = []; // 儲存所有便條紙
        this.nextId = 1; // 便條紙 ID 計數器
        this.selectedNote = null; // 當前選中的便條紙
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        // 綁定事件處理函數
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleCanvasMouseDown = this.handleCanvasMouseDown.bind(this);
        this.handleCanvasMouseMove = this.handleCanvasMouseMove.bind(this);
        this.handleCanvasMouseUp = this.handleCanvasMouseUp.bind(this);
        this.handleTextareaBlur = this.handleTextareaBlur.bind(this);
    }

    activate() {
        this.active = true;
        this.canvas.style.cursor = 'crosshair';
        this.canvas.addEventListener('click', this.handleCanvasClick);
        this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
        this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
        this.canvas.addEventListener('mouseup', this.handleCanvasMouseUp);
        console.log('Notes tool activated');
    }

    deactivate() {
        this.active = false;
        this.canvas.style.cursor = 'crosshair';
        this.canvas.removeEventListener('click', this.handleCanvasClick);
        this.canvas.removeEventListener('mousedown', this.handleCanvasMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleCanvasMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleCanvasMouseUp);
        this.selectedNote = null;
        this.isDragging = false;
        console.log('Notes tool deactivated');
    }

    handleCanvasClick(e) {
        if (!this.active || this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 檢查是否點擊在現有便條紙上
        const clickedNote = this.getNoteAtPosition(x, y);
        
        if (clickedNote) {
            // 點擊現有便條紙，開始編輯
            this.editNote(clickedNote);
        } else {
            // 點擊空白區域，新增便條紙
            this.createNote(x, y);
        }
    }

    handleCanvasMouseDown(e) {
        if (!this.active) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedNote = this.getNoteAtPosition(x, y);
        
        if (clickedNote) {
            this.selectedNote = clickedNote;
            this.isDragging = true;
            this.dragOffset.x = x - clickedNote.x;
            this.dragOffset.y = y - clickedNote.y;
            this.canvas.style.cursor = 'move';
            e.preventDefault(); // 防止觸發 click 事件
        }
    }

    handleCanvasMouseMove(e) {
        if (!this.active || !this.isDragging || !this.selectedNote) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 更新便條紙位置
        this.selectedNote.x = x - this.dragOffset.x;
        this.selectedNote.y = y - this.dragOffset.y;

        // 重繪畫布
        this.redrawCanvas();
    }

    handleCanvasMouseUp(e) {
        if (!this.active) return;

        if (this.isDragging) {
            this.isDragging = false;
            this.canvas.style.cursor = 'crosshair';
            
            // 將便條紙位置更新到繪圖歷史中
            this.updateNoteInHistory(this.selectedNote);
        }
    }

    createNote(x, y) {
        const note = {
            id: this.nextId++,
            x: x,
            y: y,
            width: 120,
            height: 80,
            text: '',
            color: '#ffeb3b', // 預設黃色
            textColor: '#000000',
            fontSize: 14,
            fontFamily: 'Arial'
        };

        this.notes.push(note);
        this.addNoteToHistory(note);
        this.redrawCanvas();
        
        // 立即開始編輯新便條紙
        setTimeout(() => {
            this.editNote(note);
        }, 100);
    }

    editNote(note) {
        // 建立文字輸入區域
        const textarea = document.createElement('textarea');
        textarea.style.position = 'absolute';
        textarea.style.left = `${note.x + this.canvas.offsetLeft + 5}px`;
        textarea.style.top = `${note.y + this.canvas.offsetTop + 5}px`;
        textarea.style.width = `${note.width - 10}px`;
        textarea.style.height = `${note.height - 10}px`;
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.padding = '5px';
        textarea.style.fontSize = `${note.fontSize}px`;
        textarea.style.fontFamily = note.fontFamily;
        textarea.style.color = note.textColor;
        textarea.style.background = 'transparent';
        textarea.style.zIndex = '100';
        textarea.style.resize = 'none';
        textarea.style.overflow = 'hidden';
        textarea.value = note.text;

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        // 事件監聽
        textarea.addEventListener('blur', () => {
            this.handleTextareaBlur(textarea, note);
        });

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                textarea.blur();
            }
            if (e.key === 'Escape') {
                textarea.value = note.text; // 恢復原始文字
                textarea.blur();
            }
        });
    }

    handleTextareaBlur(textarea, note) {
        const newText = textarea.value;
        note.text = newText;

        // 如果文字為空，刪除便條紙
        if (!newText.trim()) {
            this.deleteNote(note);
        } else {
            this.updateNoteInHistory(note);
        }

        // 移除 textarea
        if (textarea.parentNode === document.body) {
            document.body.removeChild(textarea);
        }

        this.redrawCanvas();
    }

    deleteNote(note) {
        // 從便條紙陣列中移除
        const index = this.notes.findIndex(n => n.id === note.id);
        if (index !== -1) {
            this.notes.splice(index, 1);
        }

        // 從繪圖歷史中移除
        this.removeNoteFromHistory(note);
    }

    getNoteAtPosition(x, y) {
        // 從後往前檢查（最新的便條紙在最上層）
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            if (x >= note.x && x <= note.x + note.width &&
                y >= note.y && y <= note.y + note.height) {
                return note;
            }
        }
        return null;
    }

    addNoteToHistory(note) {
        this.canvasModule.drawingHistory.push({
            tool: 'note',
            id: note.id,
            x: note.x,
            y: note.y,
            width: note.width,
            height: note.height,
            text: note.text,
            color: note.color,
            textColor: note.textColor,
            fontSize: note.fontSize,
            fontFamily: note.fontFamily
        });
    }

    updateNoteInHistory(note) {
        // 找到並更新繪圖歷史中的便條紙
        const historyItem = this.canvasModule.drawingHistory.find(
            item => item.tool === 'note' && item.id === note.id
        );
        
        if (historyItem) {
            historyItem.x = note.x;
            historyItem.y = note.y;
            historyItem.text = note.text;
            historyItem.color = note.color;
            historyItem.textColor = note.textColor;
        }
    }

    removeNoteFromHistory(note) {
        const index = this.canvasModule.drawingHistory.findIndex(
            item => item.tool === 'note' && item.id === note.id
        );
        
        if (index !== -1) {
            this.canvasModule.drawingHistory.splice(index, 1);
        }
    }

    redrawCanvas() {
        this.backgroundModule.drawBackground();
        this.canvasModule.redrawAllContent();
    }

    // 在 CanvasModule 的 redrawAllContent 中會呼叫此方法
    drawNote(noteData) {
        const ctx = this.canvasModule.getContext();
        
        // 繪製便條紙背景
        ctx.fillStyle = noteData.color;
        ctx.fillRect(noteData.x, noteData.y, noteData.width, noteData.height);
        
        // 繪製邊框
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(noteData.x, noteData.y, noteData.width, noteData.height);
        
        // 繪製文字
        if (noteData.text) {
            ctx.fillStyle = noteData.textColor;
            ctx.font = `${noteData.fontSize}px ${noteData.fontFamily}`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            // 文字換行處理
            const words = noteData.text.split(' ');
            const lineHeight = noteData.fontSize + 2;
            const maxWidth = noteData.width - 10;
            let line = '';
            let y = noteData.y + 5;
            
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                
                if (testWidth > maxWidth && i > 0) {
                    ctx.fillText(line, noteData.x + 5, y);
                    line = words[i] + ' ';
                    y += lineHeight;
                    
                    // 檢查是否超出便條紙高度
                    if (y + lineHeight > noteData.y + noteData.height - 5) {
                        break;
                    }
                } else {
                    line = testLine;
                }
            }
            
            // 繪製最後一行
            if (line.trim() && y + lineHeight <= noteData.y + noteData.height - 5) {
                ctx.fillText(line, noteData.x + 5, y);
            }
        }
    }
} 