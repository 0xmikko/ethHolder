import styled from "styled-components";

export const VideoBtn = styled.div`
  font-size: 24px;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: black;
  border-radius: 20px;
  min-width: 500px;
  width: 500px;
  height: 80px;
`;

export const ModalDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: visible;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 1005;
  opacity: 100%;
  overflow: hidden;
`;

export const DarkenDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  z-index: 1004;
  background-color: black;
  opacity: 40%;
  overflow: hidden;
`;

export const YouTubeShowDiv = styled.div`
  height: 55vh;
  width: 80vw;
  background-color: black;
  border-radius: 25px;
`
