import {PlayerO, PlayerX} from "./Constants";

// Get Random Integer In A Range min-max
export const getRandomInt=(min,max)=>{
  min=Math.ceil(min);
  max=Math.ceil(max);
  return Math.floor(Math.random()*(max-min+1))+min;
};
// Switching Player
export const switchPlayer=player=>{
  return player===PlayerX ?PlayerO:PlayerX;
};