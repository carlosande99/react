export const esMovimientoValidoPeon = (oldIndex, newIndex, ficha, piezas) => {
    const oldRow = Math.floor(oldIndex / 8)
    const newRow = Math.floor(newIndex / 8)
    const oldCol = oldIndex % 8
    const newCol = newIndex % 8

    // comprueba si hay una ficha delante
    const piezaDestino = piezas.find(p => p.position.includes(newIndex))
    // Si hay una pieza en el camino, no permite el movimiento hacia adelante
    if (newCol === oldCol && piezaDestino) {
      return false
    }

    const esBlanco = ficha.subname.includes('peonBlanca')
    const direccion = esBlanco ? -1 : 1
    const direccion2 = esBlanco ? -2 : 2
    // Movimiento de 2 casillas solo desde posición inicial
    const filaInicialBlancas = 6
    const filaInicialNegras = 1

    // Permitir captura en diagonal
    if (Math.abs(newCol - oldCol) === 1 && newRow === oldRow + direccion) {
      // Si hay una pieza del mismo color en el destino, no permitir el movimiento
      if (piezaDestino && !esMovimientoValidoColor(ficha, piezaDestino)) {
        return false
      }
      return piezaDestino !== undefined // Solo permite diagonal si hay una pieza para capturar
    }

    // Verificar si el movimiento es válido para un peón desde posición inicial 2 movimientos
    if(((esBlanco && oldRow === filaInicialBlancas) || (!esBlanco && oldRow === filaInicialNegras)) && newCol === oldCol && newRow === oldRow + direccion2) {
          if(esBlanco){
            const piezaDestino2 = piezas.find(p => p.position.includes(newIndex+8))
            if(piezaDestino2){
              return false
            }
            return true
          }else{
            const piezaDestino2 = piezas.find(p => p.position.includes(newIndex-8))
            if(piezaDestino2){
              return false
            }
            return true
          }
    }

    // Verificar si el movimiento es válido para un peón 1 movimientos
    if(newCol === oldCol && newRow === oldRow + direccion) {
      return true
    }

    return false
}

export const esMovimientoValidoTorre = (oldIndex, newIndex, piezas, ficha) => {
  const oldRow = Math.floor(oldIndex / 8)
  const newRow = Math.floor(newIndex / 8)
  const oldCol = oldIndex % 8
  const newCol = newIndex % 8
  
    // Verificar si hay una pieza del mismo color en el destino
    const piezaDestino = piezas.find(p => p.position.includes(newIndex))
    if (piezaDestino && !esMovimientoValidoColor(ficha, piezaDestino)) {
      return false
    }

  // Comprobar si hay piezas en el camino
  if (oldCol === newCol) { // Movimiento vertical
    const inicio = Math.min(oldRow, newRow)
    const fin = Math.max(oldRow, newRow)
    for (let row = inicio + 1; row < fin; row++) {
      const posicionIntermedia = row * 8 + oldCol
      if (piezas.some(p => p.position.includes(posicionIntermedia))) {
        return false
      }
    }
  } else if (oldRow === newRow) { // Movimiento horizontal
    const inicio = Math.min(oldCol, newCol)
    const fin = Math.max(oldCol, newCol)
    for (let col = inicio + 1; col < fin; col++) {
      const posicionIntermedia = oldRow * 8 + col
    }
  }

    if(oldCol === newCol || oldRow === newRow){
      if (piezaDestino && !esMovimientoValidoColor(ficha, piezaDestino)) {
        return false
      }
      return true
    }

  return false
}

export const esMovimientoValidoCaballo = (oldIndex, newIndex, piezas, ficha) => {
  const oldRow = Math.floor(oldIndex / 8)
  const newRow = Math.floor(newIndex / 8)
  const oldCol = oldIndex % 8
  const newCol = newIndex % 8 

  const difFilas = Math.abs(newRow - oldRow)
  const difColumnas = Math.abs(newCol - oldCol)

  const piezaDestino = piezas.find(p => p.position.includes(newIndex))
  if (piezaDestino && !esMovimientoValidoColor(ficha, piezaDestino)) {
    return false
  }

  if((difFilas === 2 && difColumnas === 1) || (difFilas === 1 && difColumnas === 2)){
    return true
  }

  return false
}

export const esMovimientoValidoAlfil = (oldIndex, newIndex, piezas, ficha) => {
  const oldRow = Math.floor(oldIndex / 8)
  const newRow = Math.floor(newIndex / 8)
  const oldCol = oldIndex % 8
  const newCol = newIndex % 8

  // Comprobar piezas en el camino diagonal
  const pasoFila = newRow > oldRow ? 1 : -1
  const pasoColumna = newCol > oldCol ? 1 : -1
  let fila = oldRow + pasoFila
  let columna = oldCol + pasoColumna

  while (fila !== newRow && columna !== newCol) {
    const posicionIntermedia = fila * 8 + columna
    if (piezas.some(p => p.position.includes(posicionIntermedia))) {
      return false
    }
    fila += pasoFila
    columna += pasoColumna
  }

  const piezaDestino = piezas.find(p => p.position.includes(newIndex))
  if (piezaDestino && !esMovimientoValidoColor(ficha, piezaDestino)) {
    return false
  }

  if(Math.abs(newRow - oldRow) === Math.abs(newCol - oldCol)){
    return true
  }
}

export const esMovimientoValidoReina = (oldIndex, newIndex, piezas, ficha) => {
  return esMovimientoValidoTorre(oldIndex, newIndex, piezas, ficha) || esMovimientoValidoAlfil(oldIndex, newIndex, piezas, ficha)
}

export const esMovimientoValidoRey = (oldIndex, newIndex, piezas, ficha) => {
  const oldRow = Math.floor(oldIndex / 8)
  const newRow = Math.floor(newIndex / 8)
  const oldCol = oldIndex % 8
  const newCol = newIndex % 8

  // Calcular la diferencia absoluta en filas y columnas
  const difFilas = Math.abs(newRow - oldRow)
  const difColumnas = Math.abs(newCol - oldCol)

  const piezaDestino = piezas.find(p => p.position.includes(newIndex))
  if (piezaDestino && !esMovimientoValidoColor(ficha, piezaDestino)) {
    return false
  }

  // El rey solo puede moverse una casilla en cualquier dirección
  // Por lo tanto, la diferencia en filas y columnas debe ser 0 o 1
  if( difFilas <= 1 && difColumnas <= 1 && !(difFilas === 0 && difColumnas === 0)){
    return true
  }

  return false

}


// Función auxiliar para verificar si la captura es válida
const esMovimientoValidoColor = (ficha, piezaDestino) => {
  if (!piezaDestino) return true; // Si no hay pieza en destino, el movimiento es válido
  return ficha.color !== piezaDestino.color; // Solo permite capturar piezas del color opuesto
}
