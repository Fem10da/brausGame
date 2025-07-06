/**
 * Модуль для роботи з власними словами користувачів
 * Підтримує завантаження, збереження, поділ та управління підбірками слів
 */

class CustomWordsManager {
    constructor() {
        this.collections = this.loadCollections();
        this.currentCollection = null;
        this.initialized = false;
    }

    /**
     * Ініціалізація менеджера власних слів
     */
    init() {
        if (this.initialized) return;
        
        this.bindEvents();
        this.updateCollectionsList();
        this.updateCollectionSelect();
        this.initialized = true;
        
        console.log('Custom Words Manager initialized');
    }

    /**
     * Прив'язка обробників подій
     */
    bindEvents() {
        // Вкладки
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Завантаження файлу
        const fileInput = document.getElementById('words-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files[0]);
            });
        }

        // Парсинг тексту
        const parseBtn = document.getElementById('parse-words-btn');
        if (parseBtn) {
            parseBtn.addEventListener('click', () => {
                this.parseWordsFromText();
            });
        }

        // Генерація посилання для поділу
        const shareBtn = document.getElementById('generate-share-link');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.generateShareLink();
            });
        }

        // Копіювання посилання
        const copyBtn = document.getElementById('copy-link-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyShareLink();
            });
        }

        // Кнопка повернення
        const backBtn = document.getElementById('back-from-custom-words-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (window.game && typeof window.game.showMainMenu === 'function') {
                    window.game.showMainMenu();
                }
            });
        }
    }

    /**
     * Перемикання між вкладками
     */
    switchTab(tabName) {
        // Оновлюємо кнопки вкладок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Оновлюємо контент вкладок
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Оновлюємо дані для відповідної вкладки
        if (tabName === 'collections') {
            this.updateCollectionsList();
        } else if (tabName === 'shared') {
            this.updateCollectionSelect();
        }
    }

    /**
     * Обробка завантаження файлу
     */
    async handleFileUpload(file) {
        if (!file) return;

        try {
            const text = await this.readFileAsText(file);
            const words = this.parseWordsText(text);
            
            if (words.length > 0) {
                const collectionName = this.generateCollectionName(file.name);
                this.saveCollection(collectionName, words);
                this.showSuccess(`Завантажено ${words.length} слів у підбірку "${collectionName}"`);
                this.updateCollectionsList();
                this.updateCollectionSelect();
            } else {
                this.showError('Не вдалося розпарсити слова з файлу');
            }
        } catch (error) {
            console.error('Error handling file upload:', error);
            this.showError('Помилка при завантаженні файлу');
        }
    }

    /**
     * Парсинг слів з текстового поля
     */
    parseWordsFromText() {
        const textarea = document.getElementById('words-text-input');
        const text = textarea.value.trim();
        
        if (!text) {
            this.showError('Введіть слова для парсингу');
            return;
        }

        try {
            const words = this.parseWordsText(text);
            
            if (words.length > 0) {
                const collectionName = this.generateCollectionName('Власна підбірка');
                this.saveCollection(collectionName, words);
                this.showSuccess(`Додано ${words.length} слів у підбірку "${collectionName}"`);
                textarea.value = '';
                this.updateCollectionsList();
                this.updateCollectionSelect();
            } else {
                this.showError('Не вдалося розпарсити слова з тексту');
            }
        } catch (error) {
            console.error('Error parsing words:', error);
            this.showError('Помилка при парсингу слів');
        }
    }

    /**
     * Парсинг тексту зі словами
     */
    parseWordsText(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const words = [];

        for (const line of lines) {
            const parts = line.split(',').map(part => part.trim());
            
            if (parts.length >= 2) {
                const word = {
                    word: parts[0],
                    transcription: parts[1],
                    translation: parts[2] || '',
                    category: 'custom',
                    audio: null,
                    stress: 1
                };
                
                // Валідація
                if (word.word && word.transcription) {
                    words.push(word);
                }
            }
        }

        return words;
    }

    /**
     * Читання файлу як текст
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * Генерація імені для підбірки
     */
    generateCollectionName(baseName) {
        const timestamp = new Date().toLocaleString('uk-UA');
        const cleanName = baseName.replace(/\.[^/.]+$/, ''); // Видаляємо розширення
        return `${cleanName} (${timestamp})`;
    }

    /**
     * Збереження підбірки
     */
    saveCollection(name, words) {
        const collection = {
            id: this.generateId(),
            name,
            words,
            created: new Date().toISOString(),
            wordsCount: words.length
        };

        this.collections.push(collection);
        this.saveCollections();
    }

    /**
     * Генерація унікального ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Збереження підбірок в localStorage
     */
    saveCollections() {
        localStorage.setItem('pronunciation-quest-collections', JSON.stringify(this.collections));
    }

    /**
     * Завантаження підбірок з localStorage
     */
    loadCollections() {
        const stored = localStorage.getItem('pronunciation-quest-collections');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Оновлення списку підбірок
     */
    updateCollectionsList() {
        const container = document.getElementById('collections-list');
        if (!container) return;

        if (this.collections.length === 0) {
            container.innerHTML = '<p>У вас поки немає власних підбірок</p>';
            return;
        }

        container.innerHTML = this.collections.map(collection => `
            <div class="collection-item" data-id="${collection.id}">
                <div class="collection-info">
                    <h4>${collection.name}</h4>
                    <p>${collection.wordsCount} слів • ${new Date(collection.created).toLocaleDateString('uk-UA')}</p>
                </div>
                <div class="collection-actions">
                    <button class="action-btn study-btn" data-id="${collection.id}">📚 Вивчити</button>
                    <button class="action-btn edit-btn" data-id="${collection.id}">✏️ Редагувати</button>
                    <button class="action-btn delete-btn" data-id="${collection.id}">🗑️ Видалити</button>
                </div>
            </div>
        `).join('');

        // Прив'язуємо обробники для кнопок дій
        this.bindCollectionActions();
    }

    /**
     * Прив'язка обробників для дій з підбірками
     */
    bindCollectionActions() {
        document.querySelectorAll('.study-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const collectionId = e.target.dataset.id;
                this.studyCollection(collectionId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const collectionId = e.target.dataset.id;
                this.editCollection(collectionId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const collectionId = e.target.dataset.id;
                this.deleteCollection(collectionId);
            });
        });
    }

    /**
     * Вивчення підбірки
     */
    studyCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (!collection) return;

        // Інтеграція з основною грою
        if (window.game && typeof window.game.loadCustomWords === 'function') {
            window.game.loadCustomWords(collection.words);
            window.game.switchMode('quiz');
        } else {
            this.showSuccess(`Завантажено підбірку "${collection.name}" для вивчення`);
        }
    }

    /**
     * Редагування підбірки
     */
    editCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (!collection) return;

        const newName = prompt('Нова назва підбірки:', collection.name);
        if (newName && newName.trim()) {
            collection.name = newName.trim();
            this.saveCollections();
            this.updateCollectionsList();
            this.updateCollectionSelect();
            this.showSuccess('Підбірку оновлено');
        }
    }

    /**
     * Видалення підбірки
     */
    deleteCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (!collection) return;

        if (confirm(`Видалити підбірку "${collection.name}"?`)) {
            this.collections = this.collections.filter(c => c.id !== collectionId);
            this.saveCollections();
            this.updateCollectionsList();
            this.updateCollectionSelect();
            this.showSuccess('Підбірку видалено');
        }
    }

    /**
     * Оновлення селекта підбірок
     */
    updateCollectionSelect() {
        const select = document.getElementById('collection-select');
        if (!select) return;

        select.innerHTML = '<option value="">Оберіть підбірку</option>';
        
        this.collections.forEach(collection => {
            const option = document.createElement('option');
            option.value = collection.id;
            option.textContent = collection.name;
            select.appendChild(option);
        });
    }

    /**
     * Генерація посилання для поділу
     */
    generateShareLink() {
        const select = document.getElementById('collection-select');
        const collectionId = select.value;
        
        if (!collectionId) {
            this.showError('Оберіть підбірку для поділу');
            return;
        }

        const collection = this.collections.find(c => c.id === collectionId);
        if (!collection) return;

        // Створюємо базовий URL з даними підбірки
        const shareData = {
            name: collection.name,
            words: collection.words,
            shared: true
        };

        const encodedData = btoa(JSON.stringify(shareData));
        const shareLink = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`;

        // Показуємо результат
        const resultDiv = document.getElementById('share-result');
        const linkInput = document.getElementById('share-link');
        
        if (resultDiv && linkInput) {
            linkInput.value = shareLink;
            resultDiv.style.display = 'block';
        }

        this.showSuccess('Посилання для поділу створено');
    }

    /**
     * Копіювання посилання
     */
    async copyShareLink() {
        const linkInput = document.getElementById('share-link');
        if (!linkInput) return;

        try {
            await navigator.clipboard.writeText(linkInput.value);
            this.showSuccess('Посилання скопійовано');
        } catch (error) {
            // Fallback для старих браузерів
            linkInput.select();
            document.execCommand('copy');
            this.showSuccess('Посилання скопійовано');
        }
    }

    /**
     * Показ повідомлення про успіх
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Показ повідомлення про помилку
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Показ повідомлення
     */
    showNotification(message, type = 'info') {
        // Створюємо повідомлення
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;

        // Стилізація залежно від типу
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        }

        document.body.appendChild(notification);

        // Анімація появи
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Автоматичне видалення
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Завантаження поділеної підбірки з URL
     */
    loadSharedCollection() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('shared');
        
        if (sharedData) {
            try {
                const decoded = JSON.parse(atob(sharedData));
                if (decoded.shared && decoded.words) {
                    const confirmLoad = confirm(`Завантажити поділену підбірку "${decoded.name}"?`);
                    if (confirmLoad) {
                        this.saveCollection(decoded.name, decoded.words);
                        this.showSuccess(`Завантажено поділену підбірку "${decoded.name}"`);
                        this.updateCollectionsList();
                        this.updateCollectionSelect();
                        
                        // Очищаємо URL
                        const newUrl = window.location.origin + window.location.pathname;
                        window.history.replaceState({}, document.title, newUrl);
                    }
                }
            } catch (error) {
                console.error('Error loading shared collection:', error);
            }
        }
    }
}

// Створюємо глобальний екземпляр
const customWordsManager = new CustomWordsManager();

// Експортуємо для використання в інших модулях
export default customWordsManager; 