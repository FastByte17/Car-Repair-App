import { useState, ChangeEvent } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { DraggableProvided } from 'react-beautiful-dnd'
import { Column } from '../../types';




type Props = {
    text: string
    onSave: (title: string, id: string) => void,
    provided: DraggableProvided,
    column: Column,
}
const EditableLabel = ({ text, onSave, provided, column }: Props) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>(text);
    const fonts = ['lg', 'xl', '2xl', '4xl']
    const padding = '0px 4px'

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = () => {
        if (value === column.title) {
            setEditing(false);
            return
        }
        onSave(value, column.id);
        setEditing(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    if (editing) {
        return (
            <Input
                fontSize={fonts[0]}
                marginRight={'8px'}
                value={value}
                onChange={handleChange}
                onBlur={handleSave}
                autoFocus
            />
        );
    }

    return (
        <Box onClick={handleEdit}>
            <Text
                {...provided.dragHandleProps}
                fontSize={fonts}
                padding={padding}>
                {text}
            </Text>
        </Box>
    );
};

export default EditableLabel;
