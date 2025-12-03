import React from 'react'
import { Button, Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react'

const HeroUITest: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">HeroUI 配置测试</h1>
        <p className="text-gray-600">如果你能看到以下组件正常显示，说明HeroUI配置成功！</p>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <Button color="primary" size="lg">
          主要按钮
        </Button>
        <Button color="secondary" variant="bordered" size="lg">
          次要按钮
        </Button>
        <Button color="success" variant="flat" size="lg">
          成功按钮
        </Button>
        <Button color="danger" variant="ghost" size="lg">
          危险按钮
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h3 className="text-lg font-semibold">HeroUI 组件测试卡片</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">进度条测试：</p>
            <Progress
              label="生产完成度"
              value={75}
              color="success"
              showValueLabel
              size="md"
            />
            <Progress
              label="质量检查"
              value={90}
              color="primary"
              showValueLabel
              size="md"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">标签组件测试：</p>
            <div className="flex gap-2 flex-wrap">
              <Chip color="primary" variant="solid">生产部</Chip>
              <Chip color="success" variant="bordered">品质部</Chip>
              <Chip color="warning" variant="dot">安环部</Chip>
              <Chip color="danger" variant="flat">财务部</Chip>
              <Chip color="default" variant="faded">仓储部</Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default HeroUITest