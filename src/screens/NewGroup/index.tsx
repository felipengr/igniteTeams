import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

export function NewGroup() {
    const [group, setGroup] = useState('')
    const navigation = useNavigation()

    function handleNew() {
        navigation.navigate('players', { groups: group })
    }

    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />

                <Highlight
                    title="Nova turma"
                    subtitle="Crie a turma para adicionar as pessoas"
                />

                <Input
                    placeholder="Nome da turma"
                    onChangeText={setGroup}
                />

                <Button
                    title="Criar"
                    onPress={handleNew}
                />
            </Content>
        </Container>
    )
}