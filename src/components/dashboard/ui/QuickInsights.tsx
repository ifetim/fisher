import type { QuickInsightsProps } from '../types'

/** UI slot — replace with styled insight cards; Gemini later via button. */
export function QuickInsights({ insights }: QuickInsightsProps) {
  return (
    <section className="dash-ui__block" data-ui-slot="quick-insights">
      <h2 className="dash-ui__label">Quick insights</h2>
      <ul className="dash-ui__insights">
        {insights.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <p className="dash-ui__insights-note">Based on your recent transactions.</p>
    </section>
  )
}
