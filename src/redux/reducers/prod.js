import {PROD} from '../constant'
const initState=[];
export default function Prod(preState=initState,action) {
  const {type,data}=action;
  switch (type) {
    case PROD:
      return data;
    default:
      return preState;
  }
}