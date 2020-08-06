import React, { useEffect , useState } from 'react';
import { firebase } from './firebase';

function App() {

  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState('');
  const [error, setError] = useState(null);

  useEffect( () =>{
      const obtenerDatos = async () =>{
          try {
              const db = firebase.firestore();
              const data = await db.collection('tareas').get()
              const arrayData = data.docs.map(doc =>({ id:doc.id, ...doc.data() }))
              //arrayData ordeno los datos junto el id con info
              console.log(arrayData);
              setTareas(arrayData);

          } catch (error) {
            console.log(error);
          }
      }
      obtenerDatos();
  },[])

  const agregar = async (e) =>{
    e.preventDefault();

    if(!tarea.trim()){
      setError('tarea vacia !')
      console.log('tarea vacia');
      return
    }

    try {
      
       const db = firebase.firestore();

       const nuevaTarea = {
         name: tarea,
         fecha: Date.now()
       }
       const data = await db.collection('tareas').add(nuevaTarea)
       setTareas([
         ...tareas,
         {...nuevaTarea, id:data.id} //id de firestore
       ])
       setTarea('');
       setError(null);

    } catch (error) {
      console.log(error);
    }

    console.log(tarea);
  }

  const eliminar = async (id) =>{
      try {
        const db = firebase.firestore();
        await db.collection('tareas').doc(id).delete();

        //Para que se actualize la lista de tareas
        const arrayFiltrado = tareas.filter(item => item.id !== id );
        setTareas(arrayFiltrado);

      } catch (error) {
        console.log(error);
      }
  }

  const activarModoEdicion = (item) =>{
    setModoEdicion(true); //cambio el estado flag y cambiara el form
    setTarea(item.name);
    setId(item.id);
    setError(null);
  }

  const editar = async (e) =>{
    e.preventDefault();
    if(!tarea.trim()){
      console.log('tarea de editar vacio');
      setError('tarea editar vacia !');
      return
    }
    try {

      const db = firebase.firestore();
      await db.collection('tareas').doc(id).update({
        name:tarea
      })
      const arrayEditado = tareas.map(item =>(
        item.id === id ? { id:item.id, fecha:item.fecha, name: tarea} : item
      ))
      setTareas(arrayEditado);
      setModoEdicion(false);
      setTarea('');
      setId('');
      setError(null);
      
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">APP Tareas - Firebase con React</h1>
        <hr/>
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-center my-5">Lista de tareas</h3>
            <ul className="list-group">
            {
              tareas.length === 0 ? (
              <li className="list-group-item">Sin Tareas</li>
              ) 
              : 
              (
                tareas.map(item => (
                  <li className="list-group-item" key={item.id} >
                    {item.name}
                    <button className="btn btn-danger btn-sm float-right"
                      onClick={ () => eliminar(item.id) }
                    >
                      Eliminar
                    </button>
                    <button className="btn btn-warning mr-2 btn-sm float-right"
                      onClick={ () => activarModoEdicion(item) }
                    >
                      Editar
                    </button>
                  </li>
                ))
              )
            }
            </ul>
          </div>
          <div className="col-md-6">
            <h3 className="my-5 text-center">
              {
                modoEdicion ? 'Editar tarea' : 'Agregar tarea'
              }
            </h3>
            <form onSubmit={ modoEdicion ? editar : agregar }>
              {
                error ? <span className="text-danger">{error}</span> : null
              }
              <input 
                type="text"
                placeholder="Ingresa una tarea"
                className="form-control mb-2"
                onChange={ e => setTarea(e.target.value) }
                value={tarea}
              />
              <button 
                className={
                  modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-primary btn-block'
                }
                type="submit"
              >
                {
                  modoEdicion ? 'Editar' : 'Agregar'
                }
              </button>
            </form>
          </div>
        </div>
    </div>
  );
}

export default App;
