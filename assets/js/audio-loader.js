class AudioLoader {
    constructor() {
        this.cache = new Map();
        this.baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        this.retryCount = 2;
        this.retryDelay = 1000; // 1 секунда
        this.loadingWords = new Set(); // Для відслідковування завантажень, що відбуваються
    }

    /**
     * Завантажує аудіо для слова з підтримкою retry та кращою обробкою помилок
     * @param {string} word - слово, для якого потрібне аудіо
     * @returns {Promise<string|null>} - URL аудіо або null, якщо аудіо не знайдено
     */
    async getAudioUrl(word) {
        // Перевірка кешу
        if (this.cache.has(word)) {
            return this.cache.get(word);
        }

        // Якщо слово вже завантажується, чекаємо
        if (this.loadingWords.has(word)) {
            return new Promise((resolve) => {
                const checkCache = () => {
                    if (this.cache.has(word)) {
                        resolve(this.cache.get(word));
                    } else if (!this.loadingWords.has(word)) {
                        resolve(null);
                    } else {
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
     * Завантажує аудіо з retry логікою
     * @param {string} word - слово
     * @returns {Promise<string|null>} - URL аудіо
     */
    async fetchAudioWithRetry(word) {
        let lastError;
        
        for (let attempt = 0; attempt <= this.retryCount; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}${word}`, {
                    timeout: 5000, // 5 секунд таймаут
                    signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Аудіо для "${word}" не знайдено в API`);
                        return null;
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
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
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
     * Попередньо завантажує аудіо для списку слів з обмеженням паралельних запитів
     * @param {Array<string>} wordList - список слів
     * @param {number} batchSize - розмір пакету для одночасного завантаження
     * @returns {Promise<Map<string, string>>} - карта слово => URL аудіо
     */
    async preloadAudioForWords(wordList, batchSize = 5) {
        const results = new Map();
        const uniqueWords = [...new Set(wordList)]; // Видаляємо дублікати
        
        console.log(`Попереднє завантаження аудіо для ${uniqueWords.length} слів...`);
        
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
            
            // Невелика пауза між пакетами для дружньої поведінки до API
            if (i + batchSize < uniqueWords.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        console.log(`Завантаження завершено: ${results.size}/${uniqueWords.length} слів мають аудіо`);
        return results;
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
     * Очищає кеш аудіо
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
            currentlyLoading: Array.from(this.loadingWords)
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