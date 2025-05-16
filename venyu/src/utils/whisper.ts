import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  // Create a temporary directory for the audio file
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Save the audio buffer to a temporary WAV file
  const tempFile = path.join(tempDir, `audio-${Date.now()}.wav`);
  fs.writeFileSync(tempFile, audioBuffer);

  try {
    // Run whisper-cli to transcribe the audio
    const whisperPath = path.join(process.cwd(), 'whisper-cpp/bin/whisper-cli');
    const modelPath = path.join(process.cwd(), 'whisper-cpp/models/ggml-base.bin');
    
    const { stdout } = await execAsync(`${whisperPath} -m ${modelPath} -f ${tempFile}`);
    
    // Clean up the temporary file
    fs.unlinkSync(tempFile);
    
    return stdout.trim();
  } catch (error) {
    // Clean up the temporary file in case of error
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    throw new Error('Failed to transcribe audio');
  }
} 