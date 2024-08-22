import { ElevenLabs, ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

const apiKey = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({ apiKey });

export const POST = async (req: Request) => {
  try {
    const { text } = await req.json();
    const responseStream = await client.textToSpeech.convert(
      "pMsXgVXv3BLzUgSXRplE",
      {
        optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
        output_format: ElevenLabs.OutputFormat.Mp32205032,
        text,
        voice_settings: {
          stability: 0.1,
          similarity_boost: 0.3,
          style: 1,
        },
      }
    );

    const chunks = [];
    for await (const chunk of responseStream) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="result.mp3"',
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
