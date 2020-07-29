import messaging from '@react-native-firebase/messaging'
import {Platform} from 'react-native';
import {not} from 'react-native-reanimated';

class FCMService {
    register = (onRegister,onNotification,onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister,onNotification,onOpenNotification)
    }

    registerAppWithFCM = async() => {
        await messaging().registerDeviceForRemoteMessages()
        await messaging().setAutoInitEnabled(true)
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission().then(enabled => {
            if(enabled){
                this.getToken(onRegister)
            }
            else{
                this.requestPermission(onRegister)
            }
        }).catch(error =>{
            console.log("[FCMService] Permission Rejected ", error)
        })
    }

    getToken = (onRegister) =>{
        messaging.getToken().then(fcmToken =>{
            if(fcmToken){
                onRegister(fcmToken)
            }else{
                console.log("[FCMService] user does not have device")
            }
        }).catch(error => {
            console.log("[FCMService] Permission Rejected ", error)
        })
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission().then(()=>{
            this.getToken(onRegister)
        }).catch(error=>{
            console.log("[FCMService] Permission Rejected ", error)
        })
    }

    deleteToken = () => {
        console.log("[FCMService] delete token")
        messaging().deleteToken().catch(error=>{
            console.log("[FCMService] Permission Rejected ", error)
        })
    }

    createNotificationListeners = (onRegister,onNotification,onOpenNotification) => {
        messaging().onNotificationOpenedApp(remoteMessage =>{
            console.log('[FCMService] onNotificationOpenedApp Notification caused app to open')

            if(remoteMessage){
                const notification = remoteMessage.notification
                onOpenNotification(notification)
            }
        })

        messaging().getInitialNotification().then(remoteMessage =>{
            console.log('[FCMService] getInitialNotification Notification caused app to open')

            if(remoteMessage){
                const notification = remoteMessage.notification
                onOpenNotification(notification)
            }

        })

        this.messageListener = messaging().onMessage(async remoteMessage =>{
            console.log('[FCMService] A new FCM message arrived: ', remoteMessage)

            if(remoteMessage){
                let notification = null

                if(Platform.OS === 'ios'){
                    notification = remoteMessage.data.notification
                }else{
                    notification = remoteMessage.notification
                }

                onNotification(notification)
            }
        })

        messaging().onTokenRefresh(fcmToken =>{
            console.log('[FCMService] New token refresh: ', fcmToken)
            onRegister(fcmToken)
        })
    }

    unRegister = () =>{
        this.messageListener
    }
}

export const fcmService = new FCMService()
