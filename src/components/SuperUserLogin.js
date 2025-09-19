import React, { useState, useRef, useEffect } from 'react';
import { Shield, Eye, EyeOff, Key, User, AlertCircle, CheckCircle } from 'lucide-react';
import { userManagementFunctions } from '../modules/user-management';
import './SuperUserLogin.css';

const SuperUserLogin = ({ onLoginSuccess, onCancel }) => {
  // Estados del formulario
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de autenticación
  const [requires2FA, setRequires2FA] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Referencias
  const userInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const twoFactorInputRef = useRef(null);

  // Focus inicial
  useEffect(() => {
    if (userInputRef.current) {
      userInputRef.current.focus();
    }
  }, []);

  // Limpiar mensajes de error al cambiar inputs
  useEffect(() => {
    if (error) {setError('');}
  }, [userName, password, twoFactorToken]);

  // Manejar login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!userName.trim() || !password.trim()) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      // Verificar si el usuario tiene un rol que requiere autenticación segura
      // (cualquier rol diferente a operario)
      const userRole = userManagementFunctions.getUserRole(userName.trim());
      const requiresSecureAuth = userRole !== 'operario';

      if (!requiresSecureAuth) {
        throw new Error('Este usuario no requiere autenticación segura.');
      }

      // Intentar autenticación
      const result = await userManagementFunctions.authenticateUser(
        userName.trim(),
        password.trim(),
        requires2FA ? twoFactorToken.trim() : null
      );

      if (!result) {
        throw new Error(requires2FA ? 'Código 2FA inválido' : 'Usuario o contraseña incorrectos');
      }

      if (result.requires2FA) {
        // Requiere 2FA
        setRequires2FA(true);
        setUserInfo(result.user);
        setSuccess('Contraseña correcta. Ingrese el código de verificación de dos factores.');
        setTwoFactorToken('');
        if (twoFactorInputRef.current) {
          twoFactorInputRef.current.focus();
        }
        return;
      }

      // Login exitoso
      setSuccess('Autenticación exitosa. Redirigiendo...');
      setTimeout(() => {
        onLoginSuccess(result);
      }, 1000);

    } catch (err) {
      setError(err.message);
      // Focus en el campo apropiado
      if (requires2FA && twoFactorInputRef.current) {
        twoFactorInputRef.current.focus();
      } else if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de usuario (reiniciar estado)
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    if (requires2FA) {
      setRequires2FA(false);
      setUserInfo(null);
      setTwoFactorToken('');
    }
  };

  // Manejar tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="superuser-login-overlay">
      <div className="superuser-login-container">
        <div className="superuser-login-header">
          <div className="superuser-login-icon">
            <Shield size={32} />
          </div>
          <h2>Acceso Seguro</h2>
          <p>Autenticación segura con verificación de dos factores</p>
        </div>

        <form onSubmit={handleLogin} className="superuser-login-form">
          {/* Campo de usuario */}
          <div className="form-group">
            <label htmlFor="superuser-username" className="form-label">
              <User size={16} />
              Usuario
            </label>
            <input
              ref={userInputRef}
              id="superuser-username"
              type="text"
              className="form-input"
              value={userName}
              onChange={handleUserNameChange}
              onKeyPress={handleKeyPress}
              placeholder="Ingrese su nombre de usuario"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Campo de contraseña */}
          <div className="form-group">
            <label htmlFor="superuser-password" className="form-label">
              <Key size={16} />
              Contraseña
            </label>
            <div className="password-input-container">
              <input
                ref={passwordInputRef}
                id="superuser-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ingrese su contraseña segura"
                disabled={isLoading || requires2FA}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Campo de 2FA */}
          {requires2FA && (
            <div className="form-group">
              <label htmlFor="superuser-2fa" className="form-label">
                <Shield size={16} />
                Código de Verificación (2FA)
              </label>
              <input
                ref={twoFactorInputRef}
                id="superuser-2fa"
                type="text"
                className="form-input"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                placeholder="000000"
                disabled={isLoading}
                maxLength={6}
                autoComplete="one-time-code"
              />
              <small className="form-help">
                Ingrese el código de 6 dígitos de su aplicación autenticadora
              </small>
            </div>
          )}

          {/* Mensajes de error */}
          {error && (
            <div className="message error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Mensajes de éxito */}
          {success && (
            <div className="message success-message">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !userName.trim() || !password.trim() || (requires2FA && !twoFactorToken.trim())}
            >
              {isLoading ? 'Verificando...' : requires2FA ? 'Verificar Código' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        {/* Información de seguridad */}
        <div className="security-info">
          <div className="security-item">
            <Shield size={14} />
            <span>Conexión segura cifrada</span>
          </div>
          <div className="security-item">
            <Key size={14} />
            <span>Contraseña hasheada con bcrypt</span>
          </div>
          {requires2FA && (
            <div className="security-item">
              <CheckCircle size={14} />
              <span>Verificación de dos factores activa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperUserLogin;