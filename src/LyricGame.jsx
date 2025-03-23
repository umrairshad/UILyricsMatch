
import React, { useState, useEffect } from "react";
import "./LyricGame.css"; // Import the CSS file
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://backend-umrairshads-projects.vercel.app";
function LyricGame() {
    const [lyricsData, setLyrics] = useState(null);
    const [error, setError] = useState(null);
    const [guess, setGuess] = useState("");
    const [responses, setResponses] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gethint, sethint] = useState(false);
    const [showHints, setShowHints] = useState(true);



    useEffect(() => {
        console.log(lyricsData, "Updated Lyrics Data");
    }, [lyricsData]);

    
    const fetchLyrics = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/lyrics`);
            const data = await response.json();

            setLyrics(data); // Update state
            setLoading(null)
            setError(null);
        } catch (err) {
            setError("⚠️ Error fetching lyrics. Try again.");
            console.error(err);
        }
    };

    const checkGuess = async () => {
        console.log(lyricsData.title,guess)

        if (!guess) return;
        try {
            
            const response = await fetch(
                `${BACKEND_URL}/guess_title/?user_title=${encodeURIComponent(lyricsData.title)}&correct_title=${encodeURIComponent(guess)}`
            );
            const data = await response.json();
            setResponses(data);
            setError(null);
        } catch (err) {
            setError("⚠️ Error checking guess. Try again.");
            console.error(err);
        }
    };

    const hint = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}`)
            const data = await response.json()

            sethint(data)
            setShowHints(true)
            setError(null)
            console.log(gethint)
        } catch (err) {
            console.error(err)
        };
    };
    return (
        <div style={{ display: "flex", backgroundImage: "linear-gradient(to right, #8e2de2, #4a00e0)" }}>
            {gethint && showHints && (
                <div className="hint-container">
                    {/* Close Button */}
                    <button className="close-button" onClick={() => setShowHints(false)}>
                        &times; {/* Unicode for close symbol */}
                    </button>

                    <h2 className="hint-title">🔍 Hints</h2>
                    {gethint.list && Array.isArray(gethint.list) ? (
                        <ul className="hint-list">
                            {gethint.list.map((hintPair, index) => (
                                <li key={index} className="hint-item">
                                    {hintPair[0]} by {hintPair[1]}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-hints">No hints available</p>
                    )}
                </div>
            )}

            <div className="container">

                <h1 className="title">🎵 Lyric Guessing Game 🎵</h1>

                <button
                    onClick={fetchLyrics}
                    disabled={loading}
                    className="button"
                >
                    {loading ? "🎶 Loading..." : "🎶 Generate Lyric Snippet"}
                </button>

                {error && <p className="error">{error}</p>}

                {lyricsData && (
                    <div className="lyrics-container">
                        <div onClick={hint} style={{ textAlign: "right", fontSize: "small", height: "1px", fontStyle: "italic" }}>Hint</div>
                        <h3 className="lyrics-title">🎤 Generated Lyrics:</h3>
                        {lyricsData.output.split("\n").map((line, index) => (
                            <p
                                key={index}
                                className="lyric-line"
                                style={{ fontFamily: "'Playfair Display', serif" }} // Corrected style
                            >
                                {line || <br />} {/* Preserve empty lines as line breaks */}
                            </p>
                        ))}
                        <p className="guess-prompt">🔍 Try to guess the song title!</p>
                    </div>

                )}

                {lyricsData && (
                    <div className="mt-6 flex flex-col items-center">
                        <input
                            type="text"
                            placeholder="Enter your guess..."
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            className="input"
                        />
                        <button
                            onClick={checkGuess}
                            className="check-button"
                        >
                            Check Answer
                        </button>
                    </div>
                )}

                {responses && (
                    <p className={`response ${responses.message.includes("correct") ? "correct" : "incorrect"}`}>
                        {responses.message}
                    </p>
                )}

            </div>
        </div>
    );
};

export default LyricGame;