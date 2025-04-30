let MEDUSA_BACKEND_URL = "https://shopecommerc-backend-copy-production.up.railway.app"
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export async function uploadReceipt(file: File, cartId: string) {
    try {
        const formData = new FormData();
  
        formData.append('files', file);
      
        formData.append("cart_id", cartId);
        
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/receipts`, {
            method: "POST",
            headers: {
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading receipt:", error);
        throw new Error("Failed to upload receipt");
    }
}