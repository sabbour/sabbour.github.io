const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadImage(imageUrl, outputDir) {
    const imageName = path.basename(imageUrl);
    const outputPath = path.join(outputDir, imageName);

    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function downloadImages(imageUrls, outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const downloadPromises = imageUrls.map(url => downloadImage(url, outputDir));
    await Promise.all(downloadPromises);
}

module.exports = {
    downloadImages
};