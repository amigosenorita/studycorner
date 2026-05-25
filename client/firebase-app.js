import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function listenForAuth(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function loginAdmin(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const adminSnap = await getDoc(doc(db, "admins", credential.user.uid));

    if (!adminSnap.exists()) {
        await signOut(auth);
        throw new Error("This account is not authorized as an admin.");
    }

    return credential.user;
}

export async function logoutAdmin() {
    await signOut(auth);
}

export function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

export async function uploadLeadFile(leadId, file, fieldName) {
    if (!file) return "";
    const extension = file.name.split(".").pop().toLowerCase();
    const storageRef = ref(storage, `lead-documents/${leadId}/${fieldName}.${extension}`);
    await uploadBytes(storageRef, file, { contentType: file.type });
    return getDownloadURL(storageRef);
}

export async function createLead(formData, files) {
    const leadRef = doc(collection(db, "leads"));
    const leadId = leadRef.id;

    const fileUrls = {
        studentPhotoUrl: await uploadLeadFile(leadId, files.studentPhoto, "student-photo"),
        aadhaarPhotoUrl: await uploadLeadFile(leadId, files.aadhaarPhoto, "aadhaar-card"),
        tenthMarksheetPhotoUrl: await uploadLeadFile(leadId, files.tenthMarksheetPhoto, "tenth-marksheet"),
        twelfthMarksheetPhotoUrl: await uploadLeadFile(leadId, files.twelfthMarksheetPhoto, "twelfth-marksheet")
    };

    await setDoc(leadRef, {
        ...formData,
        ...fileUrls,
        status: "New Lead",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    return leadId;
}

export async function listLeads(filters = {}) {
    const constraints = [orderBy("createdAt", "desc")];
    if (filters.status) constraints.unshift(where("status", "==", filters.status));
    if (filters.preferredCourse) constraints.unshift(where("preferredCourse", "==", filters.preferredCourse));

    const snapshot = await getDocs(query(collection(db, "leads"), ...constraints));
    return snapshot.docs.map(item => ({ _id: item.id, id: item.id, ...item.data() }));
}

export async function updateLead(id, data) {
    await updateDoc(doc(db, "leads", id), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteLead(id) {
    await deleteDoc(doc(db, "leads", id));
}

export async function listCollection(name) {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map(item => ({ _id: item.id, id: item.id, ...item.data() }));
}

export async function addCollectionItem(name, data) {
    return addDoc(collection(db, name), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

export async function updateCollectionItem(name, id, data) {
    await updateDoc(doc(db, name, id), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

export async function deleteCollectionItem(name, id) {
    await deleteDoc(doc(db, name, id));
}

window.FirebaseCRM = {
    auth,
    db,
    storage,
    listenForAuth,
    loginAdmin,
    logoutAdmin,
    getCurrentUser,
    createLead,
    listLeads,
    updateLead,
    deleteLead,
    listCollection,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
};
