import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    initialQuality: 0.9,
    useWebWorker: true,
    fileType: "image/*",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file;
  }
};
