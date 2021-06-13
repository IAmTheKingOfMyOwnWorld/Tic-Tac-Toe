import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import {border} from "./Styles";

const customStyles={
  overlay: {
    backgroundColor: "rgba(0,0,0, 0.6)"
  }
};
export const Result=({isOpen, isClose, startNewGame, winner})=>{
  return(
    <StyledModal isOpen={isOpen} onRequestClose={isClose} style={customStyles} ariaHideApp={false}>
      <ModalWrapper>
        <ModalTitle>Game over</ModalTitle>
        <ModalContent>{winner}</ModalContent>
        <ModalFooter>
          <Button onClick={isClose}>Close</Button>
          <Button onClick={startNewGame}>Start over</Button>
        </ModalFooter>
      </ModalWrapper>
    </StyledModal>
  );
};

const StyledModal=styled(Modal)`
  height: 300px;
  position: relative;
  margin: 0 auto;
  top: 10%;
  right: auto;
  bottom: auto;
  width: 320px;
  outline: none;
  display: flex;
  flex-direction: column;
`;

const ModalWrapper=styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #fff;
  max-height: 100%;
  height: 100%;
  align-items: center;
  backface-visibility: hidden;
  padding: 1.25rem;
  ${border};
`;

const ModalTitle=styled.p`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ModalContent=styled.p`
  flex: 1 1 auto;
  text-align: center;
`;

ModalContent.displayName="ModalContent";

const ModalFooter=styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  width: 100%;
`;

const Button=styled.button`
  font-size: 16px;
`;