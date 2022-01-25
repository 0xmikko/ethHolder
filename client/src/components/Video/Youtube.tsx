import React from "react";
import { DarkenDiv, ModalDiv, YouTubeShowDiv } from "./styles";

export interface YoutubeShowProps {
  show: boolean;
  hide: () => void;
}

export function YouTubeShow({ show, hide }: YoutubeShowProps) {
  return show ? (
    <>
      <DarkenDiv />
      <ModalDiv>
        <YouTubeShowDiv>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <span style={{ cursor: "pointer" }} onClick={hide}>
              [ CLOSE ]
            </span>
          </div>

          <iframe
            allowFullScreen={false}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="YouTube video player"
            src="https://www.youtube.com/embed/GQBIOFw4if4?autoplay=1&amp;controls=0&amp;enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A3000&amp;widgetid=3"
            id="widget4"
            width="100%"
            height="100%"
            frameBorder="0"
          />
        </YouTubeShowDiv>
      </ModalDiv>
    </>
  ) : (
    <div />
  );
}
