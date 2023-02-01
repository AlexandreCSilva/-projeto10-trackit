import styled from 'styled-components';
import { getHabits } from '../Services/trackit';
import { useState, useEffect } from 'react';
import { ThreeDots } from  'react-loader-spinner';
import { postHabits } from '../Services/trackit';
import { deleteHabits } from '../Services/trackit';

export default function Habits () {
    const [ habits, setHabits ] = useState([]);
    const auth = JSON.parse(localStorage.getItem('auth'));
    const config = { headers:{'Authorization': 'Bearer '+auth.token}};
    const [ creating, setCreating ] = useState(false);
    const [ refresh, setRefresh ] = useState(false);
    const [ weekdays, setWeekdays ] = useState([false,false,false,false,false,false,false]);
    const [ isAble, setIsAble ] = useState(true);
    const [ object, setObject ] = useState({});
    const [form, setForm] = useState({
        name: '',
    });

    const selectWeekday = (number) => {
        let arr = weekdays;
        arr[number]=!arr[number];
        setWeekdays(arr);
        setRefresh(!refresh);
    };

    function handleForm (e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (form.name !== '') {
            setObject({
                name: form.name,
            });
        }
    }, [form]);

    const sendHabit = (event) => {
        event.preventDefault();
        let arr = [];
        
        weekdays.map((day, index) => {
            if (day){
                arr.push(index);
            }
            return arr;
        });
        
        if (!object.name) {
            alert('De um nome ao seu hábito!');
        } else if (arr.length === 0) {
            alert('Selecione ao menos um dia da semana!');
        } else {
            postHabits({
                    name: object.name,
                    days: arr
            }, config).then(setIsAble(false))
            .catch(function (error) {
                alert('Ocorreu um erro, tente novamente! '+error);
                setIsAble(true);
            }).then(function (response) {
                if (response) {
                    setCreating(false)
                }
            }).finally(function(){
                setIsAble(true);
            })
        }
    }; 

    function deletingHabits (habitId) {
        deleteHabits(habitId, config)
        .catch(function (error) {
            alert('Ocorreu um erro, tente novamente! '+error);
        }).then(function () {
            getHabits(config)
            .catch(function (error) {
                alert('Ocorreu um erro no registro, tente novamente! '+error);
            }).then(function (response) {
                if (response) {
                    if (habits.length !== response.data.length){
                        setHabits(response.data);
                    }
                }
            })
        })
    };
    
    getHabits(config)
    .catch(function (error) {
        alert('Ocorreu um erro no registro, tente novamente! '+error);
    }).then(function (response) {
        if (response) {
            if (habits.length !== response.data.length){
                setHabits(response.data);
            }
        }
    })

    return (
        <Content>
            <Create>
                <p>Meus hábitos</p>
                <button onClick={() => setCreating(true)}>+</button>
            </Create>

            <YoursHabits>
                {creating ? 
                <CreateHabit >
                    <form onSubmit={sendHabit}>
                        <input type="text" name='name' placeholder='nome do hábito' onChange={handleForm} value={form.name} disabled={!isAble ? true : false}></input>
                    
                        <Weekdays>
                            <Weekday selected={weekdays[0]}>
                                <div onClick={() => isAble ? selectWeekday(0) : {}}>D</div>
                            </Weekday>
                            <Weekday selected={weekdays[1]}>
                                <div onClick={() => isAble ? selectWeekday(1) : {}}>S</div>
                            </Weekday>
                            <Weekday selected={weekdays[2]}>
                                <div onClick={() => isAble ? selectWeekday(2) : {}}>T</div>
                            </Weekday>
                            <Weekday selected={weekdays[3]}>
                                <div onClick={() => isAble ? selectWeekday(3) : {}}>Q</div>
                            </Weekday>
                            <Weekday selected={weekdays[4]}>
                                <div onClick={() => isAble ? selectWeekday(4) : {}}>Q</div>
                            </Weekday>
                            <Weekday selected={weekdays[5]}>
                                <div onClick={() => isAble ? selectWeekday(5) : {}}>S</div>
                            </Weekday>
                            <Weekday selected={weekdays[6]}>
                                <div onClick={() => isAble ? selectWeekday(6) : {}}>S</div>
                            </Weekday>
                        </Weekdays>
                        <Options>
                            <button type="submit">
                                {isAble ? 'Salvar' : <ThreeDots 
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
                            <button type="button" onClick={() => setCreating(false)}>Cancelar</button>
                        </Options>
                    </form>
                </CreateHabit> : <></>}
                {habits.length === 0 ? 
                    <p>Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!</p> 
                :
                    habits.map((habit) => {
                        return <Habit>
                            <p>{habit.name}</p>
                            <Weekdays>
                            <Weekday selected={habit.days[0] === 0}>
                                <div>D</div>
                            </Weekday>
                            <Weekday selected={habit.days[0] === 1 || habit.days[1] === 1}>
                                <div>S</div>
                            </Weekday>
                            <Weekday selected={habit.days[0] === 2 || habit.days[1] === 2 || habit.days[2] === 2}>
                                <div>T</div>
                            </Weekday>
                            <Weekday selected={habit.days[0] === 3 || habit.days[1] === 3 || habit.days[2] === 3 || habit.days[3] === 3}>
                                <div>Q</div>
                            </Weekday>
                            <Weekday selected={habit.days[0] === 4 || habit.days[1] === 4 || habit.days[2] === 4 || habit.days[3] === 4 || habit.days[4] === 4}>
                                <div>Q</div>
                            </Weekday>
                            <Weekday selected={habit.days[0] === 5 || habit.days[1] === 5 || habit.days[2] === 5 || habit.days[3] === 5 || habit.days[4] === 5 || habit.days[5] === 5}>
                                <div>S</div>
                            </Weekday>
                            <Weekday selected={habit.days[0] === 6 || habit.days[1] === 6 || habit.days[2] === 6 || habit.days[3] === 6 || habit.days[4] === 6 || habit.days[5] === 6 || habit.days[5] === 5}>
                                <div>S</div>
                            </Weekday>
                        </Weekdays>
                        <ion-icon name="trash-outline" onClick={() => window.confirm('Deseja realmente deletar o Hábito?') ? deletingHabits(habit.id) : ''}></ion-icon>
                        </Habit>
                    })
                }
            </YoursHabits>
        </Content>
    );
};

const Content = styled.div`
    padding: 0 18px;
    height: 100vh;
    background-color: #E5E5E5;
`;

const Create = styled.div`
   margin-top: 70px;
   height: 80px;

   display: flex;
   align-items: center;
   justify-content: space-between;

   p {
        color: #126BA5;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 23px;
   }

   button {
    width: 40px;
    height: 35px;
    background-color: #52B6FF;
    border-radius: 5px;
    border: none;
    color: #FFF;
    font-family: 'Lexend Deca';
    font-weight: 400;
    font-size: 26px;
   }
`;

const YoursHabits = styled.div`
    p {
        padding: 40px 20% 0 20%;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        text-align: center;
    }
`;

const CreateHabit = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 180px;
    background-color: #FFFFFF;
    border-radius: 5px;
    padding: 18px;
    margin-bottom: 20px;

    input {
        box-sizing: border-box;
        width: 98%;
        height: 45px;
        border: 1px solid #D5D5D5;
        border-radius: 5px;
        padding: 11px;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 20px;
        color: #666666;
    }

    input::placeholder {
        color: #DBDBDB;
    }
`;

const Weekdays = styled.div`
    margin-top: 8px;
    overflow: hidden;
    display: flex;
`;

const Weekday = styled.div`
    div {
        width: 30px;
        height: 30px;
        background-color: ${props => !props.selected ? '#FFFFFF' : '#CFCFCF'};
        border: 1px solid ${props => !props.selected ? '#D5D5D5' : '#CFCFCF'};
        border-radius: 5px;
        margin-right: 8px;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 20px;
        color: ${props => !props.selected ? '#DBDBDB' : '#FFF'};
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const Options = styled.div`
    margin-top: 28px;
    display: flex;
    flex-direction: row-reverse;

    button {
        width: 84px;
        height: 35px;
        background-color: #52B6FF;
        border-radius: 5px;
        border: none;
        color: #FFF;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button:nth-child(2) {
        background-color: #FFF;
        color: #52B6FF;
        margin-right: 18px;
    }

    button:disabled {
        background-color: #52B6FF;
        opacity: 0.6;
    }
`;

const Habit = styled(CreateHabit)`
    margin-bottom: 10px;
    height: 91px;
    position: relative;

    p {
        text-align: left;
        padding: 0;
        font-family: 'Lexend Deca';
        font-weight: 400;
        font-size: 20px;
        color: #666666;
    }

    ion-icon {
        font-size: 26px;
        color: #666666;
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 1;
    }
`;