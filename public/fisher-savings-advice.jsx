/* Fisher — responsive Savings + Advice */

const goals = [
  { id: 1, emoji: '✈️', bg: 'rgba(59,130,246,0.15)',  name: 'Japan trip',           target: 4500,  saved: 3510, due: 'August 2025' },
  { id: 2, emoji: '🏠', bg: 'rgba(134,59,255,0.15)', name: 'House down payment',    target: 40000, saved: 16000, due: '2027' },
  { id: 3, emoji: '🛟', bg: 'rgba(245,158,11,0.15)', name: 'Emergency fund',        target: 10000, saved: 4000,  due: 'Ongoing' },
  { id: 4, emoji: '💻', bg: 'rgba(34,197,94,0.15)',  name: 'New laptop',            target: 2500,  saved: 2300,  due: 'June 2025' },
];

function SavingsScreen() {
  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <div data-screen-label="Savings">
      <div className="screen-header">
        <div className="greeting">
          <p>{goals.length} active goals</p>
          <h1>Savings</h1>
        </div>
        <button className="plaid-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New goal
        </button>
      </div>

      {/* Overall savings hero */}
      <div className="hero" style={{ marginBottom: 22 }}>
        <div className="hero-label"><span>Total Saved</span></div>
        <div className="hero-amount">${totalSaved.toLocaleString()}</div>
        <div className="hero-tags">
          <span className="hero-tag">of ${totalTarget.toLocaleString()} across {goals.length} goals</span>
          <span className="hero-tag" style={{ background: 'rgba(255,255,255,0.1)' }}>{Math.round(totalSaved/totalTarget*100)}% complete</span>
        </div>
      </div>

      <div className="section-label"><span>Your goals</span></div>
      <div className="goal-grid">
        {goals.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div className="goal-card" key={g.id}>
              <div className="goal-head">
                <div className="goal-emoji" style={{ background: g.bg }}>{g.emoji}</div>
                <div className="info">
                  <p className="name">{g.name}</p>
                  <p className="target">By {g.due}</p>
                </div>
                <div className="goal-pct">{pct}%</div>
              </div>
              <div className="goal-bar">
                <div className="goal-bar-fill" style={{ width: pct + '%' }} />
              </div>
              <div className="goal-foot">
                <span className="saved">${g.saved.toLocaleString()} saved</span>
                <span>of ${g.target.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const adviceCards = [
  { kind: 'win',  tag: 'Win',   emoji: '🎉', title: "You're saving 22% of income",
    body: 'Above the recommended 20%. That puts you on track to hit your emergency fund a month early.',
    cta: 'See details' },
  { kind: 'warn', tag: 'Watch', emoji: '⚠️', title: 'Dining out crept up to $312',
    body: "That's $88 over your usual. Want to set a soft cap of $250 for next month?",
    cta: 'Set a cap' },
  { kind: 'tip',  tag: 'Tip',   emoji: '💡', title: 'Move $400 to savings',
    body: 'Your chequing has been above $3,000 for 14 days. Moving the excess could earn ~$1.40/mo at current rates.',
    cta: 'Transfer now' },
  { kind: 'tip',  tag: 'Tip',   emoji: '🔁', title: 'Cancel one streaming service?',
    body: "You haven't used Disney+ in 42 days. That's $11.99/mo back in your pocket.",
    cta: 'Review subs' },
];

function AdviceScreen() {
  return (
    <div data-screen-label="Advice">
      <div className="screen-header">
        <div className="greeting">
          <p>AI-powered insights</p>
          <h1>Advice</h1>
        </div>
        <div className="avatar" style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)', fontSize: 18 }}>✨</div>
      </div>

      {/* Health score */}
      <div className="health-card" style={{ marginBottom: 22 }}>
        <div className="health-ring">
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none"/>
            <circle cx="50" cy="50" r="44" stroke="#fff" strokeWidth="8" fill="none"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - 0.78)}
              strokeLinecap="round"/>
          </svg>
          <div className="score">78</div>
        </div>
        <div className="meta">
          <p className="label">Financial Health</p>
          <p className="title">Looking strong</p>
          <p className="sub">Up 4 points this month — keep saving and watch dining.</p>
        </div>
      </div>

      <div className="section-label"><span>For you this week</span></div>
      <div className="advice-grid">
        {adviceCards.map((c, i) => (
          <div className="advice-card" key={i}>
            <div className="advice-head">
              <span style={{ fontSize: 22 }}>{c.emoji}</span>
              <span className={'badge ' + c.kind}>{c.tag}</span>
            </div>
            <p className="advice-title">{c.title}</p>
            <p className="advice-body">{c.body}</p>
            <button className="advice-cta">
              {c.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

window.SavingsScreen = SavingsScreen;
window.AdviceScreen = AdviceScreen;
