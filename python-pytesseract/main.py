import numpy as np
from pytesseract import Output
import pytesseract
import cv2

filename = 'image-01.jpg'
filename = 'test.jpg'
image = cv2.imread(filename)


def areaFilter(minArea, inputImage):
    # Perform an area filter on the binary blobs:
    componentsNumber, labeledImage, componentStats, componentCentroids = \
        cv2.connectedComponentsWithStats(inputImage, connectivity=4)
    # Get the indices/labels of the remaining components based on the area stat
    # (skip the background component at index 0)
    remainingComponentLabels = [i for i in range(
        1, componentsNumber) if componentStats[i][4] >= minArea]
    # Filter the labeled pixels based on the remaining labels,
    # assign pixel intensity to 255 (uint8) for the remaining pixels
    filteredImage = np.where(
        np.isin(labeledImage, remainingComponentLabels) == True, 255, 0).astype('uint8')
    return filteredImage


def filter2(image):
    image = image.astype(float) / 255.  # Convert to float and divide by 255:
    image = 1 - np.max(image, axis=2)  # Calculate channel K:
    cv2.imshow("max", image)
    cv2.waitKey(0)
    image = (255 * image).astype(np.uint8)  # Convert back to uint 8:
    cv2.imshow("convert", image)
    cv2.waitKey(0)
    image = cv2.threshold(image, 10, 255, cv2.THRESH_OTSU)[1]
    cv2.imshow("Threshold", image)
    cv2.waitKey(0)
    minArea = 20
    image = areaFilter(minArea, image)
    cv2.imshow("areafilter", image)
    cv2.waitKey(0)
    # Use a little bit of morphology to clean the mask:
    # Set kernel (structuring element) size:
    kernelSize = 3
    # Set morph operation iterations:
    opIterations = 1
    # Get the structuring element:
    morphKernel = cv2.getStructuringElement(
        cv2.MORPH_RECT, (kernelSize, kernelSize))
    # Perform closing:
    image = cv2.morphologyEx(
        image, cv2.MORPH_CLOSE, morphKernel, None, None, opIterations, cv2.BORDER_REFLECT101)
    cv2.imshow("morphology", image)
    cv2.waitKey(0)
    image = (255-image)
    cv2.imshow("convert back", image)
    cv2.waitKey(0)

    def duplicate(x):
        def f(x): return np.array([x, x, x])
        return np.array([f(xi) for xi in x])
    image = np.apply_along_axis(duplicate, 1, image)
    return image


def filter1(image, thres=50):
    norm_img = np.zeros((image.shape[0], image.shape[1]))
    image = cv2.normalize(image, norm_img, 0, 255, cv2.NORM_MINMAX)
    image = cv2.threshold(image, thres, 255, cv2.THRESH_BINARY)[1]
    image = cv2.GaussianBlur(image, (1, 1), 0)
    cv2.imshow("filter1", image)
    cv2.waitKey(0)
    return image


def analyze(current_image):
    results = pytesseract.image_to_data(current_image, output_type=Output.DICT)
    for i in range(0, len(results['text'])):
        x = results["left"][i]
        y = results["top"][i]

        w = results["width"][i]
        h = results["height"][i]
        text = results["text"][i]
        conf = int(results["conf"][i])
        if conf > 70:
            text = "".join([c if ord(c) < 128 else "" for c in text]).strip()
            cv2.rectangle(current_image, (x, y),
                          (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(current_image, text, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 200), 2)
    # Displaying the image
    cv2.imshow("analyzed", current_image)
    cv2.waitKey(0)


cv2.imshow("base", image)
cv2.waitKey(0)
for i in np.arange(0, 255, 2):
    analyze(filter1(image, i))
analyze(filter1(filter2(image)))
