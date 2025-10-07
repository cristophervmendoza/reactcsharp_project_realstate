import React, { useState, useEffect, useRef } from 'react';
import "./login.css"
// Interfaces de TypeScript
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface Alert {
  id: number;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current && !isBlocked) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isBlocked]);

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.slice(1));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 3) {
      newErrors.password = 'La contraseña es muy corta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addAlert = (message: string, type: Alert['type'] = 'info'): void => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
  };

  const handleSubmit = async (): Promise<void> => {
    if (isBlocked) {
      addAlert('Cuenta bloqueada. Espere antes de intentar nuevamente.', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulación de login (reemplazar con tu lógica real)
    setTimeout(() => {
      const loginSuccess = Math.random() > 0.5;
      
      if (loginSuccess) {
        addAlert('Inicio de sesión exitoso', 'success');
        console.log('Login exitoso con:', formData);
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsBlocked(true);
          addAlert('Cuenta bloqueada por múltiples intentos fallidos. Espere 5 minutos.', 'error');
          setTimeout(() => {
            setIsBlocked(false);
            setFailedAttempts(0);
            addAlert('Bloqueo expirado. Puede intentar iniciar sesión nuevamente.', 'info');
          }, 300000);
        } else {
          addAlert(`Credenciales incorrectas. Intento ${newAttempts}/5`, 'error');
        }
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.trim() : value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !isBlocked && !isLoading) {
      handleSubmit();
    }
  };

  const handleClearForm = (): void => {
    if (!isBlocked) {
      setFormData({ email: '', password: '' });
      setErrors({});
      emailInputRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleClearForm();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBlocked]);

  return (
    <div className="login-container">
      {/* Alerts flotantes */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`${alert.type}-alert`}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'slideIn 0.3s ease-out',
              backgroundColor: 
                alert.type === 'error' ? '#e74c3c' :
                alert.type === 'success' ? '#00b894' :
                alert.type === 'warning' ? '#f39c12' : '#3498db'
            }}
          >
            <i className={`fas fa-${
              alert.type === 'error' ? 'exclamation-triangle' :
              alert.type === 'success' ? 'check-circle' : 'info-circle'
            }`}></i>
            {alert.message}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-left">
            <img src="images/LOGITO.png" alt="Logo" className="nav-logo" />
          </div>
          <div className="nav-right">
            <a href="/" className="nav-link">
              <i className="fas fa-home"></i> Inicio
            </a>
            <a href="/propiedades" className="nav-link">
              <i className="fas fa-building"></i> Propiedades
            </a>
            <a href="/registro" className="nav-link">
              <i className="bi bi-person-fill-add"></i> Registrarse
            </a>
            <a href="tel:977220220" className="nav-link">
              <i className="fas fa-phone"></i> 977 220 220
            </a>
          </div>
        </div>
      </nav>

      {/* Login Page */}
      <div className="login-page">
        <div className="login-modal">
          {/* Logo y Header */}
          <div className="login-header">
            <div className="logo-circle">
              <img src="images/LOGITO.png" alt="Logo" className="modal-logo" />
            </div>
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">Accede a tu cuenta para gestionar propiedades</p>
          </div>

          {/* Warning de intentos fallidos */}
          {failedAttempts > 0 && !isBlocked && (
            <div className="warning-alert">
              <i className="fas fa-info-circle"></i>
              Intentos fallidos: {failedAttempts}/5
            </div>
          )}

          {/* Formulario */}
          <div className="login-form">
            {/* Email */}
            <div className="input-group">
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Correo Electrónico"
                  disabled={isBlocked}
                  style={errors.email ? { borderColor: '#e74c3c', animation: 'shake 0.5s ease-in-out' } : {}}
                />
              </div>
              {errors.email && (
                <div className="error-alert" style={{ marginTop: '8px', fontSize: '13px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Contraseña"
                  disabled={isBlocked}
                  style={errors.password ? { borderColor: '#e74c3c', animation: 'shake 0.5s ease-in-out' } : {}}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                >
                  <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} id="toggleIcon"></i>
                </button>
              </div>
              {errors.password && (
                <div className="error-alert" style={{ marginTop: '8px', fontSize: '13px' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className={`login-submit-btn ${isBlocked ? 'blocked' : ''} ${isLoading ? 'loading' : ''}`}
              disabled={isBlocked || isLoading}
              onClick={handleSubmit}
            >
              {isBlocked ? (
                <>
                  <i className="fas fa-lock"></i> Cuenta Bloqueada
                </>
              ) : isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                </>
              )}
            </button>

            {/* Footer Links */}
            <div className="login-footer">
              <a href="/recuperar" className="footer-link">
                <i className="fas fa-key"></i> ¿Olvidaste tu contraseña?
              </a>
              <p className="register-text">
                ¿No tienes cuenta?{' '}
                <a href="/registro" className="register-link">Regístrate aquí</a>
              </p>
              <a href="/" className="back-link">
                <i className="fas fa-arrow-left"></i> Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}