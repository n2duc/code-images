import { useEffect, useRef } from "react";

import CodeEditor from "./components/CodeEditor";
import { cn } from "./lib/utils";
import { fonts, FontStyle, themes, ThemeStyle } from "./options";
import useStore from "./store";
import { Card, CardContent } from "./components/ui/card";

import {
  BackgroundSwitch,
  DarkModeSwitch,
  ExportOptions,
  FontSelect,
  FontSizeInput,
  LanguageSelect,
  PaddingSlider,
  ThemeSelect,
} from "@/components/controls";

import { Resizable } from "re-resizable";
import FormatCodeButton from "./components/controls/FormatCodeButton";

const App = () => {
  const theme = useStore((state) => state.theme) as ThemeStyle;
  const fontStyle = useStore((state) => state.fontStyle) as FontStyle;
  const padding = useStore((state) => state.padding);
  const showBackground = useStore((state) => state.showBackground);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (!queryParams.size) return;

    const state = Object.fromEntries(queryParams);

    useStore.setState({
      ...state,
      code: state.code ? atob(state.code as string) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize) || 18,
      padding: Number(state.padding) || 64,
    });
  }, []);

  return (
    <main className="dark min-h-screen flex justify-center items-center bg-neutral-950 text-white">
      <link
        rel="stylesheet"
        href={themes[theme].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle].src}
        crossOrigin="anonymous"
      />

      <Resizable
        enable={{ left: true, right: true }}
        minWidth={padding * 2 + 400}
      >
        <div
          className={cn(
            "overflow-hidden mb-10 transition-all ease-out rounded-xl",
            showBackground ? themes[theme].background : "bg-png"
          )}
          style={{ padding }}
          ref={editorRef}
        >
          <CodeEditor />
        </div>
      </Resizable>

      <Card className="fixed bottom-5 py-6 px-8 mx-6 bg-neutral-900/90 backdrop-blur">
        <CardContent className="flex flex-wrap gap-6 p-0">
          <ThemeSelect />
          <LanguageSelect />
          <FontSelect />
          <FontSizeInput />
          <PaddingSlider />
          <BackgroundSwitch />
          <DarkModeSwitch />
          <div className="w-px bg-neutral-800" />
          <div className="place-self-center flex gap-2">
            <ExportOptions targetRef={editorRef} />
            <FormatCodeButton />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default App;
