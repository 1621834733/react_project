import {PRODCATE} from '../constant'
const initState=[];
export default function prodCate(preState=initState,action) {
  const {type,data}=action;
  switch (type) {
    case PRODCATE:
      return data;
    default:
      return preState;
  }
}