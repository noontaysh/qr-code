import express from 'express'
import qr from 'qr-image'

const app = express()
const port = 3000

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/qr-code', async (req, res) => {
    const qrCodeContent = req.body['qrCodeContent'];
    try {
        const qrImage = await generateQRImage(qrCodeContent);
        res.render('index', {qrImage});
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port} \nThe url for app is http://localhost:3000`)
})


async function generateQRImage(content) {
    return new Promise((resolve, reject) => {
        const code = qr.image(content, { type: 'png' });
        const chunks = [];

        code.on('data', chunk => {
            chunks.push(chunk);
        });

        code.on('end', () => {
            const imageBuffer = Buffer.concat(chunks);
            const imageDataUrl = 'data:image/png;base64,' + imageBuffer.toString('base64');
            resolve(imageDataUrl);
        });

        code.on('error', reject);
    });
}