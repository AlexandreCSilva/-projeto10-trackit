import TrackitLogin from '../Img/Trackit-Login.png';
import { useNavigate, Link  } from "react-router-dom";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postLogin } from '../Services/trackit';
import { ThreeDots } from  'react-loader-spinner';
import dayjs from "dayjs";
import { useContext } from 'react';
import { UserContext } from "./Providers/userProvider";

export default function Login () {
    const navigate = useNavigate();
    const [object, setObject] = useState({});
    const [isAble, setIsAble] = useState(true);
    const { setUser } = useContext(UserContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    
    function handleForm (e) {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        }) 
    }

    useEffect(() => {
        if (form.email !== '' && form.password !== '') {
            setObject({
                email: form.email,
	            password: form.password
            });
        }
    }, [form]);

    const makeLogin = (event) => {
        
        object ? (
            postLogin(object).then(setIsAble(false))
            .catch(function (error) {
                alert('Ocorreu um erro no registro, tente novamente! '+error);
                setIsAble(true);
            }).then(function (response) {
                if (response) {
                    localStorage.setItem('userImage', JSON.stringify(response.data.image));
                    localStorage.setItem('auth', JSON.stringify({token: response.data.token, timestamp: dayjs().unix()}));
                    setUser(response.data.image);
                    navigate('/hoje');
                }
            }).finally(function(){
                setIsAble(true);
            })
        ) : alert('Preencha todos os campos!');

        event.preventDefault();
    }

    return (
        <>
            <Logo>
                <img src={TrackitLogin} alt=''/>
            </Logo>

            <Form>
                <form onSubmit={makeLogin}>
                    <input type="email" name='email' value={form.email} onChange={handleForm} placeholder='email' disabled={!isAble ? true : false} />
                    <input type="password" name='password' value={form.password} onChange={handleForm} placeholder='senha' disabled={!isAble ? true : false} />
                    <button type="submit">
                        {isAble ? 'Entrar' : <ThreeDots 
                            height="80" 
                            width="80" 
                            radius="9"
                            color="#FFFFFF" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />}
                    </button>
                </form>
            </Form>

            <Register>
                <Link  to='/cadastro'>
                    Não tem uma conta? Cadastre-se!
                </Link>
            </Register>
        </>
    );
};

const Logo = styled.div`
    margin: 66px 0 34px 0;

    display: flex;
    justify-content: center;
`;

const Register = styled.div`
    font-family: 'Lexend Deca';
    margin: 0px 36px;

    display: flex;
    justify-content: center;

    a {
        text-decoration: underline;
        color: #52B6FF;
        text-align: center;
    }
`;

const Form = styled.div`
    font-family: 'Lexend Deca';
    box-sizing: border-box;
    margin: 0px 36px;

    display: flex;
    justify-content: center;
    align-items: center;

    button,
    input {
        box-sizing: border-box;
        padding: 11px;
        width: 100%;
        height: 45px;
        margin-bottom: 4px;
        font-size: 18px;
        color: #666666;
        border: 1px solid #D5D5D5;
        border-radius: 5px;
    }

    button {
        padding: 0;
        width: 101%;
        background-color: #52B6FF;
        margin-bottom: 60px;
        border: none;
        font-weight: 400;
        font-size: 22px;
        color: #FFFFFF;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    button:disabled {
        background-color: #52B6FF;
        opacity: 0.6;
    }

    input::placeholder {
        color: #D4D4D4;
    }
`;