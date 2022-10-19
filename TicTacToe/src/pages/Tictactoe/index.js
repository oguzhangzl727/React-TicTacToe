import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import { Button, ButtonGroup, Modal, Typography, Box } from "@mui/material";
import { io } from "socket.io-client";
import Alert from "@mui/material/Alert";

const gridStyle = {
  borderColor: "black",
  borderStyle: "solid",
  borderWidth: 1.5,
  height: "70px",
  textAlign: "center",
  fontSize: 40,
};

const drawCondition = [
  ["0,0", "0,1", "0,2"],
  ["1,0", "1,1", "1,2"],
  ["2,0", "2,1", "2,2"],
];
const winCondition = [
  ["0,0", "0,1", "0,2"],
  ["1,0", "1,1", "1,2"],
  ["2,0", "2,1", "2,2"],
  ["0,0", "1,0", "2,0"],
  ["0,1", "1,1", "2,1"],
  ["0,2", "1,2", "2,2"],
  ["0,0", "1,1", "2,2"],
  ["0,2", "1,1", "2,0"],
];

const initialState = {
  board: {
    "0,0": null,
    "0,1": null,
    "0,2": null,
    "1,0": null,
    "1,1": null,
    "1,2": null,
    "2,0": null,
    "2,1": null,
    "2,2": null,
  },
  playerStartsFirst: true,
  gameStarted: false,
  gameEnded: false,
  twoPlayerGame: false,
  winner: "none",
  modal: false,
  boxValue: "X",
  thisPlayer: "X",
  playerX: false,
  playerO: false,
};

export default function SimpleContainer() {
  const [socket, setSocket] = useState();
  const [socketValue, setSocketValue] = useState();
  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("startGame", (data) => {
      console.log(data);
    });
    socket.on("newPlayer", (msg) => {
      console.log(msg);
    });
    socket.on("send_data", (data) => {
      // setPositionValue(data.position)
      setSocketValue(data);
      console.log(data);
      // setGameState((prevState) => ({ ...prevState, board: { ...prevState.board, [data.position]: data.value } }));
    });
    socket.on("gameRestart", (data) => {
      setSocketValue(null);
      setGameState({ ...initialState, twoPlayerGame: data.twoPlayerGame });
    });

    setSocket(socket);
  }, []);

  var nullPosition = [];
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setGameState((prevState) => ({ ...prevState, modal: false }));
  };

  const [gameState, setGameState] = useState(initialState);

  useEffect(() => {
    if (socketValue != null) {
      console.log("socketten veri geldi");
      setGameState((prevState) => ({
        ...prevState,
        board: {
          ...prevState.board,
          [socketValue.position]: prevState.boxValue,
        },
        boxValue: prevState.boxValue === "X" ? "O" : "X",
      }));
      setSocketValue(null);
    }
  }, [socketValue]);

  useEffect(() => {
    if (!checkWinConditions(gameState.board)) {
      checkDrawCondition(gameState.board);
    }
  }, [gameState.board]);

  function setPositionValue(position) {
    //todo eğer o pozisyonda deger varsa koymaya çalışma
    if (gameState.board[position] == null && gameState.winner === "none") {
      const newBoard = { ...gameState.board, [position]: gameState.boxValue };
      const winner = checkWinConditions(newBoard);
      if (gameState.twoPlayerGame === false) {
        setGameState((prevState) => ({ ...prevState, board: newBoard }));
        if (!winner) {
          computersTurn(newBoard, position);
        }
      }
      if (gameState.twoPlayerGame === true && gameState.gameEnded !== true) {
        if (gameState.thisPlayer !== gameState.boxValue) return;
        setGameState((prevState) => ({
          ...prevState,
          board: newBoard,
          boxValue: prevState.boxValue === "X" ? "O" : "X",
        }));
      }
    }
  }

  const emitData = (position) => {
    if (gameState.twoPlayerGame) {
      if (gameState.thisPlayer !== gameState.boxValue) return;
      socket.emit("send_data", { position: position });
    }
    setPositionValue(position);
  };
  console.log(gameState);

  //todo her X koyulduğunda, random bir null pozisyon seçilecek, ona O koyulayacak
  const computersTurn = (board, position) => {
    if (gameState.winner !== "none") return;
    const deger1 = RandomNullPosition(position);
    const newBoard = { ...board, [deger1]: "O" };
    setGameState((prevState) => ({ ...prevState, board: newBoard }));
    checkWinConditions(newBoard);
  };

  //todo null değerleri döndüren bir fonksiyon

  function RandomNullPosition(position) {
    let keys = Object.keys(gameState.board);

    // var result =keys.filter((a)=>gameState.board[a]==null&&a!==position);
    // if(!result.length)return null;
    // var  result2 =result[ Math.floor(Math.random() * result.length )]
    // return result2;

    keys.forEach((key) => {
      if (gameState.board[key] == null && key !== position) {
        nullPosition.push(key);
      }
    });
    console.log(nullPosition);
    var randomNullArea =
      nullPosition[Math.floor(Math.random() * nullPosition.length)];
    console.log(randomNullArea);
    return randomNullArea;
  }

  //
  const checkWinConditions = (board1) => {
    // win condition arrayinde loopla gez
    // 0,0 0,1 0,2 örn
    // board["0,0"] != null && board["0,0"] === board["0,1"] && board[]
    for (let i = 0; i < winCondition.length; i++) {
      let [a, b, c] = winCondition[i];

      if (
        board1[a] != null &&
        board1[a] === board1[b] &&
        board1[a] === board1[c]
      ) {
        setGameState((prevState) => ({
          ...prevState,
          modal: true,
          winner: board1[a],
          gameEnded: true,
        }));

        return true;
      }
    }
  };

  const checkDrawCondition = (board2) => {
    // every metodunu araştır
    //  const draw=function(item){
    //    return ( item !== null && (item === "X" || item === "O") && gameState.winner === "none")
    //  }
    //  const result1 = board2.every(draw);
    //  return result1;
    let doluKutu = 0;
    for (let i = 0; i < drawCondition.length; i++) {
      for (let d = 0; d < 3; d++) {
        const a = drawCondition[i][d];
        if (
          board2[a] !== null &&
          (board2[a] === "X" || board2[a] === "O") &&
          gameState.winner === "none"
        ) {
          doluKutu++;
        }
      }
    }
    if (doluKutu === 9) {
      setGameState((prevState) => ({ ...prevState, winner: "Berabere" }));
      setGameState((prevState) => ({ ...prevState, gameEnded: true }));
      setGameState((prevState) => ({ ...prevState, modal: true }));

      return true;
    }
  };

  const [display, setDisplay] = useState("block");
  return (
    <Container style={{ marginTop: 15 }} maxWidth="sm">
      <Box
        style={{
          backgroundColor: "#333",
          borderRadius: 4,
          color: "#eee",
          minHeight: 30,
          padding: 12,
          width: 200,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {gameState.twoPlayerGame === true
            ? " İki Kişilik Oyun Modu "
            : " Tek Kişilik Oyun Modu "}
        </Typography>
      </Box>
      <Grid>
        <p></p>
        {gameState.twoPlayerGame === true ? (
          <Box
            style={{
              backgroundColor: "lightblue",
              borderRadius: 4,
              color: "grey",
              minHeight: 25,
              padding: 12,
              width: 100,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {gameState.thisPlayer === gameState.boxValue
                ? " Sıra Sende "
                : " Sıra Karşı Tarafta "}
            </Typography>
          </Box>
        ) : null}
      </Grid>

      <Grid>
        <p></p>
        {gameState.playerX === true ? (
          <Alert severity="error">Seçilen Oyuncu: X Oyuncusu</Alert>
        ) : null}
      </Grid>

      <Grid>
        <p></p>
        {gameState.playerO === true ? (
          <Alert severity="error">Seçilen Oyuncu: O Oyuncusu</Alert>
        ) : null}
      </Grid>

      <Grid>
        <p></p>
      </Grid>
      <Box
        display={display}
        style={{
          backgroundColor: "grey",
          position: "absolute",
          zIndex: 1,
          width: 553,
          height: 210,
          alignSelf: "center",
          opacity: 0.4,
          textAlign: "center",
        }}
        onClick={() => setDisplay("none")}
      >
        <Typography
          style={{
            textAlign: "center",
            fontSize: 70,
            color: "black",
            padding: 50,
          }}
        >
          {" "}
          Start Game !!!{" "}
        </Typography>
      </Box>
      <Grid container>
        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("0,0")}>
          <Item>{gameState.board["0,0"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("0,1")}>
          <Item>{gameState.board["0,1"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("0,2")}>
          <Item>{gameState.board["0,2"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("1,0")}>
          <Item>{gameState.board["1,0"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("1,1")}>
          <Item>{gameState.board["1,1"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("1,2")}>
          <Item>{gameState.board["1,2"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("2,0")}>
          <Item>{gameState.board["2,0"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("2,1")}>
          <Item>{gameState.board["2,1"]}</Item>{" "}
        </Grid>

        <Grid xs={4} style={gridStyle} onClick={(event) => emitData("2,2")}>
          <Item>{gameState.board["2,2"]}</Item>{" "}
        </Grid>
      </Grid>

      <Grid container>
        <Grid>
          <p></p>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              variant="outline-secondary"
              onClick={() =>
                setGameState(
                  (prevState) => ({ ...prevState, twoPlayerGame: true }),
                  setGameState(initialState),
                  setDisplay("block")
                )
              }
            >
              {" "}
              2 Kisilik Oyun{" "}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() =>
                setGameState(
                  (prevState) => ({ ...prevState, twoPlayerGame: false }),
                  setGameState(initialState),
                  setDisplay("block")
                )
              }
            >
              {" "}
              Tek Kişilik Oyun{" "}
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid>
          <p></p>
          <ButtonGroup
            style={{ marginLeft: 100 }}
            variant="contained"
            aria-label="outlined primary button group"
          >
            {/* <Button
              onClick={(event) => {
                setGameState({ ...gameState, gameStarted: true });
              }}
            >
              {" "}
              Start Game{" "}
            </Button> */}
            <Button
              onClick={() => {
                // setGameState(
                // (prevState) => ({ ...prevState, restart: true }),
                // );
                socket.emit("restartRequest", {
                  twoPlayerGame: gameState.twoPlayerGame,
                });
                setDisplay("block");
              }}
            >
              {" "}
              Restart{" "}
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid>
          <p></p>
          {gameState.twoPlayerGame === true ? (
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                variant="outlined"
                onClick={() =>
                  setGameState(
                    (prevState) => ({
                      ...prevState,
                      thisPlayer: "X",
                      playerX: true,
                    }),
                    setDisplay("block")
                  )
                }
              >
                X OYUNCUSU
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  setGameState(
                    (prevState) => ({
                      ...prevState,
                      thisPlayer: "O",
                      playerO: true,
                    }),
                    setDisplay("block")
                  )
                }
              >
                O OYUNCUSU
              </Button>
            </ButtonGroup>
          ) : null}
        </Grid>
      </Grid>

      <Modal
        open={gameState.modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {gameState.winner === "X"
              ? " X Kazandı! "
              : gameState.winner === "O"
              ? " O Kazandı! "
              : " Berabere! "}
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
}
