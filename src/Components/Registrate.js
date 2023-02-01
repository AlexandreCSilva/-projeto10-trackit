import TrackitLogin from '../Img/Trackit-Login.png';
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postRegister } from '../Services/trackit';
import { ThreeDots } from  'react-loader-spinner';

export default function Registration () {
    const navigate = useNavigate();
    const [object, setObject] = useState({});
    const [isAble, setIsAble] = useState(true);
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        url: ''
    });
    
    function handleForm (e) {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        })
       
    }

    useEffect(() => {
        if (form.email !== '' && form.password !== '' && form.name !== '' && form.url !== '') {
            setObject({
                email: form.email,
                name: form.name,
                image: form.url,
	            password: form.password
            });
        }
    }, [form]);

    const makeRegister =  (event) => {
        object ? (
            postRegister(object).then(setIsAble(false))
            .catch(function (error) {
                alert('Ocorreu um erro no registro, tente novamente! '+error);
                setIsAble(true);
            }).then(function (response) {
                if (response) {
                    navigate('/');
                    console.log(response)
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
                <form onSubmit={makeRegister} >
                    <input type="email" name='email' value={form.email} onChange={handleForm} placeholder='email' disabled={!isAble ? true : false} />
                    <input type="password" name='password' value={form.password} onChange={handleForm} placeholder='senha' disabled={!isAble ? true : false} />
                    <input type="name" name='name' value={form.name} onChange={handleForm} placeholder='nome' disabled={!isAble ? true : false} />
                    <input type="url" name='url' value={form.url} onChange={handleForm} placeholder='foto' disabled={!isAble ? true : false} />
                    <button type="submit" disabled={!isAble ? true : false} >
                        {isAble ? 'Cadastrar' : <ThreeDots 
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
                <Link  to='/'>
                    Já tem uma conta? Faça login!
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