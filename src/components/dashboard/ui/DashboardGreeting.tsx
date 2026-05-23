import type { DashboardGreetingProps } from '../types'

/** UI slot — replace with final typography. */
export function DashboardGreeting({ greeting }: DashboardGreetingProps) {
  return (
    <h1 className="dash-ui__greeting" data-ui-slot="greeting">
      {greeting}
    </h1>
  )
}
