const miModulo = (() => {
    'use strict' 
  

    let deck      = [];
    const tipos   = ['C', 'D', 'H', 'S'],
          figuras = ['A', 'J', 'Q', 'K'];
    
    // let puntosJugador = 0,
    //     puntosBanca   = 0;
    let puntosJugadores = [];

    // Referencias del HTML
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');

    // Esta función inicializa el juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = createDeck();

        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++ ) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0 );

        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    // Esta funcion crea una nueva baraja
    const createDeck = () => {

        deck = [];
        for( let i = 2; i <=10; i++) {
            for( let tipo of tipos ) {
                deck.push( i + tipo );
            }
        }

        for( let tipo of tipos ) {
            for ( let figura of figuras ){
                deck.push( figura + tipo );
            }
        }

        return _.shuffle( deck );

    }

    // Esta función me permite tomar una carta
    const pedirCarta = () => {

        if ( deck.length === 0 ){
            throw 'No hay cartas en el deck';
        }       
        return deck.pop();
    }

    // Función para obtener el valor de la carta
    const valorCarta = ( carta ) => {
        const valor  = carta.substring(0, carta.length -1 );
        return ( isNaN( valor ) ) ?
                ( valor === 'A' ) ? 11 : 10
                : valor * 1;
    }

    // Turno: 0 = primer jugador y el último será la computadora
    const acumularPuntos = ( carta, turno ) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta ( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];

    }

    const crearCarta = ( carta, turno ) => {

        const imgCarta = document.createElement('img');
            imgCarta.src =`assets/cartas/${ carta }.png`;
            imgCarta.classList.add('carta');
            divCartasJugadores[turno].append( imgCarta );
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosBanca ] = puntosJugadores;

        setTimeout(() => {

            if( puntosMinimos === puntosBanca ) {
                alert('Empate');
            } else if ( puntosMinimos > 21 ) {
                alert('Gana la Banca')
            } else if ( puntosBanca > 21 ) {
                alert('Gana el Jugador')
            } else {
                alert('Gana la Banca')
            }
        }, 100 );
    }


    // Turno de la Banca
    const turnoBanca = ( puntosMinimos ) => {

        let puntosBanca = 0;

        do {
            const carta = pedirCarta();
            puntosBanca = acumularPuntos(carta, puntosJugadores.length -1 );
            crearCarta( carta, puntosJugadores.length -1 );

        } while( ( puntosBanca < puntosMinimos ) && ( puntosMinimos <= 21) );

        determinarGanador();

    }

    // Eventos
    btnPedir.addEventListener('click', () => {
        
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0 );

        crearCarta( carta, 0 );
       
        if ( puntosJugador > 21 ) {
            console.warn('Perdiste, te pasaste de 21');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoBanca( puntosJugador );
        } else if  (puntosJugador === 21 ) {
            console.warn('21 ¡¡¡BlackJack!!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoBanca( puntosJugador );
        }

    });

    btnDetener.addEventListener('click', () => {

        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoBanca( puntosJugadores[0] );

    });

    btnNuevo.addEventListener('click', () => {

        inicializarJuego();

    });

    return {
         nuevoJuego: inicializarJuego
    };

})();





