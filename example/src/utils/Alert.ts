import { Alert } from 'react-native';

export function confirm({ title, message, onOk }) {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => onOk(),
      },
    ],
    {
      cancelable: true,
    }
  );
}
