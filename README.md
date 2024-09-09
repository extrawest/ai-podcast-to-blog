# Podcast Summary & Q&A App

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![Maintaner](https://img.shields.io/static/v1?label=Nariman%20Mamutov&message=Maintainer&color=red)](mailto:nairman.mamutov@extrawest.com)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)]()
![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)

![](https://raw.githubusercontent.com/extrawest/ai-podcast-to-blog/main/preview.gif)

This project takes podcast episodes from the Podcast Index, converts the audio into text, summarizes the content, generates an image based on the summary, translates the summary into French, and allows users to ask questions about the episode. Additionally, ElevenLabs is used for audio generation.

## Features

- **Audio to Text**: Convert podcast episodes into text using Hugging Face models.
- **Summarization**: Create concise summaries of podcast episodes.
- **Translation**: Translate summarized content into French.
- **Image Generation**: Generate images based on the summarization.
- **Q&A**: Ask questions about the episode and get accurate answers.
- **Audio Creation**: Generate audio content with ElevenLabs.
- **User Authentication**: Secure authentication and user management with ClerkJs.

## Tech Stack

- **Next.js**: Frontend framework for building fast and scalable web applications.
- **Hugging Face**: Provides models for transcription, summarization, and translation.
- **ElevenLabs**: Generates audio content based on summaries.
- **LangChain**: Orchestrates the entire process by creating a chain that integrates all functionalities.
- **ClerkJs**: User authentication and management.
- **Axios**: Handles API requests.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000` to access the app.

## How It Works

1. **Fetch Podcast**: Axios is used to retrieve podcast audio from the Podcast Index.
2. **Audio Transcription**: Hugging Face models convert the audio into text.
3. **Summarization**: The transcribed text is summarized using Hugging Face models.
4. **Translation**: The summary is translated into French using Hugging Face translation models.
5. **Image Generation**: An image is generated from the summarization using AI tools.
6. **Audio Creation**: ElevenLabs generates audio from the summarized content.
7. **Q&A**: Users can ask questions about the episode, and LangChain coordinates the response process.
8. **Authentication**: ClerkJs handles user login and account management.

## Running in Production

To deploy the app:

1. Build the app for production:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

## Contributing

Feel free to open issues or submit pull requests to improve the project. Contributions are welcome!

## License

This project is licensed under the MIT License.
