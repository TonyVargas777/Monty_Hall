import React, { useState, useEffect } from "react";

const MontyHall = () => {
  const [doors, setDoors] = useState([]); // Contenido de las puertas
  const [selectedDoor, setSelectedDoor] = useState(null); // Puerta seleccionada
  const [revealedDoor, setRevealedDoor] = useState(null); // Puerta revelada
  const [finalChoice, setFinalChoice] = useState(null); // Elección final
  const [result, setResult] = useState(null); // Resultado del juego

  // Contadores de resultados
  const [changeWinCount, setChangeWinCount] = useState(0); // Cambiaste y ganaste
  const [changeLossCount, setChangeLossCount] = useState(0); // Cambiaste y perdiste
  const [keepWinCount, setKeepWinCount] = useState(0); // Mantener y ganar
  const [keepLossCount, setKeepLossCount] = useState(0); // Mantener y perder
  const [changeGamesCount, setChangeGamesCount] = useState(0); // Juegos donde se cambió
  const [keepGamesCount, setKeepGamesCount] = useState(0); // Juegos donde se mantuvo
  const [totalGames, setTotalGames] = useState(0); // Total de juegos

  const [simulationResults, setSimulationResults] = useState({
    wins: 0,
    losses: 0,
  }); // Resultados de simulaciones

  // Barajar las puertas al azar
  const shuffleDoors = () => {
    return ["goat", "goat", "car"].sort(() => Math.random() - 0.5);
  };

  // Inicializar las puertas al cargar el componente
  useEffect(() => {
    setDoors(shuffleDoors());
  }, []);

  // Revelar una cabra cuando se selecciona una puerta
  useEffect(() => {
    if (selectedDoor !== null) {
      const options = doors
        .map((door, index) => ({ type: door, index }))
        .filter(
          (door) => door.type === "goat" && door.index !== selectedDoor // Solo cabras y no la seleccionada
        );

      if (options.length > 0) {
        const revealed = options[Math.floor(Math.random() * options.length)];
        setRevealedDoor(revealed.index);
      } else {
        console.warn("No se pudo revelar ninguna puerta con cabra.");
      }
    }
  }, [selectedDoor, doors]);

  // Manejar la selección inicial de una puerta
  const handleSelectDoor = (index) => {
    if (selectedDoor === null) {
      setSelectedDoor(index); // Registrar selección
    }
  };

  // Confirmar la elección final del usuario
  const handleFinalChoice = (index) => {
    const isChanged = index !== selectedDoor; // Verificar si cambió la puerta
    const gameResult = doors[index]; // Determinar el resultado (car o goat)

    setFinalChoice(index);
    setResult(gameResult);

    // Actualizar contadores
    setTotalGames((prev) => prev + 1); // Incrementar juegos totales

    if (isChanged) {
      // Si el jugador cambió
      setChangeGamesCount((prev) => prev + 1); // Incrementar juegos donde se cambió
      if (gameResult === "car") {
        setChangeWinCount((prev) => prev + 1); // Incrementar victorias cambiando
      } else {
        setChangeLossCount((prev) => prev + 1); // Incrementar derrotas cambiando
      }
    } else {
      // Si el jugador mantuvo
      setKeepGamesCount((prev) => prev + 1); // Incrementar juegos donde se mantuvo
      if (gameResult === "car") {
        setKeepWinCount((prev) => prev + 1); // Incrementar victorias manteniendo
      } else {
        setKeepLossCount((prev) => prev + 1); // Incrementar derrotas manteniendo
      }
    }
  };

  // Simular 1000 juegos
  const simulateGames = (numGames) => {
    let changeWins = 0;
    let changeLosses = 0;
    let keepWins = 0;
    let keepLosses = 0;

    let changeGames = 0;
    let keepGames = 0;

    for (let i = 0; i < numGames; i++) {
      const shuffledDoors = shuffleDoors(); // Barajar puertas
      const initialChoice = Math.floor(Math.random() * 3); // Elegir una puerta al azar
      const options = shuffledDoors
        .map((door, index) => ({ type: door, index }))
        .filter(
          (door) => door.type === "goat" && door.index !== initialChoice // Solo cabras y no la inicial
        );

      const revealedDoor =
        options[Math.floor(Math.random() * options.length)].index; // Revelar una cabra
      const finalChoice = [0, 1, 2].find(
        (i) => i !== initialChoice && i !== revealedDoor
      ); // Cambiar elección
      const result = shuffledDoors[finalChoice];

      // Contar cambios
      changeGames++;
      if (result === "car") {
        changeWins++;
      } else {
        changeLosses++;
      }

      // Contar mantener
      keepGames++;
      const keepResult = shuffledDoors[initialChoice];
      if (keepResult === "car") {
        keepWins++;
      } else {
        keepLosses++;
      }
    }

    setSimulationResults({ changeWins, changeLosses, keepWins, keepLosses });
    setChangeGamesCount(changeGames);
    setKeepGamesCount(keepGames);
  };

  // Reiniciar el juego
  const resetGame = () => {
    setDoors(shuffleDoors());
    setSelectedDoor(null);
    setRevealedDoor(null);
    setFinalChoice(null);
    setResult(null);
  };

  const doorImages = ["/puerta1.jpg", "/puerta2.jpg", "/puerta3.jpg"]; // Rutas de las imágenes

  return (
    <div className="monty-hall-game">
      <div className="doors-container">
        {doors.map((door, index) => (
          <div
            key={index}
            className={`door ${selectedDoor === index ? "selected" : ""}`}
            onClick={() => handleSelectDoor(index)}
          >
            {revealedDoor === index ? (
              <img src="/goat.png" alt="Goat" className="door-image" />
            ) : finalChoice !== null && finalChoice === index ? (
              <img
                src={doors[index] === "car" ? "/car.png" : "/goat.png"}
                alt={doors[index]}
                className="door-image"
              />
            ) : (
              <img
                src={doorImages[index]}
                alt={`Puerta ${index + 1}`}
                className="door-image"
              />
            )}
          </div>
        ))}
      </div>
      <div className="controls">
        {selectedDoor !== null && finalChoice === null && (
          <div>
            <p>Has seleccionado la Puerta {selectedDoor + 1}.</p>
            <p>Revelamos una cabra detrás de la Puerta {revealedDoor + 1}.</p>
            <div style={{ margin: "10px 0" }}>
              <button onClick={() => handleFinalChoice(selectedDoor)}>
                Mantener elección
              </button>
              <button
                onClick={() =>
                  handleFinalChoice(
                    [0, 1, 2].find(
                      (i) => i !== selectedDoor && i !== revealedDoor
                    )
                  )
                }
              >
                Cambiar elección
              </button>
            </div>
          </div>
        )}
        {finalChoice !== null && (
          <div>
            <h2>
              {result === "car"
                ? "¡Ganaste el coche! 🎉"
                : "Obtuviste una cabra 🐐"}
            </h2>
            <button onClick={resetGame}>Jugar de nuevo</button>
          </div>
        )}
        <div style={{ marginTop: "20px" }}>
          <h2>Estadísticas:</h2>
          <p>Cambiaste de puerta y ganaste: {changeWinCount} veces.</p>
          <p>Cambiaste de puerta y perdiste: {changeLossCount} veces.</p>
          <p>
            Porcentaje de victorias cambiando:{" "}
            {changeGamesCount > 0
              ? ((changeWinCount / changeGamesCount) * 100).toFixed(2)
              : 0}
            %.
          </p>
          <p>Cambiaste de puerta: {changeGamesCount} veces.</p>
          <p>
            Porcentaje de victorias manteniendo:{" "}
            {keepGamesCount > 0
              ? ((keepWinCount / keepGamesCount) * 100).toFixed(2)
              : 0}
            %.
          </p>
          <p>Mantuviste la puerta: {keepGamesCount} veces.</p>
        </div>
        <div>
          <button onClick={() => simulateGames(10000)}>
            Simular 10000 juegos
          </button>
          {simulationResults.changeWins > 0 && (
            <div>
              <p>
                Porcentaje de victorias al cambiar:{" "}
                {(simulationResults.changeWins / 100).toFixed(2)}%
              </p>
              <p>
                Porcentaje de derrotas al cambiar:{" "}
                {(simulationResults.changeLosses / 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
        <hr />
        <footer className="footer">
          <p>Monty Hall Problem Simulator</p>
          <p>
            Este proyecto es una implementación del famoso problema de Monty
            Hall utilizando React. El juego simula la experiencia del programa
            de televisión "Let's Make a Deal", donde un concursante tiene que
            elegir entre tres puertas, detrás de una de las cuales hay un coche
            y detrás de las otras dos hay cabras. El objetivo del juego es
            entender las probabilidades de ganar el coche al cambiar de puerta
            después de que se revele una cabra.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MontyHall;
