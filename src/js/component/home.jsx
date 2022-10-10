import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";

//create your first component
const Home = () => {

	const listaAux = [];

	//Declaracion de estados
	const [lista, setLista] = useState([]);
	const [cancionIdx,setCancionIdx] = useState("");
    const cancionRef = useRef(null);

    // Se obtienen las canciones
	function getInfo() {
		fetch('https://assets.breatheco.de/apis/sound/songs') //ir a busca
			.then((response) => {
				console.log("Status: " + response.status);
				return response.json()
			}) //promesa 1
			.then((data) => addSongToList(data)) //promesa 2
			.catch((err) => console.log("Error: " + err))
	}

    // Se recorre el json y por cada item se agrega un objeto a una lista auxiliar, luego se asigna a la lista. 
	function addSongToList(data){
		data.map((item, index) => {
			console.log(item)
			listaAux.push({
				id: index,
				name: item.name,
				url: 'https://assets.breatheco.de/apis/sound/' + item.url
			})
		});
		setLista(listaAux);
		listaAux = []; //Vacio la lista auxiliar
	}

    // Funcion para reproducir
	function playSong(){
        cancionRef.current.play();
	}

    // Funcion para pausar
	function pauseSong(){
        cancionRef.current.pause();
	}

    // Funcion para retroceder
    function backSong(){
        cancionRef.current.src = (cancionIdx - 1 >= 0) ? lista[cancionIdx - 1].url : lista[lista.length-1].url;
        (cancionIdx - 1 >= 0) ? setCancionIdx(cancionIdx - 1) : setCancionIdx(lista.length-1) ;
        playSong();
	}

    // Funcion para avanzar
    function forwardSong(){
        cancionRef.current.src = (cancionIdx + 1 < lista.length) ? lista[cancionIdx + 1].url : lista[0].url;
        (cancionIdx + 1 < lista.length) ? setCancionIdx(cancionIdx + 1) : setCancionIdx(0);
        playSong();
	}

    // Setea el indice de la cancion seleccionada, asigna a cancionRef el source y reproduce
    function clickCancion(itemLista){
        setCancionIdx(itemLista.id);
        cancionRef.current.src = itemLista.url;
        playSong();
    }
	

	//Llama la funcion getInfo para traer las canciones
	useEffect(()=>{
		getInfo()
	},[])

	return (
       
        <div className="d-flex flex-column align-items-center justify-content-center">
            <h1>EsePoteFeo</h1>
            <form onSubmit={e => e.preventDefault()}>
                <ul className="list-unstyled d-flex flex-column p-0 bg-dark text-white">
                    {// Se crea la lista de canciones con map
                        lista.map((item, index) => {
                            return (
                                <li key={item.id} className="d-flex listItem">
                                    {item.id}&nbsp;{item.name}
                                    <span
                                        className="ml-auto"
                                        role="button"
                                        tabIndex="0"
                                        onClick={() => clickCancion(item)}>
                                        &nbsp;&nbsp;
                                        <i className="fas fa-play"></i>
                                    </span>
                                </li>
                            );
                        })}
                    <li className="mt-3 d-inline-flex align-items-center justify-content-center">
                        
                        <span className="ml-auto">
                            <a
                                href="#"
                                className="btn btn-dark"
                                // Llama la funcion para retroceder 
                                onClick={() => backSong()}>
                                <i className="fas fa-backward "></i>
                            </a>
                            &nbsp;
                            <a
                                href="#"
                                className="btn btn-dark"
                                // Llama la funcion para pausar 
                                onClick={() => pauseSong()}>
                                <i className="fas fa-pause"></i>
                            </a>
                            &nbsp;
                            <a
                                href="#"
                                className="btn btn-dark"
                                // Llama la funcion para reproducir 
                                onClick={() => playSong()}>
                                <i className="fas fa-play"></i>
                            </a>
                            &nbsp;
                            <a
                                href="#"
                                className="btn btn-dark"
                                // Llama la funcion para avanzar  
                                onClick={() => forwardSong()}>
                                <i className="fas fa-forward"></i>
                            </a>
                            <audio ref={cancionRef} src="" type="audio/mpeg"></audio>
                        </span>
                    </li>
                </ul>
            </form>
        </div>
		
	);
};

export default Home;
