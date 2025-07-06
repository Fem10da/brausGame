class AudioLoader {
    constructor() {
        this.cache = new Map();
        this.loadingWords = new Set();
        this.baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        this.retryCount = 3;
        this.retryDelay = 1000; // Збільшили базову затримку
        this.rateLimited = false;
        this.rateLimitResetTime = 0;
        this.statusCallback = null; // Callback для оновлення статусу
    }

    // Метод для встановлення callback функції для оновлення статусу
    setStatusCallback(callback) {
        this.statusCallback = callback;
    }

    // Метод для відправки статусу через callback
    reportStatus(status, message = null) {
        if (this.statusCallback) {
            this.statusCallback(status, message);
        }
    }

    /**
     * Отримує URL аудіо для слова
     * @param {string} word - слово для пошуку
     * @returns {Promise<string|null>} - URL аудіо або null
     */
    async getAudioUrl(word) {
        if (this.cache.has(word)) {
            return this.cache.get(word);
        }

        if (this.loadingWords.has(word)) {
            // Слово вже завантажується, чекаємо
            return new Promise((resolve) => {
                const checkCache = () => {
                    if (this.cache.has(word)) {
                        resolve(this.cache.get(word));
                    } else if (!this.loadingWords.has(word)) {
                        // Завантаження провалилось
                        resolve(null);
                    } else {
                        // Все ще завантажується
                        setTimeout(checkCache, 100);
                    }
                };
                checkCache();
            });
        }

        this.loadingWords.add(word);

        try {
            const audioUrl = await this.fetchAudioWithRetry(word);
            this.cache.set(word, audioUrl);
            return audioUrl;
        } catch (error) {
            console.error(`Помилка завантаження аудіо для "${word}":`, error);
            this.cache.set(word, null); // Кешуємо невдачу
            return null;
        } finally {
            this.loadingWords.delete(word);
        }
    }

    /**
     * Завантажує аудіо з retry логікою та обробкою rate limiting
     * @param {string} word - слово
     * @returns {Promise<string|null>} - URL аудіо
     */
    async fetchAudioWithRetry(word) {
        let lastError;
        
        // Перевіряємо, чи ми не в стані rate limit
        if (this.rateLimited && Date.now() < this.rateLimitResetTime) {
            const waitTime = this.rateLimitResetTime - Date.now();
            console.warn(`⏱️ Rate limit активний. Очікування ${waitTime}мс перед запитом для "${word}"`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            this.rateLimited = false;
        }
        
        for (let attempt = 0; attempt <= this.retryCount; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}${word}`, {
                    timeout: 5000,
                    signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Аудіо для "${word}" не знайдено в API`);
                        return null;
                    }
                    
                    // Обробляємо rate limiting
                    if (response.status === 429) {
                        console.warn(`🚫 Rate limit для "${word}". Встановлюємо затримку.`);
                        this.rateLimited = true;
                        this.rateLimitResetTime = Date.now() + (this.retryDelay * Math.pow(2, attempt));
                        
                        // Повідомляємо про rate limit
                        this.reportStatus('rate-limited', `⏳ Rate limit: очікуємо ${Math.floor(this.retryDelay * Math.pow(2, attempt) / 1000)}с`);
                        
                        if (attempt < this.retryCount) {
                            const waitTime = this.retryDelay * Math.pow(2, attempt);
                            console.warn(`⏱️ Очікування ${waitTime}мс перед повторною спробою для "${word}"`);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                            continue;
                        }
                    }
                    
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (!data || data.title === 'No Definitions Found') {
                    console.log(`Визначення для "${word}" не знайдено`);
                    return null;
                }

                // Шукаємо аудіо у відповіді API
                const audioUrl = this.extractAudioUrl(data);
                if (audioUrl) {
                    console.log(`Аудіо для "${word}" знайдено:`, audioUrl);
                    return audioUrl;
                }

                console.log(`Аудіо для "${word}" не знайдено в API відповіді`);
                return null;

            } catch (error) {
                lastError = error;
                console.warn(`Спроба ${attempt + 1} завантажити аудіо для "${word}" не вдалась:`, error.message);
                
                if (attempt < this.retryCount) {
                    const waitTime = this.retryDelay * Math.pow(2, attempt); // Експоненціальна затримка
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        throw lastError;
    }

    /**
     * Витягує URL аудіо з API відповіді
     * @param {Object} data - дані від API
     * @returns {string|null} - URL аудіо
     */
    extractAudioUrl(data) {
        for (const entry of data) {
            if (entry.phonetics && entry.phonetics.length > 0) {
                // Спочатку спробуємо знайти британську вимову
                const britishPronunciation = entry.phonetics.find(p => 
                    p.audio && (p.audio.includes('uk') || p.audio.includes('gb'))
                );
                
                if (britishPronunciation && britishPronunciation.audio) {
                    return britishPronunciation.audio;
                }
                
                // Якщо британської немає, візьмемо першу доступну
                const anyPronunciation = entry.phonetics.find(p => p.audio && p.audio.length > 0);
                if (anyPronunciation) {
                    return anyPronunciation.audio;
                }
            }
        }
        return null;
    }

    /**
     * Попередньо завантажує аудіо для списку слів з покращеним rate limiting
     * @param {Array<string>} wordList - список слів
     * @param {number} batchSize - розмір пакету для одночасного завантаження
     * @returns {Promise<Map<string, string>>} - карта слово => URL аудіо
     */
    async preloadAudioForWords(wordList, batchSize = 2) { // Зменшили з 5 до 2
        const results = new Map();
        const uniqueWords = [...new Set(wordList)]; // Видаляємо дублікати
        
        console.log(`Попереднє завантаження аудіо для ${uniqueWords.length} слів з batch size ${batchSize}...`);
        
        // Обробляємо слова пакетами для уникнення перевантаження API
        for (let i = 0; i < uniqueWords.length; i += batchSize) {
            const batch = uniqueWords.slice(i, i + batchSize);
            const promises = batch.map(async word => {
                try {
                    const audioUrl = await this.getAudioUrl(word);
                    if (audioUrl) {
                        results.set(word, audioUrl);
                    }
                    return { word, success: !!audioUrl };
                } catch (error) {
                    console.error(`Помилка завантаження аудіо для "${word}":`, error);
                    return { word, success: false };
                }
            });
            
            const batchResults = await Promise.allSettled(promises);
            const successCount = batchResults.filter(r => r.status === 'fulfilled' && r.value.success).length;
            
            console.log(`Пакет ${Math.floor(i / batchSize) + 1}: ${successCount}/${batch.length} успішно завантажено`);
            
            // Збільшили паузу між пакетами для кращої поведінки до API
            if (i + batchSize < uniqueWords.length) {
                const delayTime = this.rateLimited ? 2000 : 1000; // Більша затримка якщо rate limited
                console.log(`⏱️ Пауза ${delayTime}мс між пакетами...`);
                await new Promise(resolve => setTimeout(resolve, delayTime));
            }
        }
        
        console.log(`Завантаження завершено: ${results.size}/${uniqueWords.length} слів мають аудіо`);
        return results;
    }

    /**
     * Завантажує аудіо тільки для наступних кількох слів (smart preloading)
     * @param {Array<string>} wordList - повний список слів
     * @param {number} currentIndex - поточний індекс слова
     * @param {number} preloadCount - кількість слів для попереднього завантаження
     * @returns {Promise<Map<string, string>>} - карта слово => URL аудіо
     */
    async smartPreloadAudio(wordList, currentIndex = 0, preloadCount = 5) {
        const wordsToPreload = [];
        
        for (let i = 0; i < preloadCount && (currentIndex + i) < wordList.length; i++) {
            const word = wordList[currentIndex + i];
            if (!this.cache.has(word)) {
                wordsToPreload.push(word);
            }
        }
        
        if (wordsToPreload.length > 0) {
            console.log(`🎯 Smart preloading для ${wordsToPreload.length} слів починаючи з індексу ${currentIndex}`);
            return await this.preloadAudioForWords(wordsToPreload, 1); // Batch size 1 для smart preloading
        }
        
        return new Map();
    }

    /**
     * Отримує збережену URL аудіо з кешу
     * @param {string} word - слово
     * @returns {string|null} - URL аудіо або null
     */
    getCachedAudioUrl(word) {
        return this.cache.get(word) || null;
    }

    /**
     * Очищує кеш аудіо
     * @param {string} [word] - конкретне слово для очищення, або весь кеш якщо не вказано
     */
    clearCache(word = null) {
        if (word) {
            this.cache.delete(word);
            console.log(`Кеш для "${word}" очищено`);
        } else {
            this.cache.clear();
            console.log('Весь кеш аудіо очищено');
        }
    }

    /**
     * Отримує статистику кешу
     * @returns {Object} - статистика кешу
     */
    getCacheStats() {
        const totalWords = this.cache.size;
        const wordsWithAudio = Array.from(this.cache.values()).filter(url => url !== null).length;
        const wordsWithoutAudio = totalWords - wordsWithAudio;
        
        return {
            totalWords,
            wordsWithAudio,
            wordsWithoutAudio,
            cacheHitRate: totalWords > 0 ? (wordsWithAudio / totalWords * 100).toFixed(2) + '%' : '0%',
            isLoading: this.loadingWords.size > 0,
            currentlyLoading: Array.from(this.loadingWords),
            rateLimited: this.rateLimited,
            rateLimitResetTime: this.rateLimitResetTime
        };
    }

    /**
     * Перевіряє доступність API
     * @returns {Promise<boolean>} - чи доступний API
     */
    async checkApiAvailability() {
        try {
            const response = await fetch(this.baseUrl + 'test', {
                method: 'HEAD',
                timeout: 3000
            });
            return response.ok || response.status === 404; // 404 - нормально для тестового слова
        } catch (error) {
            console.warn('API недоступний:', error.message);
            return false;
        }
    }
}

// Експортуємо один екземпляр для використання в усій грі
const audioLoader = new AudioLoader();
export default audioLoader; 