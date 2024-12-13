import {View, Text, StyleSheet} from 'react-native';

const enrolledSection = ({section}) => {
    return(
        <View style={styles.container}>
            <Text>{section.sectionName}</Text>
            <Text>{section.firstName} {section.middleName} {section.lastName}</Text>
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

export default enrolledSection;
