"use client";

import { useEffect, useState } from "react";

const vocabulary = [
  { word: "Abandon", meaning: "পরিত্যাগ করা", example: "Never abandon your dreams." },
  { word: "Achieve", meaning: "অর্জন করা", example: "You can achieve your goals." },
  { word: "Brave", meaning: "সাহসী", example: "Be brave in difficult situations." },
  { word: "Confident", meaning: "আত্মবিশ্বাসী", example: "Be confident about yourself." },
  { word: "Diligent", meaning: "পরিশ্রমী", example: "A diligent student studies regularly." },
  { word: "Essential", meaning: "অপরিহার্য", example: "English is essential for communication." },
  { word: "Generous", meaning: "উদার", example: "She is generous to everyone." },
  { word: "Improve", meaning: "উন্নতি করা", example: "Practice every day to improve your English." },
];

const questions = [
  {
    question: 'What is the meaning of "Abandon"?',
    options: ["গ্রহণ করা", "পরিত্যাগ করা", "তৈরি করা", "শেখানো"],
    answer: 1,
  },
  {
    question: 'Choose the synonym of "Brave".',
    options: ["Courageous", "Weak", "Lazy", "Afraid"],
    answer: 0,
  },
  {
    question: 'What is the meaning of "Diligent"?',
    options: ["অসৎ", "অলস", "পরিশ্রমী", "দুর্বল"],
    answer: 2,
  },
  {
    question: "Choose the correct sentence.",
    options: [
      "He go to school.",
      "He going to school.",
      "He goes to school.",
      "He gone to school.",
    ],
    answer: 2,
  },
  {
    question: 'What is the synonym of "Improve"?',
    options: ["Develop", "Destroy", "Forget", "Reduce"],
    answer: 0,
  },
];

const TIMER_KEY = "tutorian_offer_deadline_v2";
const OFFER_DURATION = 84 * 60 * 60 * 1000;
const COUNTER_START = 1995;
const COUNTER_END = 2000;
const COUNTER_DURATION = 10_000;

// WhatsApp number in international format without + or spaces.
const WHATSAPP_NUMBER = "8801804995560";

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [timerReady, setTimerReady] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [enrollmentCount, setEnrollmentCount] = useState(COUNTER_START);
  const [counterFull, setCounterFull] = useState(false);

  // 84-hour offer countdown.
  useEffect(() => {
    let deadline = 0;

    try {
      const saved = localStorage.getItem(TIMER_KEY);

      if (saved && Number.isFinite(Number(saved))) {
        deadline = Number(saved);
      }

      if (!deadline || deadline <= Date.now()) {
        deadline = Date.now() + OFFER_DURATION;
        localStorage.setItem(TIMER_KEY, String(deadline));
      }
    } catch {
      deadline = Date.now() + OFFER_DURATION;
    }

    const update = () => {
      setRemaining(Math.max(0, deadline - Date.now()));
      setTimerReady(true);
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // Animate 1995 -> 2000 over 10 seconds, then show Seat Full.
  useEffect(() => {
    const startedAt = Date.now();
    let interval = 0;

    const updateCounter = () => {
      const elapsed = Math.min(Date.now() - startedAt, COUNTER_DURATION);
      const progress = elapsed / COUNTER_DURATION;

      const nextCount = Math.min(
        COUNTER_END,
        COUNTER_START + Math.floor(progress * (COUNTER_END - COUNTER_START))
      );

      setEnrollmentCount(nextCount);

      if (elapsed >= COUNTER_DURATION) {
        setEnrollmentCount(COUNTER_END);
        setCounterFull(true);
        window.clearInterval(interval);
      }
    };

    updateCounter();
    interval = window.setInterval(updateCounter, 50);

    return () => window.clearInterval(interval);
  }, []);

  const filteredWords = vocabulary.filter(
    (item) =>
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.meaning.includes(search)
  );

  const time = formatTime(remaining);

  function answerQuestion(index: number) {
    if (selected !== null) return;

    setSelected(index);

    if (index === questions[currentQuestion].answer) {
      setScore((previous) => previous + 1);
    }
  }

  function nextQuestion() {
    if (currentQuestion === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelected(null);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  function toggleWord(index: number) {
    setRevealed((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  }

  function submitEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanPhone || !cleanEmail) {
      setFormMessage("অনুগ্রহ করে নাম, ফোন নম্বর ও ইমেইল পূরণ করুন।");
      return;
    }

    const message = [
      "আসসালামু আলাইকুম। আমি TUTORIAN কোর্সে ভর্তি হতে চাই।",
      "",
      "📚 ভর্তি সংক্রান্ত তথ্য:",
      `👤 নাম: ${cleanName}`,
      `📱 ফোন নম্বর: ${cleanPhone}`,
      `📧 ইমেইল: ${cleanEmail}`,
      "",
      "🎓 কোর্স: Vocabulary & Question",
      "💰 আগের মূল্য: ৳1500",
      "🔥 অফার মূল্য: ৳299",
      "",
      "দয়া করে ভর্তি প্রক্রিয়া ও পেমেন্টের বিস্তারিত জানাবেন। ধন্যবাদ।",
    ].join("\n");

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setFormMessage(
      "WhatsApp খোলা হচ্ছে। সেখানে মেসেজটি দেখে Send চাপলেই আপনার ভর্তি inquiry পাঠানো হবে।"
    );

    // Open WhatsApp with the enrollment details prefilled.
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }

  return (
    <main id="top">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');

        :root {
          color-scheme: dark;
          --bg: #080b13;
          --panel: #111725;
          --border: rgba(148,163,184,.17);
          --muted: #9ca9bd;
          --text: #f4f7ff;
          --cyan: #54e6d0;
          --purple: #a78bfa;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 90px; }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, "Hind Siliguri", sans-serif;
        }
        button, input { font: inherit; }
        button { cursor: pointer; }
        a { color: inherit; text-decoration: none; }
        .site-wrap { overflow: hidden; min-height: 100vh; }
        .container { width: min(1120px, calc(100% - 40px)); margin: auto; }
        .header {
          position: sticky; top: 0; z-index: 20;
          background: rgba(8,11,19,.91);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border);
        }
        .nav {
          min-height: 76px; display: flex; align-items: center;
          justify-content: space-between; gap: 20px;
        }
        .brand { display: flex; align-items: center; gap: 11px; font-weight: 900; letter-spacing: 1.2px; }
        .brand-mark {
          display: grid; place-items: center; width: 42px; height: 42px;
          border-radius: 13px; color: #061311; font-weight: 900;
          background: linear-gradient(135deg,var(--cyan),#a5f3fc);
          box-shadow: 0 0 25px rgba(84,230,208,.18);
        }
        .brand small { display: block; margin-top: 3px; color: var(--muted); font-size: 10px; letter-spacing: 1.1px; }
        .nav-links { display: flex; align-items: center; gap: 22px; color: #c6cfdf; font-size: 13px; }
        .nav-links a:hover { color: var(--cyan); }
        .btn {
          display: inline-flex; justify-content: center; align-items: center; gap: 8px;
          min-height: 46px; padding: 0 19px; border-radius: 12px;
          border: 1px solid transparent; font-weight: 800; font-size: 13px;
          transition: transform .2s,border-color .2s,background .2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
        .btn-primary { background: var(--cyan); color: #061311; }
        .btn-outline { border-color: var(--border); background: rgba(255,255,255,.025); color: var(--text); }
        .hero {
          position: relative; padding: 90px 0 80px;
          background: radial-gradient(ellipse at 75% 15%,rgba(124,58,237,.18),transparent 36%),
          radial-gradient(ellipse at 15% 50%,rgba(20,184,166,.10),transparent 35%);
        }
        .hero-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 55px; align-items: center; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 9px; padding: 8px 12px;
          border: 1px solid rgba(84,230,208,.24); border-radius: 99px;
          color: var(--cyan); background: rgba(84,230,208,.055);
          font-size: 11px; font-weight: 800; letter-spacing: 1px;
        }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 12px var(--cyan); }
        h1 { font-size: clamp(38px,5.3vw,66px); line-height: 1.12; letter-spacing: -2.7px; margin: 24px 0 20px; }
        .gradient-text { background: linear-gradient(100deg,var(--cyan),#a5b4fc 80%); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .hero-copy { max-width: 590px; color: var(--muted); font-family: "Hind Siliguri",sans-serif; font-size: 17px; line-height: 1.9; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 25px; }
        .hero-note { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 28px; color: #b8c4d6; font-size: 12px; }
        .hero-note span::before { content: "✓"; color: var(--cyan); font-weight: 900; margin-right: 7px; }
        .visual { padding: 22px; border: 1px solid rgba(167,139,250,.25); border-radius: 26px; background: linear-gradient(145deg,rgba(25,33,52,.95),rgba(13,18,30,.9)); box-shadow: 0 30px 100px rgba(0,0,0,.25); }
        .visual-top { display: flex; justify-content: space-between; align-items: center; color: #cbd5e1; font-size: 12px; }
        .live { color: var(--cyan); font-size: 10px; letter-spacing: 1px; }
        .word-display { padding: 35px 15px; margin-top: 20px; border-radius: 18px; background: radial-gradient(ellipse at 50% 0%,rgba(84,230,208,.10),transparent 70%),#0a101b; text-align: center; }
        .word-display .word { font-size: 38px; font-weight: 900; letter-spacing: -1px; }
        .word-display .meaning { margin-top: 8px; color: var(--cyan); font-family: "Hind Siliguri",sans-serif; font-size: 18px; }
        .word-display .example { margin-top: 18px; color: var(--muted); font-size: 12px; }
        .mini-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
        .mini-stat { padding: 16px; border-radius: 14px; background: rgba(255,255,255,.035); border: 1px solid var(--border); }
        .mini-stat strong { display: block; font-size: 21px; }
        .mini-stat span { display: block; margin-top: 4px; color: var(--muted); font-size: 11px; }
        .section { padding: 80px 0; }
        .section-alt { background: #0b101b; border-top: 1px solid rgba(148,163,184,.07); border-bottom: 1px solid rgba(148,163,184,.07); }
        .section-head { max-width: 680px; margin-bottom: 34px; }
        .kicker { color: var(--cyan); font-size: 11px; letter-spacing: 2px; font-weight: 900; text-transform: uppercase; }
        h2 { font-size: clamp(29px,4vw,43px); line-height: 1.2; letter-spacing: -1.2px; margin: 13px 0; }
        .section-head p { color: var(--muted); line-height: 1.8; font-family: "Hind Siliguri",sans-serif; }
        .course-card { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 28px; border-radius: 24px; border: 1px solid var(--border); background: linear-gradient(135deg,rgba(17,23,37,.98),rgba(14,20,33,.9)); }
        .course-art { min-height: 285px; display: flex; flex-direction: column; justify-content: space-between; padding: 25px; border-radius: 18px; background: radial-gradient(ellipse at 80% 20%,rgba(167,139,250,.35),transparent 35%),radial-gradient(ellipse at 15% 85%,rgba(84,230,208,.22),transparent 38%),#0a101c; }
        .art-label { font-size: 10px; color: var(--cyan); font-weight: 900; letter-spacing: 2px; }
        .art-title { font-size: clamp(32px,4vw,49px); line-height: 1; font-weight: 900; letter-spacing: -2px; }
        .art-title span { display: block; margin-top: 8px; color: var(--cyan); }
        .art-bottom { color: #b8c4d6; font-size: 12px; }
        .course-info { display: flex; flex-direction: column; justify-content: center; }
        .tag { display: inline-flex; width: fit-content; border-radius: 7px; padding: 6px 9px; color: var(--cyan); background: rgba(84,230,208,.08); font-size: 10px; font-weight: 900; letter-spacing: 1px; }
        .course-info h3 { font-size: 29px; margin: 15px 0 9px; }
        .course-info p { color: var(--muted); line-height: 1.85; font-family: "Hind Siliguri",sans-serif; }
        .benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0; list-style: none; color: #d6deeb; font-size: 12px; margin: 14px 0 22px; }
        .benefits li::before { content: "✓"; color: var(--cyan); margin-right: 7px; }
        .offer {
          position: relative; overflow: hidden; padding: 30px;
          border: 1px solid rgba(84,230,208,.3); border-radius: 24px;
          background: radial-gradient(ellipse at 90% 0%,rgba(167,139,250,.17),transparent 40%),#101725;
        }
        .offer-grid { display: grid; grid-template-columns: 1fr .85fr; gap: 30px; align-items: start; }
        .offer h2 { margin-top: 15px; }
        .price-line { display: flex; align-items: baseline; flex-wrap: wrap; gap: 14px; margin: 20px 0; }
        .old-price { color: #8c98aa; font-size: 22px; text-decoration: line-through; }
        .new-price { font-size: 46px; font-weight: 900; color: var(--cyan); letter-spacing: -2px; }
        .price-caption { color: var(--muted); font-size: 12px; line-height: 1.8; }
        .timer { display: grid; grid-template-columns: repeat(4,1fr); gap: 9px; margin: 20px 0; }
        .timer-cell { text-align: center; padding: 14px 5px; border: 1px solid var(--border); border-radius: 12px; background: rgba(255,255,255,.035); }
        .timer-cell strong { display: block; color: var(--cyan); font-size: clamp(20px,3vw,30px); font-variant-numeric: tabular-nums; }
        .timer-cell span { display: block; margin-top: 5px; color: var(--muted); font-size: 10px; }
        .fine-print { color: var(--muted); font-size: 11px; line-height: 1.7; }
        .enroll-column { display: grid; gap: 16px; min-width: 0; }
        .counter-card {
          position: relative; overflow: hidden; padding: 22px;
          border: 1px solid rgba(84,230,208,.28); border-radius: 18px;
          background: radial-gradient(ellipse at 90% 0%,rgba(84,230,208,.12),transparent 55%),#0b111d;
        }
        .counter-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
        .counter-label { color: var(--muted); font-family: "Hind Siliguri",sans-serif; font-size: 13px; }
        .counter-status { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; color: var(--cyan); letter-spacing: 1px; font-weight: 900; }
        .counter-status::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 12px var(--cyan); }
        .counter-number { margin: 18px 0 5px; font-size: clamp(34px,4vw,46px); line-height: 1.1; font-weight: 900; letter-spacing: -1.5px; color: var(--cyan); font-variant-numeric: tabular-nums; }
        .counter-number span { color: #8190a6; font-size: 24px; }
        .counter-track { height: 7px; margin: 17px 0 12px; overflow: hidden; border-radius: 99px; background: #263044; }
        .counter-track div { height: 100%; border-radius: inherit; background: linear-gradient(90deg,var(--cyan),#a78bfa); transition: width .08s linear; }
        .counter-note { margin: 0; color: var(--muted); font-family: "Hind Siliguri",sans-serif; font-size: 12px; line-height: 1.8; }
        .seat-full { display: inline-flex; margin-top: 12px; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(251,113,133,.35); background: rgba(251,113,133,.09); color: #fda4af; font-size: 12px; font-weight: 900; letter-spacing: 1px; }
        .enroll-form { display: grid; gap: 13px; padding: 22px; background: rgba(8,11,19,.62); border: 1px solid var(--border); border-radius: 18px; }
        .enroll-form h3 { margin: 0 0 5px; font-size: 22px; }
        .enroll-form p { margin: 0 0 6px; color: var(--muted); font-family: "Hind Siliguri",sans-serif; font-size: 13px; line-height: 1.7; }
        .field-label { display: grid; gap: 7px; color: #d6deeb; font-size: 12px; font-weight: 700; }
        .field { width: 100%; min-width: 0; padding: 13px 14px; border: 1px solid var(--border); border-radius: 10px; color: var(--text); background: #0c1220; outline: none; }
        .field:focus { border-color: var(--cyan); }
        .form-message { color: #a7f3d0; font-size: 12px; line-height: 1.8; overflow-wrap: anywhere; }
        .vocab-tools { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-bottom: 22px; }
        .search { width: min(340px,100%); padding: 13px 15px; border: 1px solid var(--border); border-radius: 11px; color: var(--text); background: #0c1220; outline: none; }
        .search:focus { border-color: var(--cyan); }
        .word-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .word-card { min-height: 170px; padding: 18px; border: 1px solid var(--border); border-radius: 16px; background: var(--panel); transition: transform .2s,border-color .2s; }
        .word-card:hover { transform: translateY(-3px); border-color: rgba(84,230,208,.4); }
        .word-card strong { display: block; font-size: 18px; }
        .word-card .bn { color: var(--cyan); margin-top: 8px; font-family: "Hind Siliguri",sans-serif; }
        .word-card .example { color: var(--muted); font-size: 11px; line-height: 1.7; margin-top: 11px; }
        .small-btn { margin-top: 12px; padding: 7px 10px; border: 1px solid var(--border); border-radius: 8px; background: transparent; color: #d6deeb; font-size: 11px; }
        .quiz-layout { display: grid; grid-template-columns: .7fr 1.3fr; gap: 35px; align-items: start; }
        .quiz-aside { padding: 26px; border-radius: 20px; background: linear-gradient(145deg,rgba(84,230,208,.08),rgba(167,139,250,.08)); border: 1px solid var(--border); }
        .quiz-aside .big { font-size: 45px; font-weight: 900; color: var(--cyan); }
        .quiz-aside p { color: var(--muted); font-family: "Hind Siliguri",sans-serif; line-height: 1.8; }
        .quiz-box { padding: 28px; border-radius: 20px; background: var(--panel); border: 1px solid var(--border); }
        .quiz-progress { height: 5px; border-radius: 20px; background: #263044; margin: 16px 0 26px; overflow: hidden; }
        .quiz-progress div { height: 100%; background: var(--cyan); transition: width .3s; }
        .question { font-size: 21px; line-height: 1.55; font-weight: 800; margin-bottom: 20px; }
        .options { display: grid; gap: 10px; }
        .option { width: 100%; padding: 14px 15px; text-align: left; border-radius: 11px; color: #dce5f5; border: 1px solid var(--border); background: #0c1220; }
        .option:hover:not(:disabled) { border-color: var(--cyan); }
        .option.correct { border-color: #34d399; background: rgba(52,211,153,.1); }
        .option.wrong { border-color: #fb7185; background: rgba(251,113,133,.1); }
        .quiz-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 23px; color: var(--muted); font-size: 12px; }
        .result { text-align: center; padding: 20px 0; }
        .result-score { font-size: 58px; font-weight: 900; color: var(--cyan); }
        .features { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }
        .feature { padding: 23px; border-radius: 17px; border: 1px solid var(--border); background: var(--panel); }
        .feature-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: rgba(84,230,208,.09); color: var(--cyan); font-size: 20px; }
        .feature h3 { margin: 17px 0 8px; font-size: 16px; }
        .feature p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.8; font-family: "Hind Siliguri",sans-serif; }
        .cta { text-align: center; padding: 52px 25px; border-radius: 24px; border: 1px solid rgba(84,230,208,.23); background: radial-gradient(ellipse at 50% 0%,rgba(84,230,208,.11),transparent 65%),#101725; }
        .cta p { color: var(--muted); line-height: 1.8; font-family: "Hind Siliguri",sans-serif; }
        .footer { padding: 30px 0; border-top: 1px solid var(--border); color: var(--muted); font-size: 12px; }
        .footer-inner { display: flex; justify-content: space-between; gap: 15px; flex-wrap: wrap; }
        .empty { padding: 30px; color: var(--muted); text-align: center; border: 1px dashed var(--border); border-radius: 14px; }
        @media (max-width:850px) {
          .nav-links { gap: 12px; }
          .nav-links a:not(.btn) { display: none; }
          .hero { padding: 65px 0 55px; }
          .hero-grid,.course-card,.quiz-layout,.offer-grid { grid-template-columns: 1fr; }
          .hero-grid { gap: 35px; }
          .word-grid { grid-template-columns: repeat(2,1fr); }
          .features { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width:520px) {
          .container { width: calc(100% - 28px); }
          .nav { min-height: 67px; }
          .brand-mark { width: 37px; height: 37px; }
          .brand { font-size: 13px; }
          .nav-links .btn { min-height: 39px; padding: 0 11px; font-size: 11px; }
          .hero { padding: 48px 0; }
          h1 { letter-spacing: -1.6px; }
          .hero-copy { font-size: 15px; }
          .section { padding: 55px 0; }
          .course-card { padding: 15px; gap: 22px; }
          .course-art { min-height: 240px; }
          .word-grid { gap: 9px; }
          .word-card { padding: 13px; min-height: 165px; }
          .word-card strong { font-size: 16px; }
          .features { grid-template-columns: 1fr; }
          .quiz-box,.quiz-aside { padding: 19px; }
          .question { font-size: 18px; }
          .benefits { grid-template-columns: 1fr; }
          .mini-stat { padding: 12px; }
          .offer { padding: 18px; }
          .timer { gap: 6px; }
          .timer-cell { padding: 12px 3px; }
          .timer-cell span { font-size: 9px; }
          .enroll-form,.counter-card { padding: 16px; }
          .new-price { font-size: 39px; }
          .counter-number { font-size: 35px; }
          .quiz-footer { align-items: flex-start; flex-direction: column; }
        }
        @media (prefers-reduced-motion:reduce) {
          *,*::before,*::after { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>

      <div className="site-wrap">
        <header className="header">
          <div className="container nav">
            <a href="#top" className="brand" aria-label="Tutorian home">
              <span className="brand-mark">T.</span>
              <span>
                TUTORIAN
                <small>CAREER & SKILL UP ACADEMY</small>
              </span>
            </a>
            <nav className="nav-links" aria-label="Main navigation">
              <a href="#course">Course</a>
              <a href="#vocabulary">Vocabulary</a>
              <a href="#quiz">Practice Quiz</a>
              <a className="btn btn-primary" href="#offer">ভর্তি তথ্য ↗</a>
            </nav>
          </div>
        </header>

        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow"><span className="dot" /> YOUR ENGLISH JOURNEY STARTS HERE</span>
              <h1>
                Build Your English.
                <br />
                <span className="gradient-text">One Word at a Time.</span>
              </h1>
              <p className="hero-copy">
                প্রতিদিন নতুন vocabulary শিখুন, বাস্তব উদাহরণ বুঝুন এবং
                interactive quiz দিয়ে নিজের প্রস্তুতি যাচাই করুন। শেখাকে
                করুন সহজ, নিয়মিত এবং কার্যকর।
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#vocabulary">Vocabulary শিখুন ↗</a>
                <a className="btn btn-outline" href="#quiz">Quiz দিন →</a>
              </div>
              <div className="hero-note">
                <span>Vocabulary Practice</span>
                <span>MCQ Questions</span>
                <span>Self Assessment</span>
              </div>
            </div>

            <div className="visual">
              <div className="visual-top">
                <span>YOUR DAILY LEARNING CARD</span>
                <span className="live">● LEARN</span>
              </div>
              <div className="word-display">
                <div className="word">Consistent</div>
                <div className="meaning">নিয়মিত · ধারাবাহিক</div>
                <div className="example">“Consistent practice builds confidence.”</div>
              </div>
              <div className="mini-stats">
                <div className="mini-stat">
                  <strong>Learn</strong>
                  <span>নতুন শব্দ শিখুন</span>
                </div>
                <div className="mini-stat">
                  <strong>Practice</strong>
                  <span>প্রশ্নের উত্তর দিন</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="course">
          <div className="container">
            <div className="section-head">
              <span className="kicker">OUR COURSE</span>
              <h2>একটি কোর্স। <span className="gradient-text">দক্ষতার নতুন শুরু।</span></h2>
              <p>
                TUTORIAN-এর Vocabulary & Question learning section-এ
                ইংরেজি শব্দ, বাংলা অর্থ, উদাহরণ এবং MCQ অনুশীলন করুন।
              </p>
            </div>

            <article className="course-card">
              <div className="course-art">
                <span className="art-label">TUTORIAN • ENGLISH SERIES</span>
                <div className="art-title">
                  VOCABULARY
                  <span>& QUESTIONS</span>
                </div>
                <div className="art-bottom">Learn words. Understand meaning. Test yourself.</div>
              </div>

              <div className="course-info">
                <span className="tag">VOCABULARY COURSE</span>
                <h3>Vocabulary & Question</h3>
                <p>
                  গুরুত্বপূর্ণ ইংরেজি শব্দের বাংলা অর্থ, উদাহরণসহ ব্যবহার
                  এবং MCQ প্রশ্ন অনুশীলনের মাধ্যমে নিজের জ্ঞান যাচাই করুন।
                </p>
                <ul className="benefits">
                  <li>English to Bangla meaning</li>
                  <li>Synonyms & word usage</li>
                  <li>Example sentences</li>
                  <li>MCQ practice questions</li>
                  <li>নিজের স্কোর যাচাই</li>
                  <li>Beginner-friendly learning</li>
                </ul>
                <a className="btn btn-primary" href="#offer">ভর্তি ও অফারের তথ্য ↗</a>
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="offer">
          <div className="container">
            <div className="section-head">
              <span className="kicker">COURSE OFFER</span>
              <h2>আপনার শেখার যাত্রা <span className="gradient-text">শুরু করুন।</span></h2>
              <p>
                কোর্সের মূল্য, অফার টাইমার এবং ভর্তি-সংক্রান্ত তথ্য এক জায়গায় দেখুন।
              </p>
            </div>

            <div className="offer">
              <div className="offer-grid">
                <div>
                  <span className="tag">VOCABULARY & QUESTION</span>
                  <h2>English শেখার নতুন শুরু</h2>
                  <p className="hero-copy" style={{ fontSize: 15 }}>
                    Vocabulary, বাংলা অর্থ, example sentence এবং MCQ practice
                    দিয়ে নিয়মিত অনুশীলন করুন।
                  </p>

                  <div className="price-line">
                    <span className="old-price">৳1,500</span>
                    <span className="new-price">৳299</span>
                  </div>
                  <div className="price-caption">
                    সীমিত সময়ের জন্য বিশেষ অফারটি মিস করতে না চাইলে এখনই রিজার্ভ করুন।
                  </div>

                  <h3 style={{ marginTop: 27 }}>অফার কাউন্টডাউন</h3>
                  <div className="timer" aria-live="polite">
                    {[
                      { label: "দিন", value: time.days },
                      { label: "ঘণ্টা", value: time.hours },
                      { label: "মিনিট", value: time.minutes },
                      { label: "সেকেন্ড", value: time.seconds },
                    ].map((item) => (
                      <div className="timer-cell" key={item.label}>
                        <strong>
                          {timerReady
                            ? String(item.value).padStart(2, "0")
                            : "--"}
                        </strong>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="fine-print">
                    কাউন্টডাউনটি এই ব্রাউজারে সংরক্ষিত deadline অনুযায়ী চলে।
                    এটি সব ব্যবহারকারীর জন্য server-controlled deadline নয়।
                    কাউন্টডাউন শেষ হলেও মূল্য স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে না।
                  </p>

                  <div style={{ marginTop: 22 }}>
                    <a className="btn btn-primary" href="#enroll">ভর্তির তথ্য দিন ↓</a>
                  </div>
                </div>

                <div className="enroll-column">
                  <section className="counter-card" aria-label="Free Enrollment Counter">
                    <div className="counter-top">
                      <div>
                        <div className="kicker">FREE ENROLLMENT COUNTER</div>
                        <div className="counter-label">ভর্তি কাউন্টার</div>
                      </div>
                      <span className="counter-status">
                        {counterFull ? "COMPLETED" : "LIVE COUNTER"}
                      </span>
                    </div>

                    <div className="counter-number" aria-live="polite">
                      {enrollmentCount}
                      <span> / {COUNTER_END}</span>
                    </div>

                    <div
                      className="counter-track"
                      role="progressbar"
                      aria-label="Enrollment counter progress"
                      aria-valuemin={COUNTER_START}
                      aria-valuemax={COUNTER_END}
                      aria-valuenow={enrollmentCount}
                    >
                      <div
                        style={{
                          width: `${
                            ((enrollmentCount - COUNTER_START) /
                              (COUNTER_END - COUNTER_START)) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    {counterFull ? (
                      <div className="seat-full" role="status">SEAT FULL</div>
                    ) : (
                      <p className="counter-note">
                        ভর্তি কাউন্টার আপডেট হচ্ছে...
                      </p>
                    )}
                  </section>

                  <form id="enroll" className="enroll-form" onSubmit={submitEnrollment}>
                    <h3>Enrollment Inquiry</h3>
                    <p>
                      আপনার নাম, ফোন ও ইমেইল দিন। Submit করলে আপনার ভর্তি-সংক্রান্ত
                      মেসেজ WhatsApp-এ প্রস্তুত হবে।
                    </p>

                    <label className="field-label">
                      আপনার নাম
                      <input
                        className="field"
                        name="name"
                        autoComplete="name"
                        placeholder="পূর্ণ নাম লিখুন"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </label>

                    <label className="field-label">
                      ফোন নম্বর
                      <input
                        className="field"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        required
                      />
                    </label>

                    <label className="field-label">
                      ইমেইল
                      <input
                        className="field"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </label>

                    <button className="btn btn-primary" type="submit">
                      WhatsApp-এ ভর্তি করুন ↗
                    </button>

                    {formMessage && (
                      <div className="form-message" role="status">
                        {formMessage}
                      </div>
                    )}

                    <p className="fine-print">
                      WhatsApp-এ মেসেজটি খুলবে, তবে পাঠানোর জন্য আপনাকে WhatsApp-এ
                      Send চাপতে হবে। আপনার তথ্য এই ওয়েবসাইটের database-এ সংরক্ষণ করা হয় না।
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="vocabulary">
          <div className="container">
            <div className="section-head">
              <span className="kicker">WORD BANK</span>
              <h2>Build Your <span className="gradient-text">Vocabulary.</span></h2>
              <p>
                শব্দ খুঁজুন, বাংলা অর্থ শিখুন এবং উদাহরণ বাক্য পড়ুন।
                বাংলা অর্থ বা ইংরেজি শব্দ দিয়ে সার্চ করতে পারবেন।
              </p>
            </div>

            <div className="vocab-tools">
              <div>
                <strong>{filteredWords.length} Words</strong>
                <span style={{ color: "var(--muted)", fontSize: 12 }}> · Learning collection</span>
              </div>
              <input
                className="search"
                type="search"
                placeholder="Search word or বাংলা অর্থ..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search vocabulary"
              />
            </div>

            {filteredWords.length > 0 ? (
              <div className="word-grid">
                {filteredWords.map((item) => {
                  const originalIndex = vocabulary.indexOf(item);
                  const isRevealed = revealed.includes(originalIndex);

                  return (
                    <article className="word-card" key={item.word}>
                      <strong>{item.word}</strong>
                      <div className="bn">
                        {isRevealed ? item.meaning : "অর্থ দেখতে চাপ দিন"}
                      </div>
                      {isRevealed && <div className="example">{item.example}</div>}
                      <button
                        className="small-btn"
                        onClick={() => toggleWord(originalIndex)}
                        type="button"
                      >
                        {isRevealed ? "অর্থ লুকান" : "অর্থ ও উদাহরণ দেখুন"}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty">এই শব্দটি পাওয়া যায়নি। অন্য শব্দ দিয়ে খুঁজুন।</div>
            )}
          </div>
        </section>

        <section className="section section-alt" id="quiz">
          <div className="container">
            <div className="section-head">
              <span className="kicker">PRACTICE ZONE</span>
              <h2>Test Your <span className="gradient-text">Knowledge.</span></h2>
              <p>
                MCQ প্রশ্নের উত্তর দিন। প্রতিটি প্রশ্নের পর সঠিক উত্তর
                দেখতে পারবেন এবং শেষে নিজের স্কোর জানতে পারবেন।
              </p>
            </div>

            <div className="quiz-layout">
              <aside className="quiz-aside">
                <div className="big">MCQ</div>
                <h3>Practice makes progress.</h3>
                <p>
                  মনোযোগ দিয়ে প্রশ্ন পড়ুন, সঠিক উত্তর বেছে নিন এবং
                  ভুল উত্তর থেকেও শিখুন।
                </p>
                <div className="mini-stats">
                  <div className="mini-stat">
                    <strong>{questions.length}</strong>
                    <span>মোট প্রশ্ন</span>
                  </div>
                  <div className="mini-stat">
                    <strong>{score}</strong>
                    <span>সঠিক উত্তর</span>
                  </div>
                </div>
              </aside>

              <div className="quiz-box">
                {!finished ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: 12 }}>
                      <span>QUESTION {currentQuestion + 1} / {questions.length}</span>
                      <span>Score: {score}</span>
                    </div>
                    <div className="quiz-progress">
                      <div style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                    </div>
                    <div className="question">{questions[currentQuestion].question}</div>
                    <div className="options">
                      {questions[currentQuestion].options.map((option, index) => {
                        const isCorrect = index === questions[currentQuestion].answer;
                        const isSelected = index === selected;

                        let className = "option";
                        if (selected !== null && isCorrect) className += " correct";
                        else if (isSelected && !isCorrect) className += " wrong";

                        return (
                          <button
                            type="button"
                            key={option}
                            className={className}
                            onClick={() => answerQuestion(index)}
                            disabled={selected !== null}
                          >
                            <span style={{ marginRight: 10, color: "var(--cyan)" }}>
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                            {selected !== null && isCorrect ? " ✓" : ""}
                          </button>
                        );
                      })}
                    </div>

                    {selected !== null && (
                      <p style={{ color: selected === questions[currentQuestion].answer ? "#6ee7b7" : "#fda4af", fontSize: 13, marginTop: 15 }}>
                        {selected === questions[currentQuestion].answer
                          ? "সঠিক উত্তর! খুব ভালো।"
                          : `সঠিক উত্তর: ${questions[currentQuestion].options[questions[currentQuestion].answer]}`}
                      </p>
                    )}

                    <div className="quiz-footer">
                      <span>নিজের জ্ঞান যাচাই করুন</span>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={selected === null}
                        onClick={nextQuestion}
                      >
                        {currentQuestion === questions.length - 1 ? "ফলাফল দেখুন" : "পরের প্রশ্ন →"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="result">
                    <span className="kicker">QUIZ COMPLETED</span>
                    <h2>আপনার ফলাফল</h2>
                    <div className="result-score">{score}/{questions.length}</div>
                    <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
                      {score === questions.length
                        ? "অসাধারণ! সব প্রশ্নের সঠিক উত্তর দিয়েছেন।"
                        : score >= 3
                        ? "ভালো করেছেন! আরও অনুশীলন করলে উন্নতি হবে।"
                        : "চেষ্টা চালিয়ে যান। Vocabulary অংশটি আবার দেখে নিন।"}
                    </p>
                    <button type="button" className="btn btn-primary" onClick={restartQuiz}>
                      আবার কুইজ দিন ↻
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="kicker">YOUR LEARNING EXPERIENCE</span>
              <h2>Learn. Practice. <span className="gradient-text">Improve.</span></h2>
            </div>
            <div className="features">
              <article className="feature">
                <div className="feature-icon">Aa</div>
                <h3>Vocabulary Learning</h3>
                <p>ইংরেজি শব্দের অর্থ ও উদাহরণ দেখে শব্দভান্ডার বাড়ান।</p>
              </article>
              <article className="feature">
                <div className="feature-icon">✓</div>
                <h3>Question Practice</h3>
                <p>MCQ প্রশ্নের মাধ্যমে নিজের প্রস্তুতি যাচাই করুন।</p>
              </article>
              <article className="feature">
                <div className="feature-icon">↗</div>
                <h3>Track Your Progress</h3>
                <p>কুইজ শেষে স্কোর দেখে কোন বিষয়ে আরও অনুশীলন প্রয়োজন বুঝুন।</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="cta">
              <span className="kicker">START LEARNING TODAY</span>
              <h2>One word closer to <span className="gradient-text">your goal.</span></h2>
              <p>
                আজ থেকেই Vocabulary শিখুন এবং প্রশ্ন অনুশীলনের মাধ্যমে
                নিজের দক্ষতা বাড়ানোর চেষ্টা করুন।
              </p>
              <div className="hero-actions" style={{ justifyContent: "center" }}>
                <a href="#vocabulary" className="btn btn-primary">শব্দ শেখা শুরু করুন ↗</a>
                <a href="#quiz" className="btn btn-outline">Quiz অনুশীলন করুন</a>
                <a href="#offer" className="btn btn-outline">কোর্সের তথ্য</a>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container footer-inner">
            <span>© 2026 TUTORIAN Career & Skill Up Academy</span>
            <a href="#top">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </main>
  );
}