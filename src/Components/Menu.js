import { useContext } from 'react';
import { UserContext } from "./Providers/userProvider";
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export default function Menu () {
    const { user, percentage } = useContext(UserContext);
    
    return (
        <>
            <Upper>
                <h1>TrackIt</h1>
                <img src={user} alt=''/>
            </Upper>

            <Lower>
                <Link to='/habitos'>Hábitos</Link>

                <div style={{ width: 120, height: 120 }}>
                    <Link to='/hoje'>
                        <CircularProgressbar
                            value={percentage}
                            text={`Hoje`}
                            background
                            backgroundPadding={6}
                            styles={buildStyles({
                            backgroundColor: "#3e98c7",
                            textColor: "#fff",
                            pathColor: "#fff",
                            trailColor: "transparent",
                            fontfamily: 'Lexend Deca',
                            strokeLinecap: "round"
                            })}
                        />
                    </Link>
                </div>
                
                <Link to='/historico'>Histórico</Link>
            </Lower>
        </>
    );
};

const Upper = styled.div`
    background-color: #126BA5;
    width: 100%;
    height: 70px;
    padding: 0 18px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);

    display: flex;
    justify-content: space-between;
    align-items: center;

    position: fixed;
    top: 0;
    z-index: 3;

    h1 {
        font-family: 'Playball', cursive;
        color: #FFFFFF;
        font-weight: 400;
        font-size: 38px;
    }

    img {
        margin-right: 38px;
        width: 51px;
        height: 51px;
        border-radius: 50%;
    }
`;

const Lower = styled.div`
    box-sizing: border-box;
    background-color: #FFFFFF;
    width: 100%;
    height: 70px;
    padding: 0 38px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    position: fixed;
    bottom: 0;
    z-index: 3;

    a {
        text-decoration: none;
        font-family: 'Lexend Deca';
        color: #52B6FF;
        font-size: 18px;
    }

    div {
        margin-bottom: 50px
    }
    
    .CircularProgressbar-text {
        transform: translate(-20px, 5px);
    }
`;