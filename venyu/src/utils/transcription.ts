interface Transcription {
  id: string
  text: string
  createdAt: Date
  userId: string
  meetingId: string
  duration: number
  status: 'processing' | 'completed' | 'failed'
}

export const transcribeAudio = async (audioBlob: Blob): Promise<Transcription> => {
  const formData = new FormData()
  formData.append('file', audioBlob, 'recording.webm')

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to transcribe audio')
  }

  return response.json()
}

export const formatDuration = (durationMs: number): string => {
  const hours = Math.floor(durationMs / 3600000)
  const minutes = Math.floor((durationMs % 3600000) / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
}

export const formatTranscription = (text: string): string => {
  // Add line breaks for sentences
  let formatted = text.replace(/\. /g, '.\n')
  
  // Add paragraph breaks for longer pauses
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  
  return formatted.trim()
} 