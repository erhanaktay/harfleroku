/* ============================================
   HARF CANAVARI - OYUN MOTORU v2.0
   Türkçe harf öğrenme oyunu - 5 yaş için
============================================ */

const WORD_BANK = {
  'A': [
    { emoji: '🐝', display: 'Arı'      },
    { emoji: '🌙', display: 'Ay'       },
    { emoji: '🐻', display: 'Ayı'      },
    { emoji: '🚗', display: 'Araba'    },
    { emoji: '🔑', display: 'Anahtar'  },
    { emoji: '🦁', display: 'Aslan'    },
    { emoji: '🌳', display: 'Ağaç'     },
    { emoji: '🐙', display: 'Ahtapot'  },
  ],
  'E': [
    { emoji: '🏠', display: 'Ev'       },
    { emoji: '🍞', display: 'Ekmek'    },
    { emoji: '👋', display: 'El'       },
    { emoji: '🫏', display: 'Eşek'     },
    { emoji: '🧤', display: 'Eldiven'  },
    { emoji: '🌸', display: 'Elbise'   },
  ],
  'İ': [
    { emoji: '🐕', display: 'İt'       },
    { emoji: '🐄', display: 'İnek'     },
    { emoji: '🪡', display: 'İğne'     },
    { emoji: '🏙️', display: 'İstanbul' },
    { emoji: '🧵', display: 'İplik'    },
  ],
  'O': [
    { emoji: '🏫', display: 'Okul'     },
    { emoji: '🏹', display: 'Ok'       },
    { emoji: '🎮', display: 'Oyun'     },
    { emoji: '🌊', display: 'Okyanus'  },
    { emoji: '👦', display: 'Oğlan'    },
  ],
  'U': [
    { emoji: '✈️', display: 'Uçak'     },
    { emoji: '😴', display: 'Uyku'     },
    { emoji: '🧶', display: 'Urgan'    },
    { emoji: '🌫️', display: 'Ufuk'     },
  ],
  'B': [
    { emoji: '🐟', display: 'Balık'    },
    { emoji: '🎈', display: 'Balon'    },
    { emoji: '🌸', display: 'Bahçe'    },
    { emoji: '🎨', display: 'Boya'     },
    { emoji: '🐻', display: 'Bozayı'   },
    { emoji: '🔪', display: 'Bıçak'    },
  ],
  'K': [
    { emoji: '🐱', display: 'Kedi'     },
    { emoji: '🦋', display: 'Kelebek'  },
    { emoji: '🍒', display: 'Kiraz'    },
    { emoji: '🐸', display: 'Kurbağa'  },
    { emoji: '🐑', display: 'Kuzu'     },
    { emoji: '🌹', display: 'Karanfil' },
  ],
  'S': [
    { emoji: '🕐', display: 'Saat'     },
    { emoji: '🌅', display: 'Sabah'    },
    { emoji: '🏰', display: 'Saray'    },
    { emoji: '🐟', display: 'Somon'    },
    { emoji: '🎵', display: 'Ses'      },
    { emoji: '🥛', display: 'Süt'      },
  ],
  'T': [
    { emoji: '🚂', display: 'Tren'     },
    { emoji: '🍅', display: 'Domates'  },
    { emoji: '🐔', display: 'Tavuk'    },
    { emoji: '🪥', display: 'Tarak'    },
    { emoji: '🧂', display: 'Tuz'      },
    { emoji: '🐢', display: 'Tırtıl'   },
  ],
  'D': [
    { emoji: '🌊', display: 'Deniz'    },
    { emoji: '🏔️', display: 'Dağ'      },
    { emoji: '🦷', display: 'Diş'      },
    { emoji: '📖', display: 'Defter'   },
    { emoji: '🌀', display: 'Dalga'    },
  ],
  'G': [
    { emoji: '☀️', display: 'Güneş'    },
    { emoji: '🌹', display: 'Gül'      },
    { emoji: '🚢', display: 'Gemi'     },
    { emoji: '👁️', display: 'Göz'      },
    { emoji: '🌃', display: 'Gece'     },
  ],
  'Y': [
    { emoji: '🌠', display: 'Yıldız'   },
    { emoji: '🐍', display: 'Yılan'    },
    { emoji: '🌧️', display: 'Yağmur'   },
    { emoji: '🍽️', display: 'Yemek'    },
    { emoji: '🗺️', display: 'Yol'      },
  ],
};

const LETTER_NAMES = {
  'A': 'A', 'E': 'E', 'İ': 'İ', 'O': 'O', 'U': 'U',
  'B': 'Be', 'K': 'Ka', 'S': 'Se', 'T': 'Te',
  'D': 'De', 'G': 'Ge', 'Y': 'Ye',
};

const LETTERS = Object.keys(WORD_BANK);

const ENCOURAGEMENT_CORRECT = [
  { emoji: '🎉', text: 'Harika!' },
  { emoji: '⭐', text: 'Süper!' },
  { emoji: '🏆', text: 'Aferin!' },
  { emoji: '🌟', text: 'Mükemmel!' },
  { emoji: '🎊', text: 'Bravo!' },
  { emoji: '💪', text: 'Çok iyi!' },
  { emoji: '🥳', text: 'Doğru!' },
];

const ENCOURAGEMENT_WRONG = [
  { emoji: '💙', text: 'Tekrar dene!' },
  { emoji: '🤔', text: 'Neredeyse!' },
  { emoji: '💫', text: 'Olmadı!' },
];

const Game = (() => {
  let mode = 'find';
  let rounds = [];
  let currentRound = 0;
  let score = 0;
  let totalStars = parseInt(localStorage.getItem('harfcanavari_stars') || '0');
  let synth = window.speechSynthesis;
  let turkishVoice = null;
  let currentRoundData = null;
  let answered = false;
  let matchSelectedCard = null;
  const TOTAL_ROUNDS = 8;

  function initVoice() {
    const voices = synth.getVoices();
    turkishVoice = voices.find(v => v.lang && v.lang.startsWith('tr')) || null;
  }

  function speak(text, onEnd) {
    if (!synth) return;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'tr-TR';
    utt.rate = 0.82;
    utt.pitch = 1.1;
    utt.volume = 1;
    if (turkishVoice) utt.voice = turkishVoice;
    if (onEnd) utt.onend = onEnd;
    setTimeout(() => synth.speak(utt), 50);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pick(arr, n) {
    const s = shuffle(arr);
    return (n === undefined || n === 1) ? s[0] : s.slice(0, n);
  }

  function generateRounds(gameMode) {
    const result = [];
    const usedLetters = [];

    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      let letter;
      let tries = 0;
      do {
        letter = pick(LETTERS);
        tries++;
      } while (usedLetters.slice(-3).includes(letter) && tries < 20);
      usedLetters.push(letter);

      if (gameMode === 'match') {
        const matchLetters = [letter];
        const otherLetters = shuffle(LETTERS.filter(l => l !== letter));
        matchLetters.push(...otherLetters.slice(0, 2));

        const pairs = matchLetters.map(l => ({
          letter: l,
          word: pick(WORD_BANK[l]),
        }));

        result.push({ letter, pairs, gameMode, matchedCount: 0, totalPairs: pairs.length });
      } else {
        const correctWords = WORD_BANK[letter];
        const correctWord = pick(correctWords);

        const otherLetters = LETTERS.filter(l => l !== letter);
        const wrongWords = [];
        const usedWL = [];
        let attempts = 0;
        while (wrongWords.length < 3 && attempts < 30) {
          attempts++;
          const wl = pick(otherLetters.filter(l => !usedWL.includes(l)));
          if (!wl) break;
          usedWL.push(wl);
          const w = pick(WORD_BANK[wl]);
          if (w && !w.display.toUpperCase().startsWith(letter)) {
            wrongWords.push({ ...w, isCorrect: false });
          }
        }

        const cards = shuffle([
          { ...correctWord, isCorrect: true },
          ...wrongWords,
        ]);

        result.push({ letter, cards, gameMode });
      }
    }
    return result;
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function updateStarDisplay() {
    document.getElementById('menu-total-stars').textContent = totalStars;
  }

  function saveStars(n) {
    totalStars += n;
    localStorage.setItem('harfcanavari_stars', totalStars);
    updateStarDisplay();
  }

  function updateProgress() {
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${(currentRound / TOTAL_ROUNDS) * 100}%`;
  }

  function renderRound(roundData) {
    answered = false;
    matchSelectedCard = null;
    currentRoundData = roundData;

    document.getElementById('score-stars').textContent = `⭐ ${score}`;
    document.getElementById('round-info').textContent = `${currentRound + 1} / ${TOTAL_ROUNDS}`;
    document.getElementById('feedback-overlay').classList.add('hidden');
    updateProgress();

    if (roundData.gameMode === 'match') {
      renderMatchRound(roundData);
    } else if (roundData.gameMode === 'listen') {
      renderListenRound(roundData);
    } else {
      renderFindRound(roundData);
    }
  }

  function renderFindRound(roundData) {
    const { letter, cards } = roundData;
    document.getElementById('question-letter').textContent = letter;
    document.getElementById('question-text').innerHTML =
      `"<strong style="color:var(--purple);font-family:'Fredoka One',cursive;font-size:1.2em;">${letter}</strong>" harfiyle başlayan kelimeyi bul!`;

    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    grid.className = 'cards-grid';

    cards.forEach((card, idx) => {
      const div = createWordCard(card, idx);
      div.addEventListener('click', () => handleFindAnswer(div, card));
      grid.appendChild(div);
    });

    setTimeout(() => speak(`${LETTER_NAMES[letter]} harfiyle başlayan kelimeyi bul!`), 600);
  }

  function renderListenRound(roundData) {
    const { letter, cards } = roundData;
    document.getElementById('question-letter').textContent = '👂';
    document.getElementById('question-text').innerHTML =
      `Sesi dinle ve doğru kelimeyi seç! <button class="btn-repeat" onclick="Game.speakQuestion()">🔊 Tekrar</button>`;

    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    grid.className = 'cards-grid';

    cards.forEach((card, idx) => {
      const div = createWordCard(card, idx, true); // listen modunda kelime yazısını gizle
      div.addEventListener('click', () => handleFindAnswer(div, card));
      grid.appendChild(div);
    });

    setTimeout(() => speak(`${LETTER_NAMES[letter]} ... ${LETTER_NAMES[letter]} ... ${LETTER_NAMES[letter]} sesiyle başlayan kelime hangisi?`), 500);
  }

  function renderMatchRound(roundData) {
    roundData.matchedCount = 0;
    const { pairs } = roundData;
    document.getElementById('question-letter').textContent = '🎯';
    document.getElementById('question-text').innerHTML = `Harfi doğru kelimeyle eşleştir!`;

    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    grid.className = 'cards-grid match-grid';

    const shuffledLetters = shuffle([...pairs]);
    const shuffledWords = shuffle([...pairs]);

    shuffledLetters.forEach((pair, idx) => {
      const div = document.createElement('div');
      div.className = 'word-card letter-card';
      div.style.animationDelay = `${idx * 0.08}s`;
      div.dataset.letter = pair.letter;
      div.innerHTML = `<span class="match-big-letter">${pair.letter}</span>`;
      div.addEventListener('click', () => handleMatchClick(div, 'letter', pair.letter));
      grid.appendChild(div);
    });

    shuffledWords.forEach((pair, idx) => {
      const div = document.createElement('div');
      div.className = 'word-card';
      div.style.animationDelay = `${(idx + pairs.length) * 0.08}s`;
      div.dataset.letter = pair.letter;
      div.innerHTML = `
        <span class="card-emoji">${pair.word.emoji}</span>
        <span class="card-word">${pair.word.display}</span>
      `;
      div.addEventListener('click', () => handleMatchClick(div, 'word', pair.letter));
      grid.appendChild(div);
    });

    setTimeout(() => speak('Harfi kelimeyle eşleştir!'), 600);
  }

  function createWordCard(card, idx, hideWord) {
    const div = document.createElement('div');
    div.className = 'word-card';
    div.style.animationDelay = `${idx * 0.08}s`;
    div.innerHTML = `
      <span class="card-emoji">${card.emoji}</span>
      ${hideWord ? '' : `<span class="card-word">${card.display}</span>`}
      <button class="card-listen-btn" onclick="Game.speakWord('${card.display}', event)">🔊</button>
    `;
    return div;
  }

  function handleFindAnswer(cardEl, card) {
    if (answered) return;
    answered = true;
    document.querySelectorAll('.word-card').forEach(c => c.classList.add('disabled'));

    if (card.isCorrect) {
      cardEl.classList.add('correct');
      score++;
      document.getElementById('score-stars').textContent = `⭐ ${score}`;
      const enc = pick(ENCOURAGEMENT_CORRECT);
      showFeedback(enc.emoji, enc.text, true);
      speak(`${enc.text} ${card.display} doğru!`);
    } else {
      cardEl.classList.add('wrong');
      const enc = pick(ENCOURAGEMENT_WRONG);
      showFeedback(enc.emoji, enc.text, false);
      setTimeout(() => {
        const allCards = document.querySelectorAll('.word-card');
        currentRoundData.cards.forEach((c, i) => {
          if (c.isCorrect && allCards[i]) allCards[i].classList.add('correct');
        });
      }, 300);
      const correctWord = currentRoundData.cards.find(c => c.isCorrect);
      speak(`Olmadı! ${correctWord ? correctWord.display : ''} doğruydu.`);
    }

    setTimeout(() => nextRound(), 2200);
  }

  function handleMatchClick(cardEl, type, letter) {
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('disabled')) return;

    if (!matchSelectedCard) {
      matchSelectedCard = { el: cardEl, type, letter };
      cardEl.classList.add('selected');
    } else {
      const prev = matchSelectedCard;
      matchSelectedCard = null;
      prev.el.classList.remove('selected');

      if (prev.el === cardEl) return;

      if (prev.type === type) {
        // Aynı tür - geçersiz
        cardEl.classList.add('wrong-flash');
        setTimeout(() => cardEl.classList.remove('wrong-flash'), 500);
        return;
      }

      if (prev.letter === letter) {
        prev.el.classList.add('matched', 'correct', 'disabled');
        cardEl.classList.add('matched', 'correct', 'disabled');
        currentRoundData.matchedCount++;

        const enc = pick(ENCOURAGEMENT_CORRECT);
        speak(enc.text);

        if (currentRoundData.matchedCount >= currentRoundData.totalPairs) {
          score++;
          document.getElementById('score-stars').textContent = `⭐ ${score}`;
          showFeedback('🎉', 'Tümünü buldun!', true);
          speak('Harika! Tümünü eşleştirdin!');
          setTimeout(() => nextRound(), 2000);
        }
      } else {
        prev.el.classList.add('wrong-flash');
        cardEl.classList.add('wrong-flash');
        setTimeout(() => {
          prev.el.classList.remove('wrong-flash');
          cardEl.classList.remove('wrong-flash');
        }, 600);
        speak('Olmadı, tekrar dene!');
      }
    }
  }

  function showFeedback(emoji, text, isCorrect) {
    const overlay = document.getElementById('feedback-overlay');
    const box = document.getElementById('feedback-box');
    document.getElementById('feedback-emoji').textContent = emoji;
    document.getElementById('feedback-text').textContent = text;
    box.style.borderTop = `5px solid ${isCorrect ? 'var(--green)' : '#EF4444'}`;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 1600);
  }

  function speakQuestion() {
    if (!currentRoundData) return;
    const { letter, gameMode } = currentRoundData;
    if (gameMode === 'match') {
      speak('Harfleri kelimelerle eşleştir!');
    } else if (gameMode === 'listen') {
      speak(`${LETTER_NAMES[letter]} ... ${LETTER_NAMES[letter]} ... ${LETTER_NAMES[letter]} sesiyle başlayan kelime hangisi?`);
    } else {
      speak(`${LETTER_NAMES[letter]} harfiyle başlayan kelimeyi bul!`);
    }
  }

  function speakWord(word, e) {
    e && e.stopPropagation();
    speak(word);
  }

  function nextRound() {
    currentRound++;
    if (currentRound >= TOTAL_ROUNDS) {
      endGame();
    } else {
      renderRound(rounds[currentRound]);
    }
  }

  function endGame() {
    saveStars(score);
    showResultScreen();
  }

  function showResultScreen() {
    showScreen('screen-result');
    const pct = score / TOTAL_ROUNDS;
    let trophy, title, msg;
    if (pct >= 0.875) {
      trophy = '🏆'; title = 'Mükemmel!';
      msg = 'Tüm soruları doğru yaptın! Sen gerçek bir Harf Canavarısın! 🎉';
    } else if (pct >= 0.625) {
      trophy = '🌟'; title = 'Çok İyi!';
      msg = 'Harika iş çıkardın! Biraz daha pratik yapalım!';
    } else if (pct >= 0.375) {
      trophy = '👍'; title = 'Güzel!';
      msg = 'Devam et! Her gün daha iyi oluyorsun!';
    } else {
      trophy = '💙'; title = 'Denemeye Devam!';
      msg = 'Harfler zaman alır! Sen yaparsın!';
    }

    document.getElementById('result-trophy').textContent = trophy;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-msg').textContent = msg;
    const scoreEl = document.getElementById('result-score');
    if (scoreEl) scoreEl.textContent = `${score} / ${TOTAL_ROUNDS} doğru`;

    const starsEl = document.getElementById('result-stars');
    starsEl.textContent = '⭐'.repeat(score) + '☆'.repeat(TOTAL_ROUNDS - score);

    setTimeout(() => speak(`${title} ${score} doğru yaptın! Tebrikler!`), 400);
    spawnConfetti();
  }

  function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#7C3AED','#EC4899','#F59E0B','#10B981','#0EA5E9','#F97316'];
    for (let i = 0; i < 60; i++) {
      const div = document.createElement('div');
      div.className = 'confetti-piece';
      div.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -20px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(div);
    }
  }

  function startGame(gameMode) {
    mode = gameMode;
    score = 0;
    currentRound = 0;
    matchSelectedCard = null;
    rounds = generateRounds(gameMode);
    showScreen('screen-game');

    const modeLabels = { find: '🔍 Sesi Bul', match: '🎯 Eşleştir', listen: '👂 Dinle & Seç' };
    const ml = document.getElementById('mode-label');
    if (ml) ml.textContent = modeLabels[gameMode] || '';

    renderRound(rounds[0]);
  }

  function goMenu() {
    synth && synth.cancel();
    showScreen('screen-menu');
    updateStarDisplay();
  }

  function playAgain() { startGame(mode); }

  function init() {
    if (synth && synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = initVoice;
    }
    initVoice();
    updateStarDisplay();
  }

  document.addEventListener('DOMContentLoaded', init);
  return { startGame, goMenu, playAgain, speakQuestion, speakWord };
})();
