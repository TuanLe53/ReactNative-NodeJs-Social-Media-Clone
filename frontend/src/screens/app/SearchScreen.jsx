import SafeAreaView from 'react-native-safe-area-view';
import { SearchBar } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';
import API_URL from '../../api/api_url';
import AuthContext from '../../context/AuthContext';
import UserComponent from '../../components/UserComponent';

export default function SearchScreen() {
    const { authState } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [apiUser, setApiUser] = useState([]);
    const [username, setUsername] = useState('');
    const [filterUser, setFilterUser] = useState(apiUser);
    
    const handleChange = (text) => {
        let searchInput = text.toLowerCase();
        setUsername(searchInput);
        
        const filterResult = apiUser.filter((user) =>
                        user.username.includes(searchInput)
        );

        setFilterUser(filterResult);
    };

    useEffect(() => {
        fetch(`${API_URL.PROFILE}`,
            {headers: {'Authorization': `Bearer ${String(authState.authToken)}`}})
            .then(res => res.json())
            .then(data => {
                setApiUser(data)
                setFilterUser(data)
            })
            .catch(err => console.log(err))
            .finally(() => {setIsLoading(false)})
    },[])

    return (
        <SafeAreaView forceInset={{top: 'always'}}>
            <SearchBar
                placeholder='Enter username'
                value={username}
                onChangeText={text => handleChange(text)}
                round
            />
            {isLoading ?
                <ActivityIndicator />
                :
                filterUser.length === 0 ?
                    <Text>No users found</Text>
                    :
                    <FlatList
                        data={filterUser}
                        renderItem={({ item }) => (
                            <UserComponent profile={item} />
                        )}
                    />    
            }
        </SafeAreaView>
    )
}
