// src/utils/dateFormat.js

export function normalizeToDDMMYYYY(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("/");
    return `${day}-${month}-${year}`;
  }
  return dateStr; // retorna sin cambios si no coincide
}

export function normalizeShortDate(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    console.log("year", year);
    return `${day}-${month}`;
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month] = dateStr.split("/");
    return `${day}-${month}`;
  }
  return dateStr;
}

export function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
