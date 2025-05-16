# Venyu - AI Meeting Transcription

Venyu is a web application that provides real-time audio transcription for meetings. It uses OpenAI's Whisper API to transcribe audio recordings and provides a modern, user-friendly interface.

## Features

- Real-time audio recording
- Audio file upload support
- AI-powered transcription using OpenAI's Whisper API
- Modern, responsive UI with Tailwind CSS
- Toast notifications for user feedback

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- OpenAI API (Whisper)
- React Icons
- React Hot Toast

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/venyu.git
cd venyu
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click the "Start Recording" button to begin recording audio from your microphone.
2. Click "Stop Recording" when you're done.
3. Alternatively, click "Upload Recording" to transcribe an existing audio file.
4. Wait for the transcription to complete.
5. View your transcribed text in the transcription panel.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
