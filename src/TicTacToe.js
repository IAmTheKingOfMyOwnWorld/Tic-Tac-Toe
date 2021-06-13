import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import Board from './Board';
import {Dims, PlayerX, PlayerO, SquareDims, GameStates, Draw, GameModes} from './Constants';
import {minimax} from './minimax';
import {Result} from "./Result";
import {getRandomInt, switchPlayer} from './utils';
import {border} from "./Styles";

const arr=new Array(Dims**2).fill(null);
const board=new Board();

const TicTacToe=({squares=arr})=>{
    const [gameState, setGameState]=useState(GameStates.notStarted);
    const [grid, setGrid]=useState(squares);
    const [modalOpen, setModalOpen]=useState(false);
    const [mode, setMode]=useState(GameModes.medium);
    const [nextMove, setNextMove]=useState(null);
    const [players, setPlayers]=useState({
        human: null,
        computer: null
    });
    const [winner, setWinner]=useState(null);
    useEffect(()=>{
        const winner=board.calculateWinner(grid);
        const declareWinner=winner=>{
            let winnerStr;
            switch (winner){
                case PlayerX:
                    winnerStr="Player X wins!";
                    break;
                case PlayerO:
                    winnerStr="Player O wins!";
                    break;
                case Draw:
                default:
                    winnerStr = "It's a draw";
            }
            setGameState(GameStates.over);
            setWinner(winnerStr);
            setTimeout(()=>setModalOpen(true),300);
        };
        if(winner!==null&&gameState!==GameStates.over){
            declareWinner(winner);
        }
    },[gameState, grid, nextMove]);
    const move=useCallback((index, player)=>{
        if(player&&gameState===GameStates.inProgress){
            setGrid(grid=>{
                const gridCopy=grid.concat();
                gridCopy[index]=player;
                return gridCopy
            });
        }
    },[gameState]);
    const computerMove=useCallback(()=>{
        const board=new Board(grid.concat());
        const emptyIndices=board.getEmptySquares(grid);
        let index;
        switch(mode){
            case GameModes.easy:
                index=getRandomInt(0,8);
                while(!emptyIndices.includes(index)){
                    index=getRandomInt(0,8);
                }
                break;
            case GameModes.medium:
                const smartMove=!board.isEmpty(grid) && Math.random()<0.5;
                if(smartMove){
                    index=minimax(board,players.computer)[1];
                }
                else{
                    index=getRandomInt(0,8);
                    while(!emptyIndices.includes(index)){
                        index=getRandomInt(0,8);
                    }
                }
                break;
            case GameModes.difficult:
            default:
                index=board.isEmpty(grid) ?getRandomInt(0,8):minimax(board,players.computer)[1];
        }
        if(!grid[index]){
            move(index, players.computer);
            setNextMove(players.human);
        }
    },[move, grid, players, mode]);
    useEffect(()=>{
        let timeout;
        if(nextMove!==null&&nextMove===players.computer&&gameState!==GameStates.over){
            timeout=setTimeout(()=>{
                computerMove();
            },500);
        }
        return()=>timeout&&clearTimeout(timeout);
    },[nextMove, computerMove, players.computer, gameState]);
    const humanMove=index=>{
        if(!grid[index]&&nextMove===players.human){
            move(index, players.human);
            setNextMove(players.computer);
        }
    };
    const choosePlayer=option=>{
        setPlayers({
            human: option,
            computer: switchPlayer(option)
        });
        setGameState(GameStates.inProgress);
        setNextMove(PlayerX);
    };
    const startNewGame=()=>{
        setGameState(GameStates.notStarted);
        setGrid(arr);
        setModalOpen(false);
    };
    const changeMode=e=>{
        setMode(e.target.value);
    };
    return gameState===GameStates.notStarted ?(
        <Screen>
            <Inner>
                <ChooseText>Select Difficulty</ChooseText>
                <select onChange={changeMode} value={mode}>
                    {Object.keys(GameModes).map(key=>{
                        const gameMode=GameModes[key];
                        return(
                            <option key={gameMode} value={gameMode}>{key}</option>
                        );
                    })}
                </select>
            </Inner>
            <Inner>
                <ChooseText>Choose your player</ChooseText>
                <ButtonRow>
                    <button onClick={()=>choosePlayer(PlayerX)}>X</button>
                    <p>or</p>
                    <button onClick={()=>choosePlayer(PlayerO)}>O</button>
                </ButtonRow>
            </Inner>
        </Screen>
    ):(
        <Container dims={Dims}>
            {grid.map((value, index)=>{
                const isActive=value!==null;
                return(
                    <Square data-testid={`square_${index}`} key={index} onClick={()=>humanMove(index)}>
                        {isActive&&<Marker>{value===PlayerX ?"X":"O"}</Marker>}
                    </Square> 
                );
            })}
            <Strikethrough
            styles={
                gameState===GameStates.over&&board.Strike()
            }/>
            <Result
                isOpen={modalOpen}
                winner={winner}
                isClose={()=>setModalOpen(false)}
                startNewGame={startNewGame}/>
        </Container>
    );
};

const ButtonRow=styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const ChooseText=styled.p``;

const Container=styled.div`
  display: flex;
  justify-content: center;
  width: ${({dims})=>`${dims*(SquareDims+5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Inner=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Marker=styled.p`
  font-size: 68px;
`;

const Screen=styled.div``;

const Strikethrough=styled.div`
  position: absolute;
  ${({styles})=>styles}
  background-color: indianred;
  height: 5px;
  width: ${({styles})=>!styles&&"0px"};
`;

const Square=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SquareDims}px;
  height: ${SquareDims}px;
  ${border};;
  &:hover{
    cursor: pointer;
  }
`;
Square.displayName="Square";

export default TicTacToe;