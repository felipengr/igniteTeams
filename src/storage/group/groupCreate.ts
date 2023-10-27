import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/appError";
import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";

export async function groupCreate(newGroupName: string) {
    try {
        const storedGroups = await groupsGetAll()
        const groupAlreadyExists = storedGroups.includes(newGroupName)

        if(groupAlreadyExists) {
            throw new AppError('Já existe um grupo cadastrado com esse nome!')
        }

        const storage = JSON.stringify([...storedGroups ,newGroupName])

        await AsyncStorage.setItem(GROUP_COLLECTION, storage)
    } catch (error) {
        console.error(error)
        throw error
    }
}