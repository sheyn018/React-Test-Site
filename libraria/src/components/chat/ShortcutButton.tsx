import { Icon as ChakraIcon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { IoMdCopy, IoIosCheckmarkCircle } from "react-icons/io";
import { FiMail } from "react-icons/fi";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { OrganizationResponse, LibraryResponse } from "@/types";

type ShortcutButtonProps = {
  shortcut: "email" | "copy";
  question?: string;
  message: string;
  organization?: OrganizationResponse;
  library: LibraryResponse;
};

const ShortcutButton: React.FC<ShortcutButtonProps> = ({
  shortcut,
  message,
  question,
  organization,
  library,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShortcut = async () => {
    if (shortcut === "copy") {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } else if (shortcut === "email") {
      window.location.href = `mailto:?body=${encodeURIComponent(message)}`;
    }
  };

  const handleBlur = () => {
    setCopied(false);
  };

  const icons = {
    copy: copied ? IoIosCheckmarkCircle : IoMdCopy,
    email: FiMail,
    "add-qa": AiFillPlusCircle,
  };

  const Icon = icons[shortcut];

  return (
    <div style={{ position: "relative" }}>
      <Tooltip label={shortcut}>
        <ChakraIcon
          color="main.brown"
          onClick={handleShortcut}
          as={Icon}
          _hover={{ opacity: "50%" }}
          cursor="pointer"
          onBlur={handleBlur}
        />
      </Tooltip>
    </div>
  );
};

export default ShortcutButton;
