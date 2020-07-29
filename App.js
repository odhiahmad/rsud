/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import {fcmService} from './src/fcm/FCMService';
import {localNotificationService} from './src/fcm/LocalNotificationService';
import Main from './src/Main';
import persist from './src/config/store';
import FlashMessage from 'react-native-flash-message';
import options from 'react-native-actionsheet/lib/options';

const persistStore = persist();

export default function App() {

    useEffect(() => {
        // Assume a message-notification contains a "type" property in the data payload of the screen to open
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);

        function onRegister(token) {
            // console.log(token);
        }

        function onNotification(notify) {
            // console.log(notify);
            localNotificationService.showNotification(0, notify.title, notify.body, notify, options);
        }

        function onOpenNotification(notify) {
            // console.log(notify);
            // alert('open notification : ' + notify.body);
        }

    });
    return (
        <Provider store={persistStore.store}>
            <PersistGate loading={null} persistor={persistStore.persistor}>
                <Main/>
            </PersistGate>
            <FlashMessage position="top"/>
        </Provider>
    );

}
