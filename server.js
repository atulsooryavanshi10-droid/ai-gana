const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Index.html");
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "AI Gana server is running"
  });
});

app.post("/api/generate-song", async (req, res) => {
  try {
    const {
      lyrics,
      musicPrompt,
      language,
      voice,
      mood,
      musicStyle
    } = req.body;

    if (!lyrics || !lyrics.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lyrics required"
      });
    }

    const prompt = `
Create a ${language || "Marathi"} song.

Lyrics:
${lyrics}

Music style: ${musicStyle || "DJ / Dance"}
Mood: ${mood || "Energetic"}
Voice: ${voice || "Male"}

Music direction:
${musicPrompt || "Energetic Indian DJ song with powerful drums and bass."}

Use the provided lyrics as the song lyrics. Create vocals and music.
`;

    const response = await fetch(
      "https://api.elevenlabs.io/v1/music?output_format=mp3_48000_192",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          prompt,
          music_length_ms: 60000,
          model_id: "music_v2_5"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs error:", errorText);

      return res.status(response.status).json({
        success: false,
        message: "Music generation failed",
        error: errorText
      });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="ai-gana.mp3"',
      "Content-Length": audioBuffer.length
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Gana running on port ${PORT}`);
});
