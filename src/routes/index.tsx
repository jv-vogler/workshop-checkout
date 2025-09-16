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

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <div className="flex items-center justify-center">Hello World</div>
}
