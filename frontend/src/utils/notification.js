import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

export async function registerForPushNotificationsAsync() {
	let token;

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') {
		alert('Failed to get push token for push notification!');
		return;
	}
	token = (await Notifications.getExpoPushTokenAsync()).data;
	// console.log("This is a token", token);

	// test_token = (await Notifications.getDevicePushTokenAsync()).data;
	// console.log("TEST", test_token)

	return token;
}