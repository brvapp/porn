const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const fsExtra = require('fs-extra');
const multer = require('multer');
const faqData = require('./faqData'); // Importa o arquivo faqData
const app = express();
const PORT = process.env.PORT || 80;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', async (req, res) => {
  try {
    const imagesData = await loadImagesData();
    const imageFiles = imagesData.map(image => image.fileName);
    res.render('index', { images: imageFiles, faqData });
  } catch (error) {
    console.error('Erro ao carregar dados das imagens:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.get('/details/:imageId', async (req, res) => {
  const imageId = req.params.imageId;
  const imagesData = await loadImagesData();
  const imageDetails = getImageDetails(imagesData, imageId);

  if (!imageDetails) {
    res.status(404).send('Página não encontrada');
    return;
  }

  res.render('details', { imageDetails });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

async function loadImagesData() {
  const dataPath = path.join(__dirname, 'imagesData.json');
  const imagesPath = path.join(__dirname, 'public');

  try {
    let imagesData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    const existingImageFiles = imagesData.map(image => image.fileName);
    const newImages = await getNewImages(imagesPath, existingImageFiles);

    if (newImages.length > 0) {
      const newImageData = await Promise.all(newImages.map(async (image, index) => {
        const id = imagesData.length + index + 1;
        const newFileName = `image${id}.png`; // Novo nome do arquivo

        // Verifica se o novo nome é diferente do atual
        if (image !== newFileName) {
          const newFilePath = path.join(imagesPath, newFileName); // Caminho completo do novo arquivo

          // Renomeia o arquivo
          await fsExtra.move(path.join(imagesPath, image), newFilePath);
        }

        return {
          id,
          name: `Image ${id}`,
          description: `Description for Image ${id}`,
          fileName: newFileName
        };
      }));

      imagesData = imagesData.concat(newImageData);

      await fs.writeFile(dataPath, JSON.stringify(imagesData, null, 2), 'utf-8');
    }

    return imagesData;
  } catch (error) {
    console.error('Erro ao carregar dados das imagens:', error);
    return [];
  }
}

// Função para obter detalhes da imagem com base no ID
function getImageDetails(imagesData, imageId) {
  return imagesData.find(image => image.id == imageId);
}

// Função para obter novas imagens no diretório
async function getNewImages(imagesPath, existingImageFiles) {
  const allImageFiles = await fs.readdir(imagesPath);
  return allImageFiles.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file) && !existingImageFiles.includes(file));
}

app.get('/faq', (req, res) => {
  res.render('faq', { faqData });
});
app.get('/contact', (req, res) => {
  res.render('contact');
});
