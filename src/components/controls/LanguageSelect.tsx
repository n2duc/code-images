import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { languages } from "@/options"
import useStore from "@/store"
import { MagicWandIcon } from "@radix-ui/react-icons"

const LanguageSelect = () => {
  const language = useStore(state => state.name);
  const autoDetectLanguage = useStore(state => state.autoDetectLanguage);

  const handleChange = (language: string) => {
    if (language === "auto-detect") {
      useStore.setState({ autoDetectLanguage: true, name: "plaintext" })
    } else {
      useStore.setState({ autoDetectLanguage: false, name: language })
    }
  }

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">Language</label>
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger className="w-40">
          {autoDetectLanguage && <MagicWandIcon className="mr-2" />}
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="dark  max-h-[500px]">
          <SelectItem value="auto-detect">Auto Detect</SelectItem>
          {Object.entries(languages).map(([lang, name]) => (
            <SelectItem value={lang} key={lang}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelect