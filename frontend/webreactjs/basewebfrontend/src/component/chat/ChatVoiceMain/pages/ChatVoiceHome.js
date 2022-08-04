import React, { useState } from "react";
import classNames from "classnames";
import Join from "../components/Join";
import Host from "../components/Host";
import { CARD_LIST } from "../utils/constant";
import { cardTitle } from "../utils/helpers";
import "../styles/chatVoiceHome.css";

const MEET_ICON = "M";
const MEET_TITLE = "Meet";

export default function ChatVoiceMain() {
  const [selectedCard, setSelectedCard] = useState("host");

  const renderListCard = () => {
    return CARD_LIST.map((card, index) => (
      <div
        key={index}
        className={classNames("card-meet", {
          "selected-card": selectedCard === card,
        })}
      >
        <div className="card-name" onClick={() => setSelectedCard(card)}>
          {cardTitle[card]}
        </div>
      </div>
    ));
  };

  return (
    <div className="voice-chat-main">
      <div className="title-meet-row">
        <div className="icon-meet">{MEET_ICON}</div>
        <h1 className="title-meet">{MEET_TITLE}</h1>
      </div>
      <div className="card-meet-row">
        {renderListCard()}
        <div className="card-meet"></div>
      </div>
      <div className="home-meet-content">
        {selectedCard === CARD_LIST[0] && <Host />}
        {selectedCard === CARD_LIST[1] && <Join />}
      </div>
    </div>
  );
}
