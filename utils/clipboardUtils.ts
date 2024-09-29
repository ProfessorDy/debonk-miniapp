// Function to copy text to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("Text copied!");
      } else {
        console.log("Clipboard API not supported");
      }
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };
  
  // Function to paste text from clipboard
  export const pasteFromClipboard = async (): Promise<string | null> => {
    try {
      if (navigator.clipboard) {
        const clipboardText = await navigator.clipboard.readText();
        return clipboardText;
      } else {
        console.log("Clipboard API not supported");
        return null;
      }
    } catch (error) {
      console.error("Failed to paste content: ", error);
      return null;
    }
  };
  