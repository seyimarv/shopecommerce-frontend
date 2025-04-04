import { sdk } from "../../../config"

export async function uploadReceipt(file: File, cartId: string) {
    try {

        const formattedFile = await transformFile(file)

        const response = await sdk.client.fetch<{
            id: string
        }>(
            `/store/receipts`,
            {
                method: "POST",
                body: {
                    file: formattedFile,
                    cart_id: cartId
                }
            }
        )

        return response
    } catch (error) {
        console.error("Error uploading receipt:", error)
        throw new Error("Failed to upload receipt")
    }
}


async function transformFile(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            const base64Content = (reader.result as string).split(',')[1]

            resolve({
                filename: file.name,
                mimeType: file.type,
                content: base64Content,
                access: "public"
            })
        }

        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }

        reader.readAsDataURL(file)
    })
}