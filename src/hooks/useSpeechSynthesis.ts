let currentAudio: HTMLAudioElement | null = null;
let onStartCallback: (() => void) | null = null;
let onEndCallback: (() => void) | null = null;

async function speakWithSarvam(
    text: string,
    language: 'en' | 'hi' | 'te',
    apiKey: string,
    onStart?: () => void,
    onEnd?: () => void
) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    onStartCallback = onStart || null;
    onEndCallback = onEnd || null;

    const languageConfig = {
        en: { language_code: 'en-IN', speaker: 'hitesh' },
        hi: { language_code: 'hi-IN', speaker: 'karun' },
        te: { language_code: 'te-IN', speaker: 'abhilash' }
    }

    const config = languageConfig[language]

    const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}/g, '')
        .replace(/`/g, '')
        .replace(/\n+/g, ' ')
        .substring(0, 500)
        .trim()

    if (!cleanText) return

    try {
        if (onStartCallback) onStartCallback()

        const response = await fetch(
            'https://api.sarvam.ai/text-to-speech',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': apiKey
                },
                body: JSON.stringify({
                    inputs: [cleanText],
                    target_language_code: config.language_code,
                    speaker: config.speaker,
                    pace: 1.0,
                    speech_sample_rate: 22050,
                    enable_preprocessing: true,
                    model: 'bulbul:v2'
                })
            }
        )

        const data = await response.json()
        if (!response.ok) {
            throw new Error('Sarvam TTS failed')
        }

        const audioBase64 = data.audios[0]
        const byteCharacters = atob(audioBase64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const audioBlob = new Blob([byteArray], { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)

        currentAudio = new Audio(audioUrl)

        currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl)
            if (onEndCallback) onEndCallback()
            currentAudio = null;
        }

        currentAudio.onerror = () => {
            if (onEndCallback) onEndCallback()
            currentAudio = null;
        }

        await currentAudio.play()

    } catch (error) {
        console.error('Sarvam error:', error)
        fallbackBrowserTTS(cleanText, language, onEndCallback || undefined)
    }
}

function fallbackBrowserTTS(
    text: string,
    language: 'en' | 'hi' | 'te',
    onEnd?: () => void
) {
    const langCodes = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN'
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = langCodes[language]
    utterance.rate = 0.9
    utterance.onend = () => { if (onEnd) onEnd() }
    window.speechSynthesis.speak(utterance)
}

export function useSpeechSynthesis() {
    const isSupported = true

    const speak = async (
        text: string,
        language: 'en' | 'hi' | 'te',
        onStart?: () => void,
        onEnd?: () => void
    ) => {
        const sarvamKey = import.meta.env.VITE_SARVAM_API_KEY

        if (sarvamKey && sarvamKey !== 'add_your_sarvam_key') {
            await speakWithSarvam(
                text, language, sarvamKey, onStart, onEnd
            )
        } else {
            fallbackBrowserTTS(text, language, onEnd)
        }
    }

    const stop = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            if (onEndCallback) onEndCallback();
        }
        window.speechSynthesis.cancel()
    }

    const isSpeaking = () => {
        return currentAudio !== null || window.speechSynthesis.speaking;
    };

    return { isSupported, speak, stop, isSpeaking }
}
