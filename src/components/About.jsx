import React from "react";
import ModalShell from "./ModalShell.jsx";

function About() {
  return (
    <ModalShell title="About LoLFinder">
      <div className="aboutBody">
        <p>
          <strong>LoLFinder</strong> is a champion discovery tool built to help you
          browse the League of Legends roster, filter by role and difficulty, and
          quickly dive into champion details (lore + abilities) with recommendations
          for who to try next.
        </p>

        <h3 className="aboutHeading">Data Sources & Attribution</h3>
        <ul className="aboutList">
          <li>
            <strong>Riot Data Dragon</strong> powers champion metadata, icons, splash art,
            and ability information used throughout this site.
          </li>
          <li>
            <strong>3D Champion Models</strong> are referenced via Khada's community model viewer
            site (linked from the champion details page for external viewing).
          </li>
        </ul>

        <p className="aboutDisclaimer">
          Disclaimer: LoLFinder is a fan project and is not endorsed by Riot Games.
          League of Legends and related assets are trademarks of Riot Games.
        </p>

        <h3 className="aboutHeading">About Me</h3>
        <p>
          I'm a Frontend Developer who builds modern UIs using <strong>React</strong> —
          and I also build mobile apps for <strong>Android</strong> and <strong>iOS</strong>.
          Across my IT career, I've worked heavily with <strong>HTML</strong>, <strong>CSS</strong>,
          <strong> JavaScript</strong>, and <strong>React</strong>, and I've built native iOS features
          using <strong>Swift</strong>. I like shipping strong core functionality first, then polishing
          performance, UX, and design.
        </p>
      </div>
    </ModalShell>
  );
}

export default About;