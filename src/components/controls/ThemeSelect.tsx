import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { themes } from "@/options"
import useStore from "@/store"

const ThemeSelect = () => {
  const theme = useStore(state => state.theme);
  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">Theme</label>
      <Select value={theme} onValueChange={(theme) => useStore.setState({ theme })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Theme" />
        </SelectTrigger>
        <SelectContent className="dark">
          {Object.entries(themes).map(([name, theme]) => (
            <SelectItem value={name} key={name}>
              <div className="flex gap-2 items-center">
                <div className={cn("size-4 rounded-full", theme.background)} />
                <span className="capitalize">{name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ThemeSelect