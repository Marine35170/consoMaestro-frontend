import React from "react";
import { Text, View } from "react-native";
import { Camera } from 'expo-camera/legacy';
import { useEffect, useState } from 'react';
export default function ScanScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
      (async () => {
        const result = await Camera.requestCameraPermissionsAsync();
        if(result){
   
           setHasPermission(result.status === 'granted');
   
         }
      })();
    }, []);
   
    if (!hasPermission) {
      return <View></View>;
    }
   
    return (
      <Camera></Camera>
    );
}

