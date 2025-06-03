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
        debugButton.textContent = '🔍 Діагностика';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '10px';
        debugButton.style.right = '10px';
        debugButton.style.zIndex = '1000';
        debugButton.style.padding = '5px 10px';
        debugButton.style.background = '#f39c12';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '5px';
        debugButton.style.cursor = 'pointer';
        
        debugButton.addEventListener('click', () => {
            checkGameElements();
        });
        
        container.appendChild(debugButton);
    }
    
    // Запускаємо моніторинг опцій
    setTimeout(() => {
        monitorOptionsChanges();
    }, 1000);
});

// Експортуємо функції для використання в консолі
window.gameDebug = {
    checkGameElements,
    monitorOptionsChanges
}; 