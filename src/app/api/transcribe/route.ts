import { NextResponse } from 'next/server';
import { transcribeAudio } from '../../../../venyu/src/utils/whisper';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const transcription = await transcribeAudio(buffer);

    return NextResponse.json({
      text: transcription,
      userId: 'temp-user-id', // This will be replaced with actual user ID when auth is implemented
      meetingId: 'temp-meeting-id', // This will be replaced with actual meeting ID when meetings are implemented
      duration: 0, // This will be calculated from the audio file when implemented
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 