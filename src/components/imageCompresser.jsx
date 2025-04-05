import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1024,
    initialQuality: 0.7,
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
