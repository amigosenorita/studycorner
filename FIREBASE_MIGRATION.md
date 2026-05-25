# Firebase Migration Guide

This project is now prepared for Firebase Hosting, Firestore, Firebase Authentication, and Firebase Storage while keeping the existing `client` UI structure.

## 1. Target Folder Structure

```text
AdmissionCRM/
  client/
    assets/
    index.html
    admission-form.html
    dashboard.html
    login.html
    script.js
    style.css
    chatbot.js
    firebase-config.example.js
    firebase-config.js
    firebase-app.js
  firebase.json
  firestore.rules
  firestore.indexes.json
  storage.rules
```

`client` is the Firebase Hosting public folder.

## 2. Firebase Console Setup

1. Create a Firebase project on the Spark plan.
2. Add a Web app in Project settings.
3. Copy the Firebase web config.
4. Enable Authentication:
   - Provider: Email/Password
   - Create the first admin user manually.
5. Enable Firestore Database:
   - Start in production mode.
   - Choose the nearest supported region for your users.
6. Enable Storage:
   - Start with locked rules.

## 3. Add Firebase Config

Copy:

```text
client/firebase-config.example.js
```

to:

```text
client/firebase-config.js
```

Then replace the placeholder values with your Firebase web app config.

Do not commit real config if you later make the repository public. Firebase web config is not a secret by itself, but it should still be managed carefully with strict rules and authorized domains.

## 4. Data Model

Recommended collections:

```text
admins/{uid}
leads/{leadId}
formOptions/{optionId}
references/{referenceId}
publicSettings/{settingId}
```

### admins

```json
{
  "email": "admin@example.com",
  "name": "Admin",
  "role": "admin",
  "createdAt": "server timestamp"
}
```

Create this document manually after creating the admin Authentication user. The document ID must be the Firebase Auth UID.

### leads

```json
{
  "studentName": "Student Name",
  "aadhaar": "123456789012",
  "mobile": "9876543210",
  "email": "student@example.com",
  "preferredCourse": "Engineering",
  "preferredCollege": "PSG College of Technology",
  "studentPhotoUrl": "https://...",
  "aadhaarPhotoUrl": "https://...",
  "tenthMarksheetPhotoUrl": "https://...",
  "twelfthMarksheetPhotoUrl": "https://...",
  "status": "New Lead",
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

### formOptions

```json
{
  "category": "Preferred College",
  "value": "PSG College of Technology",
  "createdAt": "server timestamp"
}
```

### references

```json
{
  "name": "Google",
  "createdAt": "server timestamp"
}
```

## 5. CRUD Integration Plan

Use `client/firebase-app.js` as the Firebase service layer.

Replace the current localStorage calls in `client/script.js` gradually:

```js
// Current local flow
CRM.getLeads()
CRM.addLead(payload)
CRM.updateLeadStatus(id, status)
CRM.deleteLead(id)
```

with:

```js
import {
  createLead,
  listLeads,
  updateLead,
  deleteLead
} from "./firebase-app.js";
```

Recommended mapping:

```text
CRM.login                  -> loginAdmin
CRM.addLead                -> createLead
CRM.getLeads               -> listLeads
CRM.updateLeadStatus       -> updateLead
CRM.deleteLead             -> deleteLead
CRM.getFormOptions         -> listCollection("formOptions")
CRM.addFormOption          -> addCollectionItem("formOptions", data)
CRM.deleteFormOption       -> deleteCollectionItem("formOptions", id)
CRM.getReferences          -> listCollection("references")
CRM.addReference           -> addCollectionItem("references", data)
CRM.deleteReference        -> deleteCollectionItem("references", id)
```

## 6. Admin Panel Security

Authentication alone is not enough. Use both:

1. Firebase Auth Email/Password login.
2. `admins/{uid}` allow-list in Firestore rules.

Only admins can:

- Read all leads
- Update lead status
- Delete leads
- Add/edit/delete colleges
- Add/edit/delete references
- Read uploaded documents

Public visitors can:

- Submit admission forms
- Upload required form images
- Read public form options

## 7. Firestore Rules

Rules are in:

```text
firestore.rules
```

They use:

- `rules_version = '2'`
- Admin allow-list via `admins/{uid}`
- Aadhaar validation with `^[0-9]{12}$`
- Deny-by-default fallback

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

## 8. Storage Rules

Rules are in:

```text
storage.rules
```

They allow:

- Public form image uploads under `lead-documents/{leadId}/`
- Admin-only read/update/delete
- Image-only uploads
- 5 MB max file size

Deploy rules:

```bash
firebase deploy --only storage
```

## 9. Hosting Deployment

The project already has:

```json
{
  "hosting": {
    "public": "client"
  }
}
```

Deploy:

```bash
firebase deploy --only hosting
```

Deploy everything:

```bash
firebase deploy
```

## 10. Spark Plan Notes

The Spark plan is good for the first version, but keep these limits in mind:

- Optimize reads by loading only the required dashboard data.
- Add pagination for leads.
- Compress images before upload when possible.
- Avoid polling Firestore every few seconds.
- Use Firestore indexes for dashboard filters.

## 11. Best Practices

- Never use `allow read, write: if true`.
- Keep all admin writes behind Firebase Auth and rules.
- Use Storage rules to limit file type and size.
- Validate important fields in both HTML and Firestore rules.
- Store download URLs in Firestore, not base64 images.
- Use timestamps from Firebase, not client-created dates.
- Keep existing static pages cacheable and lightweight.
- Add authorized domains in Firebase Authentication before deployment.
