import {
  DownloadIcon,
  ImageIcon,
  Link2Icon,
  Share2Icon,
  SizeIcon
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "../ui/dropdown-menu";
import { toBlob, toPng, toSvg } from "html-to-image";
import { toast } from "react-hot-toast";
import useStore from "@/store";
import { useState } from "react";

const ExportOptions = ({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement>;
}) => {
  const [exportSize, setExportSize] =  useState<2 | 4 | 6>(2);
  const title = useStore(state => state.title);

  const copyImage = async (): Promise<void> => {
    const imgBlob = await toBlob(targetRef.current as HTMLElement, {
      pixelRatio: 2,
    });
    if (!imgBlob) {
      console.error("Failed to generate image blob");
      return;
    }
    const img = new ClipboardItem({ "image/png": imgBlob });
    navigator.clipboard.write([img]);
  };

  const handleCopyImage = () => {
    toast.promise(copyImage(), {
      loading: "Copying...",
      success: "Image copied to clipboard!",
      error: "Something went wrong!",
    });
  };

  const copyLink = () => {
    const state = useStore.getState();
    const queryParams = new URLSearchParams(
      Object.entries(state).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value : String(value);
        return acc;
      }, {} as Record<string, string>)
    );
    queryParams.set('code', btoa(state.code));
    navigator.clipboard.writeText(`${location.href}?${queryParams.toString()}`);
  };

  const saveImage = async (name: string, format: "PNG" | "SVG"): Promise<void> => {
    if (!targetRef.current) return;
    let imgUrl: string | undefined;
    let filename: string | undefined;

    const options = { pixelRatio: exportSize };

    switch (format) {
      case "PNG":
        imgUrl = await toPng(targetRef.current, options);
        filename = `${name}${exportSize > 2 ? `_${exportSize}x` : ""}.png`;
        break;
      case "SVG":
        imgUrl = await toSvg(targetRef.current, options);
        filename = `${name}${exportSize > 2 ? `_${exportSize}x` : ""}.svg`;
        break;

      default:
        return;
    }

    if (imgUrl && filename) {
      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = filename;
      a.click();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="destructive">
          <Share2Icon className="mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark">
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2" onClick={handleCopyImage}>
            <ImageIcon />
            Copy Image
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => {
            copyLink();
            toast.success("Link copied to clipboard!");
          }}>
            <Link2Icon />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="gap-2"
            onClick={() => {
              toast.promise(saveImage(title, "PNG"), {
                loading: "Exporting PNG image...",
                success: "Exported successfully!",
                error: "Something went wrong!",
              })
            }}
          >
            <DownloadIcon />
            Save as PNG
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2"
            onClick={() => {
              toast.promise(saveImage(title, "SVG"), {
                loading: "Exporting SVG image...",
                success: "Exported successfully!",
                error: "Something went wrong!",
              })
            }}
          >
            <DownloadIcon />
            Save as SVG
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SizeIcon /> Size
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="dark">
                <DropdownMenuRadioGroup value={exportSize.toString()} onValueChange={(value) => setExportSize(parseInt(value) as 2 | 4 | 6)}>
                  <DropdownMenuRadioItem value="2">2x</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="4">4x</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="6">6x</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
