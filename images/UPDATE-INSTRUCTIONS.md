# How to Replace Gallery Images

Once you've added your 6 die casting photos to the `images/` folder, follow these steps:

## Step 1: Add Your Images

Make sure you have these 6 files in the `images/` folder:
- `automotive.jpg`
- `medical.jpg`
- `electronic.jpg`
- `finished.jpg`
- `industrial.jpg`
- `intricate.jpg`

## Step 2: Update index.html

Find these 6 lines in `index.html` and replace the Unsplash URLs:

### Line 175 - Automotive Components
**Current:**
```html
<img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop" alt="Precision automotive die cast components" loading="lazy">
```
**Replace with:**
```html
<img src="images/automotive.jpg" alt="Precision automotive die cast components" loading="lazy">
```

### Line 182 - Medical Equipment
**Current:**
```html
<img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop" alt="Precision medical device components" loading="lazy">
```
**Replace with:**
```html
<img src="images/medical.jpg" alt="Precision medical device components" loading="lazy">
```

### Line 189 - Electronic Housings
**Current:**
```html
<img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" alt="Electronic device housings and components" loading="lazy">
```
**Replace with:**
```html
<img src="images/electronic.jpg" alt="Electronic device housings and components" loading="lazy">
```

### Line 196 - Finished Parts
**Current:**
```html
<img src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?q=80&w=1200&auto=format&fit=crop" alt="Metal parts with chrome and powder coating finishes" loading="lazy">
```
**Replace with:**
```html
<img src="images/finished.jpg" alt="Metal parts with chrome and powder coating finishes" loading="lazy">
```

### Line 203 - Industrial Applications
**Current:**
```html
<img src="https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop" alt="Industrial die cast components and machinery" loading="lazy">
```
**Replace with:**
```html
<img src="images/industrial.jpg" alt="Industrial die cast components and machinery" loading="lazy">
```

### Line 210 - Intricate Designs
**Current:**
```html
<img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1200&auto=format&fit=crop" alt="Complex precision machined metal parts" loading="lazy">
```
**Replace with:**
```html
<img src="images/intricate.jpg" alt="Complex precision machined metal parts" loading="lazy">
```

## Step 3: Commit and Push

After making the changes:
```bash
git add images/
git add index.html
git commit -m "Replace generic gallery images with DeCardy die casting photos"
git push
```

## Quick Find & Replace

If you want to do it all at once, you can use find & replace in your editor:

1. Find: `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop`
   Replace: `images/automotive.jpg`

2. Find: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop`
   Replace: `images/medical.jpg`

3. Find: `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop`
   Replace: `images/electronic.jpg`

4. Find: `https://images.unsplash.com/photo-1565688534245-05d6b5be184a?q=80&w=1200&auto=format&fit=crop`
   Replace: `images/finished.jpg`

5. Find: `https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop`
   Replace: `images/industrial.jpg`

6. Find: `https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1200&auto=format&fit=crop`
   Replace: `images/intricate.jpg`

That's it! Your gallery will now display your actual die casting photos.
