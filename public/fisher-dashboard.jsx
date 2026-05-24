/* Fisher — responsive Dashboard */

const dashAccounts = [
  { id: 1, name: 'Chequing',   bank: 'TD Bank', balance: 3218,  color: '#3b82f6' },
  { id: 2, name: 'Savings',    bank: 'RBC',     balance: 8110,  color: '#22c55e' },
  { id: 3, name: 'Credit',     bank: 'Chase',   balance: -862,  color: '#ef4444' },
];

const dashInsights = [
  { icon: '📉', bg: 'rgba(34,197,94,0.15)',   text: 'Dining is down 18% vs last month — nice work.' },
  { icon: '⚡', bg: 'rgba(245,158,11,0.15)',  text: 'Subscriptions cost $94/mo. Review on Spending.' },
  { icon: '🎯', bg: 'rgba(134,59,255,0.15)',  text: 'Emergency fund 40% funded. Keep going!' },
];

const fmtCAD = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

function DashboardScreen({ visible, toggleVisible }) {
  const net = dashAccounts.reduce((s, a) => s + a.balance, 0);
  const spent = 1847;

  return (
    <div data-screen-label="Dashboard">
      <div className="screen-header">
        <div className="greeting">
          <p>Good morning</p>
          <h1>Welcome back, Alex 👋</h1>
        </div>
        <div className="avatar">A</div>
      </div>

      <div className="grid cols-12">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero */}
          <div className="hero">
            <div className="hero-label">
              <span>Net Worth</span>
              <button className="eye-btn" onClick={toggleVisible}>
                {visible ? (
                  <><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/></svg> Hide</>
                ) : (
                  <><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" stroke="#fff" strokeWidth="2"/></svg> Show</>
                )}
              </button>
            </div>
            <div className="hero-amount">{visible ? fmtCAD(net) : '••••••••'}</div>
            <div className="hero-tags">
              <span className="hero-tag">↑ 2.4% this month</span>
              <span className="hero-tag" style={{ background: 'rgba(255,255,255,0.1)' }}>+$254 vs April</span>
            </div>
          </div>

          {/* Accounts */}
          <div>
            <div className="section-label">
              <span>Accounts</span>
              <span className="action">See all</span>
            </div>
            <div className="accounts">
              {dashAccounts.map(a => (
                <div className="account-card" key={a.id}>
                  <div className="dot" style={{ background: a.color + '22' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: a.color }} />
                  </div>
                  <p className="name">{a.name}</p>
                  <p className="bank">{a.bank}</p>
                  <p className={'balance' + (a.balance < 0 ? ' neg' : '')}>
                    {visible
                      ? (a.balance < 0 ? '−' : '') + fmtCAD(Math.abs(a.balance))
                      : '••••'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Spending */}
          <div>
            <div className="section-label">
              <span>Spending this month</span>
              <span className="action">View details</span>
            </div>
            <div className="card card-pad">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>You've spent</p>
                  <p style={{ margin: '2px 0 0', fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>
                    {visible ? fmtCAD(spent) : '••••••'}
                    <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500, marginLeft: 6 }}>/ $2,500 budget</span>
                  </p>
                </div>
                <div className="tx-icon" style={{ background: 'var(--red-light)' }}>💸</div>
              </div>
              <div className="goal-bar" style={{ background: '#fde2df', height: 8 }}>
                <div className="goal-bar-fill" style={{ width: '74%', background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
              </div>
              <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--muted)' }}>74% of budget used · 8 days left in May</p>
            </div>
          </div>
        </div>

        {/* Right column: insights (sidebar on desktop) */}
        <div>
          <div className="section-label">
            <span>Quick insights</span>
          </div>
          <div className="card">
            {dashInsights.map((ins, i) => (
              <div className="card-row" key={i}>
                <div className="insight-icon" style={{ background: ins.bg }}>{ins.icon}</div>
                <p className="insight-text">{ins.text}</p>
              </div>
            ))}
          </div>

          <div className="section-label" style={{ marginTop: 20 }}>
            <span>This week</span>
          </div>
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Income</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>+$1,425</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Spending</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>−$412</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Net</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--purple)' }}>+$1,013</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
