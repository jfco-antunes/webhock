const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Rota para solicitar o processamento (Simula o início do trabalho)
app.post('/upload-video', (req, res) => {
    const { videoId, webhookUrl } = req.body;

    if (!videoId || !webhookUrl) {
        return res.status(400).send('Faltando videoId ou webhookUrl');
    }

    // 1. Resposta IMEDIATA (Padrão 202 Accepted)
    // Dizemos ao cliente: "Recebi seu pedido, pode ir embora que eu assumo daqui."
    console.log(`[API] Recebido pedido para vídeo ${videoId}. Processando...`);
    res.status(202).json({
        message: 'Vídeo recebido. Avisaremos quando terminar.',
        status: 'pending'
    });

    // 2. Simulação do processamento pesado (Assíncrono)
    // Usamos setTimeout para simular uma tarefa que leva 10 segundos
    setTimeout(async () => {
        console.log(`[API] Processamento do vídeo ${videoId} finalizado!`);
        console.log(`[API] Enviando Webhook para: ${webhookUrl}`);

        try {
            // 3. O Disparo do Webhook
            // A API agora age como cliente e faz um POST para a URL que recebeu antes
            await axios.post(webhookUrl, {
                event: 'video.completed',
                data: {
                    videoId: videoId,
                    videoUrl: `https://minha-api.com/download/${videoId}.mp4`,
                    duration: 120,
                    status: 'success'
                },
                timestamp: new Date().toISOString()
            });
            console.log('[API] Webhook enviado com sucesso!');
        } catch (error) {
            console.error('[API] Falha ao enviar webhook:', error.message);
            // Aqui entraria uma lógica de "Retry" (Tentativa de reenvio)
        }

    }, 10000); // 10 segundos de delay simulado
});

app.listen(3000, () => console.log('API de Vídeo rodando na porta 3000'));
