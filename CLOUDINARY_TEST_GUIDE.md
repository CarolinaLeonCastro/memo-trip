# Guide de Test - Intégration Cloudinary

## 🚀 Démarrage

Assurez-vous que vos variables d'environnement Cloudinary sont configurées dans le serveur :
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY` 
- `CLOUDINARY_API_SECRET`

## 📝 Tests à effectuer

### **1. Test Upload Photos de Lieux**

**Endpoint :** `POST /api/places/:id/photos`

```bash
# Exemple avec curl (remplacez :id par un vrai ID)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.jpg" \
  -F "captions[0]=Photo 1 description" \
  -F "captions[1]=Photo 2 description" \
  http://localhost:3000/api/places/:id/photos
```

**Résultat attendu :**
```json
{
  "message": "Photos ajoutées avec succès",
  "photos": [
    {
      "url": "https://res.cloudinary.com/your-cloud/image/upload/...",
      "public_id": "memo-trip/places/...",
      "variants": {
        "thumbnail": "https://res.cloudinary.com/your-cloud/image/upload/c_fill,h_150,w_150/...",
        "small": "https://res.cloudinary.com/your-cloud/image/upload/c_fill,h_200,w_300/...",
        "medium": "https://res.cloudinary.com/your-cloud/image/upload/c_fill,h_400,w_600/...",
        "large": "https://res.cloudinary.com/your-cloud/image/upload/c_fill,h_800,w_1200/..."
      }
    }
  ],
  "total_photos": 2
}
```

### **2. Test Upload Image de Couverture Journal**

**Endpoint :** `POST /api/journals/:id/cover-image`

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cover_image=@/path/to/cover.jpg" \
  http://localhost:3000/api/journals/:id/cover-image
```

**Résultat attendu :**
```json
{
  "message": "Image de couverture mise à jour avec succès",
  "journal": {
    "id": "...",
    "title": "Mon Journal",
    "cover_image": "https://res.cloudinary.com/...",
    "cover_image_variants": { /* variants */ }
  }
}
```

### **3. Test Suppression Photos**

```bash
# Supprimer photo de lieu
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/places/:id/photos/:photoId

# Supprimer image de couverture journal  
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/journals/:id/cover-image
```

## 🔍 Vérifications

### **Dans Cloudinary Dashboard :**
1. Vérifiez que les dossiers se créent : `memo-trip/places/` et `memo-trip/journals/`
2. Vérifiez les transformations automatiques (thumbnail, small, etc.)
3. Vérifiez la suppression des images lors des DELETE

### **Dans MongoDB :**
1. Vérifiez les nouveaux champs dans les documents Place :
   - `photos[].public_id`
   - `photos[].variants`
   - `photos[].width/height/format`

2. Vérifiez les nouveaux champs dans les documents Journal :
   - `cover_image_public_id`
   - `cover_image_variants`

### **Frontend (pas de changement nécessaire) :**
- Les composants existants continueront à fonctionner
- `PlaceImageGallery` affichera les URLs Cloudinary
- Les images seront optimisées automatiquement

## ⚡ Avantages obtenus

✅ **Performance :** CDN global Cloudinary
✅ **Optimisation :** Compression automatique, WebP
✅ **Responsive :** Variants pour différentes tailles
✅ **Sécurité :** URLs signées possibles
✅ **Storage :** Plus de stockage local
✅ **Backups :** Cloudinary gère la redondance

## 🐛 Debug

**Logs à surveiller :**
- `📤 Uploading image to Cloudinary`
- `✅ Image uploaded successfully` 
- `🗑️ Deleting image from Cloudinary`

**Erreurs courantes :**
- Variables d'env Cloudinary non configurées
- Limites d'upload dépassées
- Problèmes de permissions de fichiers temporaires

## 🎯 Prochaines étapes (optionnel)

1. **Migration des anciennes images :** Script pour migrer les images existantes vers Cloudinary
2. **Optimisations avancées :** Transformations sur-mesure selon le contexte 
3. **Upload direct frontend :** Upload direct depuis le client via signed URLs
