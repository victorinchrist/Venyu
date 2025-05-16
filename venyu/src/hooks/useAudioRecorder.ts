import { useState, useCallback } from 'react'

interface RecordingState {
  isRecording: boolean
  stream: MediaStream | null
  audioChunks: Blob[]
  startTime: number
}

export const useAudioRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    stream: null,
    audioChunks: [],
    startTime: 0,
  })

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.start()
      setRecordingState({
        isRecording: true,
        stream,
        audioChunks,
        startTime: Date.now(),
      })

      return mediaRecorder
    } catch (error) {
      console.error('Error starting recording:', error)
      throw error
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (recordingState.stream) {
      recordingState.stream.getTracks().forEach((track) => track.stop())
    }

    const audioBlob = new Blob(recordingState.audioChunks, { type: 'audio/webm' })
    setRecordingState({
      isRecording: false,
      stream: null,
      audioChunks: [],
      startTime: 0,
    })

    return audioBlob
  }, [recordingState])

  return {
    isRecording: recordingState.isRecording,
    startRecording,
    stopRecording,
  }
} 