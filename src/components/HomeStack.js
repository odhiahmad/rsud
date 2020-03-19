import {createStackNavigator} from 'react-navigation';
import Home from '../pages/Profile';


const HomeStack = createStackNavigator(screens,{
    Home:{
      screen: Home,
      navigationOptions: {
          title:'Home',
          headerStyle:{
              backgroundColor: 'rgb(212,211,25)',
          },
          headerTintColor:'white',
          headerTitleStyle:{
              fontSize:25,
              fontWeight:'bold'
          }
      }
    },
})

export default HomeStack
