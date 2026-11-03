import { apiClient } from '@/lib/http-client'

export type DetectionSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export type DetectionBox = { top: number; left: number; width: number; height: number }
export type Detection = { id: string; label: 'Pothole' | 'Crack' | 'Debris'; confidence: number; severity: DetectionSeverity; box: DetectionBox; recommendation: string }
export type DetectionResult = { model: 'YOLO11'; processedAt: string; detections: Detection[] }
export type DetectionHistoryItem = { id: string; fileName: string; processedAt: string; detectionCount: number; averageConfidence: number; severity: DetectionSeverity; status: 'Completed' | 'Failed' }

export const detectionHistory: DetectionHistoryItem[] = []

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please upload a JPG, PNG, WEBP, or other image file.'
  if (file.size > 10 * 1024 * 1024) return 'Image must be smaller than 10 MB.'
  return null
}

type BackendComplaint = { id: string }
type BackendImage = { id: string }
type BackendBox = { x1: number; y1: number; x2: number; y2: number; confidence: number; label: string }
type BackendDetection = { model_name: string; result_metadata: { detections?: BackendBox[]; image_width?: number; image_height?: number } | null; processing_time_ms: number | null; detection_count: number; status: string }
type BackendSeverity = { severity: string }

function severityFromBackend(value: string): DetectionSeverity {
  if (value === 'CRITICAL') return 'Critical'
  if (value === 'HIGH') return 'High'
  if (value === 'MEDIUM') return 'Medium'
  return 'Low'
}

/** Uploads the image to the authenticated FastAPI flow and returns measured model output. */
export async function runYolo11Detection(file: File): Promise<DetectionResult> {
  const complaint = await apiClient.post<BackendComplaint>('/complaints', {
    title: 'AI image analysis',
    description: 'Image submitted from the administrator AI detection workspace for pothole analysis.',
    location: { latitude: 20.5937, longitude: 78.9629, area: 'AI analysis workspace', zone: 'Unassigned' },
  })

  const formData = new FormData()
  formData.append('image', file, file.name)
  const image = await apiClient.post<BackendImage>(`/complaints/${complaint.data.id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const detection = await apiClient.post<BackendDetection>(`/ai/images/${image.data.id}/detect`)
  const metadata = detection.data.result_metadata
  const imageWidth = metadata?.image_width ?? 1
  const imageHeight = metadata?.image_height ?? 1
  const severityResponse = await apiClient.post<BackendSeverity>(`/ai/images/${image.data.id}/severity`)
  const severity = severityFromBackend(severityResponse.data.severity)
  const detections = (metadata?.detections ?? []).map((box, index) => ({
    id: `${image.data.id}-${index + 1}`,
    label: 'Pothole' as const,
    confidence: box.confidence,
    severity,
    box: {
      top: (box.y1 / imageHeight) * 100,
      left: (box.x1 / imageWidth) * 100,
      width: ((box.x2 - box.x1) / imageWidth) * 100,
      height: ((box.y2 - box.y1) / imageHeight) * 100,
    },
    recommendation: 'Review the marked area and schedule a field inspection.',
  }))

  return {
    model: 'YOLO11',
    processedAt: new Date().toISOString(),
    detections,
  }
}
