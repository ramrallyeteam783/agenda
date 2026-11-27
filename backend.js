// Accès à Firebase (connexion Google + base de données Firestore).
// L'app parle seulement à ce fichier : rien ici ne dépend d'un autre service.
import { firebaseConfig, ownerEmail } from './config.js';

const SDK = 'https://www.gstatic.com/firebasejs/13.2.0/';
let fb = null, auth = null, db = null;

export const configured = !!(firebaseConfig && typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('COLLE') && firebaseConfig.projectId && !String(firebaseConfig.projectId).startsWith('ton-projet'));
export const ownerConfigured = !!ownerEmail && !String(ownerEmail).startsWith('ton.courriel');
export const owner = () => String(ownerEmail || '').trim().toLowerCase();

export async function init() {
  const [A, AU, FS] = await Promise.all([
    import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')]);
  fb = { ...A, ...AU, ...FS };
  const app = fb.initializeApp(firebaseConfig);
  auth = fb.getAuth(app);
  auth.languageCode = 'fr';
  try { db = fb.initializeFirestore(app, { localCache: fb.persistentLocalCache({ tabManager: fb.persistentMultipleTabManager() }) }); }
  catch (e) { db = fb.getFirestore(app); }
  try { await fb.getRedirectResult(auth); } catch (e) { /* ignoré : on affichera l'écran de connexion */ }
}

export const onUser = cb => fb.onAuthStateChanged(auth, cb);

export async function signIn() {
  const p = new fb.GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  try { await fb.signInWithPopup(auth, p); }
  catch (e) {
    if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) await fb.signInWithRedirect(auth, p);
    else throw e;
  }
}
export const signOut = () => fb.signOut(auth);

// Connexion par courriel + mot de passe (fonctionne aussi dans l'app installée sur iPhone)
export const signInEmail = (email, pw) => fb.signInWithEmailAndPassword(auth, email, pw);
export async function signUpEmail(email, pw, name) {
  const c = await fb.createUserWithEmailAndPassword(auth, email, pw);
  if (name) { try { await fb.updateProfile(c.user, { displayName: name }); } catch (e) { /* le nom n'est pas essentiel */ } }
  await fb.sendEmailVerification(c.user);
}
export const resendVerification = () => fb.sendEmailVerification(auth.currentUser);
export const resetPassword = email => fb.sendPasswordResetEmail(auth, email);
export async function refreshUser() {
  const u = auth.currentUser; if (!u) return null;
  await u.reload(); await u.getIdToken(true);
  return auth.currentUser;
}
export const stamp = () => fb.serverTimestamp();
export const newId = () => fb.doc(fb.collection(db, 'events')).id;

const toMap = s => { const o = {}; s.forEach(d => { o[d.id] = d.data(); }); return o; };
export const watchDoc = (col, id, cb, err) => fb.onSnapshot(fb.doc(db, col, id), s => cb(s.exists() ? s.data() : null, s.metadata), err);
export const watchCol = (col, cb, err) => fb.onSnapshot(fb.collection(db, col), s => cb(toMap(s), s.metadata), err);
export const watchEvents = (from, cb, err) =>
  fb.onSnapshot(fb.query(fb.collection(db, 'events'), fb.where('last', '>=', from)), s => cb(toMap(s), s.metadata), err);

export const setEvent = (id, data) => fb.setDoc(fb.doc(db, 'events', id), data);
export const delEvent = id => fb.deleteDoc(fb.doc(db, 'events', id));
export const setProfile = (uid, data) => fb.setDoc(fb.doc(db, 'people', uid), data);
export const addMember = email => fb.setDoc(fb.doc(db, 'members', email), { email, addedAt: fb.serverTimestamp() });
export const removeMember = email => fb.deleteDoc(fb.doc(db, 'members', email));
export const setName = name => fb.setDoc(fb.doc(db, 'config', 'main'), { name });
