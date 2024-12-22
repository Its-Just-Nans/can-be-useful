package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"os"
	"strconv"
)

func getImageFromFilePath(filePath string) (image.Image, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	image, err := png.Decode(f)
	return image, err
}

func getPixels() {

}

func toString(i uint32) string {
	return strconv.FormatInt(int64(i), 10)
}

func checkPix(pix color.Color, r uint32, g uint32, b uint32) bool {
	R, G, B, _ := pix.RGBA()
	if R == r && G == g && B == b {
		return true
	}
	return false
	//fmt.Println(toString(R) + " " + toString(G) + " " + toString(B))
}

func main() {
	img, _ := getImageFromFilePath("a.png")
	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			pix := img.At(x, y)
			//R, G, B, _ := pix.RGBA()
			if checkPix(pix, 0, 0, 0) {
				fmt.Print("█")
			} else if checkPix(pix, 65535, 65535, 65535) {
				fmt.Print(" ")
			}
		}
		fmt.Print("\n")
	}
}
