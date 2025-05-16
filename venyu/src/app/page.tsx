'use client'

import { useState, useRef } from 'react'
import { FaMicrophone, FaStop, FaUpload } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await handleTranscription(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Failed to start recording')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast.success('Recording stopped')
    }
  }

  const handleTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      setTranscription(data.text)
      toast.success('Transcription completed')
    } catch (error) {
      console.error('Error transcribing audio:', error)
      toast.error('Failed to transcribe audio')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const audioBlob = new Blob([file], { type: file.type })
      await handleTranscription(audioBlob)
    } catch (error) {
      console.error('Error handling file upload:', error)
      toast.error('Failed to process audio file')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Venyu - AI Meeting Transcription
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center px-6 py-3 rounded-full text-white font-semibold transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <FaStop className="mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <FaMicrophone className="mr-2" />
                  Start Recording
                </>
              )}
            </button>

            <label
              className={`flex items-center px-6 py-3 rounded-full text-white font-semibold bg-green-500 hover:bg-green-600 cursor-pointer transition-colors ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaUpload className="mr-2" />
              Upload Audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>

          {isProcessing && (
            <div className="text-center text-gray-600 dark:text-gray-300 mb-4">
              Processing audio... This may take a few moments.
            </div>
          )}

          {transcription && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Transcription</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap">{transcription}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 