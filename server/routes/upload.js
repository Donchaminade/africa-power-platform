const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  // Le dossier de destination pour les fichiers
  destination: function (req, file, cb) {
    // Les fichiers sont sauvegardés dans le dossier public/uploads à la racine du projet
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  // Définir le nom du fichier
  filename: function (req, file, cb) {
    // Garde le nom d'origine, ajoute un timestamp pour l'unicité, et l'extension d'origine
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialiser l'upload avec la configuration de stockage
const upload = multer({ storage: storage });

// Définir la route POST pour l'upload
// 'image' est le nom du champ dans le formulaire FormData
router.post('/', upload.single('image'), (req, res) => {
  // Si l'upload a réussi, le fichier est dans req.file
  if (!req.file) {
    return res.status(400).send({ error: 'Aucun fichier n\'a été téléversé.' });
  }

  // Renvoyer le chemin d'accès public du fichier
  // Le serveur Vite sert les fichiers du dossier `public` à la racine
  res.status(200).json({
    message: 'Fichier téléversé avec succès.',
    // Le chemin doit être à la racine pour que le frontend puisse l'utiliser
    filePath: '/uploads/' + req.file.filename
  });
});

module.exports = router;
