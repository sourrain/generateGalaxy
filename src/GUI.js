//Adding GUI
let GUIfolder = gui.addFolder('Tweak Your Galaxy')
//gui.remember(GUIfolder)
GUIfolder.add(parameters, 'size').min(0.01).max(1).step(0.02).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'count').min(1000).max(100000).step(100).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
GUIfolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
const addGUI = (generate) => {
    GUIfolder.__controllers.forEach(controller => controller.setValue(controller.initialValue))
    gui.removeFolder(GUIfolder)
    GUIfolder = gui.addFolder('Tweak Your Galaxy')
    GUIfolder.add(parameters, 'size').min(0.01).max(1).step(0.02).onFinishChange(generate)
    GUIfolder.add(parameters, 'count').min(1000).max(100000).step(100).onFinishChange(generate)
    GUIfolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generate)
    GUIfolder.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(generate)
    GUIfolder.add(parameters, 'spin').min(-2).max(2).step(1).onFinishChange(generate)
    GUIfolder.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generate)
    GUIfolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generate)
}