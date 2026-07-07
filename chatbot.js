(function () {
  const p = PERSONA;
  let lang = "ko";

  const els = {
    toggle: document.getElementById("chatToggle"),
    panel: document.getElementById("chatPanel"),
    close: document.getElementById("chatClose"),
    messages: document.getElementById("chatMessages"),
    form: document.getElementById("chatForm"),
    input: document.getElementById("chatInput"),
    quickReplies: document.getElementById("chatQuickReplies"),
  };

  function detectLang(text) {
    if (/^(hi|hello|hey|what|who|tell|project|skill|contact)/i.test(text.trim())) return "en";
    if (/^(hallo|guten|wer|was|projekt)/i.test(text.trim())) return "de";
    return "ko";
  }

  function addMessage(content, role, typing) {
    const wrap = document.createElement("div");
    wrap.className = `chat-msg chat-msg--${role}`;
    if (typing) {
      wrap.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    } else {
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = content.replace(/\n/g, "<br>");
      wrap.appendChild(bubble);
    }
    els.messages.appendChild(wrap);
    els.messages.scrollTop = els.messages.scrollHeight;
    return wrap;
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function reply(text) {
    const typing = addMessage("", "bot", true);
    await delay(500 + Math.random() * 400);
    typing.remove();
    addMessage(text, "bot");
  }

  function formatProjects() {
    return p.projects
      .map(
        (proj) =>
          `• <strong>${proj.title}</strong> (${proj.period})\n  ${proj.summary}\n  역할: ${proj.role}\n  기술: ${proj.tech.join(", ")}`
      )
      .join("\n\n");
  }

  function formatEducation() {
    const ex = p.education.exchanges
      .map((e) => `  · ${e.year} ${e.season} — ${e.place}: ${e.program}`)
      .join("\n");
    return `${p.education.university} (${p.education.period})\n${p.education.major}\n${p.education.note}\n\n🌍 해외 경험:\n${ex}`;
  }

  function formatSkills() {
    const langs = p.skills.languages.map((l) => `${l.lang}(${l.level})`).join(", ");
    return (
      `💻 Programming: ${p.skills.programming.join(", ")}\n` +
      `🤖 AI & Data: ${p.skills.ai_data.join(", ")}\n` +
      `🎨 Design & UX: ${p.skills.design.join(", ")}\n` +
      `📊 Business & Tools: ${p.skills.business_tools.join(", ")}\n` +
      `🌐 Languages: ${langs}`
    );
  }

  function matchIntent(input) {
    const t = input.toLowerCase().trim();

    if (/^(안녕|하이|hello|hi|hey|hallo|guten)/.test(t)) return "greeting";
    if (/프로젝트|project|projekt|tassie|뷰티|가상자산|bus stop|버스/.test(t)) return "projects";
    if (/기술|스킬|skill|python|react|프로그래|tech|stack/.test(t)) return "skills";
    if (/학력|학교|교환|education|university|성균|intern/.test(t)) return "education";
    if (/성격|가치|personality|value|도전|마인드/.test(t)) return "personality";
    if (/연락|contact|email|메일|github|linkedin/.test(t)) return "contact";
    if (/영어|english|en\b/.test(t)) return "switch_en";
    if (/독일|german|deutsch|de\b/.test(t)) return "switch_de";
    if (/한국|korean|ko\b|한글/.test(t)) return "switch_ko";
    if (/소개|who|누구|about|자기/.test(t)) return "about";
    if (/멋쟁|동아리|밴드|club/.test(t)) return "clubs";
    if (/실패|피드백|feedback|fail/.test(t)) return "growth";
    if (/ai|머신|ml|데이터|data|분석/.test(t)) return "ai";
    if (/ux|디자인|figma|사용자/.test(t)) return "ux";
    if (/비즈|전략|strategy|esg|금융/.test(t)) return "business";
    return "fallback";
  }

  function getResponse(intent) {
    const responses = {
      greeting: {
        ko: `${p.greetings.ko}\n\n아래 버튼으로 빠르게 질문하실 수도 있어요!`,
        en: p.greetings.en,
        de: p.greetings.de,
      },
      about: {
        ko: `"${p.quote}"\n\n${p.description}\n\n핵심 가치: ${p.personality.core_values.join(", ")}`,
        en: `"${p.quote}"\n\nI'm passionate about turning ideas into visible results across data, service planning, and AI. Core values: challenge, learning, connection, collaboration, flexibility.`,
        de: `Ich liebe es, Ideen in sichtbare Ergebnisse zu verwandeln – besonders an der Schnittstelle von Daten, Service-Planung und KI.`,
      },
      projects: {
        ko: `제가 진행한 주요 프로젝트예요!\n\n${formatProjects()}\n\n더 자세히 알고 싶은 프로젝트가 있으면 이름을 말씀해 주세요.`,
        en: `Here are my main projects:\n\n${formatProjects()}`,
        de: `Meine Hauptprojekte:\n\n${formatProjects()}`,
      },
      skills: {
        ko: `제 스킬 셋트예요!\n\n${formatSkills()}\n\n재미있어 보이는 기술이라면 바로 도전해 보는 편이에요 😊`,
        en: `My skill set:\n\n${formatSkills()}`,
        de: `Meine Fähigkeiten:\n\n${formatSkills()}`,
      },
      education: {
        ko: `📚 학력 & 해외 경험\n\n${formatEducation()}`,
        en: `Education & exchanges:\n\n${formatEducation()}`,
        de: `Ausbildung:\n\n${formatEducation()}`,
      },
      personality: {
        ko: `저의 핵심 가치는 이렇게 정리할 수 있어요:\n\n• 도전 정신 — 재미있어 보이면 일단 도전!\n• 학습 지향 — 평생 배워도 배울 게 남아 있다고 믿어요\n• 연결 감각 — 다양한 분야를 융합해 새 아이디어를 만들어요\n• 협업 친화 — 팀 프로젝트에서 소통과 협력을 중요하게 생각해요\n• 유연함 — 해외 경험으로 문화에 빠르게 적응해요`,
        en: `My core values: challenge, lifelong learning, connecting diverse experiences, collaboration, and cultural adaptability from my time abroad.`,
        de: `Meine Kernwerte: Mut, Lernbereitschaft, Verbindung verschiedener Erfahrungen, Teamarbeit und kulturelle Flexibilität.`,
      },
      clubs: {
        ko: `동아리 활동도 열심히 했어요!\n\n• 프로그래밍 동아리 '멋쟁이사자처럼' — 2년\n• 교내 밴드 동아리 — 베이스, 2년\n\n코딩과 음악, 둘 다 점처럼 이어져 지금의 저를 만들었어요 🎸`,
        en: `Club activities: 2 years in programming club (Likelion) and 2 years playing bass in a campus band!`,
        de: `Vereinsaktivitäten: 2 Jahre Programmier-Club und 2 Jahre Bass in einer Band.`,
      },
      contact: {
        ko: `연락은 아래 방법으로 가능해요!\n\n📧 Email: seeun.kim@example.com\n💻 GitHub: github.com/kimseeun\n💼 LinkedIn: linkedin.com/in/kimseeun\n\n페이지 하단 Contact 섹션도 확인해 주세요!`,
        en: `You can reach me via:\n📧 seeun.kim@example.com\n💻 github.com/kimseeun\n💼 linkedin.com/in/kimseeun`,
        de: `Kontakt:\n📧 seeun.kim@example.com\n💻 github.com/kimseeun`,
      },
      ai: {
        ko: `AI·데이터 분야에서 TassieBirdAI 해커톤(호주)에서 오디오 데이터 전처리와 TensorFlow 모델 학습을 담당했어요. 멸종위기 조류 보호를 위한 음성 분류 AI였습니다.\n\nPython, TensorFlow, Audio Processing에 익숙하고, 데이터 분석과 시각화도 즐겨 해요!`,
        en: `In AI/data, I worked on TassieBirdAI — audio preprocessing and TensorFlow model training for endangered bird voice classification at University of Tasmania.`,
        de: `Bei TassieBirdAI habe ich Audio-Preprocessing und Modelltraining mit TensorFlow für Vogelstimmen-Klassifikation gemacht.`,
      },
      ux: {
        ko: `UX 쪽에서는 B사 가상자산 거래소 프로젝트(웹 크롤링 + 사용자 인터뷰)와 Bus Stop Safety 하드웨어 프로토타입(현장 테스트) 경험이 있어요.\n\nFigma로 프로토타이핑하고, 사용자 리서치를 통해 아이디어를 검증하는 걸 좋아해요!`,
        en: `UX experience: crypto exchange UX improvement (crawling + interviews) and Bus Stop Safety prototype with field testing. I love validating ideas through user research!`,
        de: `UX-Erfahrung: Krypto-Börse UX-Verbesserung und Bus Stop Safety Prototyp mit Feldtests.`,
      },
      business: {
        ko: `비즈니스·전략 영역에서는 A사 뷰티테크 산학협력(데이터 가치사슬, 서비스 전략)과 Hanken ESG 금융, HWR Berlin 스타트업 BM 프로젝트 경험이 있어요.\n\n데이터와 서비스가 만나면 새로운 가치가 생긴다고 믿어요!`,
        en: `Business/strategy: beauty-tech industry research, ESG finance at Hanken, and startup BM at HWR Berlin. I believe data + service creates new value!`,
        de: `Business: Beauty-Tech Forschung, ESG-Finanzen und Startup Business Model Entwicklung.`,
      },
      growth: {
        ko: `실패는 배우는 과정이라고 생각해요. 프로젝트를 하면서 막히는 부분이 있어도, 팀과 함께 피드백을 나누고 개선해 나가는 게 중요하다고 느꼈어요.\n\n지금 진행 중인 프로젝트가 있으시면, 어떤 문제가 있는지 같이 이야기해 봐요!`,
        en: `I see failure as part of learning. Sharing feedback with the team and improving together is what matters. What's your current challenge?`,
        de: `Scheitern ist Teil des Lernens. Feedback im Team und gemeinsame Verbesserung sind mir wichtig.`,
      },
      switch_en: {
        ko: "Sure! I'll respond in English from now on. What would you like to know?",
        en: "Sure! I'll respond in English from now on. What would you like to know?",
        de: "Sure! I'll respond in English from now on. What would you like to know?",
      },
      switch_de: {
        ko: "Gerne! Ab jetzt antworte ich auf Deutsch. Was möchten Sie wissen?",
        en: "Gerne! Ab jetzt antworte ich auf Deutsch. Was möchten Sie wissen?",
        de: "Gerne! Ab jetzt antworte ich auf Deutsch. Was möchten Sie wissen?",
      },
      switch_ko: {
        ko: "네, 한국어로 대화할게요! 무엇이 궁금하세요?",
        en: "네, 한국어로 대화할게요! 무엇이 궁금하세요?",
        de: "네, 한국어로 대화할게요! 무엇이 궁금하세요?",
      },
      fallback: {
        ko: `음, 정확히 이해하지 못했어요 😅\n\n이런 것들을 물어보실 수 있어요:\n• 프로젝트 / 기술 / 학력\n• 성격 & 가치관\n• 연락 방법\n• 영어·독일어로 대화 전환\n\n편하게 다시 질문해 주세요!`,
        en: `I'm not sure I understood. Try asking about projects, skills, education, or contact info!`,
        de: `Das habe ich nicht verstanden. Fragen Sie nach Projekten, Fähigkeiten oder Kontakt!`,
      },
    };

    const block = responses[intent] || responses.fallback;
    if (intent === "switch_en") lang = "en";
    if (intent === "switch_de") lang = "de";
    if (intent === "switch_ko") lang = "ko";
    return block[lang] || block.ko;
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, "user");
    const detected = detectLang(text);
    if (detected !== "ko" && !/switch/.test(matchIntent(text))) lang = detected;
    const intent = matchIntent(text);
    reply(getResponse(intent));
  }

  function renderQuickReplies() {
    els.quickReplies.innerHTML = "";
    p.quickReplies.forEach((label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chat-quick-btn";
      btn.textContent = label;
      btn.addEventListener("click", () => handleUserMessage(label));
      els.quickReplies.appendChild(btn);
    });
  }

  function openChat() {
    els.panel.classList.add("open");
    els.toggle.classList.add("hidden");
    els.input.focus();
  }

  function closeChat() {
    els.panel.classList.remove("open");
    els.toggle.classList.remove("hidden");
  }

  els.toggle.addEventListener("click", openChat);
  els.close.addEventListener("click", closeChat);

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = els.input.value;
    els.input.value = "";
    handleUserMessage(text);
  });

  renderQuickReplies();
  addMessage(p.greetings.ko, "bot");
})();
