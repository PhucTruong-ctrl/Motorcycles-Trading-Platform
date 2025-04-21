
const normalizeFileName = (fileName) => {
  const withoutAccents = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const safeFileName = withoutAccents.replace(/[^a-zA-Z0-9\-._]/g, "_");

  return safeFileName;
};

export default normalizeFileName;
