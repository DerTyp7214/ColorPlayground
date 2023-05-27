<script lang="ts">
  import {
    associateColor,
    blue,
    green,
    hexToRgb,
    red,
    rgb,
  } from '../colorUtils'
  import { getPixelData, imageUrlFromPixelData, pickFile } from '../utils'

  let originalPixelData: PixelData | null = null
  let parsedPixelData: PixelData | null = null

  let redColor = '#FF0000'
  let greenColor = '#00FF00'
  let blueColor = '#0000FF'

  let loading = false

  $: originalImage = originalPixelData
    ? imageUrlFromPixelData(originalPixelData)
    : null
  $: parsedImage = parsedPixelData
    ? imageUrlFromPixelData(parsedPixelData)
    : null

  async function newFile(event: MouseEvent) {
    const files: FileList | null = await pickFile('image/*').catch(() => null)
    if (!files) return

    originalPixelData = await getPixelData(files[0])
  }

  async function apply(event: MouseEvent) {
    loading = true

    const tmpPixelData = {
        width: originalPixelData.width,
        height: originalPixelData.height,
        data: new Uint8ClampedArray(originalPixelData.data),
    }
    parsedPixelData = null
    await new Promise((resolve) => {
      const redValue = hexToRgb(redColor)
      const greenValue = hexToRgb(greenColor)
      const blueValue = hexToRgb(blueColor)

      for (let i = 0; i < originalPixelData.data.length; i += 4) {
        const redData = originalPixelData.data[i]
        const greenData = originalPixelData.data[i + 1]
        const blueData = originalPixelData.data[i + 2]

        const newColor = associateColor(
          rgb(redData, greenData, blueData),
          redValue,
          greenValue,
          blueValue
        )

        tmpPixelData.data[i] = red(newColor)
        tmpPixelData.data[i + 1] = green(newColor)
        tmpPixelData.data[i + 2] = blue(newColor)
      }
      resolve(true)
    })

    parsedPixelData = tmpPixelData

    loading = false
  }
</script>

<div class="flex">
  <div class="flex flex-col w-1/2">
    <button on:click={newFile} disabled={loading}>Pick File</button>
    <button on:click={apply}>Apply</button>

    <div class="flex flex-col">
      <div id="color-picker-red">
        <span>Red</span>
        <input type="color" bind:value={redColor} disabled={loading} />
      </div>
      <div id="color-picker-green">
        <span>Green</span>
        <input type="color" bind:value={greenColor} disabled={loading} />
      </div>
      <div id="color-picker-blue">
        <span>Blue</span>
        <input type="color" bind:value={blueColor} disabled={loading} />
      </div>
    </div>
  </div>

  <div class="flex h-1/2 w-1/2">
    {#if originalImage}
      <img
        src={originalImage}
        alt="Not so Pog"
        class="max-h-[50vh] aspect-square"
      />
    {/if}

    {#if parsedImage}
      <img src={parsedImage} alt="Pog" class="max-h-[50vh] aspect-square" />
    {/if}
  </div>
</div>
