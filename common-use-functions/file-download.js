  const handleBrochureDownload = async (fileLink) => {
    const fileUrl = fileLink;

    if (!fileUrl) {
      console.error("Link is missing.");
      return;
    }
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "download-new-file.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return fileUrl;// Not required this line
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
