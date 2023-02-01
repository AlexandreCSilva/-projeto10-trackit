import TrackitLogin from '../Img/Trackit-Login.png';
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import styled from 'styled-components';

const MIN_10 = 60 * 10;

function renderError() {
    localStorage.clear('auth');
    localStorage.clear('userImage');
    
    return (
        <>
            <Logo>
                <img src={TrackitLogin} alt=''/>
            </Logo>
            
            <Text>
                VOCÊ NÃO ESTÁ AUTORIZADO
            </Text>

            <Button>
                <Link  to='/'>
                    <button>Login</button>
                </Link>
            </Button>
            
        </>
    );
}

export default function PrivatePage({ children }) {
    const auth = JSON.parse(localStorage.getItem('auth'));
    
    if (!auth) {
        return renderError();
    }

    const now = dayjs().unix();
    const timeLogged = auth.timestamp;

    if (dayjs(now).diff(dayjs(timeLogged)) <= MIN_10) {
        return (
        <>
            {children}
        </>
        );
    } else {
        return renderError();
    }
}

const Logo = styled.div`
    margin: 66px 0 34px 0;

    display: flex;
    justify-content: center;
`;

const Text = styled.div`
    font-family: 'Lexend Deca';
    color: #52B6FF;
    text-align: center;

    display: flex;
    justify-content: center;
`;

const Button = styled.div`
    display: flex;
    justify-content: center;
    text-decoration: none;

    a {
        text-decoration: none;
    }

    button {
        width: 100px;
        height: 45px;
        margin-top: 34px;
        font-size: 18px;
        border-radius: 5px;
        background-color: #52B6FF;
        border: none;
        font-weight: 400;
        font-size: 22px;
        color: #FFFFFF;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;