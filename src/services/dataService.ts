const SPREADSHEET_ID = "1dkBOgpjxrsyBS5otpKtsqsUiKnPzM9kb11YVxrkDRrc";

export const getSheetUrl = (sheetName: string) => 
  `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

export const getDriveImageUrl = (idOrUrl: string) => {
  if (!idOrUrl) return '';
  // Extract ID from full URL if needed
  const match = idOrUrl.match(/[-\w]{25,}/);
  const id = match ? match[0] : idOrUrl;
  // Use lh3.googleusercontent.com/d/ format with size parameter for performance
  // =s800-rw for responsive webp 800px size
  return `https://lh3.googleusercontent.com/d/${id}=s800`;
};

// More robust CSV parser that handles quotes and mixed content
export function parseCSV(csv: string) {
  if (!csv || !csv.includes(',')) return [];
  
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  // Manual split to handle newlines inside quotes
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') inQuotes = !inQuotes;
    if (char === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = "";
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);

  const parseRow = (row: string) => {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '"') inQuotes = !inQuotes;
      if (row[i] === ',' && !inQuotes) {
        result.push(row.substring(start, i).replace(/^"|"$/g, '').trim());
        start = i + 1;
      }
    }
    result.push(row.substring(start).replace(/^"|"$/g, '').trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = parseRow(line);
    const obj: any = {};
    headers.forEach((header, i) => {
      const key = header.trim();
      if (key) obj[key] = values[i] || '';
    });
    return obj;
  });
}

export async function fetchSheetData(sheetName: string) {
  try {
    // Try the proxy first
    const response = await fetch(`/api/sheets?id=${SPREADSHEET_ID}&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`);
    if (response.ok) {
      const csv = await response.text();
      // If we got HTML (likely a 404/login page), it's not our CSV
      if (csv.trim().toLowerCase().startsWith('<!doctype html') || csv.trim().toLowerCase().startsWith('<html')) {
        throw new Error("Received HTML instead of CSV via proxy");
      }
      const data = parseCSV(csv);
      if (sheetName !== 'Hero' && data.length > 0 && data[0].tagline) return [];
      return data;
    }
    throw new Error(`Proxy status: ${response.status}`);
  } catch (error) {
    console.warn(`Proxy failed for "${sheetName}", trying direct fetch:`, error);
    try {
      // Fallback: Direct fetch with gviz which is often more CORS-friendly for public data
      const directUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      const response = await fetch(directUrl);
      if (!response.ok) throw new Error("Direct fetch failed");
      const csv = await response.text();
      if (csv.trim().toLowerCase().startsWith('<!doctype html') || csv.trim().toLowerCase().startsWith('<html')) {
        throw new Error("Received HTML via direct fetch");
      }
      return parseCSV(csv);
    } catch (directError) {
      console.error(`Both proxy and direct fetch failed for "${sheetName}":`, directError);
      return [];
    }
  }
}

export async function fetchFolderFiles(folderId: string) {
  try {
    const match = folderId.match(/[-\w]{25,}/);
    const id = match ? match[0] : folderId;
    
    // Try proxy
    const response = await fetch(`/api/drive-folder?id=${id}&t=${Date.now()}`);
    if (response.ok) return await response.json();
    throw new Error(`Proxy status: ${response.status}`);
  } catch (error) {
    console.warn(`Folder proxy failed for ${folderId}, listing not possible client-side without API key:`, error);
    return [];
  }
}

export async function getAIChatResponse(messages: { role: 'user' | 'model', text: string }[], systemPrompt: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.details || error.error || `Server error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Chat Response Error:", error);
    throw error; // Let the UI handle the error with fallback or specific message
  }
}
