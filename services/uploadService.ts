// Reemplaza esta URL con la que obtuviste al publicar tu Google Apps Script
// Si no la tienes aún, las fotos no se subirán, pero la app no fallará (simulará).
const GOOGLE_SCRIPT_URL = "TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI"; 

interface UploadResponse {
  result: string;
  url?: string;
  error?: string;
}

export const uploadImageToDrive = async (base64Image: string, filename: string): Promise<string | null> => {
  if (GOOGLE_SCRIPT_URL.includes("TU_URL")) {
    console.warn("Google Script URL no configurada. Simulando subida.");
    return null; 
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        image: base64Image,
        filename: filename
      }),
      // 'text/plain' evita el "preflight" CORS en Apps Script simple
      headers: { "Content-Type": "text/plain" }, 
    });

    const data: UploadResponse = await response.json();
    
    if (data.result === "success" && data.url) {
      return data.url;
    } else {
      console.error("Error en respuesta de Script:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error de red subiendo imagen:", error);
    return null;
  }
};