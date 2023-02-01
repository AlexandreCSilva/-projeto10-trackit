import dayjs from 'dayjs';
import { createContext, useState } from 'react';
import { useEffect } from 'react';

const UserContext = createContext();

function UserProvider({ children }){
    const userImage = JSON.parse(localStorage.getItem('userImage'));
    const [user, setUser] = useState(userImage);
    const [percentage, setPercentage] = useState(0);
    
    let day = JSON.parse(localStorage.getItem('day'));

    // To usando isso pra tirar o login da pessoa quando muda o dia, é pra evitar um erro que acontecia quando o dia mudava
    useEffect(() => {
        if (!day){
            localStorage.setItem('day', JSON.stringify(dayjs()));
            day = JSON.parse(localStorage.getItem('day'));
        }
        
        if (!dayjs().isSame(day, 'day')){
            localStorage.clear('day');
            setPercentage(0);
            localStorage.setItem('percentage', JSON.stringify(percentage));
            window.location.reload();
        }
    }, [])
    
    const percentageSaved = JSON.parse(localStorage.getItem('percentage'));

    if (percentageSaved){
        if (percentageSaved <= percentage){
            localStorage.setItem('percentage', JSON.stringify(percentage));
        } else {
            setPercentage(percentageSaved);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, percentage, setPercentage }}>
            { children }
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };