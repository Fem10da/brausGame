/**
 * Фонетичні дані для британської вимови
 * Містить звуки, приклади слів та пояснення для гри Pronunciation Quest
 */

// Голосні звуки
export const vowelSounds = [
    {
        id: 'short-vowels',
        name: 'Короткі голосні',
        description: 'Короткі, чіткі звуки, що вимовляються швидко',
        sounds: [
            { 
                symbol: 'ɪ', 
                examples: ['ship', 'bit', 'fish'],
                description: 'Коротке "і", трохи відкритіше ніж в українській',
                audioUrl: null
            },
            { 
                symbol: 'e', 
                examples: ['bed', 'head', 'many'],
                description: 'Коротке "е", як в українському "мед"',
                audioUrl: null
            },
            { 
                symbol: 'æ', 
                examples: ['cat', 'hat', 'bad'],
                description: 'Щось середнє між "е" та "а", вимовляється з відкритим ротом',
                audioUrl: null
            },
            { 
                symbol: 'ʌ', 
                examples: ['cup', 'love', 'but'],
                description: 'Подібно до короткого "а" в українському "так"',
                audioUrl: null
            },
            { 
                symbol: 'ʊ', 
                examples: ['book', 'put', 'foot'],
                description: 'Коротке "у", трохи відкритіше ніж в українській',
                audioUrl: null
            },
            { 
                symbol: 'ɒ', 
                examples: ['hot', 'clock', 'box'],
                description: 'Коротке відкрите "о"',
                audioUrl: null
            }
        ]
    },
    {
        id: 'long-vowels',
        name: 'Довгі голосні',
        description: 'Витягнуті звуки, що вимовляються протяжно',
        sounds: [
            { 
                symbol: 'iː', 
                examples: ['sheep', 'me', 'tree'],
                description: 'Довге "і", як в українському "ліс"',
                audioUrl: null
            },
            { 
                symbol: 'ɑː', 
                examples: ['car', 'father', 'heart'],
                description: 'Довге "а", як в українському "так", але протяжніше',
                audioUrl: null
            },
            { 
                symbol: 'ɔː', 
                examples: ['door', 'saw', 'more'],
                description: 'Довге "о", як в українському "дóвгий"',
                audioUrl: null
            },
            { 
                symbol: 'uː', 
                examples: ['blue', 'food', 'moon'],
                description: 'Довге "у", як в українському "суп"',
                audioUrl: null
            },
            { 
                symbol: 'ɜː', 
                examples: ['bird', 'word', 'nurse'],
                description: 'Довгий звук, якого немає в українській, щось середнє між "е" та "о"',
                audioUrl: null
            }
        ]
    },
    {
        id: 'diphthongs',
        name: 'Дифтонги',
        description: 'Звуки, що складаються з двох голосних і вимовляються як один',
        sounds: [
            { 
                symbol: 'eɪ', 
                examples: ['face', 'day', 'make'],
                description: 'Як українське "ей"',
                audioUrl: null
            },
            { 
                symbol: 'aɪ', 
                examples: ['price', 'time', 'like'],
                description: 'Як українське "ай"',
                audioUrl: null
            },
            { 
                symbol: 'ɔɪ', 
                examples: ['choice', 'boy', 'noise'],
                description: 'Як українське "ой"',
                audioUrl: null
            },
            { 
                symbol: 'əʊ', 
                examples: ['goat', 'show', 'know'],
                description: 'Як українське "оу"',
                audioUrl: null
            },
            { 
                symbol: 'aʊ', 
                examples: ['mouth', 'now', 'down'],
                description: 'Як українське "ау"',
                audioUrl: null
            },
            { 
                symbol: 'ɪə', 
                examples: ['near', 'here', 'fear'],
                description: 'Як українське "іе"',
                audioUrl: null
            },
            { 
                symbol: 'eə', 
                examples: ['square', 'care', 'air'],
                description: 'Як українське "ее"',
                audioUrl: null
            },
            { 
                symbol: 'ʊə', 
                examples: ['tour', 'pure', 'cure'],
                description: 'Як українське "уе"',
                audioUrl: null
            }
        ]
    },
    {
        id: 'central-vowels',
        name: 'Центральні звуки',
        description: 'Нейтральні звуки в ненаголошених складах',
        sounds: [
            { 
                symbol: 'ə', 
                examples: ['about', 'teacher', 'colour'],
                description: 'Нейтральний звук "шва", короткий ненаголошений',
                audioUrl: null
            }
        ]
    }
];

// Приголосні звуки
export const consonantSounds = [
    {
        id: 'plosives',
        name: 'Проривні',
        description: 'Звуки, що утворюються проривом повітря',
        sounds: [
            { 
                symbol: 'p', 
                examples: ['pen', 'happy', 'stop'],
                description: 'Як українське "п", але з придихом',
                audioUrl: null
            },
            { 
                symbol: 'b', 
                examples: ['bad', 'bubble', 'job'],
                description: 'Як українське "б"',
                audioUrl: null
            },
            { 
                symbol: 't', 
                examples: ['tea', 'button', 'sit'],
                description: 'Як українське "т", але з придихом',
                audioUrl: null
            },
            { 
                symbol: 'd', 
                examples: ['day', 'ladder', 'had'],
                description: 'Як українське "д"',
                audioUrl: null
            },
            { 
                symbol: 'k', 
                examples: ['key', 'cricket', 'back'],
                description: 'Як українське "к", але з придихом',
                audioUrl: null
            },
            { 
                symbol: 'g', 
                examples: ['get', 'bigger', 'dog'],
                description: 'Як українське "г"',
                audioUrl: null
            }
        ]
    },
    {
        id: 'fricatives',
        name: 'Фрикативні',
        description: 'Звуки, що утворюються тертям повітряного струменя',
        sounds: [
            { 
                symbol: 'f', 
                examples: ['fat', 'coffee', 'safe'],
                description: 'Як українське "ф"',
                audioUrl: null
            },
            { 
                symbol: 'v', 
                examples: ['van', 'diving', 'love'],
                description: 'Як українське "в"',
                audioUrl: null
            },
            { 
                symbol: 'θ', 
                examples: ['thin', 'author', 'bath'],
                description: 'Міжзубний глухий звук (кінчик язика між зубами)',
                audioUrl: null
            },
            { 
                symbol: 'ð', 
                examples: ['this', 'mother', 'breathe'],
                description: 'Міжзубний дзвінкий звук (кінчик язика між зубами)',
                audioUrl: null
            },
            { 
                symbol: 's', 
                examples: ['sun', 'passing', 'bus'],
                description: 'Як українське "с"',
                audioUrl: null
            },
            { 
                symbol: 'z', 
                examples: ['zoo', 'lazy', 'jazz'],
                description: 'Як українське "з"',
                audioUrl: null
            },
            { 
                symbol: 'ʃ', 
                examples: ['ship', 'fashion', 'fish'],
                description: 'Як українське "ш"',
                audioUrl: null
            },
            { 
                symbol: 'ʒ', 
                examples: ['measure', 'vision', 'beige'],
                description: 'Як українське "ж"',
                audioUrl: null
            },
            { 
                symbol: 'h', 
                examples: ['hat', 'behind', 'hello'],
                description: 'Як український звук "х", але слабший',
                audioUrl: null
            }
        ]
    },
    {
        id: 'affricates',
        name: 'Африкати',
        description: 'Звуки, що складаються з проривного та фрикативного елементів',
        sounds: [
            { 
                symbol: 'tʃ', 
                examples: ['cheap', 'catch', 'church'],
                description: 'Як українське "ч"',
                audioUrl: null
            },
            { 
                symbol: 'dʒ', 
                examples: ['jump', 'bridge', 'age'],
                description: 'Як українське "дж"',
                audioUrl: null
            }
        ]
    },
    {
        id: 'nasals',
        name: 'Носові',
        description: 'Звуки, при яких повітря проходить через ніс',
        sounds: [
            { 
                symbol: 'm', 
                examples: ['man', 'hammer', 'time'],
                description: 'Як українське "м"',
                audioUrl: null
            },
            { 
                symbol: 'n', 
                examples: ['no', 'sunny', 'ten'],
                description: 'Як українське "н"',
                audioUrl: null
            },
            { 
                symbol: 'ŋ', 
                examples: ['sing', 'finger', 'uncle'],
                description: 'Як "н" в українському "танк", але більш задньоязиковий',
                audioUrl: null
            }
        ]
    },
    {
        id: 'approximants',
        name: 'Апроксиманти',
        description: 'Звуки, що утворюються наближенням органів мовлення',
        sounds: [
            { 
                symbol: 'l', 
                examples: ['light', 'yellow', 'call'],
                description: 'Як українське "л", але більш м\'яке',
                audioUrl: null
            },
            { 
                symbol: 'r', 
                examples: ['right', 'sorry', 'car'],
                description: 'Як українське "р", але без вібрації',
                audioUrl: null
            },
            { 
                symbol: 'j', 
                examples: ['yes', 'yellow', 'you'],
                description: 'Як українське "й"',
                audioUrl: null
            },
            { 
                symbol: 'w', 
                examples: ['we', 'away', 'wow'],
                description: 'Губно-губний звук, щось середнє між "в" і "у"',
                audioUrl: null
            }
        ]
    }
];

// Скоромовки
export const tongueTwisters = [
    {
        text: "She sells seashells by the seashore",
        difficulty: "medium",
        focusSound: "ʃ",
        translation: "Вона продає морські мушлі на березі моря"
    },
    {
        text: "Red lorry, yellow lorry",
        difficulty: "medium",
        focusSound: "l, r",
        translation: "Червона вантажівка, жовта вантажівка"
    },
    {
        text: "The sixth sick sheik's sixth sheep's sick",
        difficulty: "hard",
        focusSound: "s, ʃ",
        translation: "Шоста хвора вівця шостого хворого шейха хвора"
    },
    {
        text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        difficulty: "hard",
        focusSound: "w, tʃ",
        translation: "Скільки деревини міг би кинути бабак, якби бабак міг кидати деревину?"
    },
    {
        text: "Peter Piper picked a peck of pickled peppers",
        difficulty: "medium",
        focusSound: "p",
        translation: "Пітер Пайпер зібрав мішечок маринованих перців"
    },
    {
        text: "Unique New York",
        difficulty: "easy",
        focusSound: "j, n",
        translation: "Унікальний Нью-Йорк"
    },
    {
        text: "Betty bought a bit of better butter",
        difficulty: "medium",
        focusSound: "b, t",
        translation: "Бетті купила трохи кращого масла"
    },
    {
        text: "Rural juror",
        difficulty: "hard",
        focusSound: "r",    
        translation: "Сільський суддя"
    },
    {
        text: "The quick brown fox jumps over the lazy dog",
        difficulty: "hard",
        focusSound: "f, w, tʃ, dʒ",
        translation: "Швидкий коричневий лисиця перестрибує через ледачу собаку"
    },
    {
        text: "The old silent pond",
        difficulty: "medium",
        focusSound: "s, t",
        translation: "Старий тихий ставок"
    },
    {
        text: "A frog jumps into the pond",
        difficulty: "medium",
        focusSound: "f, p", 
        translation: "Жаба стрибає в ставок"
    },
    {
        text: "The old pond",
        difficulty: "medium",
        focusSound: "p",
        translation: "Старий ставок"
    }
]