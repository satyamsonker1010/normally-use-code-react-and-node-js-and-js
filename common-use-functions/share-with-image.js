async function fetchImageAsFile(url) {
    try {
      const response = await fetch(url, {
        headers: {
          accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-fetch-dest": "image",
          "sec-fetch-mode": "no-cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: "https://emversity.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error fetching the image:", error);
      throw error;
    }
  }

  async function handleShare() {
    if (!isClickShareBtn?.value) {
      isClickShareBtn.onTrue();

      if (!certificateDataCopy?.mobile_certificate_url) {
        console.log("Share certificate not found");
        isClickShareBtn.onFalse();
        return;
      }
      const bucketNameFileName = extractFileNameAndBucketName(
        certificateDataCopy?.mobile_certificate_url
      );
      const { bucketName, filePath } = bucketNameFileName;
      const signedUrl = await signedUrlGenerateByBucketNameAndFileName({
        bucketName,
        fileName: filePath,
      });
      const { url } = signedUrl;

      const certificateUrl = url ?? certificateDataCopy?.mobile_certificate_url;
      try {
        const file = await fetchImageAsFile(certificateUrl);

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Check out my certificate",
            text: "Sharing my latest certificate from emevrsity!",
          });
          console.log("Image shared successfully!");
        } else {
          console.log("File sharing is not supported on this browser.");
        }
      } catch (error) {
        console.error("Error sharing the image:", error);
      } finally {
        setTimeout(() => isClickShareBtn.onFalse(), 2500);
      }
    }
  }
