import { useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const useTrackLoctaion = () => {
   const [locationErrorMsg, setLocationErrorMsg] = useState("");
   // const [latLng, setLatLng]  = useState('')
   const [isFindingLocation, setIsFindingLocation] = useState(false);
   const { dispatch } = useContext(StoreContext);

   const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // setLatLng(`${latitude},${longitude}`)
      dispatch({
         type: ACTION_TYPES.SET_LAT_LNG,
         payload: { latLng: `${latitude},${longitude}` },
      });
      setLocationErrorMsg("");
      setIsFindingLocation(false);
   };

   const error = () => {
      setLocationErrorMsg("Unable to retrive your location");
      setIsFindingLocation(false);
   };

   const handleTruckLocaion = () => {
      setIsFindingLocation(true);

      if (!navigator.geolocation) {
         setLocationErrorMsg("Geolocation is not supported by your browser");
         setIsFindingLocation(false);
      } else {
         navigator.geolocation.getCurrentPosition(success, error);
      }
   };

   return {
      // latLng,
      handleTruckLocaion,
      locationErrorMsg,
      isFindingLocation,
   };
};

export default useTrackLoctaion;
