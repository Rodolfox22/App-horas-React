// src/utils/dateFormat.js
export function normalizeToDDMMYYYY(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr.replace(/\//g, "-");
  }
  return dateStr;
}

export function normalizeShortDate(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}`;
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return dateStr.replace(/\//g, "-");
  }
  return dateStr;
}
