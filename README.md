# 🇬🇧 Pronunciation Quest - Інтерактивна Гра для Вивчення Британської Вимови

> Сучасна браузерна гра для українських користувачів, яка допомагає освоїти правильну британську вимову через цікаві завдання та інтерактивні режими навчання.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![Status](https://img.shields.io/badge/status-Active-green.svg)

## 🎯 Опис проєкту

Pronunciation Quest - це освітня браузерна гра, яка допомагає користувачам покращити навички британської вимови через різноманітні інтерактивні завдання. Гра поєднує навчання та розваги, роблячи процес вивчення вимови захоплюючим.

## ✨ Особливості

### 🎯 **Основні Режими**
- **📚 Квіз-режим**: Перевірка знань транскрипції, наголосу та фонетичних категорій
- **🔊 Фонетична зона**: Вивчення британських звуків із прикладами та поясненнями
- **🗣️ Скоромовки**: Тренування вимови з класичними tongue twisters
- **🎴 Флешкарти**: Запам'ятовування слів через візуальні картки
- **📝 Власні слова**: Завантаження та вивчення користувацьких колекцій

### 🚀 **Інноваційні Технології**

#### **Smart Audio Loading System** 🔊
- **Розумне завантаження**: Початкове завантаження 5 слів для швидкого старту
- **Фонове завантаження**: Решта слів завантажується в фоновому режимі
- **Динамічне підвантаження**: Автоматичне завантаження наступних слів під час гри
- **Rate Limiting Protection**: Захист від блокування API з експоненціальними затримками

#### **API Status Monitoring** 📡
- **Візуальний індикатор**: Показує стан завантаження аудіо
- **Rate Limit Warning**: Попередження про обмеження API
- **Error Handling**: Автоматичне перемикання на синтез мови при помилках
- **Real-time Updates**: Оновлення статусу в реальному часі

#### **Advanced Fallback System** 🎤
- **Web Speech API**: Синтез мови для недоступних аудіофайлів
- **Seamless Transition**: Плавний перехід між аудіо та синтезом
- **Error Recovery**: Автоматичне відновлення при мережевих помилках

### 📱 **Адаптивний Дизайн**
- **Mobile-First**: Оптимізовано для мобільних пристроїв
- **Темна тема**: Автоматичне перемикання теми
- **Touch-Friendly**: Зручні елементи управління для сенсорних екранів
- **Cross-Platform**: Працює на всіх сучасних браузерах

### 🔧 **Технічні Особливості**

#### **Архітектура**
```
brausGame-1/
├── assets/
│   ├── js/
│   │   ├── app.js              # Основна логіка гри
│   │   ├── audio-loader.js     # Smart система завантаження аудіо
│   │   ├── phonetics-data.js   # База фонетичних даних
│   │   ├── phonetics-zone.js   # Модуль вивчення звуків
│   │   ├── tongue-twisters.js  # Модуль скоромовок
│   │   ├── custom-words.js     # Система власних слів
│   │   └── debug.js           # Діагностичні інструменти
│   ├── css/
│   │   ├── styles.css         # Основні стилі + темна тема
│   │   └── phonetics-zone.css # Стилі фонетичної зони
│   └── audio/                 # Локальні аудіофайли
└── index.html                 # Головна сторінка
```

#### **API Integration**
- **Dictionary API**: `api.dictionaryapi.dev` для британської вимови
- **Smart Caching**: Локальне кешування для швидкодії
- **Batch Processing**: Завантаження по 2 слова одночасно
- **Error Resilience**: Обробка 429, 404, CORS помилок

#### **Performance Optimizations**
- **Lazy Loading**: Завантаження тільки необхідних ресурсів
- **Progressive Enhancement**: Покрокове покращення функціональності
- **Memory Management**: Ефективне використання пам'яті
- **Network Optimization**: Мінімізація мережевих запитів

## 🎮 Як Користуватися

### 🚀 **Швидкий Старт**
1. Відкрийте `index.html` у браузері або запустіть локальний сервер
2. Виберіть режим навчання на головному екрані
3. Оберіть рівень складності (Початковий/Середній/Просунутий)
4. Слухайте слова та відповідайте на запитання
5. Відстежуйте прогрес та розблоковуйте досягнення

### 📝 **Робота з Власними Словами**

#### **Завантаження Колекцій**
```
Формат файлу (.txt або .csv):
word,transcription,translation
apple,/ˈæpl/,яблуко
water,/ˈwɔːtə/,вода
beautiful,/ˈbjuːtɪfl/,красивий
```

#### **Створення Посилань**
1. Перейдіть до розділу "Власні слова"
2. Завантажте файл або введіть слова вручну
3. Натисніть "Створити посилання для поділу"
4. Скопіюйте URL та поділіться з друзями

#### **Управління Колекціями**
- **Додавання**: Завантаження файлів або ручне введення
- **Редагування**: Зміна існуючих колекцій
- **Видалення**: Очищення небажаних колекцій
- **Вивчення**: Інтеграція з основними режимами гри

### 🎯 **Режими Навчання**

#### **Квіз (Quiz Mode)**
- **Транскрипція**: Оберіть правильну фонетичну транскрипцію
- **Наголос**: Визначте склад з основним наголосом
- **Звукові категорії**: Класифікуйте звуки за типами

#### **Фонетична Зона (Phonetics Zone)**
- **Голосні звуки**: Короткі, довгі, дифтонги, центральні
- **Приголосні**: Проривні, фрикативні, африкати, носові
- **Інтерактивні приклади**: Слухайте та повторюйте

#### **Скоромовки (Tongue Twisters)**
- **Класичні**: "She sells seashells", "Red lorry, yellow lorry"
- **Регульована швидкість**: Повільно → Нормально → Швидко
- **Поступове навчання**: Від простих до складних

#### **Флешкарти (Flashcards)**
- **Візуальне запам'ятовування**: Слово → Транскрипція → Переклад
- **Інтерактивний режим**: Показати/Приховати інформацію
- **Прогресивне вивчення**: Автоматична зміна карток

## 🛠️ Технічні Деталі

### **Smart Audio Loading Algorithm**
```javascript
// Початкове завантаження (швидкий старт)
Initial Batch: 5 words (immediate gameplay)
└── API requests: 2 concurrent, 1s delays

// Фонове завантаження (без блокування UI)
Background Loading: Remaining words
├── Batch size: 3 words
├── Delays: 3 seconds between batches
└── Progressive: Lower priority

// Динамічне завантаження (під час гри)
Dynamic Preloading: Next 3 words
├── Triggered: On word change
├── Background: 500ms delay
└── Cache-aware: Skip loaded words
```

### **Rate Limiting Protection**
```javascript
// Виявлення rate limiting
HTTP 429 Response → Rate Limit Detected
├── Exponential Backoff: 1s, 2s, 4s, 8s
├── Status Update: Visual indicator
└── Automatic Recovery: Resume when clear

// Fallback Strategy
API Unavailable → Speech Synthesis
├── Web Speech API integration
├── British voice preference
└── Seamless transition
```

### **Error Handling Strategy**
```javascript
Network Errors:
├── 404: Word not found → Try synthesis
├── 429: Rate limit → Wait and retry
├── CORS: Browser block → Use fallback
└── Timeout: Slow response → Cancel and fallback

Recovery Actions:
├── Cache failed requests (prevent repeat)
├── Update UI status indicators
├── Maintain game flow continuity
└── Log for debugging
```

## 📊 Статистика Проекту

### **Контент**
- **1000+** слів у базі даних
- **50+** фонетичних символів з поясненнями
- **12** класичних скоромовок
- **3** рівні складності (A2-B1, B1-B2, B2-C1)
- **8** типів звукових категорій

### **Технічні Метрики**
- **~100ms** час відгуку локальних аудіо
- **<2s** час початкового завантаження
- **95%+** успішність API запитів (з fallback)
- **Мобільна адаптивність**: 100% viewport coverage

### **Підтримувані Формати**
- **Аудіо**: MP3, WAV, OGG (локальні файли)
- **API**: Dictionary API (dictionaryapi.dev)
- **Імпорт**: TXT, CSV (UTF-8)
- **Браузери**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🔮 Майбутні Покращення

### **Planned Features v2.0**
- [ ] **Offline Mode**: Повна підтримка офлайн режиму
- [ ] **Voice Recognition**: Розпізнавання та оцінка вимови користувача
- [ ] **Adaptive Learning**: ШІ-система для персоналізованого навчання
- [ ] **Multiplayer Mode**: Змагання з друзями в реальному часі
- [ ] **Advanced Analytics**: Детальна статистика прогресу
- [ ] **Custom Phonetics**: Створення власних фонетичних вправ

### **Technical Roadmap**
- [ ] **PWA Support**: Progressive Web App з офлайн функціональністю
- [ ] **WebRTC Integration**: P2P зв'язок для мультиплеєра
- [ ] **IndexedDB**: Локальна база даних для офлайн режиму
- [ ] **Service Worker**: Кешування ресурсів та офлайн підтримка

## 🤝 Внесок у Проект

### **Для Розробників**
```bash
# Клонування репозиторію
git clone https://github.com/fem10da/brausGame.git
cd brausGame

# Запуск локального серверу
python3 -m http.server 8000
# або
npx serve .

# Відкрийте http://localhost:8000
```

### **Структура Коду**
- **ES6+ Modules**: Модульна архітектура
- **Async/Await**: Сучасний асинхронний код
- **CSS Custom Properties**: Змінні для тем
- **Progressive Enhancement**: Поступове покращення

### **Гайдлайни**
- Використовуйте украй англійські коментарі для коду
- Підтримуйте мобільну адаптивність
- Тестуйте на різних браузерах
- Оптимізуйте продуктивність



## 📞 Контакти та Підтримка

- **GitHub**: [fem10da/brausGame](https://github.com/fem10da/brausGame)
- **Демо**: [Live Demo](https://fem10da.github.io/brausGame)
- **Issues**: [Report Bugs](https://github.com/fem10da/brausGame/issues)

---

<div align="center">

**🎯 Зроблено з ❤️ для українських студентів**

*Вивчайте британську вимову легко та з задоволенням!*

![British Flag](https://img.shields.io/badge/🇬🇧-British_English-red.svg)
![Ukrainian Support](https://img.shields.io/badge/🇺🇦-Ukrainian_Interface-blue.svg)

</div> 