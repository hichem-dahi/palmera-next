<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>{{ $t('Scan your barcode') }}</v-card-title>
      <v-card-text>
        <video ref="videoRef" class="barcode-video" autoplay playsinline></video>
        <p v-if="model">{{ $t('Detected Barcode:') }} {{ model }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="closeScanner">{{ $t('Close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const dialog = defineModel<boolean>('dialog')
const model = defineModel<number | null>('barcode')

const videoRef = ref<HTMLVideoElement | null>(null)

let videoStream: MediaStream | null = null

// Function to activate the barcode scanner
const activateScanner = async () => {
  try {
    // Request access to the back camera on Android devices
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      }
    })

    if (videoRef.value) {
      videoRef.value.srcObject = videoStream
      videoRef.value.setAttribute('playsinline', 'true')
      await videoRef.value.play()

      // Autofocus configuration
      const track = videoStream.getVideoTracks()[0] as any
      const capabilities = track.getCapabilities() as any
      if (capabilities.focusMode) {
        const focusMode = capabilities.focusMode.includes('continuous')
          ? 'continuous'
          : capabilities.focusMode.includes('auto')
            ? 'auto'
            : null
        if (focusMode) {
          await track.applyConstraints({ advanced: [{ focusMode }] })
        }
      }
    }

    // Initialize BarcodeDetector if supported
    if (!('BarcodeDetector' in globalThis)) {
      console.error('Barcode Detector is not supported by this browser.')
    } else {
      console.log('Barcode Detector supported!')

      const barcodeDetector = new BarcodeDetector()
      const videoElement = videoRef.value

      const detectBarcodes = async () => {
        if (videoElement) {
          try {
            const barcodes = await barcodeDetector.detect(videoElement)
            if (barcodes.length > 0) {
              barcodes.forEach((barcode: { rawValue: string | null | undefined }) => {
                console.log('Detected barcode:', barcode.rawValue)
                model.value = Number(barcode.rawValue)
              })
              closeScanner() // Stop scanning after a successful detection if needed
            }
          } catch (err) {
            console.error('Error detecting barcodes:', err)
          }
        }
      }
      const interval = setInterval(detectBarcodes, 200)
      onBeforeUnmount(() => clearInterval(interval))
    }
  } catch (err) {
    console.error('Error detecting barcodes:', err)
  }
}

const closeScanner = () => {
  dialog.value = false
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop())
    videoStream = null
  }
}

watch(videoRef, async (videoRef) => {
  if (videoRef) {
    await activateScanner()
  }
})

onBeforeUnmount(() => {
  closeScanner()
})
</script>

<style scoped>
.barcode-video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain; /* Ensure the video scales properly */
}
</style>
