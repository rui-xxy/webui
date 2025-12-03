import DashboardLayout from './components/DashboardLayout'
import { ThemeProvider } from './providers/theme'

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <DashboardLayout />
    </ThemeProvider>
  )
}

export default App
