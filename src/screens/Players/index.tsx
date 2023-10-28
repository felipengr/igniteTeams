import { useState, useEffect, useRef } from 'react';
import { FlatList, Alert, TextInput } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native';

import { AppError } from '@utils/AppError';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from '@components/PlayerCard';
import { Loading } from '@components/Loading';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
    group: string
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true)
    const [newPlayerName, setNewPlayerName] = useState('')
    const [team, setTeam] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

    const navigation = useNavigation()

    const route = useRoute()
    const { group } = route.params as RouteParams

    const newPlayerNameInputRef = useRef<TextInput>(null)

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Novo jogador', 'Informe o nome do jogador para o adicionar')
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group)
            newPlayerNameInputRef.current?.blur()

            setNewPlayerName('')
            fetchPlayersByTeam()

        } catch(error) {
            if(error instanceof AppError) {
                Alert.alert('Novo jogador', error.message)
            } else {
                console.error(error)
                Alert.alert('Novo jogador', 'Não foi possível adicionar o jogador')
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true)
            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        } catch(error) {
            console.error(error)
            Alert.alert('Jogadores', 'Não foi possível carregar os jogadores do time!')
        } finally {
            setIsLoading(false)
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group)
            fetchPlayersByTeam()

        } catch (error) {
            Alert.alert('Remover jogador', 'Não foi possível remover o jogador')
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group)
            
            navigation.navigate('groups')
        } catch (error) {
            console.error(error)
            Alert.alert('Remover grupo', 'Não foi possível remover o grupo.')
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Remover',
            'Deseja Remover o grupo',
            [
                { text: 'Não', style: 'cancel'},
                { text: 'Sim', onPress: () =>  groupRemove()}
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam()
    }, [team])

    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />

            <Form>
                <Input
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            {
                isLoading ? <Loading /> :
                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard
                            name={item.name}
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty
                            message='Não há pessoas nesse time'
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        players.length === 0 && { flex: 1 },
                    ]}
                />
            }

            <Button
                title='Remover Turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />
        </Container>
    )
}