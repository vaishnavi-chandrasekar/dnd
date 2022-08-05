import React, { useEffect, useState, useRef } from "react";

import { DragDropContainer, DropTarget } from "react-drag-drop-container";

const MOCK_DATA = [
  "https://c.tenor.com/tBJZuS792tQAAAAC/dog-doggo.gif",
  "https://pbs.twimg.com/profile_images/1329055838246375424/BiC4saDD_400x400.jpg",
  "https://c.tenor.com/v6ZLgCG_PwIAAAAd/doggo-pupper.gif",
  // "Apple","Orange","Strawberry"
];

const Food = (props) => {
  const { img, targetKey, order, dataImg, hidden = false, size } = props;
  const [isDrop, setIsDrop] = useState(false);

  const handleDrop = () => {
    setIsDrop(true);
  };

  if (hidden && isDrop) {
    return <></>;
  }
  return (
    <>
      <DragDropContainer
        targetKey={targetKey}
        dragData={{ order, dataImg }}
        onDrop={handleDrop}
      >
        <img width={`${size}px`} height={`${size}px`} src={img} alt="food" />
      </DragDropContainer>
    </>
  );
};

const DropZone = (props) => {
  const { pieceData, targetKey, handlePuzzleDrop, orderIndex } = props;

  const handleDrop = (e) => {
    const pieceData = {
      img: e?.dragData?.dataImg,
      order: e?.dragData?.order,
    };
    handlePuzzleDrop(e?.dragData?.order, orderIndex, pieceData);
  };

  return (
    <DropTarget targetKey={targetKey} onHit={handleDrop}>
      <div
        style={{
          width: 120,
          height: 120,
          border: "2px solid black",
          marginRight: 25,
          padding: 25,
        }}
      >
        {pieceData && (
          <Food
            hidden={false}
            targetKey="doggo"
            img={pieceData.img}
            order={pieceData.order}
            dataImg={pieceData.img}
            size={120}
          />
        )}
      </div>
    </DropTarget>
  );
};

export default function App() {
  const [state, setState] = useState({
    pieces: [],
    shuffled: [],
    solved: [],
  });

  const checkAnswer = () => {
    let isCorrect = false;
    for (let i = 0; i < state.solved.length; i++) {
      if (state.solved[i]?.order !== i) {
        isCorrect = false;
        break;
      }
      isCorrect = true;
    }

    return isCorrect;
  };

  const handlePuzzleDrop = (puzzlePieceData, selectIndex, pieceData) => {
    let solvedStateCopy = Object.assign(state.solved);

    // If position already occupied
    if (state.solved[selectIndex]) {
      const tempData = state.solved[selectIndex];
      const oldIndex = state.solved.findIndex(
        (solve) => solve?.order === pieceData.order
      );

      solvedStateCopy[oldIndex] = Object.assign({}, tempData);
      solvedStateCopy[selectIndex] = Object.assign({}, pieceData);

      setState({ ...state, solved: solvedStateCopy });

      if (checkAnswer()) {
        console.log("Congrat ");
      }
      return;
    }

    const isRedundant = state.solved.find((s) => s?.order === pieceData.order);

    solvedStateCopy[solvedStateCopy?.indexOf(isRedundant)] = undefined;

    solvedStateCopy[selectIndex] = Object.assign({}, pieceData);

    setState({ ...state, solved: solvedStateCopy });

    if (checkAnswer()) {
      console.log("Congrat ");
    }
  };

  const shufflePieces = (pieces) => {
    const shuffled = [...pieces];

    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  // initialize data
  useEffect(() => {
    const pieces = MOCK_DATA.map((pieceImg, i) => ({
      img: pieceImg,
      order: i,
    }));

    setState({
      pieces,
      shuffled: shufflePieces(pieces),
      solved: [...Array(3)],
    });
  }, []);

  return (
    <div className="App">
      <h1 style={{textAlign:"center"}}>Drag and Drop Simple Example...</h1>
      <div style={{ display: "flex", marginLeft: "45%", marginTop: "5%" }}>
        {state.shuffled.map((piece, index) => (
          <div key={index}>
            <Food
              hidden={true}
              targetKey="doggo"
              img={piece.img}
              order={piece.order}
              dataImg={piece.img}
              size={60}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: "30%",
          marginTop:"5%",
        }}
      >
        {state.solved.map((piece, i) => (
          <DropZone
            key={i}
            orderIndex={i}
            targetKey="doggo"
            handlePuzzleDrop={handlePuzzleDrop}
            pieceData={piece}
          />
        ))}
      </div>
    </div>
  );
}
