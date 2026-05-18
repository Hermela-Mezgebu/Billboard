export async function detectFraud(submission: any) {
  try {
    const res = await fetch("/api/ai/validate", {
      method: "POST",
      body: JSON.stringify(submission),
    });

    const data = await res.json();

    return {
      isFake: data.fake,
      confidence: data.confidence,
      reason: data.reason
    };
  } catch (err) {
    return { isFake: false, confidence: 0 };
  }
}