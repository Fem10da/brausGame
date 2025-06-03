import { vowelSounds, consonantSounds, tongueTwisters } from './phonetics-data.js';
import audioLoader from './audio-loader.js';

/**
 * Клас, що відповідає за роботу з фонетичними зонами
 */
class PhoneticsZone {
    constructor() {
        this.activeZone = null;
        this.activeSoundGroup = null;
        this.activeSound = null;
        this.container = null;
        this.isLoading = false;
    }

    /**
     * Ініціалізує фонетичну зону
     * @param {HTMLElement} container - DOM-елемент для відображення зони
     */
    init(container) {
        this.container = container;
        this.renderZoneSelector();
        this.bindEvents();
    }

    /**
     * Прив'язує обробники подій
     */
    bindEvents() {
        // Буде прив'язано при генерації елементів
    }

    /**
     * Відображає селектор фонетичних зон
     */
    renderZoneSelector() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="back-navigation">
                <button id="back-to-main-menu-from-phonetics-btn" class="back-btn">← Повернутися до меню</button>
            </div>
            <h3>Оберіть фонетичну зону для вивчення</h3>
            <div class="phonetics-zone-selector">
                <button class="zone-btn" data-zone="vowels">Голосні звуки</button>
                <button class="zone-btn" data-zone="consonants">Приголосні звуки</button>
                <button class="zone-btn" data-zone="tongue-twisters">Скоромовки</button>
            </div>
        `;

        // Прив'язуємо обробники
        const zoneButtons = this.container.querySelectorAll('.zone-btn');
        zoneButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const zone = btn.dataset.zone;
                this.selectZone(zone);
            });
        });
        
        // Додаємо обробник для кнопки повернення до головного меню
        const backToMainMenuBtn = this.container.querySelector('#back-to-main-menu-from-phonetics-btn');
        if (backToMainMenuBtn) {
            backToMainMenuBtn.addEventListener('click', () => {
                if (window.game && typeof window.game.showMainMenu === 'function') {
                    window.game.showMainMenu();
                }
            });
        }
    }

    /**
     * Обирає зону для вивчення
     * @param {string} zone - Ідентифікатор зони
     */
    async selectZone(zone) {
        this.activeZone = zone;
        this.activeSoundGroup = null;
        this.activeSound = null;
        
        // Показуємо індикатор завантаження
        this.setLoading(true);
        
        try {
            switch (zone) {
                case 'vowels':
                    await this.renderSoundGroups(vowelSounds);
                    break;
                case 'consonants':
                    await this.renderSoundGroups(consonantSounds);
                    break;
                case 'tongue-twisters':
                    await this.renderTongueTwisters();
                    break;
                default:
                    this.container.innerHTML = '<p>Невідома зона</p>';
            }
        } catch (error) {
            console.error('Помилка при відображенні зони:', error);
            this.container.innerHTML = '<p>Помилка при завантаженні зони</p>';
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Відображає групи звуків
     * @param {Array} soundGroups - Масив груп звуків
     */
    async renderSoundGroups(soundGroups) {
        if (!this.container) return;

        let html = `
            <div class="phonetics-zone-header">
                <button class="back-btn">⬅️ Назад</button>
                <button class="main-menu-btn">🏠 Головне меню</button>
                <h3>${this.activeZone === 'vowels' ? 'Голосні звуки' : 'Приголосні звуки'}</h3>
            </div>
            <div class="sound-groups">
        `;

        soundGroups.forEach(group => {
            html += `
                <div class="sound-group" data-group-id="${group.id}">
                    <h4>${group.name}</h4>
                    <p>${group.description}</p>
                    <button class="explore-btn" data-group-id="${group.id}">Вивчати</button>
                </div>
            `;
        });

        html += `</div>`;
        this.container.innerHTML = html;

        // Прив'язуємо обробники
        const backBtn = this.container.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            this.renderZoneSelector();
        });
        
        // Додаємо обробник для кнопки повернення до головного меню
        const mainMenuBtn = this.container.querySelector('.main-menu-btn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => {
                if (window.game && typeof window.game.showMainMenu === 'function') {
                    window.game.showMainMenu();
                }
            });
        }

        const exploreButtons = this.container.querySelectorAll('.explore-btn');
        exploreButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const groupId = btn.dataset.groupId;
                const group = soundGroups.find(g => g.id === groupId);
                if (group) {
                    this.selectSoundGroup(group);
                }
            });
        });
    }

    /**
     * Обирає групу звуків для вивчення
     * @param {Object} group - Група звуків
     */
    async selectSoundGroup(group) {
        this.activeSoundGroup = group;
        this.setLoading(true);
        
        try {
            // Попереднє завантаження аудіо для прикладів
            await this.preloadAudioForExamples(group.sounds);
            
            let html = `
                <div class="phonetics-zone-header">
                    <button class="back-btn" data-back-to="${this.activeZone}">⬅️ Назад</button>
                    <button class="main-menu-btn">🏠 Головне меню</button>
                    <h3>${group.name}</h3>
                    <p>${group.description}</p>
                </div>
                <div class="sounds-list">
            `;

            group.sounds.forEach(sound => {
                html += `
                    <div class="sound-item" data-sound="${sound.symbol}">
                        <div class="sound-symbol">${sound.symbol}</div>
                        <div class="sound-info">
                            <p class="sound-description">${sound.description}</p>
                            <div class="sound-examples">
                                ${sound.examples.map(example => `<span class="example" data-word="${example}">${example}</span>`).join(' ')}
                            </div>
                        </div>
                        <button class="play-sound-btn" data-symbol="${sound.symbol}">🔊</button>
                    </div>
                `;
            });

            html += `</div>`;
            this.container.innerHTML = html;

            // Прив'язуємо обробники
            const backBtn = this.container.querySelector('.back-btn');
            backBtn.addEventListener('click', () => {
                const backTo = backBtn.dataset.backTo;
                this.selectZone(backTo);
            });
            
            // Додаємо обробник для кнопки повернення до головного меню
            const mainMenuBtn = this.container.querySelector('.main-menu-btn');
            if (mainMenuBtn) {
                mainMenuBtn.addEventListener('click', () => {
                    if (window.game && typeof window.game.showMainMenu === 'function') {
                        window.game.showMainMenu();
                    }
                });
            }

            const playButtons = this.container.querySelectorAll('.play-sound-btn');
            playButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const symbol = btn.dataset.symbol;
                    const sound = group.sounds.find(s => s.symbol === symbol);
                    if (sound && sound.examples.length > 0) {
                        this.playExampleWord(sound.examples[0]);
                    }
                });
            });

            const examples = this.container.querySelectorAll('.example');
            examples.forEach(example => {
                example.addEventListener('click', () => {
                    const word = example.dataset.word;
                    this.playExampleWord(word);
                });
            });
        } catch (error) {
            console.error("Помилка при відображенні групи звуків:", error);
            this.container.innerHTML = `
                <div class="phonetics-zone-header">
                    <button class="back-btn" data-back-to="${this.activeZone}">⬅️ Назад</button>
                    <h3>Помилка</h3>
                </div>
                <p>Сталася помилка при завантаженні звуків. Спробуйте ще раз.</p>
            `;
            
            const backBtn = this.container.querySelector('.back-btn');
            backBtn.addEventListener('click', () => {
                const backTo = backBtn.dataset.backTo;
                this.selectZone(backTo);
            });
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Відображає скоромовки
     */
    async renderTongueTwisters() {
        if (!this.container) return;

        let html = `
            <div class="phonetics-zone-header">
                <button class="back-btn">⬅️ Назад</button>
                <button class="main-menu-btn">🏠 Головне меню</button>
                <h3>Скоромовки</h3>
            </div>
            <div class="tongue-twisters-list">
        `;

        tongueTwisters.forEach(twister => {
            html += `
                <div class="tongue-twister-item" data-difficulty="${twister.difficulty}">
                    <div class="tongue-twister-header">
                        <span class="difficulty-badge ${twister.difficulty}">${this.getDifficultyText(twister.difficulty)}</span>
                        <span class="focus-sound">Фокус на звуках: ${twister.focusSound}</span>
                    </div>
                    <p class="tongue-twister-text">${twister.text}</p>
                    <p class="tongue-twister-translation">${twister.translation}</p>
                    <div class="tongue-twister-controls">
                        <button class="play-twister-btn" data-text="${twister.text}">🔊 Прослухати</button>
                        <button class="record-twister-btn" data-text="${twister.text}">🎤 Записати</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        this.container.innerHTML = html;

        // Прив'язуємо обробники
        const backBtn = this.container.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            this.renderZoneSelector();
        });
        
        // Додаємо обробник для кнопки повернення до головного меню
        const mainMenuBtn = this.container.querySelector('.main-menu-btn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => {
                if (window.game && typeof window.game.showMainMenu === 'function') {
                    window.game.showMainMenu();
                }
            });
        }

        const playButtons = this.container.querySelectorAll('.play-twister-btn');
        playButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                this.playTonguetwister(text);
            });
        });

        const recordButtons = this.container.querySelectorAll('.record-twister-btn');
        recordButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.text;
                // TODO: Реалізувати запис через Speech Recognition API
                alert('Функція запису скоромовки буде доступна незабаром!');
            });
        });
    }

    /**
     * Повертає текстовий опис складності
     * @param {string} difficulty - Рівень складності
     * @returns {string} - Текстовий опис
     */
    getDifficultyText(difficulty) {
        switch (difficulty) {
            case 'easy': return 'Легко';
            case 'medium': return 'Середньо';
            case 'hard': return 'Складно';
            default: return 'Невідомо';
        }
    }

    /**
     * Відтворює приклад слова
     * @param {string} word - Слово для відтворення
     */
    async playExampleWord(word) {
        try {
            const audio = new Audio();
            
            // Спочатку перевіряємо, чи є аудіо в кеші
            let audioUrl = audioLoader.getCachedAudioUrl(word);
            
            if (!audioUrl) {
                // Якщо немає, спробуємо завантажити
                audioUrl = await audioLoader.getAudioUrl(word);
            }
            
            if (audioUrl) {
                audio.src = audioUrl;
                audio.play().catch(error => {
                    console.error('Помилка відтворення аудіо:', error);
                    this.synthesizeAndPlayWord(word);
                });
            } else {
                this.synthesizeAndPlayWord(word);
            }
        } catch (error) {
            console.error('Помилка при відтворенні слова:', error);
            this.synthesizeAndPlayWord(word);
        }
    }

    /**
     * Синтезує та відтворює слово через Web Speech API
     * @param {string} word - Слово для синтезу
     */
    synthesizeAndPlayWord(word) {
        if (!window.speechSynthesis) return;
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-GB';
        
        // Шукаємо британський голос
        const voices = window.speechSynthesis.getVoices();
        const britishVoice = voices.find(voice => 
            voice.lang.includes('en-GB') || voice.name.includes('British')
        );
        
        if (britishVoice) {
            utterance.voice = britishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }

    /**
     * Відтворює скоромовку
     * @param {string} text - Текст скоромовки
     */
    playTonguetwister(text) {
        this.synthesizeAndPlayWord(text);
    }

    /**
     * Попередньо завантажує аудіо для прикладів
     * @param {Array} sounds - Масив звуків з прикладами
     */
    async preloadAudioForExamples(sounds) {
        const allExamples = [];
        
        // Збираємо всі приклади слів
        sounds.forEach(sound => {
            allExamples.push(...sound.examples);
        });
        
        // Завантажуємо аудіо для них
        await audioLoader.preloadAudioForWords(allExamples);
    }

    /**
     * Відображає/приховує індикатор завантаження
     * @param {boolean} isLoading - Стан завантаження
     */
    setLoading(isLoading) {
        this.isLoading = isLoading;
        
        if (!this.container) return;
        
        let loadingElement = this.container.querySelector('.phonetics-zone-loading');
        
        if (isLoading) {
            if (!loadingElement) {
                loadingElement = document.createElement('div');
                loadingElement.className = 'phonetics-zone-loading';
                loadingElement.innerHTML = `
                    <div class="spinner"></div>
                    <p>Завантаження...</p>
                `;
                this.container.appendChild(loadingElement);
            }
        } else if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// Експортуємо один екземпляр для використання
const phoneticsZone = new PhoneticsZone();
export default phoneticsZone; 