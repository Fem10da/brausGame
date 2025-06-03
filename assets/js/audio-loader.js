class AudioLoader {
    constructor() {
        this.cache = new Map();
        this.baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    }

    /**
     * Завантажує аудіо для слова
     * @param {string} word - слово, для якого потрібне аудіо
     * @returns {Promise<string|null>} - URL аудіо або null, якщо аудіо не знайдено
     */
    async getAudioUrl(word) {
        // Перевірка кешу
        if (this.cache.has(word)) {
            return this.cache.get(word);
        }

        try {
            const response = await fetch(`${this.baseUrl}${word}`);
            const data = await response.json();

            if (!data || data.title === 'No Definitions Found') {
                return null;
            }

            // Шукаємо аудіо у відповіді API
            let audioUrl = null;
            
            // Шукаємо британську вимову
            for (const entry of data) {
                if (entry.phonetics && entry.phonetics.length > 0) {
                    // Спочатку спробуємо знайти британську вимову
                    const britishPronunciation = entry.phonetics.find(p => 
                        p.audio && p.audio.includes('uk') || 
                        (p.audio && p.text && p.text.includes('ˈbrɪtɪʃ'))
                    );
                    
                    if (britishPronunciation && britishPronunciation.audio) {
                        audioUrl = britishPronunciation.audio;
                        break;
                    }
                    
                    // Якщо британської немає, візьмемо першу доступну
                    const anyPronunciation = entry.phonetics.find(p => p.audio && p.audio.length > 0);
                    if (anyPronunciation) {
                        audioUrl = anyPronunciation.audio;
                        break;
                    }
                }
            }

            // Зберігаємо в кеш
            this.cache.set(word, audioUrl);
            return audioUrl;
        } catch (error) {
            console.error(`Помилка завантаження аудіо для "${word}":`, error);
            return null;
        }
    }

    /**
     * Попередньо завантажує аудіо для списку слів
     * @param {Array<string>} wordList - список слів
     * @returns {Promise<Map<string, string>>} - карта слово => URL аудіо
     */
    async preloadAudioForWords(wordList) {
        const results = new Map();
        
        // Використовуємо Promise.allSettled для паралельного завантаження
        const promises = wordList.map(async word => {
            const audioUrl = await this.getAudioUrl(word);
            if (audioUrl) {
                results.set(word, audioUrl);
            }
        });
        
        await Promise.allSettled(promises);
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
}

// Експортуємо один екземпляр для використання в усій грі
const audioLoader = new AudioLoader();
export default audioLoader; 