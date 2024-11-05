import './App.css'
import { fichas } from './constants'
import { useState } from 'react'
import { esMovimientoValidoPeon, esMovimientoValidoTorre, esMovimientoValidoCaballo, esMovimientoValidoAlfil, esMovimientoValidoReina, esMovimientoValidoRey } from './components/movimientos'
function App() {
  const [piezas, setPiezas] = useState(fichas)
  const getFicha = (index) => {
    const ficha = piezas.find(ficha => 
      ficha.position.includes(index)
    )
    return ficha
  }

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('text/plain', index);
  };
// evita que el navegador recargue la pagina al mover las fichas
  const handleDragOver = (event) => {
    event.preventDefault(); 
  };
  // actualiza la posicion de la ficha
  const nuevaPosicion = (event, newIndex) => {
    event.preventDefault();
    const oldIndex = event.dataTransfer.getData('text/plain');
    const ficha = getFicha(parseInt(oldIndex))
    const piezaCapturada = getFicha(newIndex)

    if(ficha.name.includes('peon')){
      if(!esMovimientoValidoPeon(parseInt(oldIndex), newIndex, ficha, piezas)){
        return false
      }
    }
    if(ficha.name.includes('torre')){
      if(!esMovimientoValidoTorre(parseInt(oldIndex), newIndex, piezas, ficha)){
        return false
      }
    }
    if(ficha.name.includes('caballo')){
      if(!esMovimientoValidoCaballo(parseInt(oldIndex), newIndex, piezas, ficha)){
        return false
      } 
    }
    if(ficha.name.includes('alfil')){
      if(!esMovimientoValidoAlfil(parseInt(oldIndex), newIndex, piezas, ficha)){
        return false
      } 
    }
    if(ficha.name.includes('reina')){
      if(!esMovimientoValidoReina(parseInt(oldIndex), newIndex, piezas, ficha)){
        return false
      }
    }
    if(ficha.name.includes('rey')){
      if(!esMovimientoValidoRey(parseInt(oldIndex), newIndex, piezas, ficha)){
        return false
      }
    }
    // Actualizar las posiciones
    setPiezas(prevPosiciones => {
      // Primero, actualizar la pieza capturada si existe
      const posicionesSinCapturada = piezaCapturada 
        ? prevPosiciones.map(p => {
            if (p === piezaCapturada) {
              // Solo eliminar la posición específica del array de posiciones
              return {
                ...p,
                position: p.position.filter(pos => pos !== newIndex)
              }
            }
            return p
          })
        : prevPosiciones;

      // Luego actualizar la posición de la pieza movida
      return posicionesSinCapturada.map(p => {
        if (p.position.includes(parseInt(oldIndex))) {
          const newPosition = p.position.map(pos =>
            pos === parseInt(oldIndex) ? parseInt(newIndex) : pos
          )
          return {
            ...p,
            position: newPosition
          }
        }
        return p
      })
    });
  };
  const squares = Array.from({ length: 64 }, (_, index) => {
    const ficha = getFicha(index)
    return (
      <div 
      key={index} 
      className={`square ${Math.floor(index / 8) % 2 === 0 ? (index % 2 === 0 ? 'light' : 'dark') : (index % 2 === 0 ? 'dark' : 'light')}`}
      onDrop={(e) => nuevaPosicion(e, index)}
      onDragOver={handleDragOver}
      >
        {ficha && (
          <div className='fichas' id={index}>
            <img src={ficha.imagen} alt={ficha.name} className={ficha.name} key={index} draggable={true} onDragStart={(e) => handleDragStart(e, index)}/>
          </div>
        )}
      </div>
    )
  })
  return (
    <main>
      <section className='game'>
        <div className='board'>
          {squares}
        </div>
      </section>
    </main>
  )
}

export default App
