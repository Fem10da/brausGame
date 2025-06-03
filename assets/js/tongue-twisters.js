/**
 * Модуль з даними скоромовок та їх аудіо
 */

const tongueTwistersData = [
    {
        id: 1,
        text: "She sells seashells by the seashore",
        audioBase64: null, // буде заповнено справжніми даними
        audioPath: "assets/audio/tongue-twisters/she-sells-seashells.mp3", // шлях до локального аудіо
        tips: [
            "Зосередьтеся на звуку 'sh' у словах 'she', 'shells', 'seashore'",
            "Чергуйте 's' та 'sh' звуки чітко"
        ]
    },
    {
        id: 2,
        text: "Red lorry, yellow lorry",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/red-lorry.mp3",
        tips: [
            "Зверніть увагу на перехід від 'r' до 'l'",
            "Вимовляйте 'lorry' з чітким британським 'o'"
        ]
    },
    {
        id: 3,
        text: "The sixth sick sheik's sixth sheep's sick",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/sixth-sick-sheik.mp3",
        tips: [
            "Вимовляйте 'sixth' з 'th' в кінці",
            "Чергуйте 's' та 'sh' звуки"
        ]
    },
    {
        id: 4,
        text: "How much wood would a woodchuck chuck",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/woodchuck.mp3",
        tips: [
            "Зосередьтеся на звуку 'w' в словах 'wood', 'would', 'woodchuck'",
            "Чітко вимовляйте 'ch' в 'chuck'"
        ]
    },
    {
        id: 5,
        text: "Peter Piper picked a peck of pickled peppers",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/peter-piper.mp3",
        tips: [
            "Вимовляйте 'p' з невеликим видихом",
            "Стежте за ритмом всієї фрази"
        ]
    },
    {
        id: 6,
        text: "Betty bought a bit of better butter",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/betty-bought.mp3",
        tips: [
            "Чітко вимовляйте 't' в 'better' та 'butter'",
            "Британська вимова 'butter' відрізняється від американської"
        ]
    },
    {
        id: 7,
        text: "Swan swam over the sea, swim swan swim",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/swan-swam.mp3",
        tips: [
            "Вимовляйте 'sw' як один звук",
            "Зосередьтеся на різниці між 'swam' та 'swim'"
        ]
    },
    {
        id: 8,
        text: "Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair",
        audioBase64: null,
        audioPath: "assets/audio/tongue-twisters/fuzzy-wuzzy.mp3",
        tips: [
            "Вимовляйте 'z' звуки чітко",
            "Зберігайте ритм у повторенні 'Fuzzy Wuzzy'"
        ]
    }
];

export default tongueTwistersData; 