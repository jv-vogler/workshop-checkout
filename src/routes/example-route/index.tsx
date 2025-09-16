import { createFileRoute } from '@tanstack/react-router'
import { TypographyHeading, TypographyP } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/example-route/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-10 justify-center w-96">
        <TypographyHeading level={1}>h1</TypographyHeading>

        <TypographyHeading level={2}>h2</TypographyHeading>

        <TypographyHeading level={3}>h3</TypographyHeading>

        <TypographyHeading level={4}>h4</TypographyHeading>

        <TypographyP>p</TypographyP>

        <Button>Button</Button>

        <div className="flex flex-col gap-1">
          <Label>Label</Label>
          <Input />
          <Textarea />
          <Switch />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
