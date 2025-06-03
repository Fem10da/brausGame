// Імпортуємо AudioLoader та PhoneticsZone
import audioLoader from './audio-loader.js';
import phoneticsZone from './phonetics-zone.js';

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
            ],
            advanced: [
                { word: 'worcestershire', transcription: '/ˈwʊstəʃə/', stress: 1, audio: null, category: 'places' },
                { word: 'gloucestershire', transcription: '/ˈɡlɒstəʃə/', stress: 1, audio: null, category: 'places' },
                { word: 'lieutenant', transcription: '/lefˈtenənt/', stress: 2, audio: null, category: 'military' },
                { word: 'quay', transcription: '/kiː/', stress: 1, audio: null, category: 'maritime' },
                { word: 'choir', transcription: '/ˈkwaɪə/', stress: 1, audio: null, category: 'music' },
                { word: 'colonel', transcription: '/ˈkɜːnəl/', stress: 1, audio: null, category: 'military' },
                { word: 'yacht', transcription: '/jɒt/', stress: 1, audio: null, category: 'maritime' },
                { word: 'draught', transcription: '/drɑːft/', stress: 1, audio: null, category: 'daily' },
                { word: 'paradigm', transcription: '/ˈpærədaɪm/', stress: 1, audio: null, category: 'academic' },
                { word: 'anemone', transcription: '/əˈnemənɪ/', stress: 2, audio: null, category: 'nature' },
                { word: 'hyperbole', transcription: '/haɪˈpɜːbəli/', stress: 2, audio: null, category: 'language' },
                { word: 'archipelago', transcription: '/ˌɑːkɪˈpeləɡəʊ/', stress: 3, audio: null, category: 'geography' },
                // Додаємо нові слова для advanced рівня
                { word: 'asthma', transcription: '/ˈæsmə/', stress: 1, audio: null, category: 'health' },
                { word: 'bourgeois', transcription: '/ˈbɔːʒwɑː/', stress: 1, audio: null, category: 'society' },
                { word: 'catastrophe', transcription: '/kəˈtæstrəfi/', stress: 2, audio: null, category: 'events' },
                { word: 'debt', transcription: '/det/', stress: 1, audio: null, category: 'finance' },
                { word: 'etiquette', transcription: '/ˈetɪket/', stress: 1, audio: null, category: 'social' },
                { word: 'faux pas', transcription: '/ˌfəʊ ˈpɑː/', stress: 2, audio: null, category: 'social' },
                { word: 'genre', transcription: '/ˈʒɒnrə/', stress: 1, audio: null, category: 'arts' },
                { word: 'heir', transcription: '/eə/', stress: 1, audio: null, category: 'family' },
                { word: 'isle', transcription: '/aɪl/', stress: 1, audio: null, category: 'geography' },
                { word: 'jalapeno', transcription: '/ˌhæləˈpiːnəʊ/', stress: 3, audio: null, category: 'food' },
                { word: 'knead', transcription: '/niːd/', stress: 1, audio: null, category: 'actions' },
                { word: 'Leicester', transcription: '/ˈlestə/', stress: 1, audio: null, category: 'places' },
                { word: 'mortgage', transcription: '/ˈmɔːɡɪdʒ/', stress: 1, audio: null, category: 'finance' },
                { word: 'niche', transcription: '/niːʃ/', stress: 1, audio: null, category: 'business' },
                { word: 'onomatopoeia', transcription: '/ˌɒnəˌmætəˈpiːə/', stress: 5, audio: null, category: 'language' },
                { word: 'pneumonia', transcription: '/njuːˈməʊniə/', stress: 2, audio: null, category: 'health' },
                { word: 'queue', transcription: '/kjuː/', stress: 1, audio: null, category: 'daily' },
                { word: 'reciprocity', transcription: '/ˌresɪˈprɒsɪti/', stress: 3, audio: null, category: 'relationships' },
                { word: 'subtle', transcription: '/ˈsʌtl/', stress: 1, audio: null, category: 'adjectives' },
                { word: 'thesaurus', transcription: '/θɪˈsɔːrəs/', stress: 2, audio: null, category: 'books' },
                { word: 'usurp', transcription: '/juːˈzɜːp/', stress: 2, audio: null, category: 'politics' },
                { word: 'victuals', transcription: '/ˈvɪtlz/', stress: 1, audio: null, category: 'food' },
                { word: 'Warwick', transcription: '/ˈwɒrɪk/', stress: 1, audio: null, category: 'places' },
                { word: 'xylophone', transcription: '/ˈzaɪləfəʊn/', stress: 1, audio: null, category: 'music' },
                { word: 'yoghurt', transcription: '/ˈjɒɡət/', stress: 1, audio: null, category: 'food' },
                { word: 'zeitgeist', transcription: '/ˈzaɪtɡaɪst/', stress: 1, audio: null, category: 'culture' }
            ]
        };

        this.tongueTwitters = [
            "She sells seashells by the seashore",
            "Red lorry, yellow lorry",
            "The sixth sick sheik's sixth sheep's sick",
            "How much wood would a woodchuck chuck"
        ];

        this.initializeGame();
        this.bindEvents();
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
            const wordsForLevel = this.words[this.currentLevel];
            const wordList = wordsForLevel.map(item => item.word);
            
            // Використовуємо AudioLoader для завантаження аудіо
            await audioLoader.preloadAudioForWords(wordList);
            
            // Оновлюємо аудіо для кожного слова
            wordsForLevel.forEach(wordItem => {
                const audioUrl = audioLoader.getCachedAudioUrl(wordItem.word);
                if (audioUrl) {
                    wordItem.audio = audioUrl;
                }
            });
            
            // Оновлюємо поточне слово для правильного відтворення
            if (this.currentWord) {
                const audioUrl = audioLoader.getCachedAudioUrl(this.currentWord.word);
                if (audioUrl) {
                    this.currentWord.audio = audioUrl;
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
        // Initialize Web Speech API
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-GB';
        }

        // Load saved progress
        this.loadProgress();
        this.updateUI();
    }

    bindEvents() {
        // Level selector
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLevel(e.target.dataset.level));
        });

        // Audio controls
        document.getElementById('play-btn').addEventListener('click', () => this.playAudio());
        
        // Speed controls
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeSpeed(parseFloat(e.target.dataset.speed)));
        });

        // Next button
        document.getElementById('next-btn').addEventListener('click', () => this.nextWord());

        // Voice recording
        if (this.recognition) {
            document.getElementById('record-btn').addEventListener('click', () => this.toggleRecording());
            this.recognition.onresult = (event) => this.handleSpeechResult(event);
            this.recognition.onerror = (event) => this.handleSpeechError(event);
        }
        
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });
    }

    changeLevel(level) {
        if (this.isLoadingAudio) return; // Запобігаємо зміні рівня під час завантаження
        
        this.currentLevel = level;
        this.currentWordIndex = 0;
        
        // Update UI
        document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        // Завантажуємо аудіо для нового рівня
        this.preloadAudioForCurrentLevel();
        
        this.loadWord();
    }

    loadWord() {
        const words = this.words[this.currentLevel];
        if (this.currentWordIndex >= words.length) {
            this.currentWordIndex = 0;
            this.levelUp();
        }

        const currentWord = words[this.currentWordIndex];
        this.currentWord = currentWord;

        // Choose random task type
        this.currentTaskType = this.taskTypes[Math.floor(Math.random() * this.taskTypes.length)];
        
        this.displayWord();
        this.generateOptions();
        this.updateProgress();
        
        // Clear previous feedback
        this.hideFeedback();
        document.getElementById('next-btn').disabled = true;
        
        // Якщо для слова немає аудіо, спробуємо завантажити
        this.loadAudioForCurrentWord();
    }

    // Додаємо новий метод для завантаження аудіо для поточного слова
    async loadAudioForCurrentWord() {
        if (!this.currentWord.audio) {
            try {
                const audioUrl = await audioLoader.getAudioUrl(this.currentWord.word);
                if (audioUrl) {
                    this.currentWord.audio = audioUrl;
                }
            } catch (error) {
                console.error(`Помилка завантаження аудіо для "${this.currentWord.word}":`, error);
            }
        }
    }

    displayWord() {
        const wordDisplay = document.getElementById('word-display');
        const taskType = document.getElementById('task-type');
        const voiceInput = document.getElementById('voice-input');
        const wordCategory = document.getElementById('word-category');

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
                voiceInput.style.display = 'none';
                break;
            case 'stress':
                taskType.textContent = 'Який склад наголошений?';
                voiceInput.style.display = 'none';
                break;
            case 'sound-sorting':
                taskType.textContent = 'До якої групи звуків належить це слово?';
                voiceInput.style.display = 'none';
                break;
        }

        // Підготовка аудіо (завжди)
        this.synthesizeAudio();
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
        // Спершу намагаємося відтворити аудіо з API, якщо є
        const audio = document.getElementById('word-audio');
        
        if (this.currentWord.audio) {
            // Використовуємо реальний аудіофайл
            audio.src = this.currentWord.audio;
            audio.playbackRate = this.playbackSpeed;
            audio.play().catch(error => {
                console.error('Помилка відтворення аудіо:', error);
                this.fallbackToSynthesizedAudio();
            });
        } else {
            // Використовуємо синтезований голос як запасний варіант
            this.fallbackToSynthesizedAudio();
        }
    }

    fallbackToSynthesizedAudio() {
        // Використовуємо Web Speech API для синтезу голосу
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
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

        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option.text;
            button.dataset.correct = option.correct;
            button.addEventListener('click', () => this.selectOption(button));
            optionsContainer.appendChild(button);
        });
    }

    generateTranscriptionOptions() {
        const correct = this.currentWord.transcription;
        const options = [{ text: correct, correct: true }];

        // Generate incorrect options
        const incorrectOptions = [
            correct.replace(/ˈ/g, 'ˌ'), // Wrong stress
            correct.replace(/ː/g, ''), // Remove long vowels
            correct.replace(/ə/g, 'e'), // Replace schwa
            correct.replace(/ɒ/g, 'ɔː') // Different vowel sounds
        ].filter(opt => opt !== correct && opt.length > 0);

        // Add some of the incorrect options
        incorrectOptions.slice(0, 3).forEach(opt => {
            options.push({ text: opt, correct: false });
        });

        return this.shuffleArray(options);
    }

    generateStressOptions() {
        const syllables = this.currentWord.word.match(/[aeiouy]+/gi) || [];
        const options = [];

        for (let i = 0; i < syllables.length && i < 4; i++) {
            options.push({
                text: `${i + 1}-й склад`,
                correct: i + 1 === this.currentWord.stress
            });
        }

        return options;
    }

    generateSoundOptions() {
        const vowelSounds = ['Короткі голосні (/ɪ/, /e/, /æ/)', 'Довгі голосні (/iː/, /ɑː/, /ɔː/)', 'Дифтонги (/eɪ/, /aɪ/, /ɔɪ/)', 'Центральні звуки (/ə/, /ɜː/)'];
        
        // Simple categorization based on transcription
        let correctCategory = 0;
        const transcription = this.currentWord.transcription;
        
        if (transcription.includes('iː') || transcription.includes('ɑː') || transcription.includes('ɔː')) {
            correctCategory = 1;
        } else if (transcription.includes('eɪ') || transcription.includes('aɪ') || transcription.includes('ɔɪ')) {
            correctCategory = 2;
        } else if (transcription.includes('ə') || transcription.includes('ɜː')) {
            correctCategory = 3;
        }

        return vowelSounds.map((sound, index) => ({
            text: sound,
            correct: index === correctCategory
        }));
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
        this.saveProgress();
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
                
                if (transcription.includes('iː') || transcription.includes('ɑː') || transcription.includes('ɔː')) {
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

    nextWord() {
        this.currentWordIndex++;
        this.loadWord();
    }

    toggleRecording() {
        if (!this.recognition) return;
        
        const recordBtn = document.getElementById('record-btn');
        
        if (this.isRecording) {
            this.recognition.stop();
            recordBtn.classList.remove('recording');
            recordBtn.textContent = '🎤 Записати вимову';
            this.isRecording = false;
        } else {
            this.recognition.start();
            recordBtn.classList.add('recording');
            recordBtn.textContent = '⏹️ Зупинити запис';
            this.isRecording = true;
        }
    }

    handleSpeechResult(event) {
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.remove('recording');
        recordBtn.textContent = '🎤 Записати вимову';
        this.isRecording = false;
        
        const transcript = event.results[0][0].transcript.toLowerCase();
        const word = this.currentWord.word.toLowerCase();
        
        // Simple comparison for now (can be improved with phonetic comparison)
        const similarity = this.calculateSimilarity(transcript, word);
        const isCorrect = similarity > 0.7;
        
        this.handleAnswer(isCorrect);
        
        // Show feedback specific to pronunciation
        const voiceFeedback = document.getElementById('voice-feedback');
        voiceFeedback.textContent = `Ви сказали: "${transcript}" (схожість: ${Math.round(similarity * 100)}%)`;
    }

    handleSpeechError(event) {
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.remove('recording');
        recordBtn.textContent = '🎤 Записати вимову';
        this.isRecording = false;
        
        this.showFeedback(false, 'Помилка запису голосу. Спробуйте ще раз.');
    }

    calculateSimilarity(str1, str2) {
        // Simple Levenshtein distance implementation
        const track = Array(str2.length + 1).fill(null).map(() => 
            Array(str1.length + 1).fill(null));
        
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // deletion
                    track[j - 1][i] + 1, // insertion
                    track[j - 1][i - 1] + indicator, // substitution
                );
            }
        }
        
        const distance = track[str2.length][str1.length];
        const maxLength = Math.max(str1.length, str2.length);
        return maxLength > 0 ? 1 - distance / maxLength : 1;
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const words = this.words[this.currentLevel];
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
        
        // Додаємо нові досягнення
        // Ідеальна вимова (5 правильних вимов підряд)
        if (this.currentTaskType === 'pronunciation' && this.streak >= 5) {
            this.unlockAchievement('perfect-pronunciation');
        }
        
        // Завершення просунутого рівня
        if (this.currentLevel === 'advanced' && 
            this.currentWordIndex === this.words.advanced.length - 1) {
            this.unlockAchievement('advanced-complete');
        }
    }

    unlockAchievement(achievementId) {
        if (this.achievements.has(achievementId)) return;
        
        this.achievements.add(achievementId);
        
        // Update UI
        const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementElement) {
            achievementElement.classList.add('unlocked');
            
            // Show notification
            this.showFeedback(true, `🏆 Нове досягнення: ${achievementElement.textContent}`);
        }
        
        this.saveProgress();
    }

    levelUp() {
        this.level++;
        this.unlockAchievement('level-up');
        this.updateUI();
        
        // Show level up message
        this.showFeedback(true, `🎉 Вітаємо! Ви досягли рівня ${this.level}`);
    }

    saveProgress() {
        try {
            const progress = {
                score: this.score,
                level: this.level,
                streak: this.streak,
                achievements: Array.from(this.achievements),
                correctAnswers: this.correctAnswers,
                vowelCorrect: this.vowelCorrect
            };
            
            localStorage.setItem('pronunciationQuestProgress', JSON.stringify(progress));
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
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Додаємо метод для перемикання режимів
    switchMode(mode) {
        const gameArea = document.querySelector('.game-area');
        const phoneticsZoneElement = document.getElementById('phonetics-zone');
        const modeButtons = document.querySelectorAll('.mode-btn');
        
        // Оновлюємо кнопки
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'learn') {
            // Показуємо фонетичну зону
            gameArea.style.display = 'none';
            phoneticsZoneElement.style.display = 'block';
            
            // Ініціалізуємо фонетичну зону, якщо ще не ініціалізована
            if (!this.phoneticsZoneInitialized) {
                phoneticsZone.init(phoneticsZoneElement);
                this.phoneticsZoneInitialized = true;
            }
        } else {
            // Показуємо ігрову зону
            gameArea.style.display = 'block';
            phoneticsZoneElement.style.display = 'none';
        }
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

// Додаємо функцію для інформаційної кнопки
function setupInfoButton() {
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
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Додаємо індикатор завантаження
    addLoadingIndicator();
    
    // Налаштовуємо інформаційну кнопку
    setupInfoButton();
    
    // Check if browser supports the Web Speech API
    if (!window.speechSynthesis) {
        alert('Ваш браузер не підтримує Web Speech API, необхідний для роботи гри. Спробуйте використовувати Chrome, Edge або Safari.');
        return;
    }

    // Load voices when available
    function loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Start the game
            window.game = new PronunciationQuest();
        } else {
            // Try again
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