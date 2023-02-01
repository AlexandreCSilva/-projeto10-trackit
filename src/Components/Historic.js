import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import { getDailyHabits } from '../Services/trackit';
import dayjs from "dayjs";
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(LocalizedFormat)

export default function Historic () {
    const [ habits, setHabits ] = useState([]);
    const [ screen, setScreen ] = useState();
    const auth = JSON.parse(localStorage.getItem('auth'));
    const config = { headers:{'Authorization': 'Bearer '+auth.token}};
    let daysMarkeds = [];
    let arr = [];

    getDailyHabits(config)
    .catch(function (error) {
        alert('Ocorreu um erro no registro, tente novamente! '+error);
    }).then(function (response) {
        if (response) {
            if (habits.length !== response.data.length){
                setHabits(response.data);
            }
        }
    })
    
    if (habits.length !== 0) {
        habits.map((day) => {
            let c1 = 0;
            let c2 = 0;
            day.habits.map((habit) => {
                c2++
                if (habit.done){
                    c1++
                }
                if (c1 === day.habits.length){
                    daysMarkeds.push({day: dayjs(day.day.split('/')[1]+'/'+day.day.split('/')[0]+'/'+day.day.split('/')[2]), done: true})
                } else if (c2 === day.habits.length){
                    daysMarkeds.push({day: dayjs(day.day.split('/')[1]+'/'+day.day.split('/')[0]+'/'+day.day.split('/')[2]), done: false})
                }
            });
        });
    }
    
    const formatDate = (date) => {
        let answer = '';

        daysMarkeds.map((dayMarked) => {
            if (dayjs().format('l') !== dayjs(dayMarked.day).format('l') && dayjs(dayMarked.day).format('l') === dayjs(date).format('l')) {
                if (dayMarked.done){
                    answer = 'done';
                } else {
                    answer = 'almost'
                }
            }
        })

        return answer;
    }

    const handleDate = (value) => {
        daysMarkeds.map((dayMarked) => {
            if (dayjs(dayMarked.day).format('l') === dayjs(value).format('l')) {
                setScreen(dayMarked.day);
            }
        })
    };

    const equalDate = (date) => {
        let day = dayjs(screen).format('L');
        return date.day === (day.toString().split('/')[1]+'/'+day.toString().split('/')[0]+'/'+day.toString().split('/')[2]);
    }

    return (
        <Content>
            <Title>
                {!screen ? 'Histórico' : (<>{dayjs(screen).locale("pt").format("dddd")+', '+dayjs(screen).locale("pt").format("D/MM")} <ion-icon name="close-outline" onClick={() => setScreen()}></ion-icon></>)}
            </Title>
            {!screen ? (<ShowCalendar>
                <Calendar
                    calendarType='US'
                    onClickDay={(value, event) => handleDate(value)}
                    locale='pt-br'
                    tileClassName={(date) => formatDate(dayjs(date.date))}
                />
            </ShowCalendar>) :  (<TodayHabits>
                {habits.filter(equalDate)[0].habits.map((habit) => {
                            arr= [...arr, habit.done];
                            return <ShowingHabits checked={habit.done}>
                                <span>
                                    <Data checked={habit.done} record={habit.currentSequence === habit.highestSequence}>
                                        <h1>{habit.name}</h1>
                                    </Data>

                                    <button>
                                        <ion-icon name={habit.done ? "checkmark-outline" : 'close-outline'}></ion-icon>
                                    </button>
                                </span>
                            </ShowingHabits>
                        })
                    }
            </TodayHabits>)}
            
        </Content>
    );
};


const Content = styled.div`
    padding: 0 18px;
    height: 100vh;
    background-color: #E5E5E5;
`;

const Title = styled.div`
    margin-top: 70px;
    padding-top: 28px;
    padding-bottom: 11px;
    color: #126BA5;
    font-family: 'Lexend Deca';
    font-weight: 400;
    font-size: 23px;
    display: flex;
    justify-content: space-between;

    ion-icon {
        color: red;
        font-size: 34px;
    }
`;

const ShowCalendar = styled.div`
    .react-calendar {
        width: 100%;
        height: 422px;
        border-radius: 15px;
        border: none;
    }
    
    .react-calendar__navigation button {
        color: #666666;
        font-size: 20px;
        margin-top: 8px;
        border-radius: 5px;
        font-family: 'Lexend Deca';
    }

    .react-calendar__tile {
        width: 20px;
        height: 45px;
    }

    .react-calendar__tile--now {
        border-radius: 6px;
    }
   
    .react-calendar__tile--active {
        background: #6f48eb;
        border-radius: 12px;
        font-weight: bold;
        color: white;
        box-sizing: border-box;
    }

    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
        background: #6f48eb;
        color: white;
    }
    
    .react-calendar__month-view__weekdays {
        text-decoration: none;
        color: #666666;
        font-size: 14px;
    }

    .done {
        background-image: linear-gradient(#8FC549, #8FC549);
    }

    .almost {
        background-image: linear-gradient(red, red);
    }

    .almost,
    .done {
        border-radius: 50%;
        border: none;
        padding: 0 20px;
        color: #000;
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
        background-color: ${props => props.checked ? '#8FC549' : 'red'} ;
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