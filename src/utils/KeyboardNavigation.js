/// components/KeyboardNavigation.js
import { useCallback } from "react";

/**
 * Hook personalizado para manejar navegación por teclado entre campos
 * @param {Object} config - Configuración del hook
 * @param {Object} config.navigation - Mapa de navegación {campo: ref | función}
 * @param {Function} config.onEscape - Callback para la tecla Escape
 * @param {Object} config.keyHandlers - Handlers adicionales para otras teclas
 * @returns {Function} Función handleKeyDown para usar en los eventos
 */
export const useEnterNavigation = (config = {}) => {
  const { navigation = {}, onEscape, keyHandlers = {} } = config;

  const handleKeyDown = useCallback(
    (e, currentField) => {
      // Manejar tecla Enter
      if (e.key === "Enter") {
        e.preventDefault();

        const nextAction = navigation[currentField];
        if (nextAction) {
          if (typeof nextAction === "function") {
            nextAction();
          } else if (nextAction?.current) {
            nextAction.current.focus();
          }
        }
      }
      // Manejar tecla Escape
      else if (e.key === "Escape" && onEscape) {
        onEscape();
      }
      // Manejar otras teclas personalizadas
      else if (keyHandlers[e.key]) {
        keyHandlers[e.key](e, currentField);
      }
    },
    [navigation, onEscape, keyHandlers]
  );

  return handleKeyDown;
};

// Versión extendida con más funcionalidades
export const useKeyboardNavigation = (config = {}) => {
  const {
    navigation = {},
    onEscape,
    onEnter,
    preventDefault = true,
    keyHandlers = {},
    ctrlKeyHandler = {}, // Nuevo objeto para manejar combinaciones con Ctrl
    altKeyHandler = {}, // Nuevo objeto para manejar combinaciones con Alt
    debug = false,
  } = config;

  const handleKeyDown = useCallback(
    (e, currentField) => {
      if (debug) {
        console.log(`Key pressed: ${e.key}, Current field: ${currentField}`);
      }

      // Verificar si Ctrl está presionado
      const isCtrlPressed = e.ctrlKey || e.metaKey; // metaKey para Mac (Cmd)
      // Manejar combinaciones con Ctrl primero
      if (isCtrlPressed && ctrlKeyHandler[e.key]) {
        if (preventDefault) e.preventDefault();
        ctrlKeyHandler[e.key](e, currentField);
        return; // Salir temprano para evitar otros manejadores
      }

      const isAltPressed = e.altKey || e.altGraphKey; // altGraphKey para Mac (Opt)
      // Manejar combinaciones con Alt
      if (isAltPressed && altKeyHandler[e.key]) {
        if (preventDefault) e.preventDefault();
        altKeyHandler[e.key](e, currentField);
        return; // Salir temprano para evitar otros manejadores
      }

      // Si no es una combinación con Ctrl o Alt, continuar con el manejo normal
      switch (e.key) {
        case "Enter":
          if (preventDefault) e.preventDefault();

          if (onEnter) {
            onEnter(e, currentField);
          }

          const nextAction = navigation[currentField];
          if (nextAction) {
            if (typeof nextAction === "function") {
              nextAction();
            } else if (nextAction?.current) {
              nextAction.current.focus();
            }
          }
          break;

        case "Escape":
          if (onEscape) {
            onEscape(e, currentField);
          }
          break;

        case "ArrowDown":
        case "Tab":
          if (!e.shiftKey && navigation[currentField]) {
            e.preventDefault();
            const nextAction = navigation[currentField];
            if (nextAction?.current) {
              nextAction.current.focus();
            }
          }
          break;

        default:
          if (keyHandlers[e.key]) {
            keyHandlers[e.key](e, currentField);
          }
          break;
      }
    },
    [
      navigation,
      onEscape,
      onEnter,
      preventDefault,
      keyHandlers,
      ctrlKeyHandler,
      altKeyHandler,
      debug,
    ]
  );

  return handleKeyDown;
};
