const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MySQLAdapter = require('@bot-whatsapp/database/mysql');
const QRPortalWeb = require('@bot-whatsapp/portal');

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost';
const MYSQL_DB_USER = 'server';
const MYSQL_DB_PASSWORD = '1234';
const MYSQL_DB_NAME = 'PROYECTO';
const MYSQL_DB_PORT = '3306';

// Número de teléfono al que quieres enviar el mensaje
const targetPhoneNumber = '593998425931'; // Reemplaza con el número real en formato internacional

const flowPrincipal = addKeyword(['hola'])
    .addAnswer(
        'Aqui va un mensaje',
        { capture: true },
        async (ctx, { provider }) => {
            const formattedNumber = `${targetPhoneNumber}@s.whatsapp.net`;
            await provider.sendText(formattedNumber, 'mensaje de texto');
            // El número de teléfono se envía en este formato 593998425931@s.whatsapp.net
        }
    );

const flowSecundario = addKeyword('gracias').addAnswer(['de nada']);

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    });
    const adapterFlow = createFlow([flowPrincipal, flowSecundario]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
}

main();