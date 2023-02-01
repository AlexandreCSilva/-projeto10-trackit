import styled from 'styled-components';
import dayjs from "dayjs";
import "dayjs/locale/pt";
import { getTodayHabits } from '../Services/trackit';
import { useState, useContext } from 'react';
import { checkHabits } from '../Services/trackit';
import { uncheckHabits } from '../Services/trackit';
import { UserContext } from "./Providers/userProvider";

export default function Today () {
    const [ todayHabits, setTodayHabits ] = useState([]);
    const auth = JSON.parse(localStorage.getItem('auth'));
    const config = { headers:{'Authorization': 'Bearer '+auth.token}};
    const { percentage, setPercentage } = useContext(UserContext);
    let arr = [];
    let c = 0;

    function gettingTodayHabits () {
            getTodayHabits(config)
        .catch(function (error) {
            alert('Ocorreu um erro no registro, tente novamente! '+error);
        }).then(function (response) {
            if (response) {
                setTodayHabits(response.data);
            }
        })
    };

    gettingTodayHabits();
    
    const checkingHabits = (habitId) => {
        checkHabits(habitId, config)
        .catch(function (error) {
            alert('Ocorreu um erro, tente novamente! '+error);
        }).then(function () {
            gettingTodayHabits();
        })
    };

    const uncheckingHabits = (habitId) => {
        uncheckHabits(habitId, config)
        .catch(function (error) {
            alert('Ocorreu um erro, tente novamente! '+error);
        }).then(function () {
            gettingTodayHabits();
        })
    };
    
    return (
        <Content>
            <Day>
                {dayjs().locale("pt").format("dddd")+', '+dayjs().locale("pt").format("D/MM")}
                {percentage === 0 ? <p>Nenhum hábito concluído ainda</p> : <h1>{percentage}% dos hábitos concluídos</h1>}
            </Day>

            <TodayHabits>
                {!todayHabits || todayHabits.length === 0 ? <p>Você ainda não possui nenhum hábito</p> : todayHabits.map((habit) => {
                    arr= [...arr, habit.done];

                    if (arr.length === todayHabits.length){
                        arr.map((check) => {
                            if (check === true){
                                c++;
                                localStorage.setItem('percentage', JSON.stringify(((c/arr.length) * 100).toFixed()));
                                setPercentage(((c/arr.length) * 100).toFixed());
                            }
                        })
                    } else {
                        localStorage.setItem('percentage', JSON.stringify(0));
                        setPercentage(0);
                    }
                    
                    return <ShowingHabits checked={habit.done}>
                        <span>
                            <Data checked={habit.done} record={habit.currentSequence === habit.highestSequence && habit.highestSequence !== 0}>
                                <h1>{habit.name}</h1>
                                <div>
                                    <p>Sequência atual: <strong>{habit.currentSequence} dias</strong></p>
                                    <p>Seu recorde: <strong>{habit.highestSequence} dias</strong></p>
                                </div>
                            </Data>

                            <button onClick={() => !habit.done ? checkingHabits(habit.id) : uncheckingHabits(habit.id)} >
                                <ion-icon name="checkmark-outline"></ion-icon>
                            </button>
                        </span>
                    </ShowingHabits>
                })}    
            </TodayHabits>
            
        </Content>
    );
};

const Content = styled.div`
    padding: 0 18px;
    min-height: 100vh;
    max-height: max-content;
    margin-bottom: 80px;
    background-color: #E5E5E5;
`;

const Day = styled.div`
    margin-top: 70px;
    padding-top: 28px;
    color: #126BA5;
    font-family: 'Lexend Deca';
    font-weight: 400;
    font-size: 23px;

    h1,
    p {
        margin-top: 6px;
        margin-bottom: 32px;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 18px;
        color: #BABABA;
    }

    h1 {
        color: #8FC549;
    }
`;

const TodayHabits = styled.div`
    margin: 0 20px;

    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        margin: 30vh 20px 0 20px;
        text-align: center;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 18px;
        color: #BABABA;
    }
`;

const ShowingHabits = styled.div`
    padding: 13px;
    margin-bottom: 20px;
    width: 100%;
    height: 124px;
    background: #FFFFFF;
    border-radius: 5px;
    overflow: hidden;

    span {
        display: flex;
        justify-content: space-between;
    }

    span button {
        border: none;
        cursor: pointer;
        border-radius: 5px;
        background-color: ${props => props.checked ? '#8FC549' : '#EBEBEB'} ;
        margin: 4px;
        height: 119px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    span button  ion-icon {
        font-size: 64px;
        --ionicon-stroke-width: 66px;
        color: #FFFFFF;
    }
    
    h1 {
        margin: 0;
        margin-top: 12px;
        text-align: left;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 24px;
        color: #666666;
    }
`;

const Data = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div {
        background-color: #fff;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    
    p {
        margin: 0;
        padding: 0;
        text-align: left;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 16px;
        color: #666666;
    }

    strong {
        color: ${props => props.checked ? '#8FC549' : '#666666'};
    }

    div p:nth-child(2) strong {
        color: ${props => props.record ? '#8FC549' : '#666666'};
    }
`;