export const checkForCigaretteLabel = async (canvasRef, threshold) => {
  // Get the 2D context of the canvas
  const ctx = canvasRef.current.getContext("2d");

  // Get the pixel data of the canvas
  const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  const data = imageData.data;

  // Loop through every pixel in the image and check if it matches the color of the cigarette label
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    // Check if the pixel color matches the color of the cigarette label
    if (red >= 200 && green >= 200 && blue >= 200) {
      // Calculate the brightness of the pixel
      const brightness = (red + green + blue) / 3;

      // Check if the brightness exceeds the threshold
      if (brightness >= threshold) {
        // Return true to indicate that the cigarette label was detected
        return true;
      }
    }
  }

  // Return false to indicate that the cigarette label was not detected
  return false;
};

export default checkForCigaretteLabel;
