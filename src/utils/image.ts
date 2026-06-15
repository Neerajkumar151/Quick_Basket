export const resizeImage = (file: File, maxWidth = 2048, maxHeight = 2048, quality = 0.9): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Fill background white for transparent PNGs before converting to JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to specified quality JPEG
        resolve(canvas.toDataURL("image/jpeg", quality)); 
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const resolveImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Clean up backend double uploads bug if present
  const cleanPath = path.replace(/^\/?uploads\/uploads\//, "uploads/").replace(/^\//, "");

  if (import.meta.env.DEV) {
    return `/${cleanPath}`; // Local vite proxy will intercept and add ngrok bypass header
  }

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, "") || "";
  return `${baseUrl}/${cleanPath}`;
};
