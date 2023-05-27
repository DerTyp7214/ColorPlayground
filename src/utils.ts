export async function pickFile(type: string, multiple: boolean = false) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = type
  input.multiple = multiple
  input.click()
  return new Promise<FileList>((resolve, reject) => {
    input.onchange = () => {
      resolve(input.files)
    }
    input.oncancel = () => {
      reject(null)
    }
  })
}

export async function getPixelData(file: File): Promise<PixelData> {
  const image = await loadImage(file).catch(() => null)
  if (!image) throw new Error('Invalid image')
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  const imageData = context.getImageData(0, 0, image.width, image.height)
  return {
    width: image.width,
    height: image.height,
    data: imageData.data,
  }
}

export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(null)
    }
    image.src = URL.createObjectURL(file)
  })
}

export function imageUrlFromPixelData(pixelData: PixelData): string {
  const canvas = document.createElement('canvas')
  canvas.width = pixelData.width
  canvas.height = pixelData.height
  const context = canvas.getContext('2d')
  context.putImageData(
    new ImageData(pixelData.data, pixelData.width, pixelData.height),
    0,
    0
  )
  return canvas.toDataURL()
}
