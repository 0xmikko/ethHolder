import React, { useState } from "react";
import youtubeLogo from "../../assets/youtube.svg";
import { VideoBtn } from "./styles";
import { YouTubeShow } from "./Youtube";

export function VideoButton(): React.ReactElement {
  const [show, setShow] = useState(false);

  return (
    <>
      <YouTubeShow show={show} hide={() => setShow(false)} />
      <VideoBtn onClick={() => setShow(true)}>
        <img src={youtubeLogo} alt="Youtube" height={"60px"} />
        WTF ETH HODLER NFT?
      </VideoBtn>
    </>
  );
}
