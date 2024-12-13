import {View, Text, StyleSheet} from 'react-native';

const Section = ({section}) => {
    return(
        <View style={styles.container}>
            <Text>{section.sectionName}</Text>
            <Text>{section.sectionCode}</Text>
            <Text>{section.sectionID}</Text>
            <Text>{section.dateTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'lightgray',
        marginVertical: 10,
    }
});

export default Section;
