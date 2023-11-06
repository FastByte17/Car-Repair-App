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

    // Function to handle entering edit mode.
    const handleEdit = () => {
        setEditing(true);
    };

    // Function to save changes or exit edit mode.
    const handleSave = () => {
        if (value === column.title) {
            setEditing(false);
            return
        }
        // Call the 'onSave' function to save the changes and exit edit mode.
        onSave(value, column.id);
        setEditing(false);
    };

    // Function to handle changes in the input field.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    // Render the input field when in editing mode.
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
