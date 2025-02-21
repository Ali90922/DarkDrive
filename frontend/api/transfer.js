const uploadEndpoint = "http://98.83.145.159:8000/upload/";

export const uploadFiles = async (files) => {
  try {
    const results = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed for ${file.name}`);
      }

      results.push({
        fileName: file.name,
        success: true,
      });
    }

    return {
      success: true,
      message: "All files uploaded successfully",
      results,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};
