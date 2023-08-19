const boxForm = document.getElementById("boxForm");
boxForm.addEventListener("submit", function (event) {
  event.preventDefault();
  calculateMaxBoxes();
  maxBoxesResult();
});

  function calculateMaxBoxes() {
    const palletLength = parseInt(document.getElementById('palletLength').value);
    const palletWidth = parseInt(document.getElementById('palletWidth').value);
    const palletHeight = parseInt(document.getElementById('palletHeight').value);
    const boxLength = parseInt(document.getElementById('boxLength').value);
    const boxWidth = parseInt(document.getElementById('boxWidth').value);
    const boxHeight = parseInt(document.getElementById('boxHeight').value);
    const boxWeight = parseInt(document.getElementById('boxWeight').value);
    const maxLoadWeight = parseInt(document.getElementById('maxLoadWeight').value);
    const maxBoxesByWeight = Math.floor(maxLoadWeight / boxWeight);

    let maxBoxesTotalForFreePallet = 0;

    const allPossibleBoxConfigurations = [
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Width", length: boxLength, width: boxWidth, height: boxHeight },
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Height", length: boxLength, width: boxHeight, height: boxWidth },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Width", length: boxWidth, width: boxLength, height: boxHeight },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Height", length: boxWidth, width: boxHeight, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Width", length: boxHeight, width: boxWidth, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Height", length: boxHeight, width: boxLength, height: boxWidth },
    ];

    
 

    //-------Reset output results from previous calculations-----//
    document.getElementById('maxBoxesResult').innerText = '';
    document.getElementById('resultsFreePallet').innerText = '';
    document.getElementById('resultsFreeHeight').innerText = '';
    document.getElementById('resultsFreeWidth').innerText = '';
    document.getElementById('resultsFreeLength').innerText = '';

    let validBoxPlacement = false; // Флаг для определения правильной комбинации размещения

    for (const {length, width, height } of allPossibleBoxConfigurations) {
      if ((length <= palletLength && width <= palletWidth && height <= palletHeight) ||
          (width <= palletLength && length <= palletWidth && height <= palletHeight)) {
        validBoxPlacement = true; // Устанавливаю флаг, если нашло правильную комбинацию
        break; // Прекращаем проверку, так как уже нашло правильную комбинацию
      }
    }

    if (!validBoxPlacement) {
    document.getElementById('maxBoxesResult').innerText = `No valid box placement found. Please check your box and pallet dimensions.`;
    return; // Выйти из функции, так как данные некорректны
    }

    if (maxLoadWeight < boxWeight) {
      document.getElementById('maxBoxesResult').innerText = `Your cargo's weight exceeds the permissible loading limit. Please reduce the weight of your cargo to comply with the loading regulations.`;
      return;
    }

    for (const { orientation, length, width, height } of allPossibleBoxConfigurations) {
      const maxBoxesOnFloor = Math.floor(palletLength / length) * Math.floor(palletWidth / width);
      const maxLayers = Math.floor(palletHeight / height);
      const maxBoxes = maxBoxesOnFloor * maxLayers;

      if (maxBoxes > maxBoxesTotalForFreePallet) {
        maxBoxesTotalForFreePallet = maxBoxes;
        maxBoxesOnFloorFirstWay = maxBoxesOnFloor;
        maxLayersFirstWay = maxLayers;
        bestOrientation = orientation;
        fullHeight = maxLayers * height; // Calculate the full height based on the best orientation found
        fullWidth = (Math.floor(palletWidth / width)) * width;
        fullLenght = (Math.floor(palletLength / length)) * length;
        
      }  
    }



    const freeHeight = palletHeight - fullHeight; // Calculate the free height
    const freeWidth = palletWidth - fullWidth; 
    const freeLength = palletLength - fullLenght;
    const remainingBoxesByWeight = maxBoxesByWeight - maxBoxesTotalForFreePallet;
    
    if(remainingBoxesByWeight > 0) {
      calculateMaxBoxesToFreeHeight(freeHeight);
      calculateMaxBoxesToFreeWidth(freeWidth);
      calculateMaxBoxesToFreeLength(freeLength);
    }
    
    return {
      maxBoxesTotalForFreePallet: maxBoxesTotalForFreePallet,
      maxBoxesOnFloorFirstWay: maxBoxesOnFloorFirstWay,
      maxLayersFirstWay: maxLayersFirstWay,
      bestOrientation: bestOrientation,
      freeHeight: freeHeight,
      freeLength: freeLength,
      freeWidth: freeWidth,
      maxBoxesByWeight: maxBoxesByWeight,
    };  
  }

  
  function calculateMaxBoxesToFreeHeight(freeHeight) {
    const palletLength = parseInt(document.getElementById('palletLength').value);
    const palletWidth = parseInt(document.getElementById('palletWidth').value);
    const palletHeight = freeHeight;
    const boxLength = parseInt(document.getElementById('boxLength').value);
    const boxWidth = parseInt(document.getElementById('boxWidth').value);
    const boxHeight = parseInt(document.getElementById('boxHeight').value);
  
    let maxBoxesTotalForFreeHeight = 0;
    let bestOrientationForFreeHeight ="";
  
    const allPossibleBoxConfigurations = [
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Width", length: boxLength, width: boxWidth, height: boxHeight },
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Height", length: boxLength, width: boxHeight, height: boxWidth },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Width", length: boxWidth, width: boxLength, height: boxHeight },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Height", length: boxWidth, width: boxHeight, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Width", length: boxHeight, width: boxWidth, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Height", length: boxHeight, width: boxLength, height: boxWidth },
    ];
  
    for (const { orientation, length, width, height } of allPossibleBoxConfigurations) {
      const maxBoxesOnFloor = Math.floor(palletLength / length) * Math.floor(palletWidth / width);
      const maxLayers = Math.floor(palletHeight / height);
      const maxBoxes = maxBoxesOnFloor * maxLayers;
  
      if (maxBoxes > maxBoxesTotalForFreeHeight) {
        maxBoxesTotalForFreeHeight = maxBoxes;
        maxBoxesOnFloorSecondWay = maxBoxesOnFloor;
        maxLayersSecondWay = maxLayers;
        bestOrientationForFreeHeight = orientation;
      }
    }
  
    return {
      maxBoxesTotalForFreeHeight: maxBoxesTotalForFreeHeight,
      maxBoxesOnFloorSecondWay: maxBoxesOnFloorSecondWay,
      maxLayersSecondWay: maxLayersSecondWay,
      bestOrientationForFreeHeight: bestOrientationForFreeHeight,
    };
  }
  
  
  function calculateMaxBoxesToFreeWidth(freeWidth) {
    const palletLength = parseInt(document.getElementById('palletLength').value);
    const palletWidth = freeWidth;
    const palletHeight = parseInt(document.getElementById('palletHeight').value);
    const boxLength = parseInt(document.getElementById('boxLength').value);
    const boxWidth = parseInt(document.getElementById('boxWidth').value);
    const boxHeight = parseInt(document.getElementById('boxHeight').value);   
    
    let maxBoxesTotalForFreeWidth = 0;
    let maxBoxesOnFloorThirdWay = 0;
    let maxLayersThirdWay = 0;
    let bestOrientationForFreeWidth = 0;
  
    const allPossibleBoxConfigurations = [
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Width", length: boxLength, width: boxWidth, height: boxHeight },
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Height", length: boxLength, width: boxHeight, height: boxWidth },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Width", length: boxWidth, width: boxLength, height: boxHeight },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Height", length: boxWidth, width: boxHeight, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Width", length: boxHeight, width: boxWidth, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Height", length: boxHeight, width: boxLength, height: boxWidth },
    ];
  
    for (const { orientation, length, width, height } of allPossibleBoxConfigurations) {
      const maxBoxesOnFloor = Math.floor(palletLength / length) * Math.floor(palletWidth / width);
      const maxLayers = Math.floor(palletHeight / height);
      const maxBoxes = maxBoxesOnFloor * maxLayers;
  
      if (maxBoxes > maxBoxesTotalForFreeWidth) {
      maxBoxesTotalForFreeWidth = maxBoxes;
      maxBoxesOnFloorThirdWay = maxBoxesOnFloor;
      maxLayersThirdWay = maxLayers;
      bestOrientationForFreeWidth = orientation;
      } 
    }
  
    console.log("max for free width " + maxBoxesTotalForFreeWidth);
    
    // if(maxBoxesTotalForFreeWidth > 0) {
    //   document.getElementById('resultsFreeWidth').innerText = "max for free width: max " + maxBoxesTotalForFreeWidth + ". Orientation " + bestOrientationForFreeWidth + " Layers: " + maxLayersThirdWay + " On layer: " + maxBoxesOnFloorThirdWay;
    // }
  
  
    return {
      maxBoxesTotalForFreeWidth: maxBoxesTotalForFreeWidth,
      maxBoxesOnFloorThirdWay: maxBoxesOnFloorThirdWay,
      maxLayersThirdWay: maxLayersThirdWay,
      bestOrientationForFreeWidth: bestOrientationForFreeWidth,
    };
  }
  
  function calculateMaxBoxesToFreeLength(freeLength) {
    const palletLength = freeLength;
    const palletWidth = parseInt(document.getElementById('palletWidth').value);
    const palletHeight = parseInt(document.getElementById('palletHeight').value);
    const boxLength = parseInt(document.getElementById('boxLength').value);
    const boxWidth = parseInt(document.getElementById('boxWidth').value);
    const boxHeight = parseInt(document.getElementById('boxHeight').value); 
    
    let maxBoxesTotalForFreeLength = 0;
    let maxBoxesOnFloorFourthWay = 0;
    let maxLayersFourthWay = 0;
    let bestOrientationForFreeLength = "";
  
    const allPossibleBoxConfigurations = [
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Width", length: boxLength, width: boxWidth, height: boxHeight },
      { orientation: "Box Length on Pallet Length, Box Width on Pallet Height", length: boxLength, width: boxHeight, height: boxWidth },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Width", length: boxWidth, width: boxLength, height: boxHeight },
      { orientation: "Box Width on Pallet Length, Box Length on Pallet Height", length: boxWidth, width: boxHeight, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Width", length: boxHeight, width: boxWidth, height: boxLength },
      { orientation: "Box Height on Pallet Length, Box Width on Pallet Height", length: boxHeight, width: boxLength, height: boxWidth },
    ];
  
    for (const { orientation, length, width, height } of allPossibleBoxConfigurations) {
      const maxBoxesOnFloor = Math.floor(palletLength / length) * Math.floor(palletWidth / width);
      const maxLayers = Math.floor(palletHeight / height);
      const maxBoxes = maxBoxesOnFloor * maxLayers;
  
      if (maxBoxes > maxBoxesTotalForFreeLength) {
      maxBoxesTotalForFreeLength = maxBoxes;
      maxBoxesOnFloorFourthWay = maxBoxesOnFloor;
      maxLayersFourthWay = maxLayers;
      bestOrientationForFreeLength = orientation;
      } 
    }
    // if(maxBoxesTotalForFreeLength > 0){
    //   document.getElementById('resultsFreeLength').innerText = "max for free Length: max " + maxBoxesTotalForFreeLength + ". Orientation " + bestOrientationForFreeLength + " Layers: " + maxLayersFourthWay + " On layer: " + maxBoxesOnFloorFourthWay;
    // }
  
    return {
      maxBoxesTotalForFreeLength: maxBoxesTotalForFreeLength,
      maxBoxesOnFloorFourthWay: maxBoxesOnFloorFourthWay,
      maxLayersFourthWay: maxLayersFourthWay,
      bestOrientationForFreeLength: bestOrientationForFreeLength,
    }

  }

  function maxBoxesResult() {
    const forEmptyPalletInfo = calculateMaxBoxes();
    const forFreeHeightInfo = calculateMaxBoxesToFreeHeight(forEmptyPalletInfo.freeHeight);
    const forFreeWidthInfo = calculateMaxBoxesToFreeWidth(forEmptyPalletInfo.freeWidth);
    const forFreeLengthInfo = calculateMaxBoxesToFreeLength(forEmptyPalletInfo.freeLength);
    let totalMaxBoxes = forEmptyPalletInfo.maxBoxesTotalForFreePallet + forFreeHeightInfo.maxBoxesTotalForFreeHeight + forFreeWidthInfo.maxBoxesTotalForFreeWidth + forFreeLengthInfo.maxBoxesTotalForFreeLength;
    const maxBoxesByWeight = calculateMaxBoxes(forEmptyPalletInfo.maxBoxesByWeight);

    let stackingDescription = "";
    let shouldContinueDescription = true;

    if (totalMaxBoxes <= 0) {
      stackingDescription += `Oops!, it seems we've hit a snag. The boxes are refusing to fit onto the pallet. Please double-check the dimensions you've entered for both the pallet and the boxes, all in millimeters? Once you've done that, give it another shot.\n`;
      document.getElementById("maxBoxesResult").innerText = stackingDescription;
    } else if (totalMaxBoxes <= forEmptyPalletInfo.maxBoxesByWeight) {
      document.getElementById('maxBoxesResult').innerText = `Maximum number of boxes on pallet: ${totalMaxBoxes}\n`;
    } else {
      totalMaxBoxes = maxBoxesByWeight;
      shouldContinueDescription = false;
      document.getElementById('maxBoxesResult').innerText = `Maximum number of boxes on pallet: ${forEmptyPalletInfo.maxBoxesByWeight}\n`;
      stackingDescription += `Based on the weight limit, each pallet has the capacity to hold up to ${forEmptyPalletInfo.maxBoxesByWeight === 1 ? '1 box' : forEmptyPalletInfo.maxBoxesByWeight + ' boxes'}.\n`; 
      stackingDescription += `Place ${forEmptyPalletInfo.maxBoxesByWeight === 1 ? ' the box' : forEmptyPalletInfo.maxBoxesByWeight + ' boxes'}, aligning ${forEmptyPalletInfo.bestOrientation}.`;
    }


    if(shouldContinueDescription){
      if (forFreeHeightInfo.maxBoxesTotalForFreeHeight > 0) {
        stackingDescription += `Follow these steps to stack your ${totalMaxBoxes === 1 ? '1 box' : totalMaxBoxes + ' boxes'} efficiently.\n`;
        stackingDescription += `Place ${forEmptyPalletInfo.maxLayersFirstWay === 1 ? '1 layer' : forEmptyPalletInfo.maxLayersFirstWay + ' layers'} of boxes, aligning ${forEmptyPalletInfo.bestOrientation}. Each layer accommodates ${forEmptyPalletInfo.maxBoxesOnFloorFirstWay === 1 ? '1 box' : forEmptyPalletInfo.maxBoxesOnFloorFirstWay + ' boxes'}.\n`;
        stackingDescription += `On top of the remaining space add ${forFreeHeightInfo.maxLayersSecondWay === 1 ? '1 layer' : forFreeHeightInfo.maxLayersSecondWay + ' layers'}, this time aligning ${forFreeHeightInfo.bestOrientationForFreeHeight}. Each of these layers holds ${forFreeHeightInfo.maxBoxesOnFloorSecondWay === 1 ? '1 box' : forFreeHeightInfo.maxBoxesOnFloorSecondWay + ' boxes'}.\n`;
      } else {
        stackingDescription += `Follow these steps to stack your ${totalMaxBoxes === 1 ? '1 box' : totalMaxBoxes + ' boxes'} efficiently.\n`;
        stackingDescription += `Place ${forEmptyPalletInfo.maxLayersFirstWay === 1 ? '1 layer' : forEmptyPalletInfo.maxLayersFirstWay + ' layers'} of boxes, aligning ${forEmptyPalletInfo.bestOrientation}. Each layer accommodates ${forEmptyPalletInfo.maxBoxesOnFloorFirstWay === 1 ? '1 box' : forEmptyPalletInfo.maxBoxesOnFloorFirstWay + ' boxes'}.\n`;
      }
  
      if (forFreeWidthInfo.maxBoxesTotalForFreeWidth > 0) {
       stackingDescription += `Based on available width add ${forFreeWidthInfo.maxLayersThirdWay === 1 ? '1 layer' : forFreeWidthInfo.maxLayersThirdWay + ' layers'} aligning ${forFreeWidthInfo.bestOrientationForFreeWidth}. Each layer accommodates ${forFreeWidthInfo.maxBoxesOnFloorThirdWay === 1 ? '1 box' : forFreeWidthInfo.maxBoxesOnFloorThirdWay + ' boxes'}.\n`;
      }
  
      if (forFreeLengthInfo.maxBoxesTotalForFreeLength > 0) {
       stackingDescription += `Based on available length add ${forFreeLengthInfo.maxLayersFourthWay === 1 ? '1 layer' : forFreeLengthInfo.maxLayersFourthWay + ' layers'} with ${forFreeLengthInfo.bestOrientationForFreeLength}. Each layer accommodates ${forFreeLengthInfo.maxBoxesOnFloorFourthWay === 1 ? '1 box' : forFreeLengthInfo.maxBoxesOnFloorFourthWay + ' boxes'}.\n`;
      }
    }
    
  document.getElementById('resultsFreeHeight').innerText = stackingDescription;
  }

 











// function results() {
//   const forEmptyPalletInfo = calculateMaxBoxes();

//   const forFreeHeightInfo = calculateMaxBoxesToFreeHeight(forEmptyPalletInfo.freeHeight);
// }







