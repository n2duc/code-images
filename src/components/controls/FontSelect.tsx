import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { fonts } from "@/options"
import useStore from "@/store"

const FontSelect = () => {
  const fontStyle = useStore(state => state.fontStyle);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">Language</label>
      <Select value={fontStyle} onValueChange={fontStyle => useStore.setState({ fontStyle })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Font" />
        </SelectTrigger>
        <SelectContent className="dark  max-h-[500px]">
          {Object.entries(fonts).map(([id, font]) => (
            <SelectItem value={id} key={id}>
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default FontSelect