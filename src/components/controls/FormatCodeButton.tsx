import { formatCode, formatterSupportedLanguages } from "@/lib/utils";
import { Button } from "../ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";
import useStore from "@/store";
import toast from "react-hot-toast";

const FormatCodeButton = () => {
  const language = useStore(state => state.name);
  const code = useStore(state => state.code);

  const handleFormatCode = () => {
    const isSupportedLanguage = formatterSupportedLanguages.includes(language || "");
    
    if (!isSupportedLanguage) {
      return toast.error("Formatting is not supported for this language");
    }

    if (!code || !language) {
      return;
    }
    toast.promise(
      formatCode(code, language).then((formatted) => {
        useStore.setState({ code: formatted });
        useStore.setState({ name: language });
      }),
      {
        loading: "Formatting code...",
        success: "Code formatted",
        error: (data) => {
          return (
            <div className="space-y-2 overflow-hidden">
              <p className="font-medium">Code formatting failed</p>
              <pre className="w-full overflow-auto text-xs scrollbar-hide bg-gray-a3 p-2.5 rounded">
                <code className="w-full">{data.message}</code>
              </pre>
            </div>
          );
        },
      }
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={handleFormatCode}
    >
      <MagicWandIcon className="mr-2" />
      Format Code
    </Button>
  )
}

export default FormatCodeButton