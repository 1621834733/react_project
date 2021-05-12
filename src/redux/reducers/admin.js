import {TITLE} from '../constant'
const initState='';
export default function Admin(preState=initState,action) {
  const {type,data}=action;
  switch (type) {
    case TITLE:
      return data;
    default:
      return preState;
  }
}