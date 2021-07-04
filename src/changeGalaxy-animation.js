/**
 * Change Galaxy
 */
const changeGalaxy = () => {
  rotateMaterial()
  milkyWayMaterial()
  galaxy()
  if (generateGalaxy === galaxy) {
    if (points !== null) {
      geometry.dispose()
      if (rMaterial !== null) {
        rMaterial.dispose()
      }
      if (gMaterial !== null) {
        gMaterial.dispose()
      }
      scene.remove(points)
    }
    generateMaterial()
    star()
  }
  else if (generateGalaxy === star) {
    if (points !== null) {
      geometry.dispose()
      if (rMaterial !== null) {
        rMaterial.dispose()
      }
      if (gMaterial !== null) {
        gMaterial.dispose()
      }
      scene.remove(points)
    }
    generateMaterial()
    milkyWay()

  }
  else if (generateGalaxy === milkyWay) {
    if (points !== null) {
      geometry.dispose()
      if (rMaterial !== null) {
        rMaterial.dispose()
      }
      if (gMaterial !== null) {
        gMaterial.dispose()
      }
      scene.remove(points)
    }
    rotateMaterial()
    donuts()
  }
  else if (generateGalaxy === donuts) {
    if (points !== null) {
      geometry.dispose()
      if (rMaterial !== null) {
        rMaterial.dispose()
      }
      if (gMaterial !== null) {
        gMaterial.dispose()
      }
      scene.remove(points)
    }
    rotateMaterial()
    galaxy()
  }
}