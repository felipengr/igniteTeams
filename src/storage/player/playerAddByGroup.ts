import AsyncStorage  from '@react-native-async-storage/async-storage';
import { AppError } from '@utils/AppError';
import { PLAYER_COLLECTION } from '@storage/storageConfig';
import { playersGetByGroup } from './playerGetByGroup'
import { PlayerStorageDTO } from './PlayerStorageDTO'

export async function playerAddByGroup(newPLayer: PlayerStorageDTO, group: string) {
    try {
        const storedPlayers = await playersGetByGroup(group)

        const playerAlreadyExists = storedPlayers.filter(
            player => player.name === newPLayer.name
        )

        if (playerAlreadyExists. length > 0) {
            throw new AppError('Essa pessoa já está adiconada em um dos times.')
        }

        const storage = JSON.stringify([...storedPlayers, newPLayer])

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
    } catch(error) {
        console.error(error)
        throw error
    }
}