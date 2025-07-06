// Імпортуємо AudioLoader, PhoneticsZone та дані скоромовок
import audioLoader from './audio-loader.js';
import phoneticsZone from './phonetics-zone.js';
import tongueTwistersData from './tongue-twisters.js';
import customWordsManager from './custom-words.js';

class PronunciationQuest {
    constructor() {
        this.currentLevel = 'beginner';
        this.currentWordIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.level = 1;
        this.taskTypes = ['transcription', 'stress', 'sound-sorting'];
        this.currentTaskType = 'transcription';
        this.playbackSpeed = 1.0;
        this.achievements = new Set();
        this.correctAnswers = 0;
        this.vowelCorrect = 0;
        
        // Додаємо прапорець для відстеження завантаження аудіо
        this.isLoadingAudio = false;
        
        // Додаємо прапорець для відстеження поточної скоромовки
        this.currentTongueTwisterIndex = 0;
        
        // Додаємо прапорець, що блокує збереження прогресу після скидання
        this.blockProgressSaving = false;
        
        // Додаємо прапорець для блокування швидкої зміни слів
        this.isLoadingWord = false;
        
        // Додаємо прапорець для блокування швидкого перемикання тем
        this.isTogglingTheme = false;

        // Індекс для режиму карток
        this.flashcardIndex = 0;
        this.flashcardsInitialized = false;
        
        // Власні слова
        this.customWords = [];
        this.customWordsInitialized = false;
        
        this.words = {
            beginner: [
                { word: 'schedule', transcription: '/ˈʃedjuːl/', stress: 1, audio: null, category: 'daily' },
                { word: 'water', transcription: '/ˈwɔːtə/', stress: 1, audio: null, category: 'basic' },
                { word: 'colour', transcription: '/ˈkʌlə/', stress: 1, audio: null, category: 'basic' },
                { word: 'centre', transcription: '/ˈsentə/', stress: 1, audio: null, category: 'basic' },
                { word: 'favour', transcription: '/ˈfeɪvə/', stress: 1, audio: null, category: 'basic' },
                { word: 'theatre', transcription: '/ˈθɪətə/', stress: 1, audio: null, category: 'culture' },
                { word: 'privacy', transcription: '/ˈprɪvəsi/', stress: 1, audio: null, category: 'daily' },
                { word: 'mobile', transcription: '/ˈməʊbaɪl/', stress: 1, audio: null, category: 'tech' },
                { word: 'autumn', transcription: '/ˈɔːtəm/', stress: 1, audio: null, category: 'seasons' },
                { word: 'railway', transcription: '/ˈreɪlweɪ/', stress: 1, audio: null, category: 'transport' },
                { word: 'tomato', transcription: '/təˈmɑːtəʊ/', stress: 2, audio: null, category: 'food' },
                { word: 'vitamin', transcription: '/ˈvɪtəmɪn/', stress: 1, audio: null, category: 'health' },
                // Додаємо нові слова для beginner рівня
                { word: 'castle', transcription: '/ˈkɑːsl/', stress: 1, audio: null, category: 'places' },
                { word: 'evening', transcription: '/ˈiːvnɪŋ/', stress: 1, audio: null, category: 'time' },
                { word: 'garden', transcription: '/ˈɡɑːdn/', stress: 1, audio: null, category: 'places' },
                { word: 'letter', transcription: '/ˈletə/', stress: 1, audio: null, category: 'communication' },
                { word: 'minute', transcription: '/ˈmɪnɪt/', stress: 1, audio: null, category: 'time' },
                { word: 'moustache', transcription: '/məˈstɑːʃ/', stress: 2, audio: null, category: 'appearance' },
                { word: 'orange', transcription: '/ˈɒrɪndʒ/', stress: 1, audio: null, category: 'food' },
                { word: 'please', transcription: '/pliːz/', stress: 1, audio: null, category: 'expressions' },
                { word: 'quarter', transcription: '/ˈkwɔːtə/', stress: 1, audio: null, category: 'numbers' },
                { word: 'rather', transcription: '/ˈrɑːðə/', stress: 1, audio: null, category: 'expressions' },
                { word: 'sugar', transcription: '/ˈʃʊɡə/', stress: 1, audio: null, category: 'food' },
                { word: 'woman', transcription: '/ˈwʊmən/', stress: 1, audio: null, category: 'people' },
                { word: 'yesterday', transcription: '/ˈjestədeɪ/', stress: 1, audio: null, category: 'time' },
                { word: 'zebra', transcription: '/ˈzebrə/', stress: 1, audio: null, category: 'animals' },
                { word: 'future', transcription: '/ˈfjuːtʃə/', stress: 1, audio: null, category: 'time' },
                { word: 'leisure', transcription: '/ˈleʒə/', stress: 1, audio: null, category: 'activities' },
                { word: 'measure', transcription: '/ˈmeʒə/', stress: 1, audio: null, category: 'actions' },
                { word: 'picture', transcription: '/ˈpɪktʃə/', stress: 1, audio: null, category: 'objects' }
                ,{ word: 'apple', transcription: '/ˈæpl/', stress: 1, audio: null, category: 'food' }
                ,{ word: 'doctor', transcription: '/ˈdɒktə/', stress: 1, audio: null, category: 'health' }
                ,{ word: 'family', transcription: '/ˈfæmɪli/', stress: 1, audio: null, category: 'people' }
                ,{ word: 'holiday', transcription: '/ˈhɒlədeɪ/', stress: 1, audio: null, category: 'events' }
                ,{ word: 'music', transcription: '/ˈmjuːzɪk/', stress: 1, audio: null, category: 'culture' }
            ],
            intermediate: [
                { word: 'advertisement', transcription: '/ədˈvɜːtɪsmənt/', stress: 2, audio: null, category: 'business' },
                { word: 'aluminium', transcription: '/ˌæljʊˈmɪniəm/', stress: 3, audio: null, category: 'science' },
                { word: 'laboratory', transcription: '/ləˈbɒrətri/', stress: 2, audio: null, category: 'science' },
                { word: 'secretary', transcription: '/ˈsekrətri/', stress: 1, audio: null, category: 'business' },
                { word: 'necessary', transcription: '/ˈnesəsəri/', stress: 1, audio: null, category: 'daily' },
                { word: 'controversy', transcription: '/ˈkɒntrəvɜːsi/', stress: 1, audio: null, category: 'academic' },
                { word: 'organisation', transcription: '/ˌɔːɡənaɪˈzeɪʃən/', stress: 4, audio: null, category: 'business' },
                { word: 'realisation', transcription: '/ˌriːəlaɪˈzeɪʃən/', stress: 4, audio: null, category: 'academic' },
                { word: 'pronunciation', transcription: '/prəˌnʌnsɪˈeɪʃn/', stress: 4, audio: null, category: 'language' },
                { word: 'initiative', transcription: '/ɪˈnɪʃətɪv/', stress: 2, audio: null, category: 'business' },
                { word: 'borough', transcription: '/ˈbʌrə/', stress: 1, audio: null, category: 'places' },
                { word: 'thorough', transcription: '/ˈθʌrə/', stress: 1, audio: null, category: 'general' },
                // Додаємо нові слова для intermediate рівня
                { word: 'authority', transcription: '/ɔːˈθɒrəti/', stress: 2, audio: null, category: 'society' },
                { word: 'cemetery', transcription: '/ˈsemətrɪ/', stress: 1, audio: null, category: 'places' },
                { word: 'colleague', transcription: '/ˈkɒliːɡ/', stress: 1, audio: null, category: 'work' },
                { word: 'determine', transcription: '/dɪˈtɜːmɪn/', stress: 2, audio: null, category: 'actions' },
                { word: 'emphasize', transcription: '/ˈemfəsaɪz/', stress: 1, audio: null, category: 'communication' },
                { word: 'fascinating', transcription: '/ˈfæsɪneɪtɪŋ/', stress: 1, audio: null, category: 'description' },
                { word: 'government', transcription: '/ˈɡʌvənmənt/', stress: 1, audio: null, category: 'politics' },
                { word: 'hierarchy', transcription: '/ˈhaɪərɑːki/', stress: 1, audio: null, category: 'structure' },
                { word: 'inevitable', transcription: '/ɪnˈevɪtəbl/', stress: 2, audio: null, category: 'adjectives' },
                { word: 'juvenile', transcription: '/ˈdʒuːvənaɪl/', stress: 1, audio: null, category: 'age' },
                { word: 'knowledge', transcription: '/ˈnɒlɪdʒ/', stress: 1, audio: null, category: 'education' },
                { word: 'legitimate', transcription: '/lɪˈdʒɪtɪmət/', stress: 2, audio: null, category: 'law' },
                { word: 'mortgage', transcription: '/ˈmɔːɡɪdʒ/', stress: 1, audio: null, category: 'finance' },
                { word: 'negotiable', transcription: '/nɪˈɡəʊʃiəbl/', stress: 2, audio: null, category: 'business' },
                { word: 'opportunity', transcription: '/ˌɒpəˈtjuːnəti/', stress: 3, audio: null, category: 'general' },
                { word: 'parliament', transcription: '/ˈpɑːləmənt/', stress: 1, audio: null, category: 'politics' },
                { word: 'psychology', transcription: '/saɪˈkɒlədʒi/', stress: 2, audio: null, category: 'science' },
                { word: 'questionnaire', transcription: '/ˌkwestʃəˈneə/', stress: 3, audio: null, category: 'research' },
                { word: 'restaurant', transcription: '/ˈrestrɒnt/', stress: 1, audio: null, category: 'places' },
                { word: 'throughout', transcription: '/θruːˈaʊt/', stress: 2, audio: null, category: 'prepositions' }
                ,{ word: 'analysis', transcription: '/əˈnæləsɪs/', stress: 2, audio: null, category: 'science' }
                ,{ word: 'capacity', transcription: '/kəˈpæsəti/', stress: 2, audio: null, category: 'general' }
                ,{ word: 'diversity', transcription: '/daɪˈvɜːsəti/', stress: 2, audio: null, category: 'society' }
                ,{ word: 'efficient', transcription: '/ɪˈfɪʃnt/', stress: 2, audio: null, category: 'adjectives' }
                ,{ word: 'heritage', transcription: '/ˈherɪtɪdʒ/', stress: 1, audio: null, category: 'culture' }
            ],
            advanced: [
                { word: 'worcestershire', transcription: '/ˈwʊstəʃə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/worcestershire.mp3', category: 'places' },
                { word: 'gloucestershire', transcription: '/ˈɡlɒstəʃə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/gloucestershire.mp3', category: 'places' },
                { word: 'lieutenant', transcription: '/lefˈtenənt/', stress: 2, audio: null, category: 'military' },
                { word: 'quay', transcription: '/kiː/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/quay.mp3', category: 'maritime' },
                { word: 'choir', transcription: '/ˈkwaɪə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/choir.mp3', category: 'music' },
                { word: 'colonel', transcription: '/ˈkɜːnəl/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/colonel.mp3', category: 'military' },
                { word: 'yacht', transcription: '/jɒt/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/yacht.mp3', category: 'maritime' },
                { word: 'draught', transcription: '/drɑːft/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/draught.mp3', category: 'daily' },
                { word: 'paradigm', transcription: '/ˈpærədaɪm/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/paradigm.mp3', category: 'academic' },
                { word: 'anemone', transcription: '/əˈnemənɪ/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/anemone.mp3', category: 'nature' },
                { word: 'hyperbole', transcription: '/haɪˈpɜːbəli/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/hyperbole.mp3', category: 'language' },
                { word: 'archipelago', transcription: '/ˌɑːkɪˈpeləɡəʊ/', stress: 3, audio: null, audioPath: 'assets/audio/words/advanced/archipelago.mp3', category: 'geography' },
                // Додаємо нові слова для advanced рівня
                { word: 'asthma', transcription: '/ˈæsmə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/asthma.mp3', category: 'health' },
                { word: 'bourgeois', transcription: '/ˈbɔːʒwɑː/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/bourgeois.mp3', category: 'society' },
                { word: 'catastrophe', transcription: '/kəˈtæstrəfi/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/catastrophe.mp3', category: 'events' },
                { word: 'debt', transcription: '/det/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/debt.mp3', category: 'finance' },
                { word: 'etiquette', transcription: '/ˈetɪket/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/etiquette.mp3', category: 'social' },
                { word: 'faux pas', transcription: '/ˌfəʊ ˈpɑː/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/faux-pas.mp3', category: 'social' },
                { word: 'genre', transcription: '/ˈʒɒnrə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/genre.mp3', category: 'arts' },
                { word: 'heir', transcription: '/eə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/heir.mp3', category: 'family' },
                { word: 'isle', transcription: '/aɪl/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/isle.mp3', category: 'geography' },
                { word: 'jalapeno', transcription: '/ˌhæləˈpiːnəʊ/', stress: 3, audio: null, audioPath: 'assets/audio/words/advanced/jalapeno.mp3', category: 'food' },
                { word: 'knead', transcription: '/niːd/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/knead.mp3', category: 'actions' },
                { word: 'Leicester', transcription: '/ˈlestə/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/leicester.mp3', category: 'places' },
                { word: 'mortgage', transcription: '/ˈmɔːɡɪdʒ/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/mortgage.mp3', category: 'finance' },
                { word: 'niche', transcription: '/niːʃ/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/niche.mp3', category: 'business' },
                { word: 'onomatopoeia', transcription: '/ˌɒnəˌmætəˈpiːə/', stress: 5, audio: null, audioPath: 'assets/audio/words/advanced/onomatopoeia.mp3', category: 'language' },
                { word: 'pneumonia', transcription: '/njuːˈməʊniə/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/pneumonia.mp3', category: 'health' },
                { word: 'queue', transcription: '/kjuː/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/queue.mp3', category: 'daily' },
                { word: 'reciprocity', transcription: '/ˌresɪˈprɒsɪti/', stress: 3, audio: null, audioPath: 'assets/audio/words/advanced/reciprocity.mp3', category: 'relationships' },
                { word: 'subtle', transcription: '/ˈsʌtl/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/subtle.mp3', category: 'adjectives' },
                { word: 'thesaurus', transcription: '/θɪˈsɔːrəs/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/thesaurus.mp3', category: 'books' },
                { word: 'usurp', transcription: '/juːˈzɜːp/', stress: 2, audio: null, audioPath: 'assets/audio/words/advanced/usurp.mp3', category: 'politics' },
                { word: 'victuals', transcription: '/ˈvɪtlz/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/victuals.mp3', category: 'food' },
                { word: 'Warwick', transcription: '/ˈwɒrɪk/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/warwick.mp3', category: 'places' },
                { word: 'xylophone', transcription: '/ˈzaɪləfəʊn/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/xylophone.mp3', category: 'music' },
                { word: 'yoghurt', transcription: '/ˈjɒɡət/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/yoghurt.mp3', category: 'food' },
                { word: 'zeitgeist', transcription: '/ˈzaɪtɡaɪst/', stress: 1, audio: null, audioPath: 'assets/audio/words/advanced/zeitgeist.mp3', category: 'culture' }
                ,{ word: 'miscellaneous', transcription: '/ˌmɪsəˈleɪniəs/', stress: 3, audio: null, category: 'general' }
                ,{ word: 'philanthropy', transcription: '/fɪˈlænθrəpi/', stress: 2, audio: null, category: 'society' }
                ,{ word: 'quintessential', transcription: '/ˌkwɪntɪˈsenʃl/', stress: 3, audio: null, category: 'description' }
                ,{ word: 'ubiquitous', transcription: '/juːˈbɪkwɪtəs/', stress: 2, audio: null, category: 'adjectives' }
                ,{ word: 'whistleblower', transcription: '/ˈwɪslˌbləʊə/', stress: 1, audio: null, category: 'politics' }
            ]
        };

        // Використовуємо дані скоромовок з імпортованого модуля
        this.tongueTwisters = tongueTwistersData;

        this.initializeGame();
        this.bindEvents();
        this.initThemeToggle();
        this.loadWord();
        
        // Попереднє завантаження аудіофайлів для поточного рівня
        this.preloadAudioForCurrentLevel();
    }

    // Додаємо новий метод для попереднього завантаження аудіо
    async preloadAudioForCurrentLevel() {
        this.isLoadingAudio = true;
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        try {
            // Витягуємо список слів для поточного рівня
            const wordsForLevel = this.getCurrentLevelWords();
            
            // Перевіряємо наявність локальних аудіофайлів
            const wordsWithoutLocalAudio = [];
            
            // Спочатку перевіряємо наявність локальних аудіо для всіх слів
            for (const wordItem of wordsForLevel) {
                if (wordItem.audioPath) {
                    try {
                        // Створюємо аудіо елемент для перевірки наявності файлу
                        const audioElement = new Audio(wordItem.audioPath);
                        
                        // Використовуємо проміс для перевірки завантаження
                        await new Promise((resolve, reject) => {
                            audioElement.oncanplaythrough = () => {
                                console.log(`Локальне аудіо для "${wordItem.word}" завантажено успішно`);
                                wordItem.audio = wordItem.audioPath;
                                resolve();
                            };
                            
                            audioElement.onerror = () => {
                                console.warn(`Локальне аудіо для "${wordItem.word}" не знайдено`);
                                wordsWithoutLocalAudio.push(wordItem.word);
                                resolve(); // Ми все одно продовжуємо процес
                            };
                            
                            // Обробляємо випадок, коли аудіо не може бути завантажене протягом 5 секунд
                            setTimeout(() => {
                                if (!wordItem.audio) {
                                    console.warn(`Таймаут завантаження аудіо для "${wordItem.word}"`);
                                    wordsWithoutLocalAudio.push(wordItem.word);
                                    resolve();
                                }
                            }, 5000);
                            
                            // Починаємо завантаження
                            audioElement.load();
                        });
                    } catch (error) {
                        console.error(`Помилка перевірки локального аудіо для "${wordItem.word}":`, error);
                        wordsWithoutLocalAudio.push(wordItem.word);
                    }
                } else {
                    wordsWithoutLocalAudio.push(wordItem.word);
                }
            }
            
            console.log("Слова без локального аудіо:", wordsWithoutLocalAudio);
            
            // Якщо є слова без локального аудіо, спробуємо завантажити їх через API
            if (wordsWithoutLocalAudio.length > 0 && this.currentLevel !== 'advanced') {
                console.log("Завантаження аудіо через API для", wordsWithoutLocalAudio.length, "слів");
                
                // Використовуємо AudioLoader для завантаження аудіо тільки для слів без локальних файлів
                await audioLoader.preloadAudioForWords(wordsWithoutLocalAudio);
                
                // Оновлюємо аудіо для кожного слова
                wordsForLevel.forEach(wordItem => {
                    if (!wordItem.audio) {
                        const audioUrl = audioLoader.getCachedAudioUrl(wordItem.word);
                        if (audioUrl) {
                            wordItem.audio = audioUrl;
                        }
                    }
                });
            } else if (this.currentLevel === 'advanced') {
                console.log("Рівень advanced: завантаження через API пропущено, щоб уникнути CORS помилок");
            }
            
            // Оновлюємо поточне слово для правильного відтворення
            if (this.currentWord) {
                if (!this.currentWord.audio) {
                    const audioUrl = audioLoader.getCachedAudioUrl(this.currentWord.word);
                    if (audioUrl) {
                        this.currentWord.audio = audioUrl;
                    }
                }
            }
        } catch (error) {
            console.error('Помилка при завантаженні аудіо:', error);
        } finally {
            this.isLoadingAudio = false;
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    }

    initializeGame() {
        // Initialize Web Speech API if available
        this.synthesis = window.speechSynthesis;
        this.checkSpeechSupport();

        // Load saved progress
        this.loadProgress();
        this.updateUI();
        
        // Показуємо головне меню при ініціалізації
        this.showMainMenu();
    }
    
    // Метод для перевірки підтримки Web Speech API
    checkSpeechSupport() {
        console.log("Перевірка підтримки Web Speech API");
        
        // Перевіряємо наявність Web Speech API
        const speechSynthesisSupported = 'speechSynthesis' in window;
        const speechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
        
        console.log("Підтримка синтезу мовлення:", speechSynthesisSupported);
        console.log("Підтримка розпізнавання мовлення:", speechRecognitionSupported);
        
        // Перевіряємо, чи можемо ми створити новий об'єкт SpeechSynthesisUtterance
        let utteranceSupported = false;
        try {
            const testUtterance = new SpeechSynthesisUtterance("test");
            utteranceSupported = true;
            console.log("Підтримка SpeechSynthesisUtterance:", utteranceSupported);
        } catch (error) {
            console.error("Помилка створення SpeechSynthesisUtterance:", error);
            utteranceSupported = false;
        }
        
        // Перевіряємо наявність голосів
        if (speechSynthesisSupported) {
            const voices = this.synthesis.getVoices();
            console.log("Доступні голоси:", voices.length > 0 ? voices.length : "не завантажено");
            
            // Якщо голоси не завантажені, додаємо обробник події
            if (voices.length === 0 && this.synthesis.onvoiceschanged !== undefined) {
                this.synthesis.onvoiceschanged = () => {
                    const updatedVoices = this.synthesis.getVoices();
                    console.log("Голоси завантажено:", updatedVoices.length);
                };
            }
        }
        
        // Зберігаємо результати перевірки
        this.speechSupported = speechSynthesisSupported && utteranceSupported;
        
        return this.speechSupported;
    }

    bindEvents() {
        // Обробники подій для головного меню (оновлено для карток)
        document.querySelectorAll('.menu-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                const mode = e.target.closest('.menu-card').dataset.mode;
                await this.switchMode(mode);
            });
        });

        // Кнопки повернення до головного меню
        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-from-phonetics-btn')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('back-from-twisters-btn')?.addEventListener('click', () => this.showMainMenu());

        // Level selector
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => await this.changeLevel(e.target.dataset.level));
        });

        // Audio controls
        document.getElementById('play-btn').addEventListener('click', () => this.playAudio());
        
        // Speed controls
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeSpeed(parseFloat(e.target.dataset.speed)));
        });

        // Next button
        document.getElementById('next-btn').addEventListener('click', async () => await this.nextWord());
        
        // Інформаційна кнопка
        const infoButton = document.getElementById('info-button');
        const infoPanel = document.getElementById('info-panel');
        
        if (infoButton && infoPanel) {
            infoButton.addEventListener('click', () => {
                if (infoPanel.style.display === 'block') {
                    infoPanel.style.display = 'none';
                    infoButton.textContent = 'ℹ️';
                } else {
                    infoPanel.style.display = 'block';
                    infoButton.textContent = '✖️';
                }
            });
        }

        // Події для режиму карток
        document.getElementById('back-from-flashcards-btn')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('flashcard-play-btn')?.addEventListener('click', () => this.playAudio());
        document.getElementById('flashcard-reveal-btn')?.addEventListener('click', () => this.revealFlashcardInfo());
        document.getElementById('flashcard-next-btn')?.addEventListener('click', () => this.nextFlashcard());
        
        // Події для власних слів
        document.getElementById('back-from-custom-words-btn')?.addEventListener('click', () => this.showMainMenu());
    }

    async changeLevel(level) {
        if (this.isLoadingAudio) return; // Запобігаємо зміні рівня під час завантаження
        
        this.currentLevel = level;
        this.currentWordIndex = 0;
        
        // Update UI
        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        // Завантажуємо аудіо для нового рівня
        this.preloadAudioForCurrentLevel();
        
        await this.loadWord();
        
        // Зберігаємо прогрес тільки якщо немає блокування
        if (!this.blockProgressSaving) {
            this.saveProgress();
        }
    }

    async loadWord() {
        // Блокуємо швидку зміну слів
        if (this.isLoadingWord) {
            console.log("Слово вже завантажується, пропускаємо запит");
            return;
        }
        
        this.isLoadingWord = true;
        
        try {
            const words = this.getCurrentLevelWords();
            if (this.currentWordIndex >= words.length) {
                this.currentWordIndex = 0;
                this.levelUp();
            }

            const currentWord = words[this.currentWordIndex];
            this.currentWord = currentWord;
            
            console.log(`Завантаження слова "${currentWord.word}" (індекс: ${this.currentWordIndex})`);

            // Choose random task type
            this.currentTaskType = this.taskTypes[Math.floor(Math.random() * this.taskTypes.length)];
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Clear previous feedback
            this.hideFeedback();
            document.getElementById('next-btn').disabled = true;
            
            // Load audio first, then display word
            await this.loadAudioForCurrentWord();
            
            // Перевіряємо, чи слово не змінилося під час завантаження
            if (this.currentWord.word === currentWord.word) {
                // Only display word after audio is loaded or failed
                this.displayWord();
                this.generateOptions();
                this.updateProgress();
                
                console.log(`Слово "${currentWord.word}" успішно завантажено з аудіо:`, !!this.currentWord.audio);
            } else {
                console.log(`Слово змінилося під час завантаження. Старе: "${currentWord.word}", нове: "${this.currentWord.word}"`);
            }
            
            // Hide loading indicator
            this.hideLoadingIndicator();
        } catch (error) {
            console.error('Помилка завантаження слова:', error);
            this.hideLoadingIndicator();
        } finally {
            this.isLoadingWord = false;
        }
    }

    // Завантажує аудіо для поточного слова з гарантією синхронізації
    async loadAudioForCurrentWord() {
        const wordToLoad = this.currentWord.word;
        const startTime = performance.now();
        console.log(`🔊 Завантаження аудіо для слова: "${wordToLoad}"`);
        
        try {
            // Спочатку перевіряємо кеш AudioLoader
            const cachedUrl = audioLoader.getCachedAudioUrl(wordToLoad);
            if (cachedUrl) {
                console.log(`✅ Аудіо знайдено в кеші: ${cachedUrl}`);
                this.currentWord.audio = cachedUrl;
                return;
            }
            
            // Перевіряємо наявність локального аудіо шляху
            if (this.currentWord.audioPath) {
                console.log(`🔍 Перевірка локального аудіо: ${this.currentWord.audioPath}`);
                
                const audioElement = new Audio(this.currentWord.audioPath);
                
                // Використовуємо промис для перевірки завантаження
                const localAudioLoaded = await new Promise((resolve) => {
                    const timeout = setTimeout(() => {
                        console.warn(`⏱️ Таймаут локального аудіо (2сек): ${this.currentWord.audioPath}`);
                        resolve(false);
                    }, 2000);
                    
                    audioElement.oncanplaythrough = () => {
                        clearTimeout(timeout);
                        console.log(`✅ Локальне аудіо завантажено успішно`);
                        resolve(true);
                    };
                    
                    audioElement.onerror = (error) => {
                        clearTimeout(timeout);
                        console.warn(`❌ Локальне аудіо не знайдено:`, error);
                        resolve(false);
                    };
                    
                    audioElement.load();
                });
                
                if (localAudioLoaded && this.currentWord.word === wordToLoad) {
                    this.currentWord.audio = this.currentWord.audioPath;
                    console.log(`✅ Використовуємо локальне аудіо для "${wordToLoad}"`);
                    return;
                }
            }
            
            // Якщо локального аудіо немає або воно не завантажилось, використовуємо API
            if (!this.currentWord.audio && this.currentWord.word === wordToLoad) {
                console.log(`🌐 Завантаження аудіо з API для "${wordToLoad}"`);
                const audioUrl = await audioLoader.getAudioUrl(wordToLoad);
                
                // Перевіряємо, чи все ще актуальне це слово
                if (this.currentWord.word === wordToLoad) {
                    if (audioUrl) {
                        this.currentWord.audio = audioUrl;
                        console.log(`✅ Аудіо з API завантажено успішно для "${wordToLoad}"`);
                    } else {
                        console.log(`🎤 Аудіо з API не знайдено для "${wordToLoad}", використовуємо синтез`);
                    }
                } else {
                    console.log(`⚠️ Слово змінилось під час завантаження API. Очікувалося: "${wordToLoad}", поточне: "${this.currentWord.word}"`);
                }
            }
        } catch (error) {
            console.error(`❌ Помилка завантаження аудіо для "${wordToLoad}":`, error);
        } finally {
            const endTime = performance.now();
            console.log(`⏱️ Завантаження аудіо для "${wordToLoad}" зайняло ${Math.round(endTime - startTime)}мс`);
        }
    }

    displayWord() {
        const wordDisplay = document.getElementById('word-display');
        const taskType = document.getElementById('task-type');
        const wordCategory = document.getElementById('word-category');
        const voiceInput = document.getElementById('voice-input');

        wordDisplay.textContent = this.currentWord.word;
        
        // Відображаємо категорію слова
        if (wordCategory && this.currentWord.category) {
            wordCategory.textContent = this.currentWord.category;
            wordCategory.style.display = 'inline-block';
        } else if (wordCategory) {
            wordCategory.style.display = 'none';
        }

        switch (this.currentTaskType) {
            case 'transcription':
                taskType.textContent = 'Оберіть правильну транскрипцію';
                if (voiceInput) voiceInput.style.display = 'none';
                break;
            case 'stress':
                taskType.textContent = 'Який склад наголошений?';
                if (voiceInput) voiceInput.style.display = 'none';
                break;
            case 'sound-sorting':
                taskType.textContent = 'До якої групи звуків належить це слово?';
                if (voiceInput) voiceInput.style.display = 'none';
                break;
        }

        // Підготовка аудіо (завжди)
        this.synthesizeAudio();
        
        console.log("Task type:", this.currentTaskType);
    }

    showLoadingIndicator() {
        const gameContent = document.querySelector('.game-content');
        if (gameContent) {
            gameContent.style.opacity = '0.5';
            gameContent.style.pointerEvents = 'none';
        }
        
        let loadingIndicator = document.getElementById('loading-indicator');
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loading-indicator';
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = `
                <div class="spinner"></div>
                <p>Завантаження слова...</p>
            `;
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                gameArea.appendChild(loadingIndicator);
            }
        }
        loadingIndicator.style.display = 'flex';
    }

    hideLoadingIndicator() {
        const gameContent = document.querySelector('.game-content');
        if (gameContent) {
            gameContent.style.opacity = '1';
            gameContent.style.pointerEvents = 'auto';
        }
        
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    synthesizeAudio() {
        // Create synthetic audio using Web Speech API як запасний варіант
        const utterance = new SpeechSynthesisUtterance(this.currentWord.word);
        utterance.lang = 'en-GB';
        utterance.rate = this.playbackSpeed;
        
        // Try to find a British voice
        const voices = this.synthesis.getVoices();
        const britishVoice = voices.find(voice => 
            voice.lang.includes('en-GB') || voice.name.includes('British')
        );
        
        if (britishVoice) {
            utterance.voice = britishVoice;
        }

        this.currentUtterance = utterance;
    }

    playAudio() {
        const audio = document.getElementById('word-audio');
        
        console.log(`🎵 Відтворення аудіо для слова: "${this.currentWord.word}"`);
        console.log(`🎵 Доступне аудіо: ${this.currentWord.audio ? 'Так' : 'Ні'}`);
        console.log(`🎵 Швидкість відтворення: ${this.playbackSpeed}x`);

        // Якщо доступне реальне аудіо, спершу намагаємося відтворити його
        if (this.currentWord.audio) {
            console.log(`🎵 Спроба відтворення аудіо: ${this.currentWord.audio}`);

            audio.src = this.currentWord.audio;
            audio.playbackRate = this.playbackSpeed;

            // Якщо аудіо почало відтворюватися, зупиняємо синтезований голос
            const handlePlaying = () => {
                clearTimeout(audioTimeout);
                if (this.synthesis.speaking) {
                    this.synthesis.cancel();
                }
            };

            audio.onplaying = handlePlaying;
            audio.onplay = () => {
                console.log("✅ Аудіо почало відтворюватися");
            };
            audio.onended = () => {
                console.log("✅ Відтворення аудіо завершено");
            };
            audio.onerror = (error) => {
                console.error('❌ Помилка відтворення аудіо:', error);
                if (this.currentWord.audio === this.currentWord.audioPath) {
                    console.log("🔄 Помилка з локальним аудіо, спробуємо Web Speech API");
                    this.currentWord.audio = null;
                }
                clearTimeout(audioTimeout);
                this.fallbackToSynthesizedAudio();
            };

            // Якщо аудіо не почало відтворюватися протягом 3 секунд, використовуємо синтезований голос
            const audioTimeout = setTimeout(() => {
                if (audio.paused) {
                    console.warn("⏰ Аудіо не почало відтворюватися протягом 3 секунд, переходимо до синтезу");
                    this.fallbackToSynthesizedAudio();
                }
            }, 3000);

            audio.play().catch(error => {
                console.error('❌ Помилка відтворення аудіо:', error);
                clearTimeout(audioTimeout);
                this.fallbackToSynthesizedAudio();
            });
        } else {
            // В іншому випадку одразу використовуємо синтезований голос
            console.log("🎤 Немає доступного аудіо, використовуємо синтез");
            this.fallbackToSynthesizedAudio();
        }
    }

    fallbackToSynthesizedAudio() {
        // Використовуємо Web Speech API для синтезу голосу
        console.log(`🎤 Використовуємо синтезований голос для "${this.currentWord.word}"`);
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        
        // Додаємо обробники подій для синтезу
        this.currentUtterance.onstart = () => {
            console.log("✅ Синтез мовлення розпочато");
        };
        
        this.currentUtterance.onend = () => {
            console.log("✅ Синтез мовлення завершено");
        };
        
        this.currentUtterance.onerror = (error) => {
            console.error("❌ Помилка синтезу мовлення:", error);
        };
        
        this.synthesis.speak(this.currentUtterance);
    }

    changeSpeed(speed) {
        this.playbackSpeed = speed;
        
        // Update UI
        document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-speed="${speed}"]`).classList.add('active');
        
        this.synthesizeAudio();
    }

    generateOptions() {
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        let options = [];

        switch (this.currentTaskType) {
            case 'transcription':
                options = this.generateTranscriptionOptions();
                break;
            case 'stress':
                options = this.generateStressOptions();
                break;
            case 'sound-sorting':
                options = this.generateSoundOptions();
                break;
        }

        console.log("Generated options:", options);
        
        // Завжди перемішуємо варіанти відповідей для більшої випадковості
        const shuffledOptions = this.shuffleArray(options);

        shuffledOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            
            // Додаємо спеціальний клас для транскрипцій
            if (this.currentTaskType === 'transcription') {
                button.classList.add('transcription');
                // Форматуємо транскрипцію для кращого відображення
                button.innerHTML = this.formatTranscription(option.text);
            } else {
                button.textContent = option.text;
            }
            
            button.dataset.correct = option.correct;
            button.addEventListener('click', () => this.selectOption(button));
            optionsContainer.appendChild(button);
        });
    }
    
    // Новий метод для форматування транскрипції
    formatTranscription(transcription) {
        // Виділяємо фонетичні символи
        return transcription.replace(/([ɪiːɑɒɔʊuːeæʌəɜː]|[θðʃʒŋ]|[ˈˌ])/g, 
            '<span class="phonetic-symbol">$1</span>');
    }

    generateTranscriptionOptions() {
        const correct = this.currentWord.transcription;
        const options = [{ text: correct, correct: true }];

        console.log("Генерація опцій транскрипції для слова:", this.currentWord.word);
        
        // Створюємо більш логічні і типові помилки у транскрипції
        const errorTypes = [
            // Заміна ʃ на s (типова помилка для 'sh' звуку)
            { find: /ʃ/g, replace: 's' },
            
            // Заміна довгих голосних на короткі
            { find: /iː/g, replace: 'ɪ' },
            { find: /ɑː/g, replace: 'ʌ' },
            { find: /ɔː/g, replace: 'ɒ' },
            { find: /uː/g, replace: 'ʊ' },
            
            // Заміна шва на інші голосні
            { find: /ə/g, replace: 'ɛ' },
            
            // Зміна дифтонгів
            { find: /eɪ/g, replace: 'e' },
            { find: /aɪ/g, replace: 'ɪ' },
            { find: /ɔɪ/g, replace: 'ɔ' },
            
            // Неправильне використання наголосу
            { find: /ˈ/g, replace: 'ˌ' },
            
            // Заміна θ на t або f (типова помилка для 'th')
            { find: /θ/g, replace: 't' },
            
            // Заміна ð на d або v (типова помилка для 'th')
            { find: /ð/g, replace: 'd' }
        ];
        
        // Створюємо набір неправильних варіантів з більш правдоподібними помилками
        let incorrectOptions = [];
        
        // Для кожного типу помилки створюємо варіант
        errorTypes.forEach(error => {
            if (correct.match(error.find)) {
                const incorrectOption = correct.replace(error.find, error.replace);
                if (incorrectOption !== correct && !incorrectOptions.includes(incorrectOption)) {
                    incorrectOptions.push(incorrectOption);
                }
            }
        });
        
        // Якщо слово містить 'j' звук, створюємо варіант із заміною на 'dʒ' або навпаки
        if (correct.includes('j')) {
            incorrectOptions.push(correct.replace(/j/g, 'dʒ'));
        } else if (correct.includes('dʒ')) {
            incorrectOptions.push(correct.replace(/dʒ/g, 'j'));
        }
        
        // Якщо слово містить 'w', створюємо варіант із заміною на 'v' або навпаки
        if (correct.includes('w')) {
            incorrectOptions.push(correct.replace(/w/g, 'v'));
        } else if (correct.includes('v')) {
            incorrectOptions.push(correct.replace(/v/g, 'w'));
        }
        
        console.log("Згенеровано некоректних опцій:", incorrectOptions.length);
        
        // Якщо ми не згенерували достатньо неправильних варіантів, додаємо стандартні
        if (incorrectOptions.length < 3) {
            // Додаємо кілька стандартних типів помилок
            const standardErrors = [
                // Переставляємо сусідні звуки (якщо можливо)
                correct.replace(/([^\/])([^\/])/, '$2$1'),
                // Видаляємо один звук
                correct.replace(/[^\/\s][^\s\/]/, ''),
                // Додаємо зайвий звук 'r' (типова помилка для британської вимови)
                correct.replace(/([aeiouɑɒɔəɜ])/, '$1r')
            ];
            
            standardErrors.forEach(err => {
                if (err !== correct && !incorrectOptions.includes(err)) {
                    incorrectOptions.push(err);
                }
            });
        }
        
        // Фільтруємо, щоб залишити тільки унікальні і відмінні від правильного
        incorrectOptions = incorrectOptions.filter(opt => 
            opt !== correct && 
            !options.some(o => o.text === opt) && 
            this.isValidTranscription(opt)
        );
        
        // Вибираємо до 3 неправильних варіантів
        const optionsToAdd = Math.min(3, incorrectOptions.length);
        incorrectOptions.slice(0, optionsToAdd).forEach(opt => {
            options.push({ text: opt, correct: false });
        });
        
        // Якщо у нас все ще недостатньо опцій, додаємо універсальний неправильний варіант
        if (options.length < 2) {
            // Створюємо повністю іншу транскрипцію залежно від початкової
            let fallbackOption;
            if (correct.includes('ʃ')) {
                fallbackOption = '/sɪmpl/';
            } else if (correct.includes('ð') || correct.includes('θ')) {
                fallbackOption = '/ˈnɒrməl/';
            } else {
                fallbackOption = '/ˈbeɪsɪk/';
            }
            
            options.push({ 
                text: fallbackOption,
                correct: false 
            });
            console.warn("Додано запасний варіант через недостатню кількість опцій");
        }
        
        console.log("Загальна кількість опцій перед перемішуванням:", options.length);

        return this.shuffleArray(options);
    }

    // Додаємо метод для перевірки валідності транскрипції
    isValidTranscription(transcription) {
        // Перевіряємо, щоб транскрипція починалася і закінчувалася слешами
        if (!transcription.startsWith('/') || !transcription.endsWith('/')) {
            return false;
        }
        
        // Перевіряємо, щоб транскрипція містила хоча б один голосний звук
        const hasVowel = /[ɪiːɑɒɔʊuːeæʌəɜː]/g.test(transcription);
        if (!hasVowel) {
            return false;
        }
        
        // Перевіряємо, щоб у транскрипції не було двох голосних підряд (крім дифтонгів)
        const hasConsecutiveVowels = /[ɪiɑɒɔʊueæʌəɜ][ɪiɑɒɔʊueæʌəɜ]/g.test(transcription);
        if (hasConsecutiveVowels) {
            // Виняток для дифтонгів
            const isDiphthong = /eɪ|aɪ|ɔɪ|əʊ|aʊ|ɪə|eə|ʊə/g.test(transcription);
            if (!isDiphthong) {
                return false;
            }
        }
        
        // Перевіряємо загальну довжину (не занадто коротка і не занадто довга)
        const content = transcription.slice(1, -1); // Видаляємо слеші
        if (content.length < 2 || content.length > this.currentWord.word.length * 3) {
            return false;
        }
        
        return true;
    }

    generateStressOptions() {
        console.log("Генерація опцій наголосу для слова:", this.currentWord.word);
        
        // Спробуємо виділити склади за допомогою регулярного виразу
        let syllables = this.currentWord.word.match(/[aeiouy]+[^aeiouy]*/gi) || [];
        
        console.log("Виявлено складів:", syllables.length);
        
        // Якщо не вдалося визначити склади, використовуємо альтернативний підхід
        if (syllables.length === 0) {
            // Просто рахуємо голосні як наближення до кількості складів
            const vowels = this.currentWord.word.match(/[aeiouy]/gi) || [];
            const vowelCount = vowels.length;
            
            console.log("Використання альтернативного підходу. Кількість голосних:", vowelCount);
            
            // Генеруємо фіктивні склади на основі кількості голосних
            for (let i = 0; i < vowelCount; i++) {
                syllables.push(`склад-${i+1}`);
            }
        }
        
        // Забезпечуємо мінімум 2 склади для вибору
        if (syllables.length < 2) {
            syllables.push("додатковий-склад");
            console.warn("Додано фіктивний склад для забезпечення варіантів");
        }
        
        const options = [];
        
        // Обмежуємо до 4 складів максимум
        const maxSyllables = Math.min(syllables.length, 4);
        
        for (let i = 0; i < maxSyllables; i++) {
            options.push({
                text: `${i + 1}-й склад`,
                correct: i + 1 === this.currentWord.stress
            });
        }
        
        console.log("Згенеровано опцій наголосу:", options.length);
        
        return options;
    }

    generateSoundOptions() {
        console.log("Генерація опцій звуків для слова:", this.currentWord.word);
        
        const vowelSounds = [
            'Короткі голосні (/ɪ/, /e/, /æ/)',
            'Довгі голосні (/iː/, /ɑː/, /ɔː/)',
            'Дифтонги (/eɪ/, /aɪ/, /ɔɪ/)',
            'Центральні звуки (/ə/, /ɜː/)'
        ];
        
        // Simple categorization based on transcription
        let correctCategory = 0;
        const transcription = this.currentWord.transcription;
        
        console.log("Транскрипція слова:", transcription);
        
        if (transcription.includes('iː') || transcription.includes('ɑː') || transcription.includes('ɔː') || 
            transcription.includes('uː') || transcription.includes('ɜː')) {
            correctCategory = 1; // Довгі голосні
        } else if (transcription.includes('eɪ') || transcription.includes('aɪ') || transcription.includes('ɔɪ') || 
                   transcription.includes('əʊ') || transcription.includes('aʊ') || transcription.includes('ɪə') || 
                   transcription.includes('eə') || transcription.includes('ʊə')) {
            correctCategory = 2; // Дифтонги
        } else if (transcription.includes('ə') || transcription.includes('ɜː')) {
            correctCategory = 3; // Центральні звуки
        } else {
            // За замовчуванням - короткі голосні
            correctCategory = 0;
        }
        
        console.log("Визначена категорія звуку:", correctCategory);

        const options = vowelSounds.map((sound, index) => ({
            text: sound,
            correct: index === correctCategory
        }));
        
        console.log("Згенеровано опцій звуків:", options.length);
        
        return options;
    }

    selectOption(button) {
        const isCorrect = button.dataset.correct === 'true';
        
        // Disable all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            } else if (btn === button && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        this.handleAnswer(isCorrect);
    }

    handleAnswer(isCorrect) {
        if (isCorrect) {
            this.score += 10 * (this.currentLevel === 'beginner' ? 1 : this.currentLevel === 'intermediate' ? 2 : 3);
            this.streak++;
            this.correctAnswers++;
            
            if (this.currentTaskType === 'sound-sorting') {
                this.vowelCorrect++;
            }
            
            this.showFeedback(true, 'Чудово! Правильна відповідь.');
            this.checkAchievements();
        } else {
            this.streak = 0;
            this.showFeedback(false, `Неправильно. Правильна відповідь: ${this.getCorrectAnswer()}`);
        }
        
        document.getElementById('next-btn').disabled = false;
        this.updateUI();
        
        // Зберігаємо прогрес тільки якщо немає блокування
        if (!this.blockProgressSaving) {
            this.saveProgress();
        } else {
            console.log('Збереження прогресу після відповіді заблоковано');
        }
    }

    getCorrectAnswer() {
        switch (this.currentTaskType) {
            case 'transcription':
                return this.currentWord.transcription;
            case 'stress':
                return `${this.currentWord.stress}-й склад`;
            case 'sound-sorting':
                const vowelSounds = ['Короткі голосні', 'Довгі голосні', 'Дифтонги', 'Центральні звуки'];
                const transcription = this.currentWord.transcription;
                let category = 0;
                
                if (transcription.includes('iː') || transcription.includes('ɑː') || transcription.includes('ɔː') || transcription.includes('uː') || transcription.includes('ɜː')) {
                    category = 1;
                } else if (transcription.includes('eɪ') || transcription.includes('aɪ') || transcription.includes('ɔɪ')) {
                    category = 2;
                } else if (transcription.includes('ə') || transcription.includes('ɜː')) {
                    category = 3;
                }
                
                return vowelSounds[category];
            default:
                return '';
        }
    }

    showFeedback(isCorrect, message) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'} show`;
    }

    hideFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback';
    }

    async nextWord() {
        this.currentWordIndex++;
        await this.loadWord();
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const words = this.getCurrentLevelWords();
        const progressPercentage = (this.currentWordIndex / words.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('streak').textContent = this.streak;
    }

    checkAchievements() {
        // First correct answer
        if (this.correctAnswers === 1) {
            this.unlockAchievement('first-correct');
        }
        
        // Streaks
        if (this.streak === 5) {
            this.unlockAchievement('streak-5');
        }
        
        if (this.streak === 10) {
            this.unlockAchievement('streak-10');
            this.unlockAchievement('speed-demon');
        }
        
        // Vowel master (5 correct sound-sorting answers)
        if (this.vowelCorrect >= 5) {
            this.unlockAchievement('vowel-master');
        }
        
        // Завершення просунутого рівня
        if (this.currentLevel === 'advanced' && 
            this.currentWordIndex === this.words.advanced.length - 1) {
            this.unlockAchievement('advanced-complete');
        }
        
        // Експерт зі слів (20+ правильних відповідей)
        if (this.correctAnswers >= 20) {
            this.unlockAchievement('word-expert');
        }
    }

    unlockAchievement(achievementId) {
        if (this.achievements.has(achievementId)) return;
        
        this.achievements.add(achievementId);
        
        // Update UI
        const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementElement) {
            // Додаємо красиву анімацію для досягнення
            achievementElement.classList.add('animating');
            
            // Спочатку показуємо нотифікацію
            this.showAchievementNotification(achievementElement.textContent);
            
            // Потім додаємо клас unlocked після невеликої затримки
            setTimeout(() => {
                achievementElement.classList.add('unlocked');
                achievementElement.classList.remove('animating');
            }, 500);
        }
        
        this.saveProgress();
    }
    
    // Покращений метод для показу нотифікації про досягнення
    showAchievementNotification(achievementText) {
        // Перевіряємо, чи немає активної нотифікації
        const existingNotification = document.querySelector('.achievement-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Створюємо елемент нотифікації
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        // Додаємо вміст з анімованим emoji
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div class="achievement-title">Нове досягнення!</div>
                <div class="achievement-text">${achievementText}</div>
            </div>
            <button class="notification-close">✕</button>
        `;
        
        // Додаємо до DOM
        document.body.appendChild(notification);
        
        // Додаємо кнопку закриття
        const closeButton = notification.querySelector('.notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        }
        
        // Додаємо звуковий ефект досягнення, якщо дозволено
        if (window.AudioContext || window.webkitAudioContext) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // До високої октави
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Мі
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Соль
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.warn("Не вдалося відтворити звук досягнення:", e);
            }
        }
        
        // Додаємо клас для анімації
        setTimeout(() => notification.classList.add('show'), 50);
        
        // Видаляємо після затримки
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    levelUp() {
        this.level++;
        this.unlockAchievement('level-up');
        this.updateUI();
        
        // Show level up message
        this.showFeedback(true, `🎉 Вітаємо! Ви досягли рівня ${this.level}`);
    }

    saveProgress() {
        // Якщо встановлено блокування збереження прогресу, не зберігаємо нічого
        if (this.blockProgressSaving) {
            console.log('Збереження прогресу заблоковано');
            return;
        }
        
        try {
            const progress = {
                score: this.score,
                level: this.level,
                streak: this.streak,
                achievements: Array.from(this.achievements),
                correctAnswers: this.correctAnswers,
                vowelCorrect: this.vowelCorrect,
                currentTongueTwisterIndex: this.currentTongueTwisterIndex, // Додаємо індекс поточної скоромовки
                currentLevel: this.currentLevel, // Зберігаємо поточний рівень складності
                currentWordIndex: this.currentWordIndex, // Зберігаємо індекс поточного слова
                lastMode: document.querySelector('.mode-btn.active')?.dataset.mode || 'game' // Зберігаємо останній активний режим
            };
            
            localStorage.setItem('pronunciationQuestProgress', JSON.stringify(progress));
            console.log('Прогрес збережено:', progress);
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    loadProgress() {
        try {
            const savedProgress = localStorage.getItem('pronunciationQuestProgress');
            
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                
                this.score = progress.score || 0;
                this.level = progress.level || 1;
                this.streak = progress.streak || 0;
                this.achievements = new Set(progress.achievements || []);
                this.correctAnswers = progress.correctAnswers || 0;
                this.vowelCorrect = progress.vowelCorrect || 0;
                
                // Завантажуємо індекс скоромовки, якщо він збережений
                if (progress.currentTongueTwisterIndex !== undefined) {
                    this.currentTongueTwisterIndex = progress.currentTongueTwisterIndex;
                }
                
                // Завантажуємо збережений рівень складності
                if (progress.currentLevel) {
                    this.currentLevel = progress.currentLevel;
                    console.log('Завантажено збережений рівень:', this.currentLevel);
                    
                    // Оновлюємо UI для відображення правильного рівня
                    setTimeout(() => {
                        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
                        const levelBtn = document.querySelector(`.level-btn[data-level="${this.currentLevel}"]`);
                        if (levelBtn) {
                            levelBtn.classList.add('active');
                        }
                    }, 100);
                }
                
                // Завантажуємо індекс поточного слова
                if (progress.currentWordIndex !== undefined) {
                    this.currentWordIndex = progress.currentWordIndex;
                }
                
                // Update achievements UI
                this.achievements.forEach(achievementId => {
                    const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
                    if (achievementElement) {
                        achievementElement.classList.add('unlocked');
                    }
                });
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    shuffleArray(array) {
        if (!array || !Array.isArray(array) || array.length <= 1) {
            console.log("Масив порожній або містить лише один елемент:", array);
            return array || [];
        }
        
        console.log("Перемішування масиву, початковий стан:", JSON.stringify(array));
        
        // Використовуємо алгоритм Фішера-Єйтса для перемішування
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            // Використовуємо криптографічно захищене випадкове число для більшої випадковості
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Перевіряємо, чи дійсно масив перемішано
        let isSame = true;
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== shuffled[i]) {
                isSame = false;
                break;
            }
        }
        
        // Якщо масив не змінився після перемішування, спробуємо ще раз
        if (isSame && array.length > 2) {
            console.log("Масив не змінився після перемішування, спробуємо ще раз");
            return this.shuffleArray(array);
        }
        
        console.log("Перемішаний масив:", JSON.stringify(shuffled));
        
        // Переконаємося, що у нас є хоча б 2 опції
        if (shuffled.length < 2) {
            console.warn("Після перемішування масив має менше 2 елементів!");
        }
        
        return shuffled;
    }

    // Додаємо метод для перемикання режимів (оновлений)
    async switchMode(mode) {
        const mainMenu = document.getElementById('main-menu');
        const gameArea = document.querySelector('.game-area');
        const phoneticsZoneElement = document.getElementById('phonetics-zone');
        const tongueTwistersSection = document.getElementById('tongue-twisters-section');
        const flashcardsSection = document.getElementById('flashcards-section');
        const customWordsSection = document.getElementById('custom-words-section');
        
        // Видаляємо активний стан з усіх кнопок режимів
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Активуємо кнопку відповідного режиму, якщо вона існує
        const activeButton = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Ховаємо всі секції спочатку
        mainMenu.style.display = 'none';
        gameArea.style.display = 'none';
        phoneticsZoneElement.style.display = 'none';
        if (tongueTwistersSection) {
            tongueTwistersSection.style.display = 'none';
        }
        if (flashcardsSection) {
            flashcardsSection.style.display = 'none';
        }
        if (customWordsSection) {
            customWordsSection.style.display = 'none';
        }
        
        if (mode === 'quiz') {
            // Показуємо ігрову зону (режим квізу)
            gameArea.style.display = 'block';
            
            // Перемішуємо слова при вході в режим квізу
            this.shuffleWordsForCurrentLevel();
            
            // Завантажуємо перше слово
            this.currentWordIndex = 0;
            await this.loadWord();
        } else if (mode === 'learn') {
            // Показуємо фонетичну зону
            phoneticsZoneElement.style.display = 'block';
            
            // Ініціалізуємо фонетичну зону, якщо ще не ініціалізована
            if (!this.phoneticsZoneInitialized) {
                phoneticsZone.init(phoneticsZoneElement);
                this.phoneticsZoneInitialized = true;
            }
            
            // Видаляємо будь-які посилання на скоромовки в режимі вивчення
            const learnModeButtons = phoneticsZoneElement.querySelectorAll('button, a');
            learnModeButtons.forEach(button => {
                if (button.textContent.toLowerCase().includes('скоромовк') || 
                    button.getAttribute('href')?.includes('tongue-twisters')) {
                    button.remove();
                }
            });
        } else if (mode === 'tongue-twisters') {
            // Показуємо секцію скоромовок
            if (tongueTwistersSection) {
                tongueTwistersSection.style.display = 'block';
                
                // Ініціалізуємо секцію скоромовок, якщо ще не ініціалізована
                if (!this.tongueTwistersInitialized) {
                    this.initTongueTwisters();
                    this.tongueTwistersInitialized = true;
                }
            }
        } else if (mode === 'flashcards') {
            if (flashcardsSection) {
                flashcardsSection.style.display = 'block';
                if (!this.flashcardsInitialized) {
                    this.initFlashcards();
                    this.flashcardsInitialized = true;
                } else {
                    this.displayFlashcard();
                }
            }
        } else if (mode === 'custom-words') {
            if (customWordsSection) {
                customWordsSection.style.display = 'block';
                if (!this.customWordsInitialized) {
                    customWordsManager.init();
                    this.customWordsInitialized = true;
                    
                    // Завантажуємо поділені підбірки з URL
                    customWordsManager.loadSharedCollection();
                }
            }
        } else if (mode === 'main-menu') {
            // Показуємо головне меню
            mainMenu.style.display = 'flex';
        }
        
        // Зберігаємо прогрес із зазначенням поточного режиму, якщо немає блокування
        if (!this.blockProgressSaving) {
            this.saveProgress();
        }
        
        // Прокручуємо сторінку догори після зміни режиму
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Новий метод для перемішування слів поточного рівня
    shuffleWordsForCurrentLevel() {
        if (this.currentLevel === 'custom' && this.customWords.length > 0) {
            this.customWords = this.shuffleArray([...this.customWords]);
        } else {
            const wordsForLevel = this.words[this.currentLevel];
            this.words[this.currentLevel] = this.shuffleArray([...wordsForLevel]);
        }
        console.log(`Слова для рівня ${this.currentLevel} перемішані`);
    }

    // Метод для ініціалізації секції скоромовок
    initTongueTwisters() {
        console.log("Ініціалізуємо секцію скоромовок");
        
        const tongueTwistersSection = document.getElementById('tongue-twisters-section');
        if (!tongueTwistersSection) {
            console.error("Елемент tongue-twisters-section не знайдено!");
            return;
        }
        
        // Отримуємо посилання на елементи інтерфейсу
        const twisterText = document.getElementById('twister-text');
        const twisterIndex = document.getElementById('twister-index');
        const playTwisterBtn = document.getElementById('play-twister-btn');
        const nextTwisterBtn = document.getElementById('next-twister-btn');
        const prevTwisterBtn = document.getElementById('prev-twister-btn');
        const repeatTwisterBtn = document.getElementById('repeat-twister-btn');
        
        // Перевіряємо наявність всіх елементів
        if (!twisterText) console.error("Елемент twister-text не знайдено!");
        if (!twisterIndex) console.error("Елемент twister-index не знайдено!");
        if (!playTwisterBtn) console.error("Елемент play-twister-btn не знайдено!");
        if (!nextTwisterBtn) console.error("Елемент next-twister-btn не знайдено!");
        if (!prevTwisterBtn) console.error("Елемент prev-twister-btn не знайдено!");
        if (!repeatTwisterBtn) console.error("Елемент repeat-twister-btn не знайдено!");
        
        // Встановлюємо поточну скоромовку
        this.displayCurrentTongueTwister();
        
        // Додаємо обробники подій для кнопок скоромовок з логуванням
        if (playTwisterBtn) {
            console.log("Додаємо обробник для кнопки відтворення");
            playTwisterBtn.addEventListener('click', () => {
                console.log("Кнопку відтворення натиснуто");
                this.playCurrentTongueTwister();
            });
        }
        
        if (nextTwisterBtn) {
            console.log("Додаємо обробник для кнопки наступної скоромовки");
            nextTwisterBtn.addEventListener('click', () => {
                console.log("Кнопку наступної скоромовки натиснуто");
                this.nextTongueTwister();
            });
        }
        
        if (prevTwisterBtn) {
            console.log("Додаємо обробник для кнопки попередньої скоромовки");
            prevTwisterBtn.addEventListener('click', () => {
                console.log("Кнопку попередньої скоромовки натиснуто");
                this.previousTongueTwister();
            });
        }
        
        if (repeatTwisterBtn) {
            console.log("Додаємо обробник для кнопки повільного відтворення");
            repeatTwisterBtn.addEventListener('click', () => {
                console.log("Кнопку повільного відтворення натиснуто");
                this.repeatTongueTwisterSlowly();
            });
        }
        
        // Додаємо обробники подій для кнопок швидкості
        const twisterSpeedBtns = tongueTwistersSection.querySelectorAll('.twister-speed-btn');
        if (twisterSpeedBtns.length > 0) {
            console.log(`Знайдено ${twisterSpeedBtns.length} кнопок швидкості`);
            twisterSpeedBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const speed = parseFloat(e.target.dataset.speed);
                    console.log(`Обрано швидкість: ${speed}`);
                    this.changeTwisterSpeed(speed);
                });
            });
            
            // Встановлюємо активну кнопку швидкості
            this.updateTwisterSpeedButtons();
        } else {
            console.warn("Кнопки швидкості не знайдено");
        }
        
        console.log("Ініціалізація секції скоромовок завершена");
    }
    
    // Метод для зміни швидкості відтворення скоромовок
    changeTwisterSpeed(speed) {
        this.playbackSpeed = speed;
        
        // Оновлюємо кнопки швидкості
        this.updateTwisterSpeedButtons();
        
        // Оновлюємо параметри відтворення поточної скоромовки
        this.prepareTongueTwisterAudio();
        
        console.log(`Швидкість відтворення скоромовок змінено: ${speed}`);
    }
    
    // Метод для оновлення кнопок швидкості скоромовок
    updateTwisterSpeedButtons() {
        const twisterSpeedBtns = document.querySelectorAll('.twister-speed-btn');
        
        twisterSpeedBtns.forEach(btn => {
            const buttonSpeed = parseFloat(btn.dataset.speed);
            if (buttonSpeed === this.playbackSpeed) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Метод для відображення поточної скоромовки
    displayCurrentTongueTwister() {
        const twisterText = document.getElementById('twister-text');
        const twisterIndex = document.getElementById('twister-index');
        const twisterTips = document.querySelector('.twister-tips');
        
        if (!twisterText || !twisterIndex) {
            console.error("Не знайдено елементи для відображення скоромовки");
            return;
        }
        
        const currentTwister = this.tongueTwisters[this.currentTongueTwisterIndex];
        console.log("Відображаємо скоромовку:", currentTwister.text);
        
        // Встановлюємо текст скоромовки та індекс
        twisterText.textContent = currentTwister.text;
        twisterIndex.textContent = `${this.currentTongueTwisterIndex + 1}/${this.tongueTwisters.length}`;
        
        // Відображаємо поради, якщо вони є
        if (twisterTips && currentTwister.tips && currentTwister.tips.length > 0) {
            // Очищаємо вміст контейнера порад
            twisterTips.innerHTML = '<h3>Поради:</h3><ul></ul>';
            const tipsUl = twisterTips.querySelector('ul');
            
            // Додаємо нові поради
            currentTwister.tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                tipsUl.appendChild(li);
            });
        }
        
        // Попередньо завантажуємо аудіо для нової скоромовки
        this.prepareTongueTwisterAudio();
    }
    
    // Оновлений метод для підготовки аудіо скоромовки
    prepareTongueTwisterAudio() {
        console.log("Підготовка аудіо для скоромовки");
        
        // Отримуємо поточну скоромовку
        const currentTwister = this.tongueTwisters[this.currentTongueTwisterIndex];
        
        // Видаляємо попередній аудіо-елемент, якщо він є
        const oldAudio = document.getElementById('twister-audio');
        if (oldAudio) {
            oldAudio.pause();
            oldAudio.remove();
        }
        
        // Створюємо новий аудіо-елемент
        const audioElement = document.createElement('audio');
        audioElement.id = 'twister-audio';
        
        // Перевіряємо наявність локального аудіофайлу
        if (currentTwister.audioPath) {
            console.log("Знайдено шлях до локального аудіофайлу:", currentTwister.audioPath);
            audioElement.src = currentTwister.audioPath;
            currentTwister.audioReady = true;
            
            // Додаємо обробник помилки завантаження файлу
            audioElement.onerror = (e) => {
                console.error("Помилка завантаження локального аудіо:", e);
                currentTwister.audioReady = false;
                
                // Якщо є base64 аудіо, використовуємо його як запасний варіант
                if (currentTwister.audioBase64) {
                    console.log("Використовуємо base64 аудіо як запасний варіант");
                    const audioSrc = `data:audio/mp3;base64,${currentTwister.audioBase64}`;
                    audioElement.src = audioSrc;
                    currentTwister.audioReady = true;
                }
            };
        } 
        // Якщо є аудіо base64, використовуємо його
        else if (currentTwister.audioBase64) {
            const audioSrc = `data:audio/mp3;base64,${currentTwister.audioBase64}`;
            audioElement.src = audioSrc;
            currentTwister.audioReady = true;
        } else {
            // Інакше готуємося використовувати Web Speech API
            currentTwister.audioReady = false;
            
            // Створюємо новий utterance для Web Speech API
            const utterance = new SpeechSynthesisUtterance(currentTwister.text);
            utterance.lang = 'en-GB';
            utterance.rate = this.playbackSpeed;
            
            // Знаходимо британський голос
            const voices = this.synthesis.getVoices();
            const britishVoice = voices.find(voice => 
                voice.lang.includes('en-GB') || voice.name.includes('British')
            );
            
            if (britishVoice) {
                utterance.voice = britishVoice;
            }
            
            // Зберігаємо utterance для подальшого використання
            currentTwister.utterance = utterance;
        }
        
        // Додаємо аудіо-елемент до DOM
        document.body.appendChild(audioElement);
    }
    
    // Метод для відтворення поточної скоромовки
    playCurrentTongueTwister() {
        console.log("Відтворюємо поточну скоромовку");
        
        // Отримуємо поточну скоромовку
        const currentTwister = this.tongueTwisters[this.currentTongueTwisterIndex];
        
        // Отримуємо аудіо-елемент
        const audioElement = document.getElementById('twister-audio');
        
        // Якщо є готове аудіо, відтворюємо його
        if (currentTwister.audioReady && audioElement && audioElement.src) {
            console.log("Відтворюємо завантажений аудіо-файл:", audioElement.src);
            
            // Показуємо індикатор завантаження
            this.highlightTwisterText(true);
            
            // Встановлюємо швидкість відтворення
            audioElement.playbackRate = this.playbackSpeed;
            
            // Додаємо обробники подій для відстеження стану відтворення
            audioElement.onplay = () => {
                console.log("Локальне аудіо: відтворення почалося");
            };
            
            audioElement.onended = () => {
                console.log("Локальне аудіо: відтворення завершено");
                this.highlightTwisterText(false);
            };
            
            audioElement.oncanplay = () => {
                console.log("Локальне аудіо: файл готовий до відтворення");
            };
            
            // Відтворюємо звук
            audioElement.play().then(() => {
                console.log("Відтворення аудіо почалося успішно");
            }).catch(error => {
                console.error("Помилка відтворення аудіо:", error);
                // Відображаємо повідомлення про помилку
                this.highlightTwisterText(false);
                
                // Спробуємо відтворити через Web Speech API
                console.log("Спроба відтворення через Web Speech API");
                this.playTongueTwisterUsingSpeech();
            });
        } else {
            console.log("Готове аудіо відсутнє, використовуємо Web Speech API");
            this.playTongueTwisterUsingSpeech();
        }
    }
    
    // Метод для відтворення скоромовки через Web Speech API
    playTongueTwisterUsingSpeech() {
        console.log("Відтворення скоромовки через Web Speech API");
        
        const currentTwister = this.tongueTwisters[this.currentTongueTwisterIndex];
        
        // Якщо Web Speech API не підтримується, показуємо скоромовку візуально
        if (!this.speechSupported) {
            console.log("Web Speech API не підтримується, використовуємо візуальний режим");
            this.showTongueTwisterVisually(currentTwister.text);
            return;
        }
        
        try {
            // Переконуємося, що об'єкт SpeechSynthesis ініціалізований
            if (!this.synthesis || typeof this.synthesis.speak !== 'function') {
                console.error("Об'єкт SpeechSynthesis не ініціалізований");
                this.synthesis = window.speechSynthesis;
            }
            
            // Зупиняємо попереднє відтворення, якщо воно є
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
            }
            
            // Створюємо новий utterance, якщо його немає
            if (!currentTwister.utterance) {
                const utterance = new SpeechSynthesisUtterance(currentTwister.text);
                utterance.lang = 'en-GB';
                utterance.rate = this.playbackSpeed;
                
                // Знаходимо британський голос
                const voices = this.synthesis.getVoices();
                const britishVoice = voices.find(voice => 
                    voice.lang.includes('en-GB') || voice.name.includes('British')
                );
                
                if (britishVoice) {
                    utterance.voice = britishVoice;
                }
                
                currentTwister.utterance = utterance;
            } else {
                // Оновлюємо швидкість, якщо utterance вже існує
                currentTwister.utterance.rate = this.playbackSpeed;
            }
            
            // Додаємо обробники подій для діагностики
            currentTwister.utterance.onstart = () => {
                console.log("Відтворення почалося");
                this.highlightTwisterText(true);
            };
            
            currentTwister.utterance.onend = () => {
                console.log("Відтворення завершено");
                this.highlightTwisterText(false);
            };
            
            currentTwister.utterance.onerror = (e) => {
                console.error("Помилка відтворення:", e);
                this.highlightTwisterText(false);
                
                // Якщо помилка продовжується, переходимо до візуального режиму
                if (e.error === "canceled" || e.error === "interrupted") {
                    console.log("Помилка відтворення, переходимо до візуального режиму");
                    this.showTongueTwisterVisually(currentTwister.text);
                } else {
                    alert("На жаль, відтворення скоромовки не вдалося. Спробуйте інший браузер.");
                }
            };
            
            // Відтворюємо
            this.synthesis.speak(currentTwister.utterance);
            console.log("Команда на відтворення надіслана");
        } catch (error) {
            console.error("Помилка відтворення через Web Speech API:", error);
            
            // При помилці переходимо до візуального режиму
            this.showTongueTwisterVisually(currentTwister.text);
        }
    }
    
    // Метод для виділення тексту скоромовки під час відтворення
    highlightTwisterText(highlight) {
        const twisterText = document.getElementById('twister-text');
        if (!twisterText) return;
        
        if (highlight) {
            twisterText.classList.add('playing');
        } else {
            twisterText.classList.remove('playing');
        }
    }
    
    // Оновлений метод для візуального відображення скоромовки
    showTongueTwisterVisually(text, slow = false) {
        const twisterText = document.getElementById('twister-text');
        if (!twisterText) return;
        
        // Зберігаємо оригінальний текст
        const originalText = twisterText.textContent;
        
        // Розбиваємо текст на слова
        const words = text.split(' ');
        
        // Швидкість анімації
        const speed = slow ? 1200 : 600; // Для повільного режиму використовуємо більший інтервал
        
        // Починаємо анімацію слів
        let wordIndex = 0;
        const interval = setInterval(() => {
            if (wordIndex < words.length) {
                // Виділяємо поточне слово
                const highlightedText = words.map((word, index) => 
                    index === wordIndex 
                        ? `<span class="highlight ${slow ? 'slow' : ''}">${word}</span>` 
                        : word
                ).join(' ');
                
                twisterText.innerHTML = highlightedText;
                wordIndex++;
            } else {
                // Повертаємо оригінальний текст
                twisterText.textContent = originalText;
                clearInterval(interval);
            }
        }, speed);
    }
    
    // Метод для переходу до наступної скоромовки
    nextTongueTwister() {
        this.currentTongueTwisterIndex++;
        if (this.currentTongueTwisterIndex >= this.tongueTwisters.length) {
            this.currentTongueTwisterIndex = 0;
        }
        
        this.displayCurrentTongueTwister();
    }
    
    // Метод для переходу до попередньої скоромовки
    previousTongueTwister() {
        this.currentTongueTwisterIndex--;
        if (this.currentTongueTwisterIndex < 0) {
            this.currentTongueTwisterIndex = this.tongueTwisters.length - 1;
        }
        
        this.displayCurrentTongueTwister();
    }
    
    // Метод для повільного повторення скоромовки
    repeatTongueTwisterSlowly() {
        console.log("Повільне відтворення скоромовки");
        
        // Отримуємо поточну скоромовку
        const currentTwister = this.tongueTwisters[this.currentTongueTwisterIndex];
        
        // Отримуємо аудіо-елемент
        const audioElement = document.getElementById('twister-audio');
        
        // Якщо є готове аудіо, відтворюємо його
        if (currentTwister.audioReady && audioElement && audioElement.src) {
            console.log("Відтворюємо завантажений аудіо-файл повільно");
            
            // Встановлюємо повільну швидкість відтворення
            audioElement.playbackRate = 0.5;
            
            // Відтворюємо звук
            audioElement.play().then(() => {
                console.log("Повільне відтворення аудіо почалося успішно");
            }).catch(error => {
                console.error("Помилка повільного відтворення аудіо:", error);
                this.playTongueTwisterSlowlyUsingSpeech();
            });
        } else {
            console.log("Готове аудіо відсутнє, використовуємо Web Speech API для повільного відтворення");
            this.playTongueTwisterSlowlyUsingSpeech();
        }
    }
    
    // Метод для повільного відтворення скоромовки через Web Speech API
    playTongueTwisterSlowlyUsingSpeech() {
        console.log("Повільне відтворення скоромовки через Web Speech API");
        
        const currentTwister = this.tongueTwisters[this.currentTongueTwisterIndex];
        
        // Якщо Web Speech API не підтримується, показуємо скоромовку візуально в повільному режимі
        if (!this.speechSupported) {
            console.log("Web Speech API не підтримується, використовуємо візуальний режим повільно");
            this.showTongueTwisterVisually(currentTwister.text, true); // true для повільного режиму
            return;
        }
        
        try {
            // Переконуємося, що об'єкт SpeechSynthesis ініціалізований
            if (!this.synthesis || typeof this.synthesis.speak !== 'function') {
                console.error("Об'єкт SpeechSynthesis не ініціалізований");
                this.synthesis = window.speechSynthesis;
            }
            
            // Зупиняємо попереднє відтворення, якщо воно є
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
            }
            
            // Створюємо новий utterance для повільного відтворення
            const slowUtterance = new SpeechSynthesisUtterance(currentTwister.text);
            slowUtterance.lang = 'en-GB';
            slowUtterance.rate = 0.5; // Повільна швидкість
            
            // Знаходимо британський голос
            const voices = this.synthesis.getVoices();
            const britishVoice = voices.find(voice => 
                voice.lang.includes('en-GB') || voice.name.includes('British')
            );
            
            if (britishVoice) {
                slowUtterance.voice = britishVoice;
            }
            
            // Додаємо обробники подій для діагностики
            slowUtterance.onstart = () => {
                console.log("Повільне відтворення почалося");
                this.highlightTwisterText(true);
            };
            
            slowUtterance.onend = () => {
                console.log("Повільне відтворення завершено");
                this.highlightTwisterText(false);
            };
            
            slowUtterance.onerror = (e) => {
                console.error("Помилка повільного відтворення:", e);
                this.highlightTwisterText(false);
                
                // Якщо помилка продовжується, переходимо до візуального режиму
                if (e.error === "canceled" || e.error === "interrupted") {
                    console.log("Помилка повільного відтворення, переходимо до візуального режиму");
                    this.showTongueTwisterVisually(currentTwister.text, true); // true для повільного режиму
                } else {
                    alert("На жаль, повільне відтворення скоромовки не вдалося. Спробуйте інший браузер.");
                }
            };
            
            // Відтворюємо
            this.synthesis.speak(slowUtterance);
            console.log("Команда на повільне відтворення надіслана");
        } catch (error) {
            console.error("Помилка повільного відтворення через Web Speech API:", error);

            // При помилці переходимо до візуального режиму
            this.showTongueTwisterVisually(currentTwister.text, true); // true для повільного режиму
        }
    }

    // --- Flashcards mode ---
    initFlashcards() {
        this.flashcardIndex = 0;
        this.displayFlashcard();
    }

    displayFlashcard() {
        const words = this.getCurrentLevelWords();
        if (this.flashcardIndex >= words.length) {
            this.flashcardIndex = 0;
        }

        const wordItem = words[this.flashcardIndex];
        this.currentWord = wordItem;

        document.getElementById('flashcard-word').textContent = wordItem.word;
        document.getElementById('flashcard-transcription').textContent = wordItem.transcription;
        document.getElementById('flashcard-stress').textContent = `${wordItem.stress}-й склад`;
        document.getElementById('flashcard-info').style.display = 'none';

        this.loadAudioForCurrentWord();
        this.synthesizeAudio();
    }

    revealFlashcardInfo() {
        document.getElementById('flashcard-info').style.display = 'block';
    }

    nextFlashcard() {
        this.flashcardIndex++;
        this.displayFlashcard();
    }

    // Новий метод для показу головного меню
    showMainMenu() {
        // Ховаємо всі секції
        document.querySelector('.game-area').style.display = 'none';
        document.getElementById('phonetics-zone').style.display = 'none';
        document.getElementById('tongue-twisters-section').style.display = 'none';
        document.getElementById('flashcards-section').style.display = 'none';
        if (document.getElementById('custom-words-section')) {
            document.getElementById('custom-words-section').style.display = 'none';
        }
        
        // Показуємо головне меню
        const mainMenu = document.getElementById('main-menu');
        mainMenu.style.display = 'flex';
        
        // Додаємо кнопку скидання прогресу, якщо її ще немає
        if (!document.getElementById('reset-progress-btn')) {
            const resetBtn = document.createElement('button');
            resetBtn.id = 'reset-progress-btn';
            resetBtn.className = 'reset-btn';
            resetBtn.textContent = '🔄 Скинути прогрес';
            resetBtn.addEventListener('click', () => this.resetProgress());
            
            // Додаємо кнопку після елементів меню
            const menuButtons = mainMenu.querySelector('.menu-buttons');
            if (menuButtons) {
                menuButtons.after(resetBtn);
            } else {
                mainMenu.appendChild(resetBtn);
            }
        }
        
        // Додаємо кнопку розблокування прогресу, якщо збереження заблоковане
        if (this.blockProgressSaving && !document.getElementById('unblock-progress-btn')) {
            const unblockBtn = document.createElement('button');
            unblockBtn.id = 'unblock-progress-btn';
            unblockBtn.className = 'reset-btn';
            unblockBtn.style.backgroundColor = '#27ae60';
            unblockBtn.textContent = '🔓 Розблокувати збереження прогресу';
            unblockBtn.addEventListener('click', () => this.unblockProgress());
            
            // Додаємо кнопку після кнопки скидання прогресу
            const resetBtn = document.getElementById('reset-progress-btn');
            if (resetBtn) {
                resetBtn.after(unblockBtn);
            } else {
                const menuButtons = mainMenu.querySelector('.menu-buttons');
                if (menuButtons) {
                    menuButtons.after(unblockBtn);
                } else {
                    mainMenu.appendChild(unblockBtn);
                }
            }
        } else if (!this.blockProgressSaving && document.getElementById('unblock-progress-btn')) {
            // Видаляємо кнопку, якщо збереження розблоковане
            document.getElementById('unblock-progress-btn').remove();
        }
        
        // Зупиняємо будь-яке відтворення аудіо
        this.stopAllAudio();
    }
    
    // Додаємо метод для розблокування збереження прогресу
    unblockProgress() {
        const isConfirmed = confirm('Ви впевнені, що хочете розблокувати збереження прогресу? Ваш поточний прогрес почне зберігатися.');
        
        if (isConfirmed) {
            this.blockProgressSaving = false;
            
            // Видаляємо кнопку розблокування
            const unblockBtn = document.getElementById('unblock-progress-btn');
            if (unblockBtn) {
                unblockBtn.remove();
            }
            
            // Зберігаємо поточний прогрес
            this.saveProgress();
            
            alert('Збереження прогресу розблоковано. Ваш прогрес тепер буде зберігатися.');
        }
    }
    
    // Додаємо метод для зупинки всіх аудіо
    stopAllAudio() {
        // Зупиняємо синтезоване мовлення
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        
        // Зупиняємо HTML5 аудіо
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (!audio.paused) {
                audio.pause();
            }
        });
        
        console.log('Всі аудіо зупинено');
    }

    /**
     * Reset the entire game progress and return to the initial state.
     *
     * This method clears any saved data from localStorage and sets
     * `blockProgressSaving` to `true`, preventing further automatic saving
     * of progress. A confirmation dialog is shown to the user before the
     * reset occurs.
     *
     * @returns {void}
     */
    // Додаємо метод для скидання прогресу
    resetProgress() {
        // Запитуємо підтвердження перед скиданням
        const isConfirmed = confirm('Ви впевнені, що хочете скинути весь прогрес? Ця дія незворотня.');
        
        if (isConfirmed) {
            // Блокуємо збереження прогресу на постійній основі
            this.blockProgressSaving = true;
            
            // Скидаємо всі дані прогресу
            this.score = 0;
            this.level = 1;
            this.streak = 0;
            this.achievements = new Set();
            this.correctAnswers = 0;
            this.vowelCorrect = 0;
            this.currentWordIndex = 0;
            this.currentLevel = 'beginner';
            this.currentTongueTwisterIndex = 0;
            
            // Видаляємо збережений прогрес з localStorage
            localStorage.removeItem('pronunciationQuestProgress');
            
            // Оновлюємо інтерфейс
            this.updateUI();
            
            // Оновлюємо рівень і перезавантажуємо слово
            document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
            const beginnerBtn = document.querySelector(`.level-btn[data-level="beginner"]`);
            if (beginnerBtn) {
                beginnerBtn.classList.add('active');
            }
            
            // Скидаємо стан досягнень в інтерфейсі
            document.querySelectorAll('.achievement-item').forEach(item => {
                item.classList.remove('unlocked');
            });
            
            // Відображаємо повідомлення
            alert('Прогрес успішно скинуто. Блокування збереження прогресу активовано. Щоб знову почати зберігати прогрес, перезавантажте сторінку.');
            
            // Повністю відновлюємо початковий стан гри
            this.resetGameState();
            
            // Перезавантажуємо гру
            this.showMainMenu();
        }
    }
    
    // Додаємо новий метод для повного відновлення стану гри
    async resetGameState() {
        // Скидаємо рівень складності
        await this.changeLevel('beginner');
        
        // Перемішуємо слова для свіжого початку
        this.shuffleWordsForCurrentLevel();
        
        // Скидаємо слово до першого
        this.currentWordIndex = 0;
        await this.loadWord();
        
        // Скидаємо налаштування швидкості
        this.playbackSpeed = 1.0;
        this.changeSpeed(1.0);
        
        // Оновлюємо прогрес-бар
        this.updateProgress();
        
        console.log('Стан гри повністю відновлено');
    }

    // Theme management methods
    initThemeToggle() {
        // Перевіряємо, чи не ініціалізовано вже перемикач тем
        if (window.themeToggleInitialized) {
            console.log('Theme toggle already initialized, skipping');
            return;
        }
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('pronunciation-quest-theme') || 'light';
        this.applyTheme(savedTheme);
        
        // Bind theme toggle event with delay to ensure DOM is ready
        setTimeout(() => {
            const themeToggleBtn = document.getElementById('theme-toggle-btn');
            if (themeToggleBtn) {
                // Видаляємо попередні обробники, щоб уникнути дублювання
                themeToggleBtn.removeEventListener('click', this.boundToggleTheme);
                
                // Створюємо bound функцію для можливості її видалення
                this.boundToggleTheme = () => {
                    this.toggleTheme();
                };
                
                themeToggleBtn.addEventListener('click', this.boundToggleTheme);
                
                // Позначаємо, що перемикач тем ініціалізовано
                window.themeToggleInitialized = true;
                console.log('Theme toggle initialized successfully');
            } else {
                console.error('Theme toggle button not found');
            }
        }, 100);
    }

    toggleTheme() {
        // Запобігаємо одночасним викликам
        if (this.isTogglingTheme) {
            console.log('Theme toggle already in progress, skipping');
            return;
        }
        
        this.isTogglingTheme = true;
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Save theme preference
        localStorage.setItem('pronunciation-quest-theme', newTheme);
        
        // Відновлюємо можливість перемикання через короткий час
        setTimeout(() => {
            this.isTogglingTheme = false;
        }, 200);
    }

    applyTheme(theme) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Уникаємо непотрібних змін
        if (currentTheme === theme) {
            console.log(`Theme already set to: ${theme}`);
            return;
        }
        
        console.log(`🎨 Changing theme from "${currentTheme}" to "${theme}"`);
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update toggle button
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Світла тема';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Темна тема';
            }
            console.log(`🎨 Theme UI updated: icon="${themeIcon.textContent}", text="${themeText.textContent}"`);
        } else {
            console.warn('🎨 Theme button elements not found');
        }
        
        console.log(`✅ Theme successfully changed to: ${theme}`);
    }

    // Метод для завантаження кастомних слів
    loadCustomWords(customWords) {
        this.customWords = customWords;
        this.words.custom = customWords;
        this.currentLevel = 'custom';
        console.log(`Loaded ${customWords.length} custom words`);
    }

    // Метод для отримання слів поточного рівня
    getCurrentLevelWords() {
        if (this.currentLevel === 'custom' && this.customWords.length > 0) {
            return this.customWords;
        }
        return this.words[this.currentLevel] || [];
    }

}

// Додаємо індикатор завантаження до DOM при запуску
function addLoadingIndicator() {
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Завантаження аудіо...</p>
        `;
        loadingIndicator.style.display = 'none';
        gameArea.appendChild(loadingIndicator);
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Додаємо індикатор завантаження
    addLoadingIndicator();
    
    // Check if browser supports the Web Speech API
    if (!window.speechSynthesis) {
        alert('Ваш браузер не підтримує Web Speech API, необхідний для роботи гри. Спробуйте використовувати Chrome, Edge або Safari.');
        return;
    }

    // Load voices when available
    function loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0 && !window.game) {
            // Start the game only if it hasn't been created yet
            window.game = new PronunciationQuest();
            
            // Виводимо повідомлення для діагностики проблеми з варіантами
            console.log("Гру ініціалізовано!");
            setTimeout(() => {
                const options = document.getElementById('options');
                console.log("Варіанти відповіді:", options?.children.length || 0);
            }, 1000);
        } else if (voices.length === 0) {
            // Try again only if voices aren't loaded yet
            setTimeout(loadVoices, 100);
        }
    }

    // Chrome needs this event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Try to load voices
    loadVoices();
}); 