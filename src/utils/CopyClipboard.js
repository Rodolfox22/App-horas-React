// Ejemplo: copyClipboard("Texto copiado", () => alert("¡Copiado con éxito!"));
export const copyClipboard = (text, callback) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (typeof callback === "function") {
        callback(); // Podés pasar alert personalizado o algo más
      }
    })
    .catch((err) => alert("Error al copiar datos: " + err));
};
