export async function shareResult(
    title: string,
    text: string,
    url?: string
) {
    // Check if Web Share API is supported
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url || window.location.href
            });
        } catch (error: any) {
            // User cancelled share - ignore
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
                // Fallback to clipboard
                copyToClipboard(text);
            }
        }
    } else {
        // Fallback for desktop - copy to clipboard
        copyToClipboard(text);
        alert('Results copied to clipboard! Paste anywhere to share.');
    }
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    });
}

export function formatCropResultForShare(
    cropName: string,
    confidence: number,
    n: number,
    p: number,
    k: number
): string {
    return `🌾 AgriCare Crop Recommendation

✅ Best Crop: ${cropName}
📊 Match: ${confidence}%
🧪 Your Soil: N:${n} P:${p} K:${k}

Get personalized crop advice at AgriCare!
Powered by AI for Indian Farmers 🇮🇳`;
}

export function formatDiseaseResultForShare(
    diseaseName: string,
    cropName: string,
    severity: string,
    treatment: string
): string {
    return `🔬 AgriCare Disease Detection

🌿 Crop: ${cropName}
🦠 Disease: ${diseaseName}
⚠️ Severity: ${severity}
💊 Treatment: ${treatment.substring(0, 150)}...

Get complete treatment advice at AgriCare!
Powered by AI for Indian Farmers 🇮🇳`;
}

export function formatLocationResultForShare(
    crop: string,
    city: string,
    verdict: string,
    climateMatch: number,
    reason: string
): string {
    const verdictEmoji =
        verdict === 'yes' ? '✅' :
            verdict === 'no' ? '❌' : '⚠️';

    return `📍 AgriCare Location Advisory

🌾 Crop: ${crop}
📍 Location: ${city}
${verdictEmoji} Verdict: ${verdict.toUpperCase()}
🌡️ Climate Match: ${climateMatch}%
📝 ${reason.substring(0, 150)}...

Get location-based crop advice at AgriCare!
Powered by AI for Indian Farmers 🇮🇳`;
}
