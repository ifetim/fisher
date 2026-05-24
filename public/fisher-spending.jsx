/* Fisher — responsive Spending */

const txCategories = {
  food:      { icon: '🍔', bg: 'rgba(249,115,22,0.15)', label: 'Food' },
  groceries: { icon: '🛒', bg: 'rgba(34,197,94,0.15)',  label: 'Groceries' },
  transit:   { icon: '🚇', bg: 'rgba(59,130,246,0.15)', label: 'Transit' },
  shop:      { icon: '🛍️', bg: 'rgba(134,59,255,0.15)', label: 'Shopping' },
  sub:       { icon: '🎵', bg: 'rgba(236,72,153,0.15)', label: 'Subscription' },
  income:    { icon: '💰', bg: 'rgba(34,197,94,0.15)',  label: 'Income' },
  bills:     { icon: '⚡', bg: 'rgba(245,158,11,0.15)', label: 'Bills' },
};

const txData = [
  { day: 'Today',     items: [
    { id: 1, merchant: 'Coffee Time',    cat: 'food',      amount: -6.50 },
    { id: 2, merchant: 'Spotify',        cat: 'sub',       amount: -10.99 },
  ]},
  { day: 'Yesterday', items: [
    { id: 3, merchant: 'Loblaws',        cat: 'groceries', amount: -84.20 },
    { id: 4, merchant: 'TTC',            cat: 'transit',   amount: -3.30 },
    { id: 5, merchant: 'Payroll deposit',cat: 'income',    amount: 2850.00 },
  ]},
  { day: 'May 18',    items: [
    { id: 6, merchant: 'Amazon',         cat: 'shop',      amount: -62.30 },
    { id: 7, merchant: 'Hydro One',      cat: 'bills',     amount: -94.00 },
    { id: 8, merchant: 'Five Guys',      cat: 'food',      amount: -22.40 },
  ]},
];

// Mini bar chart breakdown
const breakdown = [
  { label: 'Groceries',    value: 412, color: '#22c55e' },
  { label: 'Food',         value: 312, color: '#f97316' },
  { label: 'Subscriptions',value: 94,  color: '#ec4899' },
  { label: 'Shopping',     value: 286, color: '#863bff' },
  { label: 'Transit',      value: 64,  color: '#3b82f6' },
  { label: 'Bills',        value: 679, color: '#f59e0b' },
];

function SpendingScreen({ connected, onConnect }) {
  const max = Math.max(...breakdown.map(b => b.value));
  return (
    <div data-screen-label="Spending">
      <div className="screen-header">
        <div className="greeting">
          <p>May 2025</p>
          <h1>Spending</h1>
        </div>
        <button className="eye-btn dark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
          Filter
        </button>
      </div>

      {/* Summary chips */}
      <div className="summary-chips">
        <div className="chip red">
          <p className="chip-label">SPENT</p>
          <p className="chip-amount">$1,847</p>
        </div>
        <div className="chip green">
          <p className="chip-label">INCOME</p>
          <p className="chip-amount">$2,850</p>
        </div>
        <div className="chip purple">
          <p className="chip-label">NET</p>
          <p className="chip-amount">+$1,003</p>
        </div>
        <div className="chip neutral">
          <p className="chip-label">VS APRIL</p>
          <p className="chip-amount">−12%</p>
        </div>
      </div>

      {/* Plaid */}
      {!connected ? (
        <div className="plaid-card">
          <div className="plaid-icon">🏦</div>
          <div className="body">
            <p className="title">Connect your bank</p>
            <p className="sub">Auto-sync real transactions via Plaid</p>
          </div>
          <button className="plaid-btn" onClick={onConnect}>Connect</button>
        </div>
      ) : (
        <div className="plaid-card connected">
          <div className="plaid-icon green-bg">✓</div>
          <div className="body">
            <p className="title">Bank connected</p>
            <p className="sub">Synced via Plaid · just now</p>
          </div>
        </div>
      )}

      <div className="grid cols-12">
        {/* Tx list */}
        <div>
          <div className="section-label"><span>Recent transactions</span><span className="action">Export</span></div>
          {txData.map(group => (
            <React.Fragment key={group.day}>
              <p style={{ margin: '14px 2px 8px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.day}</p>
              <div className="card" style={{ marginBottom: 8 }}>
                {group.items.map(tx => {
                  const cat = txCategories[tx.cat];
                  const pos = tx.amount > 0;
                  return (
                    <div className="card-row" key={tx.id}>
                      <div className="tx-icon" style={{ background: cat.bg }}>{cat.icon}</div>
                      <div className="tx-meta">
                        <p className="merchant">{tx.merchant}</p>
                        <p className="cat">{cat.label}</p>
                      </div>
                      <span className={'tx-amount' + (pos ? ' pos' : '')}>
                        {pos ? '+' : '−'}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Category breakdown */}
        <div>
          <div className="section-label"><span>By category</span></div>
          <div className="card card-pad">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {breakdown.map(b => (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>${b.value}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (b.value/max*100) + '%', background: b.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SpendingScreen = SpendingScreen;
