'use client';

import { useEffect, useRef, useState } from 'react';

const SPIN_WORDS = [
  'EXHAUSTING.',
  'AMAZING.',
  'STRESSFUL.',
  'CHAOTIC.',
  'WILD.',
  'THRILLING.',
  'OVERWHELMING.',
  'EXPENSIVE.',
];

export default function ExpensiveSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [currentWord, setCurrentWord] = useState(SPIN_WORDS[0]);
  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const wordIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSpin = () => {
    if (hasSpun) return;
    setHasSpun(true);
    let idx = 0;
    const speeds = [80, 80, 100, 120, 150, 180, 220, 300];
    let step = 0;

    const tick = () => {
      idx = (idx + 1) % SPIN_WORDS.length;
      setCurrentWord(SPIN_WORDS[idx]);
      step++;
      if (step < SPIN_WORDS.length * 3) {
        const delay = speeds[Math.min(step, speeds.length - 1)];
        setTimeout(tick, delay);
      } else {
        // Land on EXPENSIVE
        let finalIdx = idx;
        const landOn = () => {
          finalIdx = (finalIdx + 1) % SPIN_WORDS.length;
          setCurrentWord(SPIN_WORDS[finalIdx]);
          if (SPIN_WORDS[finalIdx] !== 'EXPENSIVE.') {
            setTimeout(landOn, 300);
          }
        };
        landOn();
      }
    };
    setTimeout(tick, 80);
  };

  // Intersection observer to trigger on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasSpun) {
            setTimeout(runSpin, 400);
          }
          // Stats fade in
          if (statsRef.current) {
            const cards = statsRef.current.querySelectorAll('.stat-card');
            cards.forEach((card) => {
              if (entry.isIntersecting) {
                card.classList.add('visible');
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasSpun]);

  return (
    <section className="expensive-section" ref={sectionRef} id="expensive">
      <p className="being-student">Being a student is…</p>
      <div className="spin-word-container">
        <div className="spin-word" ref={wordRef}>
          {currentWord}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row" ref={statsRef}>
        <div className="stat-card">
          <div className="stat-number">$643</div>
          <div className="stat-label">
            Average monthly cost of a <strong>campus meal plan</strong> in Canada — up to $5,500/year just for on-campus food.
          </div>
        </div>

        <div className="vs-badge">VS</div>

        <div className="stat-card">
          <div className="stat-number">$310</div>
          <div className="stat-label">
            Average monthly grocery cost for a student who <strong>cooks their own meals</strong> — saving $300+ every single month.
          </div>
        </div>
      </div>

      <p style={{
        marginTop: '2rem',
        fontSize: '0.8rem',
        color: 'rgba(13,27,142,0.55)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        Source: Canada's 2023 Food Price Report · Embark Student Financial Research · Maclean's University Spending Study
      </p>
    </section>
  );
}
