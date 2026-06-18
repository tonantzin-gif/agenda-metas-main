export async function parseJSONSafe(response) {
  if (!response) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    // fallback: if axios/other transforms expect the string, rethrow a clearer error
    throw new Error('Invalid JSON response');
  }
}

export default parseJSONSafe;
