import DashboardLayout from './components/DashboardLayout'
import { NextUIProvider } from '@nextui-org/react'

function App(): React.JSX.Element {
  return (
    <NextUIProvider>
      <DashboardLayout />
    </NextUIProvider>
  )
}

export default App
