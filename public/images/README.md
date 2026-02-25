# Gallery Images Guide

This folder contains images for the photo gallery section on the DeCardy website.

## Required Images

Add 6 images to this folder with the following names:

1. **automotive.jpg** - Automotive die cast components
2. **medical.jpg** - Medical equipment precision parts
3. **electronic.jpg** - Electronic housings and components
4. **finished.jpg** - Parts with chrome plating or powder coating
5. **industrial.jpg** - Industrial applications and machinery
6. **intricate.jpg** - Complex precision machined parts

## Image Specifications

- **Format:** JPG or PNG (JPG recommended for smaller file size)
- **Dimensions:** 1200-1500px wide (will be cropped to 300px height automatically)
- **File Size:** Keep under 500KB each for fast loading
- **Quality:** 80-85% compression is ideal

## Optimization Tips

Before adding images, optimize them using:
- Online: https://tinypng.com or https://squoosh.app
- Command line: `convert input.jpg -resize 1200x -quality 85 output.jpg`

## Next Steps

After adding your images to this folder:
1. Update the image paths in `index.html` (lines 175, 182, 189, 196, 203, 210)
2. Change from Unsplash URLs to: `images/automotive.jpg`, `images/medical.jpg`, etc.
3. Commit and push your changes
