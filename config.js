// ─────────────────────────────────────────────────────────────
//  CONFIGURATION DE TON AGENDA — le seul fichier à modifier
// ─────────────────────────────────────────────────────────────

// 1) Ton adresse courriel Google (celle avec laquelle tu vas te connecter).
//    C'est toi qui gères l'agenda : toi seul peux ajouter ou retirer des membres.
//    ⚠️ Mets EXACTEMENT la même adresse dans le fichier firestore.rules.
export const ownerEmail = "lesprojetslamarre@hotmail.com";

// 2) Le nom affiché en haut de l'agenda (tu pourras le changer dans l'app).
export const appName = "Agenda partagé";

// 3) La configuration de ton projet Firebase.
//    Dans la console Firebase : ⚙️ Paramètres du projet → Vos applications → Configuration du SDK.
//    Copie les valeurs de « firebaseConfig » ici, à la place des exemples.
//    (Ces valeurs ne sont pas secrètes : la sécurité vient des règles dans firestore.rules.)
export const firebaseConfig = {
  apiKey: "AIzaSyCTleJ_EAs8CNUuIHkimrF9ZotUiXmbsoI",
  authDomain: "agenda-partage-5bc8d.firebaseapp.com",
  projectId: "agenda-partage-5bc8d",
  storageBucket: "agenda-partage-5bc8d.firebasestorage.app",
  messagingSenderId: "847286303067",
  appId: "1:847286303067:web:53adec4c9dcd9f7362027e"
};
