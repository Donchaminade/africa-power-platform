import bcrypt from 'bcrypt';

const saltRounds = 10; // Nombre de tours de salage, standard pour bcrypt

const password = process.argv[2]; // Récupère le mot de passe depuis les arguments de la ligne de commande

async function hashPassword() {
  if (!password) {
    console.error('Veuillez fournir un mot de passe en argument.');
    console.log('Utilisation : node scripts/hash-password.js password');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Hash généré pour le mot de passe :', password);
    console.log(hash);
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors du hachage du mot de passe :', err);
    process.exit(1);
  }
}

hashPassword();
