import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";

export async function groupsGetAll() {
    try{
        const storage = await AsyncStorage.getItem(GROUP_COLLECTION)

        const groups: string[] = storage ? JSON.parse(storage) : []

        return groups
    } catch (error) {
        console.error(error)
        throw error
    }
}