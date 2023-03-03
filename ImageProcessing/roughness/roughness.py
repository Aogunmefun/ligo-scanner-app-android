import cv2
import numpy as np
import argparse

parser = argparse.ArgumentParser()

parser = argparse.ArgumentParser(description="Pass in an image file as an argument")

parser.add_argument("-i", "--input", help = "Process laser scan")

args = vars(parser.parse_args())

img = cv2.imread('roughness/'+args["input"])
imghsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

red_lower = np.array([0,100,20])
red_upper = np.array([255, 255, 255])

mask = cv2.inRange(imghsv, red_lower, red_upper)
img_masked = cv2.bitwise_and(img, img, mask=mask)

cv2.imwrite('outputs/masked.jpg', img_masked)
cv2.imwrite("outputs/mask.jpg", mask)

img_edges = cv2.Canny(img_masked,100,200)
cv2.imwrite("outputs/output.jpg", img_edges)