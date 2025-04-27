import { useNavigate } from "react-router-dom";
import "./Home.css";

export const Home=() => {
    const navigate=useNavigate();

    return(
        <div className="col tile_position">
            <div className="row">
                <div className="game_tile" onClick={() => navigate("/aimtrainer")}>
                    <div className="title">Aim Trainer</div>
                    <div className="description">
                        Slice as many Melons as possible
                    </div>
                </div>
                <div className="game_tile" onClick={() => navigate("/mathgame")}>
                    <div className="title">Math Game</div>
                    <div className="description">
                        Solve simple mathematical problems
                    </div>
                </div>
                <div className="game_tile" onClick={() => navigate("/seeker")}>
                    <div className="title">Seeker</div>
                    <div className="description">
                        Track the square
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="game_tile" onClick={() => navigate("/sequence")}>
                    <div className="title">Sequence</div>
                    <div className="description">
                        Remember the sequence and repeat it
                    </div>
                </div>
                <div className="game_tile" onClick={() => navigate("/typing")}>
                    <div className="title">Typing</div>
                    <div className="description">
                        Type the text fast and correct
                    </div>
                </div>
            </div>
        </div>
    )
}