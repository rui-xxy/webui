import HeroUITest from './components/HeroUITest'
import { HeroUIProvider } from '@heroui/react'

function TestApp(): React.JSX.Element {
  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-gray-50">
        <HeroUITest />
      </div>
    </HeroUIProvider>
  )
}

export default TestApp