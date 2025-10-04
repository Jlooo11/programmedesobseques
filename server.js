const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Vérification des variables d'environnement
console.log('🔍 Configuration email:', {
    user: process.env.EMAIL_USER ? 'Défini' : 'Non défini',
    port: PORT
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ ERREUR: Variables manquantes dans .env');
    console.log('💡 Créez un fichier .env avec:');
    console.log('EMAIL_USER=votre.email@gmail.com');
    console.log('EMAIL_PASS=votre-mot-de-passe-application');
    process.exit(1);
}

// Configuration Nodemailer SIMPLIFIÉE
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test de connexion email
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erreur configuration email:', error.message);
        console.log('🔧 Solutions:');
        console.log('1. Vérifiez vos identifiants Gmail');
        console.log('2. Utilisez un mot de passe d\'application');
        console.log('3. Activez l\'accès aux applications moins sécurisées');
    } else {
        console.log('✅ Serveur email prêt');
    }
});

// Routes de base
app.get('/', (req, res) => {
    res.json({ 
        message: 'Serveur obsèques - En ligne',
        status: 'OK',
        routes: [
            'POST /api/confirmation-presence',
            'POST /api/reservation-hotel', 
            'POST /api/commande-pagne',
            'GET  /api/condoleances',
            'POST /api/condoleances'
        ]
    });
});

// Route test email
app.post('/api/test-email', async (req, res) => {
    try {
        const mailOptions = {
            from: `"Test Obsèques" <${process.env.EMAIL_USER}>`,
            to: 'sylvia.b@bloowmoney.com',
            subject: 'Test email - Serveur Obsèques',
            text: 'Ceci est un test de l\'envoi d\'email depuis le serveur.'
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email test envoyé avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Vos autres routes ici (confirmation-presence, commande-pagne, etc.)
app.post('/api/confirmation-presence', async (req, res) => {
    try {
        const { nom, telephone, evenements } = req.body;
        
        console.log('📝 Confirmation de:', nom);
        
        // Envoi email
        const mailOptions = {
            from: `"Site Obsèques" <${process.env.EMAIL_USER}>`,
            to: 'sylvia.b@bloowmoney.com',
            subject: `Confirmation présence - ${nom}`,
            html: `<p>Nouvelle confirmation de ${nom} (${telephone})</p>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Confirmé avec succès' });
        
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log('🚀 ==========================================');
    console.log('🚀 Serveur démarré sur le port', PORT);
    console.log('🚀 ==========================================');
    console.log('📧 Email configuré pour:', process.env.EMAIL_USER);
    console.log('📍 URL: http://localhost:' + PORT);
    console.log('🔧 Test email: POST /api/test-email');
    console.log('🚀 ==========================================');
});