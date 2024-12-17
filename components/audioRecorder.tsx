"use client";
import React, { useState, useRef } from "react";

interface AudioRecorderProps {
  onProcessOrder: (order: any) => void;
}

/**
 * AudioRecorder component allows users to record audio, stop recording, and upload the audio for transcription and processing.
 *
 * @component
 * @param {AudioRecorderProps} props - The properties for the AudioRecorder component.
 * @param {function} props.onProcessOrder - Callback function to process the parsed order from the server response.
 *
 * @returns {JSX.Element} The rendered AudioRecorder component.
 *
 * @example
 * <AudioRecorder onProcessOrder={handleProcessOrder} />
 *
 * @remarks
 * This component uses the MediaRecorder API to record audio from the user's microphone.
 * It handles starting and stopping the recording, and uploading the recorded audio to a server endpoint for transcription.
 * The server response is expected to contain a JSON string which is parsed and passed to the `onProcessOrder` callback.
 *
 * @throws Will throw an error if the browser does not support audio recording or if there is an issue accessing the microphone.
 * Will also throw an error if the server response is not a valid JSON string.
 */
const AudioRecorder: React.FC<AudioRecorderProps> = ({ onProcessOrder }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");

      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setAudioBlob(audioBlob);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUploadAudio = async () => {
    if (!audioBlob) {
      alert("No audio recorded!");

      return;
    }

    const formData = new FormData();

    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await fetch("/api/transcription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();

      console.log("Server Response:", data); // Debugging log to inspect server response

      if (data.gptEnhancedText) {
        // Final cleaning of the received JSON
        const cleanedResponse = data.gptEnhancedText
          .replace(/```json/g, "")
          .replace(/```javascript/g, "")
          .replace(/```/g, "")
          .trim();

        try {
          const parsedOrder = JSON.parse(cleanedResponse); // Parse into JSON

          console.log("Parsed Order:", parsedOrder); // Debugging log to inspect parsed order
          onProcessOrder(parsedOrder); // Pass the parsed order to the parent
        } catch (parseError) {
          console.error("Failed to parse JSON:", cleanedResponse); // Debug invalid JSON
          throw new Error(`Invalid JSON response: ${cleanedResponse}`);
        }
      }
    } catch (error: any) {
      console.error("Error uploading audio:", error.message || error);
      alert("Failed to upload audio. Please check the console for details.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Audio Recorder
      </h1>
      <div>
        {isRecording ? (
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#4682B4", // Medium blue
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onClick={handleStopRecording}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4169E1")
            } // Slightly darker blue
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4682B4")
            }
          >
            Stop Recording
          </button>
        ) : (
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#DC143C", // Crimson red
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onClick={handleStartRecording}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#B22222")
            } // Slightly darker red
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#DC143C")
            }
          >
            Start Recording
          </button>
        )}
      </div>
      {audioBlob && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            style={{ width: "100%" }}
          />
          <br />
          <button
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#28a745", // Standard green
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onClick={handleUploadAudio}
          >
            Transcribe and Convert
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
