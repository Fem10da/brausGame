/**
 * Утиліта для діагностики DOM-елементів
 */

// Функція для перевірки DOM-елементів гри
function checkGameElements() {
    console.log('--- Діагностика DOM-елементів ---');
    
    // Перевірка основних контейнерів
    const gameArea = document.querySelector('.game-area');
    console.log('Game Area:', gameArea ? 'OK' : 'Missing');
    
    const options = document.getElementById('options');
    console.log('Options container:', options ? 'OK' : 'Missing');
    console.log('Options children:', options?.children.length || 0);
    
    // Перевірка кнопок і елементів керування
    const playBtn = document.getElementById('play-btn');
    console.log('Play button:', playBtn ? 'OK' : 'Missing');
    
    const nextBtn = document.getElementById('next-btn');
    console.log('Next button:', nextBtn ? 'OK' : 'Missing');
    
    const speedBtns = document.querySelectorAll('.speed-btn');
    console.log('Speed buttons:', speedBtns.length);
    
    const levelBtns = document.querySelectorAll('.level-btn');
    console.log('Level buttons:', levelBtns.length);
    
    // Перевірка елементів відображення
    const wordDisplay = document.getElementById('word-display');
    console.log('Word display:', wordDisplay ? 'OK' : 'Missing');
    console.log('Current word:', wordDisplay?.textContent);
    
    const taskType = document.getElementById('task-type');
    console.log('Task type:', taskType ? 'OK' : 'Missing');
    console.log('Current task:', taskType?.textContent);
    
    const feedback = document.getElementById('feedback');
    console.log('Feedback:', feedback ? 'OK' : 'Missing');
    
    console.log('--- Кінець діагностики ---');
}

// Функція для моніторингу змін в DOM
function monitorOptionsChanges() {
    const options = document.getElementById('options');
    if (!options) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                console.log('Options container змінено:', new Date().toISOString());
                console.log('Кількість опцій:', options.children.length);
            }
        });
    });
    
    observer.observe(options, { childList: true });
    console.log('Моніторинг Options container запущено');
}

// Виконуємо перевірку після повного завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM завантажено');
    
    // Додаємо кнопку для діагностики
    const container = document.querySelector('.container');
    if (container) {
        const debugButton = document.createElement('button');
        debugButton.textContent = '🔧 Debug';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '10px';
        debugButton.style.right = '10px';
        debugButton.style.zIndex = '1000';
        debugButton.style.padding = '8px 12px';
        debugButton.style.background = '#e74c3c';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '5px';
        debugButton.style.cursor = 'pointer';
        debugButton.style.fontSize = '12px';
        debugButton.style.fontWeight = 'bold';
        debugButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        
        // Створюємо панель дебагінгу
        const debugPanel = createDebugPanel();
        let panelVisible = false;
        
        debugButton.addEventListener('click', () => {
            panelVisible = !panelVisible;
            debugPanel.style.display = panelVisible ? 'block' : 'none';
            debugButton.textContent = panelVisible ? '🔧 Hide' : '🔧 Debug';
        });
        
        container.appendChild(debugButton);
    }
    
    // Запускаємо моніторинг опцій
    setTimeout(() => {
        monitorOptionsChanges();
    }, 1000);
});

// Додаткові функції для дебагінгу
function checkAudioStatus() {
    console.log('--- Діагностика аудіо-системи ---');
    
    if (window.game && window.game.audioLoader) {
        const stats = window.game.audioLoader.getCacheStats();
        console.log('Статистика кешу аудіо:', stats);
    }
    
    const currentWord = window.game?.currentWord;
    if (currentWord) {
        console.log('Поточне слово:', currentWord.word);
        console.log('Аудіо шлях:', currentWord.audioPath);
        console.log('Кешоване аудіо:', window.game?.audioLoader?.getCachedAudioUrl(currentWord.word));
    }
    
    const audioElements = document.querySelectorAll('audio');
    console.log('Аудіо елементи на сторінці:', audioElements.length);
    
    audioElements.forEach((audio, index) => {
        console.log(`Аудіо ${index + 1}:`, {
            src: audio.src,
            readyState: audio.readyState,
            duration: audio.duration,
            currentTime: audio.currentTime,
            paused: audio.paused,
            ended: audio.ended,
            error: audio.error
        });
    });
    
    console.log('--- Кінець діагностики аудіо ---');
}

function checkGameState() {
    console.log('--- Стан гри ---');
    
    if (window.game) {
        console.log('Поточний рівень:', window.game.currentLevel);
        console.log('Індекс слова:', window.game.currentWordIndex);
        console.log('Поточне слово:', window.game.currentWord);
        console.log('Тип завдання:', window.game.currentTaskType);
        console.log('Бали:', window.game.score);
        console.log('Серія:', window.game.streak);
        console.log('Швидкість відтворення:', window.game.playbackSpeed);
        console.log('Завантаження аудіо:', window.game.isLoadingAudio);
        console.log('Кількість слів на рівні:', window.game.words[window.game.currentLevel]?.length || 0);
    } else {
        console.log('Об\'єкт гри не знайдено');
    }
    
    console.log('--- Кінець стану гри ---');
}

function testAudioSync() {
    console.log('--- Тест синхронізації аудіо ---');
    
    const wordDisplay = document.getElementById('word-display');
    const playBtn = document.getElementById('play-btn');
    
    if (!wordDisplay || !playBtn) {
        console.error('Не знайдені елементи для тестування');
        return;
    }
    
    const displayedWord = wordDisplay.textContent;
    const gameWord = window.game?.currentWord?.word;
    
    console.log('Слово на екрані:', displayedWord);
    console.log('Слово в грі:', gameWord);
    console.log('Синхронізація:', displayedWord === gameWord ? '✅ OK' : '❌ ПРОБЛЕМА');
    
    // Тест кнопки відтворення
    playBtn.click();
    
    console.log('--- Кінець тесту синхронізації ---');
}

function showPerformanceStats() {
    console.log('--- Статистика продуктивності ---');
    
    if (window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            console.log('Час завантаження сторінки:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
            console.log('Час до DOMContentLoaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
        }
        
        const resources = performance.getEntriesByType('resource');
        const audioResources = resources.filter(r => r.name.includes('audio') || r.name.includes('.mp3'));
        console.log('Завантажені аудіо ресурси:', audioResources.length);
        
        audioResources.forEach((resource, index) => {
            console.log(`Аудіо ${index + 1}:`, {
                name: resource.name,
                size: resource.transferSize,
                duration: resource.duration,
                startTime: resource.startTime
            });
        });
    }
    
    console.log('--- Кінець статистики продуктивності ---');
}

function enableVerboseLogging() {
    console.log('📝 Увімкнено детальне логування');
    
    // Перехоплюємо методи для логування
    if (window.game) {
        const originalLoadWord = window.game.loadWord;
        window.game.loadWord = async function() {
            console.log('🔄 Завантаження слова...');
            const result = await originalLoadWord.call(this);
            console.log('✅ Слово завантажено:', this.currentWord?.word);
            return result;
        };
        
        const originalPlayAudio = window.game.playAudio;
        window.game.playAudio = function() {
            console.log('🔊 Відтворення аудіо для:', this.currentWord?.word);
            return originalPlayAudio.call(this);
        };
    }
}

function createDebugPanel() {
    // Створюємо панель дебагінгу
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        max-height: 80vh;
        overflow-y: auto;
        display: none;
    `;
    
    panel.innerHTML = `
        <h3>🔧 Панель дебагінгу</h3>
        <button onclick="gameDebug.checkGameElements()">Перевірити DOM</button>
        <button onclick="gameDebug.checkAudioStatus()">Статус аудіо</button>
        <button onclick="gameDebug.checkGameState()">Стан гри</button>
        <button onclick="gameDebug.testAudioSync()">Тест синхронізації</button>
        <button onclick="gameDebug.showPerformanceStats()">Продуктивність</button>
        <button onclick="gameDebug.enableVerboseLogging()">Детальні логи</button>
        <button onclick="gameDebug.exportLogs()">Експорт логів</button>
        <div id="debug-info"></div>
    `;
    
    // Додаємо стилі для кнопок
    const style = document.createElement('style');
    style.textContent = `
        #debug-panel button {
            display: block;
            width: 100%;
            margin: 5px 0;
            padding: 8px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 11px;
        }
        #debug-panel button:hover {
            background: #2980b9;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(panel);
    
    return panel;
}

function exportLogs() {
    const logs = [];
    
    // Збираємо всі логи консолі (це приблизний приклад)
    logs.push('=== Експорт логів дебагінгу ===');
    logs.push('Час: ' + new Date().toISOString());
    logs.push('');
    
    // Стан гри
    if (window.game) {
        logs.push('СТАН ГРИ:');
        logs.push('Рівень: ' + window.game.currentLevel);
        logs.push('Слово: ' + window.game.currentWord?.word);
        logs.push('Бали: ' + window.game.score);
        logs.push('');
    }
    
    // Статистика аудіо
    if (window.game?.audioLoader) {
        const stats = window.game.audioLoader.getCacheStats();
        logs.push('АУДІО СТАТИСТИКА:');
        logs.push('Загалом слів: ' + stats.totalWords);
        logs.push('З аудіо: ' + stats.wordsWithAudio);
        logs.push('Без аудіо: ' + stats.wordsWithoutAudio);
        logs.push('');
    }
    
    // Створюємо та скачуємо файл
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pronunciation-quest-debug-' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📁 Логи експортовано');
}

// Експортуємо функції для використання в консолі
window.gameDebug = {
    checkGameElements,
    monitorOptionsChanges,
    checkAudioStatus,
    checkGameState,
    testAudioSync,
    showPerformanceStats,
    enableVerboseLogging,
    exportLogs
}; 