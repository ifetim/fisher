'use client';

import { useState, useEffect, useRef } from 'react';

const UNIVERSITIES = [
  {
    id: 'uofa',
    name: 'University of Alberta - Edmonton',
    mapQuery: 'University+of+Alberta+Edmonton',
    campus: { name: 'Vietnamese Sub - SUB Food Court', price: 12.5, place: 'SUB Food Court on Campus' },
    nearby: { name: 'Vietnamese Sub - Pho Phu Quoc', price: 8.5, place: 'Whyte Ave (1.2 km away)' },
  },
  {
    id: 'ucalgary',
    name: 'University of Calgary - Calgary',
    mapQuery: 'University+of+Calgary+Calgary',
    campus: { name: 'Banh Mi / Sub - MacHall', price: 13.0, place: 'MacEwan Hall Food Court' },
    nearby: { name: 'Banh Mi - Saigon Express', price: 7.5, place: 'Crowchild Trail (0.9 km away)' },
  },
  {
    id: 'mcgill',
    name: 'McGill University - Montreal',
    mapQuery: 'McGill+University+Montreal',
    campus: { name: 'Sandwich / Sub - Solin Hall', price: 14.0, place: 'Campus Cafeteria' },
    nearby: { name: 'Vietnamese Sub - Nhu Y', price: 7.0, place: 'Saint-Laurent Blvd (0.6 km away)' },
  },
  {
    id: 'ubc',
    name: 'UBC - Vancouver',
    mapQuery: 'University+of+British+Columbia+Vancouver',
    campus: { name: 'Sub Sandwich - AMS Nest', price: 13.5, place: 'AMS Student Nest Food Court' },
    nearby: { name: 'Vietnamese Sub - Kim Chau', price: 8.0, place: 'Dunbar St (2.1 km away)' },
  },
  {
    id: 'utoronto',
    name: 'University of Toronto - Toronto',
    mapQuery: 'University+of+Toronto+Toronto',
    campus: { name: 'Sub - Hart House Cafeteria', price: 14.5, place: 'Hart House' },
    nearby: { name: 'Banh Mi - Pho Pasteur', price: 7.5, place: 'Spadina Ave (0.8 km away)' },
  },
];

export default function SavingsSection() {
  const [selectedUni, setSelectedUni] = useState(UNIVERSITIES[0]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const monthlySavings = Math.round((selectedUni.campus.price - selectedUni.nearby.price) * 22);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const mapSrc = `https://maps.google.com/maps?q=${selectedUni.mapQuery}&output=embed&z=15`;

  return (
    <section className="savings-section" ref={sectionRef} id="savings">
      <h2 className={`savings-title fade-in ${visible ? 'visible' : ''}`}>
        Wondering how much you could be <span>saving</span> if you ate somewhere else?
      </h2>

      <div className={`uni-picker fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
        <label className="uni-label" htmlFor="uni-select">Pick your university</label>
        <select
          id="uni-select"
          className="uni-select"
          value={selectedUni.id}
          onChange={(e) => {
            const found = UNIVERSITIES.find(u => u.id === e.target.value);
            if (found) setSelectedUni(found);
          }}
        >
          {UNIVERSITIES.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className={`food-comparison fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
        <div className="food-card campus">
          <span className="food-card-tag">On Campus</span>
          <div className="food-card-name">{selectedUni.campus.name}</div>
          <div className="food-card-place">{selectedUni.campus.place}</div>
          <div className="food-card-price">
            ${selectedUni.campus.price.toFixed(2)} <span>CAD/meal</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div className="vs-badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '1.5rem' }}>VS</div>
        </div>

        <div className="food-card offcampus">
          <span className="food-card-tag">Nearby</span>
          <div className="food-card-name">{selectedUni.nearby.name}</div>
          <div className="food-card-place">{selectedUni.nearby.place}</div>
          <div className="food-card-price">
            ${selectedUni.nearby.price.toFixed(2)} <span>CAD/meal</span>
          </div>
        </div>
      </div>

      <div className={`savings-badge fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.45s' }}>
        <div className="savings-badge-label">Potential monthly savings (22 lunches)</div>
        <div className="savings-badge-amount">${monthlySavings} CAD</div>
        <div className="savings-badge-sub">Over 4 years, that could save you ${(monthlySavings * 48).toLocaleString()} towards tuition</div>
      </div>

      <div className={`map-wrapper fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0.6s' }}>
        <iframe
          src={mapSrc}
          title={`Map near ${selectedUni.name}`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center'
      }}>
        Prices are approximate averages based on 2024 campus menus. Connect your bank via Plaid after sign-up to see your real spending.
      </p>
    </section>
  );
}
